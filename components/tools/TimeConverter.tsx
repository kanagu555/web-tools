"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  Copy,
  RefreshCw,
  Info,
  FileText,
  FileSpreadsheet,
  Image,
} from "lucide-react";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

// Time units in seconds
const TIME_UNITS = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2592000, // 30 days
  quarters: 7776000, // 90 days
  years: 31536000, // 365 days
  decades: 315360000, // 10 years
};

interface ConversionResult {
  inputValue: number;
  inputUnit: string;
  conversions: Array<{
    unit: string;
    value: number;
  }>;
}

const TimeConverter = () => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState("days");
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showExactValues, setShowExactValues] = useState(false);

  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Set focus on the input field when component loads
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Set page title for better SEO
    document.title =
      "Time Unit Converter | Convert Between Time Units for Financial Calculations";
  }, []);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const convertTime = () => {
    const value = parseFloat(inputValue);

    if (isNaN(value) || value <= 0) {
      showSnackbar("Please enter a valid positive number", "error");
      return;
    }

    setIsLoading(true);

    // Simulate a small delay for better UX
    setTimeout(() => {
      try {
        // Convert input to seconds
        const valueInSeconds =
          value * TIME_UNITS[inputUnit as keyof typeof TIME_UNITS];

        // Convert seconds to all other units
        const conversions = Object.entries(TIME_UNITS).map(
          ([unit, seconds]) => ({
            unit,
            value: valueInSeconds / seconds,
          })
        );

        const result = {
          inputValue: value,
          inputUnit,
          conversions,
        };

        setConversionResult(result);

        showSnackbar("Time conversion completed successfully", "success");
      } catch (error) {
        console.error("Conversion error:", error);
        showSnackbar("An error occurred during conversion", "error");
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  // Enhanced download functionality with multiple format options
  const downloadResults = async (format: "png" | "pdf" | "csv" = "png") => {
    if (!conversionResult) {
      showSnackbar("No conversion results to download", "error");
      return;
    }

    setIsLoading(true);

    try {
      switch (format) {
        case "png":
          await downloadAsPNG();
          break;
        case "pdf":
          await downloadAsPDF();
          break;
        case "csv":
          downloadAsCSV();
          break;
        default:
          await downloadAsPNG();
      }
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()}:`, error);
      showSnackbar(
        `Failed to generate ${format.toUpperCase()}. Please try again. Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Download as PNG image
  const downloadAsPNG = async () => {
    if (!resultsRef.current || !conversionResult) return;

    // Create a new container for the download image
    const container = document.createElement("div");
    container.style.width = "800px"; // Fixed width for better layout
    container.style.backgroundColor = "#ffffff";
    container.style.padding = "30px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "#333333";
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.boxSizing = "border-box";
    container.style.border = "1px solid #e0e0e0";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";

    // Add header with logo and title
    const header = document.createElement("div");
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; margin-bottom: 20px; border-bottom: 2px solid #1976d2;">
        <div style="display: flex; align-items: center;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #1976d2; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Time Conversion Results</div>
        </div>
        <div style="font-size: 14px; color: #666;">Generated: ${new Date().toLocaleString()}</div>
      </div>
    `;
    container.appendChild(header);

    // Add input value section
    const inputSection = document.createElement("div");
    inputSection.innerHTML = `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e0e0e0;">
        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">Input</div>
        <div style="font-size: 22px; font-weight: 600;">${
          conversionResult.inputValue
        } ${formatUnitLabel(conversionResult.inputUnit)}</div>
      </div>
    `;
    container.appendChild(inputSection);

    // Add table header
    const tableHeader = document.createElement("div");
    tableHeader.innerHTML = `
      <div style="margin-bottom: 15px;">
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">Equivalent Values</div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; background-color: #1976d2; color: white; padding: 12px 15px; border-radius: 8px 8px 0 0; font-weight: bold;">
        <div>Unit</div>
        <div style="text-align: right;">Value</div>
      </div>
    `;
    container.appendChild(tableHeader);

    // Add table rows
    const tableBody = document.createElement("div");
    tableBody.style.border = "1px solid #e0e0e0";
    tableBody.style.borderTop = "none";
    tableBody.style.borderRadius = "0 0 8px 8px";
    tableBody.style.overflow = "hidden";

    conversionResult.conversions.forEach((conversion, index) => {
      const isInputUnit = conversion.unit === conversionResult.inputUnit;
      const row = document.createElement("div");
      row.style.display = "grid";
      row.style.gridTemplateColumns = "1fr 1fr";
      row.style.padding = "12px 15px";
      row.style.backgroundColor = isInputUnit
        ? "#e3f2fd"
        : index % 2 === 0
        ? "#f8f9fa"
        : "#ffffff";
      row.style.borderBottom =
        index < conversionResult.conversions.length - 1
          ? "1px solid #e0e0e0"
          : "none";

      const unitCell = document.createElement("div");
      unitCell.style.display = "flex";
      unitCell.style.alignItems = "center";
      unitCell.innerHTML = formatUnitLabel(conversion.unit);

      const valueCell = document.createElement("div");
      valueCell.style.textAlign = "right";
      valueCell.style.fontFamily = "monospace";
      valueCell.style.fontWeight = "normal";
      valueCell.textContent = showExactValues
        ? conversion.value.toString()
        : conversion.value.toFixed(6);

      row.appendChild(unitCell);
      row.appendChild(valueCell);
      tableBody.appendChild(row);
    });

    container.appendChild(tableBody);

    // Add note about precision
    const precisionNote = document.createElement("div");
    precisionNote.style.marginTop = "20px";
    precisionNote.style.fontSize = "12px";
    precisionNote.style.color = "#666";
    precisionNote.textContent = showExactValues
      ? "Showing exact values"
      : "Values rounded to 6 decimal places.";
    container.appendChild(precisionNote);

    // Add footer
    const footer = document.createElement("div");
    footer.innerHTML = `
      <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #1976d2; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 12px; color: #666;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
        <div style="font-size: 16px; font-weight: bold; color: #1976d2;">
          www.KodeKit.in - Time Converter Tool
        </div>
      </div>
    `;
    container.appendChild(footer);

    // Append to body temporarily
    document.body.appendChild(container);

    try {
      // Create image with html2canvas
      const canvas = await html2canvas(container, {
        scale: 2, // Higher resolution
        logging: false,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false, // This can help with compatibility
      });

      // Convert to PNG and download
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `time_conversion_${conversionResult.inputValue}_${
        conversionResult.inputUnit
      }_${new Date().toISOString().split("T")[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar("PNG image downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating PNG:", error);
      showSnackbar("Failed to generate PNG. Please try again.", "error");
      throw error;
    } finally {
      document.body.removeChild(container);
    }
  };

  // Download as PDF document
  const downloadAsPDF = async () => {
    if (!conversionResult) return;

    try {
      // Use a simpler approach with direct script loading
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.async = true;

      // Create a promise to wait for script to load
      const scriptLoaded = new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load jsPDF script"));
      });

      // Add script to document
      document.body.appendChild(script);

      // Wait for script to load
      await scriptLoaded;

      // Access the global jsPDF object
      const jsPDF = (window as any).jspdf.jsPDF;

      if (!jsPDF) {
        throw new Error("jsPDF not available after loading");
      }

      // Create a new PDF document
      const doc = new jsPDF();

      // Basic PDF without autotable to ensure it works
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;

      // Add metadata
      doc.setProperties({
        title: `Time Conversion: ${conversionResult.inputValue} ${conversionResult.inputUnit}`,
        subject: "Time Unit Conversion",
        author: "KodeKit.in",
        keywords: "time conversion, time units",
        creator: "KodeKit Time Converter Tool",
      });

      // Add header with blue background
      doc.setFillColor(25, 118, 210);
      doc.rect(0, 0, pageWidth, 25, "F");

      // Add title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Time Conversion Results", margin, 15);

      // Add date
      doc.setFontSize(10);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth - margin,
        15,
        { align: "right" }
      );

      // Add input value section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Input Value:", margin, 35);
      doc.setFont("helvetica", "normal");
      doc.text(
        `${conversionResult.inputValue} ${formatUnitLabel(
          conversionResult.inputUnit
        )}`,
        margin + 30,
        35
      );

      // Add table title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Equivalent Values", margin, 45);

      // Create a simple table manually
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Unit", margin, 55);
      doc.text("Value", margin + 60, 55);

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 57, pageWidth - margin, 57);

      // Add table rows
      let y = 65;
      conversionResult.conversions.forEach((conversion, index) => {
        const isInputUnit = conversion.unit === conversionResult.inputUnit;

        // Highlight input unit row
        // if (isInputUnit) {
        // doc.setFillColor(227, 242, 253);
        // doc.rect(margin - 2, y - 5, pageWidth - margin * 2 + 4, 10, "F");
        // doc.setFont("helvetica", "bold");
        // } else {
        doc.setFont("helvetica", "normal");
        // }

        // Unit name
        doc.text(formatUnitLabel(conversion.unit), margin, y);

        // Value
        const valueText = showExactValues
          ? conversion.value.toString()
          : conversion.value.toFixed(6);
        doc.text(valueText, margin + 60, y);

        // Add checkmark for input unit
        if (isInputUnit) {
          doc.setTextColor(25, 118, 210);
          doc.text("✓", margin + 100, y);
          doc.setTextColor(0, 0, 0);
        }

        y += 10;

        // Add a new page if needed
        if (
          y > pageHeight - 30 &&
          index < conversionResult.conversions.length - 1
        ) {
          doc.addPage();
          y = 20;
        }
      });

      // Add note about precision
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "italic");
      doc.text(
        showExactValues
          ? "Showing exact values"
          : "Values rounded to 6 decimal places.",
        margin,
        y + 10
      );

      // Add footer
      const footerY = pageHeight - 10;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "normal");
      doc.text("www.KodeKit.in - Time Converter Tool", margin, footerY);
      doc.text("Page 1", pageWidth - margin, footerY, { align: "right" });

      // Save the PDF
      doc.save(
        `time_conversion_${conversionResult.inputValue}_${
          conversionResult.inputUnit
        }_${new Date().toISOString().split("T")[0]}.pdf`
      );

      // Clean up - remove the script
      document.body.removeChild(script);

      showSnackbar("PDF document downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showSnackbar(
        `Failed to generate PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        "error"
      );
      throw error;
    }
  };

  // Download as CSV file
  const downloadAsCSV = () => {
    if (!conversionResult) return;

    try {
      // Create CSV content
      let csvContent = "Unit,Value\n";

      // Add input value as header
      csvContent += `"Input: ${conversionResult.inputValue} ${formatUnitLabel(
        conversionResult.inputUnit
      )}"\n\n`;

      // Add all conversions
      conversionResult.conversions.forEach((conversion) => {
        csvContent += `"${formatUnitLabel(conversion.unit)}",${
          showExactValues ? conversion.value : conversion.value.toFixed(6)
        }\n`;
      });

      // Create and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `time_conversion_${conversionResult.inputValue}_${
          conversionResult.inputUnit
        }_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar("CSV file downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating CSV:", error);
      throw error;
    }
  };

  const handleReset = () => {
    setInputValue("");
    setInputUnit("days");
    setConversionResult(null);

    // Focus on the input field after reset
    if (inputRef.current) {
      inputRef.current.focus();
    }

    showSnackbar("Form reset successfully", "info");
  };

  const handleCopyResults = () => {
    if (!conversionResult) return;

    const resultsText = `
Time Conversion Summary:
Input: ${conversionResult.inputValue} ${conversionResult.inputUnit}

Conversions:
${conversionResult.conversions
  .map(
    (c) =>
      `${formatUnitLabel(c.unit)}: ${
        showExactValues ? c.value : c.value.toFixed(6)
      }`
  )
  .join("\n")}

Generated by www.KodeKit.in - Time Converter Tool
${new Date().toLocaleString()}
`;

    navigator.clipboard.writeText(resultsText);
    showSnackbar("Time conversion summary copied to clipboard", "success");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && inputValue) {
      convertTime();
    }
  };

  const formatUnitLabel = (unit: string) => {
    return unit.charAt(0).toUpperCase() + unit.slice(1);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      role="main"
      aria-label="Time Converter Tool"
    >
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-labelledby="time-converter-heading"
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight={700}
          id="time-converter-heading"
        >
          Time Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert between different time units for financial calculations,
          interest periods, and payment frequencies.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              role="form"
              aria-label="Time conversion form"
            >
              <Typography variant="h6" gutterBottom fontWeight={600} mb={2}>
                Conversion Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Value"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    inputProps={{
                      "aria-label": "Enter time value to convert",
                      "aria-required": "true",
                      min: "0.000001",
                      step: "any",
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Enter any positive number">
                            <Info size={16} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    inputRef={inputRef}
                    autoFocus
                    helperText="Enter a positive number"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Unit"
                    value={inputUnit}
                    onChange={(e) => setInputUnit(e.target.value)}
                    inputProps={{
                      "aria-label": "Select time unit to convert from",
                    }}
                    helperText="Select the source time unit"
                  >
                    {Object.keys(TIME_UNITS).map((unit) => (
                      <MenuItem
                        key={unit}
                        value={unit}
                        aria-label={`Convert from ${unit}`}
                      >
                        {formatUnitLabel(unit)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={convertTime}
                      disabled={!inputValue || isLoading}
                      startIcon={
                        isLoading ? (
                          <CircularProgress size={18} />
                        ) : (
                          <Clock size={18} />
                        )
                      }
                      sx={{ flex: 1 }}
                      aria-label="Convert time units"
                    >
                      {isLoading ? "Converting..." : "Convert"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={!inputValue || isLoading}
                      startIcon={<RefreshCw size={18} />}
                      aria-label="Reset time converter form"
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showExactValues}
                        onChange={(e) => setShowExactValues(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Show exact values"
                  />
                  <Tooltip title="When enabled, shows full precision values instead of rounded to 6 decimal places">
                    <IconButton size="small">
                      <Info size={16} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                minHeight: "400px",
                position: "relative",
              }}
              aria-live="polite"
              aria-atomic="true"
            >
              {isLoading && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    zIndex: 10,
                    borderRadius: 3,
                  }}
                >
                  <CircularProgress size={40} />
                  <Typography sx={{ mt: 2, fontWeight: 500 }}>
                    Preparing your download...
                  </Typography>
                </Box>
              )}

              {conversionResult ? (
                <Box ref={resultsRef}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Conversion Results
                    </Typography>
                    <Box>
                      <Tooltip title="Copy results">
                        <IconButton
                          onClick={handleCopyResults}
                          size="small"
                          aria-label="Copy conversion results to clipboard"
                          disabled={isLoading}
                        >
                          <Copy size={18} />
                        </IconButton>
                      </Tooltip>

                      <Menu
                        id="download-menu"
                        anchorEl={downloadMenuAnchorEl}
                        open={Boolean(downloadMenuAnchorEl)}
                        onClose={() => setDownloadMenuAnchorEl(null)}
                        MenuListProps={{
                          "aria-labelledby": "download-button",
                        }}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <MuiMenuItem
                          onClick={() => {
                            downloadResults("png");
                            setDownloadMenuAnchorEl(null);
                          }}
                          disabled={isLoading}
                        >
                          <ListItemIcon>
                            <Image size={18} />
                          </ListItemIcon>
                          <ListItemText>PNG Image</ListItemText>
                        </MuiMenuItem>
                        <MuiMenuItem
                          onClick={() => {
                            downloadResults("pdf");
                            setDownloadMenuAnchorEl(null);
                          }}
                          disabled={isLoading}
                        >
                          <ListItemIcon>
                            <FileText size={18} />
                          </ListItemIcon>
                          <ListItemText>PDF Document</ListItemText>
                        </MuiMenuItem>
                        <MuiMenuItem
                          onClick={() => {
                            downloadResults("csv");
                            setDownloadMenuAnchorEl(null);
                          }}
                          disabled={isLoading}
                        >
                          <ListItemIcon>
                            <FileSpreadsheet size={18} />
                          </ListItemIcon>
                          <ListItemText>CSV File</ListItemText>
                        </MuiMenuItem>
                      </Menu>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: theme.palette.background.default,
                        borderRadius: 2,
                        mb: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                      elevation={0}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Input
                      </Typography>
                      <Typography
                        variant="h6"
                        aria-label="Conversion input"
                        fontWeight={600}
                      >
                        {conversionResult.inputValue}{" "}
                        {formatUnitLabel(conversionResult.inputUnit)}
                      </Typography>
                    </Paper>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Equivalent Values
                  </Typography>

                  <TableContainer
                    sx={{
                      maxHeight: 300,
                      overflow: "auto",
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Table
                      size="small"
                      stickyHeader
                      aria-label="Time conversion results table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold" }}>
                            Unit
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: "bold" }}>
                            Value
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {conversionResult.conversions.map((conversion) => {
                          // Highlight the row if it's the same as the input unit
                          const isInputUnit =
                            conversion.unit === conversionResult.inputUnit;

                          return (
                            <TableRow
                              key={conversion.unit}
                              aria-label={`${
                                showExactValues
                                  ? conversion.value
                                  : conversion.value.toFixed(6)
                              } ${conversion.unit}`}
                              sx={{
                                backgroundColor: isInputUnit
                                  ? theme.palette.mode === "dark"
                                    ? "rgba(25, 118, 210, 0.15)"
                                    : "rgba(25, 118, 210, 0.08)"
                                  : "inherit",
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <TableCell>
                                {formatUnitLabel(conversion.unit)}
                                {isInputUnit && (
                                  <Chip
                                    label="Input"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                      ml: 1,
                                      height: 20,
                                      fontSize: "0.7rem",
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{
                                  fontFamily: "monospace",
                                  fontWeight: isInputUnit ? 600 : 400,
                                }}
                              >
                                {showExactValues
                                  ? conversion.value
                                  : conversion.value.toFixed(6)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {showExactValues
                        ? "Showing exact values"
                        : "Values rounded to 6 decimal places. Toggle 'Show exact values' for full precision."}
                    </Typography>

                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download size={16} />}
                      onClick={(e) => setDownloadMenuAnchorEl(e.currentTarget)}
                      disabled={isLoading}
                      aria-label="Download options"
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    flexDirection: "column",
                    minHeight: "400px",
                  }}
                  aria-label="No conversion results yet"
                >
                  <Clock size={48} color={theme.palette.text.secondary} />
                  <Typography sx={{ mt: 2 }}>
                    Enter a value to convert between time units
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* AdSense Ad */}
        <AdSense adSlot="4240504971" />

        {/* Common time unit conversion formulas */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mt: 4,
            mb: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom fontWeight={600}>
            Common Time Unit Conversion Formulas
          </Typography>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Years to Other Units
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body2">1 year = 12 months</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body2">1 year = 52 weeks</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body2">1 year = 365 days</Typography>
                  </Box>
                  <Box component="li">
                    <Typography variant="body2">
                      1 year = 8,760 hours
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Months to Other Units
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      1 month = 30 days (average)
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      1 month = 4.33 weeks (average)
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography variant="body2">
                      1 month = 720 hours (30-day month)
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.background.default,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Days to Other Units
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body2">1 day = 24 hours</Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      1 day = 1,440 minutes
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography variant="body2">
                      1 day = 86,400 seconds
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mt: 4,
          }}
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About Time Units in Finance
          </Typography>
          <Typography paragraph itemProp="description">
            Time units play a crucial role in financial calculations, affecting
            interest rates, payment frequencies, investment periods, and more.
            Understanding how to convert between different time units is
            essential for accurate financial planning and analysis.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
                itemProp="name"
              >
                Financial Applications of Time Conversion
              </Typography>
              <Typography
                paragraph
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <span itemProp="text">
                  Time conversion is essential in finance for standardizing
                  periods across different calculations. For example, converting
                  annual interest rates to monthly, daily, or continuous rates
                  requires precise time unit conversion.
                </span>
              </Typography>
              <Typography
                paragraph
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <span itemProp="text">
                  When comparing investments with different compounding
                  frequencies or payment schedules, converting all time periods
                  to a standard unit allows for accurate comparison of returns
                  and costs.
                </span>
              </Typography>

              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
                sx={{ mt: 3 }}
                itemProp="name"
              >
                Time Units in Interest Calculations
              </Typography>
              <Typography
                paragraph
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <span itemProp="text">
                  When calculating compound interest, the frequency of
                  compounding affects the effective annual rate. Converting
                  between different compounding periods requires accurate time
                  unit conversion.
                </span>
              </Typography>
              <Typography
                paragraph
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <span itemProp="text">
                  For example, to convert an annual interest rate to a monthly
                  rate, you divide by 12. For daily compounding, you divide by
                  365. These conversions ensure accurate interest calculations
                  across different time periods.
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
                itemProp="name"
              >
                Common Financial Time Periods
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Daily:</strong> Used for daily compounding interest
                    or short-term money market calculations.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Weekly:</strong> Common for certain payment
                    schedules and short-term financial planning.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Monthly:</strong> The standard period for most loan
                    payments, mortgage calculations, and regular investment
                    plans.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Quarterly:</strong> Used for dividend payments,
                    corporate financial reporting, and some investment products.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Annual:</strong> The baseline for most interest
                    rates, returns, and long-term financial planning.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Decades:</strong> Useful for retirement planning,
                    long-term investments, and generational wealth calculations.
                  </span>
                </li>
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  backgroundColor:
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
                  Pro Tip
                </Typography>
                <Typography variant="body2">
                  When working with financial calculations, it's often best to
                  convert all time periods to the same unit before performing
                  calculations. This ensures consistency and accuracy in your
                  financial models and projections.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="5673150300" />
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        role="status"
        aria-live="polite"
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          aria-label="Notification message"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TimeConverter;
