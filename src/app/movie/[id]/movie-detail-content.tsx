"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  Play,
} from "lucide-react";
import type { MovieDetail } from "@/types/movie";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { RatingPill } from "@/components/movies/rating-pill";
import { GenreBadge } from "@/components/shared/genre-badge";
import { useState } from "react";
import {
  MovieDetailTabs,
  type MovieDetailTab,
} from "@/components/movies/detail/movie-detail-tabs";
import { MovieTrailerModal } from "@/components/movies/detail/movie-trailer-modal";
import { OMDbEnrichmentPanel } from "@/components/movies/detail/omdb-enrichment-panel";
import type { OMDbEnrichment } from "@/services/omdb";

interface MovieDetailContentProps {
  movie: MovieDetail;
  omdb?: OMDbEnrichment | null;
}

export function MovieDetailContent({ movie, omdb }: MovieDetailContentProps) {
  const [activeTab, setActiveTab] = useState<MovieDetailTab>("overview");
  const [showTrailer, setShowTrailer] = useState(false);

  const tabs: { id: MovieDetailTab; label: string; count?: number }[] = [
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
      <section className="relative h-[42vh] min-h-[240px] w-full overflow-hidden sm:h-[48vh] sm:min-h-[320px] md:h-[52vh] md:min-h-[380px]">
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
        <div className="absolute inset-0 fc-vignette pointer-events-none opacity-60" />
      </section>

      {/* Content */}
      <div className="relative -mt-28 mx-auto w-full max-w-7xl px-3 sm:-mt-36 sm:px-4 md:-mt-44 md:px-5">
        <div className="flex flex-col gap-5 md:flex-row md:gap-6">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="shrink-0"
          >
            <div className="relative mx-auto w-[140px] sm:w-[170px] md:mx-0 md:w-[220px] lg:w-[240px]">
              <div className="fc-poster !rounded-lg shadow-2xl">
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
                  <span className="p-4 text-center text-muted-foreground">
                    {movie.title}
                  </span>
                </div>
              )}
              </div>
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
                <span className="rounded-full bg-brand-violet/10 px-3 py-0.5 text-xs font-medium text-brand-violet">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="fc-page-title font-bold text-foreground sm:text-2xl md:text-3xl lg:text-4xl">
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
              <RatingPill rating={movie.rating} size="md" />

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
                  className="fc-btn-primary flex items-center gap-2 !rounded-full px-6 py-2.5"
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
                  className="fc-btn-ghost flex items-center gap-2 !rounded-full px-5 py-2.5"
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
                  className="fc-btn-ghost flex items-center gap-2 !rounded-full px-5 py-2.5"
                >
                  <ExternalLink size={14} />
                  Website
                </a>
              )}
            </div>
          </motion.div>
        </div>

        <MovieDetailTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Tab Content */}
        <div className="py-5 sm:py-6">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              role="tabpanel"
              id="panel-overview"
              aria-labelledby="tab-overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {omdb && <OMDbEnrichmentPanel enrichment={omdb} />}

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">
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
                    className="fc-card !p-4"
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
                  <h3 className="mb-3 text-lg font-semibold text-foreground">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
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
                  <h3 className="mb-3 text-lg font-semibold text-foreground">
                    Production
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    {movie.productionCompanies.map((company) => (
                      <div
                        key={company.id}
                        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
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
              role="tabpanel"
              id="panel-cast"
              aria-labelledby="tab-cast"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {movie.cast.map((member) => (
                  <div
                    key={`${member.id}-${member.character}`}
                    className="group fc-card flex flex-col items-center p-4 text-center transition-colors hover:border-brand-violet/30"
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
                        <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted-foreground">
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
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Key Crew
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {movie.crew.map((member, i) => (
                      <div
                        key={`${member.id}-${member.job}-${i}`}
                        className="rounded-lg border border-border bg-surface p-3"
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
              role="tabpanel"
              id="panel-reviews"
              aria-labelledby="tab-reviews"
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
                    className="fc-card p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted/50 text-sm font-semibold text-foreground">
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
                            className="fill-brand-mint text-brand-mint"
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
              role="tabpanel"
              id="panel-similar"
              aria-labelledby="tab-similar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              {movie.similarMovies.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Similar Movies
                  </h3>
                  <MovieCarousel movies={movie.similarMovies} />
                </div>
              )}
              {movie.recommendations.length > 0 && (
                <div>
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
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
        <MovieTrailerModal
          trailer={movie.trailer}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}
