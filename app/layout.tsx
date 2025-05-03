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
  icons: {
    icon: "https://i.ibb.co/zTnmk3BC/KodeKit.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

