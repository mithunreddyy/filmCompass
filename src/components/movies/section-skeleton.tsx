import { MovieCarouselSkeleton } from "./movie-skeleton";

interface SectionSkeletonProps {
  title?: string;
}

export function SectionSkeleton({ title }: SectionSkeletonProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="fc-section-accent" />
        <div className="h-4 w-32 overflow-hidden rounded-md bg-muted/30">
          <div className="h-full w-full fc-shimmer" />
        </div>
        <span className="h-px flex-1 bg-gradient-to-r from-border via-border/50 to-transparent" />
      </div>
      {title && <span className="sr-only">Loading {title}</span>}
      <MovieCarouselSkeleton count={6} />
    </section>
  );
}

export function HeroSkeletonBlock() {
  return (
    <section className="border-b border-border/60">
      <div className="fc-content space-y-4 py-6 sm:py-8">
        <div className="h-3 w-28 overflow-hidden rounded bg-muted/30">
          <div className="h-full w-full fc-shimmer" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-24 overflow-hidden rounded-full bg-muted/25">
              <div className="h-full w-full fc-shimmer" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <div className="mx-auto aspect-[2/3] w-[130px] overflow-hidden rounded-xl bg-muted/30 sm:mx-0 sm:w-[155px]">
            <div className="h-full w-full fc-shimmer" />
          </div>
          <div className="flex-1 space-y-3 pt-2">
            <div className="h-4 w-2/3 max-w-md overflow-hidden rounded bg-muted/30">
              <div className="h-full w-full fc-shimmer" />
            </div>
            <div className="h-8 w-full max-w-lg overflow-hidden rounded bg-muted/25">
              <div className="h-full w-full fc-shimmer" />
            </div>
            <div className="h-4 w-1/3 overflow-hidden rounded bg-muted/20">
              <div className="h-full w-full fc-shimmer" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-3 w-full max-w-xl overflow-hidden rounded bg-muted/20">
                <div className="h-full w-full fc-shimmer" />
              </div>
              <div className="h-3 w-5/6 max-w-lg overflow-hidden rounded bg-muted/20">
                <div className="h-full w-full fc-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="flex flex-col">
      <HeroSkeletonBlock />
      <div className="fc-content space-y-6 py-4 sm:space-y-7 sm:py-5">
        <SectionSkeleton title="Telugu Trending" />
        <SectionSkeleton title="Telugu In Theaters" />
        <SectionSkeleton title="Telugu Hidden Gems" />
        <SectionSkeleton title="Top Rated Telugu" />
        <SectionSkeleton title="Upcoming Telugu" />
      </div>
    </div>
  );
}
