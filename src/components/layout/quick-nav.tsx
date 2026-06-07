"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Sparkles, Globe, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/discover?language=te", label: "Discover", icon: Compass, match: (p: string) => p.startsWith("/discover") },
  { href: "/gems", label: "Gems", icon: Sparkles, match: (p: string) => p.startsWith("/gems") },
  { href: "/explore", label: "Explore", icon: Globe, match: (p: string) => p.startsWith("/explore") },
  { href: "/assistant", label: "Assistant", icon: Bot, match: (p: string) => p.startsWith("/assistant") },
] as const;

interface QuickNavProps {
  className?: string;
}

export function QuickNav({ className }: QuickNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Quick navigation" className={cn("fc-quick-nav", className)}>
      {LINKS.map((link) => {
        const isActive = link.match(pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn("fc-chip gap-1.5 whitespace-nowrap", isActive && "fc-chip-active")}
          >
            <link.icon className="h-3.5 w-3.5" strokeWidth={2} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
