import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Historical Index Data - View & Download Global Stock Indices | KodeKit",
  description:
    "Learn how to fetch, view, and download historical OHLCV data for major global stock indices like NIFTY 50, SENSEX, S&P 500, and NASDAQ for free.",
  keywords: [
    "historical index data",
    "NIFTY 50 historical data",
    "SENSEX historical data",
    "S&P 500 historical data",
    "download index data",
    "OHLCV data free",
    "stock market index data",
    "global indices data",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Historical Index Data - View & Download Global Stock Indices | KodeKit",
    description:
      "Learn how to fetch, view, and download historical OHLCV data for major global stock indices like NIFTY 50, SENSEX, S&P 500, and NASDAQ for free.",
    url: "https://www.kodekit.in/blog/historical-index-data",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/historical-index-data.png",
        width: 1200,
        height: 630,
        alt: "Historical Index Data Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Historical Index Data - View & Download Global Stock Indices | KodeKit",
    description:
      "Learn how to fetch, view, and download historical OHLCV data for major global stock indices like NIFTY 50, SENSEX, S&P 500, and NASDAQ for free.",
    images: ["https://www.kodekit.in/social/historical-index-data.png"],
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
  alternates: {
    canonical: "https://www.kodekit.in/blog/historical-index-data",
  },
};

import HistoricalIndexDataBlogClient from "./historical-index-data-client";

export default function HistoricalIndexDataBlog() {
  return <HistoricalIndexDataBlogClient />;
}
