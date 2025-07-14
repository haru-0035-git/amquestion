"use client";

import React, { useState } from "react";

// このコンポーネントは認証に成功すると、子要素(children)をそのまま表示します
export const AdminAuth = ({ children }: { children: React.ReactNode }) => {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    // このパスワードは後で環境変数などに移動するのが望ましいです
    if (password === "password123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("パスワードが違います。");
    }
  };

  // 認証が成功した場合、渡された子要素を表示します
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 認証が成功していない場合、ログインフォームを表示します
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xs p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          管理者ログイン
        </h1>
        <div className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-black dark:text-white"
            placeholder="パスワード"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            ログイン
          </button>
        </div>
      </div>
    </div>
  );
};
