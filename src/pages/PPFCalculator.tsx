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
  Wallet,
  Shield,
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

interface PPFResult {
  totalInvestment: number;
  maturityAmount: number;
  totalInterest: number;
  yearlySchedule: Array<{
    year: number;
    deposit: number;
    interest: number;
    balance: number;
  }>;
}

const PPFCalculator = () => {
  const theme = useTheme();
  const [yearlyDeposit, setYearlyDeposit] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [ppfResult, setPPFResult] = useState<PPFResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // PPF current interest rate (as of 2024)
  const PPF_INTEREST_RATE = 7.1; // 7.1% per annum
  const PPF_TENURE = 15; // 15 years lock-in period

  // Generate SEO data
  const seoData = generateToolSEO(
    "PPF Calculator",
    "Calculate PPF returns, maturity amount, and investment growth with our free Public Provident Fund calculator. Plan your tax-saving investments with accurate projections",
    "finance"
  );

  const webAppData = generateWebAppData(
    "PPF Calculator",
    "Free online PPF calculator to calculate returns on Public Provident Fund investments. Get detailed projections for your tax-saving investments with wealth growth analysis.",
    "finance"
  );

  const howToSteps = [
    {
      name: "Enter Annual Deposit",
      text: "Input your yearly PPF deposit amount (minimum ₹500, maximum ₹1,50,000)",
    },
    {
      name: "Calculate Returns",
      text: "Click 'Calculate PPF' to see maturity amount, total returns, and year-wise growth projections",
    },
    {
      name: "View Growth Schedule",
      text: "Analyze the detailed year-wise breakdown of deposits, interest earned, and account balance",
    },
    {
      name: "Download Results",
      text: "Export your PPF calculation results as PDF, PNG, or CSV for future reference",
    },
  ];

  const howToData = generateHowToData("PPF Calculator", howToSteps);

  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Finance Tools", url: "https://kodekit.in/category/finance" },
    { name: "PPF Calculator", url: "https://kodekit.in/tools/ppf-calculator" },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Finance Tools", url: "/category/finance" },
    { name: "PPF Calculator" },
  ];

  const calculatePPF = () => {
    const deposit = parseFloat(yearlyDeposit);
    const interestRate = PPF_INTEREST_RATE / 100;

    if (deposit >= 500 && deposit <= 150000) {
      let totalInvestment = 0;
      let balance = 0;
      const schedule = [];

      // Calculate year by year for 15 years
      for (let year = 1; year <= PPF_TENURE; year++) {
        // Add yearly deposit
        totalInvestment += deposit;
        balance += deposit;

        // Calculate interest on the balance
        const interest = balance * interestRate;
        balance += interest;

        schedule.push({
          year,
          deposit,
          interest,
          balance,
        });
      }

      const maturityAmount = balance;
      const totalInterest = maturityAmount - totalInvestment;

      setPPFResult({
        totalInvestment,
        maturityAmount,
        totalInterest,
        yearlySchedule: schedule,
      });

      setSnackbarMessage("PPF calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please enter valid deposit amount (₹500-₹1,50,000)");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadPPFDetails = async (format: "png" | "pdf" | "csv" = "png") => {
    setIsDownloading(true);
    setDownloadMenuAnchorEl(null);

    if (!ppfResult) {
      setSnackbarMessage("No PPF calculation results to download");
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
    if (!ppfResult) return;

    try {
      const csvContent = [
        ["PUBLIC PROVIDENT FUND CALCULATOR RESULTS"],
        [
          "Generated on",
          new Date().toLocaleDateString() +
            " at " +
            new Date().toLocaleTimeString(),
        ],
        ["Website", "www.KodeKit.in"],
        [""],
        ["PPF INVESTMENT DETAILS"],
        [
          "Annual Deposit (₹)",
          parseFloat(yearlyDeposit).toLocaleString("en-IN"),
        ],
        ["Interest Rate (%)", PPF_INTEREST_RATE.toString()],
        ["Investment Period", PPF_TENURE.toString() + " years"],
        [""],
        ["INVESTMENT SUMMARY"],
        ["Total Investment (₹)", ppfResult.totalInvestment.toFixed(0)],
        ["Total Interest (₹)", ppfResult.totalInterest.toFixed(0)],
        ["Maturity Amount (₹)", ppfResult.maturityAmount.toFixed(0)],
        [
          "Returns as % of Investment",
          ((ppfResult.totalInterest / ppfResult.totalInvestment) * 100).toFixed(
            2
          ) + "%",
        ],
        [""],
        ["YEAR-WISE GROWTH SCHEDULE"],
        [
          "Year",
          "Annual Deposit (₹)",
          "Interest Earned (₹)",
          "Account Balance (₹)",
        ],
      ];

      ppfResult.yearlySchedule.forEach((row) => {
        csvContent.push([
          row.year.toString(),
          row.deposit.toFixed(0),
          row.interest.toFixed(0),
          row.balance.toFixed(0),
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
      link.download = `ppf_calculation_${timestamp}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      setSnackbarMessage("PPF details downloaded as CSV successfully");
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
    if (!ppfResult) return;

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
      doc.setFillColor(76, 175, 80); // Green color for PPF
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Public Provident Fund Calculator", 20, 25);

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

      // PPF Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("PPF Investment Details", 20, currentY);

      doc.setLineWidth(0.5);
      doc.setDrawColor(76, 175, 80);
      doc.line(20, currentY + 2, 100, currentY + 2);

      currentY += 15;

      const ppfDetailsData = [
        [
          "Annual Deposit:",
          `Rs. ${parseFloat(yearlyDeposit).toLocaleString("en-IN")}`,
        ],
        ["Interest Rate:", `${PPF_INTEREST_RATE}% per annum`],
        ["Investment Period:", `${PPF_TENURE} years`],
        [
          "Total Investment:",
          `Rs. ${ppfResult.totalInvestment.toLocaleString("en-IN")}`,
        ],
      ];

      doc.setFontSize(11);
      ppfDetailsData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, currentY + index * 8);
        doc.setFont("helvetica", "normal");
        doc.text(value, 90, currentY + index * 8);
      });

      currentY += 40;

      // Investment Summary
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Summary", 20, currentY);
      doc.line(20, currentY + 2, 95, currentY + 2);
      currentY += 15;

      const summaryBoxes = [
        {
          label: "Maturity Amount",
          value: `Rs. ${ppfResult.maturityAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [76, 175, 80],
        },
        {
          label: "Total Investment",
          value: `Rs. ${ppfResult.totalInvestment.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [156, 39, 176],
        },
        {
          label: "Total Interest",
          value: `Rs. ${ppfResult.totalInterest.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [255, 152, 0],
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
        "Deposit (Rs.)",
        "Interest (Rs.)",
        "Balance (Rs.)",
      ];
      const tableData = ppfResult.yearlySchedule.map((row) => [
        row.year.toString(),
        row.deposit.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.interest.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.balance.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
      ]);

      if (typeof (doc as any).autoTable === "function") {
        (doc as any).autoTable({
          head: [tableHeaders],
          body: tableData,
          startY: currentY,
          theme: "striped",
          headStyles: {
            fillColor: [76, 175, 80],
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
        doc.setFillColor(76, 175, 80);
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
            doc.setFillColor(76, 175, 80);
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
        doc.text(`Generated by www.KodeKit.in PPF Calculator`, 20, 285);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      doc.save(`ppf_calculation_${timestamp}.pdf`);

      setSnackbarMessage("PPF details downloaded as PDF successfully");
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
    if (!resultsRef.current || !ppfResult) return;

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
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #4caf50; padding-bottom: 20px;">
        <h1 style="color: #4caf50; margin: 0; font-size: 28px;">Public Provident Fund Calculator</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #4caf50; padding-left: 10px;">PPF Investment Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div><strong>Annual Deposit:</strong> Rs. ${parseFloat(
            yearlyDeposit
          ).toLocaleString("en-IN")}</div>
          <div><strong>Interest Rate:</strong> ${PPF_INTEREST_RATE}%</div>
          <div><strong>Investment Period:</strong> ${PPF_TENURE} years</div>
          <div><strong>Total Investment:</strong> Rs. ${ppfResult.totalInvestment.toLocaleString(
            "en-IN"
          )}</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #4caf50; padding-left: 10px;">Investment Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 8px; border: 2px solid #4caf50;">
            <div style="font-size: 24px; font-weight: bold; color: #4caf50;">Rs. ${ppfResult.maturityAmount.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Maturity Amount</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f3e5f5; border-radius: 8px; border: 2px solid #9c27b0;">
            <div style="font-size: 18px; font-weight: bold; color: #9c27b0;">Rs. ${ppfResult.totalInvestment.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Investment</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 8px; border: 2px solid #ff9800;">
            <div style="font-size: 18px; font-weight: bold; color: #ff9800;">Rs. ${ppfResult.totalInterest.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Interest</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #4caf50; padding-left: 10px;">Year-wise Growth Schedule</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #4caf50; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Year</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Deposit (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Interest (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Balance (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${ppfResult.yearlySchedule
              .map(
                (row, index) => `
              <tr style="background: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  row.year
                }</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Rs. ${row.deposit.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #4caf50;">Rs. ${row.interest.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; font-weight: bold;">Rs. ${row.balance.toLocaleString(
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
        <span style="color: #000; font-weight: 900;">Generated by www.KodeKit.in PPF Calculator</span> | <span style="color: #666;">${
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
      link.download = `ppf_calculation_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("PPF details downloaded as PNG successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } finally {
      document.body.removeChild(enhancedContent);
    }
  };

  const handleReset = () => {
    setYearlyDeposit("");
    setPPFResult(null);
    setActiveTab(0);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!ppfResult) return;

    const resultsText = `
PPF Summary:
Annual Deposit: Rs. ${parseFloat(yearlyDeposit).toFixed(2)}
Interest Rate: ${PPF_INTEREST_RATE}%
Investment Period: ${PPF_TENURE} years
Total Investment: Rs. ${ppfResult.totalInvestment.toFixed(2)}
Total Interest: Rs. ${ppfResult.totalInterest.toFixed(2)}
Maturity Amount: Rs. ${ppfResult.maturityAmount.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("PPF summary copied to clipboard");
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
        <SEOHelmet
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          image={seoData.image}
          type={seoData.type}
        />

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
              PPF Calculator - Public Provident Fund Calculator
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
              Calculate your Public Provident Fund returns, maturity amount, and
              investment growth projections. Plan your tax-saving investments
              with accurate PPF calculations and investment schedules.
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
                  <Wallet
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
                    PPF Calculator
                  </Typography>
                </Box>

                <Box component="form" noValidate autoComplete="off">
                  <TextField
                    fullWidth
                    label="Annual Deposit Amount (₹)"
                    variant="outlined"
                    value={yearlyDeposit}
                    onChange={(e) => setYearlyDeposit(e.target.value)}
                    type="number"
                    inputProps={{
                      min: 500,
                      max: 150000,
                      step: 500,
                      "aria-describedby": "deposit-helper-text",
                    }}
                    helperText="Minimum ₹500, Maximum ₹1,50,000 per year"
                    id="deposit-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Current Interest Rate: {PPF_INTEREST_RATE}% per annum
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Investment Period: {PPF_TENURE} years (Lock-in period)
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={calculatePPF}
                      startIcon={<Calculator size={20} />}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                      disabled={!yearlyDeposit}
                    >
                      Calculate PPF
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={!yearlyDeposit}
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
                </Box>

                {/* PPF Benefits */}
                <Card
                  sx={{ mt: 3, backgroundColor: "rgba(76, 175, 80, 0.05)" }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Shield
                        size={20}
                        style={{ marginRight: 8, color: "#4caf50" }}
                      />
                      PPF Benefits
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tax benefits under Section 80C"
                          secondary="Up to ₹1.5 lakh deduction"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tax-free maturity amount"
                          secondary="No tax on interest earned"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Government-backed scheme"
                          secondary="Guaranteed returns with safety"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Loan facility available"
                          secondary="From 3rd year onwards"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              {ppfResult ? (
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
                        PPF Results
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Copy results">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy PPF results to clipboard"
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
                            aria-label="Download PPF results"
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
                      <MuiMenuItem onClick={() => downloadPPFDetails("png")}>
                        Download as PNG
                      </MuiMenuItem>
                      <MuiMenuItem onClick={() => downloadPPFDetails("pdf")}>
                        Download as PDF
                      </MuiMenuItem>
                      <MuiMenuItem onClick={() => downloadPPFDetails("csv")}>
                        Download as CSV
                      </MuiMenuItem>
                    </Menu>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
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
                            <Target size={32} style={{ marginBottom: 8 }} />
                            <Typography
                              variant="h4"
                              component="div"
                              fontWeight={700}
                            >
                              ₹
                              {ppfResult.maturityAmount.toLocaleString(
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
                            <Wallet size={32} style={{ marginBottom: 8 }} />
                            <Typography
                              variant="h5"
                              component="div"
                              fontWeight={600}
                            >
                              ₹
                              {ppfResult.totalInvestment.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Total Investment
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
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
                              {ppfResult.totalInterest.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Total Interest
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      sx={{ mb: 3 }}
                      aria-label="PPF results tabs"
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
                          aria-label="PPF growth schedule"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Year</TableCell>
                              <TableCell align="right">Deposit (₹)</TableCell>
                              <TableCell align="right">Interest (₹)</TableCell>
                              <TableCell align="right">Balance (₹)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {ppfResult.yearlySchedule.map((row) => (
                              <TableRow key={row.year}>
                                <TableCell component="th" scope="row">
                                  {row.year}
                                </TableCell>
                                <TableCell align="right">
                                  {row.deposit.toLocaleString("en-IN", {
                                    maximumFractionDigits: 0,
                                  })}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: "success.main" }}
                                >
                                  {row.interest.toLocaleString("en-IN", {
                                    maximumFractionDigits: 0,
                                  })}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: 600 }}
                                >
                                  {row.balance.toLocaleString("en-IN", {
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
                                    Annual Deposit:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    ₹
                                    {parseFloat(yearlyDeposit).toLocaleString(
                                      "en-IN"
                                    )}
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
                                    Interest Rate:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {PPF_INTEREST_RATE}%
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
                                    {PPF_TENURE} years
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
                                      (ppfResult.totalInterest /
                                        ppfResult.totalInvestment) *
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
                                      ppfResult.maturityAmount /
                                      ppfResult.totalInvestment
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
                                  <Typography variant="body2">
                                    Tax Savings:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    Up to ₹46,800/year
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    Status:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="success.main"
                                  >
                                    Tax-free maturity
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
                    Enter PPF Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in your annual deposit amount to calculate the Public
                    Provident Fund returns and maturity amount.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* AdSense */}
          <AdSense adSlot="6613251015" />

          {/* PPF Information Section */}
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
                About Public Provident Fund (PPF)
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    What is PPF?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Public Provident Fund is a government-backed long-term
                    savings scheme that offers attractive interest rates and tax
                    benefits. It's designed to help individuals build a
                    retirement corpus while saving taxes.
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Key Features
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Minimum deposit: ₹500 per year" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Maximum deposit: ₹1,50,000 per year" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Lock-in period: 15 years" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Current interest rate: 7.1% per annum" />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Eligibility
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Indian resident individuals" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="One account per individual" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Can open account for minor child" />
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
                      <ListItemText primary="Deduction under Section 80C up to ₹1.5 lakh" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Interest earned is tax-free" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Maturity amount is completely tax-free" />
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

export default PPFCalculator;
