import { searchMovies } from "@/services/tmdb";
import { searchParamsSchema } from "@/schemas/movie";
import { TMDB_DEFAULT_ORIGINAL_LANG } from "@/lib/tmdb-config";
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
  const lang =
    typeof resolvedParams.lang === "string" ? resolvedParams.lang : undefined;

  const parsed = searchParamsSchema.safeParse({
    query,
    page:
      typeof resolvedParams.page === "string" ? resolvedParams.page : "1",
  });

  const page = parsed.success ? parsed.data.page : 1;

  let results = null;
  if (query.length >= 2) {
    try {
      const raw = await searchMovies(query, page);
      const movies =
        lang === TMDB_DEFAULT_ORIGINAL_LANG
          ? raw.movies.filter((m) => m.language === TMDB_DEFAULT_ORIGINAL_LANG)
          : raw.movies;

      results = {
        movies,
        page: raw.page,
        totalPages: raw.totalPages,
        totalResults:
          lang === TMDB_DEFAULT_ORIGINAL_LANG
            ? movies.length
            : raw.totalResults,
        filtered: lang === TMDB_DEFAULT_ORIGINAL_LANG,
      };
    } catch {
      results = null;
    }
  }

  return (
    <SearchPageContent
      initialQuery={query}
      initialResults={results}
      currentPage={page}
      teluguOnly={lang === TMDB_DEFAULT_ORIGINAL_LANG}
    />
  );
}
