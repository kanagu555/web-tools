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
import "jspdf-autotable"; // Add this import
import { motion } from "framer-motion";
import { Download, ContentCopy, Refresh, Info } from "@mui/icons-material";
import AdSense from "../components/AdSense";

const MultiplicationTables: React.FC = () => {
  const theme = useTheme();
  const [number, setNumber] = useState<number | "">("");
  const [range, setRange] = useState<number | "">(10);
  const [table, setTable] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [colorful, setColorful] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null); // Ref for the displayed table container
  const printableTableRef = useRef<HTMLDivElement>(null); // Ref for the printable table (hidden)

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset copied state after 2 seconds
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

    // Create canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const padding = 20;
    const titleHeight = 40;
    const rowHeight = 30;
    const width = 400;
    const height = titleHeight + table.length * rowHeight + padding * 2;

    canvas.width = width;
    canvas.height = height;

    // Fill background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // Draw title
    ctx.fillStyle = "#1976d2";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `Multiplication Table for ${number} up to ${range}`,
      width / 2,
      padding + 20
    );

    // Draw table rows
    ctx.font = "14px monospace";
    ctx.textAlign = "center";

    table.forEach((entry, index) => {
      // Row background
      const y = titleHeight + index * rowHeight + padding;

      // Choose background color
      if (colorful) {
        const colors = [
          "#90caf9", // Light blue
          "#ce93d8", // Light purple
          "#a5d6a7", // Light green
          "#ffe082", // Light amber
          "#ef9a9a", // Light red
        ];
        ctx.fillStyle = colors[index % colors.length];
      } else {
        ctx.fillStyle = "#f5f5f5";
      }

      // Draw row background
      ctx.fillRect(padding, y, width - padding * 2, rowHeight - 2);

      // Draw text
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(entry, width / 2, y + 20);
    });

    // Convert to image and download
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

  // Get color based on index for colorful mode - for the visible table
  const getColor = (index: number) => {
    if (!colorful) {
      return theme.palette.mode === "dark" ? "#675d5d" : "#f5f5f5";
    }

    const colors = [
      "#90caf9", // Light blue
      "#ce93d8", // Light purple
      "#a5d6a7", // Light green
      "#ffe082", // Light amber
      "#ef9a9a", // Light red
    ];

    return colors[index % colors.length];
  };

  // Get color for printable table - simpler version that avoids any theme objects
  const getPrintableColor = (index: number) => {
    if (!colorful) {
      return "#f5f5f5"; // Always use light color for non-colorful mode
    }

    const colors = [
      "#90caf9", // Light blue
      "#ce93d8", // Light purple
      "#a5d6a7", // Light green
      "#ffe082", // Light amber
      "#ef9a9a", // Light red
    ];

    return colors[index % colors.length];
  };

  const downloadAsPDF = () => {
    if (number === "" || range === "" || table.length === 0) return;

    try {
      // Create new PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      // Add title
      doc.setFontSize(16);
      doc.setTextColor(25, 118, 210); // #1976d2
      doc.text(
        `Multiplication Table for ${number} up to ${range}`,
        pageWidth / 2,
        margin,
        { align: "center" }
      );

      // Set up table formatting
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const lineHeight = 10;
      const startY = margin + 10;

      // Draw each row of the table
      table.forEach((entry, index) => {
        const y = startY + index * lineHeight;

        // Add background rectangle for row (light gray or colorful)
        if (colorful) {
          const colors = [
            [144, 202, 249], // Light blue #90caf9
            [206, 147, 216], // Light purple #ce93d8
            [165, 214, 167], // Light green #a5d6a7
            [255, 224, 130], // Light amber #ffe082
            [239, 154, 154], // Light red #ef9a9a
          ];
          const color = colors[index % colors.length];
          doc.setFillColor(color[0], color[1], color[2]);
        } else {
          doc.setFillColor(245, 245, 245); // #f5f5f5
        }

        doc.rect(margin, y - 5, pageWidth - margin * 2, lineHeight, "F");

        // Add text
        doc.setTextColor(0, 0, 0);
        doc.text(entry, pageWidth / 2, y, { align: "center" });
      });

      // Save the PDF
      doc.save(`multiplication_table_${number}_x_${range}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Multiplication Table Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Generate multiplication tables for any number and customize the range.
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
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
                inputProps={{ min: 1 }}
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
                inputProps={{ min: 1, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={generateTable}
                  disabled={number === "" || range === "" || !!error}
                  sx={{ height: "56px" }} // Match TextField height
                >
                  Generate
                </Button>
                <Tooltip title="Reset">
                  <IconButton onClick={resetForm} sx={{ height: "56px" }}>
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
                  />
                }
                label="Colorful Mode"
              />
              <Tooltip title="Enable colorful mode to make the table more visually appealing">
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          {error && !table.length && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Paper>

        {table.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }} ref={tableRef}>
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
                >
                  Multiplication Table for {number} up to {range}
                </Typography>
                <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                  <IconButton
                    onClick={copyToClipboard}
                    color={copied ? "success" : "default"}
                  >
                    <ContentCopy />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={1}>
                {table.map((entry, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
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
                  variant="outlined"
                  onClick={downloadAsPNG}
                  startIcon={<Download />}
                >
                  Download as PNG
                </Button>
                <Button
                  variant="outlined"
                  onClick={downloadAsPDF}
                  startIcon={<Download />}
                >
                  Download as PDF
                </Button>
              </Stack>
            </Paper>

            {/* Hidden printable table with vertical layout - only used for PNG download */}
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
                    color: "#1976d2", // Use static hex color
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
                        backgroundColor: getPrintableColor(index), // Use the new function
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
      <AdSense adSlot="6613251015" />
      {/* Added detailed explanation section */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          What are Multiplication Tables?
        </Typography>
        <Typography paragraph>
          Multiplication tables are fundamental mathematical tools that show the
          products of a number multiplied by a sequence of numbers. They're
          essential for building arithmetic skills and form the foundation for
          more advanced mathematical concepts.
        </Typography>

        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
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

        <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
          How to Use This Tool
        </Typography>
        <Typography paragraph>
          1. Enter the number you want to create a multiplication table for
          <br />
          2. Set the range (how many multiplications to show, from 1 to 100)
          <br />
          3. Click "Generate" to create your table
          <br />
          4. Toggle "Colorful Mode" to make the table visually engaging
          <br />
          5. Use the copy or download buttons to save your table
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
