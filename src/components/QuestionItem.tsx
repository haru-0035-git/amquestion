import { Heart, CheckCircle2, Pin, PinOff } from "lucide-react";
import type { Question } from "@/types";

type QuestionItemProps = {
  question: Question;
  onLike: (id: string) => void;
  isLiked: boolean;
  isAdmin: boolean;
  onMarkAsAnswered: (id: string) => void;
  onPin: (id: string) => void; // ピン留め用の関数を受け取る
};

export const QuestionItem = ({
  question,
  onLike,
  isLiked,
  isAdmin,
  onMarkAsAnswered,
  onPin,
}: QuestionItemProps) => {
  return (
    // ピン留めされた質問は黄色のボーダーでハイライト
    <div
      className={`relative w-full sm:w-64 h-64 p-4 rounded-lg shadow-md flex flex-col justify-between transform transition-all hover:scale-105 border-2 ${
        question.isPinned
          ? "border-yellow-400 dark:border-yellow-500"
          : "border-gray-200 dark:border-gray-700"
      } ${
        question.isAnswered && !isAdmin
          ? "bg-gray-200 dark:bg-gray-800/50"
          : "bg-white dark:bg-gray-800"
      }`}
    >
      {question.isAnswered && !isAdmin && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-green-500/80 text-white text-xs font-bold px-2 py-1 rounded-full">
          <CheckCircle2 size={14} />
          <span>回答済み</span>
        </div>
      )}

      <div className="flex-grow flex items-center justify-center overflow-y-auto">
        <p className="text-gray-800 dark:text-gray-200 break-words text-center">
          {question.text}
        </p>
      </div>

      <div className="flex justify-end items-center mt-2">
        {isAdmin && (
          <>
            {/* ピン留め・解除ボタン */}
            <button
              onClick={() => onPin(question.id)}
              className="p-2 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-gray-700 rounded-full mr-2"
              aria-label={question.isPinned ? "ピン留めを外す" : "ピン留めする"}
            >
              {question.isPinned ? <PinOff size={22} /> : <Pin size={22} />}
            </button>
            {/* 回答済みボタン */}
            <button
              onClick={() => onMarkAsAnswered(question.id)}
              disabled={question.isAnswered}
              className="p-2 text-green-500 hover:bg-green-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed mr-2"
              aria-label="回答済みにする"
            >
              <CheckCircle2 size={22} />
            </button>
          </>
        )}
        <button
          onClick={() => onLike(question.id)}
          disabled={isLiked || question.isAnswered}
          className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 transition-colors group disabled:cursor-not-allowed"
        >
          <Heart
            size={22}
            className={`group-hover:text-pink-500 group-hover:fill-pink-500 ${
              isLiked ? "text-pink-500 fill-pink-500" : ""
            }`}
          />
          <span className="font-semibold text-md">{question.likes}</span>
        </button>
      </div>
    </div>
  );
};
