import type { Metadata } from "next";
import QuickStartClient from "./QuickStartClient";

// Generate metadata for the quick start page
export const metadata: Metadata = {
  title: "Quick Start Guide - Get Started with KodeKit Tools",
  description:
    "Learn how to use KodeKit's free online tools. Step-by-step guide for developers, designers, and content creators. No registration required.",
  keywords: [
    "quick start guide",
    "how to use kodekit",
    "developer tools tutorial",
    "online tools guide",
    "free tools tutorial",
    "getting started",
  ],
  openGraph: {
    title: "Quick Start Guide - Get Started with KodeKit Tools",
    description:
      "Learn how to use KodeKit's free online tools. Step-by-step guide for developers, designers, and content creators.",
    type: "website",
  },
};

export default function QuickStartPage() {
  return <QuickStartClient />;
}
