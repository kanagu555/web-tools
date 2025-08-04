import React, { useState, useRef, useEffect } from "react";
import { useSEO } from "../hooks/useSEO";
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
  Baby,
  GraduationCap,
  Heart,
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

interface SSYResult {
  totalInvestment: number;
  maturityAmount: number;
  totalInterest: number;
  maturityYear: number;
  yearlySchedule: Array<{
    year: number;
    deposit: number;
    interest: number;
    balance: number;
  }>;
}

const SSYCalculator = () => {
  const theme = useTheme();
  const [yearlyDeposit, setYearlyDeposit] = useState("");
  const [girlAge, setGirlAge] = useState("");
  const [investmentStartYear, setInvestmentStartYear] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [ssyResult, setSSYResult] = useState<SSYResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // SSY current interest rate (as of 2024)
  const SSY_INTEREST_RATE = 8.2; // 8.2% per annum

  // Generate enhanced SEO data with rich social media metadata
  // Get the correct image URL for both development and production
  const imageUrl = "https://kodekit.in/social/ssy-calculator-kodekit.jpg";

  const seoData = generateToolSEO(
    "Sukanya Samriddhi Yojana Calculator",
    "Calculate SSY returns, maturity amount & investment growth for your daughter's future. Free Sukanya Samriddhi Yojana calculator with detailed projections, tax benefits analysis & year-wise growth schedule. Plan your girl child's education & marriage expenses with India's premier girl child savings scheme",
    "finance",
    {
      emoji: "🌟",
      subtitle: "SSY Calculator Online",
      benefits: [
        "Tax benefits under Section 80C",
        "Tax-free maturity amount",
        "Government-backed scheme",
        "Guaranteed returns",
      ],
      customImage: imageUrl,
    }
  );

  // Use the custom SEO hook for DOM updates
  useSEO({
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    image: seoData.image || imageUrl,
    type: seoData.type || "article",
    url: "https://kodekit.in/tools/ssy-calculator",
  });

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const webAppData = generateWebAppData(
    "Sukanya Samriddhi Yojana Calculator - SSY Calculator",
    "Free online SSY calculator to calculate returns on Sukanya Samriddhi Yojana investments. Get detailed projections for your girl child's future with wealth growth analysis.",
    "finance",
    {
      url: "https://kodekit.in/tools/ssy-calculator",
      features: [
        "Calculate SSY maturity amount",
        "Year-wise growth projections",
        "Tax benefits analysis",
        "Investment timeline tracking",
        "Download detailed reports",
      ],
      applicationCategory: "FinanceApplication",
      customImage: imageUrl,
    }
  );

  const howToSteps = [
    {
      name: "Enter Girl's Age",
      text: "Input your girl child's current age (must be below 10 years)",
    },
    {
      name: "Set Annual Deposit",
      text: "Enter the yearly deposit amount (minimum ₹250, maximum ₹1,50,000)",
    },
    {
      name: "Calculate Returns",
      text: "Click 'Calculate SSY' to see maturity amount, total returns, and year-wise growth projections",
    },
    {
      name: "View Growth Schedule",
      text: "Analyze the detailed year-wise breakdown of deposits, interest earned, and account balance",
    },
  ];

  const howToData = generateHowToData(
    "Sukanya Samriddhi Yojana Calculator",
    howToSteps
  );

  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Finance Tools", url: "https://kodekit.in/category/finance" },
    { name: "SSY Calculator", url: "https://kodekit.in/tools/ssy-calculator" },
  ]);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Finance Tools", url: "/category/finance" },
    { name: "SSY Calculator" },
  ];

  const calculateSSY = () => {
    const deposit = parseFloat(yearlyDeposit);
    const age = parseInt(girlAge);
    const startYear = parseInt(investmentStartYear);
    const interestRate = SSY_INTEREST_RATE / 100;
    const currentYear = new Date().getFullYear();

    if (
      deposit >= 250 &&
      deposit <= 150000 &&
      age >= 0 &&
      age < 10 &&
      startYear >= 2007 &&
      startYear <= currentYear
    ) {
      const depositYears = 15; // Deposits for 15 years
      const maturityYears = 21; // Account matures after 21 years from opening

      let totalInvestment = 0;
      let balance = 0;
      const schedule = [];

      // SSY Calculation: Deposit at beginning of year, interest calculated on full balance
      for (let year = 1; year <= maturityYears; year++) {
        let yearlyDeposit = 0;
        let interest = 0;

        // Deposits are made for first 15 years only
        if (year <= depositYears) {
          yearlyDeposit = deposit;
          totalInvestment += deposit;
          balance += yearlyDeposit; // Add deposit at beginning of year
        }

        // Calculate interest on the full balance (including current year's deposit)
        interest = balance * interestRate;
        balance += interest; // Add interest to balance

        schedule.push({
          year: startYear + year - 1, // Show actual calendar year
          deposit: yearlyDeposit,
          interest,
          balance,
        });
      }

      const maturityAmount = balance;
      const totalInterest = maturityAmount - totalInvestment;
      const maturityYear = startYear + maturityYears - 1;

      setSSYResult({
        totalInvestment,
        maturityAmount,
        totalInterest,
        maturityYear,
        yearlySchedule: schedule,
      });

      setSnackbarMessage("SSY calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(
        "Please enter valid values (Age: 0-9 years, Deposit: ₹250-₹1,50,000, Start Year: 2007-" +
          currentYear +
          ")"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadSSYDetails = async (format: "png" | "pdf" | "csv" = "png") => {
    setIsDownloading(true);
    setDownloadMenuAnchorEl(null);

    if (!ssyResult) {
      setSnackbarMessage("No SSY calculation results to download");
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
    if (!ssyResult) return;

    try {
      const csvContent = [
        ["SUKANYA SAMRIDDHI YOJANA CALCULATOR RESULTS"],
        [
          "Generated on",
          new Date().toLocaleDateString() +
            " at " +
            new Date().toLocaleTimeString(),
        ],
        ["Website", window.location.origin],
        [""],
        ["SSY INVESTMENT DETAILS"],
        ["Girl's Current Age", girlAge + " years"],
        [
          "Annual Deposit (₹)",
          parseFloat(yearlyDeposit).toLocaleString("en-IN"),
        ],
        ["Investment Start Year", investmentStartYear],
        ["Maturity Year", ssyResult.maturityYear.toString()],
        ["Interest Rate (%)", SSY_INTEREST_RATE.toString()],
        ["Deposit Period", "15 years"],
        ["Maturity Period", "21 years"],
        [""],
        ["INVESTMENT SUMMARY"],
        ["Total Investment (₹)", ssyResult.totalInvestment.toFixed(0)],
        ["Total Interest (₹)", ssyResult.totalInterest.toFixed(0)],
        ["Maturity Amount (₹)", ssyResult.maturityAmount.toFixed(0)],
        [
          "Returns as % of Investment",
          ((ssyResult.totalInterest / ssyResult.totalInvestment) * 100).toFixed(
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

      ssyResult.yearlySchedule.forEach((row) => {
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
      link.download = `ssy_calculation_${timestamp}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      setSnackbarMessage("SSY details downloaded as CSV successfully");
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
    if (!ssyResult) return;

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
      doc.setFillColor(233, 30, 99); // Pink color for SSY
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Sukanya Samriddhi Yojana Calculator", 20, 25);

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

      // SSY Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("SSY Investment Details", 20, currentY);

      doc.setLineWidth(0.5);
      doc.setDrawColor(233, 30, 99);
      doc.line(20, currentY + 2, 100, currentY + 2);

      currentY += 15;

      const ssyDetailsData = [
        ["Girl's Current Age:", `${girlAge} years`],
        [
          "Annual Deposit:",
          `Rs. ${parseFloat(yearlyDeposit).toLocaleString("en-IN")}`,
        ],
        ["Investment Start Year:", investmentStartYear],
        ["Maturity Year:", ssyResult.maturityYear.toString()],
        ["Interest Rate:", `${SSY_INTEREST_RATE}% per annum`],
        ["Deposit Period:", "15 years"],
        ["Maturity Period:", "21 years"],
      ];

      doc.setFontSize(11);
      ssyDetailsData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, currentY + index * 8);
        doc.setFont("helvetica", "normal");
        doc.text(value, 90, currentY + index * 8);
      });

      currentY += 70;

      // Investment Summary
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Summary", 20, currentY);
      doc.line(20, currentY + 2, 95, currentY + 2);
      currentY += 15;

      const summaryBoxes = [
        {
          label: "Maturity Amount",
          value: `Rs. ${ssyResult.maturityAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [233, 30, 99],
        },
        {
          label: "Total Investment",
          value: `Rs. ${ssyResult.totalInvestment.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [156, 39, 176],
        },
        {
          label: "Total Interest",
          value: `Rs. ${ssyResult.totalInterest.toLocaleString("en-IN", {
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
        "Deposit (Rs.)",
        "Interest (Rs.)",
        "Balance (Rs.)",
      ];
      const tableData = ssyResult.yearlySchedule.map((row) => [
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
            fillColor: [233, 30, 99],
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
        // Fallback to basic table if autoTable is not available
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");

        // Table headers with better spacing
        const colWidths = [25, 45, 45, 45];
        const colPositions = [20, 45, 90, 135];

        // Header background
        doc.setFillColor(233, 30, 99);
        doc.rect(20, currentY, 160, 10, "F");

        doc.setTextColor(255, 255, 255);
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
        doc.setTextColor(40, 40, 40);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        // Table rows
        tableData.forEach((row, rowIndex) => {
          if (currentY > 270) {
            doc.addPage();
            currentY = 20;

            // Re-add headers on new page
            doc.setFontSize(9);
            doc.setFont("helvetica", "bold");
            doc.setFillColor(233, 30, 99);
            doc.rect(20, currentY, 160, 10, "F");
            doc.setTextColor(255, 255, 255);
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
          if (rowIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, currentY - 2, 160, 10, "F");
          }

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
        doc.setTextColor(40, 40, 40); // Dark black color
        doc.setFont("helvetica", "bold");
        doc.text(`Generated by www.KodeKit.in SSY Calculator`, 20, 285);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      doc.save(`ssy_calculation_${timestamp}.pdf`);

      setSnackbarMessage("SSY details downloaded as PDF successfully");
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
    if (!resultsRef.current || !ssyResult) return;

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
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e91e63; padding-bottom: 20px;">
        <h1 style="color: #e91e63; margin: 0; font-size: 28px;">Sukanya Samriddhi Yojana Calculator</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #e91e63; padding-left: 10px;">SSY Investment Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div><strong>Girl's Age:</strong> ${girlAge} years</div>
          <div><strong>Annual Deposit:</strong> Rs. ${parseFloat(
            yearlyDeposit
          ).toLocaleString("en-IN")}</div>
          <div><strong>Start Year:</strong> ${investmentStartYear}</div>
          <div><strong>Maturity Year:</strong> ${ssyResult.maturityYear}</div>
          <div><strong>Interest Rate:</strong> ${SSY_INTEREST_RATE}%</div>
          <div><strong>Maturity Period:</strong> 21 years</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #e91e63; padding-left: 10px;">Investment Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #fce4ec; border-radius: 8px; border: 2px solid #e91e63;">
            <div style="font-size: 24px; font-weight: bold; color: #e91e63;">Rs. ${ssyResult.maturityAmount.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Maturity Amount</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f3e5f5; border-radius: 8px; border: 2px solid #9c27b0;">
            <div style="font-size: 18px; font-weight: bold; color: #9c27b0;">Rs. ${ssyResult.totalInvestment.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Investment</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 8px; border: 2px solid #4caf50;">
            <div style="font-size: 18px; font-weight: bold; color: #4caf50;">Rs. ${ssyResult.totalInterest.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Interest</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #e91e63; padding-left: 10px;">Year-wise Growth Schedule</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #e91e63; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Year</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Deposit (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Interest (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Balance (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${ssyResult.yearlySchedule
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
        <span style="color: #000; font-weight: 900;">Generated by www.KodeKit.in SSY Calculator</span> | <span style="color: #666;">${
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
        height: enhancedContent.scrollHeight + 100, // Add extra height for table
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
      link.download = `ssy_calculation_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("SSY details downloaded as PNG successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } finally {
      document.body.removeChild(enhancedContent);
    }
  };

  const handleReset = () => {
    setYearlyDeposit("");
    setGirlAge("");
    setInvestmentStartYear("");
    setSSYResult(null);
    setActiveTab(0);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!ssyResult) return;

    const resultsText = `
SSY Summary:
Girl's Age: ${girlAge} years
Annual Deposit: Rs. ${parseFloat(yearlyDeposit).toFixed(2)}
Investment Start Year: ${investmentStartYear}
Maturity Year: ${ssyResult.maturityYear}
Interest Rate: ${SSY_INTEREST_RATE}%
Total Investment: Rs. ${ssyResult.totalInvestment.toFixed(2)}
Total Interest: Rs. ${ssyResult.totalInterest.toFixed(2)}
Maturity Amount: Rs. ${ssyResult.maturityAmount.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("SSY summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <>
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
        canonical="https://kodekit.in/tools/ssy-calculator"
      />

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
              Sukanya Samriddhi Yojana Calculator - SSY Calculator
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
              Calculate your Sukanya Samriddhi Yojana returns, maturity amount,
              and investment growth projections. Plan your girl child's future
              with accurate SSY calculations and investment schedules.
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
                  <Baby
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
                    SSY Calculator
                  </Typography>
                </Box>

                <Box component="form" noValidate autoComplete="off">
                  <TextField
                    fullWidth
                    label="Girl's Current Age (years)"
                    variant="outlined"
                    value={girlAge}
                    onChange={(e) => setGirlAge(e.target.value)}
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 9,
                      step: 1,
                      "aria-describedby": "age-helper-text",
                    }}
                    helperText="Age must be below 10 years to open SSY account"
                    id="age-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Annual Deposit Amount (₹)"
                    variant="outlined"
                    value={yearlyDeposit}
                    onChange={(e) => setYearlyDeposit(e.target.value)}
                    type="number"
                    inputProps={{
                      min: 250,
                      max: 150000,
                      step: 250,
                      "aria-describedby": "deposit-helper-text",
                    }}
                    helperText="Minimum ₹250, Maximum ₹1,50,000 per year"
                    id="deposit-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Investment Start Year"
                    variant="outlined"
                    value={investmentStartYear}
                    onChange={(e) => setInvestmentStartYear(e.target.value)}
                    type="number"
                    inputProps={{
                      min: 2007, // SSY scheme started in 2015, but allowing some buffer
                      max: new Date().getFullYear(),
                      step: 1,
                      "aria-describedby": "start-year-helper-text",
                    }}
                    helperText="Year when you started/plan to start the investment"
                    id="start-year-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Current Interest Rate: {SSY_INTEREST_RATE}% per annum
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Deposit Period: 15 years | Maturity: When girl turns 21
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={calculateSSY}
                      startIcon={<Calculator size={20} />}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                      disabled={
                        !yearlyDeposit || !girlAge || !investmentStartYear
                      }
                    >
                      Calculate SSY
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={
                        !yearlyDeposit && !girlAge && !investmentStartYear
                      }
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

                {/* SSY Benefits */}
                <Card
                  sx={{ mt: 3, backgroundColor: "rgba(233, 30, 99, 0.05)" }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Heart
                        size={20}
                        style={{ marginRight: 8, color: "#e91e63" }}
                      />
                      SSY Benefits
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
                          primary="Guaranteed returns"
                          secondary="Government-backed scheme"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Partial withdrawal allowed"
                          secondary="After girl turns 18"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              {ssyResult ? (
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
                        SSY Results
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Copy results">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy SSY results to clipboard"
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
                            aria-label="Download SSY results"
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
                      <MuiMenuItem onClick={() => downloadSSYDetails("png")}>
                        Download as PNG
                      </MuiMenuItem>
                      <MuiMenuItem onClick={() => downloadSSYDetails("pdf")}>
                        Download as PDF
                      </MuiMenuItem>
                      <MuiMenuItem onClick={() => downloadSSYDetails("csv")}>
                        Download as CSV
                      </MuiMenuItem>
                    </Menu>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={4}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #e91e63 0%, #ad1457 100%)",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <CardContent>
                            <GraduationCap
                              size={32}
                              style={{ marginBottom: 8 }}
                            />
                            <Typography
                              variant="h4"
                              component="div"
                              fontWeight={700}
                            >
                              ₹
                              {ssyResult.maturityAmount.toLocaleString(
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
                            <Target size={32} style={{ marginBottom: 8 }} />
                            <Typography
                              variant="h5"
                              component="div"
                              fontWeight={600}
                            >
                              ₹
                              {ssyResult.totalInvestment.toLocaleString(
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
                              {ssyResult.totalInterest.toLocaleString("en-IN", {
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
                      aria-label="SSY results tabs"
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
                          aria-label="SSY growth schedule"
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
                            {ssyResult.yearlySchedule.map((row) => (
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
                                    Girl's Age:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {girlAge} years
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
                                    Start Year:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {investmentStartYear}
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
                                    Maturity Year:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="primary.main"
                                  >
                                    {ssyResult.maturityYear}
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
                                    {SSY_INTEREST_RATE}%
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    Maturity Period:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    21 years
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
                                      (ssyResult.totalInterest /
                                        ssyResult.totalInvestment) *
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
                                      ssyResult.maturityAmount /
                                      ssyResult.totalInvestment
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
                    Enter SSY Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in your girl child's age and annual deposit amount to
                    calculate the Sukanya Samriddhi Yojana returns and maturity
                    amount.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* AdSense */}
          <AdSense adSlot="6613251015" />

          {/* SSY Information Section */}
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
                About Sukanya Samriddhi Yojana (SSY)
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    What is SSY?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Sukanya Samriddhi Yojana is a government-backed savings
                    scheme designed to secure the financial future of girl
                    children. It offers attractive interest rates and tax
                    benefits under the Beti Bachao Beti Padhao campaign.
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Key Features
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Minimum deposit: ₹250 per year" />
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
                      <ListItemText primary="Deposit period: 15 years" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Maturity period: 21 years from opening" />
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
                      <ListItemText primary="Girl child below 10 years of age" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Indian resident" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Maximum 2 accounts per family" />
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

export default SSYCalculator;
