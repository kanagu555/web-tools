"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  Button,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PaletteIcon from "@mui/icons-material/Palette";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionIcon from "@mui/icons-material/Description";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import ImageIcon from "@mui/icons-material/Image";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import CalculateIcon from "@mui/icons-material/Calculate";
import TranslateIcon from "@mui/icons-material/Translate";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CodeIcon from "@mui/icons-material/Code";
import DataObjectIcon from "@mui/icons-material/DataObject";
import PasswordIcon from "@mui/icons-material/Password";
import { useToolGridStyles } from "@/styles/styles";

// Organized tools by category
const tools = [
  {
    category: "PDF Tools",
    items: [
      {
        title: "Image to PDF Converter",
        description: "Convert documents to PDF format",
        icon: PictureAsPdfIcon,
        href: "/image-to-pdf-converter",
        color: "#3f51b5", // primary blue
      },
      {
        title: "PDF Merger",
        description: "Combine multiple PDF files into one",
        icon: DescriptionIcon,
        href: "/pdf-merger",
        color: "#3f51b5", // lighter blue
      },
      {
        title: "PDF Splitter",
        description: "Split PDF files into multiple documents",
        icon: DescriptionIcon,
        href: "/pdf-splitter",
        color: "#3f51b5", // even lighter blue
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
        color: "#4caf50", // green
      },
      {
        title: "Text Formatter",
        description: "Format and beautify your text",
        icon: TextFormatIcon,
        href: "/text-formatter",
        color: "#4caf50", // lighter green
      },
      {
        title: "Spell Check",
        description: "Check spelling and grammar in your text",
        icon: SpellcheckIcon,
        href: "/spell-check",
        color: "#4caf50", // even lighter green
      },
      {
        title: "Text Translator",
        description: "Translate text between multiple languages",
        icon: TranslateIcon,
        href: "/text-translator",
        color: "#4caf50", // lightest green
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
        color: "#9c27b0", // purple
      },
      {
        title: "Image Editor",
        description: "Edit and enhance your images",
        icon: ImageIcon,
        href: "/image-editor",
        color: "#9c27b0", // lighter purple
      },
      {
        title: "Color Picker",
        description: "Pick colors from images or create your own",
        icon: FormatColorFillIcon,
        href: "/color-picker",
        color: "#9c27b0", // even lighter purple
      },
      {
        title: "QR Code Generator",
        description: "Create custom QR codes for any URL or text",
        icon: QrCodeIcon,
        href: "/qr-code-generator",
        color: "#9c27b0", // lightest purple
      },
    ],
  },
  {
    category: "Developer Tools",
    items: [
      {
        title: "Code Formatter",
        description: "Format and beautify code in various languages",
        icon: CodeIcon,
        href: "/code-formatter",
        color: "#f44336", // red
      },
      {
        title: "JSON Validator",
        description: "Validate and format JSON data",
        icon: DataObjectIcon,
        href: "/json-validator",
        color: "#ef5350", // lighter red
      },
      {
        title: "Password Generator",
        description: "Create strong, secure passwords",
        icon: PasswordIcon,
        href: "/password-generator",
        color: "#f44336", // even lighter red
      },
    ],
  },
  {
    category: "Math Tools",
    items: [
      {
        title: "Calculator",
        description: "Perform basic and advanced calculations",
        icon: CalculateIcon,
        href: "/calculator",
        color: "#ff9800", // orange
      },
      {
        title: "Unit Converter",
        description: "Convert between different units of measurement",
        icon: CalculateIcon,
        href: "/unit-converter",
        color: "#ffa726", // lighter orange
      },
    ],
  },
];

export function ToolGrid() {
  const router = useRouter();
  const theme = useTheme();
  const classes = useToolGridStyles();
  const [loadingTool, setLoadingTool] = useState<string | null>(null);

  // Prefetch popular routes for faster navigation
  useEffect(() => {
    // Prefetch all tool routes to improve initial load time
    tools.forEach(category => {
      category.items.forEach(tool => {
        router.prefetch(tool.href);
      });
    });
  }, [router]);

  const handleToolClick = (href: string) => {
    setLoadingTool(href);
    router.push(href);
  };

  return (
    <Box>
      {tools.map((category, index) => (
        <Box 
          key={category.category} 
          className={`${classes.categorySection} category-section`}
        >
          <Typography
            variant="h5"
            component="h2"
            className={`${classes.categoryTitle} category-title`}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              paddingBottom: 1,
              marginBottom: 3,
            }}
          >
            {category.category}
          </Typography>

          <Grid container spacing={3} justifyContent="flex-start">
            {category.items.map((tool) => (
              <Grid
                item
                key={tool.href}
                xs={12}
                sm={6}
                md={4}
                lg={4}
                sx={{ width: 350 }}
              >
                <Card
                  sx={{
                    width: 350,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 8,
                    },
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Loading overlay */}
                  {loadingTool === tool.href && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.1)",
                        zIndex: 10,
                        backdropFilter: "blur(2px)",
                      }}
                    >
                      <CircularProgress size={40} />
                    </Box>
                  )}

                  <Box
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          backgroundColor: tool.color,
                          color: "white",
                          mr: 2,
                          flexShrink: 0,
                        }}
                      >
                        <tool.icon sx={{ fontSize: 28 }} />
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {tool.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tool.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        mt: "auto",
                        display: "flex",
                        justifyContent: "flex-end",
                        pt: 2,
                      }}
                    >
                      <Button
                        color="primary"
                        onClick={() => handleToolClick(tool.href)}
                        endIcon={<ArrowForwardIcon />}
                        disabled={loadingTool === tool.href}
                        sx={{
                          textTransform: "none",
                          position: "relative",
                          overflow: "hidden",
                          "&::after": {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            height: "2px",
                            backgroundColor: "primary.main",
                            transform: "scaleX(0)",
                            transformOrigin: "bottom right",
                            transition: "transform 0.3s",
                          },
                          "&:hover::after": {
                            transform: "scaleX(1)",
                            transformOrigin: "bottom left",
                          },
                        }}
                      >
                        Open Tool
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>

         
        </Box>
      ))}
    </Box>
  );
}






