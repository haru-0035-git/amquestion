"use client";

import React, { useState } from "react";
import { MAX_CHARS } from "@/lib/ably";

const EMOJIS = ["👍", "❤️", "🎉", "😂", "😮"];

type QuestionFormProps = {
  onSendQuestion: (text: string) => void;
  onSendReaction: (emoji: string) => void;
};

export const QuestionForm = ({
  onSendQuestion,
  onSendReaction,
}: QuestionFormProps) => {
  const [messageText, setMessageText] = useState("");

  const handleSend = () => {
    onSendQuestion(messageText);
    setMessageText("");
  };

  return (
    <footer className="w-full p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-t-sm z-10">
      <div className="max-w-2xl mx-auto">
        {/* リアクションボタン */}
        <div className="flex justify-center gap-4 mb-4">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSendReaction(emoji)}
              className="p-2 text-3xl rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
        {/* 質問入力欄 */}
        <div className="space-y-2">
          <textarea
            value={messageText}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setMessageText(e.target.value)
            }
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="質問を入力してください..."
            rows={2}
          />
          <div className="flex justify-between items-center">
            <p
              className={`text-sm ${
                messageText.length > MAX_CHARS
                  ? "text-red-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {messageText.length} / {MAX_CHARS}
            </p>
            <button
              onClick={handleSend}
              disabled={
                messageText.trim().length === 0 ||
                messageText.length > MAX_CHARS
              }
              className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-500 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
            >
              送信
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
