import {
  getTrending,
  getHiddenGems,
  getTopRated,
} from "@/services/tmdb";
import { DashboardContent } from "./dashboard-content";

export const metadata = {
  title: "Dashboard",
  description: "Your personalized movie discovery dashboard.",
};

export default async function DashboardPage() {
  const [trending, hiddenGems, topRated] = await Promise.all([
    getTrending("week", 1).catch(() => ({
      movies: [],
      page: 1,
      totalPages: 0,
      totalResults: 0,
    })),
    getHiddenGems(1).catch(() => ({
      movies: [],
      page: 1,
      totalPages: 0,
      totalResults: 0,
    })),
    getTopRated(1).catch(() => ({
      movies: [],
      page: 1,
      totalPages: 0,
      totalResults: 0,
    })),
  ]);

  return (
    <DashboardContent
      trending={trending.movies}
      hiddenGems={hiddenGems.movies}
      topRated={topRated.movies}
    />
  );
}
