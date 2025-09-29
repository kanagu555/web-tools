import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Split PDF Files Online - Free Guide | KodeKit",
  description:
    "Learn how to extract pages from PDF documents online for free. Step-by-step guide with tips for best results using our PDF splitter tool.",
  keywords: [
    "pdf splitter",
    "split pdf files",
    "extract pdf pages",
    "pdf page extractor",
    "online pdf splitter",
    "free pdf splitter",
    "split pdf pages",
    "pdf cutter",
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
    title: "How to Split PDF Files Online - Free Guide | KodeKit",
    description:
      "Learn how to extract pages from PDF documents online for free. Step-by-step guide with tips for best results using our PDF splitter tool.",
    url: "https://www.kodekit.in/blog/pdf-splitter",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/split-pdf-online-kodekit.png",
        width: 1200,
        height: 630,
        alt: "PDF Splitter Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Split PDF Files Online - Free Guide | KodeKit",
    description:
      "Learn how to extract pages from PDF documents online for free. Step-by-step guide with tips for best results using our PDF splitter tool.",
    images: ["https://www.kodekit.in/social/split-pdf-online-kodekit.png"],
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
    canonical: "https://www.kodekit.in/blog/pdf-splitter",
  },
};

import PdfSplitterBlogClient from "./pdf-splitter-client";

export default function PdfSplitterBlog() {
  return <PdfSplitterBlogClient />;
}
