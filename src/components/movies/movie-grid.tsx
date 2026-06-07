"use client";

import { MovieCard } from "./movie-card";
import { MovieGridSkeleton } from "./movie-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { Film } from "lucide-react";
import type { Movie } from "@/types/movie";

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  showReleaseDate?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function MovieGrid({
  movies,
  isLoading,
  showReleaseDate = false,
  emptyTitle = "No films found",
  emptyDescription = "Try adjusting your filters or browse the full catalogue.",
}: MovieGridProps) {
  if (isLoading) {
    return <MovieGridSkeleton />;
  }

  if (!movies.length) {
    return (
      <EmptyState
        icon={Film}
        title={emptyTitle}
        description={emptyDescription}
        actions={[
          { label: "Browse Telugu", href: "/discover?language=te" },
          { label: "Explore all", href: "/discover?language=all", variant: "ghost" },
        ]}
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 sm:gap-x-2.5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          layout="grid"
          showOverview
          showReleaseDate={showReleaseDate}
        />
      ))}
    </div>
  );
}
