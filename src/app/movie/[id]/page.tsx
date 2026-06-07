import { getMovieDetail } from "@/services/tmdb";
import { getOMDbByImdbId } from "@/services/omdb";
import { MovieDetailContent } from "./movie-detail-content";
import { MovieJsonLd } from "@/components/movies/movie-json-ld";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { clientEnv } from "@/lib/env";

export const revalidate = 3600;

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const { id } = await params;
  const movieId = Number(id);
  if (isNaN(movieId)) return {};

  try {
    const movie = await getMovieDetail(movieId);
    return {
      title: `${movie.title} (${movie.year})`,
      description: movie.overview,
      openGraph: {
        title: `${movie.title} (${movie.year}) | FilmCompass`,
        description: movie.overview,
        images: movie.backdropUrl
          ? [{ url: movie.backdropUrl, width: 1280, height: 720 }]
          : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function MovieDetailPage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (isNaN(movieId) || movieId <= 0) {
    notFound();
  }

  let movie;
  try {
    movie = await getMovieDetail(movieId);
  } catch {
    notFound();
  }

  const omdb = movie.imdbId
    ? await getOMDbByImdbId(movie.imdbId).catch(() => null)
    : null;

  const url = `${clientEnv.NEXT_PUBLIC_APP_URL}/movie/${movieId}`;
  return (
    <>
      <MovieJsonLd movie={movie} url={url} />
      <MovieDetailContent movie={movie} omdb={omdb} />
    </>
  );
}
