import { searchMovies } from "@/services/tmdb";
import { SearchPageContent } from "./search-page-content";

export const metadata = {
  title: "Search Movies",
  description: "Search for movies by title, actor, director, and more.",
};

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query =
    typeof resolvedParams.q === "string" ? resolvedParams.q : "";
  const page = Math.max(
    1,
    Number(
      typeof resolvedParams.page === "string" ? resolvedParams.page : "1"
    )
  );

  let results = null;
  if (query.length >= 2) {
    try {
      results = await searchMovies(query, page);
    } catch {
      results = null;
    }
  }

  return (
    <SearchPageContent
      initialQuery={query}
      initialResults={results}
      currentPage={page}
    />
  );
}
