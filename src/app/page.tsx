import { getTrending, getTopRated, getHiddenGems, getNowPlaying, getUpcoming } from "@/services/tmdb";
import { HomeContent } from "./home-content";

export default async function HomePage() {
  const [trending, topRated, hiddenGems, nowPlaying, upcoming] =
    await Promise.all([
      getTrending("week", 1).catch(() => ({ movies: [], page: 1, totalPages: 0, totalResults: 0 })),
      getTopRated(1).catch(() => ({ movies: [], page: 1, totalPages: 0, totalResults: 0 })),
      getHiddenGems(1).catch(() => ({ movies: [], page: 1, totalPages: 0, totalResults: 0 })),
      getNowPlaying(1).catch(() => ({ movies: [], page: 1, totalPages: 0, totalResults: 0 })),
      getUpcoming(1).catch(() => ({ movies: [], page: 1, totalPages: 0, totalResults: 0 })),
    ]);

  return (
    <HomeContent
      trending={trending.movies}
      topRated={topRated.movies}
      hiddenGems={hiddenGems.movies}
      nowPlaying={nowPlaying.movies}
      upcoming={upcoming.movies}
    />
  );
}
