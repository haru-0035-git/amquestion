// 質問のデータ構造
export type Question = {
  id: string;
  text: string;
  likes: number;
  timestamp: number;
};

// フローティングリアクションのデータ構造
export type Reaction = {
  id: string;
  emoji: string;
  x: number; // 画面のどの水平位置からスタートするか (0 to 1)
};
