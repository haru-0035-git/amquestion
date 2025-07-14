"use client";

import { useEffect, useState, useMemo } from "react";
import { type Types } from "ably";
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

  const channel = ably.channels.get("anonymous-questions-pro");

  useEffect(() => {
    const subscribeToEvents = async () => {
      // ... (他の購読処理は変更なし) ...
      await channel.subscribe("new-question", (message: Types.Message) => {
        setQuestions((prev) => [message.data, ...prev]);
      });
      await channel.subscribe("like-question", (message: Types.Message) => {
        const { questionId } = message.data;
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId ? { ...q, likes: q.likes + 1 } : q
          )
        );
      });
      await channel.subscribe("mark-as-answered", (message: Types.Message) => {
        const { questionId } = message.data;
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === questionId ? { ...q, isAnswered: true } : q
          )
        );
      });
      await channel.subscribe("new-reaction", (message: Types.Message) => {
        const newReaction = message.data as Reaction;
        setFloatingReactions((prev) => [...prev, newReaction]);
        setTimeout(() => {
          setFloatingReactions((prev) =>
            prev.filter((r) => r.id !== newReaction.id)
          );
        }, 5000);
      });

      // ★ ピン留めイベントの購読を追加
      await channel.subscribe("toggle-pin", (message: Types.Message) => {
        const { questionId } = message.data;
        setQuestions((prev) => {
          const isCurrentlyPinned = prev.find(
            (q) => q.id === questionId
          )?.isPinned;
          // もしクリックされた質問が既にピン留めされていたら、全てのピンを外す
          if (isCurrentlyPinned) {
            return prev.map((q) => ({ ...q, isPinned: false }));
          }
          // そうでなければ、クリックされた質問をピン留めし、他は外す
          else {
            return prev.map((q) => ({ ...q, isPinned: q.id === questionId }));
          }
        });
      });
    };

    subscribeToEvents();
    return () => {
      channel.unsubscribe();
    };
  }, [channel]);

  // ... (sendQuestion, sendLike, sendReactionのロジックは変更なし) ...
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

  // ★ ピン留め・解除をトグルする関数を追加
  const togglePin = (questionId: string) => {
    channel.publish("toggle-pin", { questionId });
  };

  // ★ ソートロジックを更新
  const sortedQuestions = useMemo(() => {
    return [...questions].sort((a, b) => {
      // ピン留めされた質問を常に最優先
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      // 通常のソート順
      if (sortOrder === "most-liked") {
        if (b.likes !== a.likes) return b.likes - a.likes;
      }
      return b.timestamp - a.timestamp;
    });
  }, [questions, sortOrder]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <Header isAdmin={isAdmin} />
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
          onPin={togglePin} // 新しい関数を渡す
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
