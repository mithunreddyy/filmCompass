import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/layout/header";
import { NavDock } from "@/components/layout/nav-dock";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FilmCompass — Discover Your Next Favorite Film",
    template: "%s | FilmCompass",
  },
  description:
    "A modern movie discovery platform with intelligent recommendations, hidden gems, trending films, and advanced search. Explore cinema from around the world.",
  keywords: [
    "movies",
    "film discovery",
    "movie recommendations",
    "hidden gems",
    "trending movies",
    "cinema",
    "film database",
  ],
  authors: [{ name: "FilmCompass" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FilmCompass",
    title: "FilmCompass — Discover Your Next Favorite Film",
    description:
      "A modern movie discovery platform with intelligent recommendations, hidden gems, and advanced search.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FilmCompass — Discover Your Next Favorite Film",
    description:
      "A modern movie discovery platform with intelligent recommendations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased mesh-gradient">
        <ThemeProvider>
          <QueryProvider>
            <Header />
            <main className="flex-1 safe-dock-pb">{children}</main>
            <NavDock />
            <Toaster
              position="top-center"
              toastOptions={{
                className: "liquid-glass",
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
