import { cn } from "@/lib/utils";

export type RatingTier = "great" | "good" | "low";

export function getRatingTier(rating: number): RatingTier {
  if (rating >= 7) return "great";
  if (rating >= 5) return "good";
  return "low";
}

const tierStyles: Record<RatingTier, string> = {
  great: "bg-brand-mint/15 text-brand-mint border-brand-mint/30",
  good: "bg-brand-orange/15 text-brand-orange border-brand-orange/30",
  low: "bg-brand-red/15 text-brand-red border-brand-red/30",
};

interface RatingPillProps {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

export function RatingPill({ rating, size = "sm", className }: RatingPillProps) {
  const tier = getRatingTier(rating);

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold tabular-nums border backdrop-blur-sm shadow-sm",
        tierStyles[tier],
        size === "sm" && "min-w-[2rem] px-1.5 py-0.5 text-[11px]",
        size === "md" && "min-w-[2.5rem] px-2 py-1 text-xs",
        className
      )}
    >
      {rating.toFixed(1)}
    </span>
  );
}
