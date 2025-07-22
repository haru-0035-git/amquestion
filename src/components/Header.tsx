import { ThemeToggle } from "./ThemeToggle";
import { Users, UserCog, User } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";

// Headerが受け取るpropsの型定義を修正
type HeaderProps = {
  isAdmin?: boolean;
  adminCount?: number;
  participantCount?: number;
};

export const Header = ({
  isAdmin = false,
  adminCount = 0,
  participantCount = 0,
}: HeaderProps) => {
  const totalCount = adminCount + participantCount;

  return (
    <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側に管理者用の参加者数を表示 */}
          <div className="w-24 flex justify-start">
            {isAdmin && (
              <Popover.Root>
                <Popover.Trigger asChild>
                  <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-md">
                    <Users size={18} />
                    <span className="font-bold">{totalCount}</span>
                  </button>
                </Popover.Trigger>
                <Popover.Portal>
                  <Popover.Content
                    sideOffset={5}
                    align="start"
                    className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 p-3"
                  >
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">
                        参加者の内訳
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <UserCog size={16} />
                          <span>管理者</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {adminCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <User size={16} />
                          <span>参加者</span>
                        </div>
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                          {participantCount}
                        </span>
                      </div>
                    </div>
                  </Popover.Content>
                </Popover.Portal>
              </Popover.Root>
            )}
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              amquestion
            </h1>
            {isAdmin && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                Admin
              </span>
            )}
          </div>

          <div className="w-24 flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
