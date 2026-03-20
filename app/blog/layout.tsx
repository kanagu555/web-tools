import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KodeKit Blog - Tips, Tutorials & Tool Guides",
  description:
    "Discover useful tutorials, tips, and guides on how to use KodeKit's free online tools effectively. Learn productivity hacks and tool features.",
  keywords: [
    "KodeKit blog",
    "tutorials",
    "guides",
    "tips",
    "how-to",
    "tool guides",
    "developer tips",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title: "KodeKit Blog - Tips, Tutorials & Tool Guides",
    description:
      "Discover useful tutorials, tips, and guides on how to use KodeKit's free online tools effectively.",
    url: "https://www.kodekit.in/blog",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/kodekit.png",
        width: 1200,
        height: 630,
        alt: "KodeKit Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KodeKit Blog - Tips, Tutorials & Tool Guides",
    description:
      "Discover useful tutorials, tips, and guides on how to use KodeKit's free online tools.",
    images: ["https://www.kodekit.in/social/kodekit.png"],
    creator: "@kodekit_in",
  },
  alternates: {
    canonical: "https://www.kodekit.in/blog",
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
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
