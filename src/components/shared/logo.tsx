import Link from "next/link";
import { Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const iconSizes = { small: 15, default: 18, large: 22 };
  const textSizes = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2 no-underline">
      <span
        className={cn(
          "relative flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-violet/25 to-brand-mint/10 ring-1 ring-brand-violet/35 shadow-[0_0_20px_rgba(139,124,246,0.12)] transition-all group-hover:ring-brand-violet/55 group-hover:shadow-[0_0_24px_rgba(139,124,246,0.2)]",
          size === "small" && "h-7 w-7",
          size === "default" && "h-9 w-9",
          size === "large" && "h-10 w-10"
        )}
      >
        <Compass
          size={iconSizes[size]}
          className="text-brand-violet transition-transform duration-500 group-hover:rotate-45"
          strokeWidth={2}
        />
      </span>
      <span className="hidden sm:block">
        <span
          className={cn(
            textSizes[size],
            "font-bold tracking-tight text-foreground transition-colors group-hover:text-brand-violet"
          )}
        >
          Film
        </span>
        <span
          className={cn(
            textSizes[size],
            "font-bold tracking-tight text-brand-violet"
          )}
        >
          Compass
        </span>
      </span>
    </Link>
  );
}
