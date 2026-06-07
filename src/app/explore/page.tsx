import { LANGUAGES } from "@/types/movie";
import { ExplorePageContent } from "./explore-page-content";

export const metadata = {
  title: "Global Movie Explorer",
  description:
    "Browse cinema from around the world — by language, country, and decade.",
};

export default function ExplorePage() {
  return <ExplorePageContent languages={LANGUAGES} />;
}
