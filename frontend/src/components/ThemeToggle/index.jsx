import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "cursor-pointer relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isDark
          ? "bg-slate-700 hover:bg-slate-600"
          : "bg-blue-500 hover:bg-blue-600"
      )}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      <span
        className={cn(
          "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 transform",
          isDark ? "translate-x-0.5" : "translate-x-6"
        )}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-slate-700 transition-transform duration-300" />
        ) : (
          <Sun className="h-3 w-3 text-yellow-600 transition-transform duration-300" />
        )}
      </span>

      <span className="absolute left-1.5 top-1/2 -translate-y-1/2">
        <Moon className={cn(
          "h-2.5 w-2.5 transition-opacity duration-300",
          isDark ? "opacity-100 text-slate-400" : "opacity-0"
        )} />
      </span>
      <span className="absolute right-1.5 top-1/2 -translate-y-1/2">
        <Sun className={cn(
          "h-2.5 w-2.5 transition-opacity duration-300",
          isDark ? "opacity-0" : "opacity-100 text-yellow-200"
        )} />
      </span>
    </button>
  );
}
