"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { MovieGrid } from "@/components/movies/movie-grid";
import { RandomGemSpotlight } from "@/components/movies/random-gem-spotlight";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import type { Movie } from "@/types/movie";

interface GemsPageContentProps {
  movies: Movie[];
  totalResults: number;
  totalPages: number;
  currentPage: number;
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

export function GemsPageContent({
  movies: initialMovies,
  totalResults,
  totalPages,
  currentPage,
}: GemsPageContentProps) {
  const router = useRouter();
  const [extraMovies, setExtraMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(currentPage);
  const [loadingMore, setLoadingMore] = useState(false);

  const movies = useMemo(
    () => mergeMovies(initialMovies, extraMovies),
    [initialMovies, extraMovies]
  );

  async function loadMore() {
    if (loadingMore || page >= totalPages) return;

    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/movies/hidden-gems?page=${nextPage}`);
      const data = (await res.json()) as {
        success: boolean;
        data?: Movie[];
        error?: string;
      };

      if (data.success && data.data) {
        setExtraMovies((prev) => mergeMovies(prev, data.data!));
        setPage(nextPage);
        router.replace(`/gems?page=${nextPage}`, { scroll: false });
      }
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        kicker="Curated picks"
        title="Telugu Hidden Gems"
        description={`${totalResults.toLocaleString()} hidden gems from our full 1950–2026 Telugu catalogue — great ratings, lower mainstream visibility`}
      />

      <RandomGemSpotlight />

      <MovieGrid
        movies={movies}
        emptyTitle="No hidden gems found"
        emptyDescription="Check back soon — we're refreshing the catalogue."
      />

      {totalPages > 1 && page < totalPages && (
        <div className="mt-6 flex justify-center sm:mt-7">
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
              "Load more gems"
            )}
          </button>
        </div>
      )}

      {page > 1 && (
        <div className="mt-4 flex justify-center">
          <Link href="/gems" className="fc-btn-ghost text-sm">
            Back to first page
          </Link>
        </div>
      )}
    </PageShell>
  );
}
