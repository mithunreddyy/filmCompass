import { discoverMovies } from "@/services/tmdb";
import { DiscoverPageContent } from "./discover-page-content";

export const metadata = {
  title: "Discover Movies",
  description:
    "Discover new movies with advanced filters — by genre, language, year, rating, and more.",
};

interface DiscoverPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const resolvedParams = await searchParams;

  const genreStr =
    typeof resolvedParams.genres === "string" ? resolvedParams.genres : "";
  const genres = genreStr
    ? genreStr
        .split(",")
        .map(Number)
        .filter((n) => !isNaN(n))
    : [];
  const language =
    typeof resolvedParams.language === "string"
      ? resolvedParams.language
      : undefined;
  const sortBy =
    typeof resolvedParams.sortBy === "string"
      ? resolvedParams.sortBy
      : "popularity.desc";
  const ratingMin = Number(resolvedParams.ratingMin) || 0;
  const yearFrom = Number(resolvedParams.yearFrom) || undefined;
  const yearTo = Number(resolvedParams.yearTo) || undefined;
  const page = Math.max(
    1,
    Number(
      typeof resolvedParams.page === "string" ? resolvedParams.page : "1"
    )
  );

  let results;
  try {
    results = await discoverMovies({
      genres,
      language,
      sortBy,
      ratingMin,
      yearFrom,
      yearTo,
      page,
    });
  } catch {
    results = { movies: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  return (
    <DiscoverPageContent
      movies={results.movies}
      totalResults={results.totalResults}
      totalPages={results.totalPages}
      currentPage={page}
      activeGenres={genres}
      activeLanguage={language ?? null}
      activeSortBy={sortBy}
      activeRatingMin={ratingMin}
    />
  );
}
