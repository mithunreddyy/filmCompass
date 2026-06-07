import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <Compass size={64} className="mx-auto mb-6 text-amber-500/50 animate-float" />
        <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground mb-3">
          404
        </h1>
        <h2 className="font-heading text-xl font-semibold text-foreground mb-4">
          Lost in Cinema
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Maybe the movie was
          pulled from theaters, or perhaps you took a wrong turn.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
        >
          <Compass size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
