"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./movie-card";
import { MovieCarouselSkeleton } from "./movie-skeleton";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";

interface MovieCarouselProps {
  movies: Movie[];
  isLoading?: boolean;
  showReleaseDate?: boolean;
}

function useSlidesToScroll() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 640) setCount(1);
      else if (w < 1024) setCount(2);
      else setCount(3);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

export function MovieCarousel({
  movies,
  isLoading,
  showReleaseDate = false,
}: MovieCarouselProps) {
  const slidesToScroll = useSlidesToScroll();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll,
    containScroll: "trimSnaps",
    dragFree: false,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const syncScrollState = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", syncScrollState);
    emblaApi.on("reInit", syncScrollState);
    emblaApi.reInit({ slidesToScroll });

    const frame = requestAnimationFrame(syncScrollState);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", syncScrollState);
      emblaApi.off("reInit", syncScrollState);
    };
  }, [emblaApi, slidesToScroll]);

  if (isLoading) {
    return <MovieCarouselSkeleton />;
  }

  if (!movies.length) return null;

  return (
    <div className="group/carousel relative -mx-1 overflow-x-clip px-1 sm:-mx-0 sm:px-0">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent opacity-0 transition-opacity group-hover/carousel:opacity-100 sm:w-8" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent opacity-0 transition-opacity group-hover/carousel:opacity-100 sm:w-8" />
      <div ref={emblaRef} className="overflow-hidden touch-pan-y">
        <div className="flex gap-2 sm:gap-3">
          {movies.map((movie) => (
            <div key={movie.id} className="min-w-0 flex-shrink-0">
              <MovieCard
                movie={movie}
                layout="carousel"
                showReleaseDate={showReleaseDate}
              />
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          className={cn(
            "absolute left-0 top-1/3 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl border border-border/80 bg-surface/95 shadow-md backdrop-blur-sm sm:flex",
            "opacity-0 transition-all duration-200 group-hover/carousel:opacity-100 hover:border-brand-violet/40 hover:text-brand-violet"
          )}
          aria-label="Previous"
        >
          <ChevronLeft size={16} />
        </button>
      )}
      {canScrollNext && (
        <button
          onClick={scrollNext}
          className={cn(
            "absolute right-0 top-1/3 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl border border-border/80 bg-surface/95 shadow-md backdrop-blur-sm sm:flex",
            "opacity-0 transition-all duration-200 group-hover/carousel:opacity-100 hover:border-brand-violet/40 hover:text-brand-violet"
          )}
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
