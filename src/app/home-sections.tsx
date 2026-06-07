import { cache } from "react";
import {
  getTrending,
  getTopRated,
  getTeluguTrending,
  getTeluguTopRated,
  getTeluguHiddenGems,
  getTeluguNowPlaying,
  getTeluguUpcoming,
  fetchTwoPages,
} from "@/services/tmdb";
import { FeaturedHero } from "@/components/movies/featured-hero";
import { MovieSection } from "@/components/movies/movie-section";
import { HomeCatalogueMeta } from "./home-catalogue";
import type { Movie } from "@/types/movie";

const empty = { movies: [], page: 1, totalPages: 0, totalResults: 0 };
const TE = "language=te";

const loadTeluguTrending = cache(async (): Promise<Movie[]> =>
  fetchTwoPages(getTeluguTrending).catch(() => [])
);

export async function HomeHero() {
  const trending = await loadTeluguTrending();
  const heroMovies = trending.slice(0, 3);

  if (!heroMovies.length) {
    return (
      <section className="border-b border-border fc-content py-8">
        <h1 className="fc-page-title font-bold text-foreground">FilmCompass</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Unable to load films. Check your TMDb API configuration.
        </p>
      </section>
    );
  }

  return <FeaturedHero movies={heroMovies} />;
}

export async function TeluguTrendingSection() {
  const movies = await loadTeluguTrending();
  return (
    <MovieSection
      movies={movies}
      title="Telugu Trending"
      href={`/discover?${TE}&sortBy=popularity.desc`}
    />
  );
}

export async function TeluguNowPlayingSection() {
  const movies = await getTeluguNowPlaying(1)
    .then((r) => r.movies)
    .catch(() => []);
  return (
    <MovieSection
      movies={movies}
      title="Telugu In Theaters"
      href={`/discover?${TE}&sortBy=popularity.desc`}
      showReleaseDate
    />
  );
}

export async function TeluguHiddenGemsSection() {
  const movies = await fetchTwoPages(getTeluguHiddenGems).catch(() => []);
  return (
    <MovieSection
      movies={movies}
      title="Telugu Hidden Gems"
      href={`/discover?${TE}&sortBy=vote_average.desc&ratingMin=7.5`}
      linkText="Explore"
    />
  );
}

export async function TeluguTopRatedSection() {
  const movies = await fetchTwoPages(getTeluguTopRated).catch(() => []);
  return (
    <MovieSection
      movies={movies}
      title="Top Rated Telugu"
      href={`/discover?${TE}&sortBy=vote_average.desc`}
    />
  );
}

export async function TeluguUpcomingSection() {
  const movies = await getTeluguUpcoming(1)
    .then((r) => r.movies)
    .catch(() => []);
  return (
    <MovieSection
      movies={movies}
      title="Upcoming Telugu"
      href={`/discover?${TE}&sortBy=primary_release_date.asc`}
      showReleaseDate
    />
  );
}

export async function WorldCinemaSection() {
  const [worldTrending, worldTopRated] = await Promise.all([
    getTrending("week", 1).catch(() => empty),
    getTopRated(1).catch(() => empty),
  ]);

  if (!worldTrending.movies.length && !worldTopRated.movies.length) {
    return null;
  }

  return (
    <div className="space-y-6 border-t border-border pt-6 sm:space-y-7 sm:pt-7">
      <MovieSection
        movies={worldTrending.movies}
        title="Global Trending"
        href="/discover?language=all&sortBy=popularity.desc"
      />
      <MovieSection
        movies={worldTopRated.movies}
        title="Global Top Rated"
        href="/discover?language=all&sortBy=vote_average.desc"
      />
    </div>
  );
}

export function HomeCatalogueShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fc-content space-y-6 py-4 sm:space-y-7 sm:py-5">
      {children}
      <HomeCatalogueMeta />
    </div>
  );
}
