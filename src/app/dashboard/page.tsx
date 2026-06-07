import {
  fetchTwoPages,
  getTeluguHiddenGems,
  getTeluguTopRated,
  getTeluguTrending,
} from "@/services/tmdb";
import { DashboardContent } from "./dashboard-content";

export const metadata = {
  title: "Dashboard",
  description: "Your personalized Telugu cinema discovery dashboard.",
};

export default async function DashboardPage() {
  const [trending, hiddenGems, topRated] = await Promise.all([
    fetchTwoPages(getTeluguTrending).catch(() => []),
    fetchTwoPages(getTeluguHiddenGems).catch(() => []),
    fetchTwoPages(getTeluguTopRated).catch(() => []),
  ]);

  return (
    <DashboardContent
      trending={trending}
      hiddenGems={hiddenGems}
      topRated={topRated}
    />
  );
}
