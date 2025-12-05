"use client";

import { useState, useRef, useEffect } from "react";
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
  TrendingDown,
  Target,
  PieChart,
  CheckCircle,
  ArrowDownCircle,
  DollarSign,
} from "lucide-react";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface SWPResult {
  totalWithdrawal: number;
  finalValue: number;
  totalGrowth: number;
  monthsToExhaust: number;
  yearlySchedule: Array<{
    year: number;
    startingValue: number;
    withdrawal: number;
    growth: number;
    endingValue: number;
  }>;
}

const SWPCalculator = () => {
  const theme = useTheme();
  const [initialInvestment, setInitialInvestment] = useState("");
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [swpResult, setSWPResult] = useState<SWPResult | null>(null);
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
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const calculateSWP = () => {
    const initial = parseFloat(initialInvestment);
    const withdrawal = parseFloat(monthlyWithdrawal);
    const annualReturn = parseFloat(expectedReturn);
    const years = parseFloat(timePeriod);

    if (initial > 0 && withdrawal > 0 && annualReturn >= 0 && years > 0) {
      const monthlyReturn = annualReturn / 100 / 12;
      let currentValue = initial;
      let totalWithdrawal = 0;
      const schedule = [];
      let monthsToExhaust = 0;

      // Calculate year by year
      for (let year = 1; year <= years; year++) {
        const startingValue = currentValue;
        let yearlyWithdrawal = 0;
        let yearlyGrowth = 0;

        // Calculate monthly for this year
        for (let month = 1; month <= 12; month++) {
          if (currentValue <= 0) break;

          // Withdraw first (at the beginning of the month)
          if (currentValue >= withdrawal) {
            currentValue -= withdrawal;
            yearlyWithdrawal += withdrawal;
            totalWithdrawal += withdrawal;
            monthsToExhaust++;
          } else {
            // Partial withdrawal if insufficient funds
            yearlyWithdrawal += currentValue;
            totalWithdrawal += currentValue;
            currentValue = 0;
            break;
          }

          // Then apply growth on remaining balance
          if (currentValue > 0) {
            const monthlyGrowth = currentValue * monthlyReturn;
            currentValue += monthlyGrowth;
            yearlyGrowth += monthlyGrowth;
          }
        }

        schedule.push({
          year,
          startingValue,
          withdrawal: yearlyWithdrawal,
          growth: yearlyGrowth,
          endingValue: currentValue,
        });

        if (currentValue <= 0) break;
      }

      const finalValue = currentValue;
      const totalGrowth = totalWithdrawal + finalValue - initial;

      setSWPResult({
        totalWithdrawal,
        finalValue,
        totalGrowth,
        monthsToExhaust,
        yearlySchedule: schedule,
      });

      setSnackbarMessage("SWP calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please enter valid values for all fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadSWPDetails = async (format: "png" | "pdf" | "csv" = "png") => {
    setIsDownloading(true);
    setDownloadMenuAnchorEl(null);

    if (!swpResult) {
      setSnackbarMessage("No SWP calculation results to download");
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
    if (!swpResult) return;

    try {
      const csvContent = [
        ["SYSTEMATIC WITHDRAWAL PLAN CALCULATOR RESULTS"],
        [
          "Generated on",
          new Date().toLocaleDateString() +
          " at " +
          new Date().toLocaleTimeString(),
        ],
        ["Website", "www.KodeKit.in"],
        [""],
        ["SWP INVESTMENT DETAILS"],
        [
          "Initial Investment (₹)",
          parseFloat(initialInvestment).toLocaleString("en-IN"),
        ],
        [
          "Monthly Withdrawal (₹)",
          parseFloat(monthlyWithdrawal).toLocaleString("en-IN"),
        ],
        ["Expected Annual Return (%)", expectedReturn],
        ["Time Period (Years)", timePeriod],
        [""],
        ["SWP SUMMARY"],
        ["Total Withdrawal (₹)", swpResult.totalWithdrawal.toFixed(0)],
        ["Final Value (₹)", swpResult.finalValue.toFixed(0)],
        ["Total Growth (₹)", swpResult.totalGrowth.toFixed(0)],
        ["Months to Exhaust", swpResult.monthsToExhaust.toString()],
        [""],
        ["YEAR-WISE WITHDRAWAL SCHEDULE"],
        [
          "Year",
          "Starting Value (₹)",
          "Withdrawal (₹)",
          "Growth (₹)",
          "Ending Value (₹)",
        ],
      ];

      swpResult.yearlySchedule.forEach((row) => {
        csvContent.push([
          row.year.toString(),
          row.startingValue.toFixed(0),
          row.withdrawal.toFixed(0),
          row.growth.toFixed(0),
          row.endingValue.toFixed(0),
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
      link.download = `swp_calculation_${timestamp}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      setSnackbarMessage("SWP details downloaded as CSV successfully");
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
    if (!swpResult) return;

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
      doc.setFillColor(255, 87, 34); // Orange color for SWP
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Systematic Withdrawal Plan Calculator", 20, 25);

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

      // SWP Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SWP Investment Details", 20, currentY);

      doc.setLineWidth(0.5);
      doc.setDrawColor(255, 87, 34);
      doc.line(20, currentY + 2, 100, currentY + 2);

      currentY += 15;

      const swpDetailsData = [
        [
          "Initial Investment:",
          `Rs. ${parseFloat(initialInvestment).toLocaleString("en-IN")}`,
        ],
        [
          "Monthly Withdrawal:",
          `Rs. ${parseFloat(monthlyWithdrawal).toLocaleString("en-IN")}`,
        ],
        ["Expected Return:", `${expectedReturn}% per annum`],
        ["Time Period:", `${timePeriod} years`],
      ];

      doc.setFontSize(11);
      swpDetailsData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, currentY + index * 8);
        doc.setFont("helvetica", "normal");
        doc.text(value, 90, currentY + index * 8);
      });

      currentY += 40;

      // Investment Summary
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SWP Summary", 20, currentY);
      doc.line(20, currentY + 2, 95, currentY + 2);
      currentY += 15;

      const summaryBoxes = [
        {
          label: "Total Withdrawal",
          value: `Rs. ${swpResult.totalWithdrawal.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [255, 87, 34],
        },
        {
          label: "Final Value",
          value: `Rs. ${swpResult.finalValue.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [76, 175, 80],
        },
        {
          label: "Total Growth",
          value: `Rs. ${swpResult.totalGrowth.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [33, 150, 243],
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
      doc.text("Year-wise Withdrawal Schedule", 20, currentY);
      doc.line(20, currentY + 2, 120, currentY + 2);
      currentY += 10;

      const tableHeaders = [
        "Year",
        "Starting (Rs.)",
        "Withdrawal (Rs.)",
        "Growth (Rs.)",
        "Ending (Rs.)",
      ];
      const tableData = swpResult.yearlySchedule.map((row) => [
        row.year.toString(),
        row.startingValue.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.withdrawal.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.growth.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.endingValue.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
      ]);

      if (typeof (doc as any).autoTable === "function") {
        (doc as any).autoTable({
          head: [tableHeaders],
          body: tableData,
          startY: currentY,
          theme: "striped",
          headStyles: {
            fillColor: [255, 87, 34],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 8,
            halign: "center",
          },
          bodyStyles: {
            fontSize: 7,
            cellPadding: 2,
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 20 },
            1: { halign: "right", cellWidth: 35 },
            2: { halign: "right", cellWidth: 35 },
            3: { halign: "right", cellWidth: 35 },
            4: { halign: "right", cellWidth: 35 },
          },
          margin: { left: 20, right: 20 },
          pageBreak: "auto",
          showHead: "everyPage",
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(40, 40, 40);
        doc.setFont("helvetica", "bold");
        doc.text(`Generated by www.KodeKit.in SWP Calculator`, 20, 285);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      doc.save(`swp_calculation_${timestamp}.pdf`);

      setSnackbarMessage("SWP details downloaded as PDF successfully");
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
    if (!resultsRef.current || !swpResult) return;

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
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ff5722; padding-bottom: 20px;">
        <h1 style="color: #ff5722; margin: 0; font-size: 28px;">Systematic Withdrawal Plan Calculator</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #ff5722; padding-left: 10px;">SWP Investment Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div><strong>Initial Investment:</strong> Rs. ${parseFloat(
      initialInvestment
    ).toLocaleString("en-IN")}</div>
          <div><strong>Monthly Withdrawal:</strong> Rs. ${parseFloat(
      monthlyWithdrawal
    ).toLocaleString("en-IN")}</div>
          <div><strong>Expected Return:</strong> ${expectedReturn}%</div>
          <div><strong>Time Period:</strong> ${timePeriod} years</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #ff5722; padding-left: 10px;">SWP Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 8px; border: 2px solid #ff5722;">
            <div style="font-size: 24px; font-weight: bold; color: #ff5722;">Rs. ${swpResult.totalWithdrawal.toLocaleString(
      "en-IN",
      { maximumFractionDigits: 0 }
    )}</div>
            <div style="font-size: 14px; color: #666;">Total Withdrawal</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 8px; border: 2px solid #4caf50;">
            <div style="font-size: 18px; font-weight: bold; color: #4caf50;">Rs. ${swpResult.finalValue.toLocaleString(
      "en-IN",
      { maximumFractionDigits: 0 }
    )}</div>
            <div style="font-size: 14px; color: #666;">Final Value</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 8px; border: 2px solid #2196f3;">
            <div style="font-size: 18px; font-weight: bold; color: #2196f3;">Rs. ${swpResult.totalGrowth.toLocaleString(
      "en-IN",
      { maximumFractionDigits: 0 }
    )}</div>
            <div style="font-size: 14px; color: #666;">Total Growth</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #ff5722; padding-left: 10px;">Year-wise Withdrawal Schedule</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #ff5722; color: white;">
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Year</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Starting (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Withdrawal (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Growth (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Ending (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${swpResult.yearlySchedule
        .map(
          (row, index) => `
              <tr style="background: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${row.year
            }</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Rs. ${row.startingValue.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #ff5722;">Rs. ${row.withdrawal.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #4caf50;">Rs. ${row.growth.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Rs. ${row.endingValue.toLocaleString(
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
        <span style="color: #000; font-weight: 900;">Generated by www.KodeKit.in SWP Calculator</span> | <span style="color: #666;">${typeof window !== "undefined"
        ? window.location.href
        : "https://kodekit.in"
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
      link.download = `swp_calculation_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("SWP details downloaded as PNG successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } finally {
      document.body.removeChild(enhancedContent);
    }
  };

  const handleReset = () => {
    setInitialInvestment("");
    setMonthlyWithdrawal("");
    setExpectedReturn("");
    setTimePeriod("");

    setSWPResult(null);
    setActiveTab(0);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!swpResult) return;

    const resultsText = `
SWP Summary:
Initial Investment: Rs. ${parseFloat(initialInvestment).toFixed(2)}
Monthly Withdrawal: Rs. ${parseFloat(monthlyWithdrawal).toFixed(2)}
Expected Return: ${expectedReturn}%
Time Period: ${timePeriod} years
Total Withdrawal: Rs. ${swpResult.totalWithdrawal.toFixed(2)}
Final Value: Rs. ${swpResult.finalValue.toFixed(2)}
Total Growth: Rs. ${swpResult.totalGrowth.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("SWP summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            SWP Calculator - Systematic Withdrawal Plan Calculator
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
            Calculate your Systematic Withdrawal Plan returns, final value, and
            withdrawal schedule. Plan your retirement income with accurate SWP
            calculations and sustainability analysis.
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
                <ArrowDownCircle
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
                  SWP Calculator
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
                    min: 10000,
                    step: 1000,
                  }}
                  helperText="Your initial corpus amount"
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Monthly Withdrawal Amount (₹)"
                  variant="outlined"
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(e.target.value)}
                  type="number"
                  inputProps={{
                    min: 1000,
                    step: 500,
                  }}
                  helperText="Amount you want to withdraw monthly"
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
                  }}
                  helperText="Expected return from your investments"
                  sx={{ mb: 3 }}
                />

                <TextField
                  fullWidth
                  label="Withdrawal Period (Years)"
                  variant="outlined"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  type="number"
                  inputProps={{
                    min: 1,
                    max: 50,
                    step: 1,
                  }}
                  helperText="How long you want to withdraw"
                  sx={{ mb: 3 }}
                />

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    onClick={calculateSWP}
                    disabled={
                      !initialInvestment ||
                      !monthlyWithdrawal ||
                      !expectedReturn ||
                      !timePeriod
                    }
                    startIcon={<Calculator size={20} />}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Calculate SWP
                  </Button>

                  <Tooltip title="Reset form">
                    <IconButton
                      onClick={handleReset}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                      }}
                    >
                      <RefreshCw size={20} />
                    </IconButton>
                  </Tooltip>
                </Box>

                {swpResult && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                      <Tooltip title="Copy results">
                        <IconButton
                          onClick={handleCopyResults}
                          size="small"
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          <Copy size={16} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Download results">
                        <IconButton
                          onClick={(e) =>
                            setDownloadMenuAnchorEl(e.currentTarget)
                          }
                          size="small"
                          disabled={isDownloading}
                          sx={{
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        >
                          {isDownloading ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Download size={16} />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Menu
                      anchorEl={downloadMenuAnchorEl}
                      open={Boolean(downloadMenuAnchorEl)}
                      onClose={() => setDownloadMenuAnchorEl(null)}
                    >
                      <MuiMenuItem onClick={() => downloadSWPDetails("png")}>
                        Download as PNG
                      </MuiMenuItem>
                      <MuiMenuItem onClick={() => downloadSWPDetails("pdf")}>
                        Download as PDF
                      </MuiMenuItem>
                      <MuiMenuItem onClick={() => downloadSWPDetails("csv")}>
                        Download as CSV
                      </MuiMenuItem>
                    </Menu>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="h4"
                  component="h4"
                  gutterBottom
                  sx={{ fontSize: "1.2rem", fontWeight: 600 }}
                >
                  SWP Benefits
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingDown
                        size={20}
                        color={theme.palette.warning.main}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Regular Income"
                      secondary="Provides steady monthly income from investments"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Target size={20} color={theme.palette.success.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Flexible Withdrawals"
                      secondary="Adjust withdrawal amounts as per needs"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle
                        size={20}
                        color={theme.palette.success.main}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tax Efficiency"
                      secondary="Only capital gains portion is taxable"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DollarSign
                        size={20}
                        color={theme.palette.primary.main}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Retirement Planning"
                      secondary="Ideal for post-retirement income planning"
                    />
                  </ListItem>
                </List>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            {swpResult ? (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
                ref={resultsRef}
              >
                <Typography
                  variant="h3"
                  component="h3"
                  gutterBottom
                  sx={{ fontSize: "1.5rem", fontWeight: 600 }}
                >
                  SWP Calculation Results
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.warning.main}20, ${theme.palette.warning.main}10)`,
                        border: `1px solid ${theme.palette.warning.main}30`,
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          component="div"
                          color="warning.main"
                          fontWeight={700}
                        >
                          ₹
                          {swpResult.totalWithdrawal.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Withdrawal
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.success.main}20, ${theme.palette.success.main}10)`,
                        border: `1px solid ${theme.palette.success.main}30`,
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h5"
                          component="div"
                          color="success.main"
                          fontWeight={600}
                        >
                          ₹
                          {swpResult.finalValue.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Final Value
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}10)`,
                        border: `1px solid ${theme.palette.primary.main}30`,
                      }}
                    >
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h5"
                          component="div"
                          color="primary.main"
                          fontWeight={600}
                        >
                          ₹
                          {swpResult.totalGrowth.toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Growth
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    aria-label="SWP results tabs"
                  >
                    <Tab label="Withdrawal Schedule" />
                    <Tab label="Summary" />
                  </Tabs>
                </Box>

                {activeTab === 0 && (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Year</TableCell>
                          <TableCell align="right">Starting (₹)</TableCell>
                          <TableCell align="right">Withdrawal (₹)</TableCell>
                          <TableCell align="right">Growth (₹)</TableCell>
                          <TableCell align="right">Ending (₹)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {swpResult.yearlySchedule.map((row) => (
                          <TableRow key={row.year}>
                            <TableCell>{row.year}</TableCell>
                            <TableCell align="right">
                              {row.startingValue.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </TableCell>
                            <TableCell
                              align="right"
                              sx={{ color: "warning.main" }}
                            >
                              {row.withdrawal.toLocaleString("en-IN", {
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
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {row.endingValue.toLocaleString("en-IN", {
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
                    <Typography
                      variant="h4"
                      component="h4"
                      gutterBottom
                      sx={{ fontSize: "1.2rem", fontWeight: 600 }}
                    >
                      Investment Summary
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Initial Investment:</strong> ₹
                          {parseFloat(initialInvestment).toLocaleString(
                            "en-IN"
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Monthly Withdrawal:</strong> ₹
                          {parseFloat(monthlyWithdrawal).toLocaleString(
                            "en-IN"
                          )}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Expected Return:</strong> {expectedReturn}%
                          per annum
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Withdrawal Period:</strong> {timePeriod} years
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Months to Exhaust:</strong>{" "}
                          {swpResult.monthsToExhaust} months
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1">
                          <strong>Sustainability:</strong>{" "}
                          {swpResult.finalValue > 0
                            ? "Sustainable"
                            : "Will exhaust"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 6,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: "center",
                }}
              >
                <PieChart
                  size={64}
                  color={theme.palette.text.secondary}
                  style={{ marginBottom: "16px" }}
                />
                <Typography
                  variant="h4"
                  component="h4"
                  gutterBottom
                  sx={{ fontSize: "1.3rem", fontWeight: 600 }}
                >
                  SWP Results
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Enter your investment details and click "Calculate SWP" to see
                  withdrawal projections.
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* AdSense Ad */}
        <AdSense adSlot="3146398237" />

        {/* SWP Information Section */}
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
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            About Systematic Withdrawal Plan (SWP)
          </Typography>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                What is SWP?
              </Typography>
              <Typography variant="body1" paragraph>
                Systematic Withdrawal Plan allows you to withdraw a fixed amount
                from your mutual fund investments at regular intervals. It's
                ideal for generating regular income during retirement or for
                meeting periodic financial needs.
              </Typography>

              <Typography variant="h6" gutterBottom>
                Key Features
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="Regular income stream" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="Flexible withdrawal amounts" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="Tax-efficient withdrawals" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="Rupee cost averaging benefits" />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                How SWP Works
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="Invest lump sum in mutual funds" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="Set monthly withdrawal amount" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="Receive regular payouts" />
                </ListItem>
              </List>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Tax Benefits
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="Only capital gains portion is taxed" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="LTCG tax benefits after 1 year" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircle size={20} color="#4caf50" />
                  </ListItemIcon>
                  <ListItemText primary="No TDS on withdrawals" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
        {/* AdSense */}
        <AdSense adSlot="4201858400" />
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
  );
};

export default SWPCalculator;
