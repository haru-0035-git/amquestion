import { Heart } from "lucide-react";
import type { Question } from "@/types";

type QuestionItemProps = {
  question: Question;
  onLike: (id: string) => void;
  isLiked: boolean;
};

export const QuestionItem = ({
  question,
  onLike,
  isLiked,
}: QuestionItemProps) => (
  <div className="w-full sm:w-64 h-64 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md flex flex-col justify-between transform transition-transform hover:scale-105 border border-gray-200 dark:border-gray-700">
    {/* 質問テキストを中央に配置するためのラッパー */}
    <div className="flex-grow flex items-center justify-center overflow-y-auto">
      <p className="text-gray-800 dark:text-gray-100 break-words text-center">
        {question.text}
      </p>
    </div>
    {/* いいねボタン */}
    <div className="flex justify-end items-center mt-2">
      <button
        onClick={() => onLike(question.id)}
        disabled={isLiked}
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
