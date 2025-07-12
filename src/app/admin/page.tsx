"use client";

import { AdminAuth } from "@/components/AdminAuth";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <main className="bg-gray-100 dark:bg-gray-900 min-h-screen">
      <AdminAuth>
        <AdminDashboard />
      </AdminAuth>
    </main>
  );
}
