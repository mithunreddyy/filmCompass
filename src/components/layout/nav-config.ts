import type { LucideIcon } from "lucide-react";
import {
  Home,
  Compass,
  Globe,
  LayoutGrid,
  Bot,
  Sparkles,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home, match: (p) => p === "/" },
  {
    href: "/discover",
    label: "Discover",
    icon: Compass,
    match: (p) => p.startsWith("/discover") || p.startsWith("/genre"),
  },
  {
    href: "/explore",
    label: "Explore",
    icon: Globe,
    match: (p) => p.startsWith("/explore"),
  },
  {
    href: "/collections",
    label: "Lists",
    icon: LayoutGrid,
    match: (p) => p.startsWith("/collections"),
  },
  {
    href: "/assistant",
    label: "Assistant",
    icon: Bot,
    match: (p) => p.startsWith("/assistant"),
  },
  {
    href: "/gems",
    label: "Gems",
    icon: Sparkles,
    match: (p) => p.startsWith("/gems"),
  },
];

/** Dock nav — search lives in header */
export const DOCK_ITEMS: NavItem[] = NAV_ITEMS;
