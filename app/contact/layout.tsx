import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact KodeKit - Get In Touch With Our Team",
  description:
    "Have questions or feedback about KodeKit? Contact us directly. We'd love to hear from you about feature requests, bug reports, or partnerships.",
  keywords: [
    "contact",
    "feedback",
    "support",
    "feature request",
    "bug report",
    "KodeKit contact",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title: "Contact KodeKit - Get In Touch With Our Team",
    description:
      "Have questions or feedback about KodeKit? Contact us directly. We'd love to hear from you.",
    url: "https://www.kodekit.in/contact",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/kodekit.png",
        width: 1200,
        height: 630,
        alt: "Contact KodeKit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact KodeKit - Get In Touch With Our Team",
    description: "Have questions or feedback about KodeKit? Contact us directly.",
    images: ["https://www.kodekit.in/social/kodekit.png"],
    creator: "@kodekit_in",
  },
  alternates: {
    canonical: "https://www.kodekit.in/contact",
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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
