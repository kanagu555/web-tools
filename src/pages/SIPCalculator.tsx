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
  Divider,
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
  DollarSign,
  PieChart,
  CheckCircle,
} from "lucide-react";
import { Helmet } from "react-helmet";
import SEOHelmet from "../components/SEOHelmet";
import {
  generateToolSEO,
  generateWebAppData,
  generateHowToData,
  generateBreadcrumbData,
} from "../Utils/seoUtils";
import html2canvas from "html2canvas";
import AdSense from "../components/AdSense";
import Breadcrumb from "../components/Breadcrumb";

interface SIPResult {
  totalInvestment: number;
  expectedReturns: number;
  maturityValue: number;
  growthSchedule: Array<{
    year: number;
    month: number;
    investedAmount: number;
    interestEarned: number;
    totalValue: number;
  }>;
}

const SIPCalculator = () => {
  const theme = useTheme();
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [sipResult, setSipResult] = useState<SIPResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Generate SEO data
  const seoData = generateToolSEO(
    "SIP Calculator",
    "Calculate SIP returns, maturity amount, and wealth growth with our free online SIP calculator. Plan your mutual fund investments with detailed projections",
    "finance"
  );

  const webAppData = generateWebAppData(
    "SIP Calculator",
    "Free online SIP calculator to calculate returns on Systematic Investment Plans. Get detailed projections for mutual fund investments with wealth growth analysis.",
    "finance"
  );

  const howToSteps = [
    {
      name: "Enter Investment Amount",
      text: "Input your monthly SIP investment amount (minimum ₹500)",
    },
    {
      name: "Set Expected Return",
      text: "Enter the expected annual return rate (typically 8-15% for equity funds)",
    },
    {
      name: "Choose Investment Period",
      text: "Select your investment duration in years (minimum 1 year)",
    },
    {
      name: "Calculate Returns",
      text: "Click 'Calculate SIP' to see maturity amount, total returns, and wealth growth projections",
    },
  ];

  const howToData = generateHowToData("SIP Calculator", howToSteps);

  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Finance Tools", url: "https://kodekit.in/category/finance" },
    { name: "SIP Calculator", url: "https://kodekit.in/tools/sip-calculator" },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Finance Tools", url: "/category/finance" },
    { name: "SIP Calculator" },
  ];

  const calculateSIP = () => {
    const principal = parseFloat(monthlyInvestment);
    const rate = parseFloat(expectedReturn) / 100 / 12;
    const months = parseFloat(investmentPeriod) * 12;

    if (principal > 0 && rate > 0 && months > 0) {
      // SIP calculation formula: M × {[(1 + r)^n - 1] / r} × (1 + r)
      // Where M is the monthly investment, r is the monthly interest rate, and n is the number of months
      const maturityValue =
        principal * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
      const totalInvestment = principal * months;
      const expectedReturns = maturityValue - totalInvestment;

      // Generate growth schedule
      const schedule = [];
      let currentValue = 0;

      for (let month = 1; month <= months; month++) {
        // Add this month's investment
        currentValue = currentValue * (1 + rate) + principal;

        // Calculate total invested so far
        const investedAmount = principal * month;

        // Calculate interest earned so far
        const interestEarned = currentValue - investedAmount;

        // Only add yearly entries to keep the table manageable
        if (month % 12 === 0 || month === months) {
          schedule.push({
            year: Math.ceil(month / 12),
            month,
            investedAmount,
            interestEarned,
            totalValue: currentValue,
          });
        }
      }

      setSipResult({
        totalInvestment,
        expectedReturns,
        maturityValue,
        growthSchedule: schedule,
      });

      setSnackbarMessage("SIP calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const downloadSIPDetails = async (format: "png" | "pdf" | "csv" = "png") => {
    setIsDownloading(true);
    setDownloadMenuAnchorEl(null);

    if (!sipResult) {
      setSnackbarMessage("No SIP calculation results to download");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setIsDownloading(false);
      return;
    }

    const timestamp = new Date().toISOString().split("T")[0];

    try {
      if (format === "csv") {
        // Generate CSV format
        await downloadAsCSV(timestamp);
      } else if (format === "pdf") {
        // Generate PDF format
        await downloadAsPDF(timestamp);
      } else {
        // Generate PNG format (enhanced)
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
    if (!sipResult) return;

    try {
      const csvContent = [
        // Header information
        ["SIP CALCULATOR RESULTS"],
        [
          "Generated on",
          new Date().toLocaleDateString() +
            " at " +
            new Date().toLocaleTimeString(),
        ],
        ["Website", window.location.origin],
        [""],
        ["SIP INVESTMENT DETAILS"],
        [
          "Monthly Investment (₹)",
          parseFloat(monthlyInvestment).toLocaleString("en-IN"),
        ],
        ["Expected Annual Return (%)", expectedReturn],
        ["Investment Period (Years)", investmentPeriod],
        [
          "Investment Period (Months)",
          (parseFloat(investmentPeriod) * 12).toString(),
        ],
        [""],
        ["INVESTMENT SUMMARY"],
        ["Total Investment (₹)", sipResult.totalInvestment.toFixed(0)],
        ["Expected Returns (₹)", sipResult.expectedReturns.toFixed(0)],
        ["Maturity Value (₹)", sipResult.maturityValue.toFixed(0)],
        [
          "Returns as % of Investment",
          (
            (sipResult.expectedReturns / sipResult.totalInvestment) *
            100
          ).toFixed(2) + "%",
        ],
        [
          "Wealth Multiplier",
          (sipResult.maturityValue / sipResult.totalInvestment).toFixed(2) +
            "x",
        ],
        [""],
        ["GROWTH SCHEDULE"],
        [
          "Year",
          "Invested Amount (₹)",
          "Interest Earned (₹)",
          "Total Value (₹)",
          "Year-on-Year Growth (%)",
        ],
      ];

      // Add growth schedule data with year-on-year growth calculation
      let previousValue = 0;
      sipResult.growthSchedule.forEach((row, index) => {
        const yoyGrowth =
          index === 0
            ? 0
            : ((row.totalValue - previousValue) / previousValue) * 100;

        csvContent.push([
          row.year.toString(),
          row.investedAmount.toFixed(0),
          row.interestEarned.toFixed(0),
          row.totalValue.toFixed(0),
          index === 0 ? "N/A" : yoyGrowth.toFixed(2) + "%",
        ]);

        previousValue = row.totalValue;
      });

      // Add summary statistics
      csvContent.push(
        [""],
        ["SUMMARY STATISTICS"],
        ["Total Investment Years", sipResult.growthSchedule.length.toString()],
        [
          "Average Annual Investment",
          (parseFloat(monthlyInvestment) * 12).toFixed(0),
        ],
        [
          "Average Annual Returns",
          (sipResult.expectedReturns / parseFloat(investmentPeriod)).toFixed(0),
        ],
        [
          "Compound Annual Growth Rate (CAGR)",
          (
            Math.pow(
              sipResult.maturityValue / sipResult.totalInvestment,
              1 / parseFloat(investmentPeriod)
            ) -
            1 * 100
          ).toFixed(2) + "%",
        ],
        [
          "Final Year Value",
          sipResult.growthSchedule[
            sipResult.growthSchedule.length - 1
          ]?.totalValue.toFixed(0) || "0",
        ],
        [
          "Power of Compounding",
          "SIP benefits from rupee cost averaging and compound growth",
        ]
      );

      // Convert to CSV string with proper escaping
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

      // Add BOM for proper Excel compatibility
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvString], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `sip_calculation_${timestamp}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      setSnackbarMessage("SIP details downloaded as CSV successfully");
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
    if (!sipResult) return;

    try {
      // Dynamic import for jsPDF
      const { jsPDF } = await import("jspdf");

      // Import autoTable plugin
      try {
        await import("jspdf-autotable");
      } catch (error) {
        console.warn("jsPDF autoTable not available, using basic table");
      }

      const doc = new jsPDF();
      let currentY = 20;

      // Header with logo area
      doc.setFillColor(25, 118, 210); // Primary blue
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("SIP Calculator Results", 20, 25);

      // Reset color and add generation info
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      currentY = 45;
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        20,
        currentY
      );
      doc.text(`Website: ${window.location.origin}`, 20, currentY + 5);

      currentY += 20;

      // SIP Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SIP Investment Details", 20, currentY);

      // Add underline
      doc.setLineWidth(0.5);
      doc.setDrawColor(25, 118, 210);
      doc.line(20, currentY + 2, 100, currentY + 2);

      currentY += 15;

      // SIP details in a structured format
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      const sipDetailsData = [
        [
          "Monthly Investment:",
          `Rs. ${parseFloat(monthlyInvestment).toLocaleString("en-IN")}`,
        ],
        ["Expected Annual Return:", `${expectedReturn}% per annum`],
        [
          "Investment Period:",
          `${investmentPeriod} years (${
            parseFloat(investmentPeriod) * 12
          } months)`,
        ],
        [
          "Total Investment:",
          `Rs. ${sipResult.totalInvestment.toLocaleString("en-IN")}`,
        ],
      ];

      sipDetailsData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, currentY + index * 8);
        doc.setFont("helvetica", "normal");
        doc.text(value, 90, currentY + index * 8);
      });

      currentY += 45;

      // Investment Summary Section
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Summary", 20, currentY);

      // Add underline
      doc.line(20, currentY + 2, 95, currentY + 2);
      currentY += 15;

      // Summary in boxes
      const summaryBoxes = [
        {
          label: "Maturity Value",
          value: `Rs. ${sipResult.maturityValue.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [25, 118, 210],
        },
        {
          label: "Total Investment",
          value: `Rs. ${sipResult.totalInvestment.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [156, 39, 176],
        },
        {
          label: "Expected Returns",
          value: `Rs. ${sipResult.expectedReturns.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [76, 175, 80],
        },
      ];

      summaryBoxes.forEach((box, index) => {
        const x = 20 + index * 60;
        const y = currentY;

        // Draw box
        doc.setFillColor(box.color[0], box.color[1], box.color[2]);
        doc.roundedRect(x, y, 55, 25, 3, 3, "F");

        // Add text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(box.label, x + 3, y + 8);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        // Split long values into multiple lines if needed
        const lines = doc.splitTextToSize(box.value, 50);
        doc.text(lines, x + 3, y + 15);
      });

      currentY += 40;

      // Growth Schedule
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Growth Schedule", 20, currentY);

      doc.line(20, currentY + 2, 120, currentY + 2);
      currentY += 10;

      // Prepare table data
      const tableHeaders = [
        "Year",
        "Invested (Rs.)",
        "Interest (Rs.)",
        "Total Value (Rs.)",
      ];
      const tableData = sipResult.growthSchedule.map((row) => [
        row.year.toString(),
        row.investedAmount.toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        }),
        row.interestEarned.toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        }),
        row.totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
      ]);

      if (typeof (doc as any).autoTable === "function") {
        // Use autoTable if available
        (doc as any).autoTable({
          head: [tableHeaders],
          body: tableData,
          startY: currentY,
          theme: "striped",
          headStyles: {
            fillColor: [25, 118, 210],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
          bodyStyles: {
            fontSize: 8,
            cellPadding: 3,
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          columnStyles: {
            0: { halign: "center", cellWidth: 20 },
            1: { halign: "right", cellWidth: 45 },
            2: { halign: "right", cellWidth: 45 },
            3: { halign: "right", cellWidth: 50 },
          },
          margin: { left: 20, right: 20 },
          pageBreak: "auto",
          showHead: "everyPage",
        });
      } else {
        // Fallback to basic table
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");

        // Table headers
        const colWidths = [20, 45, 45, 50];
        const colPositions = [20, 40, 85, 130];

        // Header background
        doc.setFillColor(25, 118, 210);
        doc.rect(20, currentY, 160, 8, "F");

        doc.setTextColor(255, 255, 255);
        tableHeaders.forEach((header, index) => {
          doc.text(header, colPositions[index] + 2, currentY + 6);
        });

        currentY += 12;
        doc.setTextColor(40, 40, 40);
        doc.setFont("helvetica", "normal");

        // Table rows
        tableData.forEach((row, rowIndex) => {
          if (currentY > 270) {
            doc.addPage();
            currentY = 20;
          }

          // Alternate row colors
          if (rowIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, currentY - 2, 160, 8, "F");
          }

          row.forEach((cell, colIndex) => {
            const x =
              colPositions[colIndex] +
              (colIndex === 0 ? 8 : colWidths[colIndex] - 2);
            const align = colIndex === 0 ? "center" : "right";

            if (align === "right") {
              const textWidth = doc.getTextWidth(cell);
              doc.text(cell, x - textWidth, currentY + 4);
            } else {
              doc.text(cell, x, currentY + 4);
            }
          });

          currentY += 8;
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated by KodeKit SIP Calculator`, 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      // Save the PDF
      doc.save(`sip_calculation_${timestamp}.pdf`);

      setSnackbarMessage("SIP details downloaded as PDF successfully");
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
    if (!resultsRef.current || !sipResult) return;

    // Create an enhanced version for PNG download
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
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #1976d2; padding-bottom: 20px;">
        <h1 style="color: #1976d2; margin: 0; font-size: 28px;">SIP Calculator Results</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #1976d2; padding-left: 10px;">SIP Investment Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div><strong>Monthly Investment:</strong> Rs. ${parseFloat(
            monthlyInvestment
          ).toLocaleString("en-IN")}</div>
          <div><strong>Expected Annual Return:</strong> ${expectedReturn}%</div>
          <div><strong>Investment Period:</strong> ${investmentPeriod} years</div>
          <div><strong>Total Investment:</strong> Rs. ${sipResult.totalInvestment.toLocaleString(
            "en-IN"
          )}</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #1976d2; padding-left: 10px;">Investment Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
            <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Rs. ${sipResult.maturityValue.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Maturity Value</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f3e5f5; border-radius: 8px; border: 2px solid #9c27b0;">
            <div style="font-size: 18px; font-weight: bold; color: #9c27b0;">Rs. ${sipResult.totalInvestment.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Investment</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 8px; border: 2px solid #4caf50;">
            <div style="font-size: 18px; font-weight: bold; color: #4caf50;">Rs. ${sipResult.expectedReturns.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Expected Returns</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #1976d2; padding-left: 10px;">Investment Growth Schedule</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #1976d2; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Year</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Invested (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Interest (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Total Value (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${sipResult.growthSchedule
              .map(
                (row, index) => `
              <tr style="background: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  row.year
                }</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Rs. ${row.investedAmount.toFixed(
                  0
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #4caf50;">Rs. ${row.interestEarned.toFixed(
                  0
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Rs. ${row.totalValue.toFixed(
                  0
                )}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 20px;">
        Generated by KodeKit SIP Calculator | ${window.location.href}
      </div>
    `;

    // Temporarily add to document for capturing
    enhancedContent.style.position = "absolute";
    enhancedContent.style.left = "-9999px";
    enhancedContent.style.top = "0";
    document.body.appendChild(enhancedContent);

    try {
      const canvas = await html2canvas(enhancedContent, {
        width: 800,
        height: enhancedContent.scrollHeight,
        scale: 2, // Higher resolution
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `sip_calculation_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("SIP details downloaded as PNG successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } finally {
      document.body.removeChild(enhancedContent);
    }
  };

  const handleReset = () => {
    setMonthlyInvestment("");
    setExpectedReturn("");
    setInvestmentPeriod("");
    setSipResult(null);
    setActiveTab(0);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!sipResult) return;

    const resultsText = `
SIP Summary:
Monthly Investment: Rs. ${parseFloat(monthlyInvestment).toFixed(2)}
Expected Annual Return: ${expectedReturn}%
Investment Period: ${investmentPeriod} years
Total Investment: Rs. ${sipResult.totalInvestment.toFixed(2)}
Expected Returns: Rs. ${sipResult.expectedReturns.toFixed(2)}
Maturity Value: Rs. ${sipResult.maturityValue.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("SIP summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
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
        <SEOHelmet
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          image={seoData.image}
          type={seoData.type}
        />

        {/* Structured Data */}
        <Helmet>
          <script type="application/ld+json">
            {JSON.stringify(webAppData)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(howToData)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbData)}
          </script>
        </Helmet>

        <Breadcrumb items={breadcrumbItems} />

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
              SIP Calculator - Systematic Investment Plan Calculator
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
              Calculate your Systematic Investment Plan returns, maturity value,
              and wealth growth projections. Plan your financial future with
              accurate SIP calculations and investment schedules.
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
                aria-labelledby="sip-calculator-form"
              >
                <Typography
                  id="sip-calculator-form"
                  variant="h3"
                  component="h3"
                  gutterBottom
                  fontWeight={600}
                  mb={2}
                  sx={{ fontSize: "1.5rem" }}
                >
                  SIP Investment Details
                </Typography>

                <Grid
                  container
                  spacing={3}
                  component="form"
                  role="form"
                  aria-label="SIP calculation form"
                >
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="monthly-investment"
                      label="Monthly Investment (Rs.)"
                      type="number"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(e.target.value)}
                      required
                      aria-describedby="monthly-investment-help"
                      inputProps={{
                        min: 500,
                        step: 100,
                        "aria-label": "Monthly investment amount in rupees",
                        "aria-required": "true",
                      }}
                      helperText="Enter the amount you want to invest monthly (minimum Rs. 500)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="expected-return"
                      label="Expected Annual Return (%)"
                      type="number"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                      required
                      aria-describedby="expected-return-help"
                      inputProps={{
                        min: 1,
                        max: 30,
                        step: 0.1,
                        "aria-label": "Expected annual return percentage",
                        "aria-required": "true",
                      }}
                      helperText="Expected annual return rate (typically 8-15% for equity mutual funds)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="investment-period"
                      label="Investment Period (Years)"
                      type="number"
                      value={investmentPeriod}
                      onChange={(e) => setInvestmentPeriod(e.target.value)}
                      required
                      aria-describedby="investment-period-help"
                      inputProps={{
                        min: 1,
                        max: 50,
                        step: 1,
                        "aria-label": "Investment period in years",
                        "aria-required": "true",
                      }}
                      helperText="Duration of your SIP investment (recommended: 5+ years for better returns)"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={calculateSIP}
                        disabled={
                          !monthlyInvestment ||
                          !expectedReturn ||
                          !investmentPeriod
                        }
                        startIcon={<Calculator size={18} />}
                        size="large"
                        aria-describedby="calculate-button-help"
                        sx={{
                          flex: 1,
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                        }}
                      >
                        Calculate SIP Returns
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        startIcon={<RefreshCw size={18} />}
                        size="large"
                        aria-label="Reset all form fields"
                        sx={{
                          py: 1.5,
                          minWidth: { xs: "auto", sm: "120px" },
                        }}
                      >
                        Reset
                      </Button>
                    </Box>
                    <Typography
                      id="calculate-button-help"
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Click to calculate your SIP maturity value, returns, and
                      investment growth schedule
                    </Typography>
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
                }}
                component="section"
                aria-labelledby="sip-results"
                role="region"
              >
                {sipResult ? (
                  <Box ref={resultsRef} role="region" aria-live="polite">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography
                        id="sip-results"
                        variant="h3"
                        component="h3"
                        gutterBottom
                        fontWeight={600}
                        sx={{ fontSize: "1.5rem" }}
                      >
                        Your SIP Investment Summary
                      </Typography>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Tooltip title="Copy results to clipboard">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy SIP results to clipboard"
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
                          >
                            {isDownloading ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Download size={16} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: theme.palette.background.default,
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h4"
                              component="h4"
                              color="text.secondary"
                              sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
                            >
                              Total Maturity Value
                            </Typography>
                            <Typography
                              variant="h3"
                              component="div"
                              color="primary"
                              sx={{
                                fontSize: { xs: "2rem", sm: "2.5rem" },
                                fontWeight: 700,
                              }}
                              aria-label={`Maturity value is ${sipResult.maturityValue.toFixed(
                                2
                              )} rupees`}
                            >
                              Rs.{" "}
                              {sipResult.maturityValue.toLocaleString("en-IN", {
                                maximumFractionDigits: 2,
                              })}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: theme.palette.background.default,
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h5"
                              component="h5"
                              color="text.secondary"
                              sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
                            >
                              Total Investment
                            </Typography>
                            <Typography
                              variant="h4"
                              component="div"
                              sx={{
                                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                                fontWeight: 600,
                              }}
                              aria-label={`Total investment is ${sipResult.totalInvestment.toFixed(
                                2
                              )} rupees`}
                            >
                              Rs.{" "}
                              {sipResult.totalInvestment.toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 2 }
                              )}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: theme.palette.background.default,
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="h5"
                              component="h5"
                              color="text.secondary"
                              sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
                            >
                              Expected Returns
                            </Typography>
                            <Typography
                              variant="h4"
                              component="div"
                              color="success.main"
                              sx={{
                                fontSize: { xs: "1.5rem", sm: "1.75rem" },
                                fontWeight: 600,
                              }}
                              aria-label={`Expected returns are ${sipResult.expectedReturns.toFixed(
                                2
                              )} rupees`}
                            >
                              Rs.{" "}
                              {sipResult.expectedReturns.toLocaleString(
                                "en-IN",
                                { maximumFractionDigits: 2 }
                              )}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ width: "100%", mb: 2 }}>
                      <Typography
                        variant="h4"
                        component="h4"
                        gutterBottom
                        sx={{ fontSize: "1.25rem", fontWeight: 600, mb: 2 }}
                      >
                        Investment Growth Schedule
                      </Typography>
                      <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        aria-label="Investment growth schedule tabs"
                      >
                        <Tab
                          label="Growth Schedule"
                          id="growth-tab-0"
                          aria-controls="growth-tabpanel-0"
                        />
                      </Tabs>
                    </Box>

                    <Box
                      role="tabpanel"
                      id="growth-tabpanel-0"
                      aria-labelledby="growth-tab-0"
                    >
                      <TableContainer
                        sx={{ maxHeight: 300, overflow: "auto" }}
                        component={Paper}
                        elevation={0}
                      >
                        <Table
                          size="small"
                          stickyHeader
                          aria-label="SIP investment growth schedule"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  Year
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  Invested Amount
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  Interest Earned
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  Total Value
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {sipResult.growthSchedule.map((row, index) => (
                              <TableRow
                                key={row.month}
                                sx={{
                                  "&:nth-of-type(odd)": {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                }}
                              >
                                <TableCell>
                                  <Typography variant="body2" fontWeight={500}>
                                    {row.year}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2">
                                    Rs.{" "}
                                    {row.investedAmount.toLocaleString(
                                      "en-IN",
                                      { maximumFractionDigits: 2 }
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography
                                    variant="body2"
                                    color="success.main"
                                  >
                                    Rs.{" "}
                                    {row.interestEarned.toLocaleString(
                                      "en-IN",
                                      { maximumFractionDigits: 2 }
                                    )}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right">
                                  <Typography variant="body2" fontWeight={600}>
                                    Rs.{" "}
                                    {row.totalValue.toLocaleString("en-IN", {
                                      maximumFractionDigits: 2,
                                    })}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
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
                    role="region"
                    aria-live="polite"
                  >
                    <Typography
                      id="sip-results"
                      variant="h3"
                      component="h3"
                      gutterBottom
                      sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 3 }}
                    >
                      SIP Calculator Ready
                    </Typography>

                    <Calculator
                      size={48}
                      color={theme.palette.text.secondary}
                      aria-hidden="true"
                    />
                    <Typography
                      variant="h4"
                      component="h4"
                      sx={{
                        mt: 2,
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        fontWeight: 600,
                        textAlign: "center",
                      }}
                    >
                      Enter investment details to see SIP returns
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        textAlign: "center",
                        maxWidth: "400px",
                        lineHeight: 1.6,
                      }}
                    >
                      Get detailed projections of your systematic investment
                      plan including maturity value, total returns, and
                      year-wise growth schedule.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          <AdSense adSlot="6613251015" />

          {/* Key Features Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mt: 4,
            }}
            component="section"
            aria-labelledby="key-features"
          >
            <Typography
              id="key-features"
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.75rem", mb: 3 }}
            >
              Key Features of Our SIP Calculator
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Calculator size={40} color={theme.palette.primary.main} />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Accurate SIP Calculations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Uses precise compound interest formulas to calculate your
                      SIP maturity value and returns.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <TrendingUp size={40} color={theme.palette.success.main} />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Growth Schedule
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detailed year-wise breakdown showing investment growth and
                      compound interest accumulation.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Target size={40} color={theme.palette.warning.main} />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Goal Planning
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Plan your financial goals by adjusting investment amount,
                      duration, and expected returns.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Download size={40} color={theme.palette.info.main} />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Export Results
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Download your SIP calculation results as images or copy to
                      clipboard for sharing.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <PieChart size={40} color={theme.palette.secondary.main} />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Visual Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clear visualization of investment vs returns with detailed
                      breakdown tables.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <CheckCircle size={40} color={theme.palette.error.main} />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Free & Secure
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completely free to use with no registration required. Your
                      data stays private and secure.
                    </Typography>
                  </CardContent>
                </Card>
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
            component="section"
            aria-labelledby="about-sip"
          >
            <Typography
              id="about-sip"
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.75rem" }}
            >
              About Systematic Investment Plans (SIP)
            </Typography>
            <Typography paragraph>
              A Systematic Investment Plan (SIP) is a disciplined approach to
              investing where you contribute a fixed amount at regular
              intervals, typically monthly, into mutual funds or other
              investment vehicles. This strategy helps in building wealth over
              time through the power of compounding and rupee cost averaging.
            </Typography>

            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  component="h4"
                  gutterBottom
                  fontWeight={600}
                  sx={{ fontSize: "1.25rem" }}
                >
                  How SIP Calculations Work
                </Typography>
                <Typography paragraph>
                  SIP calculations use the power of compounding to grow your
                  investments over time. The formula M × [(1 + r)^n - 1] / r ×
                  (1 + r) accounts for regular contributions and compound
                  interest, showing how small, consistent investments can lead
                  to significant wealth accumulation.
                </Typography>
                <Typography paragraph>
                  The growth schedule shows how your investment grows year by
                  year, with both your contributed amount and the interest
                  earned. This helps you visualize the long-term benefits of
                  systematic investing and the power of starting early.
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  component="h4"
                  gutterBottom
                  fontWeight={600}
                  sx={{ fontSize: "1.25rem" }}
                >
                  Benefits of SIP Investing
                </Typography>
                <List sx={{ pl: 0 }}>
                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <CheckCircle
                        size={20}
                        color={theme.palette.success.main}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Rupee Cost Averaging
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          By investing a fixed amount regularly, you buy more
                          units when prices are low and fewer when prices are
                          high, reducing market volatility impact.
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <TrendingUp
                        size={20}
                        color={theme.palette.primary.main}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Power of Compounding
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          The earlier you start, the more time your money has to
                          grow through compounding returns, exponentially
                          increasing wealth.
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Target size={20} color={theme.palette.warning.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Disciplined Investing
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          SIPs instill financial discipline by committing to
                          regular investments regardless of market conditions.
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <DollarSign size={20} color={theme.palette.info.main} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Flexibility & Affordability
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Start with small amounts (as low as Rs. 500) and
                          increase your investment as your income grows.
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          </Paper>

          {/* FAQ Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mt: 4,
            }}
            component="section"
            aria-labelledby="faq-section"
          >
            <Typography
              id="faq-section"
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.75rem", mb: 3 }}
            >
              Frequently Asked Questions (FAQ)
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    What is a SIP and how does it work?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    SIP (Systematic Investment Plan) is a disciplined investment
                    approach where you invest a fixed amount regularly (usually
                    monthly) in mutual funds. It works through rupee cost
                    averaging and compounding, helping you build wealth over
                    time regardless of market volatility.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    How is SIP return calculated?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    SIP returns are calculated using the compound interest
                    formula: M × [(1 + r)^n - 1] / r × (1 + r), where M is
                    monthly investment, r is monthly return rate, and n is
                    number of months. This accounts for regular investments and
                    compounding growth.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    What is the minimum amount to start SIP?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Most mutual funds allow SIP investments starting from Rs.
                    500 per month. However, some funds may have higher minimum
                    amounts. It's recommended to start with an amount you can
                    consistently invest without financial strain.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    Can I change my SIP amount later?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Yes, most SIPs offer flexibility to increase, decrease, or
                    pause your investments. You can typically modify your SIP
                    amount through your fund house or investment platform,
                    subject to minimum investment requirements.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    What is the ideal SIP duration?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    SIPs work best over longer periods (5+ years) due to the
                    power of compounding and rupee cost averaging. For equity
                    mutual funds, a minimum 5-7 year investment horizon is
                    recommended to ride out market volatility and achieve better
                    returns.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    What returns can I expect from SIP?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    SIP returns depend on the underlying mutual fund
                    performance. Historically, equity mutual funds have
                    delivered 10-15% annual returns over long periods, while
                    debt funds typically provide 6-9% returns. Past performance
                    doesn't guarantee future results.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    Can I stop SIP anytime?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Yes, SIPs offer complete flexibility. You can stop, pause,
                    or modify your SIP anytime without penalties. However,
                    stopping early may impact your long-term wealth creation
                    goals, so it's advisable to continue for the planned
                    duration.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    Is this SIP calculator accurate?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    This calculator provides accurate projections based on the
                    inputs provided and standard compound interest formulas.
                    However, actual returns may vary due to market conditions,
                    fund performance, and other factors. Use it as a planning
                    tool rather than a guarantee.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* How to Use Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mt: 4,
            }}
            component="section"
            aria-labelledby="how-to-use"
          >
            <Typography
              id="how-to-use"
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.75rem", mb: 3 }}
            >
              How to Use the SIP Calculator
            </Typography>

            <List sx={{ pl: 0 }}>
              <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    1
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="h4" fontWeight={600}>
                      Enter Monthly Investment Amount
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Input the amount you want to invest monthly in your SIP
                      (minimum Rs. 500 recommended).
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    2
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="h4" fontWeight={600}>
                      Set Expected Annual Return
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Enter the expected annual return rate (typically 8-15% for
                      equity mutual funds, 6-9% for debt funds).
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    3
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="h4" fontWeight={600}>
                      Choose Investment Period
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Select the duration for your SIP investment (recommended:
                      5+ years for better returns).
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    4
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="h4" fontWeight={600}>
                      Calculate and Analyze Results
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Click "Calculate SIP Returns" to get detailed projections
                      including maturity value, total investment, returns, and
                      growth schedule.
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Alert severity="info" sx={{ mt: 3 }} role="note">
              <Typography variant="body2">
                <strong>Investment Disclaimer:</strong> SIP calculations are
                based on assumed returns and may not reflect actual market
                performance. Mutual fund investments are subject to market
                risks. Please read all scheme-related documents carefully before
                investing.
              </Typography>
            </Alert>
          </Paper>
        </motion.div>

        {/* Download Menu */}
        <Menu
          anchorEl={downloadMenuAnchorEl}
          open={Boolean(downloadMenuAnchorEl)}
          onClose={() => setDownloadMenuAnchorEl(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MuiMenuItem
            onClick={() => downloadSIPDetails("png")}
            disabled={isDownloading}
          >
            <ListItemIcon>
              {isDownloading ? (
                <CircularProgress size={16} />
              ) : (
                <Download size={16} />
              )}
            </ListItemIcon>
            <ListItemText>
              {isDownloading ? "Generating PNG..." : "Download as PNG"}
            </ListItemText>
          </MuiMenuItem>
          <MuiMenuItem
            onClick={() => downloadSIPDetails("pdf")}
            disabled={isDownloading}
          >
            <ListItemIcon>
              {isDownloading ? (
                <CircularProgress size={16} />
              ) : (
                <Download size={16} />
              )}
            </ListItemIcon>
            <ListItemText>
              {isDownloading ? "Generating PDF..." : "Download as PDF"}
            </ListItemText>
          </MuiMenuItem>
          <MuiMenuItem
            onClick={() => downloadSIPDetails("csv")}
            disabled={isDownloading}
          >
            <ListItemIcon>
              {isDownloading ? (
                <CircularProgress size={16} />
              ) : (
                <Download size={16} />
              )}
            </ListItemIcon>
            <ListItemText>
              {isDownloading ? "Generating CSV..." : "Download as CSV"}
            </ListItemText>
          </MuiMenuItem>
        </Menu>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          aria-live="polite"
          role="status"
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default SIPCalculator;
