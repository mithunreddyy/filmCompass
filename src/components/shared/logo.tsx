import Link from "next/link";
import { Compass } from "lucide-react";

export function Logo({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const iconSizes = { small: 18, default: 24, large: 32 };
  const textSizes = {
    small: "text-base",
    default: "text-lg",
    large: "text-2xl",
  };

  return (
    <Link href="/" className="group flex items-center gap-2 no-underline">
      <Compass
        size={iconSizes[size]}
        className="text-foreground/70 transition-transform duration-500 group-hover:rotate-45"
        strokeWidth={1.5}
      />
      <span
        className={`${textSizes[size]} font-medium tracking-tight text-foreground`}
      >
        FilmCompass
      </span>
    </Link>
  );
}
