import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - KodeKit Data Protection & Privacy",
  description:
    "Learn how KodeKit protects your privacy and data. All processing happens locally in your browser. We don't store or transmit your files to our servers.",
  keywords: [
    "privacy policy",
    "data protection",
    "privacy",
    "GDPR",
    "data privacy",
    "KodeKit privacy",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
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
    canonical: "https://www.kodekit.in/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy - KodeKit Data Protection & Privacy",
    description:
      "Learn how KodeKit protects your privacy and data. All processing happens locally in your browser.",
    url: "https://www.kodekit.in/privacy-policy",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/kodekit.png",
        width: 1200,
        height: 630,
        alt: "KodeKit Privacy Policy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy - KodeKit Data Protection & Privacy",
    description:
      "Learn how KodeKit protects your privacy and data. All processing happens locally in your browser.",
    images: ["https://www.kodekit.in/social/kodekit.png"],
    creator: "@kodekit_in",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
