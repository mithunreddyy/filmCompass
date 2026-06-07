import type { MovieDetail } from "@/types/movie";

interface MovieJsonLdProps {
  movie: MovieDetail;
  url: string;
}

export function MovieJsonLd({ movie, url }: MovieJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.overview,
    image: movie.posterUrl ?? movie.backdropUrl,
    datePublished: movie.releaseDate || undefined,
    aggregateRating:
      movie.rating > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: movie.rating,
            ratingCount: movie.voteCount,
            bestRating: 10,
            worstRating: 0,
          }
        : undefined,
    director: movie.director
      ? { "@type": "Person", name: movie.director.name }
      : undefined,
    genre: movie.genres.map((g) => g.name),
    url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
