"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem as MuiMenuItem,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Calculator,
  Download,
  Copy,
  RefreshCw,
  TrendingUp,
  Target,
  PieChart,
  CheckCircle,
  Zap,
  DollarSign,
} from "lucide-react";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface LumpsumResult {
  initialInvestment: number;
  maturityAmount: number;
  totalGains: number;
  yearlySchedule: Array<{
    year: number;
    startingAmount: number;
    growth: number;
    endingAmount: number;
  }>;
}

const LumpsumCalculator = () => {
  const theme = useTheme();
  const [initialInvestment, setInitialInvestment] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [lumpsumResult, setLumpsumResult] = useState<LumpsumResult | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateLumpsum = () => {
    const principal = parseFloat(initialInvestment);
    const rate = parseFloat(expectedReturn) / 100;
    const years = parseFloat(investmentPeriod);

    if (principal > 0 && rate >= 0 && years > 0) {
      // Compound interest formula: A = P(1 + r)^t
      const maturityAmount = principal * Math.pow(1 + rate, years);
      const totalGains = maturityAmount - principal;

      const schedule = [];
      let currentAmount = principal;

      // Calculate year by year
      for (let year = 1; year <= years; year++) {
        const startingAmount = currentAmount;
        const growth = currentAmount * rate;
        currentAmount += growth;

        schedule.push({
          year,
          startingAmount,
          growth,
          endingAmount: currentAmount,
        });
      }

      setLumpsumResult({
        initialInvestment: principal,
        maturityAmount,
        totalGains,
        yearlySchedule: schedule,
      });

      setSnackbarMessage("Lumpsum calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please enter valid values for all fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadLumpsumDetails = async (
    format: "png" | "pdf" | "csv" = "png"
  ) => {
    setIsDownloading(true);
    setDownloadMenuAnchorEl(null);

    if (!lumpsumResult) {
      setSnackbarMessage("No lumpsum calculation results to download");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDownloading(false);
      return;
    }

    const timestamp = new Date().toISOString().split("T")[0];

    try {
      if (format === "csv") {
        await downloadAsCSV(timestamp);
      } else if (format === "pdf") {
        await downloadAsPDF(timestamp);
      } else {
        await downloadAsPNG(timestamp);
      }
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()}:`, error);
      setSnackbarMessage(
        `Failed to generate ${format.toUpperCase()}. Please try again.`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadAsCSV = async (timestamp: string) => {
    if (!lumpsumResult) return;

    try {
      const csvContent = [
        ["LUMPSUM INVESTMENT CALCULATOR RESULTS"],
        [
          "Generated on",
          new Date().toLocaleDateString() +
            " at " +
            new Date().toLocaleTimeString(),
        ],
        ["Website", "www.KodeKit.in"],
        [""],
        ["LUMPSUM INVESTMENT DETAILS"],
        [
          "Initial Investment (₹)",
          parseFloat(initialInvestment).toLocaleString("en-IN"),
        ],
        ["Expected Annual Return (%)", expectedReturn],
        ["Investment Period (Years)", investmentPeriod],
        [""],
        ["INVESTMENT SUMMARY"],
        ["Initial Investment (₹)", lumpsumResult.initialInvestment.toFixed(0)],
        ["Total Gains (₹)", lumpsumResult.totalGains.toFixed(0)],
        ["Maturity Amount (₹)", lumpsumResult.maturityAmount.toFixed(0)],
        [
          "Returns as % of Investment",
          (
            (lumpsumResult.totalGains / lumpsumResult.initialInvestment) *
            100
          ).toFixed(2) + "%",
        ],
        [""],
        ["YEAR-WISE GROWTH SCHEDULE"],
        ["Year", "Starting Amount (₹)", "Growth (₹)", "Ending Amount (₹)"],
      ];

      lumpsumResult.yearlySchedule.forEach((row) => {
        csvContent.push([
          row.year.toString(),
          row.startingAmount.toFixed(0),
          row.growth.toFixed(0),
          row.endingAmount.toFixed(0),
        ]);
      });

      const csvString = csvContent
        .map((row) =>
          row
            .map((cell) => {
              const cellStr = String(cell);
              if (
                cellStr.includes(",") ||
                cellStr.includes('"') ||
                cellStr.includes("\n")
              ) {
                return `"${cellStr.replace(/"/g, '""')}"`;
              }
              return cellStr;
            })
            .join(",")
        )
        .join("\n");

      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvString], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `lumpsum_calculation_${timestamp}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      setSnackbarMessage("Lumpsum details downloaded as CSV successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error generating CSV:", error);
      setSnackbarMessage("Failed to generate CSV. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadAsPDF = async (timestamp: string) => {
    if (!lumpsumResult) return;

    try {
      const { jsPDF } = await import("jspdf");

      try {
        await import("jspdf-autotable");
      } catch (error) {
        console.warn("jsPDF autoTable not available, using basic table");
      }

      const doc = new jsPDF();
      let currentY = 20;

      // Header
      doc.setFillColor(63, 81, 181); // Indigo color for Lumpsum
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Lumpsum Investment Calculator", 20, 25);

      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      currentY = 45;
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        20,
        currentY
      );

      currentY += 20;

      // Lumpsum Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Lumpsum Investment Details", 20, currentY);

      doc.setLineWidth(0.5);
      doc.setDrawColor(63, 81, 181);
      doc.line(20, currentY + 2, 100, currentY + 2);

      currentY += 15;

      const lumpsumDetailsData = [
        [
          "Initial Investment:",
          `Rs. ${parseFloat(initialInvestment).toLocaleString("en-IN")}`,
        ],
        ["Expected Return:", `${expectedReturn}% per annum`],
        ["Investment Period:", `${investmentPeriod} years`],
      ];

      doc.setFontSize(11);
      lumpsumDetailsData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, currentY + index * 8);
        doc.setFont("helvetica", "normal");
        doc.text(value, 90, currentY + index * 8);
      });

      currentY += 35;

      // Investment Summary
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Summary", 20, currentY);
      doc.line(20, currentY + 2, 95, currentY + 2);
      currentY += 15;

      const summaryBoxes = [
        {
          label: "Maturity Amount",
          value: `Rs. ${lumpsumResult.maturityAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [63, 81, 181],
        },
        {
          label: "Initial Investment",
          value: `Rs. ${lumpsumResult.initialInvestment.toLocaleString(
            "en-IN",
            {
              maximumFractionDigits: 0,
            }
          )}`,
          color: [156, 39, 176],
        },
        {
          label: "Total Gains",
          value: `Rs. ${lumpsumResult.totalGains.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [76, 175, 80],
        },
      ];

      summaryBoxes.forEach((box, index) => {
        const x = 20 + index * 60;
        const y = currentY;

        doc.setFillColor(box.color[0], box.color[1], box.color[2]);
        doc.roundedRect(x, y, 55, 25, 3, 3, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(box.label, x + 3, y + 8);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        const lines = doc.splitTextToSize(box.value, 50);
        doc.text(lines, x + 3, y + 15);
      });

      currentY += 40;

      // Growth Schedule
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Year-wise Growth Schedule", 20, currentY);
      doc.line(20, currentY + 2, 120, currentY + 2);
      currentY += 10;

      const tableHeaders = [
        "Year",
        "Starting (Rs.)",
        "Growth (Rs.)",
        "Ending (Rs.)",
      ];
      const tableData = lumpsumResult.yearlySchedule.map((row) => [
        row.year.toString(),
        row.startingAmount.toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        }),
        row.growth.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.endingAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
      ]);

      if (typeof (doc as any).autoTable === "function") {
        (doc as any).autoTable({
          head: [tableHeaders],
          body: tableData,
          startY: currentY,
          theme: "striped",
          headStyles: {
            fillColor: [63, 81, 181],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
            halign: "center",
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3,
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 25 },
            1: { halign: "right", cellWidth: 45 },
            2: { halign: "right", cellWidth: 45 },
            3: { halign: "right", cellWidth: 45 },
          },
          margin: { left: 20, right: 20 },
          pageBreak: "auto",
          showHead: "everyPage",
        });
      } else {
        // Fallback: Create table manually if autoTable is not available
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setFillColor(63, 81, 181);
        doc.setTextColor(255, 255, 255);

        // Table header with better spacing
        const colWidths = [25, 45, 45, 45];
        const colPositions = [20, 45, 90, 135];

        // Draw header background
        doc.rect(20, currentY, 160, 10, "F");

        // Header text with proper alignment
        tableHeaders.forEach((header, index) => {
          if (index === 0) {
            // Center align Year column header
            const headerWidth = doc.getTextWidth(header);
            doc.text(
              header,
              colPositions[index] + colWidths[index] / 2 - headerWidth / 2,
              currentY + 7
            );
          } else {
            // Right align other headers
            const headerWidth = doc.getTextWidth(header);
            doc.text(
              header,
              colPositions[index] + colWidths[index] - headerWidth - 2,
              currentY + 7
            );
          }
        });

        currentY += 12;

        // Table rows
        doc.setTextColor(40, 40, 40);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        tableData.forEach((row, index) => {
          if (currentY > 270) {
            // Check if we need a new page
            doc.addPage();
            currentY = 20;

            // Redraw header on new page
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setFillColor(63, 81, 181);
            doc.setTextColor(255, 255, 255);
            doc.rect(20, currentY, 160, 10, "F");

            tableHeaders.forEach((header, index) => {
              if (index === 0) {
                const headerWidth = doc.getTextWidth(header);
                doc.text(
                  header,
                  colPositions[index] + colWidths[index] / 2 - headerWidth / 2,
                  currentY + 7
                );
              } else {
                const headerWidth = doc.getTextWidth(header);
                doc.text(
                  header,
                  colPositions[index] + colWidths[index] - headerWidth - 2,
                  currentY + 7
                );
              }
            });
            currentY += 12;

            doc.setTextColor(40, 40, 40);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
          }

          // Alternate row colors
          if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, currentY - 2, 160, 10, "F");
          }

          // Row data with proper alignment
          row.forEach((cell, colIndex) => {
            if (colIndex === 0) {
              // Center align Year column
              const cellWidth = doc.getTextWidth(cell);
              doc.text(
                cell,
                colPositions[colIndex] +
                  colWidths[colIndex] / 2 -
                  cellWidth / 2,
                currentY + 5
              );
            } else {
              // Right align amount columns
              const cellWidth = doc.getTextWidth(cell);
              doc.text(
                cell,
                colPositions[colIndex] + colWidths[colIndex] - cellWidth - 2,
                currentY + 5
              );
            }
          });

          currentY += 10;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(40, 40, 40);
        doc.setFont("helvetica", "bold");
        doc.text(`Generated by www.KodeKit.in Lumpsum Calculator`, 20, 285);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      doc.save(`lumpsum_calculation_${timestamp}.pdf`);

      setSnackbarMessage("Lumpsum details downloaded as PDF successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSnackbarMessage("Failed to generate PDF. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadAsPNG = async (timestamp: string) => {
    if (!resultsRef.current || !lumpsumResult) return;

    const enhancedContent = document.createElement("div");
    enhancedContent.style.cssText = `
      width: 800px;
      padding: 40px;
      background: white;
      font-family: 'Roboto', Arial, sans-serif;
      color: #333;
      line-height: 1.6;
    `;

    enhancedContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3f51b5; padding-bottom: 20px;">
        <h1 style="color: #3f51b5; margin: 0; font-size: 28px;">Lumpsum Investment Calculator</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #3f51b5; padding-left: 10px;">Lumpsum Investment Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div><strong>Initial Investment:</strong> Rs. ${parseFloat(
            initialInvestment
          ).toLocaleString("en-IN")}</div>
          <div><strong>Expected Return:</strong> ${expectedReturn}%</div>
          <div><strong>Investment Period:</strong> ${investmentPeriod} years</div>
          <div><strong>Maturity Amount:</strong> Rs. ${lumpsumResult.maturityAmount.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 0 }
          )}</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #3f51b5; padding-left: 10px;">Investment Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #e8eaf6; border-radius: 8px; border: 2px solid #3f51b5;">
            <div style="font-size: 24px; font-weight: bold; color: #3f51b5;">Rs. ${lumpsumResult.maturityAmount.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Maturity Amount</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f3e5f5; border-radius: 8px; border: 2px solid #9c27b0;">
            <div style="font-size: 18px; font-weight: bold; color: #9c27b0;">Rs. ${lumpsumResult.initialInvestment.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Initial Investment</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 8px; border: 2px solid #4caf50;">
            <div style="font-size: 18px; font-weight: bold; color: #4caf50;">Rs. ${lumpsumResult.totalGains.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Gains</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #3f51b5; padding-left: 10px;">Year-wise Growth Schedule</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #3f51b5; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Year</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Starting (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Growth (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Ending (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${lumpsumResult.yearlySchedule
              .map(
                (row, index) => `
              <tr style="background: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  row.year
                }</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Rs. ${row.startingAmount.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #4caf50;">Rs. ${row.growth.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Rs. ${row.endingAmount.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; text-align: center; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
        <span style="color: #000; font-weight: 900;">Generated by www.KodeKit.in Lumpsum Calculator</span> | <span style="color: #666;">${
          window.location.href
        }</span>
      </div>
    `;

    enhancedContent.style.position = "absolute";
    enhancedContent.style.left = "-9999px";
    enhancedContent.style.top = "0";
    document.body.appendChild(enhancedContent);

    try {
      const canvas = await html2canvas(enhancedContent, {
        width: 800,
        height: enhancedContent.scrollHeight + 100,
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `lumpsum_calculation_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("Lumpsum details downloaded as PNG successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } finally {
      document.body.removeChild(enhancedContent);
    }
  };

  const handleReset = () => {
    setInitialInvestment("");
    setExpectedReturn("");
    setInvestmentPeriod("");
    setLumpsumResult(null);
    setActiveTab(0);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!lumpsumResult) return;

    const resultsText = `
Lumpsum Summary:
Initial Investment: Rs. ${parseFloat(initialInvestment).toFixed(2)}
Expected Return: ${expectedReturn}%
Investment Period: ${investmentPeriod} years
Total Gains: Rs. ${lumpsumResult.totalGains.toFixed(2)}
Maturity Amount: Rs. ${lumpsumResult.maturityAmount.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("Lumpsum summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <>
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          left: "-9999px",
          zIndex: 999,
          padding: "8px 16px",
          background: theme.palette.primary.main,
          color: "white",
          textDecoration: "none",
          "&:focus": {
            left: "10px",
            top: "10px",
          },
        }}
      >
        Skip to main content
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }} id="main-content">
        <Navigation />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box component="header" sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              fontWeight={700}
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.2,
              }}
            >
              Lumpsum Calculator - One-time Investment Calculator
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              color="text.secondary"
              paragraph
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                fontWeight: 400,
                mt: 2,
              }}
            >
              Calculate your lumpsum investment returns, maturity amount, and
              wealth growth projections. Plan your one-time investments with
              accurate compound growth calculations.
            </Typography>
          </Box>

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
                component="section"
                aria-labelledby="calculator-form"
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Zap
                    size={28}
                    color={theme.palette.primary.main}
                    style={{ marginRight: "12px" }}
                  />
                  <Typography
                    id="calculator-form"
                    variant="h3"
                    component="h3"
                    fontWeight={600}
                    sx={{ fontSize: "1.5rem" }}
                  >
                    Lumpsum Calculator
                  </Typography>
                </Box>

                <Box component="form" noValidate autoComplete="off">
                  <TextField
                    fullWidth
                    label="Initial Investment Amount (₹)"
                    variant="outlined"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    type="number"
                    inputProps={{
                      min: 1000,
                      step: 1000,
                      "aria-describedby": "investment-helper-text",
                    }}
                    helperText="Your one-time lumpsum investment amount"
                    id="investment-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Expected Annual Return (%)"
                    variant="outlined"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 30,
                      step: 0.1,
                      "aria-describedby": "return-helper-text",
                    }}
                    helperText="Expected annual return rate from your investment"
                    id="return-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Investment Period (Years)"
                    variant="outlined"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(e.target.value)}
                    type="number"
                    inputProps={{
                      min: 1,
                      max: 50,
                      step: 1,
                      "aria-describedby": "period-helper-text",
                    }}
                    helperText="Duration for which you want to invest"
                    id="period-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={calculateLumpsum}
                      startIcon={<Calculator size={20} />}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                      disabled={
                        !initialInvestment ||
                        !expectedReturn ||
                        !investmentPeriod
                      }
                    >
                      Calculate Lumpsum
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={
                        !initialInvestment &&
                        !expectedReturn &&
                        !investmentPeriod
                      }
                      startIcon={<RefreshCw size={18} />}
                      size="large"
                      aria-label="Reset calculator form"
                      sx={{
                        py: 1.5,
                        minWidth: { xs: "auto", sm: "120px" },
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Box>

                {/* Lumpsum Benefits */}
                <Card
                  sx={{ mt: 3, backgroundColor: "rgba(63, 81, 181, 0.05)" }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <DollarSign
                        size={20}
                        style={{ marginRight: 8, color: "#3f51b5" }}
                      />
                      Lumpsum Benefits
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Power of compounding"
                          secondary="Full benefit of compound growth"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="No timing risk"
                          secondary="Single investment decision"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Lower transaction costs"
                          secondary="One-time investment fees"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Simplicity"
                          secondary="Easy to track and manage"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              {lumpsumResult ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  ref={resultsRef}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h4" component="h4" fontWeight={600}>
                        Lumpsum Results
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Copy results">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy lumpsum results to clipboard"
                          >
                            <Copy size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download results">
                          <IconButton
                            onClick={(e) =>
                              setDownloadMenuAnchorEl(e.currentTarget)
                            }
                            size="small"
                            disabled={isDownloading}
                            aria-label="Download lumpsum results"
                          >
                            {isDownloading ? (
                              <CircularProgress size={18} />
                            ) : (
                              <Download size={18} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Menu
                      anchorEl={downloadMenuAnchorEl}
                      open={Boolean(downloadMenuAnchorEl)}
                      onClose={() => setDownloadMenuAnchorEl(null)}
                    >
                      <MuiMenuItem
                        onClick={() => downloadLumpsumDetails("png")}
                      >
                        Download as PNG
                      </MuiMenuItem>
                      <MuiMenuItem
                        onClick={() => downloadLumpsumDetails("pdf")}
                      >
                        Download as PDF
                      </MuiMenuItem>
                      <MuiMenuItem
                        onClick={() => downloadLumpsumDetails("csv")}
                      >
                        Download as CSV
                      </MuiMenuItem>
                    </Menu>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={4}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #3f51b5 0%, #303f9f 100%)",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <CardContent>
                            <Target size={32} style={{ marginBottom: 8 }} />
                            <Typography
                              variant="h4"
                              component="div"
                              fontWeight={700}
                            >
                              ₹
                              {lumpsumResult.maturityAmount.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Maturity Amount
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <CardContent>
                            <DollarSign size={32} style={{ marginBottom: 8 }} />
                            <Typography
                              variant="h5"
                              component="div"
                              fontWeight={600}
                            >
                              ₹
                              {lumpsumResult.initialInvestment.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Initial Investment
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <CardContent>
                            <TrendingUp size={32} style={{ marginBottom: 8 }} />
                            <Typography
                              variant="h5"
                              component="div"
                              fontWeight={600}
                            >
                              ₹
                              {lumpsumResult.totalGains.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Total Gains
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      sx={{ mb: 3 }}
                      aria-label="Lumpsum results tabs"
                    >
                      <Tab label="Growth Schedule" />
                      <Tab label="Summary" />
                    </Tabs>

                    {activeTab === 0 && (
                      <TableContainer
                        component={Paper}
                        variant="outlined"
                        sx={{ maxHeight: 400 }}
                      >
                        <Table
                          stickyHeader
                          size="small"
                          aria-label="Lumpsum growth schedule"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Year</TableCell>
                              <TableCell align="right">Starting (₹)</TableCell>
                              <TableCell align="right">Growth (₹)</TableCell>
                              <TableCell align="right">Ending (₹)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {lumpsumResult.yearlySchedule.map((row) => (
                              <TableRow key={row.year}>
                                <TableCell component="th" scope="row">
                                  {row.year}
                                </TableCell>
                                <TableCell align="right">
                                  {row.startingAmount.toLocaleString("en-IN", {
                                    maximumFractionDigits: 0,
                                  })}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: "success.main" }}
                                >
                                  {row.growth.toLocaleString("en-IN", {
                                    maximumFractionDigits: 0,
                                  })}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {row.endingAmount.toLocaleString("en-IN", {
                                    maximumFractionDigits: 0,
                                  })}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                    {activeTab === 1 && (
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Investment Details
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Initial Investment:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    ₹
                                    {parseFloat(
                                      initialInvestment
                                    ).toLocaleString("en-IN")}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Expected Return:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {expectedReturn}%
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    Investment Period:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {investmentPeriod} years
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Returns Analysis
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Total Returns:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="success.main"
                                  >
                                    {(
                                      (lumpsumResult.totalGains /
                                        lumpsumResult.initialInvestment) *
                                      100
                                    ).toFixed(1)}
                                    %
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Wealth Multiplier:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="primary.main"
                                  >
                                    {(
                                      lumpsumResult.maturityAmount /
                                      lumpsumResult.initialInvestment
                                    ).toFixed(2)}
                                    x
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">CAGR:</Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {expectedReturn}%
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    Investment Type:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="primary.main"
                                  >
                                    One-time Lumpsum
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Paper>
                </motion.div>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    textAlign: "center",
                  }}
                >
                  <PieChart
                    size={64}
                    color={theme.palette.text.secondary}
                    style={{ marginBottom: 16 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Enter Lumpsum Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in your investment details to calculate the lumpsum
                    investment returns and compound growth.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* AdSense */}
          <AdSense adSlot="6613251015" />

          {/* Lumpsum Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                mt: 4,
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                fontWeight={600}
              >
                About Lumpsum Investment
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    What is Lumpsum Investment?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Lumpsum investment involves investing a large amount of
                    money at once, rather than spreading it over time. This
                    strategy allows you to benefit from the full power of
                    compounding from day one.
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Key Features
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="One-time investment" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Full compounding benefit" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Lower transaction costs" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Simple to manage" />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    When to Choose Lumpsum
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="You have a large amount available" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Markets are at attractive levels" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Long investment horizon" />
                    </ListItem>
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Advantages
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Maximum compounding benefit" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="No timing decisions needed" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Potentially higher returns" />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        </motion.div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default LumpsumCalculator;
