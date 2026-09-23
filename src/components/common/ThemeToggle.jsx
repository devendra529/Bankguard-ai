"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/common/ThemeProvider";
import { cn } from "@/lib/utils/cn";

export default function ThemeToggle({ className, onDark = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg transition-colors",
        onDark
          ? "text-white/80 hover:bg-white/10 hover:text-white"
          : "text-muted hover:bg-surface-muted hover:text-foreground",
        className
      )}
    >
      {isDark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}
