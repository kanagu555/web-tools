import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Compress Images Online - Free Guide | KodeKit",
  description:
    "Learn how to compress images to reduce file size without losing quality. Step-by-step guide with tips for best results using our Image Compressor tool.",
  keywords: [
    "image compressor",
    "compress images online",
    "reduce image size",
    "image optimization",
    "jpeg compression",
    "png compression",
    "webp compression",
    "online image compressor",
    "free image compressor",
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
    title: "How to Compress Images Online - Free Guide | KodeKit",
    description:
      "Learn how to compress images to reduce file size without losing quality. Step-by-step guide with tips for best results using our Image Compressor tool.",
    url: "https://www.kodekit.in/blog/image-compressor",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/free-image-compressor-kodekit.png",
        width: 1200,
        height: 630,
        alt: "Image Compressor Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Compress Images Online - Free Guide | KodeKit",
    description:
      "Learn how to compress images to reduce file size without losing quality. Step-by-step guide with tips for best results using our Image Compressor tool.",
    images: ["https://www.kodekit.in/social/free-image-compressor-kodekit.png"],
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
    canonical: "https://www.kodekit.in/blog/image-compressor",
  },
};

import ImageCompressorBlogClient from "./image-compressor-client";

export default function ImageCompressorBlog() {
  return <ImageCompressorBlogClient />;
}
