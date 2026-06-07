import type { PaginatedApiResponse } from "@/types/api";
import type { Movie, MovieDetail } from "@/types/movie";

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: string;
    };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export async function fetchDiscoverPage(
  params: URLSearchParams
): Promise<PaginatedApiResponse<Movie>> {
  const res = await fetch(`/api/movies/discover?${params.toString()}`);
  const data = await parseJson<PaginatedApiResponse<Movie>>(res);
  if (!data.success) throw new Error(data.error ?? "Discover failed");
  return data;
}

export async function fetchSearchResults(
  query: string,
  page: number = 1,
  year?: number
): Promise<PaginatedApiResponse<Movie>> {
  const params = new URLSearchParams({ query, page: String(page) });
  if (year) params.set("year", String(year));
  const res = await fetch(`/api/movies/search?${params}`);
  const data = await parseJson<PaginatedApiResponse<Movie>>(res);
  if (!data.success) throw new Error(data.error ?? "Search failed");
  return data;
}

export async function fetchMovieDetail(id: number): Promise<MovieDetail> {
  const res = await fetch(`/api/movies/${id}`);
  const data = await parseJson<{ success: boolean; data: MovieDetail; error?: string }>(
    res
  );
  if (!data.success) throw new Error(data.error ?? "Movie fetch failed");
  return data.data;
}
