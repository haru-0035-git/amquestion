import { ThemeToggle } from "./ThemeToggle";

export const Header = () => (
  <header className="w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm z-10">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="w-10"></div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          amquestion
        </h1>
        <div className="w-10 flex justify-end">
          <ThemeToggle />
        </div>
      </div>
    </div>
  </header>
);
