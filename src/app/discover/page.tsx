import { discoverMovies } from "@/services/tmdb";
import { buildDiscoverUrl, parseDiscoverPageParams } from "@/lib/discover-params";
import { DiscoverPageContent } from "./discover-page-content";

export const revalidate = 300;

export const metadata = {
  title: "Discover Movies",
  description:
    "Discover Telugu cinema and films worldwide — filter by genre, language, year, and rating.",
};

interface DiscoverPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const resolvedParams = await searchParams;
  const state = parseDiscoverPageParams(resolvedParams);

  if (!state) {
    return (
      <DiscoverPageContent
        movies={[]}
        totalResults={0}
        totalPages={0}
        currentPage={1}
        activeGenres={[]}
        activeLanguage={null}
        activeSortBy="popularity.desc"
        activeRatingMin={0}
      />
    );
  }

  let results;
  try {
    results = await discoverMovies({
      genres: state.genres,
      language: state.apiLanguage,
      sortBy: state.sortBy,
      ratingMin: state.ratingMin,
      yearFrom: state.yearFrom,
      yearTo: state.yearTo,
      page: state.page,
    });
  } catch {
    results = { movies: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  const listKey = buildDiscoverUrl({
    genres: state.genres,
    language: state.activeLanguage,
    sortBy: state.sortBy,
    ratingMin: state.ratingMin,
    yearFrom: state.yearFrom,
    yearTo: state.yearTo,
    page: state.page,
  });

  return (
    <DiscoverPageContent
      key={listKey}
      movies={results.movies}
      totalResults={results.totalResults}
      totalPages={results.totalPages}
      currentPage={state.page}
      activeGenres={state.genres}
      activeLanguage={state.activeLanguage}
      activeSortBy={state.sortBy}
      activeRatingMin={state.ratingMin}
      yearFrom={state.yearFrom}
      yearTo={state.yearTo}
    />
  );
}
