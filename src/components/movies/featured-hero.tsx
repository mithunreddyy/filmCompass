"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RatingPill } from "@/components/movies/rating-pill";
import { GenreBadge } from "@/components/shared/genre-badge";
import { QuickNav } from "@/components/layout/quick-nav";
import { LANGUAGES, getGenreById } from "@/types/movie";
import type { Movie } from "@/types/movie";
import { cn } from "@/lib/utils";

const TE = "language=te";
const ROTATE_MS = 7000;

interface FeaturedHeroProps {
  movies: Movie[];
}

export function FeaturedHero({ movies }: FeaturedHeroProps) {
  const reduceMotion = useReducedMotion();
  const slides = movies.slice(0, 3);
  const slideCount = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const featured = slides[index] ?? slides[0];
  const canRotate = slideCount > 1 && !reduceMotion;

  function goTo(next: number) {
    if (!slideCount) return;
    setIndex((next + slideCount) % slideCount);
  }

  useEffect(() => {
    if (!canRotate || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slideCount);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, [canRotate, paused, slideCount]);

  if (!featured) return null;

  const genres = featured.genreIds
    .slice(0, 4)
    .map((id) => getGenreById(id))
    .filter(Boolean);

  const languageName =
    LANGUAGES.find((l) => l.code === featured.language)?.name ??
    (featured.language === "te" ? "Telugu" : featured.language?.toUpperCase());

  return (
    <section
      className="relative overflow-hidden border-b border-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
    >
      <div className="fc-glow absolute inset-0 pointer-events-none" />

      <AnimatePresence mode="sync">
        {featured.backdropUrl && (
          <motion.div
            key={`backdrop-${featured.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.8 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 md:hidden">
              <Image
                src={featured.backdropUrl}
                alt=""
                fill
                priority
                className="object-cover object-top opacity-[0.14]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/92 to-background/75" />
            </div>
            <div className="absolute inset-0 hidden md:block">
              <Image
                src={featured.backdropUrl}
                alt=""
                fill
                priority
                className="object-cover object-top opacity-20"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative fc-content py-4 sm:py-6 md:py-7">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="fc-kicker">
            Trending · Telugu
          </p>
          {canRotate && (
            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label="Featured films"
            >
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Show ${slide.title}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === index
                      ? "w-5 bg-brand-violet"
                      : "w-1.5 bg-muted-foreground/35 hover:bg-muted-foreground/55"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        <QuickNav className="mb-4 sm:mb-5" />

        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-4 sm:flex-row sm:gap-6"
          >
            <Link
              href={`/movie/${featured.id}`}
              className="group mx-auto w-[130px] shrink-0 sm:mx-0 sm:w-[155px] md:w-[185px]"
            >
              <div className="fc-poster">
                {(featured.posterUrl ?? featured.backdropUrl) && (
                  <Image
                    src={featured.posterUrl ?? featured.backdropUrl!}
                    alt={featured.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width:768px) 130px, 185px"
                  />
                )}
              </div>
            </Link>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                {genres.map((g) =>
                  g ? (
                    <GenreBadge key={g.id} name={g.name} slug={g.slug} size="sm" />
                  ) : null
                )}
              </div>

              <h1 className="fc-hero-title mt-2 font-bold tracking-tight">
                <Link
                  href={`/movie/${featured.id}`}
                  className="text-foreground transition-colors hover:text-brand-violet"
                >
                  {featured.title}
                </Link>
              </h1>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                {featured.year > 0 && (
                  <span className="text-sm text-muted-foreground">{featured.year}</span>
                )}
                {featured.rating > 0 && (
                  <RatingPill rating={featured.rating} size="md" />
                )}
                {featured.language && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-mint">
                    {languageName}
                  </span>
                )}
              </div>

              {featured.overview && (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:line-clamp-4 md:max-w-2xl md:text-[15px]">
                  {featured.overview}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
                <Link href={`/movie/${featured.id}`} className="fc-btn-primary gap-2">
                  View film
                </Link>
                <Link href={`/discover?${TE}`} className="fc-btn-ghost">
                  Browse Telugu
                </Link>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
