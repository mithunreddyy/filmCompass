"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  Award,
  Compass,
  Bot,
  ArrowRight,
} from "lucide-react";
import { MovieCarousel } from "@/components/movies/movie-carousel";
import { SectionHeader } from "@/components/shared/section-header";
import type { Movie } from "@/types/movie";

interface DashboardContentProps {
  trending: Movie[];
  hiddenGems: Movie[];
  topRated: Movie[];
}

const QUICK_LINKS = [
  {
    href: "/discover?sortBy=vote_average.desc&ratingMin=7.5",
    label: "Hidden Gems Today",
    icon: Sparkles,
    description: "Highly rated, low-profile films",
  },
  {
    href: "/discover?sortBy=popularity.desc",
    label: "Trending This Week",
    icon: TrendingUp,
    description: "Most popular right now",
  },
  {
    href: "/discover?sortBy=vote_average.desc&ratingMin=7",
    label: "Underrated Engine",
    icon: Award,
    description: "Our custom underrated scoring",
  },
  {
    href: "/assistant",
    label: "AI Assistant",
    icon: Bot,
    description: "Ask for personalized picks",
  },
];

export function DashboardContent({
  trending,
  hiddenGems,
  topRated,
}: DashboardContentProps) {
  return (
    <div className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Your Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Continue exploring, discover hidden gems, and find your next favorite
            film.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={link.href}
                className="group flex flex-col rounded-2xl border border-border/30 bg-card/30 p-5 transition-all hover:border-amber-500/30 hover:bg-amber-500/5"
              >
                <link.icon
                  size={22}
                  className="text-amber-500 mb-3"
                />
                <span className="font-medium text-foreground group-hover:text-amber-500">
                  {link.label}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {link.description}
                </span>
                <ArrowRight
                  size={14}
                  className="mt-3 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-amber-500"
                />
              </Link>
            </motion.div>
          ))}
        </section>

        {trending.length > 0 && (
          <section>
            <SectionHeader
              title="Trending This Week"
              subtitle="Most talked about films"
              href="/discover?sortBy=popularity.desc"
            />
            <MovieCarousel movies={trending} />
          </section>
        )}

        {hiddenGems.length > 0 && (
          <section>
            <SectionHeader
              title="Hidden Gems Today"
              subtitle="Critically acclaimed but undiscovered"
              href="/discover?sortBy=vote_average.desc&ratingMin=7.5"
            />
            <MovieCarousel movies={hiddenGems} />
          </section>
        )}

        {topRated.length > 0 && (
          <section>
            <SectionHeader
              title="Top Picks"
              subtitle="Highest rated films of all time"
              href="/discover?sortBy=vote_average.desc"
            />
            <MovieCarousel movies={topRated} />
          </section>
        )}

        <section className="rounded-2xl border border-border/30 bg-gradient-to-br from-amber-500/5 to-transparent p-8 text-center">
          <Compass size={32} className="mx-auto text-amber-500 mb-4" />
          <h2 className="font-heading text-xl font-semibold text-foreground">
            Continue Exploring
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Sign in to save watchlists, rate films, and get personalized AI
            recommendations tailored to your taste.
          </p>
          <Link
            href="/discover"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-400"
          >
            Start Discovering
            <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
