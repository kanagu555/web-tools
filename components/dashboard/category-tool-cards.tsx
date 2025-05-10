import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";
// Import necessary icons
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import TranslateIcon from "@mui/icons-material/Translate";
import PaletteIcon from "@mui/icons-material/Palette";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import QrCodeIcon from "@mui/icons-material/QrCode";

// Add these type definitions at the top of your file
interface Tool {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

interface ToolCategory {
  category: string;
  items: Tool[];
}

// Define the tools data
const tools: ToolCategory[] = [
  {
    category: "PDF Tools",
    items: [
      {
        title: "Image to PDF Converter",
        description: "Convert documents to PDF format",
        icon: PictureAsPdfIcon,
        href: "/image-to-pdf-converter",
      },
      {
        title: "PDF Merger",
        description: "Combine multiple PDF files into one",
        icon: DescriptionIcon,
        href: "/pdf-merger",
      },
      {
        title: "PDF Splitter",
        description: "Split PDF files into multiple documents",
        icon: DescriptionIcon,
        href: "/pdf-splitter",
      },
    ],
  },
  {
    category: "Text Tools",
    items: [
      {
        title: "Word Count",
        description: "Count words and characters in real-time",
        icon: TextFieldsIcon,
        href: "/word-count",
      },
      {
        title: "Text Formatter",
        description: "Format and beautify your text",
        icon: TextFormatIcon,
        href: "/text-formatter",
      },
      {
        title: "Text Translator",
        description: "Translate text between multiple languages",
        icon: TranslateIcon,
        href: "/text-translator",
      },
    ],
  },
  {
    category: "Design Tools",
    items: [
      {
        title: "Color Palette",
        description: "Generate and customize color palettes",
        icon: PaletteIcon,
        href: "/color-palette",
      },
      {
        title: "Color Picker",
        description: "Pick colors from images or create your own",
        icon: FormatColorFillIcon,
        href: "/color-picker",
      },
      {
        title: "QR Code Generator",
        description: "Create custom QR codes for any URL or text",
        icon: QrCodeIcon,
        href: "/qr-code-generator",
      },
    ],
  },
];

export function CategoryToolCards() {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, width: "100%" }}>
      {tools.map((category) => (
        <Paper 
          key={category.category}
          elevation={0}
          sx={{ 
            width: { xs: "100%", md: "calc(33.333% - 16px)" },
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
            mb: { xs: 3, md: 0 }
          }}
        >
          {/* Category Header */}
          <Box sx={{ 
            bgcolor: "primary.main", 
            color: "primary.contrastText",
            p: 2
          }}>
            <Typography variant="h6">{category.category}</Typography>
          </Box>
          
          {/* Tool List */}
          <List sx={{ py: 0, flexGrow: 1 }}>
            {category.items.map((tool) => (
              <ListItem 
                key={tool.href}
                button
                onClick={() => router.push(tool.href)}
                sx={{ 
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  py: 1.5
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box 
                    sx={{ 
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <tool.icon color="primary" fontSize="small" />
                  </Box>
                </ListItemIcon>
                <ListItemText 
                  primary={tool.title}
                  primaryTypographyProps={{ 
                    variant: "body2",
                    fontWeight: 500
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
}


