import Ably from "ably";

// Ablyクライアントを初期化し、エクスポートします
export const ably = new Ably.Realtime({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
});

// 定数もここで管理します
export const MAX_CHARS = 140;
