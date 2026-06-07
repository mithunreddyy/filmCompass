"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MovieGrid } from "@/components/movies/movie-grid";
import { GenreBadge } from "@/components/shared/genre-badge";
import type { Movie, Genre } from "@/types/movie";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GenrePageContentProps {
  genre: Genre;
  movies: Movie[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  activeSortBy: string;
  allGenres: Genre[];
}

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "revenue.desc", label: "Highest Revenue" },
];

export function GenrePageContent({
  genre,
  movies,
  totalResults,
  totalPages,
  currentPage,
  activeSortBy,
  allGenres,
}: GenrePageContentProps) {
  const router = useRouter();

  function buildUrl(sort: string, page: number = 1) {
    const params = new URLSearchParams();
    if (sort !== "popularity.desc") params.set("sortBy", sort);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/genre/${genre.slug}${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {genre.name} <span className="text-muted-foreground font-normal">Movies</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            {totalResults.toLocaleString()} movies in {genre.name}
          </p>
        </motion.div>

        {/* Genre Switcher */}
        <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2">
          {allGenres.map((g) => (
            <GenreBadge
              key={g.id}
              name={g.name}
              slug={g.slug}
              isActive={g.id === genre.id}
              size="md"
            />
          ))}
        </div>

        {/* Sort */}
        <div className="mb-6 flex flex-wrap gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => router.push(buildUrl(option.value))}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border",
                activeSortBy === option.value
                  ? "border-amber-500 bg-amber-500/10 text-amber-500"
                  : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <MovieGrid movies={movies} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={buildUrl(activeSortBy, currentPage - 1)}
                className="rounded-full border border-border/50 bg-card/50 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-amber-500/50 hover:text-amber-500"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-muted-foreground">
              Page {currentPage} of {Math.min(totalPages, 500)}
            </span>
            {currentPage < totalPages && currentPage < 500 && (
              <Link
                href={buildUrl(activeSortBy, currentPage + 1)}
                className="rounded-full border border-border/50 bg-card/50 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-amber-500/50 hover:text-amber-500"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
