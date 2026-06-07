import { discoverMovies } from "@/services/tmdb";
import { getGenreBySlug, GENRES } from "@/types/movie";
import { GenrePageContent } from "./genre-page-content";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface GenrePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: GenrePageProps): Promise<Metadata> {
  const { slug } = await params;
  const genre = getGenreBySlug(slug);
  if (!genre) return {};

  return {
    title: `${genre.name} Movies`,
    description: `Discover the best ${genre.name} movies. Browse trending, top-rated, and hidden gems in ${genre.name}.`,
  };
}

export default async function GenrePage({
  params,
  searchParams,
}: GenrePageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const genre = getGenreBySlug(slug);
  if (!genre) {
    notFound();
  }

  const page = Math.max(
    1,
    Number(
      typeof resolvedSearchParams.page === "string"
        ? resolvedSearchParams.page
        : "1"
    )
  );
  const sortBy =
    typeof resolvedSearchParams.sortBy === "string"
      ? resolvedSearchParams.sortBy
      : "popularity.desc";

  let results;
  try {
    results = await discoverMovies({
      genres: [genre.id],
      sortBy,
      page,
    });
  } catch {
    results = { movies: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  return (
    <GenrePageContent
      genre={genre}
      movies={results.movies}
      totalResults={results.totalResults}
      totalPages={results.totalPages}
      currentPage={page}
      activeSortBy={sortBy}
      allGenres={GENRES}
    />
  );
}
