"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { MovieGrid } from "@/components/movies/movie-grid";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { GENRES, LANGUAGES } from "@/types/movie";
import type { Movie } from "@/types/movie";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  SORT_OPTIONS,
  buildDiscoverApiParams,
  buildDiscoverUrl,
} from "@/lib/discover-params";
import { fetchDiscoverPage } from "@/lib/api-client";
import { TMDB_DEFAULT_ORIGINAL_LANG } from "@/lib/tmdb-config";

interface DiscoverPageContentProps {
  movies: Movie[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  activeGenres: number[];
  activeLanguage: string | null;
  activeSortBy: string;
  activeRatingMin: number;
  yearFrom?: number;
  yearTo?: number;
  title?: string;
  description?: string;
  kicker?: string;
}

function mergeMovies(base: Movie[], extra: Movie[]): Movie[] {
  const seen = new Set(base.map((m) => m.id));
  const merged = [...base];
  for (const movie of extra) {
    if (!seen.has(movie.id)) {
      seen.add(movie.id);
      merged.push(movie);
    }
  }
  return merged;
}

export function DiscoverPageContent({
  movies: initialMovies,
  totalResults,
  totalPages,
  currentPage,
  activeGenres,
  activeLanguage,
  activeSortBy,
  activeRatingMin,
  yearFrom,
  yearTo,
  title = "Discover",
  description,
  kicker = "Catalogue",
}: DiscoverPageContentProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(true);
  const [extraMovies, setExtraMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(currentPage);
  const [loadingMore, setLoadingMore] = useState(false);

  const movies = useMemo(
    () => mergeMovies(initialMovies, extraMovies),
    [initialMovies, extraMovies]
  );

  const filterState = {
    genres: activeGenres,
    activeLanguage,
    sortBy: activeSortBy,
    ratingMin: activeRatingMin,
    yearFrom,
    yearTo,
  };

  function urlWith(overrides: {
    genres?: number[];
    language?: string | null;
    sortBy?: string;
    ratingMin?: number;
    page?: number;
  }) {
    return buildDiscoverUrl({
      genres: overrides.genres ?? activeGenres,
      language:
        overrides.language !== undefined ? overrides.language : activeLanguage,
      sortBy: overrides.sortBy ?? activeSortBy,
      ratingMin: overrides.ratingMin ?? activeRatingMin,
      yearFrom,
      yearTo,
      page: overrides.page ?? 1,
    });
  }

  async function loadMore() {
    const maxPage = Math.min(totalPages, 500);
    if (loadingMore || page >= maxPage) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const params = buildDiscoverApiParams({ ...filterState, page: nextPage });
      const data = await fetchDiscoverPage(params);

      setExtraMovies((prev) => mergeMovies(prev, data.data));
      setPage(nextPage);
      router.replace(urlWith({ page: nextPage }), { scroll: false });
    } finally {
      setLoadingMore(false);
    }
  }

  function toggleGenre(genreId: number) {
    const newGenres = activeGenres.includes(genreId)
      ? activeGenres.filter((g) => g !== genreId)
      : [...activeGenres, genreId];
    router.push(urlWith({ genres: newGenres, page: 1 }));
  }

  const isTeluguDefault =
    activeLanguage === TMDB_DEFAULT_ORIGINAL_LANG &&
    activeGenres.length === 0 &&
    activeRatingMin === 0 &&
    activeSortBy === "popularity.desc" &&
    !yearFrom &&
    !yearTo;

  const languageLabel =
    activeLanguage === null
      ? "all languages"
      : LANGUAGES.find((l) => l.code === activeLanguage)?.name ?? activeLanguage;

  return (
    <PageShell>
      <PageHeader
        kicker={kicker}
        title={title}
        description={
          description ??
          `${totalResults.toLocaleString()} ${languageLabel} films to explore`
        }
        action={
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "fc-chip flex items-center gap-2 self-start sm:self-auto",
              showFilters && "fc-chip-active"
            )}
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        }
      />

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-5 space-y-4 fc-glass p-4 sm:p-5"
        >
          <div>
            <h3 className="fc-kicker mb-3 !tracking-[0.18em]">
              Sort by
            </h3>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    router.push(urlWith({ sortBy: option.value, page: 1 }))
                  }
                  className={cn(
                    "fc-chip",
                    activeSortBy === option.value && "fc-chip-active"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="fc-kicker mb-3 !tracking-[0.18em]">
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  className={cn(
                    "fc-chip",
                    activeGenres.includes(genre.id) && "fc-chip-active"
                  )}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="fc-kicker mb-3 !tracking-[0.18em]">
              Language
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => router.push(urlWith({ language: null, page: 1 }))}
                className={cn("fc-chip", activeLanguage === null && "fc-chip-active")}
              >
                All languages
              </button>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() =>
                    router.push(urlWith({ language: lang.code, page: 1 }))
                  }
                  className={cn(
                    "fc-chip",
                    activeLanguage === lang.code && "fc-chip-active"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="fc-kicker mb-3 !tracking-[0.18em]">
              Minimum Rating
            </h3>
            <div className="flex flex-wrap gap-2">
              {[0, 5, 6, 7, 7.5, 8, 8.5].map((r) => (
                <button
                  key={r}
                  onClick={() =>
                    router.push(
                      urlWith({ ratingMin: r, page: 1 })
                    )
                  }
                  className={cn(
                    "fc-chip",
                    activeRatingMin === r && "fc-chip-active"
                  )}
                >
                  {r === 0 ? "Any" : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {!isTeluguDefault && (
            <div className="border-t border-border pt-2">
              <button
                onClick={() => router.push("/discover")}
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-brand-violet"
              >
                <X size={12} />
                Reset to Telugu default
              </button>
            </div>
          )}
        </motion.div>
      )}

      <MovieGrid
        movies={movies}
        emptyTitle="No films match these filters"
        emptyDescription="Relax rating, genre, or year filters — or reset to the default Telugu catalogue."
      />

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col items-center gap-2 sm:mt-7">
          {page < Math.min(totalPages, 500) && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="fc-btn-primary inline-flex min-w-[140px] items-center justify-center gap-2"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Loading…
                </>
              ) : (
                "Load more"
              )}
            </button>
          )}
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link href={urlWith({ page: page - 1 })} className="fc-btn-ghost">
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-muted-foreground">
              Page {page} of {Math.min(totalPages, 500)}
            </span>
            {page < totalPages && page < 500 && (
              <Link href={urlWith({ page: page + 1 })} className="fc-btn-ghost">
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}
