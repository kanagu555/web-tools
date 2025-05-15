import { PdfIcon, TextIcon, DesignIcon, DeveloperIcon } from "./utils";
export interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "pdf" | "text" | "design" | "developer" | "utility";
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
    description: "Tools for developers and programmers",
  },
];
