import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import StructuredData from "@/components/StructuredData";
import NoSSR from "@/components/NoSSR";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ScrollToTop from "@/components/ScrollToTop";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AdSenseScript from "@/components/AdSenseScript";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import {
  generateWebApplicationSchema,
  generateOrganizationSchema,
} from "@/lib/utils/structuredData";

// Configure Inter font with optimal settings
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Metadata configuration
export const metadata: Metadata = {
  title: {
    default: "KodeKit - Free Developer Tools & Utilities",
    template: "%s | KodeKit",
  },
  description:
    "A comprehensive collection of 50+ free online developer tools including PDF converters, calculators, text formatters, and more.",
  keywords: [
    "developer tools",
    "online tools",
    "PDF converter",
    "calculator",
    "text formatter",
    "code formatter",
    "utilities",
    "free tools",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kodekit.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kodekit.in",
    title: "KodeKit - Free Developer Tools & Utilities",
    description:
      "A comprehensive collection of 50+ free online developer tools including PDF converters, calculators, text formatters, and more.",
    siteName: "KodeKit",
    images: [
      {
        url: "/social/og-image.png",
        width: 1200,
        height: 630,
        alt: "KodeKit - Free Developer Tools & Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KodeKit - Free Developer Tools & Utilities",
    description:
      "A comprehensive collection of 50+ free online developer tools including PDF converters, calculators, text formatters, and more.",
    images: ["/social/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} loading`}
      suppressHydrationWarning
    >
      <head>
        {/* SEO Improvements */}
        <meta name="author" content="KodeKit Team" />
        <meta name="copyright" content="KodeKit" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="Global" />
        <meta name="geo.region" content="IN" />
        <meta name="geo.country" content="India" />

        {/* Bing Webmaster Tools Verification */}
        <meta name="msvalidate.01" content="2A30A56924E32202CFBAA4D3A6016ACC" />

        {/* Additional Open Graph */}
        <meta property="og:site_name" content="KodeKit" />
        <meta property="og:type" content="website" />
        <meta property="article:author" content="KodeKit Team" />

        {/* Twitter Additional */}
        <meta name="twitter:site" content="@kodekit_in" />
        <meta name="twitter:creator" content="@kodekit_in" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />

        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/manifest.json"
          as="fetch"
          crossOrigin="anonymous"
        />

        {/* Explicit robots meta tag to ensure indexing in production */}
        {process.env.NODE_ENV === "production" && (
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />
        )}

        {/* Remove loading class after hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                document.documentElement.classList.remove('loading');
              });
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <AdSenseScript />
        <PerformanceMonitor enabled={process.env.NODE_ENV === "production"} />
        <StructuredData
          data={[generateWebApplicationSchema(), generateOrganizationSchema()]}
        />
        <ErrorBoundary>
          <ThemeProvider>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Header />
              <main style={{ flex: 1 }}>{children}</main>
              <Footer />
              <NoSSR>
                <PWAInstallPrompt />
                <ScrollToTop />
              </NoSSR>
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
