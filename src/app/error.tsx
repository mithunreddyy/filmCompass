"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="fc-page flex min-h-[55vh] items-center justify-center">
      <div className="fc-glass flex min-h-[240px] w-full max-w-lg flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[280px]">
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-violet/20 to-brand-mint/10 ring-1 ring-brand-violet/25">
          <div className="absolute inset-0 rounded-2xl fc-shimmer opacity-40" aria-hidden />
          <AlertTriangle className="relative h-8 w-8 text-brand-violet" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Something went wrong
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          We hit a snag loading this page. It might be temporary — try again in a moment.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button type="button" onClick={reset} className="fc-btn-primary text-sm">
            Try again
          </button>
          <Link href="/" className="fc-btn-ghost text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
