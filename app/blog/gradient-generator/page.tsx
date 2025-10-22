import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "CSS Gradient Generator - Create Beautiful Gradients Online | KodeKit",
  description:
    "Create stunning CSS gradients with our free online gradient generator. Generate linear and radial gradients with multiple color stops. Perfect for web designers and developers.",
  keywords: [
    "gradient generator",
    "css gradient",
    "linear gradient",
    "radial gradient",
    "color gradient",
    "web design tool",
    "css background",
    "gradient maker",
    "online gradient tool",
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
    title:
      "CSS Gradient Generator - Create Beautiful Gradients Online | KodeKit",
    description:
      "Create stunning CSS gradients with our free online gradient generator. Generate linear and radial gradients with multiple color stops. Perfect for web designers and developers.",
    url: "https://www.kodekit.in/blog/gradient-generator",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/free-gradient-color-generator-kodekit.png",
        width: 1200,
        height: 630,
        alt: "CSS Gradient Generator - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "CSS Gradient Generator - Create Beautiful Gradients Online | KodeKit",
    description:
      "Create stunning CSS gradients with our free online gradient generator. Generate linear and radial gradients with multiple color stops. Perfect for web designers and developers.",
    images: [
      "https://www.kodekit.in/social/social/free-gradient-color-generator-kodekit.png",
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
    canonical: "https://www.kodekit.in/blog/gradient-generator",
  },
};

import GradientGeneratorBlogClient from "./gradient-generator-client";

export default function GradientGeneratorBlog() {
  return <GradientGeneratorBlogClient />;
}
