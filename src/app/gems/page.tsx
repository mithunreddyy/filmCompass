import { getTeluguHiddenGemsPaginated } from "@/services/telugu-gems";
import { GemsPageContent } from "./gems-page-content";

export const revalidate = 300;

export const metadata = {
  title: "Telugu Hidden Gems",
  description: "Highly rated Telugu films with lower mainstream visibility.",
};

export default async function GemsPage() {
  let results;
  try {
    results = await getTeluguHiddenGemsPaginated(1);
  } catch {
    results = { movies: [], page: 1, totalPages: 0, totalResults: 0 };
  }

  return (
    <GemsPageContent
      movies={results.movies}
      totalResults={results.totalResults}
      totalPages={results.totalPages}
      currentPage={1}
    />
  );
}
