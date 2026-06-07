"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./use-debounce";
import { fetchSearchResults } from "@/lib/api-client";
import type { PaginatedApiResponse } from "@/types/api";
import type { Movie } from "@/types/movie";

export function useMovieSearch(query: string, page: number = 1) {
  const debouncedQuery = useDebounce(query, 300);

  return useQuery<PaginatedApiResponse<Movie>>({
    queryKey: ["movieSearch", debouncedQuery, page],
    queryFn: () => fetchSearchResults(debouncedQuery, page),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
    placeholderData: (prev) => prev,
  });
}
