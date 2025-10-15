import { Metadata } from "next";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "How to Download YouTube Thumbnails Online - Free Guide | KodeKit",
  description:
    "Learn how to download YouTube video thumbnails in HD, SD, and custom resolutions instantly for free. Step-by-step guide with tips for best results using our YouTube Thumbnail Downloader tool.",
  keywords: [
    "youtube thumbnail downloader",
    "download youtube thumbnails",
    "youtube thumbnail extractor",
    "youtube thumbnail saver",
    "free youtube thumbnail download",
    "youtube thumbnail converter",
    "youtube thumbnail grabber",
    "youtube thumbnail tool",
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
    title: "How to Download YouTube Thumbnails Online - Free Guide | KodeKit",
    description:
      "Learn how to download YouTube video thumbnails in HD, SD, and custom resolutions instantly for free. Step-by-step guide with tips for best results using our YouTube Thumbnail Downloader tool.",
    url: "https://www.kodekit.in/blog/youtube-thumbnail-downloader",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/free-youtube-thumbnail-downloader-kodekit.png",
        width: 1200,
        height: 630,
        alt: "YouTube Thumbnail Downloader Guide - KodeKit",
      },
    ],
    locale: "en_US",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Download YouTube Thumbnails Online - Free Guide | KodeKit",
    description:
      "Learn how to download YouTube video thumbnails in HD, SD, and custom resolutions instantly for free. Step-by-step guide with tips for best results using our YouTube Thumbnail Downloader tool.",
    images: [
      "https://www.kodekit.in/social/free-youtube-thumbnail-downloader-kodekit.png",
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
    canonical: "https://www.kodekit.in/blog/youtube-thumbnail-downloader",
  },
};

import YoutubeThumbnailDownloaderBlogClient from "./youtube-thumbnail-downloader-client";

export default function YoutubeThumbnailDownloaderBlog() {
  return <YoutubeThumbnailDownloaderBlogClient />;
}
