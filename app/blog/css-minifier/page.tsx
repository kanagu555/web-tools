import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Minify CSS Online - Free Guide | KodeKit",
  description:
    "Learn how to minify and optimize CSS code to reduce file size and improve website performance. Step-by-step guide with tips for best results using our CSS Minifier tool.",
  keywords: [
    "css minifier",
    "minify css online",
    "css compressor",
    "css optimization",
    "reduce css file size",
    "website performance",
    "web optimization",
    "css tool",
    "free css minifier",
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
    title: "How to Minify CSS Online - Free Guide | KodeKit",
    description:
      "Learn how to minify and optimize CSS code to reduce file size and improve website performance. Step-by-step guide with tips for best results using our CSS Minifier tool.",
    url: "https://www.kodekit.in/blog/css-minifier",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/free-css-minifier-kodekit.png",
        width: 1200,
        height: 630,
        alt: "CSS Minifier Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Minify CSS Online - Free Guide | KodeKit",
    description:
      "Learn how to minify and optimize CSS code to reduce file size and improve website performance. Step-by-step guide with tips for best results using our CSS Minifier tool.",
    images: ["https://www.kodekit.in/social/free-css-minifier-kodekit.png"],
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
    canonical: "https://www.kodekit.in/blog/css-minifier",
  },
};

import CssMinifierBlogClient from "./css-minifier-client";

export default function CssMinifierBlog() {
  return <CssMinifierBlogClient />;
}
