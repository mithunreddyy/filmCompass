"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./use-debounce";
import type { Movie } from "@/types/movie";

interface SearchResponse {
  success: boolean;
  data: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export function useMovieSearch(query: string, page: number = 1) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery<SearchResponse>({
    queryKey: ["movieSearch", debouncedQuery, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        query: debouncedQuery,
        page: String(page),
      });
      const res = await fetch(`/api/movies/search?${params}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json() as Promise<SearchResponse>;
    },
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}
