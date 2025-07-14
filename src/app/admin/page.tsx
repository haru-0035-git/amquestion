"use client";

import { AdminAuth } from "@/components/AdminAuth";
import { QuestionView } from "@/components/QuestionView"; // QuestionViewをインポート

// 管理者ページはAdminAuthでQuestionViewをラップします
export default function AdminPage() {
  return (
    <main className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <AdminAuth>
        {/* 認証後にこのコンポーネントが表示されます */}
        <QuestionView isAdmin={true} />
      </AdminAuth>
    </main>
  );
}
