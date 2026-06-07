"use client";

import { useQuery } from "@tanstack/react-query";
import type { MovieDetail } from "@/types/movie";

interface MovieDetailResponse {
  success: boolean;
  data: MovieDetail;
}

export function useMovieDetails(id: number) {
  return useQuery<MovieDetailResponse>({
    queryKey: ["movieDetail", id],
    queryFn: async () => {
      const res = await fetch(`/api/movies/${id}`);
      if (!res.ok) throw new Error("Failed to fetch movie details");
      return res.json() as Promise<MovieDetailResponse>;
    },
    enabled: id > 0,
    staleTime: 1000 * 60 * 30,
  });
}
