import type React from "react";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "KodeKit - Your Ultimate Development Toolkit",
  description:
    "KodeKit is a powerful development toolkit designed to streamline your workflow and boost productivity.",
  keywords: ["KodeKit", "Development Toolkit", "Productivity", "Web Tools"],
  authors: [{ name: "Kanagaraj K" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "KodeKit - Your Ultimate Development Toolkit",
    description:
      "Streamline your workflow with KodeKit, the ultimate toolkit for developers.",
    url: "https://kodekit.vercel.app",
    siteName: "KodeKit",
    images: [
      {
        url: "https://kodekit.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KodeKit Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO meta tags */}
        <meta
          name="keywords"
          content="KodeKit, Development Toolkit, Productivity, Web Tools"
        />
        <meta name="author" content="Kanagaraj K" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="KodeKit - Your Ultimate Development Toolkit"
        />
        <meta
          property="og:description"
          content="Streamline your workflow with KodeKit, the ultimate toolkit for developers."
        />
        <meta property="og:url" content="https://kodekit.vercel.app" />
        <meta property="og:site_name" content="KodeKit" />
        <meta
          property="og:image"
          content="https://kodekit.vercel.app/og-image.jpg"
        />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
