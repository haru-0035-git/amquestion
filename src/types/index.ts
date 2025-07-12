// 質問のデータ構造
export type Question = {
  id: string;
  text: string;
  likes: number;
  timestamp: number;
  isAnswered: boolean; // 回答済みかどうかのフラグ
  isPinned: boolean; // ピックアップされているかのフラグ
};

// フローティングリアクションのデータ構造
export type Reaction = {
  id: string;
  emoji: string;
  x: number;
};
