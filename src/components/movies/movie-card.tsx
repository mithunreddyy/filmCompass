"use client";

import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/types/movie";
import { getGenreById } from "@/types/movie";
import { RatingPill } from "./rating-pill";
import { cn } from "@/lib/utils";
import { useState } from "react";

function formatReleaseDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  if (!y || !m || !d) return isoDate;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface MovieCardProps {
  movie: Movie;
  index?: number;
  layout?: "carousel" | "grid";
  size?: "sm" | "md" | "lg";
  showOverview?: boolean;
  showReleaseDate?: boolean;
}

export function MovieCard({
  movie,
  layout = "carousel",
  size = "md",
  showOverview = false,
  showReleaseDate = false,
}: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const carouselSizes = {
    sm: "w-[100px] sm:w-[130px]",
    md: "w-[110px] sm:w-[140px] md:w-[155px]",
    lg: "w-[130px] sm:w-[160px] md:w-[175px]",
  };

  const genreNames = movie.genreIds
    .slice(0, 2)
    .map((id) => getGenreById(id)?.name)
    .filter(Boolean);

  return (
    <article
      className={cn(
        "group/poster flex-shrink-0",
        layout === "carousel" ? carouselSizes[size] : "w-full"
      )}
    >
      <Link
        href={`/movie/${movie.id}`}
        className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="fc-poster">
          {movie.posterUrl && !imageError ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              sizes={
                layout === "grid"
                  ? "(max-width:640px) 33vw, (max-width:1024px) 20vw, 12vw"
                  : "(max-width:640px) 110px, 155px"
              }
              className={cn(
                "object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-2 text-center text-[11px] text-muted-foreground">
              {movie.title}
            </div>
          )}

          {!imageLoaded && !imageError && movie.posterUrl && (
            <div className="absolute inset-0 fc-shimmer bg-surface-raised" />
          )}

          {movie.rating > 0 && (
            <div className="absolute bottom-1.5 left-1.5">
              <RatingPill rating={movie.rating} />
            </div>
          )}

          {showOverview && movie.overview && (
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-background via-background/85 to-transparent p-2 opacity-0 transition-opacity duration-200 group-hover/poster:opacity-100 group-focus-visible/poster:opacity-100">
              <p className="line-clamp-3 text-[10px] leading-snug text-muted-foreground">
                {movie.overview}
              </p>
            </div>
          )}
        </div>

        <div className="mt-2 min-w-0">
          <h3 className="truncate text-xs font-semibold text-foreground sm:text-sm group-hover/poster:text-brand-violet transition-colors">
            {movie.title}
          </h3>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:text-xs">
            {showReleaseDate && movie.releaseDate ? (
              <span className="text-brand-mint">{formatReleaseDate(movie.releaseDate)}</span>
            ) : (
              movie.year > 0 ? movie.year : "—"
            )}
            {genreNames.length > 0 && (
              <span className="hidden sm:inline">{` · ${genreNames.join(" · ")}`}</span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
