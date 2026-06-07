# FilmCompass

Telugu-first movie discovery platform built with Next.js 16, TMDb, OMDb, and open-source AI (Groq/Ollama).

## Features

- Telugu-first home, discover, and gems pages (English metadata)
- Global explore and world cinema sections
- Instant search with recent history
- AI assistant for recommendations + random hidden gem pitches (rate-limited)
- Underrated scoring engine merges 100+ Telugu hidden gems from multiple TMDb strategies
- OMDb enrichment on movie detail pages
- Responsive dock navigation + compact header search

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Enable AI (free forever — local Ollama)

Ollama does **not** need to run 24/7. It only needs to be running when someone uses **Assistant**, **Random gem**, or **Recommendations**. The rest of FilmCompass (browse, search, movie pages) works without it.

**One-time setup:**

```bash
# Install from https://ollama.com, then:
ollama pull llama3.2
```

Add to `.env.local` (already in `.env.example`):

```
AI_PROVIDER=ollama
OLLAMA_ENABLED=true
OLLAMA_MODEL=llama3.2
```

**Before using AI features**, start Ollama — either open the Ollama app (macOS menu bar) or run:

```bash
ollama serve
```

Check status: `GET /api/health` — `"ollama": true` means the model server is reachable.

If Ollama is stopped, FilmCompass still works; AI routes fall back to TMDb search + rule-based hidden-gem pitches (no cloud cost).

**Optional cloud fallback** — Groq has a free tier ([console.groq.com](https://console.groq.com)) but is not “free forever” like local Ollama. Set `GROQ_API_KEY` and `AI_PROVIDER=auto` if you want cloud when Ollama is offline.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TMDB_API_KEY` | Yes | TMDb API key |
| `TMDB_ACCESS_TOKEN` | No | TMDb v4 read token (preferred over API key) |
| `OPENAI_API_KEY` | No | Legacy OpenAI provider |
| `GROQ_API_KEY` | No | **Recommended** — free Groq API (Llama 3.3) |
| `OLLAMA_ENABLED` | No | Set `true` to use local Ollama in auto mode |
| `OLLAMA_BASE_URL` | No | Ollama OpenAI-compatible URL (default: `http://127.0.0.1:11434/v1`) |
| `AI_PROVIDER` | No | `auto` (default), `groq`, `ollama`, or `openai` |
| `OMDB_API_KEY` | No | Enables IMDb/OMDb enrichment |
| `UPSTASH_REDIS_REST_URL` | No | Redis cache for production |
| `UPSTASH_REDIS_REST_TOKEN` | No | Redis auth token |
| `NEXT_PUBLIC_APP_URL` | No | Canonical site URL (default: `http://localhost:3000`) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm test` | Vitest unit tests |

## Architecture

```
src/
├── app/           # App Router pages + API routes
├── components/    # UI (layout, movies, search)
├── hooks/         # Client hooks (search, debounce)
├── lib/           # env, cache, discover-params, api-client
├── schemas/       # Zod validation at API boundaries
├── services/      # tmdb, omdb, recommendations
├── store/         # search history (Zustand)
└── types/         # Shared TypeScript types
```

**Data flow**

- RSC pages fetch via `services/tmdb.ts` with ISR (`revalidate`)
- Client interactions use `/api/*` routes + `lib/api-client.ts`
- Caching: Upstash Redis in production, in-memory fallback in dev

**Health check:** `GET /api/health`

## Deployment

- `output: "standalone"` configured for Docker
- Set `UPSTASH_REDIS_*` in production to avoid per-instance TMDb fan-out
- AI routes are rate-limited (no auth required for public MVP)

## License

MIT
