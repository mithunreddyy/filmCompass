"use client";

import { motion } from "framer-motion";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { MovieGrid } from "@/components/movies/movie-grid";
import { SectionHeader } from "@/components/shared/section-header";
import type { Movie } from "@/types/movie";

interface MovieSectionProps {
  movies: Movie[];
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  showReleaseDate?: boolean;
  limit?: number;
}

export function MovieSection({
  movies,
  title,
  subtitle,
  href,
  linkText,
  showReleaseDate = false,
  limit = 20,
}: MovieSectionProps) {
  if (!movies.length) return null;

  const display = movies.slice(0, limit);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
    >
      <SectionHeader
        title={title}
        subtitle={subtitle}
        href={href}
        linkText={linkText}
      />
      <div className="lg:hidden">
        <MovieCarousel movies={display} showReleaseDate={showReleaseDate} />
      </div>
      <div className="hidden lg:block">
        <MovieGrid movies={display} showReleaseDate={showReleaseDate} />
      </div>
    </motion.section>
  );
}
