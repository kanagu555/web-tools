import { Metadata } from "next";
import { toolsData, toolCategories } from "@/lib/data/toolsData";

// Helper function to get tool by route name
export function getToolByRouteName(routeName: string) {
  return toolsData.find((tool) => {
    if (tool.route) {
      // Extract tool name from route (e.g., "/tools/ssy-calculator" -> "ssy-calculator")
      const toolNameFromRoute = tool.route.split("/").pop();
      return toolNameFromRoute === routeName;
    }
    return false;
  });
}

// Function to get the appropriate Open Graph image for each tool
export function getToolImage(toolName: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";

  switch (toolName) {
    case "image-to-pdf-converter":
      return `${baseUrl}/social/image-to-pdf-converter-kodekit.jpg`;
    case "pdf-merger":
      return `${baseUrl}/social/merge-pdf-files-kodekit.jpg`;
    case "pdf-splitter":
      return `${baseUrl}/social/split-pdf-online-kodekit.jpg`;

    case "css-minifier":
      return `${baseUrl}/social/free-CSS-minifier-kodekit.jpg`;

    case "gradient-generator":
      return `${baseUrl}/social/free-gradient-color-generator-kodekit.jpg`;

    case "image-compressor":
      return `${baseUrl}/social/free-image-compressor-kodekit.jpg`;

    case "qr-code-generator":
      return `${baseUrl}/social/free-qr-code-generator-kodekit.jpg`;

    case "color-picker":
      return `${baseUrl}/social/html-color-picker-kodekit.jpg`;

    case "json-formatter":
      return `${baseUrl}/social/JSON-formatter-free-kodekit.jpg`;

    case "jwt-decoder":
      return `${baseUrl}/social/JWT-decoder-kodekit.png`;

    case "lorem-ipsum-generator":
      return `${baseUrl}/social/lorem-ipsum-generator-free-kodekit.jpg`;

    case "regex-tester":
      return `${baseUrl}/social/regex-tester-kodekit.png`;

    case "text-case-converter":
      return `${baseUrl}/social/text-case-converter-kodekit.jpg`;

    case "word-count":
      return `${baseUrl}/social/word-count-tool-kodekit.jpg`;

    case "fake-credit-card-generator":
      return `${baseUrl}/social/fake-credit-card-generator-kodekit.jpg`;

    case "pdf-page-rotator":
      return `${baseUrl}/social/pdf-page-rotator-kodekit.png`;

    default:
      return `${baseUrl}/social/kodekit-logo.png`;
  }
}

// Generate metadata for each tool page
export async function generateToolMetadata(
  toolName: string
): Promise<Metadata> {
  const tool = getToolByRouteName(toolName);

  if (!tool) {
    return {
      title: "Tool Not Found | KodeKit",
      description: "The requested tool could not be found.",
    };
  }

  const category = toolCategories.find((cat) => cat.id === tool.category);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";
  const toolTitle = `${tool.title} - Free Online Tool | KodeKit`;
  const toolDescription = `${tool.description} - Free online ${tool.category} tool. No registration required, works in your browser.`;
  const toolUrl = `${baseUrl}/tools/${toolName}`;
  const ogImage = getToolImage(toolName);

  // Enhanced keywords based on tool category and functionality
  const keywords = [
    tool.title.toLowerCase(),
    tool.category,
    category?.title.toLowerCase() || "",
    "online tool",
    "free tool",
    "web tool",
    "browser tool",
    "no registration",
    "kodekit",
    "developer tools",
    "utility tools",
    // Add specific keywords based on category
    ...(tool.category === "pdf"
      ? ["pdf converter", "pdf tool", "document tool"]
      : []),
    ...(tool.category === "text"
      ? ["text formatter", "text tool", "string manipulation"]
      : []),
    ...(tool.category === "design"
      ? ["design tool", "graphics tool", "image tool"]
      : []),
    ...(tool.category === "developer"
      ? ["code formatter", "programming tool", "dev tool"]
      : []),
    ...(tool.category === "math"
      ? ["calculator", "math tool", "calculation"]
      : []),
    ...(tool.category === "finance"
      ? ["financial calculator", "investment tool", "money tool"]
      : []),
  ];

  return {
    title: toolTitle,
    description: toolDescription,
    keywords: keywords.slice(0, 15), // Limit to 15 keywords
    authors: [{ name: "KodeKit Team" }],
    creator: "KodeKit",
    publisher: "KodeKit",
    openGraph: {
      title: toolTitle,
      description: toolDescription,
      url: toolUrl,
      siteName: "KodeKit",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${tool.title} - Free Online Tool`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: toolTitle,
      description: toolDescription,
      images: [ogImage],
      creator: "@kodekit",
    },
    alternates: {
      canonical: toolUrl,
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
}
