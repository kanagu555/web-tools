export interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'pdf' | 'text' | 'design' | 'developer' | 'utility';
  popular: boolean;
  route?: string;
}

export const toolsData: ToolItem[] = [
  // PDF Tools
  {
    id: 'pdf-converter',
    title: 'Image to PDF Converter',
    description: 'Convert documents to PDF format',
    icon: 'file-text',
    category: 'pdf',
    popular: true,
    route: '/tools/image-to-pdf',
  },
  {
    id: 'pdf-merger',
    title: 'PDF Merger',
    description: 'Combine multiple PDF files into one',
    icon: 'file-stack',
    category: 'pdf',
    popular: true,
    route: '/tools/pdf-merger',
  },
  {
    id: 'pdf-splitter',
    title: 'PDF Splitter',
    description: 'Split PDF files into multiple documents',
    icon: 'scissors',
    category: 'pdf',
    popular: true,
    route: '/tools/pdf-splitter',
  },
  {
    id: 'pdf-compressor',
    title: 'PDF Compressor',
    description: 'Reduce PDF file size without losing quality',
    icon: 'file-minus',
    category: 'pdf',
    popular: false,
    route: '/tools/pdf-compressor',
  },
  {
    id: 'pdf-editor',
    title: 'PDF Editor',
    description: 'Edit text and images in PDF files',
    icon: 'file-edit',
    category: 'pdf',
    popular: false,
    route: '/tools/pdf-editor',
  },

  // Text Tools
  {
    id: 'word-count',
    title: 'Word Count',
    description: 'Count words and characters in real-time',
    icon: 'text',
    category: 'text',
    popular: true,
    route: '/tools/word-count',
  },
  {
    id: 'text-formatter',
    title: 'Text Formatter',
    description: 'Format and beautify your text',
    icon: 'align-center',
    category: 'text',
    popular: true,
    route: '/tools/text-formatter',
  },
  {
    id: 'text-translator',
    title: 'Text Translator',
    description: 'Translate text between multiple languages',
    icon: 'languages',
    category: 'text',
    popular: true,
    route: '/tools/text-translator',
  },
  {
    id: 'text-case-converter',
    title: 'Text Case Converter',
    description: 'Convert text between different cases',
    icon: 'text-cursor',
    category: 'text',
    popular: false,
    route: '/tools/text-case-converter',
  },
  {
    id: 'lorem-ipsum',
    title: 'Lorem Ipsum Generator',
    description: 'Generate lorem ipsum placeholder text',
    icon: 'quote',
    category: 'text',
    popular: false,
    route: '/tools/lorem-ipsum',
  },

  // Design Tools
  {
    id: 'color-picker',
    title: 'Color Picker',
    description: 'Select and generate color palettes',
    icon: 'palette',
    category: 'design',
    popular: true,
    route: '/tools/color-picker',
  },
  {
    id: 'image-editor',
    title: 'Image Editor',
    description: 'Edit and enhance your images online',
    icon: 'image',
    category: 'design',
    popular: true,
    route: '/tools/image-editor',
  },
  {
    id: 'svg-editor',
    title: 'SVG Editor',
    description: 'Create and edit SVG graphics',
    icon: 'vector-bezier',
    category: 'design',
    popular: false,
    route: '/tools/svg-editor',
  },

  // Developer Tools
  {
    id: 'json-formatter',
    title: 'JSON Formatter',
    description: 'Format and validate JSON data',
    icon: 'braces',
    category: 'developer',
    popular: true,
    route: '/tools/json-formatter',
  },
  {
    id: 'html-formatter',
    title: 'HTML Formatter',
    description: 'Format and beautify HTML code',
    icon: 'code',
    category: 'developer',
    popular: true,
    route: '/tools/html-formatter',
  },
  {
    id: 'css-minifier',
    title: 'CSS Minifier',
    description: 'Minify CSS code to reduce file size',
    icon: 'file-json',
    category: 'developer',
    popular: false,
    route: '/tools/css-minifier',
  },
];

export const popularTools = toolsData.filter(tool => tool.popular);

export const toolCategories = [
  { id: 'pdf', title: 'PDF Tools', icon: 'file-text' },
  { id: 'text', title: 'Text Tools', icon: 'text' },
  { id: 'design', title: 'Design Tools', icon: 'palette' },
  { id: 'developer', title: 'Developer Tools', icon: 'code-2' },
];