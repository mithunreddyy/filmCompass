"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Play,
  ChevronRight,
} from "lucide-react";
import type { MovieDetail } from "@/types/movie";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { SectionHeader } from "@/components/shared/section-header";
import { RatingBadge } from "@/components/movies/rating-badge";
import { GenreBadge } from "@/components/shared/genre-badge";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MovieDetailContentProps {
  movie: MovieDetail;
}

type TabType = "overview" | "cast" | "reviews" | "similar";

export function MovieDetailContent({ movie }: MovieDetailContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showTrailer, setShowTrailer] = useState(false);

  const tabs: { id: TabType; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "cast", label: "Cast & Crew", count: movie.cast.length },
    { id: "reviews", label: "Reviews", count: movie.reviews.length },
    { id: "similar", label: "Similar", count: movie.similarMovies.length },
  ];

  function formatCurrency(amount: number): string {
    if (amount === 0) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatRuntime(minutes: number | null): string {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  return (
    <div className="flex flex-col">
      {/* Hero Backdrop */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {movie.backdropUrl && (
          <Image
            src={movie.backdropUrl}
            alt={movie.title}
            fill
            priority
            quality={90}
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
      </section>

      {/* Content */}
      <div className="relative -mt-48 mx-auto w-full max-w-7xl px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="shrink-0"
          >
            <div className="relative w-[200px] md:w-[280px] aspect-[2/3] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10 mx-auto md:mx-0">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="280px"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-muted/30">
                  <span className="text-muted-foreground text-center p-4 font-heading">
                    {movie.title}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            {/* Certification + Year */}
            <div className="flex items-center gap-3 mb-3">
              {movie.certification && (
                <span className="rounded border border-border/50 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  {movie.certification}
                </span>
              )}
              {movie.year > 0 && (
                <span className="text-sm text-muted-foreground">
                  {movie.year}
                </span>
              )}
              {movie.status && movie.status !== "Released" && (
                <span className="rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-medium text-amber-500">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="mt-2 text-lg text-muted-foreground italic">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Genres */}
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <GenreBadge
                  key={genre.id}
                  name={genre.name}
                  slug={genre.slug}
                  size="md"
                />
              ))}
            </div>

            {/* Rating + Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-5">
              <RatingBadge rating={movie.rating} size="lg" showLabel />

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {movie.runtime && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {formatRuntime(movie.runtime)}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </span>
              </div>
            </div>

            {/* Director */}
            {movie.director && (
              <div className="mt-4 text-sm">
                <span className="text-muted-foreground">Directed by </span>
                <span className="font-medium text-foreground">
                  {movie.director.name}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              {movie.trailer && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                >
                  <Play size={16} className="fill-current" />
                  Watch Trailer
                </button>
              )}
              {movie.imdbId && (
                <a
                  href={`https://www.imdb.com/title/${movie.imdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-card"
                >
                  <ExternalLink size={14} />
                  IMDb
                </a>
              )}
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-border/50 bg-card/50 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-all hover:border-border hover:bg-card"
                >
                  <ExternalLink size={14} />
                  Website
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12 border-b border-border/30">
          <div className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative px-5 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-amber-500"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    ({tab.count})
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Synopsis */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                  Synopsis
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                  {movie.overview || "No synopsis available."}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  {
                    label: "Budget",
                    value: formatCurrency(movie.budget),
                    icon: DollarSign,
                  },
                  {
                    label: "Revenue",
                    value: formatCurrency(movie.revenue),
                    icon: DollarSign,
                  },
                  {
                    label: "Vote Count",
                    value: movie.voteCount.toLocaleString(),
                    icon: Star,
                  },
                  {
                    label: "Runtime",
                    value: formatRuntime(movie.runtime),
                    icon: Clock,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/30 bg-card/30 p-4"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <stat.icon size={12} />
                      {stat.label}
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Keywords */}
              {movie.keywords.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full border border-border/30 bg-card/30 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Production Companies */}
              {movie.productionCompanies.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3">
                    Production
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.productionCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center gap-2 rounded-lg border border-border/30 bg-card/30 px-3 py-2"
                      >
                        {company.logoUrl ? (
                          <Image
                            src={company.logoUrl}
                            alt={company.name}
                            width={40}
                            height={20}
                            className="object-contain dark:invert"
                          />
                        ) : null}
                        <span className="text-xs text-muted-foreground">
                          {company.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "cast" && (
            <motion.div
              key="cast"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {movie.cast.map((member) => (
                  <div
                    key={`${member.id}-${member.character}`}
                    className="group flex flex-col items-center text-center rounded-xl border border-border/30 bg-card/30 p-4 transition-colors hover:border-amber-500/20"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted/30 mb-3">
                      {member.profileUrl ? (
                        <Image
                          src={member.profileUrl}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-lg font-heading font-semibold text-muted-foreground">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {member.character}
                    </p>
                  </div>
                ))}
              </div>

              {/* Crew */}
              {movie.crew.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Key Crew
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {movie.crew.map((member, i) => (
                      <div
                        key={`${member.id}-${member.job}-${i}`}
                        className="rounded-lg border border-border/30 bg-card/30 p-3"
                      >
                        <p className="text-sm font-medium text-foreground">
                          {member.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.job}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {movie.reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">
                  No reviews yet.
                </p>
              ) : (
                movie.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-xl border border-border/30 bg-card/30 p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-full bg-muted/50 flex items-center justify-center text-sm font-heading font-semibold text-foreground overflow-hidden">
                        {review.authorAvatar ? (
                          <Image
                            src={review.authorAvatar}
                            alt={review.author}
                            width={36}
                            height={36}
                            className="object-cover"
                          />
                        ) : (
                          review.author.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {review.author}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {review.authorRating && (
                        <div className="ml-auto flex items-center gap-1">
                          <Star
                            size={12}
                            className="fill-amber-400 text-amber-400"
                          />
                          <span className="text-sm font-semibold text-foreground">
                            {review.authorRating}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-6">
                      {review.content}
                    </p>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === "similar" && (
            <motion.div
              key="similar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {movie.similarMovies.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Similar Movies
                  </h3>
                  <MovieCarousel movies={movie.similarMovies} />
                </div>
              )}
              {movie.recommendations.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                    Recommended For You
                  </h3>
                  <MovieCarousel movies={movie.recommendations} />
                </div>
              )}
              {movie.similarMovies.length === 0 &&
                movie.recommendations.length === 0 && (
                  <p className="text-muted-foreground text-center py-12">
                    No similar movies found.
                  </p>
                )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setShowTrailer(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailer.key}?autoplay=1&rel=0`}
              title={movie.trailer.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
