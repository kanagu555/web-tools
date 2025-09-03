import { Metadata } from "next";
import {
  toolsData,
  toolCategories,
  ToolItem,
  ToolCategory,
} from "@/lib/data/toolsData";

export const DEFAULT_METADATA = {
  siteName: "KodeKit",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in",
  twitterHandle: "@kodekit_in",
  defaultImage: "/social/kodekit.png",
  defaultImageAlt: "KodeKit - Free Online Developer Tools",
};

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_METADATA.defaultImage,
    imageAlt = DEFAULT_METADATA.defaultImageAlt,
    url,
    type = "website",
    noIndex = false,
  } = config;

  const fullTitle = title.includes("KodeKit") ? title : `${title} | KodeKit`;
  const fullUrl = url
    ? `${DEFAULT_METADATA.siteUrl}${url}`
    : DEFAULT_METADATA.siteUrl;
  const fullImage = image.startsWith("http")
    ? image
    : `${DEFAULT_METADATA.siteUrl}${image}`;

  // Ensure URL doesn't have double slashes
  const cleanUrl = fullUrl.replace(/([^:]\/)\/+/g, "$1");

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: [{ name: "KodeKit Team" }],
    creator: "KodeKit",
    publisher: "KodeKit",
    openGraph: {
      title: fullTitle,
      description,
      url: cleanUrl,
      siteName: DEFAULT_METADATA.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullImage],
      creator: DEFAULT_METADATA.twitterHandle,
      site: DEFAULT_METADATA.twitterHandle,
    },
    alternates: {
      canonical: cleanUrl,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
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
}

export function generateToolKeywords(tool: ToolItem): string[] {
  const category = toolCategories.find((cat) => cat.id === tool.category);

  const baseKeywords = [
    tool.title.toLowerCase(),
    tool.category,
    "online tool",
    "free tool",
    "web tool",
    "browser tool",
    "no registration",
    "kodekit",
  ];

  // Add category-specific keywords
  const categoryKeywords: Record<string, string[]> = {
    pdf: ["pdf converter", "pdf tool", "document tool", "pdf editor"],
    text: [
      "text formatter",
      "text tool",
      "string manipulation",
      "text converter",
    ],
    design: ["design tool", "graphics tool", "image tool", "visual tool"],
    developer: [
      "code formatter",
      "programming tool",
      "dev tool",
      "coding utility",
    ],
    math: ["calculator", "math tool", "calculation", "mathematical tool"],
    finance: [
      "financial calculator",
      "investment tool",
      "money tool",
      "finance calculator",
    ],
    healthcare: ["health calculator", "medical tool", "health tool"],
    time: ["time tool", "date tool", "time converter", "timestamp tool"],
  };

  const specificKeywords = categoryKeywords[tool.category] || [];

  return [
    ...baseKeywords,
    ...specificKeywords,
    category?.title.toLowerCase() || "",
  ]
    .filter(Boolean)
    .slice(0, 15); // Limit to 15 keywords
}

export function generateCategoryKeywords(category: ToolCategory): string[] {
  const categoryTools = toolsData.filter(
    (tool) => tool.category === category.id
  );

  return [
    category.title.toLowerCase(),
    `${category.title.toLowerCase()} tools`,
    `online ${category.title.toLowerCase()}`,
    "free online tools",
    "developer tools",
    "web tools",
    "browser tools",
    "no registration required",
    ...categoryTools.slice(0, 8).map((tool) => tool.title.toLowerCase()),
    "kodekit",
  ].slice(0, 15);
}

export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url?: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && {
        item: {
          "@type": "WebPage",
          "@id": item.url.startsWith("http")
            ? item.url
            : `${DEFAULT_METADATA.siteUrl}${item.url}`,
        },
      }),
    })),
  };
}

export function generateWebPageJsonLd(config: {
  name: string;
  description: string;
  url: string;
  breadcrumb?: Array<{ name: string; url?: string }>;
}) {
  const { name, description, url, breadcrumb } = config;
  const cleanUrl = url.startsWith("http")
    ? url
    : `${DEFAULT_METADATA.siteUrl}${url}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": cleanUrl,
    name,
    description,
    url: cleanUrl,
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${DEFAULT_METADATA.siteUrl}/#website`,
      name: "KodeKit",
      url: DEFAULT_METADATA.siteUrl,
    },
    ...(breadcrumb && {
      breadcrumb: generateBreadcrumbJsonLd(breadcrumb),
    }),
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
  };
}
