import {
  PdfIcon,
  TextIcon,
  DesignIcon,
  DeveloperIcon,
  MathIcon,
} from "../Utils/Utils";
export interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "pdf" | "text" | "design" | "developer" | "utility" | "math";
  popular: boolean;
  route?: string;
}

export interface ToolCategory {
  id: string;
  title: string;
  icon: JSX.Element;
  description: string;
}

export const toolsData: ToolItem[] = [
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
    icon: "palette",
    category: "design",
    popular: false,
    route: "/tools/gradient-generator",
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
    icon: "key",
    category: "developer",
    popular: false,
    route: "/tools/jwt-decoder",
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
];

export const popularTools = toolsData.filter((tool) => tool.popular);

export const toolCategories: ToolCategory[] = [
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
];
