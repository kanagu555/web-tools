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
    //PDF Section
    case "image-to-pdf-converter":
      return `${baseUrl}/social/image-to-pdf-converter-kodekit.png`;
    case "pdf-merger":
      return `${baseUrl}/social/merge-pdf-files-kodekit.png`;
    case "pdf-splitter":
      return `${baseUrl}/social/split-pdf-online-kodekit.png`;
    case "pdf-page-rotator":
      return `${baseUrl}/social/pdf-page-rotator-kodekit.png`;
    case "pdf-metadata-editor":
      return `${baseUrl}/social/free-pdf-metadata-editor-kodekit.png`;

    //Developer Section
    case "css-minifier":
      return `${baseUrl}/social/free-CSS-minifier-kodekit.png`;
    case "json-formatter":
      return `${baseUrl}/social/JSON-formatter-free-kodekit.png`;
    case "jwt-decoder":
      return `${baseUrl}/social/JWT-decoder-kodekit.png`;
    case "regex-tester":
      return `${baseUrl}/social/regex-tester-kodekit.png`;
    case "fake-credit-card-generator":
      return `${baseUrl}/social/fake-credit-card-generator-kodekit.png`;
    case "json-compare":
      return `${baseUrl}/social/compare-JSON-files-kodekit.png`;
    case "base64-encoder-decoder":
      return `${baseUrl}/social/base64-encoder-decoder-kodekit.png`;
    case "find-my-ip-address":
      return `${baseUrl}/social/find-my-ip-address-kodekit.png`;

    //Design Section
    case "gradient-generator":
      return `${baseUrl}/social/free-gradient-color-generator-kodekit.png`;
    case "image-compressor":
      return `${baseUrl}/social/free-image-compressor-kodekit.png`;
    case "qr-code-generator":
      return `${baseUrl}/social/free-qr-code-generator-kodekit.png`;
    case "color-picker":
      return `${baseUrl}/social/html-color-picker-kodekit.png`;

    //Text Section
    case "lorem-ipsum-generator":
      return `${baseUrl}/social/lorem-ipsum-generator-free-kodekit.png`;
    case "text-case-converter":
      return `${baseUrl}/social/text-case-converter-kodekit.png`;
    case "word-count":
      return `${baseUrl}/social/word-count-tool-kodekit.png`;

    //Math Section

    //HealthCare Section

    //Time Section

    //Finance Section
    case "ssy-calculator":
      return `${baseUrl}/social/sukanya-samriddhi-yojana-calculator-kodekit.png`;
    case "swp-calculator":
      return `${baseUrl}/social/systematic-withdrawal-plan-calculator-kodekit.png`;
    case "sip-calculator":
      return `${baseUrl}/social/systematic-investment-plan-calculator-kodekit.png`;
    case "ppf-calculator":
      return `${baseUrl}/social/public-provident-fund-calculator-kodekit.png`;
    case "nps-calculator":
      return `${baseUrl}/social/national-pension-system-calculator-kodekit.png`;

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
  // Create more compelling titles for better CTR
  const getOptimizedTitle = (tool: any) => {
    switch (toolName) {
      case "image-to-pdf-converter":
        return "Convert Images to PDF Free Online - No Watermarks";
      case "jwt-decoder":
        return "JWT Decoder - Decode JSON Web Tokens Instantly";
      case "json-compare":
        return "Compare JSON Files Online - Free JSON Diff Tool";
      case "svg-editor":
        return "Free SVG Editor Online - Create & Edit Vector Graphics";
      case "blood-pressure-calculator":
        return "Blood Pressure Calculator - Check Your BP Category";
      default:
        return `${tool.title} - Free Online Tool`;
    }
  };

  const toolTitle = getOptimizedTitle(tool);
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
