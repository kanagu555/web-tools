import LoremIpsumGeneratorBlogClient from "./lorem-ipsum-generator-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Lorem Ipsum Generator Guide - Create Placeholder Text Online | KodeKit",
  description:
    "Learn how to generate customizable Lorem Ipsum placeholder text for your designs and mockups using our free online Lorem Ipsum generator. Step-by-step guide with examples.",
  keywords: [
    "lorem ipsum generator",
    "placeholder text",
    "lorem ipsum",
    "text generator",
    "design tools",
    "mockup text",
    "placeholder content",
    "web design tools",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title:
      "Lorem Ipsum Generator Guide - Create Placeholder Text Online | KodeKit",
    description:
      "Learn how to generate customizable Lorem Ipsum placeholder text for your designs and mockups using our free online Lorem Ipsum generator. Step-by-step guide with examples.",
    url: "https://www.kodekit.in/blog/lorem-ipsum-generator",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/lorem-ipsum-generator-free-kodekit.png",
        width: 1200,
        height: 630,
        alt: "Lorem Ipsum Generator Tool Guide",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Lorem Ipsum Generator Guide - Create Placeholder Text Online | KodeKit",
    description:
      "Learn how to generate customizable Lorem Ipsum placeholder text for your designs and mockups using our free online Lorem Ipsum generator. Step-by-step guide with examples.",
    images: [
      "https://www.kodekit.in/social/lorem-ipsum-generator-free-kodekit.png",
    ],
    site: "@kodekit_in",
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
    canonical: "https://www.kodekit.in/blog/lorem-ipsum-generator",
  },
};

export default function LoremIpsumGeneratorBlogPage() {
  return <LoremIpsumGeneratorBlogClient />;
}
