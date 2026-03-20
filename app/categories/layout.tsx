import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tool Categories - Explore KodeKit's Free Online Tools by Category",
  description:
    "Browse all KodeKit tools organized by category. Find the perfect tool for PDF conversion, text formatting, design, development, math, finance, healthcare, and more.",
  keywords: [
    "tool categories",
    "developer tools",
    "online tools",
    "PDF tools",
    "text tools",
    "design tools",
    "math calculators",
    "finance tools",
    "KodeKit categories",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title: "Tool Categories - Explore KodeKit's Free Online Tools by Category",
    description:
      "Browse all KodeKit tools organized by category. Find the perfect tool for your needs.",
    url: "https://www.kodekit.in/categories",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/kodekit.png",
        width: 1200,
        height: 630,
        alt: "KodeKit Tool Categories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tool Categories - Explore KodeKit's Free Online Tools by Category",
    description:
      "Browse all KodeKit tools organized by category. Find the perfect tool for your needs.",
    images: ["https://www.kodekit.in/social/kodekit.png"],
    creator: "@kodekit_in",
  },
  alternates: {
    canonical: "https://www.kodekit.in/categories",
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
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
