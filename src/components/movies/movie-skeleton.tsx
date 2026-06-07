export function MovieCardSkeleton() {
  return (
    <div className="group relative flex-shrink-0 w-[180px] md:w-[200px]">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-muted/30 animate-pulse" />
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted/30 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-muted/20 animate-pulse" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MovieCarouselSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-[70vh] w-full animate-pulse bg-muted/20">
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
        <div className="h-10 w-2/3 rounded bg-muted/30 mb-4" />
        <div className="h-5 w-1/2 rounded bg-muted/20 mb-3" />
        <div className="h-4 w-1/3 rounded bg-muted/20" />
      </div>
    </div>
  );
}
