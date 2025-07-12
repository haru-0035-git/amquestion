'use client';

import { useEffect, useState } from 'react';
import { type Types } from 'ably';
import { ably } from '@/lib/ably';
import type { Question } from '@/types';
// Trash2アイコンは不要になったため削除
// import { Trash2 } from 'lucide-react';

export const AdminDashboard = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const channel = ably.channels.get('anonymous-questions-pro');

  useEffect(() => {
    const subscribeToEvents = async () => {
      // 新しい質問
      await channel.subscribe('new-question', (message: Types.Message) => {
        setQuestions((prev) => [message.data, ...prev]);
      });
      // いいね
      await channel.subscribe('like-question', (message: Types.Message) => {
        const { questionId } = message.data;
        setQuestions((prev) =>
          prev.map((q) => (q.id === questionId ? { ...q, likes: q.likes + 1 } : q))
        );
      });
      // ★ 削除イベントの購読は不要なため削除
    };

    subscribeToEvents();
    return () => { channel.unsubscribe(); };
  }, [channel]);

  // ★ 質問を削除する関数は不要なため削除
  // const deleteQuestion = ...

  // 新しい順にソート
  const sortedQuestions = [...questions].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">管理者ダッシュボード</h1>
      <div className="space-y-4">
        {sortedQuestions.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">まだ質問はありません。</p>
        ) : (
          sortedQuestions.map((q) => (
            <div key={q.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
              <div>
                <p className="text-gray-800 dark:text-gray-200">{q.text}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">いいね: {q.likes}</p>
              </div>
              {/* ★ 削除ボタンを削除 */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
