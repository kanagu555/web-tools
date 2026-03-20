import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions About KodeKit",
  description:
    "Find answers to common questions about KodeKit's features, privacy, browser support, and more. Everything you need to know about our free developer tools.",
  keywords: [
    "FAQ",
    "frequently asked questions",
    "help",
    "support",
    "KodeKit FAQ",
    "how to use",
    "features",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title: "FAQ - Frequently Asked Questions About KodeKit",
    description:
      "Find answers to common questions about KodeKit's features, privacy, browser support, and more.",
    url: "https://www.kodekit.in/faq",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/kodekit.png",
        width: 1200,
        height: 630,
        alt: "KodeKit FAQ",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Frequently Asked Questions About KodeKit",
    description:
      "Find answers to common questions about KodeKit's features, privacy, and more.",
    images: ["https://www.kodekit.in/social/kodekit.png"],
    creator: "@kodekit_in",
  },
  alternates: {
    canonical: "https://www.kodekit.in/faq",
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

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
