import { Metadata } from "next";
import Hero from "@/components/Hero";
import ToolGrid from "@/components/ToolGrid";
import ToolCategories from "@/components/ToolCategories";
import Features from "@/components/Features";
import TrustedByDevelopers from "@/components/TrustedByDevelopers";
import StructuredData from "@/components/StructuredData";
import { toolsData, toolCategories } from "@/lib/data/toolsData";
import {
  generateWebApplicationSchema,
  generateOrganizationSchema,
} from "@/lib/utils/structuredData";

// Generate metadata for the home page
export const metadata: Metadata = {
  title: "KodeKit - 50+ Free Developer Tools & Online Utilities",
  description:
    "Free online developer tools: PDF converter, calculators, text formatters, design tools. 50+ utilities for developers, designers & creators.",
  keywords: [
    "developer tools",
    "online tools",
    "PDF converter",
    "text formatter",
    "calculator",
    "design tools",
    "free tools",
    "web tools",
    "productivity tools",
    "developer toolkit",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "KodeKit - 50+ Free Developer Tools & Online Utilities",
    description:
      "Free online developer tools: PDF converter, calculators, text formatters, design tools. 50+ utilities for developers, designers & creators.",
    url: "https://www.kodekit.in",
    siteName: "KodeKit",
    images: [
      {
        url: "https://www.kodekit.in/social/kodekit.png",
        width: 1200,
        height: 630,
        alt: "KodeKit - All-in-One Developer Toolkit",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KodeKit - 50+ Free Developer Tools & Online Utilities",
    description:
      "Free online developer tools: PDF converter, calculators, text formatters, design tools. 50+ utilities for developers, designers & creators.",
    site: "@kodekit_in",
    images: ["https://www.kodekit.in/social/kodekit.png"],
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
  },
  alternates: {
    canonical: "https://www.kodekit.in",
  },
};

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";
  const popularTools = toolsData.filter((tool) => tool.popular);

  // Generate structured data using utility functions
  const webApplicationSchema = generateWebApplicationSchema();
  const organizationSchema = generateOrganizationSchema();

  // ItemList schema for popular tools
  const popularToolsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Popular Developer Tools",
    description: "Most popular free online tools for developers and designers",
    numberOfItems: popularTools.length,
    itemListElement: popularTools.map((tool, index) => {
      const toolName = tool.route?.split("/").pop();
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "WebApplication",
          name: tool.title,
          description: tool.description,
          url: toolName ? `${baseUrl}/tools/${toolName}` : baseUrl,
          applicationCategory: "DeveloperApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
      };
    }),
  };

  // Tool Categories schema for better SEO
  const categoriesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Tool Categories",
    description:
      "Comprehensive collection of tool categories available on KodeKit",
    numberOfItems: toolCategories.length,
    itemListElement: toolCategories.map((category, index) => {
      const categoryToolCount = toolsData.filter(
        (tool) => tool.category === category.id
      ).length;
      return {
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CollectionPage",
          name: category.title,
          description: category.description,
          url: `${baseUrl}/category/${category.id}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: categoryToolCount,
          },
        },
      };
    }),
  };

  // FAQ Schema for common questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Are all tools on KodeKit free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all tools on KodeKit are completely free to use. No registration, subscription, or payment is required.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to register to use KodeKit tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No registration is required. All tools work directly in your browser without creating an account.",
        },
      },
      {
        "@type": "Question",
        name: "Are my files safe when using KodeKit tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, all file processing happens locally in your browser. Files are not uploaded to our servers, ensuring your privacy and security.",
        },
      },
      {
        "@type": "Question",
        name: "What types of tools are available on KodeKit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "KodeKit offers 50+ tools including PDF converters, text formatters, calculators, design tools, developer utilities, and more.",
        },
      },
    ],
  };

  return (
    <>
      <StructuredData
        data={[
          webApplicationSchema,
          organizationSchema,
          popularToolsSchema,
          categoriesSchema,
          faqSchema,
        ]}
      />
      <main>
        <Hero />
        <ToolGrid />
        <ToolCategories />
        <Features />
        <TrustedByDevelopers />
      </main>
    </>
  );
}
