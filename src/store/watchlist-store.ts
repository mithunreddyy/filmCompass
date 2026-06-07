import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Movie } from "@/types/movie";

interface WatchlistState {
  items: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addToWatchlist: (movie) => {
        const exists = get().items.some((m) => m.id === movie.id);
        if (exists) return;
        set({ items: [movie, ...get().items].slice(0, 100) });
      },

      removeFromWatchlist: (movieId) => {
        set({ items: get().items.filter((m) => m.id !== movieId) });
      },

      isInWatchlist: (movieId) => {
        return get().items.some((m) => m.id === movieId);
      },

      clearWatchlist: () => set({ items: [] }),
    }),
    { name: "filmcompass-watchlist" }
  )
);
