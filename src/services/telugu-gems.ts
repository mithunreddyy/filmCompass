import { cacheGet, cacheSet, CACHE_TTL } from "@/lib/redis-cache";
import {
  pickWeightedGem,
  passesHiddenGemGate,
  scoreCataloguePool,
  type ScoredGem,
} from "@/services/gem-engine";
import { fetchTeluguCatalogue1950Present } from "@/services/telugu-catalogue";

export type ScoredTeluguGem = ScoredGem;

const SCORED_CATALOGUE_CACHE = "tmdb:telugu-catalogue-scored:v3";
const PER_PAGE = 20;

async function getScoredCatalogue(): Promise<ScoredGem[]> {
  const cached = await cacheGet<ScoredGem[]>(SCORED_CATALOGUE_CACHE);
  if (cached && cached.length > 0) return cached;

  const raw = await fetchTeluguCatalogue1950Present();
  const scored = scoreCataloguePool(raw);

  await cacheSet(SCORED_CATALOGUE_CACHE, scored, CACHE_TTL.CATALOGUE);
  return scored;
}

/** Hidden-gem subset — high quality, lower mainstream visibility */
export async function fetchTeluguHiddenGemsPool(): Promise<ScoredGem[]> {
  const catalogue = await getScoredCatalogue();
  return catalogue.filter(passesHiddenGemGate);
}

export async function getTeluguHiddenGemsPaginated(page: number = 1) {
  const pool = await fetchTeluguHiddenGemsPool();
  const start = (page - 1) * PER_PAGE;

  return {
    movies: pool.slice(start, start + PER_PAGE),
    page,
    totalPages: Math.max(1, Math.ceil(pool.length / PER_PAGE)),
    totalResults: pool.length,
  };
}

/** Random pick from full 1950–present scored catalogue */
export async function pickRandomTeluguHiddenGem(
  excludeIds: number[] = []
): Promise<ScoredGem | null> {
  const pool = await getScoredCatalogue();
  if (pool.length === 0) return null;
  return pickWeightedGem(pool, excludeIds, { wideSample: true });
}

export async function getTeluguGemsCatalogueSize(): Promise<number> {
  const pool = await getScoredCatalogue();
  return pool.length;
}

