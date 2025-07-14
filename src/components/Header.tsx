import { ThemeToggle } from "./ThemeToggle";

type HeaderProps = {
  isAdmin?: boolean;
};

export const Header = ({ isAdmin = false }: HeaderProps) => (
  <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="w-10"></div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            amquestion
          </h1>
          {/* isAdminがtrueの時だけバッジを表示 */}
          {isAdmin && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
              Admin
            </span>
          )}
        </div>
        <div className="w-10 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
);
