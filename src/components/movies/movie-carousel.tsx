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

export function MovieCarousel({ movies, isLoading }: MovieCarouselProps) {
  const slidesToScroll = useSlidesToScroll();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll,
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.reInit({ slidesToScroll });
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect, slidesToScroll]);

  if (isLoading) {
    return <MovieCarouselSkeleton />;
  }

  if (!movies.length) return null;

  return (
    <div className="group/carousel relative -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-3 sm:gap-4">
          {movies.map((movie, i) => (
            <div key={movie.id} className="min-w-0 flex-shrink-0">
              <MovieCard movie={movie} index={i} />
            </div>
          ))}
        </div>
      </div>

      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          className={cn(
            "absolute left-0 top-1/3 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full sm:flex",
            "liquid-glass-subtle text-foreground",
            "opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100"
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
            "absolute right-0 top-1/3 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full sm:flex",
            "liquid-glass-subtle text-foreground",
            "opacity-0 transition-opacity duration-200 group-hover/carousel:opacity-100"
          )}
          aria-label="Next"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
