"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { SectionHeader } from "@/components/shared/section-header";
import { SearchBar } from "@/components/search/search-bar";
import { GENRES, LANGUAGES, getGenreById } from "@/types/movie";
import type { Movie } from "@/types/movie";

interface HomeContentProps {
  trending: Movie[];
  topRated: Movie[];
  hiddenGems: Movie[];
  nowPlaying: Movie[];
  upcoming: Movie[];
}

export function HomeContent({
  trending,
  topRated,
  hiddenGems,
  nowPlaying,
  upcoming,
}: HomeContentProps) {
  const featured = trending[0] ?? topRated[0];

  const genreLabels =
    featured?.genreIds
      .slice(0, 3)
      .map((id) => getGenreById(id)?.name)
      .filter(Boolean)
      .join(" · ") ?? "";

  return (
    <div className="flex flex-col">
      {/* Hero — driven by live featured film */}
      {featured && (
        <section className="relative overflow-hidden">
          {/* Mobile / tablet backdrop */}
          {featured.backdropUrl && (
            <div className="absolute inset-0 lg:hidden">
              <Image
                src={featured.backdropUrl}
                alt=""
                fill
                priority
                className="object-cover object-top"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/30" />
            </div>
          )}

          <div className="relative mx-auto w-full max-w-7xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 md:px-8 lg:pt-24 lg:pb-16">
            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.65fr] lg:gap-12 xl:gap-16">
              {/* Copy — real movie metadata only */}
              <div className="relative z-10 min-w-0">
                {genreLabels && (
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:mb-4">
                    {genreLabels}
                  </p>
                )}

                <h1 className="font-display font-extrabold text-[clamp(2rem,6.5vw,3.75rem)] leading-[1.05] tracking-[-0.04em] text-foreground">
                  {featured.title}
                </h1>

                {featured.overview && (
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px] md:mt-5 line-clamp-3 sm:line-clamp-4">
                    {featured.overview}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground sm:mt-5">
                  {featured.year > 0 && <span>{featured.year}</span>}
                  {featured.rating > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-foreground/70 text-foreground/70" />
                      {featured.rating.toFixed(1)}
                    </span>
                  )}
                  {featured.language && (
                    <span className="uppercase">{featured.language}</span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7">
                  <Link
                    href={`/movie/${featured.id}`}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
                  >
                    View film
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                </div>

                <div className="mt-7 w-full max-w-md sm:mt-8 md:max-w-lg">
                  <SearchBar variant="hero" />
                </div>
              </div>

              {/* Poster — tablet+ */}
              <div className="relative z-10 hidden md:block">
                <div className="relative mx-auto w-full max-w-[280px] lg:max-w-none">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-2xl liquid-glass-card p-1.5 lg:rounded-3xl">
                    {(featured.posterUrl ?? featured.backdropUrl) && (
                      <Image
                        src={featured.posterUrl ?? featured.backdropUrl!}
                        alt={featured.title}
                        fill
                        priority
                        className="rounded-xl object-cover lg:rounded-2xl"
                        sizes="(max-width: 1024px) 280px, 320px"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Fallback when no featured data */}
      {!featured && (
        <section className="mx-auto w-full max-w-7xl px-4 pt-16 pb-10 sm:px-6 md:px-8">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
            FilmCompass
          </h1>
          <div className="mt-6 max-w-md">
            <SearchBar variant="hero" />
          </div>
        </section>
      )}

      {/* Sections */}
      <div className="mx-auto w-full max-w-7xl space-y-14 px-4 py-10 sm:space-y-16 sm:px-6 sm:py-14 md:px-8 md:py-16 lg:space-y-20">
        {trending.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <SectionHeader
              title="Trending This Week"
              href="/discover?sortBy=popularity.desc"
            />
            <MovieCarousel movies={trending} />
          </motion.section>
        )}

        {nowPlaying.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <SectionHeader
              title="Now in Theaters"
              href="/discover?sortBy=primary_release_date.desc"
            />
            <MovieCarousel movies={nowPlaying} />
          </motion.section>
        )}

        {hiddenGems.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <SectionHeader
              title="Hidden Gems"
              href="/discover?sortBy=vote_average.desc&ratingMin=7.5"
              linkText="Explore"
            />
            <MovieCarousel movies={hiddenGems} />
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
        >
          <SectionHeader title="Browse by Genre" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {GENRES.slice(0, 15).map((genre) => (
              <Link
                key={genre.id}
                href={`/genre/${genre.slug}`}
                className="rounded-xl liquid-glass-card px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/[0.04] sm:px-4 sm:py-3.5"
              >
                {genre.name}
              </Link>
            ))}
          </div>
        </motion.section>

        {topRated.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <SectionHeader
              title="Top Rated"
              href="/discover?sortBy=vote_average.desc"
            />
            <MovieCarousel movies={topRated} />
          </motion.section>
        )}

        {upcoming.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45 }}
          >
            <SectionHeader
              title="Coming Soon"
              href="/discover?sortBy=primary_release_date.desc"
            />
            <MovieCarousel movies={upcoming} />
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
        >
          <SectionHeader title="Global Cinema" />
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <Link
                key={lang.code}
                href={`/discover?language=${lang.code}`}
                className="rounded-full liquid-glass-subtle px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-4 sm:py-2 sm:text-sm"
              >
                {lang.name}
              </Link>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
