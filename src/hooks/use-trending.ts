"use client";

import { useQuery } from "@tanstack/react-query";
import type { Movie } from "@/types/movie";

interface TrendingResponse {
  success: boolean;
  data: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export function useTrending(
  timeWindow: "day" | "week" = "week",
  page: number = 1
) {
  return useQuery<TrendingResponse>({
    queryKey: ["trending", timeWindow, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        timeWindow,
        page: String(page),
      });
      const res = await fetch(`/api/movies/trending?${params}`);
      if (!res.ok) throw new Error("Failed to fetch trending");
      return res.json() as Promise<TrendingResponse>;
    },
    staleTime: 1000 * 60 * 10,
  });
}
