import TextCaseConverterBlogClient from "./text-case-converter-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Case Converter Guide - Convert Text Cases Online | KodeKit",
  description:
    "Learn how to convert text between different cases (camelCase, snake_case, Title Case, etc.) using our free online text case converter. Step-by-step guide with examples.",
  keywords: [
    "text case converter",
    "case converter",
    "camelCase converter",
    "snake_case converter",
    "text formatting",
    "case formatting",
    "text transformation",
    "developer tools",
    "programming tools",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title: "Text Case Converter Guide - Convert Text Cases Online | KodeKit",
    description:
      "Learn how to convert text between different cases (camelCase, snake_case, Title Case, etc.) using our free online text case converter. Step-by-step guide with examples.",
    url: "https://www.kodekit.in/blog/text-case-converter",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/text-case-converter-kodekit.png",
        width: 1200,
        height: 630,
        alt: "Text Case Converter Tool Guide",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Case Converter Guide - Convert Text Cases Online | KodeKit",
    description:
      "Learn how to convert text between different cases (camelCase, snake_case, Title Case, etc.) using our free online text case converter. Step-by-step guide with examples.",
    images: ["https://www.kodekit.in/social/text-case-converter-kodekit.png"],
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
    canonical: "https://www.kodekit.in/blog/text-case-converter",
  },
};

export default function TextCaseConverterBlogPage() {
  return <TextCaseConverterBlogClient />;
}
