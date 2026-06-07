"use client";

import { Logo } from "@/components/shared/logo";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 sm:py-4 md:px-8">
        <div className="pointer-events-auto rounded-xl px-2.5 py-1 liquid-glass-subtle">
          <Logo size="small" />
        </div>
      </div>
    </header>
  );
}
