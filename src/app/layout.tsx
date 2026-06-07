import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Header } from "@/components/layout/header";
import { NavDock } from "@/components/layout/nav-dock";
import { Toaster } from "sonner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FilmCompass — Discover Your Next Favorite Film",
    template: "%s | FilmCompass",
  },
  description:
    "A modern movie discovery platform with intelligent recommendations, hidden gems, trending films, and advanced search.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FilmCompass",
    title: "FilmCompass — Discover Your Next Favorite Film",
    description:
      "A modern movie discovery platform with intelligent recommendations, hidden gems, and advanced search.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f3f8" },
    { media: "(prefers-color-scheme: dark)", color: "#090b10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground font-sans antialiased">
        <div className="fc-ambient" aria-hidden />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-xl focus:bg-brand-violet focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        <ThemeProvider>
          <QueryProvider>
            <div className="fc-app-shell">
              <Header />
              <main id="main-content" className="flex-1 safe-dock-pb">
                {children}
              </main>
              <NavDock />
            </div>
            <Toaster
              position="top-center"
              toastOptions={{
                className: "fc-glass !border-border/80 !text-foreground",
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
