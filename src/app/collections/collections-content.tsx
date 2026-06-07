"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Share2, Users, ArrowRight } from "lucide-react";

interface Collection {
  slug: string;
  title: string;
  description: string;
  language?: string;
  genres: readonly number[];
  ratingMin?: number;
}

interface CollectionsContentProps {
  collections: Collection[];
}

function buildDiscoverUrl(collection: Collection): string {
  const params = new URLSearchParams();
  if (collection.genres.length) {
    params.set("genres", collection.genres.join(","));
  }
  if (collection.language) {
    params.set("language", collection.language);
  }
  if (collection.ratingMin) {
    params.set("ratingMin", String(collection.ratingMin));
  }
  params.set("sortBy", "vote_average.desc");
  return `/discover?${params.toString()}`;
}

export function CollectionsContent({ collections }: CollectionsContentProps) {
  return (
    <div className="pt-28 pb-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Collections
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Curated lists of films — from Telugu thrillers to Oscar snubs.
            Create, share, and follow collections.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, i) => (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={buildDiscoverUrl(collection)}
                className="group flex flex-col h-full rounded-2xl border border-border/30 bg-card/30 p-6 transition-all hover:border-amber-500/30 hover:bg-amber-500/5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <Bookmark
                    size={20}
                    className="text-amber-500 shrink-0"
                  />
                  <ArrowRight
                    size={16}
                    className="text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-amber-500"
                  />
                </div>
                <h2 className="mt-4 font-heading text-lg font-semibold text-foreground group-hover:text-amber-500">
                  {collection.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground flex-1">
                  {collection.description}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Share2 size={12} />
                    Share
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={12} />
                    Follow
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 rounded-2xl border border-dashed border-border/50 p-8 text-center"
        >
          <p className="text-muted-foreground text-sm">
            User-created collections coming soon. Sign in to create and share
            your own curated lists.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
