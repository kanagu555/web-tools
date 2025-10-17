import ColorPickerBlogClient from "./color-picker-client";
import { Metadata } from "next";
import { getCanonicalUrl } from "@/lib/utils/canonicalUrl";

const baseUrl = getCanonicalUrl("");

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Use a Color Picker Tool - Complete Guide | KodeKit",
  description:
    "Learn how to use a color picker tool to select colors and generate harmonious color palettes for your designs, websites, and creative projects.",
  keywords: [
    "color picker",
    "color palette generator",
    "hex color codes",
    "web design tools",
    "graphic design tools",
    "color selection tool",
    "design tools",
    "color theory",
  ],
  alternates: {
    canonical: `${baseUrl}/blog/color-picker`,
  },
  openGraph: {
    title: "How to Use a Color Picker Tool - Complete Guide | KodeKit",
    description:
      "Learn how to use a color picker tool to select colors and generate harmonious color palettes for your designs, websites, and creative projects.",
    url: `${baseUrl}/blog/color-picker`,
    siteName: "KodeKit",
    images: [
      {
        url: `${baseUrl}/social/html-color-picker-kodekit.png`,
        width: 1200,
        height: 630,
        alt: "Color Picker Tool Guide",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Use a Color Picker Tool - Complete Guide | KodeKit",
    description:
      "Learn how to use a color picker tool to select colors and generate harmonious color palettes for your designs, websites, and creative projects.",
    images: [`${baseUrl}/social/html-color-picker-kodekit.png`],
  },
};

export default function ColorPickerBlog() {
  return <ColorPickerBlogClient />;
}
