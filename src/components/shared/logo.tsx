import Link from "next/link";
import { BrandMark } from "@/components/shared/brand-mark";
import { cn } from "@/lib/utils";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const markSizes = { small: 28, default: 36, large: 40 };
  const textSizes = {
    small: "text-sm",
    default: "text-base",
    large: "text-lg",
  };

  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2 no-underline">
      <span
        className={cn(
          "relative flex items-center justify-center rounded-xl transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(139,124,246,0.28)] group-hover:scale-[1.03]",
          size === "small" && "h-7 w-7",
          size === "default" && "h-9 w-9",
          size === "large" && "h-10 w-10"
        )}
      >
        <BrandMark
          size={markSizes[size]}
          className="rounded-xl shadow-[0_0_20px_rgba(139,124,246,0.15)]"
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
