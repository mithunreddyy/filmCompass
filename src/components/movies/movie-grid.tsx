"use client";

import { MovieCard } from "./movie-card";
import { MovieGridSkeleton } from "./movie-skeleton";
import type { Movie } from "@/types/movie";

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
}

export function MovieGrid({ movies, isLoading }: MovieGridProps) {
  if (isLoading) {
    return <MovieGridSkeleton />;
  }

  if (!movies.length) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/30">
        <p className="text-muted-foreground">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie, i) => (
        <MovieCard key={movie.id} movie={movie} index={i} size="md" />
      ))}
    </div>
  );
}
