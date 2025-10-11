import TextCompareBlogClient from "./text-compare-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Text Compare Tool Guide - Compare Texts Side by Side Online | KodeKit",
  description:
    "Learn how to compare two texts side by side and highlight differences using our free online text compare tool. Step-by-step guide with tips for document comparison.",
  keywords: [
    "text compare",
    "text comparison",
    "diff tool",
    "compare texts",
    "document comparison",
    "text analysis",
    "online diff checker",
    "text difference finder",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title:
      "Text Compare Tool Guide - Compare Texts Side by Side Online | KodeKit",
    description:
      "Learn how to compare two texts side by side and highlight differences using our free online text compare tool. Step-by-step guide with tips for document comparison.",
    url: "https://www.kodekit.in/blog/text-compare",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/text-compare-tool-free-kodekit.png",
        width: 1200,
        height: 630,
        alt: "Text Compare Tool Guide",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Text Compare Tool Guide - Compare Texts Side by Side Online | KodeKit",
    description:
      "Learn how to compare two texts side by side and highlight differences using our free online text compare tool. Step-by-step guide with tips for document comparison.",
    images: [
      "https://www.kodekit.in/social/text-compare-tool-free-kodekit.png",
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
    canonical: "https://www.kodekit.in/blog/text-compare",
  },
};

export default function TextCompareBlogPage() {
  return <TextCompareBlogClient />;
}
