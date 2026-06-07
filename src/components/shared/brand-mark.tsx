import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * FilmCompass mark — compass needle + aperture ring (cinema + discovery).
 * Works from 16px favicon to header logo.
 */
export function BrandMark({ size = 32, className }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" fill="#7C6DF0" />
      <circle
        cx="16"
        cy="16"
        r="10.5"
        stroke="white"
        strokeOpacity="0.9"
        strokeWidth="1.25"
      />
      {/* aperture ticks — subtle cinema cue */}
      <path
        d="M16 5.5v2M16 24.5v2M5.5 16h2M24.5 16h2"
        stroke="white"
        strokeOpacity="0.55"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* compass needle */}
      <path d="M16 7.5L19.25 16L16 24.5L12.75 16L16 7.5Z" fill="#0D9668" />
      <path d="M16 7.5L19.25 16L16 16L12.75 16L16 7.5Z" fill="white" />
      <circle cx="16" cy="16" r="2" fill="white" />
    </svg>
  );
}
