"use client";

import { useRouter } from "next/navigation";
import { MovieGrid } from "@/components/movies/movie-grid";
import { GenreBadge } from "@/components/shared/genre-badge";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import type { Movie, Genre } from "@/types/movie";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS } from "@/lib/discover-params";

interface GenrePageContentProps {
  genre: Genre;
  movies: Movie[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
  activeSortBy: string;
  allGenres: Genre[];
}

const GENRE_SORT_OPTIONS = SORT_OPTIONS.filter((o) =>
  ["popularity.desc", "vote_average.desc", "primary_release_date.desc", "revenue.desc"].includes(
    o.value
  )
);

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
    <PageShell>
      <PageHeader
        kicker="Genre"
        title={`${genre.name} Films`}
        description={`${totalResults.toLocaleString()} films in ${genre.name}`}
      />

      <div className="mb-6 flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-1">
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

      <div className="mb-6 flex flex-wrap gap-2">
        {GENRE_SORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => router.push(buildUrl(option.value))}
            className={cn(
              "fc-chip",
              activeSortBy === option.value && "fc-chip-active"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <MovieGrid
        movies={movies}
        emptyTitle={`No ${genre.name} films found`}
        emptyDescription="Try a different sort order or explore this genre across all languages."
      />

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link href={buildUrl(activeSortBy, currentPage - 1)} className="fc-btn-ghost">
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-muted-foreground">
            Page {currentPage} of {Math.min(totalPages, 500)}
          </span>
          {currentPage < totalPages && currentPage < 500 && (
            <Link href={buildUrl(activeSortBy, currentPage + 1)} className="fc-btn-ghost">
              Next
            </Link>
          )}
        </div>
      )}
    </PageShell>
  );
}
