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
        "inline-flex items-center rounded border font-semibold transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[10px] sm:text-xs" : "px-3 py-1 text-xs sm:text-sm",
        isActive
          ? "border-brand-violet bg-brand-violet/10 text-brand-violet"
          : "border-border bg-surface text-muted-foreground hover:border-brand-violet/40 hover:text-brand-violet"
      )}
    >
      {name}
    </Link>
  );
}
