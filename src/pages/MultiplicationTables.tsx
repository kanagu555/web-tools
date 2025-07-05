import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { motion } from "framer-motion";
import { Download, ContentCopy, Refresh, Info } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const MultiplicationTables: React.FC = () => {
  const theme = useTheme();
  const [number, setNumber] = useState<number | "">("");
  const [range, setRange] = useState<number | "">(10);
  const [table, setTable] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [colorful, setColorful] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const printableTableRef = useRef<HTMLDivElement>(null);
  const isProductionEnv = import.meta.env.PROD;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "" || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setNumber(value === "" ? "" : parseInt(value));
      setError("");
    } else {
      setError("Please enter a valid positive number.");
    }
  };

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      value === "" ||
      (/^\d+$/.test(value) && parseInt(value) > 0 && parseInt(value) <= 100)
    ) {
      setRange(value === "" ? "" : parseInt(value));
      setError("");
    } else {
      setError("Please enter a valid positive range (1-100).");
    }
  };

  const generateTable = () => {
    if (number === "" || range === "") {
      setError("Both number and range must be filled.");
      setTable([]);
      return;
    }
    if (number <= 0 || range <= 0) {
      setError("Number and range must be positive.");
      setTable([]);
      return;
    }
    setError("");
    const newTable: string[] = [];
    for (let i = 1; i <= range; i++) {
      newTable.push(`${number} x ${i} = ${number * i}`);
    }
    setTable(newTable);
  };

  const resetForm = () => {
    setNumber("");
    setRange(10);
    setTable([]);
    setError("");
  };

  const copyToClipboard = () => {
    if (table.length === 0) return;

    const textToCopy = table.join("\n");
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const downloadAsPNG = () => {
    if (table.length === 0) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const padding = 20;
    const titleHeight = 40;
    const rowHeight = 30;
    const width = 400;
    const height = titleHeight + table.length * rowHeight + padding * 2;

    canvas.width = width;
    canvas.height = height;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "#1976d2";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `Multiplication Table for ${number} up to ${range}`,
      width / 2,
      padding + 20
    );

    ctx.font = "14px monospace";
    ctx.textAlign = "center";

    table.forEach((entry, index) => {
      const y = titleHeight + index * rowHeight + padding;

      if (colorful) {
        const colors = ["#90caf9", "#ce93d8", "#a5d6a7", "#ffe082", "#ef9a9a"];
        ctx.fillStyle = colors[index % colors.length];
      } else {
        ctx.fillStyle = "#f5f5f5";
      }

      ctx.fillRect(padding, y, width - padding * 2, rowHeight - 2);

      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(entry, width / 2, y + 20);
    });

    try {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `multiplication_table_${number}_x_${range}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating PNG:", error);
      alert("Failed to generate PNG. Please try again.");
    }
  };

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

  const downloadAsPDF = () => {
    if (number === "" || range === "" || table.length === 0) return;

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      doc.setFontSize(16);
      doc.setTextColor(25, 118, 210);
      doc.text(
        `Multiplication Table for ${number} up to ${range}`,
        pageWidth / 2,
        margin,
        { align: "center" }
      );

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const lineHeight = 10;
      const startY = margin + 10;

      table.forEach((entry, index) => {
        const y = startY + index * lineHeight;

        if (colorful) {
          const colors = [
            [144, 202, 249],
            [206, 147, 216],
            [165, 214, 167],
            [255, 224, 130],
            [239, 154, 154],
          ];
          const color = colors[index % colors.length];
          doc.setFillColor(color[0], color[1], color[2]);
        } else {
          doc.setFillColor(245, 245, 245);
        }

        doc.rect(margin, y - 5, pageWidth - margin * 2, lineHeight, "F");

        doc.setTextColor(0, 0, 0);
        doc.text(entry, pageWidth / 2, y, { align: "center" });
      });

      doc.save(`multiplication_table_${number}_x_${range}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>
          Free Multiplication Table Generator | Create, Print & Download Tables
        </title>
        <meta
          name="description"
          content="Generate customizable multiplication tables for any number. Create colorful tables, download as PDF or PNG, and print for educational purposes. Perfect for students, teachers, and parents."
        />
        <meta
          name="keywords"
          content="multiplication table, times tables, math tables, multiplication chart, printable multiplication tables, math practice, educational tools"
        />
        <meta
          property="og:title"
          content="Free Multiplication Table Generator | Create, Print & Download Tables"
        />
        <meta
          property="og:description"
          content="Generate customizable multiplication tables for any number. Create colorful tables, download as PDF or PNG, and print for educational purposes."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/multiplication-tables"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Free Multiplication Table Generator | Create, Print & Download Tables"
        />
        <meta
          name="twitter:description"
          content="Generate customizable multiplication tables for any number. Create colorful tables, download as PDF or PNG, and print for educational purposes."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/multiplication-tables"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Multiplication Table Generator",
            description:
              "Generate customizable multiplication tables for any number with printable and downloadable options",
            url: "https://www.kodekit.in/tools/multiplication-tables",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "KodeKit",
            },
            keywords:
              "multiplication table, times tables, math tables, multiplication chart",
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "student, teacher, parent",
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
          Multiplication Table Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Generate multiplication tables for any number and customize the range.
        </Typography>

        <Box sx={{ mb: 4 }} role="region" aria-labelledby="main-heading">
          <Typography variant="body1" paragraph>
            Our free multiplication table generator helps students, teachers,
            and parents create customized multiplication tables for learning and
            practice. Generate tables for any number from 1 to 1000, with ranges
            up to 100. Download your tables as PNG images or PDF files for
            printing or digital use.
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
          aria-label="Multiplication table generator form"
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
                  (number === "" || (typeof number === "number" && number <= 0))
                }
                helperText={
                  !!error &&
                  (number === "" || (typeof number === "number" && number <= 0))
                    ? error
                    : ""
                }
                inputProps={{
                  min: 1,
                  "aria-label": "Enter a number for multiplication table",
                  "aria-required": "true",
                }}
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
                  "aria-label": "Enter range for multiplication table",
                  "aria-required": "true",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={generateTable}
                  disabled={number === "" || range === "" || !!error}
                  sx={{ height: "56px" }}
                  aria-label="Generate multiplication table"
                >
                  Generate
                </Button>
                <Tooltip title="Reset form">
                  <IconButton
                    onClick={resetForm}
                    color="error"
                    disabled={number === "" || range === "" || !!error}
                    sx={{ height: "56px" }}
                    aria-label="Reset multiplication table form"
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
                      "aria-label":
                        "Toggle colorful mode for multiplication table",
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
                  Multiplication Table for {number} up to {range}
                </Typography>
                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                  <IconButton
                    onClick={copyToClipboard}
                    color={copied ? "success" : "default"}
                    aria-label="Copy multiplication table to clipboard"
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
                aria-label="Multiplication table results"
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
                        aria-label={`${number} times ${index + 1} equals ${
                          typeof number === "number" ? number * (index + 1) : ""
                        }`}
                      >
                        {entry}
                      </Typography>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 3, justifyContent: "center" }}
              >
                <Button
                  variant="contained"
                  onClick={downloadAsPNG}
                  startIcon={<Download />}
                  aria-label="Download multiplication table as PNG"
                >
                  Download as PNG
                </Button>
                <Button
                  variant="contained"
                  onClick={downloadAsPDF}
                  startIcon={<Download />}
                  aria-label="Download multiplication table as PDF"
                >
                  Download as PDF
                </Button>
              </Stack>
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
                  Multiplication Table for {number} up to {range}
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
      {isProductionEnv && <AdSense adSlot="6613251015" />}

      <Paper
        elevation={3}
        sx={{ p: 3, mb: 3, mt: 2, borderRadius: 2 }}
        itemScope
        itemType="https://schema.org/FAQPage"
      >
        <Typography variant="h6" gutterBottom fontWeight={600} itemProp="name">
          What are Multiplication Tables?
        </Typography>
        <Typography
          paragraph
          itemProp="acceptedAnswer"
          itemScope
          itemType="https://schema.org/Answer"
        >
          <span itemProp="text">
            Multiplication tables are fundamental mathematical tools that show
            the products of a number multiplied by a sequence of numbers.
            They're essential for building arithmetic skills and form the
            foundation for more advanced mathematical concepts.
          </span>
        </Typography>

        <Typography
          variant="h6"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
          itemProp="name"
        >
          Benefits of Learning Multiplication Tables
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
                Provides foundation for division, fractions, and algebra
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
            1. Enter the number you want to create a multiplication table for
            <br />
            2. Set the range (how many multiplications to show, from 1 to 100)
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
      </Paper>
    </Container>
  );
};

export default MultiplicationTables;
