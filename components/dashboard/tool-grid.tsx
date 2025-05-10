"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  useTheme,
  CircularProgress,
  Card,
} from "@mui/material";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import PaletteIcon from "@mui/icons-material/Palette";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DescriptionIcon from "@mui/icons-material/Description";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import ImageIcon from "@mui/icons-material/Image";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import CalculateIcon from "@mui/icons-material/Calculate";
import TranslateIcon from "@mui/icons-material/Translate";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CodeIcon from "@mui/icons-material/Code";
import DataObjectIcon from "@mui/icons-material/DataObject";
import PasswordIcon from "@mui/icons-material/Password";
import LinkIcon from "@mui/icons-material/Link";
import PercentIcon from "@mui/icons-material/Percent";

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
        color: "#3f51b5",
      },
      {
        title: "PDF Merger",
        description: "Combine multiple PDF files into one",
        icon: DescriptionIcon,
        href: "/pdf-merger",
        color: "#3f51b5",
      },
      {
        title: "PDF Splitter",
        description: "Split PDF files into multiple documents",
        icon: DescriptionIcon,
        href: "/pdf-splitter",
        color: "#3f51b5",
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
        color: "#4caf50",
      },
      {
        title: "Text Formatter",
        description: "Format and beautify your text",
        icon: TextFormatIcon,
        href: "/text-formatter",
        color: "#4caf50",
      },
      {
        title: "Text Translator",
        description: "Translate text between multiple languages",
        icon: TranslateIcon,
        href: "/text-translator",
        color: "#4caf50",
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
        color: "#9c27b0",
      },
      {
        title: "Color Picker",
        description: "Pick colors from images or create your own",
        icon: FormatColorFillIcon,
        href: "/color-picker",
        color: "#9c27b0",
      },
      {
        title: "QR Code Generator",
        description: "Create custom QR codes for any URL or text",
        icon: QrCodeIcon,
        href: "/qr-code-generator",
        color: "#9c27b0",
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
        color: "#f44336",
      },
      {
        title: "Password Generator",
        description: "Create strong, secure passwords",
        icon: PasswordIcon,
        href: "/password-generator",
        color: "#f44336",
      },
      {
        title: "URL Decoder & Encoder",
        description: "Encode and decode URLs and query parameters",
        icon: LinkIcon,
        href: "/url-decoder-encoder",
        color: "#f44336",
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
        color: "#ff9800",
      },
      {
        title: "Unit Converter",
        description: "Convert between different units of measurement",
        icon: CalculateIcon,
        href: "/unit-converter",
        color: "#ff9800",
      },
      {
        title: "Percentage Calculator",
        description: "Calculate percentages, increases, and discounts",
        icon: PercentIcon,
        href: "/percentage-calculator",
        color: "#ff9800",
      },
    ],
  },
];

export function ToolGrid() {
  const router = useRouter();
  const theme = useTheme();
  const [loadingTool, setLoadingTool] = useState<string | null>(null);

  // Prefetch popular routes for faster navigation
  useEffect(() => {
    tools.forEach((category) => {
      category.items.forEach((tool) => {
        router.prefetch(tool.href);
      });
    });
  }, [router]);

  const handleToolClick = (href: string) => {
    setLoadingTool(href);
    router.push(href);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {tools.map((category) => (
        <Box key={category.category} sx={{ mb: 6, width: "100%" }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              borderBottom: "1px solid",
              borderColor: "divider",
              paddingBottom: 1,
              marginBottom: 3,
              width: "100%",
            }}
          >
            {category.category}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              width: "100%",
            }}
          >
            {category.items.map((tool) => (
              <Box
                key={tool.href}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 12px)",
                    md: "calc(33.333% - 16px)",
                  },
                  mb: { xs: 3, sm: 0 },
                }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 8px 16px rgba(0, 0, 0, 0.5)"
                          : 8,
                    },
                    position: "relative",
                    overflow: "hidden",
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  }}
                >
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
                          minWidth: 56,
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
                        sx={{ textTransform: "none" }}
                      >
                        Open Tool
                      </Button>
                    </Box>
                  </Box>
                </Card>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
              mt: 2,
            }}
          >
            <Button
              variant="text"
              onClick={() =>
                router.push(
                  `/category/${category.category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
                )
              }
              endIcon={<ArrowForwardIcon />}
            >
              View All {category.category}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
