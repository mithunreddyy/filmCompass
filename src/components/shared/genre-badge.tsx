import Link from "next/link";
import { cn } from "@/lib/utils";

interface GenreBadgeProps {
  name: string;
  slug: string;
  isActive?: boolean;
  size?: "sm" | "md";
}

export function GenreBadge({
  name,
  slug,
  isActive = false,
  size = "sm",
}: GenreBadgeProps) {
  return (
    <Link
      href={`/genre/${slug}`}
      className={cn(
        "inline-flex items-center rounded-full border font-medium transition-all duration-200",
        size === "sm"
          ? "px-3 py-1 text-xs"
          : "px-4 py-1.5 text-sm",
        isActive
          ? "border-amber-500 bg-amber-500/10 text-amber-500"
          : "border-border/50 bg-card/50 text-muted-foreground hover:border-amber-500/50 hover:text-amber-500 hover:bg-amber-500/5"
      )}
    >
      {name}
    </Link>
  );
}
