import type { Question } from "@/types";
import { QuestionItem } from "./QuestionItem";

type QuestionListProps = {
  questions: Question[];
  onLike: (id: string) => void;
  likedQuestionIds: string[];
};

export const QuestionList = ({
  questions,
  onLike,
  likedQuestionIds,
}: QuestionListProps) => (
  <div className="flex-grow w-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
    {questions.length === 0 ? (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          まだ質問はありません。
        </p>
      </div>
    ) : (
      <div className="flex flex-wrap justify-center gap-6">
        {questions.map((q) => (
          <QuestionItem
            key={q.id}
            question={q}
            onLike={onLike}
            isLiked={likedQuestionIds.includes(q.id)}
          />
        ))}
      </div>
    )}
  </div>
);
