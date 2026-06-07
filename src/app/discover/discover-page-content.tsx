"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { MovieGrid } from "@/components/movies/movie-grid";
import { GENRES, LANGUAGES } from "@/types/movie";
import type { Movie } from "@/types/movie";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DiscoverPageContentProps {
  movies: Movie[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  activeGenres: number[];
  activeLanguage: string | null;
  activeSortBy: string;
  activeRatingMin: number;
}

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Highest Rated" },
  { value: "primary_release_date.desc", label: "Newest" },
  { value: "primary_release_date.asc", label: "Oldest" },
  { value: "revenue.desc", label: "Highest Revenue" },
  { value: "original_title.asc", label: "A-Z" },
];

export function DiscoverPageContent({
  movies,
  totalResults,
  totalPages,
  currentPage,
  activeGenres,
  activeLanguage,
  activeSortBy,
  activeRatingMin,
}: DiscoverPageContentProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const genres = overrides.genres ?? (activeGenres.length ? activeGenres.join(",") : undefined);
    const language = overrides.language ?? activeLanguage ?? undefined;
    const sortBy = overrides.sortBy ?? activeSortBy;
    const ratingMin = overrides.ratingMin ?? (activeRatingMin > 0 ? String(activeRatingMin) : undefined);
    const page = overrides.page ?? "1";

    if (genres) params.set("genres", genres);
    if (language) params.set("language", language);
    if (sortBy && sortBy !== "popularity.desc") params.set("sortBy", sortBy);
    if (ratingMin) params.set("ratingMin", ratingMin);
    if (page !== "1") params.set("page", page);

    const qs = params.toString();
    return `/discover${qs ? `?${qs}` : ""}`;
  }

  function toggleGenre(genreId: number) {
    const newGenres = activeGenres.includes(genreId)
      ? activeGenres.filter((g) => g !== genreId)
      : [...activeGenres, genreId];
    router.push(buildUrl({ genres: newGenres.length ? newGenres.join(",") : undefined, page: "1" }));
  }

  return (
    <div className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-end justify-between"
        >
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Discover
            </h1>
            <p className="mt-2 text-muted-foreground">
              {totalResults.toLocaleString()} movies to explore
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all border",
              showFilters
                ? "border-amber-500/50 bg-amber-500/10 text-amber-500"
                : "border-border/50 bg-card/50 text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 space-y-6 rounded-2xl border border-border/30 bg-card/30 p-6 backdrop-blur-sm"
          >
            {/* Sort */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Sort by
              </h3>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      router.push(buildUrl({ sortBy: option.value, page: "1" }))
                    }
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
            </div>

            {/* Genres */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border",
                      activeGenres.includes(genre.id)
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Language
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    router.push(
                      buildUrl({ language: undefined, page: "1" })
                    )
                  }
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border",
                    !activeLanguage
                      ? "border-amber-500 bg-amber-500/10 text-amber-500"
                      : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border"
                  )}
                >
                  All
                </button>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() =>
                      router.push(
                        buildUrl({
                          language:
                            activeLanguage === lang.code
                              ? undefined
                              : lang.code,
                          page: "1",
                        })
                      )
                    }
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border",
                      activeLanguage === lang.code
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Minimum Rating
              </h3>
              <div className="flex flex-wrap gap-2">
                {[0, 5, 6, 7, 7.5, 8, 8.5].map((r) => (
                  <button
                    key={r}
                    onClick={() =>
                      router.push(
                        buildUrl({
                          ratingMin: r > 0 ? String(r) : undefined,
                          page: "1",
                        })
                      )
                    }
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all border",
                      activeRatingMin === r
                        ? "border-amber-500 bg-amber-500/10 text-amber-500"
                        : "border-border/30 text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    {r === 0 ? "Any" : `${r}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Clear */}
            {(activeGenres.length > 0 ||
              activeLanguage ||
              activeRatingMin > 0 ||
              activeSortBy !== "popularity.desc") && (
              <div className="pt-2 border-t border-border/30">
                <button
                  onClick={() => router.push("/discover")}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={12} />
                  Clear all filters
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Results */}
        <MovieGrid movies={movies} />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Link
                href={buildUrl({ page: String(currentPage - 1) })}
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
                href={buildUrl({ page: String(currentPage + 1) })}
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
