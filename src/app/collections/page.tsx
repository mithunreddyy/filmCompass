import { CollectionsContent } from "./collections-content";

export const metadata = {
  title: "Collections",
  description:
    "Curated movie collections — Best Telugu Thrillers, Korean Hidden Gems, and more.",
};

const FEATURED_COLLECTIONS = [
  {
    slug: "telugu-thrillers",
    title: "Best Telugu Thrillers",
    description: "Edge-of-your-seat Telugu cinema",
    language: "te",
    genres: [53, 80],
  },
  {
    slug: "korean-hidden-gems",
    title: "Korean Hidden Gems",
    description: "Underrated Korean masterpieces",
    language: "ko",
    genres: [],
    ratingMin: 7.5,
  },
  {
    slug: "underrated-sci-fi",
    title: "Underrated Sci-Fi",
    description: "Mind-bending science fiction you may have missed",
    language: undefined,
    genres: [878],
    ratingMin: 7,
  },
  {
    slug: "psychological-dramas",
    title: "Psychological Dramas",
    description: "Deep, character-driven psychological films",
    language: undefined,
    genres: [18, 53],
  },
  {
    slug: "neo-noir-classics",
    title: "Neo-Noir Classics",
    description: "Dark, stylish neo-noir cinema",
    language: undefined,
    genres: [80, 53],
  },
  {
    slug: "festival-favorites",
    title: "Festival Favorites",
    description: "Award-winning festival circuit films",
    language: undefined,
    genres: [18],
    ratingMin: 7.5,
  },
] as const;

export default function CollectionsPage() {
  return <CollectionsContent collections={[...FEATURED_COLLECTIONS]} />;
}
