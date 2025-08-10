import { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ | Web Tools - Frequently Asked Questions",
  description:
    "Find answers to common questions about our web tools, features, privacy, and support. Get help with PDF tools, calculators, converters, and more.",
  keywords: [
    "FAQ",
    "web tools questions",
    "PDF tools help",
    "calculator help",
    "privacy questions",
    "tool support",
    "frequently asked questions",
  ],
  authors: [{ name: "Web Tools Team" }],
  openGraph: {
    title: "FAQ | Web Tools - Frequently Asked Questions",
    description:
      "Find answers to common questions about our web tools, features, privacy, and support.",
    type: "website",
    url: "/faq",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ | Web Tools - Frequently Asked Questions",
    description:
      "Find answers to common questions about our web tools, features, privacy, and support.",
  },
  alternates: {
    canonical: "/faq",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for FAQPage
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is this web tools collection?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This is a comprehensive collection of web-based utility tools designed to help developers, designers, and content creators with their daily tasks. All tools run directly in your browser for maximum privacy and convenience.",
      },
    },
    {
      "@type": "Question",
      name: "Are these tools free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all tools are completely free to use. We believe in providing high-quality utilities accessible to everyone without any cost barriers or registration requirements.",
      },
    },
    {
      "@type": "Question",
      name: "Are my files secure when using these tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, all file processing happens locally in your browser. We don't upload, store, or transmit your files to any server. Your data remains completely private and secure on your device.",
      },
    },
    {
      "@type": "Question",
      name: "How do the PDF tools work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our PDF tools (merger, splitter, compressor, converter) process files directly in your browser using JavaScript libraries. Your files never leave your computer, ensuring complete privacy and security.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to create an account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No account creation is required. You can start using any tool immediately without any registration process. Simply visit the tool page and start working.",
      },
    },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FAQ />
    </>
  );
}