import { ArrowUpDown } from "lucide-react";

type SortControlProps = {
  sortOrder: string;
  onToggle: () => void;
};

export const SortControl = ({ sortOrder, onToggle }: SortControlProps) => (
  <div className="absolute top-4 right-4 z-20">
    <button
      onClick={onToggle}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <ArrowUpDown size={16} />
      {sortOrder === "newest" ? "新着順" : "いいね順"}
    </button>
  </div>
);
