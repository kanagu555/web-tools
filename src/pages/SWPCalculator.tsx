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
  TrendingDown,
  Target,
  PieChart,
  CheckCircle,
  ArrowDownCircle,
  DollarSign,
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

  // Generate SEO data
  const seoData = generateToolSEO(
    "SWP Calculator",
    "Calculate Systematic Withdrawal Plan returns, final value, and withdrawal schedule with our free SWP calculator. Plan your retirement income with accurate projections",
    "finance"
  );

  const webAppData = generateWebAppData(
    "SWP Calculator",
    "Free online SWP calculator to calculate returns on Systematic Withdrawal Plans. Get detailed projections for your retirement income planning with withdrawal analysis.",
    "finance"
  );

  const howToSteps = [
    {
      name: "Enter Initial Investment",
      text: "Input your initial investment amount in mutual funds or other investments",
    },
    {
      name: "Set Withdrawal Amount",
      text: "Enter the monthly withdrawal amount you need for expenses",
    },
    {
      name: "Set Expected Return",
      text: "Enter the expected annual return rate from your investments",
    },
    {
      name: "Choose Time Period",
      text: "Select the duration for which you want to withdraw money",
    },
    {
      name: "Calculate SWP",
      text: "Click 'Calculate SWP' to see withdrawal schedule, final value, and sustainability analysis",
    },
  ];

  const howToData = generateHowToData("SWP Calculator", howToSteps);

  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Finance Tools", url: "https://kodekit.in/category/finance" },
    { name: "SWP Calculator", url: "https://kodekit.in/tools/swp-calculator" },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Finance Tools", url: "/category/finance" },
    { name: "SWP Calculator" },
  ];

  const calculateSWP = () => {
    const initial = parseFloat(initialInvestment);
    const withdrawal = parseFloat(monthlyWithdrawal);
    const annualReturn = parseFloat(expectedReturn); // Keep as percentage
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
      } else {
        // Fallback: Create table manually if autoTable is not available
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setFillColor(255, 87, 34);
        doc.setTextColor(255, 255, 255);

        // Table header with better spacing
        const colWidths = [20, 35, 35, 35, 35];
        const colPositions = [20, 40, 75, 110, 145];

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
        doc.setFontSize(7);

        tableData.forEach((row, index) => {
          if (currentY > 270) {
            // Check if we need a new page
            doc.addPage();
            currentY = 20;

            // Redraw header on new page
            doc.setFontSize(8);
            doc.setFont("helvetica", "bold");
            doc.setFillColor(255, 87, 34);
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
            doc.setFontSize(7);
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
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${
                  row.year
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
        <span style="color: #000; font-weight: 900;">Generated by www.KodeKit.in SWP Calculator</span> | <span style="color: #666;">${
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
              Calculate your Systematic Withdrawal Plan returns, final value,
              and withdrawal sustainability. Plan your retirement income with
              accurate SWP calculations and withdrawal schedules.
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
                      min: 1000,
                      step: 1000,
                      "aria-describedby": "investment-helper-text",
                    }}
                    helperText="Your initial investment in mutual funds or other investments"
                    id="investment-helper-text"
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
                      min: 100,
                      step: 100,
                      "aria-describedby": "withdrawal-helper-text",
                    }}
                    helperText="Amount you want to withdraw every month"
                    id="withdrawal-helper-text"
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
                    helperText="Expected annual return from your investments"
                    id="return-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Time Period (Years)"
                    variant="outlined"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    type="number"
                    inputProps={{
                      min: 1,
                      max: 50,
                      step: 1,
                      "aria-describedby": "period-helper-text",
                    }}
                    helperText="Duration for which you want to withdraw money"
                    id="period-helper-text"
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={calculateSWP}
                      startIcon={<Calculator size={20} />}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                      disabled={
                        !initialInvestment ||
                        !monthlyWithdrawal ||
                        !expectedReturn ||
                        !timePeriod
                      }
                    >
                      Calculate SWP
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={
                        !initialInvestment &&
                        !monthlyWithdrawal &&
                        !expectedReturn &&
                        !timePeriod
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

                {/* SWP Benefits */}
                <Card
                  sx={{ mt: 3, backgroundColor: "rgba(255, 87, 34, 0.05)" }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <DollarSign
                        size={20}
                        style={{ marginRight: 8, color: "#ff5722" }}
                      />
                      SWP Benefits
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Regular income stream"
                          secondary="Steady cash flow for expenses"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Rupee cost averaging"
                          secondary="Benefit from market volatility"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tax efficiency"
                          secondary="Only capital gains are taxed"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Flexibility"
                          secondary="Can modify or stop anytime"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              {swpResult ? (
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
                        SWP Results
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Copy results">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy SWP results to clipboard"
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
                            aria-label="Download SWP results"
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

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={4}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #ff5722 0%, #d84315 100%)",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <CardContent>
                            <TrendingDown
                              size={32}
                              style={{ marginBottom: 8 }}
                            />
                            <Typography
                              variant="h4"
                              component="div"
                              fontWeight={700}
                            >
                              ₹
                              {swpResult.totalWithdrawal.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Total Withdrawal
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
                            <Target size={32} style={{ marginBottom: 8 }} />
                            <Typography
                              variant="h5"
                              component="div"
                              fontWeight={600}
                            >
                              ₹
                              {swpResult.finalValue.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Final Value
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
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
                              {swpResult.totalGrowth.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Total Growth
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      sx={{ mb: 3 }}
                      aria-label="SWP results tabs"
                    >
                      <Tab label="Withdrawal Schedule" />
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
                          aria-label="SWP withdrawal schedule"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Year</TableCell>
                              <TableCell align="right">Starting (₹)</TableCell>
                              <TableCell align="right">
                                Withdrawal (₹)
                              </TableCell>
                              <TableCell align="right">Growth (₹)</TableCell>
                              <TableCell align="right">Ending (₹)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {swpResult.yearlySchedule.map((row) => (
                              <TableRow key={row.year}>
                                <TableCell component="th" scope="row">
                                  {row.year}
                                </TableCell>
                                <TableCell align="right">
                                  {row.startingValue.toLocaleString("en-IN", {
                                    maximumFractionDigits: 0,
                                  })}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: "error.main" }}
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
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: 600 }}
                                >
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
                                    Monthly Withdrawal:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    ₹
                                    {parseFloat(
                                      monthlyWithdrawal
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
                                    Time Period:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {timePeriod} years
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Sustainability Analysis
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Months to Exhaust:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color={
                                      swpResult.monthsToExhaust >=
                                      parseFloat(timePeriod) * 12
                                        ? "success.main"
                                        : "error.main"
                                    }
                                  >
                                    {swpResult.monthsToExhaust} months
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
                                    Sustainability:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color={
                                      swpResult.finalValue > 0
                                        ? "success.main"
                                        : "error.main"
                                    }
                                  >
                                    {swpResult.finalValue > 0
                                      ? "Sustainable"
                                      : "Will Exhaust"}
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
                                    Withdrawal Rate:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {(
                                      ((parseFloat(monthlyWithdrawal) * 12) /
                                        parseFloat(initialInvestment)) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    Growth Rate:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="primary.main"
                                  >
                                    {(
                                      (swpResult.totalGrowth /
                                        parseFloat(initialInvestment)) *
                                      100
                                    ).toFixed(2)}
                                    %
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
                    Enter SWP Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in your investment details to calculate the Systematic
                    Withdrawal Plan returns and sustainability.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* AdSense */}
          <AdSense adSlot="6613251015" />

          {/* SWP Information Section */}
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
                About Systematic Withdrawal Plan (SWP)
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    What is SWP?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Systematic Withdrawal Plan allows you to withdraw a fixed
                    amount from your mutual fund investments at regular
                    intervals. It's ideal for generating regular income during
                    retirement or for meeting periodic financial needs.
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

export default SWPCalculator;
