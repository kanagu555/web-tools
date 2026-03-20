import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About KodeKit - Free Developer Tools & Online Utilities",
  description:
    "Learn about KodeKit, a comprehensive collection of 50+ free online tools for developers, designers, and content creators. Built with privacy and accessibility in mind.",
  keywords: [
    "about KodeKit",
    "developer tools",
    "free tools",
    "online utilities",
    "privacy-focused",
    "browser-based tools",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title: "About KodeKit - Free Developer Tools & Online Utilities",
    description:
      "Learn about KodeKit, a comprehensive collection of 50+ free online tools for developers, designers, and content creators.",
    url: "https://www.kodekit.in/about",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/kodekit.png",
        width: 1200,
        height: 630,
        alt: "About KodeKit - Developer Toolkit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About KodeKit - Free Developer Tools & Online Utilities",
    description:
      "Learn about KodeKit, a comprehensive collection of 50+ free online tools for developers, designers, and content creators.",
    images: ["https://www.kodekit.in/social/kodekit.png"],
    creator: "@kodekit_in",
  },
  alternates: {
    canonical: "https://www.kodekit.in/about",
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

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
