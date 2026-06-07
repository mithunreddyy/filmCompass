import { Suspense } from "react";
import {
  HomeHero,
  HomeCatalogueShell,
  TeluguTrendingSection,
  TeluguNowPlayingSection,
  TeluguHiddenGemsSection,
  TeluguTopRatedSection,
  TeluguUpcomingSection,
  WorldCinemaSection,
} from "./home-sections";
import {
  HeroSkeletonBlock,
  SectionSkeleton,
} from "@/components/movies/section-skeleton";

export const revalidate = 600;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={<HeroSkeletonBlock />}>
        <HomeHero />
      </Suspense>

      <HomeCatalogueShell>
        <Suspense fallback={<SectionSkeleton title="Telugu Trending" />}>
          <TeluguTrendingSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Telugu In Theaters" />}>
          <TeluguNowPlayingSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Telugu Hidden Gems" />}>
          <TeluguHiddenGemsSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Top Rated Telugu" />}>
          <TeluguTopRatedSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="Upcoming Telugu" />}>
          <TeluguUpcomingSection />
        </Suspense>
        <Suspense fallback={<SectionSkeleton title="World Cinema" />}>
          <WorldCinemaSection />
        </Suspense>
      </HomeCatalogueShell>
    </div>
  );
}
