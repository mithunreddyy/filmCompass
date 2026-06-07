"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, ArrowRight } from "lucide-react";
import { PageHeader, PageShell } from "@/components/layout/page-shell";
import { buildDiscoverUrl } from "@/lib/discover-params";

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

function collectionDiscoverUrl(collection: Collection): string {
  return buildDiscoverUrl({
    genres: [...collection.genres],
    language: collection.language,
    ratingMin: collection.ratingMin,
    sortBy: "vote_average.desc",
  });
}

export function CollectionsContent({ collections }: CollectionsContentProps) {
  return (
    <PageShell>
      <PageHeader
        kicker="Curated"
        title="Lists"
        description="Curated discover filters — jump into themed Telugu and world cinema collections."
      />

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection, i) => (
          <motion.div
            key={collection.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={collectionDiscoverUrl(collection)}
              className="group fc-card-interactive flex h-full flex-col !p-6"
            >
              <div className="flex items-start justify-between">
                <Bookmark size={18} className="shrink-0 text-brand-violet" />
                <ArrowRight
                  size={16}
                  className="text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-brand-violet"
                />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground group-hover:text-brand-violet">
                {collection.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {collection.description}
              </p>
              <p className="mt-4 text-xs text-muted-foreground">
                Opens in Discover with pre-set filters
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10 fc-glass border-dashed p-8 text-center"
      >
        <p className="text-sm text-muted-foreground">
          User-created lists coming soon. Sign in to create and share your own
          curated collections.
        </p>
      </motion.div>
    </PageShell>
  );
}
