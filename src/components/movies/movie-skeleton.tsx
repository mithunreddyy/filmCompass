export function MovieCardSkeleton() {
  return (
    <div className="w-full max-w-[155px] shrink-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted/30 animate-pulse" />
      <div className="mt-2 space-y-1.5">
        <div className="h-3.5 w-4/5 rounded bg-muted/30 animate-pulse" />
        <div className="h-3 w-1/2 rounded bg-muted/20 animate-pulse" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 sm:gap-x-2.5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MovieCarouselSkeleton({ count = 7 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-hidden sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[110px] shrink-0 sm:w-[140px] md:w-[155px]">
          <MovieCardSkeleton />
        </div>
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
