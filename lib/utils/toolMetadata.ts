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
    case "url-shortener-pro":
      return `${baseUrl}/social/url-shortener-free-kodekit.png`;
    case "password-generator":
      return `${baseUrl}/social/password-generator-free-kodekit.png`;
    case "hash-generator":
      return `${baseUrl}/social/hash-generator-free-kodekit.png`;
    case "url-encoder-decoder":
      return `${baseUrl}/social/url-encoder-decoder-free-kodekit.png`;
    case "xml-to-json-converter":
      return `${baseUrl}/social/xml-to-json-converter-free-kodekit.png`;
    case "api-tester-online":
      return `${baseUrl}/social/rest-api-tester-free-kodekit.png`;

    //Design Section
    case "gradient-generator":
      return `${baseUrl}/social/free-gradient-color-generator-kodekit.png`;
    case "image-compressor":
      return `${baseUrl}/social/free-image-compressor-kodekit.png`;
    case "qr-code-generator":
      return `${baseUrl}/social/free-qr-code-generator-kodekit.png`;
    case "color-picker":
      return `${baseUrl}/social/html-color-picker-kodekit.png`;
    case "youtube-thumbnail-downloader":
      return `${baseUrl}/social/free-youtube-thumbnail-downloader-kodekit.png`;

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
      // PDF Tools
      case "image-to-pdf-converter":
        return "Image to PDF Converter - Free Online No Watermarks";
      case "pdf-merger":
        return "PDF Merger - Combine PDFs Online Free Instantly";
      case "pdf-splitter":
        return "PDF Splitter - Split PDF Files Online Free";
      case "pdf-page-rotator":
        return "PDF Page Rotator - Rotate Pages 90° 180° 270° Free";
      case "pdf-metadata-editor":
        return "PDF Metadata Editor - Edit Title Author Keywords Free";

      // Text Tools
      case "word-count":
        return "Word Count Tool - Count Words Characters Online Free";
      case "text-case-converter":
        return "Text Case Converter - Upper Lower Title Case Online";
      case "lorem-ipsum-generator":
        return "Lorem Ipsum Generator - Free Placeholder Text Online";
      case "markdown-editor":
        return "Markdown Editor - Live Preview Free Online";
      case "text-compare":
        return "Text Compare Tool - Diff Highlight Side by Side Free";

      // Design Tools
      case "color-picker":
        return "Color Picker - HTML RGB Hex Palette Generator Free";
      case "svg-editor":
        return "SVG Editor - Free Online Vector Graphics Creator";
      case "image-resizer":
        return "Image Resizer - Resize Optimize Images Online Free";
      case "image-compressor":
        return "Image Compressor - Reduce Size No Quality Loss Free";
      case "gradient-generator":
        return "Gradient Generator - Create CSS Linear Gradients Free";
      case "qr-code-generator":
        return "QR Code Generator - Create QR Codes URLs Text Free";
      case "youtube-thumbnail-downloader":
        return "YouTube Thumbnail Downloader - HD SD Free Instant";

      // Developer Tools
      case "json-formatter":
        return "JSON Formatter - Format Validate JSON Online Free";
      case "fake-credit-card-generator":
        return "Fake Credit Card Generator - Test Numbers Free";
      case "json-compare":
        return "JSON Compare - Free Online JSON Diff Tool";
      case "css-minifier":
        return "CSS Minifier - Minify Optimize CSS Code Free";
      case "regex-tester":
        return "Regex Tester - Test Debug Regular Expressions Free";
      case "base64-encoder-decoder":
        return "Base64 Encoder Decoder - Encode Decode Text Free";
      case "url-shortener-pro":
        return "URL Shortener Pro - Create Short Links Free Instant";
      case "password-generator":
        return "Password Generator - Secure Random Passwords Free";
      case "find-my-ip-address":
        return "Find My IP Address - Check Public IP Free";
      case "hash-generator":
        return "Hash Generator - MD5 SHA256 SHA512 Free Online";
      case "jwt-decoder":
        return "JWT Decoder - Decode JSON Web Tokens Instantly";
      case "url-encoder-decoder":
        return "URL Encoder Decoder - Encode Decode URLs Free";
      case "xml-to-json-converter":
        return "XML to JSON Converter - Convert Format Free Online";
      case "api-tester-online":
        return "API Tester - Test REST APIs Online Free";

      // Math Tools
      case "addition-tables":
        return "Addition Tables - Learn Arithmetic Free Online";
      case "multiplication-tables":
        return "Multiplication Tables - Customizable Learning Tool";
      case "age-calculator":
        return "Age Calculator - Exact Age Years Months Days Free";
      case "equation-solver":
        return "Equation Solver - Linear Quadratic Step-by-Step Free";
      case "calculator":
        return "Basic Calculator - Free Online Math Operations";
      case "unit-converter":
        return "Unit Converter - 100+ Units Length Weight Free";
      case "matrix-calculator":
        return "Matrix Calculator - Add Multiply Inverse Free";
      case "statistics-calculator":
        return "Statistics Calculator - Mean Median SD Free";
      case "percentage-calculator":
        return "Percentage Calculator - Tips Discounts Changes Free";

      // Time Tools
      case "time-converter":
        return "Time Converter - Units Hours Minutes Seconds Free";
      case "timestamp-converter":
        return "Timestamp Converter - Unix to Date Free Online";
      case "stopwatch":
        return "Stopwatch - Online Timer for Activities Free";
      case "countdown-timer":
        return "Countdown Timer - Set Timers Events Deadlines Free";

      // Finance Tools
      case "loan-calculator":
        return "Loan Calculator - EMI Interest Amortization Free";
      case "sip-calculator":
        return "SIP Calculator - Systematic Investment Returns Free";
      case "mutual-fund-details":
        return "Mutual Fund Details - NAV History Performance Free";
      case "ssy-calculator":
        return "SSY Calculator - Sukanya Samriddhi Returns Free";
      case "ppf-calculator":
        return "PPF Calculator - Public Provident Fund Maturity Free";
      case "swp-calculator":
        return "SWP Calculator - Systematic Withdrawal Plan Free";
      case "lumpsum-calculator":
        return "Lumpsum Calculator - Investment Growth Free Online";
      case "nps-calculator":
        return "NPS Calculator - National Pension Returns Free";
      case "retirement-calculator":
        return "Retirement Calculator - Savings Corpus Free";

      // Healthcare Tools
      case "blood-pressure-calculator":
        return "Blood Pressure Calculator - BP Category Risk Free";
      case "bmi-calculator":
        return "BMI Calculator - Body Mass Index Weight Height Free";
      case "calorie-calculator":
        return "Calorie Calculator - Daily Needs Loss Gain Free";

      default:
        return `${tool.title} - Free Online Tool`;
    }
  };

  const toolTitle = getOptimizedTitle(tool);
  const toolDescription = `${tool.description} - Free online ${tool.category} tool with instant results. No registration required, works entirely in your browser for maximum privacy. Features include secure local processing, no data uploads, responsive design, and support for multiple formats. Perfect for developers, designers, and everyday users seeking reliable utilities.`;
  const toolUrl = `${baseUrl}/tools/${toolName}`;
  const ogImage = getToolImage(toolName);

  // Enhanced keywords based on tool category and functionality
  const keywords = [
    tool.title.toLowerCase(),
    `${tool.title.toLowerCase()} online`,
    `${tool.title.toLowerCase()} free`,
    tool.category,
    category?.title.toLowerCase() || "",
    "online tool",
    "free tool",
    "web tool",
    "browser tool",
    "no registration",
    "privacy focused",
    "kodekit",
    "developer tools",
    "utility tools",
    // Add specific keywords based on category
    ...(tool.category === "pdf"
      ? [
          "pdf converter",
          "pdf tool",
          "document tool",
          "pdf editor",
          "merge pdf",
          "split pdf",
        ]
      : []),
    ...(tool.category === "text"
      ? [
          "text formatter",
          "text tool",
          "string manipulation",
          "word count",
          "case converter",
        ]
      : []),
    ...(tool.category === "design"
      ? [
          "design tool",
          "graphics tool",
          "image tool",
          "color picker",
          "qr code",
          "gradient",
        ]
      : []),
    ...(tool.category === "developer"
      ? [
          "code formatter",
          "programming tool",
          "dev tool",
          "json formatter",
          "regex tester",
          "jwt decoder",
        ]
      : []),
    ...(tool.category === "math"
      ? [
          "calculator",
          "math tool",
          "calculation",
          "equation solver",
          "unit converter",
        ]
      : []),
    ...(tool.category === "finance"
      ? [
          "financial calculator",
          "investment tool",
          "money tool",
          "sip calculator",
          "loan emi",
        ]
      : []),
    ...(tool.category === "healthcare"
      ? [
          "health calculator",
          "bmi tool",
          "calorie calculator",
          "blood pressure",
        ]
      : []),
    ...(tool.category === "time"
      ? ["time converter", "timestamp tool", "stopwatch", "countdown timer"]
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
