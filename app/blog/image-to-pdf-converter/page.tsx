import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Convert Images to PDF Online - Free Guide | KodeKit",
  description: "Learn how to convert JPG, PNG, and other images to PDF format online for free. Step-by-step guide with tips for best results using our Image to PDF converter tool.",
  keywords: [
    "image to pdf converter",
    "convert image to pdf",
    "jpg to pdf",
    "png to pdf",
    "online image to pdf",
    "free image to pdf",
    "batch image to pdf",
    "image converter tool"
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
    title: "How to Convert Images to PDF Online - Free Guide | KodeKit",
    description: "Learn how to convert JPG, PNG, and other images to PDF format online for free. Step-by-step guide with tips for best results using our Image to PDF converter tool.",
    url: "https://www.kodekit.in/blog/image-to-pdf-converter",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/image-to-pdf-converter.png",
        width: 1200,
        height: 630,
        alt: "Image to PDF Converter Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Convert Images to PDF Online - Free Guide | KodeKit",
    description: "Learn how to convert JPG, PNG, and other images to PDF format online for free. Step-by-step guide with tips for best results using our Image to PDF converter tool.",
    images: ["https://www.kodekit.in/social/image-to-pdf-converter.png"],
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
    canonical: "https://www.kodekit.in/blog/image-to-pdf-converter",
  },
};

import ImageToPdfConverterBlogClient from "./image-to-pdf-converter-client";

export default function ImageToPdfConverterBlog() {
  return <ImageToPdfConverterBlogClient />;
}