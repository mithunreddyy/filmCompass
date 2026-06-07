"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Globe,
  Search,
  LayoutGrid,
  Bot,
  Sparkles,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

const DOCK_ITEMS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/discover",
    label: "Discover",
    icon: Compass,
    match: (p: string) => p.startsWith("/discover") || p.startsWith("/genre"),
  },
  {
    href: "/explore",
    label: "Explore",
    icon: Globe,
    match: (p: string) => p.startsWith("/explore"),
  },
  {
    href: "/search",
    label: "Search",
    icon: Search,
    match: (p: string) => p.startsWith("/search"),
  },
  {
    href: "/collections",
    label: "Collections",
    icon: LayoutGrid,
    match: (p: string) => p.startsWith("/collections"),
  },
  {
    href: "/assistant",
    label: "Assistant",
    icon: Bot,
    match: (p: string) => p.startsWith("/assistant"),
  },
  {
    href: "/discover?sortBy=vote_average.desc&ratingMin=7.5",
    label: "Gems",
    icon: Sparkles,
    match: () => false,
  },
] as const;

export function NavDock() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pointer-events-none px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <nav
        className="pointer-events-auto flex max-w-full items-center gap-0.5 overflow-x-auto rounded-2xl px-1.5 py-1 liquid-glass-dock no-scrollbar snap-x snap-mandatory"
        aria-label="Main navigation"
      >
        {DOCK_ITEMS.map((item) => {
          const isActive = item.match(pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              title={item.label}
              className={cn(
                "relative flex h-8 w-8 shrink-0 snap-center items-center justify-center rounded-xl transition-colors sm:h-9 sm:w-9",
                isActive
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <item.icon
                className="h-[16px] w-[16px] sm:h-[17px] sm:w-[17px]"
                strokeWidth={isActive ? 2 : 1.6}
              />
              {isActive && (
                <span className="absolute bottom-0.5 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-foreground/70" />
              )}
            </Link>
          );
        })}

        <div className="mx-0.5 h-5 w-px shrink-0 bg-foreground/10 self-center" />

        <ThemeToggle variant="dock" />
      </nav>
    </div>
  );
}
