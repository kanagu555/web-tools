import {
  toolsData,
  toolCategories,
  ToolItem,
  ToolCategory,
} from "@/lib/data/toolsData";

export interface WebApplicationSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    ratingCount: string;
  };
}

export interface ToolSchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  isPartOf: {
    "@type": string;
    name: string;
    url: string;
  };
  offers: {
    "@type": string;
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    "@type": string;
    ratingValue: string;
    ratingCount: string;
  };
  keywords: string[];
}

export interface CategorySchema {
  "@context": string;
  "@type": string;
  name: string;
  description: string;
  url: string;
  mainEntity: {
    "@type": string;
    name: string;
    numberOfItems: number;
    itemListElement: Array<{
      "@type": string;
      position: number;
      item: {
        "@type": string;
        name: string;
        description: string;
        url: string;
      };
    }>;
  };
}

export interface BreadcrumbSchema {
  "@context": string;
  "@type": string;
  itemListElement: Array<{
    "@type": string;
    position: number;
    name: string;
    item?: string;
  }>;
}

export function generateWebApplicationSchema(): WebApplicationSchema {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "KodeKit - Free Online Developer Tools",
    description:
      "A comprehensive collection of 50+ free online tools for developers, designers, and professionals. Including PDF tools, calculators, text formatters, and more.",
    url: baseUrl,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1250",
    },
  };
}

export function generateToolSchema(
  tool: ToolItem,
  toolName: string
): ToolSchema {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";
  const category = toolCategories.find((cat) => cat.id === tool.category);

  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    url: `${baseUrl}/tools/${toolName}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    isPartOf: {
      "@type": "WebApplication",
      name: "KodeKit",
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.7",
      ratingCount: "850",
    },
    keywords: [
      tool.title.toLowerCase(),
      tool.category,
      category?.title.toLowerCase() || "",
      "online tool",
      "free tool",
      "developer tool",
      "web tool",
    ],
  };
}

export function generateCategorySchema(
  category: ToolCategory,
  categoryId: string
): CategorySchema {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";
  const categoryTools = toolsData.filter(
    (tool) => tool.category === categoryId
  );

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.description,
    url: `${baseUrl}/category/${categoryId}`,
    mainEntity: {
      "@type": "ItemList",
      name: `${category.title} Collection`,
      numberOfItems: categoryTools.length,
      itemListElement: categoryTools.slice(0, 10).map((tool, index) => {
        const toolName = tool.route?.split("/").pop();
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "WebApplication",
            name: tool.title,
            description: tool.description,
            url: toolName ? `${baseUrl}/tools/${toolName}` : `${baseUrl}`,
          },
        };
      }),
    },
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url?: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url && { item: item.url }),
    })),
  };
}

export function generateOrganizationSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KodeKit",
    description: "Free online developer tools and utilities",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: ["https://twitter.com/kodekit", "https://github.com/kodekit"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: "English",
    },
  };
}
