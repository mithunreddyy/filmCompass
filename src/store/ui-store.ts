import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isFilterOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleFilter: () => void;
  setFilterOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isSidebarOpen: false,
  isFilterOpen: false,

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  toggleFilter: () => set((s) => ({ isFilterOpen: !s.isFilterOpen })),
  setFilterOpen: (open) => set({ isFilterOpen: open }),
}));
