Build a production-grade, open-source movie discovery and recommendation platform that aggregates real movie metadata from OMDb API and additional enrichment sources. The platform must focus on movie discovery, underrated films, hidden gems, personalized recommendations, genre exploration, language-based browsing, advanced filtering, trending content, and intelligent search.

Tech Stack

Frontend:

- Next.js 15 App Router
- TypeScript (strict mode enabled)
- Tailwind CSS v4
- shadcn/ui
- Framer Motion
- React Query (TanStack Query)
- Zustand
- React Hook Form
- Zod
- Lucide Icons
- Next Themes
- Recharts
- Embla Carousel
- Sonner
- Radix UI

Backend:

- Next.js Route Handlers
- PostgreSQL
- Prisma ORM
- Redis Cache
- NextAuth/Auth.js
- OMDb API
- TMDb API for enrichment
- OpenAI API for recommendation engine
- Upstash Redis
- Sentry
- Resend

Infrastructure:

- Vercel
- Neon PostgreSQL
- Cloudflare CDN
- GitHub Actions
- Docker
- Turborepo-ready architecture

Project Goals

Create a modern minimalist movie platform that feels like a combination of Letterboxd, IMDb, Netflix discovery, and Spotify recommendations.

The platform must never use hardcoded movie datasets.

All movie information must be fetched dynamically from APIs and cached efficiently.

Core Features

1. Intelligent Movie Search

- Instant search

- Fuzzy matching

- Typo tolerance

- Search by:
  - title
  - actor
  - director
  - year
  - language
  - country
  - genre

- Search suggestions

- Recent searches

- Search history

2. Advanced Discovery Engine

Filters:

- Genre
- Language
- Country
- Release Year
- Runtime
- IMDb Rating
- Rotten Tomatoes Score
- Metacritic Score
- Popularity
- Awards Won

Sorting:

- Highest Rated
- Most Popular
- Most Awarded
- Trending
- Newest
- Oldest
- Hidden Gems
- Most Underrated
- Critic Favorites
- Audience Favorites

3. Underrated Movies Engine

Custom scoring formula:

Underrated Score =

High Ratings

- Critic Score
- ## Award Recognition

Popularity Weight

Display:

- Hidden Gems
- Forgotten Masterpieces
- Cult Classics
- Critically Acclaimed but Undiscovered

4. AI Recommendation Engine

OpenAI-powered recommendations.

Inputs:

- Favorite genres
- Watch history
- Liked movies
- Saved movies
- Ratings
- Search behavior

Recommendations:

- Because you liked X
- Similar storytelling
- Similar cinematography
- Similar themes
- Similar pacing
- Similar emotional tone

5. Personalized Dashboard

Sections:

- Continue Exploring
- Recently Viewed
- Recommended For You
- Hidden Gems Today
- Trending This Week
- New Discoveries
- Top Picks By Genre

6. Movie Detail Page

Hero section

Include:

- Poster
- Backdrop
- Trailer
- Synopsis
- Cast
- Crew
- Runtime
- Budget
- Revenue
- Ratings

Tabs:

- Overview
- Cast
- Reviews
- Similar Movies
- Recommendations
- Awards

7. Collections

Examples:

- Best Telugu Thrillers
- Korean Hidden Gems
- Underrated Sci-Fi
- Psychological Dramas
- Neo-Noir Classics
- Oscar Snubs
- Festival Favorites

Users can:

- Create collections
- Share collections
- Follow collections

Features:

- Watchlist
- Favorites
- Ratings
- Reviews
- Custom Lists

9. Community Layer

Users can:

- Follow users
- Like reviews
- Comment
- Share lists
- Activity feed

10. Trending Engine

Calculate trends using:

- Searches
- Saves
- Watchlists
- Ratings
- Review activity

11. Global Movie Explorer

Browse by:

- Language
- Country
- Decade
- Genre
- Director
- Actor

Examples:

- Telugu Movies
- Malayalam Movies
- Korean Cinema
- Japanese Cinema
- French Cinema

12. AI Movie Assistant

Chat interface.

Examples:

- Recommend mind-bending thrillers.
- Movies like Interstellar.
- Underrated Telugu films.
- Dark psychological dramas after 2015.
- Movies similar to Memories of Murder.

Assistant uses real database context and embeddings.

Database Design

Tables:

users
profiles
movies
genres
languages
countries
actors
directors
studios
movie_cast
movie_crew
movie_genres
movie_languages
movie_ratings
movie_reviews
watchlists
favorites
collections
collection_movies
followers
notifications
search_history
recommendations
activity_logs

TypeScript Requirements

Mandatory:

- Strict mode
- No "any"
- No type assertions unless necessary
- Exhaustive unions
- Branded IDs
- Typed API responses
- Zod validation everywhere
- End-to-end type safety

Architecture

src/

app/
components/
features/
server/
services/
hooks/
store/
lib/
types/
schemas/
prisma/
emails/
styles/

Architecture Pattern

Feature-based architecture:

features/
movies/
recommendations/
search/
watchlist/
collections/
auth/
users/

UI/UX Requirements

Design Philosophy:

- Apple-level simplicity
- Linear-level polish
- Letterboxd-inspired discovery
- Spotify recommendation experience

Visual Style:

- Minimalist
- Large typography
- Generous spacing
- Smooth animations
- Glassmorphism accents
- Dark-first design

Microinteractions:

- Hover previews
- Skeleton loading
- Smooth page transitions
- Shared layout animations
- Infinite scrolling
- Progressive image loading

Accessibility

- WCAG AA
- Keyboard navigation
- Screen reader support
- Proper ARIA labels
- Reduced motion support

Performance Targets

- Lighthouse 95+
- First Contentful Paint <1.5s
- Time To Interactive <2.5s
- Image optimization
- Route-level code splitting
- Server Components first
- Streaming where applicable

SEO

- Dynamic metadata
- Open Graph
- JSON-LD
- Sitemap
- Robots
- Canonical URLs

Caching Strategy

Redis cache:

- Search results
- Trending movies
- Recommendations
- Popular genres

Revalidation:

- ISR
- Tag-based revalidation
- Smart cache invalidation

Testing

- Vitest
- Playwright
- React Testing Library
- Prisma testing database

CI/CD

GitHub Actions:

- Lint
- Type check
- Tests
- Build verification

Developer Requirements

Generate:

- Production-ready architecture
- Scalable folder structure
- Complete Prisma schema
- Database migrations
- Reusable component system
- API route structure
- Authentication flow
- Recommendation engine
- Search engine
- Redis caching layer
- Error handling system
- Logging system
- Monitoring setup
- Unit tests
- E2E tests

Important Constraints

- Never use mock movie data
- Never use placeholder datasets
- Fetch real movie information through OMDb and enrichment APIs
- Do not use TypeScript any
- Maintain strict typing across the entire application
- Follow industry-standard architecture patterns
- Use server actions where beneficial
- Use React Server Components by default
- Build for open-source contribution
- Include comprehensive documentation
- Include Docker deployment
- Include environment validation with Zod
- Follow clean architecture and SOLID principles

Final Outcome

Deliver a complete, production-grade, open-source movie discovery platform with intelligent recommendations, underrated movie exploration, multilingual browsing, advanced filtering, AI-assisted discovery, scalable architecture, enterprise-level code quality, and modern minimalist UX suitable for tens of thousands of concurrent users.
