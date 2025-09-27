import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Blog - KodeKit Developer Tools & Tutorials",
  description:
    "Learn about developer tools, online utilities, and productivity tips. Explore guides and tutorials for PDF conversion, text processing, design tools, and more.",
  keywords: [
    "developer tools",
    "online tools",
    "tutorials",
    "guides",
    "PDF converter",
    "text formatter",
    "design tools",
    "productivity tools",
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
    title: "Blog - KodeKit Developer Tools & Tutorials",
    description:
      "Learn about developer tools, online utilities, and productivity tips. Explore guides and tutorials for PDF conversion, text processing, design tools, and more.",
    url: "https://www.kodekit.in/blog",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/blog.png",
        width: 1200,
        height: 630,
        alt: "KodeKit Blog - Developer Tools & Tutorials",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - KodeKit Developer Tools & Tutorials",
    description:
      "Learn about developer tools, online utilities, and productivity tips. Explore guides and tutorials for PDF conversion, text processing, design tools, and more.",
    images: ["https://www.kodekit.in/social/blog.png"],
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
    canonical: "https://www.kodekit.in/blog",
  },
};

import BlogClient from "./blog-client";

export default function BlogPage() {
  return <BlogClient />;
}
