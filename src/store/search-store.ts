import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SearchState {
  query: string;
  recentSearches: string[];
  isSearchOpen: boolean;
  setQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  setSearchOpen: (open: boolean) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      query: "",
      recentSearches: [],
      isSearchOpen: false,

      setQuery: (query) => set({ query }),

      addRecentSearch: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        const current = get().recentSearches;
        const filtered = current.filter(
          (s) => s.toLowerCase() !== trimmed.toLowerCase()
        );
        set({
          recentSearches: [trimmed, ...filtered].slice(0, 10),
        });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),

      setSearchOpen: (open) => set({ isSearchOpen: open }),
    }),
    {
      name: "filmcompass-search",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
      }),
    }
  )
);
