import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Format JSON Online - Free Guide | KodeKit",
  description:
    "Learn how to format, validate, and beautify JSON data online for free. Step-by-step guide with tips for best results using our JSON Formatter tool.",
  keywords: [
    "json formatter",
    "format json online",
    "json validator",
    "beautify json",
    "json minifier",
    "json tool",
    "free json formatter",
    "online json formatter",
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
    title: "How to Format JSON Online - Free Guide | KodeKit",
    description:
      "Learn how to format, validate, and beautify JSON data online for free. Step-by-step guide with tips for best results using our JSON Formatter tool.",
    url: "https://www.kodekit.in/blog/json-formatter",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/JSON-formatter-free-kodekit.png",
        width: 1200,
        height: 630,
        alt: "JSON Formatter Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Format JSON Online - Free Guide | KodeKit",
    description:
      "Learn how to format, validate, and beautify JSON data online for free. Step-by-step guide with tips for best results using our JSON Formatter tool.",
    images: ["https://www.kodekit.in/social/JSON-formatter-free-kodekit.png"],
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
    canonical: "https://www.kodekit.in/blog/json-formatter",
  },
};

import JsonFormatterBlogClient from "./json-formatter-client";

export default function JsonFormatterBlog() {
  return <JsonFormatterBlogClient />;
}
