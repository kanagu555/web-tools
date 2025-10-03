import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Rotate PDF Pages Online - Free Guide | KodeKit",
  description:
    "Learn how to rotate PDF pages 90°, 180°, or 270° clockwise online for free. Step-by-step guide with tips for best results using our PDF page rotator tool.",
  keywords: [
    "pdf page rotator",
    "rotate pdf pages",
    "pdf rotation tool",
    "online pdf rotator",
    "free pdf rotator",
    "rotate pdf online",
    "pdf page orientation",
    "pdf document rotation",
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
    title: "How to Rotate PDF Pages Online - Free Guide | KodeKit",
    description:
      "Learn how to rotate PDF pages 90°, 180°, or 270° clockwise online for free. Step-by-step guide with tips for best results using our PDF page rotator tool.",
    url: "https://www.kodekit.in/blog/pdf-page-rotator",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/pdf-page-rotator-kodekit.png",
        width: 1200,
        height: 630,
        alt: "PDF Page Rotator Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Rotate PDF Pages Online - Free Guide | KodeKit",
    description:
      "Learn how to rotate PDF pages 90°, 180°, or 270° clockwise online for free. Step-by-step guide with tips for best results using our PDF page rotator tool.",
    images: ["https://www.kodekit.in/social/pdf-page-rotator-kodekit.png"],
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
    canonical: "https://www.kodekit.in/blog/pdf-page-rotator",
  },
};

import PdfPageRotatorBlogClient from "./pdf-page-rotator-client";

export default function PdfPageRotatorBlog() {
  return <PdfPageRotatorBlogClient />;
}
