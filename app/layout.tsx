import type React from "react";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import FontLoader from "@/components/FontLoader";
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
      <head>
        {/* Inline critical CSS to prevent icon size flash */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical Material Icons styling */
          .material-icons {
            font-size: 24px !important;
            width: 24px !important;
            height: 24px !important;
            overflow: hidden !important;
          }
          
          /* Hide icons until font is loaded */
          .material-icons-loading {
            opacity: 0;
          }
          
          /* Font loaded class */
          .material-icons-loaded {
            opacity: 1;
            transition: opacity 0.1s;
          }
        `}} />
        
        {/* Preload Material Icons font */}
        <link 
          rel="preload" 
          href="https://fonts.gstatic.com/s/materialicons/v140/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          crossOrigin="anonymous"
        />
      </head>
      <body className="material-icons-loading">
        <ClientLayout>{children}</ClientLayout>
        <FontLoader />
      </body>
    </html>
  );
}

