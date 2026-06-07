"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

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
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle
          size={48}
          className="mx-auto mb-6 text-amber-500/50"
        />
        <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
          Something went wrong
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We encountered an error while loading this page. This might be a
          temporary issue.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-amber-400"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
