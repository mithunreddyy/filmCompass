// ============================================
// TMDb Movie Types
// ============================================

export interface TMDbMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
  genre_ids: number[];
  original_language: string;
  video: boolean;
  media_type?: string;
}

export interface TMDbMovieDetail extends TMDbMovie {
  budget: number;
  revenue: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
  genres: TMDbGenre[];
  production_companies: TMDbProductionCompany[];
  production_countries: TMDbProductionCountry[];
  spoken_languages: TMDbSpokenLanguage[];
  belongs_to_collection: TMDbCollection | null;
  credits?: TMDbCredits;
  videos?: TMDbVideoResults;
  similar?: TMDbPaginatedResponse<TMDbMovie>;
  recommendations?: TMDbPaginatedResponse<TMDbMovie>;
  reviews?: TMDbPaginatedResponse<TMDbReview>;
  images?: TMDbImages;
  keywords?: TMDbKeywords;
  release_dates?: TMDbReleaseDates;
}

export interface TMDbGenre {
  id: number;
  name: string;
}

export interface TMDbProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface TMDbProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface TMDbSpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TMDbCollection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface TMDbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
  popularity: number;
}

export interface TMDbCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  popularity: number;
}

export interface TMDbCredits {
  cast: TMDbCastMember[];
  crew: TMDbCrewMember[];
}

export interface TMDbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDbVideoResults {
  results: TMDbVideo[];
}

export interface TMDbImage {
  file_path: string;
  width: number;
  height: number;
  aspect_ratio: number;
  vote_average: number;
  vote_count: number;
}

export interface TMDbImages {
  backdrops: TMDbImage[];
  posters: TMDbImage[];
  logos: TMDbImage[];
}

export interface TMDbReview {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface TMDbKeywords {
  keywords: Array<{ id: number; name: string }>;
}

export interface TMDbReleaseDates {
  results: Array<{
    iso_3166_1: string;
    release_dates: Array<{
      certification: string;
      release_date: string;
      type: number;
    }>;
  }>;
}

export interface TMDbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// ============================================
// App-level Movie Types (normalized)
// ============================================

export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string;
  year: number;
  rating: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
  language: string;
}

export interface MovieDetail extends Movie {
  budget: number;
  revenue: number;
  runtime: number | null;
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdbId: string | null;
  genres: Genre[];
  cast: CastMember[];
  crew: CrewMember[];
  director: CrewMember | null;
  videos: Video[];
  trailer: Video | null;
  similarMovies: Movie[];
  recommendations: Movie[];
  reviews: Review[];
  productionCompanies: ProductionCompany[];
  spokenLanguages: SpokenLanguage[];
  certification: string | null;
  keywords: string[];
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profileUrl: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface Review {
  id: string;
  author: string;
  authorAvatar: string | null;
  authorRating: number | null;
  content: string;
  createdAt: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logoUrl: string | null;
  country: string;
}

export interface SpokenLanguage {
  code: string;
  name: string;
  englishName: string;
}

// ============================================
// Filter & Sort Types
// ============================================

export type SortOption =
  | "popularity.desc"
  | "popularity.asc"
  | "vote_average.desc"
  | "vote_average.asc"
  | "primary_release_date.desc"
  | "primary_release_date.asc"
  | "revenue.desc"
  | "original_title.asc";

export interface DiscoverFilters {
  genres: number[];
  yearFrom: number | null;
  yearTo: number | null;
  ratingMin: number;
  ratingMax: number;
  language: string | null;
  sortBy: SortOption;
  page: number;
}

export type TimeWindow = "day" | "week";

export type MediaType = "movie" | "tv" | "all";

// ============================================
// Genre Map (TMDb genre IDs)
// ============================================

export const GENRE_MAP: Record<number, Genre> = {
  28: { id: 28, name: "Action", slug: "action" },
  12: { id: 12, name: "Adventure", slug: "adventure" },
  16: { id: 16, name: "Animation", slug: "animation" },
  35: { id: 35, name: "Comedy", slug: "comedy" },
  80: { id: 80, name: "Crime", slug: "crime" },
  99: { id: 99, name: "Documentary", slug: "documentary" },
  18: { id: 18, name: "Drama", slug: "drama" },
  10751: { id: 10751, name: "Family", slug: "family" },
  14: { id: 14, name: "Fantasy", slug: "fantasy" },
  36: { id: 36, name: "History", slug: "history" },
  27: { id: 27, name: "Horror", slug: "horror" },
  10402: { id: 10402, name: "Music", slug: "music" },
  9648: { id: 9648, name: "Mystery", slug: "mystery" },
  10749: { id: 10749, name: "Romance", slug: "romance" },
  878: { id: 878, name: "Science Fiction", slug: "sci-fi" },
  10770: { id: 10770, name: "TV Movie", slug: "tv-movie" },
  53: { id: 53, name: "Thriller", slug: "thriller" },
  10752: { id: 10752, name: "War", slug: "war" },
  37: { id: 37, name: "Western", slug: "western" },
};

export const GENRES = Object.values(GENRE_MAP);

export function getGenreBySlug(slug: string): Genre | undefined {
  return GENRES.find((g) => g.slug === slug);
}

export function getGenreById(id: number): Genre | undefined {
  return GENRE_MAP[id];
}

// ============================================
// Language Map
// ============================================

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "te", name: "Telugu" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "ml", name: "Malayalam" },
  { code: "kn", name: "Kannada" },
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
] as const;
