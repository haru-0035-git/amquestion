"use client";

import type { Reaction } from "@/types";

// アニメーションのスタイルを定義
const animationStyle = `
  @keyframes float-up {
    0% {
      transform: translateY(0) scale(0.5);
      opacity: 1;
    }
    100% {
      transform: translateY(-80vh) scale(1.5);
      opacity: 0;
    }
  }
  .animate-float-up {
    animation: float-up 5s ease-out forwards;
  }
`;

type FloatingReactionsProps = {
  reactions: Reaction[];
};

export const FloatingReactions = ({ reactions }: FloatingReactionsProps) => {
  return (
    <>
      {/* スタイルをコンポーネント内に埋め込み */}
      <style>{animationStyle}</style>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-30">
        {reactions.map((reaction) => (
          <span
            key={reaction.id}
            className="absolute bottom-0 text-4xl animate-float-up"
            style={{
              left: `${reaction.x * 100}%`, // xプロパティに基づいて水平位置を設定
            }}
          >
            {reaction.emoji}
          </span>
        ))}
      </div>
    </>
  );
};
