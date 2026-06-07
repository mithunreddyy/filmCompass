"use client";

import { useMutation } from "@tanstack/react-query";
import type { AIRecommendation } from "@/services/recommendations";

interface RecommendationInput {
  favoriteGenres?: string[];
  likedMovieTitles?: string[];
  mood?: string;
  language?: string;
}

interface RecommendationResponse {
  success: boolean;
  data: AIRecommendation[];
}

export function useRecommendations() {
  return useMutation({
    mutationFn: async (input: RecommendationInput) => {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to get recommendations");
      return res.json() as Promise<RecommendationResponse>;
    },
  });
}
