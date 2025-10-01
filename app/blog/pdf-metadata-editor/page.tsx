import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Edit PDF Metadata Online - Free Guide | KodeKit",
  description:
    "Learn how to edit PDF metadata properties including title, author, subject, and keywords online for free. Step-by-step guide with tips for best results using our PDF metadata editor tool.",
  keywords: [
    "pdf metadata editor",
    "edit pdf metadata",
    "pdf properties editor",
    "pdf metadata properties",
    "online pdf metadata editor",
    "free pdf metadata editor",
    "pdf title editor",
    "pdf author editor",
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
    title: "How to Edit PDF Metadata Online - Free Guide | KodeKit",
    description:
      "Learn how to edit PDF metadata properties including title, author, subject, and keywords online for free. Step-by-step guide with tips for best results using our PDF metadata editor tool.",
    url: "https://www.kodekit.in/blog/pdf-metadata-editor",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/free-pdf-metadata-editor-kodekit.png",
        width: 1200,
        height: 630,
        alt: "PDF Metadata Editor Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Edit PDF Metadata Online - Free Guide | KodeKit",
    description:
      "Learn how to edit PDF metadata properties including title, author, subject, and keywords online for free. Step-by-step guide with tips for best results using our PDF metadata editor tool.",
    images: [
      "https://www.kodekit.in/social/free-pdf-metadata-editor-kodekit.png",
    ],
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
    canonical: "https://www.kodekit.in/blog/pdf-metadata-editor",
  },
};

import PdfMetadataEditorBlogClient from "./pdf-metadata-editor-client";

export default function PdfMetadataEditorBlog() {
  return <PdfMetadataEditorBlogClient />;
}
