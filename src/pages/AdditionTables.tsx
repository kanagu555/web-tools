import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  useTheme,
  Stack,
  Container,
  Divider,
  Tooltip,
  IconButton,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { motion } from "framer-motion";
import {
  Download,
  ContentCopy,
  Refresh,
  Info,
  Print,
} from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const AdditionTables: React.FC = () => {
  const theme = useTheme();
  const [number, setNumber] = useState<number | "">("");
  const [range, setRange] = useState<number | "">(10);
  const [table, setTable] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [colorful, setColorful] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const tableRef = useRef<HTMLDivElement>(null);
  const printableTableRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isProductionEnv = import.meta.env.PROD;

  useEffect(() => {
    window.scrollTo(0, 0);

    // Set focus on the input field when component loads
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Set page title for better SEO
    document.title =
      "Free Addition Table Generator | Create, Print & Download Tables";
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+G to generate table
      if (
        e.altKey &&
        e.key === "g" &&
        number !== "" &&
        range !== "" &&
        !error
      ) {
        e.preventDefault();
        generateTable();
      }
      // Alt+C to copy table
      else if (e.altKey && e.key === "c" && table.length > 0) {
        e.preventDefault();
        copyToClipboard();
      }
      // Alt+R to reset form
      else if (e.altKey && e.key === "r") {
        e.preventDefault();
        resetForm();
      }
      // Alt+P to print table
      else if (e.altKey && e.key === "p" && table.length > 0) {
        e.preventDefault();
        printTable();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [number, range, error, table]);

  const handleNumberChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value === "" || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
        setNumber(value === "" ? "" : parseInt(value));
        setError("");
      } else {
        setError("Please enter a valid non-negative number.");
        showSnackbar("Please enter a valid non-negative number.", "error");
      }
    },
    []
  );

  const handleRangeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (
        value === "" ||
        (/^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) <= 100)
      ) {
        setRange(value === "" ? "" : parseInt(value));
        setError("");
      } else {
        setError("Please enter a valid positive range (1-100).");
        showSnackbar("Please enter a valid positive range (1-100).", "error");
      }
    },
    []
  );

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const generateTable = useCallback(() => {
    if (number === "" || range === "") {
      setError("Both number and range must be filled.");
      showSnackbar("Both number and range must be filled.", "error");
      setTable([]);
      return;
    }
    if (range <= 0) {
      setError("Range must be positive.");
      showSnackbar("Range must be positive.", "error");
      setTable([]);
      return;
    }

    setIsGenerating(true);
    setError("");

    // Use setTimeout to allow UI to update with loading state
    setTimeout(() => {
      try {
        const newTable: string[] = [];
        for (let i = 1; i <= range; i++) {
          newTable.push(`${number} + ${i} = ${number + i}`);
        }
        setTable(newTable);
        showSnackbar(
          `Addition table for ${number} generated successfully!`,
          "success"
        );
      } catch (err) {
        setError("An error occurred while generating the table.");
        showSnackbar("An error occurred while generating the table.", "error");
      } finally {
        setIsGenerating(false);
      }
    }, 300);
  }, [number, range, showSnackbar]);

  const resetForm = useCallback(() => {
    setNumber("");
    setRange(10);
    setTable([]);
    setError("");

    // Focus on the input field after reset
    if (inputRef.current) {
      inputRef.current.focus();
    }

    showSnackbar("Form has been reset", "info");
  }, [showSnackbar]);

  // Enhanced print functionality
  const printTable = useCallback(() => {
    if (table.length === 0) return;

    const printContent = document.createElement("div");

    // Create a more structured and visually appealing print layout
    printContent.innerHTML = `
      <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background-color: #1976d2; color: white; padding: 15px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h1 style="margin: 0; font-size: 24px;">Addition Table for ${number}</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px;">Range: 1 to ${range}</p>
          </div>
          <div style="font-size: 12px; text-align: right;">
            <p style="margin: 0;">Generated on: ${new Date().toLocaleDateString()}</p>
            <p style="margin: 0;">KodeKit.in</p>
          </div>
        </div>
        
        <!-- Table -->
        <div style="border: 1px solid #e0e0e0; border-top: none; padding: 15px; border-radius: 0 0 8px 8px; background-color: #f9f9f9;">
          <!-- Table Header -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 10px; background-color: #f0f0f0; padding: 10px; border-radius: 4px; font-weight: bold; text-align: center;">
            <div>Addition</div>
            <div>Result</div>
          </div>
          
          <!-- Table Rows -->
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${table
              .map((entry, index) => {
                // Split the entry into equation and result
                const parts = entry.split(" = ");
                const equation = parts[0];
                const result = parts[1];

                return `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; background-color: ${
                      colorful
                        ? [
                            "#e6f2ff",
                            "#f5e6ff",
                            "#e6ffe6",
                            "#fff9e6",
                            "#ffe6e6",
                          ][index % 5]
                        : index % 2 === 0
                        ? "#f5f5f5"
                        : "#e8e8e8"
                    }; border-radius: 4px; overflow: hidden;">
                      <div style="padding: 10px; text-align: right; font-family: monospace; font-weight: 500; border-right: 1px solid #e0e0e0;">
                        ${equation} =
                      </div>
                      <div style="padding: 10px; text-align: left; font-family: monospace; font-weight: 700; color: #1976d2;">
                        ${result}
                      </div>
                    </div>
                  `;
              })
              .join("")}
          </div>
        </div>
        
        <!-- Footer -->
        <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 10px;">
          <p>This addition table was generated using KodeKit.in - Free Educational Tools</p>
          <p>For more educational resources, visit <a href="https://www.kodekit.in" style="color: #1976d2; text-decoration: none;">www.kodekit.in</a></p>
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Addition Table for ${number}</title>
            <style>
              @page {
                size: A4;
                margin: 1cm;
              }
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: white;
                margin: 0;
                padding: 0;
              }
              @media print {
                body {
                  padding: 0;
                  background-color: white;
                }
                a {
                  text-decoration: none;
                  color: #1976d2;
                }
                .no-print {
                  display: none;
                }
              }
              .print-button {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 20px;
                background-color: #1976d2;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
              }
              .print-button:hover {
                background-color: #1565c0;
              }
            </style>
          </head>
          <body>
            <button class="print-button no-print" onclick="window.print(); window.close();">Print</button>
            ${printContent.innerHTML}
            <script>
              window.onload = function() {
                // Auto print after a short delay to ensure styles are loaded
                setTimeout(function() {
                  window.print();
                }, 500);
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      showSnackbar("Please allow pop-ups to print the table", "warning");
    }
  }, [table, number, range, colorful, showSnackbar]);

  const copyToClipboard = useCallback(() => {
    if (table.length === 0) return;

    const textToCopy = table.join("\n");
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
        showSnackbar("Table copied to clipboard!", "success");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        showSnackbar("Failed to copy to clipboard", "error");
      });
  }, [table, showSnackbar]);

  const downloadAsPNG = useCallback(() => {
    if (table.length === 0) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        showSnackbar("Your browser doesn't support canvas operations", "error");
        return;
      }

      // Improved styling parameters based on the screenshot
      const padding = 20;
      const titleHeight = 50;
      const rowHeight = 40;
      const footerHeight = 25;
      const width = 800; // Wider for better readability
      const height =
        titleHeight + table.length * rowHeight + padding * 2 + footerHeight;

      canvas.width = width;
      canvas.height = height;

      // Clean white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Add a subtle border
      ctx.strokeStyle = "#dddddd";
      ctx.lineWidth = 1;
      ctx.strokeRect(2, 2, width - 4, height - 4);

      // Add a header background - solid blue as in the screenshot
      ctx.fillStyle = "#1976d2";
      ctx.fillRect(0, 0, width, titleHeight);

      // Title with clean styling
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Addition Table for ${number}`, width / 2, titleHeight - 15);

      // Draw table header
      const headerY = titleHeight + 5;
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(padding, headerY, width - padding * 2, 30);

      ctx.fillStyle = "#333333";
      ctx.font = "bold 18px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Addition", width / 2, headerY + 20);

      // Draw table rows with colorful or alternating background
      table.forEach((entry, index) => {
        const y = titleHeight + 40 + index * rowHeight;

        // Row background - colorful or alternating
        if (colorful) {
          // Vibrant colors for colorful mode
          const colors = [
            "#90caf9", // Light blue
            "#ce93d8", // Light purple
            "#a5d6a7", // Light green
            "#ffe082", // Light yellow
            "#ef9a9a", // Light red
          ];
          ctx.fillStyle = colors[index % colors.length];
        } else {
          // Alternating for better readability
          ctx.fillStyle = index % 2 === 0 ? "#f5f5f5" : "#e8e8e8";
        }

        ctx.fillRect(padding, y, width - padding * 2, rowHeight - 2);

        // Split the entry into parts for better formatting
        const parts = entry.split(" = ");
        const equation = parts[0];
        const result = parts[1];

        // Draw the equation part
        ctx.fillStyle = "#333333";
        ctx.font = "bold 18px monospace";
        ctx.textAlign = "right";
        ctx.fillText(equation + " = ", width / 2 - 20, y + rowHeight / 2 + 6);

        // Draw the result part with emphasis
        ctx.fillStyle = "#000000";
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "left";
        ctx.fillText(result, width / 2 + 20, y + rowHeight / 2 + 6);
      });

      // Add footer with clean styling
      const footerY = height - footerHeight;

      // Footer text
      const today = new Date();
      const dateString = today.toLocaleDateString();

      // More visible footer text
      ctx.fillStyle = "#555555";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Generated: ${dateString}`, padding + 5, height - 10);

      ctx.textAlign = "right";
      ctx.fillText("KodeKit.in", width - padding - 5, height - 10);

      // Generate and download the image
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `addition_table_${number}_plus_${range}.png`;
      link.click();

      showSnackbar("PNG downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PNG:", error);
      showSnackbar("Failed to generate PNG. Please try again.", "error");
    }
  }, [table, number, range, colorful, showSnackbar]);

  const getColor = (index: number) => {
    if (!colorful) {
      return theme.palette.mode === "dark" ? "#675d5d" : "#f5f5f5";
    }

    const colors = ["#90caf9", "#ce93d8", "#a5d6a7", "#ffe082", "#ef9a9a"];

    return colors[index % colors.length];
  };

  const getPrintableColor = (index: number) => {
    if (!colorful) {
      return "#f5f5f5";
    }

    const colors = ["#90caf9", "#ce93d8", "#a5d6a7", "#ffe082", "#ef9a9a"];

    return colors[index % colors.length];
  };

  const downloadAsPDF = useCallback(() => {
    if (number === "" || range === "" || table.length === 0) return;

    try {
      // Create PDF with clean styling based on the screenshot
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const tableWidth = pageWidth - margin * 2;

      // Add metadata to the PDF
      doc.setProperties({
        title: `Addition Table for ${number} up to ${range}`,
        subject: "Mathematics - Addition Tables",
        author: "KodeKit.in",
        keywords: "addition, math, education, tables",
        creator: "KodeKit Addition Table Generator",
      });

      // Clean blue header bar
      doc.setFillColor(25, 118, 210);
      doc.rect(0, 0, pageWidth, 25, "F");

      // Header text - more visible
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("KodeKit", margin, 15);

      // Add title in header
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text(`Addition Table for ${number}`, pageWidth / 2, 15, {
        align: "center",
      });

      // Set up table parameters
      const startY = 35;
      const rowHeight = 12;
      const cellPadding = 2;

      // Table header background
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, startY, tableWidth, 10, "F");

      // Table header text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);
      doc.text("Addition", pageWidth / 2, startY + 7 - cellPadding, {
        align: "center",
      });

      // Draw table rows with colorful or alternating background
      table.forEach((entry, index) => {
        const y = startY + 15 + index * rowHeight;

        // Row background (colorful or alternating)
        if (colorful) {
          // Define colorful mode colors
          const colors = [
            [144, 202, 249], // Light blue
            [206, 147, 216], // Light purple
            [165, 214, 167], // Light green
            [255, 224, 130], // Light yellow
            [239, 154, 154], // Light red
          ];
          const color = colors[index % colors.length];
          doc.setFillColor(color[0], color[1], color[2]);
        } else {
          // Alternating row colors
          doc.setFillColor(
            index % 2 === 0 ? 245 : 230,
            index % 2 === 0 ? 245 : 230,
            index % 2 === 0 ? 245 : 230
          );
        }

        doc.rect(margin, y - 8, tableWidth, rowHeight, "F");

        // Split the entry into parts for better formatting
        const parts = entry.split(" = ");
        const equation = parts[0];
        const result = parts[1];

        // Draw the equation part
        doc.setFont("courier", "normal");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(equation + " = ", pageWidth / 2 - 5, y, {
          align: "right",
        });

        // Draw the result part with emphasis
        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(result, pageWidth / 2 + 5, y, {
          align: "left",
        });
      });

      // Add footer
      const footerY = pageHeight - 15;

      // Footer text - more visible
      const today = new Date();
      const dateString = today.toLocaleDateString();

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(80, 80, 80);
      doc.text(`Generated: ${dateString}`, margin, footerY);

      doc.text("KodeKit.in", pageWidth - margin, footerY, {
        align: "right",
      });

      // Save the PDF
      doc.save(`addition_table_${number}_plus_${range}.pdf`);
      showSnackbar("PDF downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showSnackbar("Failed to generate PDF. Please try again.", "error");
    }
  }, [number, range, table, colorful, showSnackbar]);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Skip link for keyboard navigation */}
      <Box
        component="a"
        href="#main-heading"
        sx={{
          position: "absolute",
          top: "-40px",
          left: 0,
          p: 2,
          bgcolor: "background.paper",
          zIndex: 1500,
          transition: "top 0.2s",
          "&:focus": {
            top: 0,
            outline: `2px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        Skip to main content
      </Box>

      <Helmet>
        <title>
          Free Addition Table Generator | Create, Print & Download Tables
        </title>
        <meta
          name="description"
          content="Generate customizable addition tables for any number. Create colorful tables, download as PDF or PNG, and print for educational purposes. Perfect for students, teachers, and parents."
        />
        <meta
          name="keywords"
          content="addition table, addition chart, math tables, addition practice, printable addition tables, math practice, educational tools, math learning, elementary math, homeschool resources"
        />
        <meta
          property="og:title"
          content="Free Addition Table Generator | Create, Print & Download Tables"
        />
        <meta
          property="og:description"
          content="Generate customizable addition tables for any number. Create colorful tables, download as PDF or PNG, and print for educational purposes."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/addition-tables"
        />
        <meta
          property="og:image"
          content="https://www.kodekit.in/images/addition-tables-og.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Addition Table Generator Tool" />
        <meta property="og:site_name" content="KodeKit Tools" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@kodekit" />
        <meta name="twitter:creator" content="@kodekit" />
        <meta
          name="twitter:title"
          content="Free Addition Table Generator | Create, Print & Download Tables"
        />
        <meta
          name="twitter:description"
          content="Generate customizable addition tables for any number. Create colorful tables, download as PDF or PNG, and print for educational purposes."
        />
        <meta
          name="twitter:image"
          content="https://www.kodekit.in/images/addition-tables-twitter.png"
        />
        <meta
          name="twitter:image:alt"
          content="Addition Table Generator Tool"
        />

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Addition Tables" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#1976d2" />

        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/addition-tables"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://www.kodekit.in/tools/addition-tables"
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Addition Table Generator",
            description:
              "Generate customizable addition tables for any number with printable and downloadable options",
            url: "https://www.kodekit.in/tools/addition-tables",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            creator: {
              "@type": "Organization",
              name: "KodeKit",
              url: "https://www.kodekit.in",
              logo: {
                "@type": "ImageObject",
                url: "https://www.kodekit.in/logo.png",
                width: "180",
                height: "60",
              },
            },
            keywords:
              "addition table, addition chart, math tables, addition practice, printable addition tables, math practice, educational tools",
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "student, teacher, parent",
            },
            datePublished: "2023-06-15",
            dateModified: "2025-07-01",
            mainEntity: {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What are Addition Tables?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Addition tables are fundamental mathematical tools that show the sums of a number added to a sequence of numbers. They're essential for building arithmetic skills and form the foundation for more advanced mathematical concepts.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How do I use this addition table generator?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Enter the number you want to create an addition table for, set the range (how many additions to show, from 1 to 100), click 'Generate' to create your table. You can toggle 'Colorful Mode' to make the table visually engaging, and use the copy or download buttons to save your table.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What are the benefits of learning addition tables?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Learning addition tables improves mental calculation speed, builds number sense and pattern recognition, provides foundation for subtraction and other operations, enhances problem-solving abilities, boosts confidence in mathematics, and saves time in everyday calculations.",
                  },
                },
              ],
            },
          })}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight={700}
          id="main-heading"
        >
          Addition Table Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Generate addition tables for any number and customize the range.
        </Typography>

        <Box sx={{ mb: 4 }} role="region" aria-labelledby="main-heading">
          <Typography variant="body1" paragraph>
            Our free addition table generator helps students, teachers, and
            parents create customized addition tables for learning and practice.
            Generate tables for any number from 0 to 1000, with ranges up to
            100. Download your tables as PNG images or PDF files for printing or
            digital use.
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>Key features:</strong>
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Create tables for any number</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Customize range from 1-100</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Colorful mode for visual learning</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Download as PNG or PDF</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Copy to clipboard functionality</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Perfect for homework and classroom use</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Paper
          elevation={3}
          sx={{ p: 3, mb: 3, borderRadius: 2 }}
          role="form"
          aria-label="Addition table generator form"
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Enter a number"
                type="number"
                value={number}
                onChange={handleNumberChange}
                error={
                  !!error &&
                  (number === "" || (typeof number === "number" && number < 0))
                }
                helperText={
                  !!error &&
                  (number === "" || (typeof number === "number" && number < 0))
                    ? error
                    : ""
                }
                inputProps={{
                  min: 0,
                  "aria-label": "Enter a number for addition table",
                  "aria-required": "true",
                  "aria-invalid":
                    !!error &&
                    (number === "" ||
                      (typeof number === "number" && number < 0))
                      ? "true"
                      : "false",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter any non-negative number (0-1000 recommended)">
                        <Info fontSize="small" color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                inputRef={inputRef}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Enter range (e.g., 10)"
                type="number"
                value={range}
                onChange={handleRangeChange}
                error={
                  !!error &&
                  (range === "" ||
                    (typeof range === "number" && (range <= 0 || range > 100)))
                }
                helperText={
                  !!error &&
                  (range === "" ||
                    (typeof range === "number" && (range <= 0 || range > 100)))
                    ? error
                    : ""
                }
                inputProps={{
                  min: 1,
                  max: 100,
                  "aria-label": "Enter range for addition table",
                  "aria-required": "true",
                  "aria-invalid":
                    !!error &&
                    (range === "" ||
                      (typeof range === "number" &&
                        (range <= 0 || range > 100)))
                      ? "true"
                      : "false",
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Maximum range is 100">
                        <Typography variant="caption" color="text.secondary">
                          1-100
                        </Typography>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => {
                  if (
                    e.key === "Enter" &&
                    number !== "" &&
                    range !== "" &&
                    !error
                  ) {
                    generateTable();
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={generateTable}
                  disabled={
                    number === "" || range === "" || !!error || isGenerating
                  }
                  sx={{ height: "56px" }}
                  aria-label="Generate addition table"
                  title="Generate table (Alt+G)"
                  startIcon={
                    isGenerating ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </Button>
                <Tooltip title="Reset form">
                  <IconButton
                    onClick={resetForm}
                    color="error"
                    disabled={number === "" || range === "" || !!error}
                    sx={{ height: "56px" }}
                    aria-label="Reset addition table form"
                  >
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={colorful}
                    onChange={(e) => setColorful(e.target.checked)}
                    color="primary"
                    inputProps={{
                      "aria-label": "Toggle colorful mode for addition table",
                      role: "switch",
                    }}
                  />
                }
                label="Colorful Mode"
              />
              <Tooltip title="Enable colorful mode to make the table more visually appealing">
                <IconButton
                  size="small"
                  aria-label="Information about colorful mode"
                >
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          {error && !table.length && (
            <Typography color="error" sx={{ mt: 2 }} role="alert">
              {error}
            </Typography>
          )}
        </Paper>

        {table.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            aria-live="polite"
            aria-atomic="true"
          >
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 2 }}
              ref={tableRef}
              aria-labelledby="table-title"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ color: theme.palette.secondary.main, mb: 0 }}
                  id="table-title"
                >
                  Addition Table for {number} up to {range}
                </Typography>
                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                  <IconButton
                    onClick={copyToClipboard}
                    color={copied ? "success" : "default"}
                    aria-label="Copy addition table to clipboard"
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid
                container
                spacing={1}
                role="grid"
                aria-label="Addition table results"
              >
                {table.map((entry, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index} role="gridcell">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "monospace",
                          p: 1,
                          backgroundColor: getColor(index),
                          borderRadius: 1,
                          textAlign: "center",
                          fontWeight: 500,
                        }}
                        aria-label={`${number} plus ${index + 1} equals ${
                          typeof number === "number" ? number + (index + 1) : ""
                        }`}
                      >
                        {entry}
                      </Typography>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ textAlign: "center" }}
                >
                  Download Options
                </Typography>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  sx={{ justifyContent: "center" }}
                >
                  <Button
                    variant="contained"
                    onClick={downloadAsPNG}
                    startIcon={<Download />}
                    aria-label="Download addition table as PNG"
                    title="Download as PNG image"
                    color="primary"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    PNG Image
                  </Button>
                  <Button
                    variant="contained"
                    onClick={downloadAsPDF}
                    startIcon={<Download />}
                    aria-label="Download addition table as PDF"
                    title="Download as PDF document"
                    color="secondary"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: 2,
                      "&:hover": {
                        boxShadow: 4,
                      },
                    }}
                  >
                    PDF Document
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={printTable}
                    startIcon={<Print />}
                    aria-label="Print addition table"
                    title="Print table (Alt+P)"
                    sx={{
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    Print Table
                  </Button>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "center", mt: 1 }}
                >
                  All downloads include enhanced formatting and are ready for
                  educational use
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ display: "none" }}>
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  maxWidth: "400px",
                  backgroundColor: "white",
                }}
                ref={printableTableRef}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    color: "#1976d2",
                    mb: 2,
                    textAlign: "center",
                  }}
                >
                  Addition Table for {number} up to {range}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {table.map((entry, index) => (
                    <Typography
                      key={index}
                      sx={{
                        fontFamily: "monospace",
                        p: 1,
                        backgroundColor: getPrintableColor(index),
                        borderRadius: 1,
                        textAlign: "center",
                        fontWeight: 500,
                      }}
                    >
                      {entry}
                    </Typography>
                  ))}
                </Box>
              </Paper>
            </Box>
          </motion.div>
        )}
      </motion.div>
      {isProductionEnv && (
        <AdSense adSlot="6613251015" aria-label="Advertisement" />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        role="status"
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          aria-live="assertive"
          role="alert"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Paper
        elevation={3}
        sx={{ p: 3, mb: 3, mt: 2, borderRadius: 2 }}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <Typography variant="h6" gutterBottom fontWeight={600} itemProp="name">
          What are Addition Tables?
        </Typography>
        <Typography
          paragraph
          itemProp="acceptedAnswer"
          itemScope
          itemType="https://schema.org/Answer"
        >
          <span itemProp="text">
            Addition tables are fundamental mathematical tools that show the
            sums of a number added to a sequence of numbers. They're essential
            for building arithmetic skills and form the foundation for more
            advanced mathematical concepts.
          </span>
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
          itemProp="name"
        >
          Benefits of Learning Addition Tables
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                •
              </Typography>
              <Typography>Improves mental calculation speed</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                •
              </Typography>
              <Typography>
                Builds number sense and pattern recognition
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                •
              </Typography>
              <Typography>
                Provides foundation for subtraction and other operations
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                •
              </Typography>
              <Typography>Enhances problem-solving abilities</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
              <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                •
              </Typography>
              <Typography>Boosts confidence in mathematics</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                •
              </Typography>
              <Typography>Saves time in everyday calculations</Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="h6"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
          itemProp="name"
        >
          How to Use This Tool
        </Typography>
        <Typography
          paragraph
          itemProp="acceptedAnswer"
          itemScope
          itemType="https://schema.org/Answer"
        >
          <span itemProp="text">
            1. Enter the number you want to create an addition table for
            <br />
            2. Set the range (how many additions to show, from 1 to 100)
            <br />
            3. Click "Generate" to create your table
            <br />
            4. Toggle "Colorful Mode" to make the table visually engaging
            <br />
            5. Use the copy or download buttons to save your table
          </span>
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, fontStyle: "italic" }}
        >
          Tip: For educational purposes, start with smaller ranges (1-10) for
          beginners and gradually increase the complexity as skills develop.
        </Typography>

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.2)"
                : "rgba(25, 118, 210, 0.05)",
            borderRadius: 2,
            border: "1px solid",
            borderColor:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(25, 118, 210, 0.2)",
          }}
        >
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Keyboard Shortcuts
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                >
                  Alt+G:
                </Typography>
                <Typography variant="body2">Generate table</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                >
                  Alt+R:
                </Typography>
                <Typography variant="body2">Reset form</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                >
                  Alt+C:
                </Typography>
                <Typography variant="body2">Copy to clipboard</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    mr: 1,
                    color: theme.palette.primary.main,
                  }}
                >
                  Alt+P:
                </Typography>
                <Typography variant="body2">Print table</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdditionTables;
