"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { MovieGrid } from "@/components/movies/movie-grid";
import type { Movie } from "@/types/movie";
import Link from "next/link";

interface SearchPageContentProps {
  initialQuery: string;
  initialResults: {
    movies: Movie[];
    page: number;
    totalPages: number;
    totalResults: number;
  } | null;
  currentPage: number;
}

export function SearchPageContent({
  initialQuery,
  initialResults,
  currentPage,
}: SearchPageContentProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim().length >= 2) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
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
            Search Movies
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find movies by title, actor, director, and more
          </p>
        </motion.div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card/50 px-5 py-3.5 backdrop-blur-sm transition-all focus-within:border-amber-500/50 focus-within:shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <Search size={20} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a movie name..."
              className="flex-1 bg-transparent text-lg text-foreground placeholder-muted-foreground outline-none font-medium"
              autoFocus
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-amber-400"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results */}
        {initialResults ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {initialResults.totalResults.toLocaleString()}
                </span>{" "}
                results for &quot;{initialQuery}&quot;
              </p>
            </div>

            <MovieGrid movies={initialResults.movies} />

            {/* Pagination */}
            {initialResults.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(initialQuery)}&page=${currentPage - 1}`}
                    className="rounded-full border border-border/50 bg-card/50 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-amber-500/50 hover:text-amber-500"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-muted-foreground">
                  Page {currentPage} of {Math.min(initialResults.totalPages, 500)}
                </span>
                {currentPage < initialResults.totalPages &&
                  currentPage < 500 && (
                    <Link
                      href={`/search?q=${encodeURIComponent(initialQuery)}&page=${currentPage + 1}`}
                      className="rounded-full border border-border/50 bg-card/50 px-5 py-2 text-sm font-medium text-foreground transition-all hover:border-amber-500/50 hover:text-amber-500"
                    >
                      Next
                    </Link>
                  )}
              </div>
            )}
          </div>
        ) : initialQuery ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-muted-foreground">
              No results found. Try a different search term.
            </p>
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center text-center">
            <div>
              <Search
                size={48}
                className="mx-auto mb-4 text-muted-foreground/30"
              />
              <p className="text-lg font-medium text-muted-foreground">
                Start typing to search for movies
              </p>
              <p className="mt-1 text-sm text-muted-foreground/70">
                Search by movie title, actor name, or keywords
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
