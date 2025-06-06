import {
  PdfIcon,
  TextIcon,
  DesignIcon,
  DeveloperIcon,
  MathIcon,
  FinanceIcon,
  HealthcareIcon,
} from "../Utils/Utils";
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
    | "utility"
    | "math"
    | "finance"
    | "healthcare";
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
    icon: "file-text",
    category: "pdf",
    popular: true,
    route: "/tools/image-to-pdf",
  },
  {
    id: "pdf-merger",
    title: "PDF Merger",
    description: "Combine multiple PDF files into one",
    icon: "file-stack",
    category: "pdf",
    popular: true,
    route: "/tools/pdf-merger",
  },
  {
    id: "pdf-splitter",
    title: "PDF Splitter",
    description: "Split PDF files into multiple documents",
    icon: "scissors",
    category: "pdf",
    popular: true,
    route: "/tools/pdf-splitter",
  },
  {
    id: "pdf-compressor",
    title: "PDF Compressor",
    description: "Reduce PDF file size without losing quality",
    icon: "file-minus",
    category: "pdf",
    popular: false,
    route: "/tools/pdf-compressor",
  },

  // Text Tools
  {
    id: "word-count",
    title: "Word Count",
    description: "Count words and characters in real-time",
    icon: "text",
    category: "text",
    popular: true,
    route: "/tools/word-count",
  },
  {
    id: "text-formatter",
    title: "Text Formatter",
    description: "Format and beautify your text",
    icon: "align-center",
    category: "text",
    popular: true,
    route: "/tools/text-formatter",
  },
  {
    id: "text-translator",
    title: "Text Translator",
    description: "Translate text between multiple languages",
    icon: "languages",
    category: "text",
    popular: false,
    route: "/tools/text-translator",
  },
  {
    id: "text-case-converter",
    title: "Text Case Converter",
    description: "Convert text between different cases",
    icon: "text-cursor",
    category: "text",
    popular: false,
    route: "/tools/text-case-converter",
  },
  {
    id: "lorem-ipsum",
    title: "Lorem Ipsum Generator",
    description: "Generate lorem ipsum placeholder text",
    icon: "quote",
    category: "text",
    popular: false,
    route: "/tools/lorem-ipsum",
  },

  // Design Tools
  {
    id: "color-picker",
    title: "Color Picker",
    description: "Select and generate color palettes",
    icon: "palette",
    category: "design",
    popular: true,
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
    icon: "image",
    category: "design",
    popular: false,
    route: "/tools/image-resizer",
  },
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
    popular: true,
    route: "/tools/json-formatter",
  },
  {
    id: "json-compare",
    title: "JSON Compare Tool",
    description: "Compare JSON data and see the differences",
    icon: "git-compare-arrows",
    category: "developer",
    popular: true,
    route: "/tools/json-compare",
  },
  {
    id: "css-minifier",
    title: "CSS Minifier",
    description: "Minify and optimize CSS code to reduce file size",
    icon: "file-code",
    category: "developer",
    popular: false,
    route: "/tools/css-minifier",
  },
  {
    id: "regex-tester",
    title: "Regex Tester",
    description: "Test and debug regular expressions",
    icon: "code",
    category: "developer",
    popular: false,
    route: "/tools/regex-tester",
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Decode and verify JWT tokens",
    icon: "file-key-2",
    category: "developer",
    popular: false,
    route: "/tools/jwt-decoder",
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
  {
    id: "url-decoder-encoder",
    title: "URL Encoder Decoder",
    description: "Encode and decode URLs",
    icon: "earth-lock",
    category: "developer",
    popular: false,
    route: "/tools/url-encoder-decoder",
  },
  {
    id: "password-generator",
    title: "Password Generator",
    description: "Generate secure, random passwords",
    icon: "shield-check",
    category: "developer",
    popular: false,
    route: "/tools/password-generator",
  },

  // Math Tools
  {
    id: "calculator",
    title: "Calculator",
    description: "Perform complex mathematical calculations",
    icon: "calculator",
    category: "math",
    popular: true,
    route: "/tools/calculator",
  },
  {
    id: "age-calculator",
    title: "Age Calculator",
    description: "Calculate age based on birthdate",
    icon: "birthday-cake",
    category: "math",
    popular: false,
    route: "/tools/age-calculator",
  },
  {
    id: "unit-converter",
    title: "Unit Converter",
    description: "Convert between different units of measurement",
    icon: "repeat",
    category: "math",
    popular: true,
    route: "/tools/unit-converter",
  },
  {
    id: "matrix-calculator",
    title: "Matrix Calculator",
    description: "Perform matrix operations and calculations",
    icon: "grid",
    category: "math",
    popular: false,
    route: "/tools/matrix-calculator",
  },
  {
    id: "equation-solver",
    title: "Equation Solver",
    description: "Solve mathematical equations step by step",
    icon: "equal",
    category: "math",
    popular: false,
    route: "/tools/equation-solver",
  },
  {
    id: "statistics-calculator",
    title: "Statistics Calculator",
    description: "Calculate statistical measures and analysis",
    icon: "bar-chart",
    category: "math",
    popular: false,
    route: "/tools/statistics-calculator",
  },
  {
    id: "multiplication-tables",
    title: "Multiplication Tables",
    description: "Generate multiplication tables for any number",
    icon: "times",
    category: "math",
    popular: false,
    route: "/tools/multiplication-tables",
  },

  // Finance Tools
  {
    id: "loan-calculator",
    title: "Loan Calculator",
    description:
      "Calculate loan payments, interest, and amortization schedules",
    icon: "credit-card",
    category: "finance",
    popular: false,
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
    id: "time-converter",
    title: "Time Converter",
    description:
      "Convert between time units for financial calculations and interest periods",
    icon: "clock",
    category: "finance",
    popular: false,
    route: "/tools/time-converter",
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
    icon: PdfIcon,
    description: "Convert, merge, split and manipulate PDF files",
  },
  {
    id: "text",
    title: "Text Tools",
    icon: TextIcon,
    description: "Format, analyze and transform text content",
  },
  {
    id: "design",
    title: "Design Tools",
    icon: DesignIcon,
    description: "Create and edit visual content",
  },
  {
    id: "developer",
    title: "Developer Tools",
    icon: DeveloperIcon,
    description:
      "A collection of tools for developers to format, debug, and optimize code.",
  },
  {
    id: "math",
    title: "Math Tools",
    icon: MathIcon,
    description:
      "A suite of tools for performing mathematical calculations and solving equations.",
  },
  {
    id: "finance",
    title: "Finance Tools",
    icon: FinanceIcon,
    description:
      "Tools for financial calculations, currency conversion, and investment analysis.",
  },
  {
    id: "healthcare",
    title: "Healthcare Tools",
    icon: HealthcareIcon,
    description:
      "Tools for healthcare professionals to calculate and analyze medical data.",
  },
];

export { toolsData, toolCategories, popularTools };
