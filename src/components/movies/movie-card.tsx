"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Calendar } from "lucide-react";
import type { Movie } from "@/types/movie";
import { getGenreById } from "@/types/movie";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  size?: "sm" | "md" | "lg";
}

export function MovieCard({ movie, index = 0, size = "md" }: MovieCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const sizes = {
    sm: "w-[130px] sm:w-[150px]",
    md: "w-[150px] sm:w-[170px] md:w-[190px]",
    lg: "w-[170px] sm:w-[200px] md:w-[220px]",
  };

  const genreNames = movie.genreIds
    .slice(0, 2)
    .map((id) => getGenreById(id)?.name)
    .filter(Boolean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      className={cn("group relative flex-shrink-0", sizes[size])}
    >
      <Link href={`/movie/${movie.id}`} className="block">
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl liquid-glass-card transition-all duration-300 group-hover:shadow-lg">
          {movie.posterUrl && !imageError ? (
            <Image
              src={movie.posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 200px"
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted/30 p-4">
              <span className="text-center text-sm text-muted-foreground font-heading">
                {movie.title}
              </span>
            </div>
          )}

          {/* Shimmer while loading */}
          {!imageLoaded && !imageError && movie.posterUrl && (
            <div className="absolute inset-0 animate-pulse bg-muted/30" />
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="line-clamp-3 text-xs text-gray-300 leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </div>
          </div>

          {/* Rating Badge */}
          {movie.rating > 0 && (
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 backdrop-blur-sm">
              <Star size={10} className="fill-foreground/80 text-foreground/80" />
              <span className="text-[11px] font-semibold text-white">
                {movie.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-2.5 px-0.5">
          <h3 className="font-medium text-sm text-foreground line-clamp-1 transition-colors group-hover:text-muted-foreground">
            {movie.title}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {movie.year > 0 && (
              <span className="flex items-center gap-1">
                <Calendar size={10} />
                {movie.year}
              </span>
            )}
            {genreNames.length > 0 && (
              <span className="truncate">{genreNames.join(" · ")}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
