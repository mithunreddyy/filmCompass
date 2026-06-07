"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Film } from "lucide-react";
import { MovieGrid } from "@/components/movies/movie-grid";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/shared/empty-state";
import type { Movie } from "@/types/movie";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TMDB_DEFAULT_ORIGINAL_LANG } from "@/lib/tmdb-config";

interface SearchPageContentProps {
  initialQuery: string;
  initialResults: {
    movies: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
    filtered?: boolean;
  } | null;
  currentPage: number;
  teluguOnly: boolean;
}

function buildSearchUrl(query: string, page: number, teluguOnly: boolean) {
  const params = new URLSearchParams({ q: query });
  if (page > 1) params.set("page", String(page));
  if (teluguOnly) params.set("lang", TMDB_DEFAULT_ORIGINAL_LANG);
  return `/search?${params.toString()}`;
}

export function SearchPageContent({
  initialQuery,
  initialResults,
  currentPage,
  teluguOnly,
}: SearchPageContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(buildSearchUrl(query.trim(), 1, teluguOnly));
    }
  }

  function setLanguageFilter(teOnly: boolean) {
    if (!initialQuery) return;
    router.push(buildSearchUrl(initialQuery, 1, teOnly));
  }

  const movies = initialResults?.movies ?? [];

  return (
    <PageShell>
      <PageHeader
        kicker="Find films"
        title="Search"
        description="Find films by title — filter to Telugu on the server per results page"
      />

      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex items-center gap-3 rounded-xl fc-input px-4 py-3 transition-all focus-within:border-brand-violet/50 focus-within:shadow-[0_0_20px_rgba(139,124,246,0.08)] sm:px-5 sm:py-3.5">
          <Search size={18} className="shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a film title..."
            className="flex-1 bg-transparent text-base font-medium text-foreground outline-none placeholder:text-muted-foreground sm:text-lg"
            autoFocus
          />
          <button type="submit" className="fc-btn-primary shrink-0 px-4 py-1.5 text-sm">
            Search
          </button>
        </div>
      </form>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setLanguageFilter(false)}
          className={cn("fc-chip", !teluguOnly && "fc-chip-active")}
        >
          All languages
        </button>
        <button
          type="button"
          onClick={() => setLanguageFilter(true)}
          className={cn("fc-chip", teluguOnly && "fc-chip-active")}
        >
          Telugu only
        </button>
        {teluguOnly && (
          <p className="text-xs text-muted-foreground">
            Telugu matches on this TMDb page. For the full catalogue, use{" "}
            <Link href="/discover?language=te" className="text-brand-violet hover:underline">
              Discover
            </Link>
            .
          </p>
        )}
      </div>

      {initialResults ? (
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {initialResults.totalResults.toLocaleString()}
            </span>{" "}
            {teluguOnly ? "Telugu " : ""}
            {initialResults.filtered ? "matches on this page" : "results"} for &quot;
            {initialQuery}&quot;
          </p>

          {movies.length > 0 ? (
            <MovieGrid movies={movies} />
          ) : (
            <EmptyState
              icon={Film}
              title={teluguOnly ? "No Telugu matches on this page" : "No results found"}
              description={
                teluguOnly
                  ? "TMDb search may not surface every Telugu title on one page. Browse the full Telugu catalogue in Discover or try a different spelling."
                  : `Nothing matched "${initialQuery}". Try a shorter title, check spelling, or explore by genre.`
              }
              actions={[
                { label: "Browse Telugu", href: "/discover?language=te" },
                { label: "Try Gems", href: "/gems", variant: "ghost" },
              ]}
            />
          )}

          {initialResults.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={buildSearchUrl(initialQuery, currentPage - 1, teluguOnly)}
                  className="fc-btn-ghost"
                >
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-muted-foreground">
                Page {currentPage} of {Math.min(initialResults.totalPages, 500)}
              </span>
              {currentPage < initialResults.totalPages && currentPage < 500 && (
                <Link
                  href={buildSearchUrl(initialQuery, currentPage + 1, teluguOnly)}
                  className="fc-btn-ghost"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      ) : initialQuery ? (
        <EmptyState
          icon={Search}
          title="No results found"
          description={`We couldn't find films matching "${initialQuery}". Try another title or browse curated lists.`}
          actions={[
            { label: "Discover Telugu", href: "/discover?language=te" },
            { label: "Hidden Gems", href: "/gems", variant: "ghost" },
          ]}
        />
      ) : (
        <EmptyState
          icon={Search}
          title="Search the catalogue"
          description="Type a film title above — use / from anywhere to jump to search. Try Telugu-only filter for regional picks."
          actions={[{ label: "Popular Telugu", href: "/discover?language=te&sortBy=popularity.desc" }]}
        />
      )}
    </PageShell>
  );
}
