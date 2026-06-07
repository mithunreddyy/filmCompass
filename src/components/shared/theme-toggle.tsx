"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "dock" | "header";
}

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = (theme ?? resolvedTheme) === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex shrink-0 items-center justify-center transition-all duration-200",
        variant === "default" && "h-9 w-9 rounded-lg border border-border fc-panel text-muted-foreground hover:text-brand-violet",
        variant === "header" && "h-8 w-8 rounded-lg text-muted-foreground hover:bg-surface-raised hover:text-brand-violet",
        variant === "dock" &&
          "group h-[25px] w-[25px] rounded-[10px] text-muted-foreground hover:bg-foreground/5 hover:text-foreground sm:h-[30px] sm:w-[30px] sm:rounded-xl lg:h-[35px] lg:w-[35px]"
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-[14px] w-[14px] sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" strokeWidth={1.25} />
      ) : (
        <Moon className="h-[14px] w-[14px] sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]" strokeWidth={1.25} />
      )}

      {variant === "dock" && (
        <span className="pointer-events-none absolute -top-12 left-1/2 z-[110] -translate-x-1/2 scale-90 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-[10px] font-medium tracking-wide text-background opacity-0 shadow-2xl transition-all group-hover:scale-100 group-hover:md:opacity-100 sm:text-[11px]">
          Theme
        </span>
      )}
    </button>
  );
}
