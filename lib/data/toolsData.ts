import {
  PdfCategoryIcon,
  TextCategoryIcon,
  DesignCategoryIcon,
  DeveloperCategoryIcon,
  MathCategoryIcon,
  FinanceCategoryIcon,
  HealthcareCategoryIcon,
  TimeCategoryIcon,
} from "../utils/icons";

export interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category:
    | "pdf"
    | "text"
    | "design"
    | "developer"
    | "math"
    | "finance"
    | "healthcare"
    | "time";
  popular: boolean;
  route?: string;
}

export interface ToolCategory {
  id: string;
  title: string;
  icon: JSX.Element;
  description: string;
}

const toolsData: ToolItem[] = [
  // PDF Tools
  {
    id: "pdf-converter",
    title: "Image to PDF Converter",
    description: "Convert documents to PDF format",
    icon: "image-to-pdf",
    category: "pdf",
    popular: true,
    route: "/tools/image-to-pdf-converter",
  },
  {
    id: "pdf-merger",
    title: "PDF Merger",
    description: "Combine multiple PDF files into one",
    icon: "pdf-merger",
    category: "pdf",
    popular: true,
    route: "/tools/pdf-merger",
  },
  {
    id: "pdf-splitter",
    title: "PDF Splitter",
    description: "Split PDF files into multiple documents",
    icon: "pdf-splitter",
    category: "pdf",
    popular: true,
    route: "/tools/pdf-splitter",
  },
  {
    id: "pdf-page-rotator",
    title: "PDF Page Rotator",
    description: "Rotate PDF pages 90°, 180°, or 270° clockwise",
    icon: "rotate-cw",
    category: "pdf",
    popular: false,
    route: "/tools/pdf-page-rotator",
  },
  // {
  //   id: "pdf-compressor",
  //   title: "PDF Compressor",
  //   description: "Reduce PDF file size without losing quality",
  //   icon: "file-minus",
  //   category: "pdf",
  //   popular: false,
  //   route: "/tools/pdf-compressor",
  // },

  // Text Tools
  {
    id: "word-count",
    title: "Word Count",
    description: "Count words and characters in real-time",
    icon: "word-count",
    category: "text",
    popular: false,
    route: "/tools/word-count",
  },

  {
    id: "text-case-converter",
    title: "Text Case Converter",
    description: "Convert text between different cases",
    icon: "text-cursor",
    category: "text",
    popular: true,
    route: "/tools/text-case-converter",
  },
  {
    id: "lorem-ipsum-generator",
    title: "Lorem Ipsum Generator",
    description: "Generate lorem ipsum placeholder text",
    icon: "quote",
    category: "text",
    popular: false,
    route: "/tools/lorem-ipsum-generator",
  },
  {
    id: "markdown-editor",
    title: "Markdown Editor",
    description: "Create and edit Markdown documents with live preview",
    icon: "file-text",
    category: "text",
    popular: false,
    route: "/tools/markdown-editor",
  },

  // Design Tools
  {
    id: "color-picker",
    title: "Color Picker",
    description: "Select and generate color palettes",
    icon: "palette",
    category: "design",
    popular: false,
    route: "/tools/color-picker",
  },
  {
    id: "svg-editor",
    title: "SVG Editor",
    description: "Create and edit SVG graphics",
    icon: "vector-bezier",
    category: "design",
    popular: false,
    route: "/tools/svg-editor",
  },
  {
    id: "image-resizer",
    title: "Image Resizer",
    description: "Resize and optimize images",
    icon: "image-resizer",
    category: "design",
    popular: false,
    route: "/tools/image-resizer",
  },
  {
    id: "image-compressor",
    title: "Image Compressor",
    description: "Compress images to reduce file size without losing quality.",
    icon: "image-compressor",
    category: "design",
    popular: false,
    route: "/tools/image-compressor",
  },
  // {
  //   id: "image-to-ascii",
  //   title: "Image to ASCII Art",
  //   description: "Convert images to ASCII art",
  //   icon: "terminal",
  //   category: "design",
  //   popular: false,
  //   route: "/tools/image-to-ascii",
  // },
  // {
  //   id: "favicon-generator",
  //   title: "Favicon Generator",
  //   description: "Create favicons for your website",
  //   icon: "star",
  //   category: "design",
  //   popular: false,
  //   route: "/tools/favicon-generator",
  // },

  {
    id: "gradient-generator",
    title: "Gradient Generator",
    description: "Create beautiful color gradients",
    icon: "swatch-book",
    category: "design",
    popular: false,
    route: "/tools/gradient-generator",
  },
  {
    id: "qr-code-generator",
    title: "QR Code Generator",
    description: "Generate QR codes for URLs and text",
    icon: "qr-code",
    category: "design",
    popular: false,
    route: "/tools/qr-code-generator",
  },

  // Developer Tools
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format and validate JSON data",
    icon: "braces",
    category: "developer",
    popular: false,
    route: "/tools/json-formatter",
  },
  {
    id: "fake-credit-card-generator",
    title: "Fake Credit Card Generator",
    description: "Generate fake credit card numbers for testing",
    icon: "credit-card",
    category: "developer",
    popular: true,
    route: "/tools/fake-credit-card-generator",
  },
  {
    id: "json-compare",
    title: "JSON Compare Tool",
    description: "Compare JSON data and see the differences",
    icon: "git-compare-arrows",
    category: "developer",
    popular: false,
    route: "/tools/json-compare",
  },
  {
    id: "css-minifier",
    title: "CSS Minifier",
    description: "Minify and optimize CSS code to reduce file size",
    icon: "css-minifier",
    category: "developer",
    popular: false,
    route: "/tools/css-minifier",
  },
  {
    id: "regex-tester",
    title: "Regex Tester",
    description: "Test and debug regular expressions",
    icon: "regex",
    category: "developer",
    popular: false,
    route: "/tools/regex-tester",
  },
  {
    id: "base64-encoder-decoder",
    title: "Base64 Encoder Decoder",
    description: "Encode and decode text using Base64 encoding",
    icon: "fingerprint",
    category: "developer",
    popular: false,
    route: "/tools/base64-encoder-decoder",
  },

  // {
  //   id: "url-shortener",
  //   title: "URL Shortener",
  //   description: "Create short, shareable links from long URLs",
  //   icon: "link",
  //   category: "developer",
  //   popular: true,
  //   route: "/tools/url-shortener",
  // },
  {
    id: "url-shortener-pro",
    title: "URL Shortener Pro",
    description: "Create short, shareable links from long URLs",
    icon: "url-shortener",
    category: "developer",
    popular: true,
    route: "/tools/url-shortener-pro",
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure, random passwords with customizable options",
    icon: "shield-check",
    category: "developer",
    popular: false,
    route: "/tools/password-generator",
  },
  {
    id: "find-my-ip-address",
    title: "Find My IP Address",
    description: "Quickly find your public IP address",
    icon: "wifi",
    category: "developer",
    popular: false,
    route: "/tools/find-my-ip-address",
  },
  {
    id: "hash-generator",
    title: "Hash Generator",
    description: "Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512)",
    icon: "hash",
    category: "developer",
    popular: false,
    route: "/tools/hash-generator",
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and verify JSON Web Tokens (JWT)",
    icon: "jwt-decoder",
    category: "developer",
    popular: false,
    route: "/tools/jwt-decoder",
  },
  {
    id: "url-encoder-decoder",
    title: "URL Encoder & Decoder",
    description:
      "Encode and decode URLs with special characters and query parameters",
    icon: "link",
    category: "developer",
    popular: false,
    route: "/tools/url-encoder-decoder",
  },
  {
    id: "xml-to-json-converter",
    title: "XML to JSON Converter",
    description:
      "Convert XML data to JSON format with validation and formatting",
    icon: "xml-to-json",
    category: "developer",
    popular: false,
    route: "/tools/xml-to-json-converter",
  },

  // Math Tools
  {
    id: "addition-tables",
    title: "Addition Tables",
    description: "Generate addition tables for learning arithmetic",
    icon: "plus",
    category: "math",
    popular: false,
    route: "/tools/addition-tables",
  },
  {
    id: "multiplication-tables",
    title: "Multiplication Tables",
    description:
      "Generate customizable multiplication tables for learning and practice",
    icon: "x",
    category: "math",
    popular: false,
    route: "/tools/multiplication-tables",
  },
  {
    id: "age-calculator",
    title: "Age Calculator",
    description:
      "Calculate your exact age in years, months, and days with precision",
    icon: "age-calculator",
    category: "math",
    popular: false,
    route: "/tools/age-calculator",
  },
  {
    id: "equation-solver",
    title: "Equation Solver",
    description:
      "Solve linear equations, quadratic equations, and systems of equations with detailed step-by-step solutions",
    icon: "equal",
    category: "math",
    popular: false,
    route: "/tools/equation-solver",
  },
  {
    id: "calculator",
    title: "Calculator",
    description:
      "Free online calculator for basic arithmetic operations with keyboard support and calculation history",
    icon: "calculator",
    category: "math",
    popular: false,
    route: "/tools/calculator",
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description:
      "Convert between 100+ units across 10+ categories including length, weight, temperature, volume, time, speed, pressure, energy, and digital storage",
    icon: "repeat",
    category: "math",
    popular: true,
    route: "/tools/unit-converter",
  },
  {
    id: "matrix-calculator",
    title: "Matrix Calculator",
    description:
      "Perform matrix operations including addition, subtraction, multiplication, transpose, determinant, and inverse calculations",
    icon: "grid",
    category: "math",
    popular: false,
    route: "/tools/matrix-calculator",
  },
  {
    id: "statistics-calculator",
    title: "Statistics Calculator",
    description:
      "Calculate mean, median, mode, standard deviation, variance, quartiles, and comprehensive statistical analysis",
    icon: "bar-chart",
    category: "math",
    popular: false,
    route: "/tools/statistics-calculator",
  },
  {
    id: "percentage-calculator",
    title: "Percentage Calculator",
    description:
      "Calculate percentages, tips, discounts, and percentage changes",
    icon: "percent",
    category: "math",
    popular: true,
    route: "/tools/percentage-calculator",
  },

  // Time Tools
  {
    id: "time-converter",
    title: "Time Converter",
    description: "Convert between time units for calculations",
    icon: "clock",
    category: "time",
    popular: false,
    route: "/tools/time-converter",
  },
  {
    id: "timestamp-converter",
    title: "Timestamp Converter",
    description: "Convert Unix timestamp to human-readable dates",
    icon: "calendar",
    category: "time",
    popular: false,
    route: "/tools/timestamp-converter",
  },
  {
    id: "stopwatch",
    title: "Stopwatch",
    description: "Online stopwatch for timing activities",
    icon: "timer",
    category: "time",
    popular: false,
    route: "/tools/stopwatch",
  },
  {
    id: "countdown-timer",
    title: "Countdown Timer",
    description: "Set countdown timers for events and deadlines",
    icon: "alarm-clock",
    category: "time",
    popular: false,
    route: "/tools/countdown-timer",
  },

  // Finance Tools
  {
    id: "loan-calculator",
    title: "Loan Calculator",
    description:
      "Calculate EMI, total interest, and detailed amortization schedules for home loans, personal loans, auto loans, and more with payment breakdown",
    icon: "loan-calculator",
    category: "finance",
    popular: true,
    route: "/tools/loan-calculator",
  },
  {
    id: "sip-calculator",
    title: "SIP Calculator",
    description:
      "Calculate returns on Systematic Investment Plans and track wealth growth",
    icon: "trending-up",
    category: "finance",
    popular: false,
    route: "/tools/sip-calculator",
  },
  {
    id: "mutual-fund-details",
    title: "Mutual Fund Details",
    description:
      "View detailed mutual fund information, NAV history, and performance",
    icon: "trending-up",
    category: "finance",
    popular: false,
    route: "/tools/mutual-fund-details",
  },
  {
    id: "ssy-calculator",
    title: "Sukanya Samriddhi Yojana Calculator",
    description:
      "Calculate SSY returns, maturity amount, and investment growth for your girl child's future",
    icon: "baby",
    category: "finance",
    popular: true,
    route: "/tools/ssy-calculator",
  },
  {
    id: "ppf-calculator",
    title: "PPF Calculator",
    description:
      "Calculate Public Provident Fund returns, maturity amount, and tax-saving benefits",
    icon: "shield",
    category: "finance",
    popular: false,
    route: "/tools/ppf-calculator",
  },
  {
    id: "swp-calculator",
    title: "SWP Calculator",
    description:
      "Calculate Systematic Withdrawal Plan returns, sustainability, and retirement income",
    icon: "trending-down",
    category: "finance",
    popular: false,
    route: "/tools/swp-calculator",
  },
  {
    id: "lumpsum-calculator",
    title: "Lumpsum Calculator",
    description:
      "Calculate lumpsum investment returns, compound growth, and wealth creation",
    icon: "zap",
    category: "finance",
    popular: false,
    route: "/tools/lumpsum-calculator",
  },
  {
    id: "nps-calculator",
    title: "NPS Calculator",
    description:
      "Calculate National Pension System returns, retirement corpus, and monthly pension",
    icon: "users",
    category: "finance",
    popular: false,
    route: "/tools/nps-calculator",
  },

  // Healthcare Tools
  {
    id: "blood-pressure-calculator",
    title: "Blood Pressure Calculator",
    description:
      "Calculate blood pressure categories and risk levels based on systolic and diastolic readings",
    icon: "heart",
    category: "healthcare",
    popular: false,
    route: "/tools/blood-pressure-calculator",
  },
  {
    id: "bmi-calculator",
    title: "BMI Calculator",
    description: "Calculate Body Mass Index (BMI) based on weight and height",
    icon: "weight",
    category: "healthcare",
    popular: false,
    route: "/tools/bmi-calculator",
  },
  {
    id: "calorie-calculator",
    title: "Calorie Calculator",
    description:
      "Calculate daily calorie needs for weight loss, maintenance, or gain",
    icon: "flame",
    category: "healthcare",
    popular: false,
    route: "/tools/calorie-calculator",
  },
];

const popularTools = toolsData.filter((tool) => tool.popular);

const toolCategories: ToolCategory[] = [
  {
    id: "pdf",
    title: "PDF Tools",
    icon: PdfCategoryIcon,
    description: "Convert, merge, split and manipulate PDF files",
  },
  {
    id: "text",
    title: "Text Tools",
    icon: TextCategoryIcon,
    description: "Format, analyze and transform text content",
  },
  {
    id: "design",
    title: "Design Tools",
    icon: DesignCategoryIcon,
    description: "Create and edit visual content",
  },
  {
    id: "developer",
    title: "Developer Tools",
    icon: DeveloperCategoryIcon,
    description:
      "A collection of tools for developers to format, debug, and optimize code.",
  },
  {
    id: "math",
    title: "Math Tools",
    icon: MathCategoryIcon,
    description:
      "A suite of tools for performing mathematical calculations and solving equations.",
  },
  {
    id: "finance",
    title: "Finance Tools",
    icon: FinanceCategoryIcon,
    description:
      "Tools for financial calculations, currency conversion, and investment analysis.",
  },
  {
    id: "healthcare",
    title: "Healthcare Tools",
    icon: HealthcareCategoryIcon,
    description:
      "Tools for healthcare professionals to calculate and analyze medical data.",
  },
  {
    id: "time",
    title: "Time Tools",
    icon: TimeCategoryIcon,
    description:
      "Tools for time-related calculations, conversions, and scheduling.",
  },
];

export { toolsData, toolCategories, popularTools };
