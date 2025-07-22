"use client";

import { useEffect, useState, useMemo } from "react";
import { type Types } from "ably"; // Ablyの型を正しくインポート
import type { Question, Reaction } from "@/types";
import { ably } from "@/lib/ably";
import { Header } from "@/components/Header";
import { QuestionForm } from "@/components/QuestionForm";
import { QuestionList } from "@/components/QuestionList";
import { SortControl } from "@/components/SortControl";
import { FloatingReactions } from "@/components/FloatingReactions";

type QuestionViewProps = {
  isAdmin?: boolean;
};

export const QuestionView = ({ isAdmin = false }: QuestionViewProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "most-liked">("newest");
  const [likedQuestionIds, setLikedQuestionIds] = useState<string[]>([]);
  const [likeTimestamps, setLikeTimestamps] = useState<number[]>([]);
  const [rateLimitMessage, setRateLimitMessage] = useState<string>("");
  const [floatingReactions, setFloatingReactions] = useState<Reaction[]>([]);
  const [reactionTimestamps, setReactionTimestamps] = useState<number[]>([]);

  // 型を Types.PresenceMessage に修正
  const [presenceMembers, setPresenceMembers] = useState<
    Types.PresenceMessage[]
  >([]);

  const channel = ably.channels.get("anonymous-questions-pro");

  useEffect(() => {
    // 接続メンバーのリストを更新する関数
    const updatePresenceMembers = async () => {
      const members = await channel.presence.get();
      setPresenceMembers(members);
    };

    // 自身が接続したことを、管理者情報(isAdmin)と共に通知
    channel.presence.enter({ isAdmin });
    updatePresenceMembers();

    // 他のユーザーの入退室や情報の更新を監視
    channel.presence.subscribe(
      ["enter", "leave", "update"],
      updatePresenceMembers
    );

    return () => {
      channel.presence.unsubscribe();
      channel.presence.leave();
    };
  }, [channel, isAdmin]);

  useEffect(() => {
    // messageの型を Types.Message に修正
    const onNewQuestion = (message: Types.Message) => {
      setQuestions((prev) => [message.data, ...prev]);
    };
    const onLikeQuestion = (message: Types.Message) => {
      const { questionId } = message.data;
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, likes: q.likes + 1 } : q
        )
      );
    };
    const onMarkAsAnswered = (message: Types.Message) => {
      const { questionId } = message.data;
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, isAnswered: true } : q))
      );
    };
    const onTogglePin = (message: Types.Message) => {
      const { questionId } = message.data;
      setQuestions((prev) => {
        const isCurrentlyPinned = prev.find(
          (q) => q.id === questionId
        )?.isPinned;
        if (isCurrentlyPinned) {
          return prev.map((q) => ({ ...q, isPinned: false }));
        } else {
          return prev.map((q) => ({ ...q, isPinned: q.id === questionId }));
        }
      });
    };
    const onNewReaction = (message: Types.Message) => {
      const newReaction = message.data as Reaction;
      setFloatingReactions((prev) => [...prev, newReaction]);
      setTimeout(() => {
        setFloatingReactions((prev) =>
          prev.filter((r) => r.id !== newReaction.id)
        );
      }, 5000);
    };

    channel.subscribe("new-question", onNewQuestion);
    channel.subscribe("like-question", onLikeQuestion);
    channel.subscribe("mark-as-answered", onMarkAsAnswered);
    channel.subscribe("toggle-pin", onTogglePin);
    channel.subscribe("new-reaction", onNewReaction);

    return () => {
      channel.unsubscribe("new-question", onNewQuestion);
      channel.unsubscribe("like-question", onLikeQuestion);
      channel.unsubscribe("mark-as-answered", onMarkAsAnswered);
      channel.unsubscribe("toggle-pin", onTogglePin);
      channel.unsubscribe("new-reaction", onNewReaction);
    };
  }, [channel]);

  const sendQuestion = (text: string) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      text: text,
      likes: 0,
      timestamp: Date.now(),
      isAnswered: false,
      isPinned: false,
    };
    channel.publish("new-question", newQuestion);
  };
  const sendLike = (questionId: string) => {
    if (likedQuestionIds.includes(questionId)) return;
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentLikes = likeTimestamps.filter((ts) => ts > oneMinuteAgo);
    if (recentLikes.length >= 5) {
      setRateLimitMessage("いいねは1分間に5回までです。");
      setTimeout(() => setRateLimitMessage(""), 5000);
      return;
    }
    channel.publish("like-question", { questionId });
    setLikedQuestionIds((prev) => [...prev, questionId]);
    setLikeTimestamps((prev) => [
      ...prev.filter((ts) => ts > oneMinuteAgo),
      now,
    ]);
  };
  const sendReaction = (emoji: string) => {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentReactions = reactionTimestamps.filter(
      (ts) => ts > oneMinuteAgo
    );
    if (recentReactions.length >= 10) {
      setRateLimitMessage("リアクションは少し時間を置いてからお願いします。");
      setTimeout(() => setRateLimitMessage(""), 5000);
      return;
    }
    const newReaction: Reaction = {
      id: crypto.randomUUID(),
      emoji: emoji,
      x: Math.random(),
    };
    channel.publish("new-reaction", newReaction);
    setReactionTimestamps([...recentReactions, now]);
  };
  const markAsAnswered = (questionId: string) => {
    channel.publish("mark-as-answered", { questionId });
  };
  const togglePin = (questionId: string) => {
    channel.publish("toggle-pin", { questionId });
  };

  // 参加者リストから管理者と参加者の数を計算
  const { adminCount, participantCount } = useMemo(() => {
    const admins = presenceMembers.filter((member) => member.data?.isAdmin);
    const participants = presenceMembers.filter(
      (member) => !member.data?.isAdmin
    );
    return { adminCount: admins.length, participantCount: participants.length };
  }, [presenceMembers]);

  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      if (sortOrder === "most-liked") {
        if (b.likes !== a.likes) return b.likes - a.likes;
      }
      return b.timestamp - a.timestamp;
    });
  }, [questions, sortOrder]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <Header
        isAdmin={isAdmin}
        adminCount={adminCount}
        participantCount={participantCount}
      />
      <main className="flex-grow relative flex flex-col">
        <FloatingReactions reactions={floatingReactions} />
        <SortControl
          sortOrder={sortOrder}
          onToggle={() =>
            setSortOrder(sortOrder === "newest" ? "most-liked" : "newest")
          }
        />
        <QuestionList
          questions={sortedQuestions}
          onLike={sendLike}
          likedQuestionIds={likedQuestionIds}
          isAdmin={isAdmin}
          onMarkAsAnswered={markAsAnswered}
          onPin={togglePin}
        />

        {rateLimitMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-20">
            {rateLimitMessage}
          </div>
        )}
      </main>
      {!isAdmin && (
        <QuestionForm
          onSendQuestion={sendQuestion}
          onSendReaction={sendReaction}
        />
      )}
    </div>
  );
};
