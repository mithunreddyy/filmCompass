"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/shared/logo";
import { SearchBar } from "@/components/search/search-bar";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 6);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 px-2 sm:px-3"
      style={{ paddingTop: "max(0.375rem, env(safe-area-inset-top, 0px))" }}
    >
      <div
        className={cn(
          "fc-header mx-auto flex max-w-7xl items-center gap-2 px-2.5 py-2 sm:gap-3 sm:px-3.5 sm:py-2.5",
          scrolled && "fc-header-scrolled"
        )}
      >
        <Logo size="small" />
        <div className="min-w-0 flex-1">
          <SearchBar variant="compact" />
        </div>
      </div>
    </header>
  );
}
