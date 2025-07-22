import Ably from "ably";

// Ablyクライアントを初期化し、エクスポートします
// Presence機能を利用するために、ユニークなclientIdを生成して渡します
export const ably = new Ably.Realtime({
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  clientId: crypto.randomUUID(),
});

// 定数もここで管理します
export const MAX_CHARS = 140;
