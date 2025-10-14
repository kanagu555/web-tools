import SpaceToNewlineConverterBlogClient from "./space-to-newline-converter-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Space to Newline Converter Guide - Convert Spaces to Newlines Online | KodeKit",
  description:
    "Learn how to convert spaces to newlines in your text using our free online space to newline converter tool. Step-by-step guide with tips for data processing and formatting.",
  keywords: [
    "space to newline",
    "text converter",
    "data processing",
    "text formatting",
    "online converter",
    "text manipulation",
    "formatting tool",
    "data conversion",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title:
      "Space to Newline Converter Guide - Convert Spaces to Newlines Online | KodeKit",
    description:
      "Learn how to convert spaces to newlines in your text using our free online space to newline converter tool. Step-by-step guide with tips for data processing and formatting.",
    url: "https://www.kodekit.in/blog/space-to-newline-converter",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/space-to-newline-converter-free-kodekit.png",
        width: 1200,
        height: 630,
        alt: "Space to Newline Converter Guide",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Space to Newline Converter Guide - Convert Spaces to Newlines Online | KodeKit",
    description:
      "Learn how to convert spaces to newlines in your text using our free online space to newline converter tool. Step-by-step guide with tips for data processing and formatting.",
    images: [
      "https://www.kodekit.in/social/space-to-newline-converter-free-kodekit.png",
    ],
    site: "@kodekit_in",
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
    canonical: "https://www.kodekit.in/blog/space-to-newline-converter",
  },
};

export default function SpaceToNewlineConverterBlogPage() {
  return <SpaceToNewlineConverterBlogClient />;
}
