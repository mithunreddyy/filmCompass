"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "dock";
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground",
        variant === "default" &&
          "h-9 w-9 rounded-full border border-border/40 liquid-glass-subtle",
        variant === "dock" && "h-8 w-8 rounded-xl sm:h-9 sm:w-9"
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[16px] w-[16px] sm:h-[17px] sm:w-[17px]" strokeWidth={1.6} />
      ) : (
        <Moon className="h-[16px] w-[16px] sm:h-[17px] sm:w-[17px]" strokeWidth={1.6} />
      )}
    </button>
  );
}
