import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Merge PDF Files Online - Free Guide | KodeKit",
  description:
    "Learn how to combine multiple PDF files into one document online for free. Step-by-step guide with tips for best results using our PDF merger tool.",
  keywords: [
    "pdf merger",
    "merge pdf files",
    "combine pdf",
    "pdf combiner",
    "online pdf merger",
    "free pdf merger",
    "merge multiple pdf",
    "pdf joiner",
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
    title: "How to Merge PDF Files Online - Free Guide | KodeKit",
    description:
      "Learn how to combine multiple PDF files into one document online for free. Step-by-step guide with tips for best results using our PDF merger tool.",
    url: "https://www.kodekit.in/blog/pdf-merger",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/merge-pdf-files-kodekit.png",
        width: 1200,
        height: 630,
        alt: "PDF Merger Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Merge PDF Files Online - Free Guide | KodeKit",
    description:
      "Learn how to combine multiple PDF files into one document online for free. Step-by-step guide with tips for best results using our PDF merger tool.",
    images: ["https://www.kodekit.in/social/merge-pdf-files-kodekit.png"],
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
    canonical: "https://www.kodekit.in/blog/pdf-merger",
  },
};

import PdfMergerBlogClient from "./pdf-merger-client";

export default function PdfMergerBlog() {
  return <PdfMergerBlogClient />;
}
