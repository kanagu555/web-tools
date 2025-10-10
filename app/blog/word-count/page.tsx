import WordCountBlogClient from "./word-count-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Word Count Tool Guide - Count Words and Analyze Text Online | KodeKit",
  description:
    "Learn how to count words, characters, and analyze text using our free online word count tool. Step-by-step guide with tips for writers, students, and content creators.",
  keywords: [
    "word count",
    "character count",
    "text analyzer",
    "writing tool",
    "content analysis",
    "text statistics",
    "reading time calculator",
    "online word counter",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title:
      "Word Count Tool Guide - Count Words and Analyze Text Online | KodeKit",
    description:
      "Learn how to count words, characters, and analyze text using our free online word count tool. Step-by-step guide with tips for writers, students, and content creators.",
    url: "https://www.kodekit.in/blog/word-count",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/word-count-tool-kodekit.png",
        width: 1200,
        height: 630,
        alt: "Word Count Tool Guide",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Word Count Tool Guide - Count Words and Analyze Text Online | KodeKit",
    description:
      "Learn how to count words, characters, and analyze text using our free online word count tool. Step-by-step guide with tips for writers, students, and content creators.",
    images: ["https://www.kodekit.in/social/word-count-tool-kodekit.png"],
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
    canonical: "https://www.kodekit.in/blog/word-count",
  },
};

export default function WordCountBlogPage() {
  return <WordCountBlogClient />;
}
