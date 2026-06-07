"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star, Clock, Calendar, Info } from "lucide-react";
import type { Movie } from "@/types/movie";
import { getGenreById } from "@/types/movie";
import { useState } from "react";

interface MovieHeroProps {
  movie: Movie;
}

export function MovieHero({ movie }: MovieHeroProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const genreNames = movie.genreIds
    .slice(0, 3)
    .map((id) => getGenreById(id)?.name)
    .filter(Boolean);

  return (
    <section className="relative h-[75vh] min-h-[500px] w-full overflow-hidden">
      {/* Backdrop Image */}
      {movie.backdropUrl && (
        <Image
          src={movie.backdropUrl}
          alt={movie.title}
          fill
          priority
          quality={90}
          className={`object-cover transition-opacity duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Genre Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              {genreNames.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-white/20 px-3 py-0.5 text-xs font-medium text-white/80 backdrop-blur-sm"
                >
                  {genre}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="mt-4 flex items-center gap-4 text-sm text-white/70">
              {movie.rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                  <span className="font-semibold text-white">
                    {movie.rating.toFixed(1)}
                  </span>
                </span>
              )}
              {movie.year > 0 && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {movie.year}
                </span>
              )}
            </div>

            {/* Overview */}
            <p className="mt-4 line-clamp-3 text-base text-white/60 leading-relaxed md:text-lg">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href={`/movie/${movie.id}`}
                className="group flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
              >
                <Play size={16} className="fill-current" />
                View Details
              </Link>
              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30"
              >
                <Info size={16} />
                More Info
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
