"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { DOCK_ITEMS } from "@/components/layout/nav-config";
import { cn } from "@/lib/utils";

export function NavDock() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 28, stiffness: 380, delay: 0.4 }}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6 lg:bottom-8 fc-dock-safe-area"
      aria-label="Main navigation"
    >
      <div className="fc-dock pointer-events-auto inline-flex max-w-[calc(100vw-2rem)] items-center gap-2 px-2 sm:gap-2 sm:px-2 lg:h-12 lg:gap-2 lg:px-3">
        {DOCK_ITEMS.map((item) => {
          const isActive = item.match(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-[10px] transition-all duration-200 sm:h-[30px] sm:w-[30px] sm:rounded-xl lg:h-[35px] lg:w-[35px]",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <Icon
                className="h-[14px] w-[14px] sm:h-4 sm:w-4 lg:h-[18px] lg:w-[18px]"
                strokeWidth={1.25}
              />

              {isActive && (
                <motion.span
                  layoutId="activeDockDot"
                  className="absolute -bottom-px h-[3px] w-[3px] rounded-full bg-foreground/40 sm:-bottom-0.5 sm:h-[3.5px] sm:w-[3.5px] lg:-bottom-0.5 lg:h-1 lg:w-1"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  aria-hidden
                />
              )}

              <span className="pointer-events-none absolute -top-12 left-1/2 z-[110] -translate-x-1/2 scale-90 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-[10px] font-medium tracking-wide text-background opacity-0 shadow-2xl transition-all group-hover:scale-100 group-hover:md:opacity-100 sm:text-[11px]">
                {item.label}
              </span>
            </Link>
          );
        })}

        <div
          className="mx-1 h-4 w-px shrink-0 bg-foreground/10 sm:mx-2 sm:h-5"
          aria-hidden
        />

        <ThemeToggle variant="dock" />
      </div>
    </motion.nav>
  );
}
