"use client";

import { cn } from "@/lib/utils";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function RatingBadge({
  rating,
  size = "md",
  showLabel = false,
}: RatingBadgeProps) {
  const percentage = (rating / 10) * 100;
  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const color =
    rating >= 7
      ? "text-emerald-400"
      : rating >= 5
        ? "text-amber-400"
        : "text-red-400";

  const bgColor =
    rating >= 7
      ? "stroke-emerald-400"
      : rating >= 5
        ? "stroke-amber-400"
        : "stroke-red-400";

  const sizes = {
    sm: { container: "h-8 w-8", text: "text-[10px]", svg: 32 },
    md: { container: "h-11 w-11", text: "text-xs", svg: 44 },
    lg: { container: "h-14 w-14", text: "text-sm", svg: 56 },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-background/90 backdrop-blur-sm",
          s.container
        )}
      >
        <svg
          width={s.svg}
          height={s.svg}
          viewBox="0 0 40 40"
          className="absolute -rotate-90"
        >
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            strokeWidth="2.5"
            className="stroke-muted/30"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(bgColor, "transition-all duration-700")}
          />
        </svg>
        <span className={cn("font-bold", s.text, color)}>
          {rating.toFixed(1)}
        </span>
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">User Score</span>
      )}
    </div>
  );
}
