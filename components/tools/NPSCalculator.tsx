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
  Users,
  Shield,
} from "lucide-react";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface NPSResult {
  totalInvestment: number;
  maturityCorpus: number;
  totalGrowth: number;
  pensionAmount: number;
  lumpsumAmount: number;
  annuityAmount: number;
  annuityDetails: {
    minimumAnnuity: number;
    annuityRate: number;
    monthlyPension: number;
    yearlyPension: number;
    pensionFor20Years: number;
    pensionFor25Years: number;
    pensionFor30Years: number;
  };
  yearlySchedule: Array<{
    year: number;
    age: number;
    deposit: number;
    growth: number;
    balance: number;
  }>;
}

const NPSCalculator = () => {
  const theme = useTheme();
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("60");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("10");
  const [activeTab, setActiveTab] = useState(0);
  const [npsResult, setNPSResult] = useState<NPSResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null); // Generate SEO data

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateNPS = () => {
    const age = parseInt(currentAge);
    const retirement = parseInt(retirementAge);
    const monthly = parseFloat(monthlyContribution);
    const annualReturn = parseFloat(expectedReturn) / 100;

    if (
      age >= 18 &&
      retirement >= 60 &&
      retirement > age &&
      monthly > 0 &&
      annualReturn >= 0
    ) {
      const investmentYears = retirement - age;
      const monthlyReturn = annualReturn / 12;
      const totalMonths = investmentYears * 12;

      // SIP formula for NPS: M × {[(1 + r)^n - 1] / r} × (1 + r)
      const maturityCorpus =
        monthly *
        ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn) *
        (1 + monthlyReturn);
      const totalInvestment = monthly * totalMonths;
      const totalGrowth = maturityCorpus - totalInvestment;

      // NPS rules: 60% can be withdrawn as lumpsum, 40% must be used for annuity
      const lumpsumAmount = maturityCorpus * 0.6;
      const annuityAmount = maturityCorpus * 0.4;

      // Detailed annuity calculations
      const annuityRate = 0.06; // 6% annuity rate (industry average)
      const monthlyPension = (annuityAmount * annuityRate) / 12;
      const yearlyPension = annuityAmount * annuityRate;

      // Calculate total pension for different durations
      const pensionFor20Years = monthlyPension * 12 * 20;
      const pensionFor25Years = monthlyPension * 12 * 25;
      const pensionFor30Years = monthlyPension * 12 * 30;

      const annuityDetails = {
        minimumAnnuity: annuityAmount,
        annuityRate: annuityRate * 100,
        monthlyPension,
        yearlyPension,
        pensionFor20Years,
        pensionFor25Years,
        pensionFor30Years,
      };

      const pensionAmount = monthlyPension;

      const schedule = [];
      let currentValue = 0;

      // Calculate year by year
      for (let year = 1; year <= investmentYears; year++) {
        let yearlyContribution = monthly * 12;
        let yearlyGrowth = 0;

        // Calculate monthly for this year
        for (let month = 1; month <= 12; month++) {
          const monthlyGrowth = currentValue * monthlyReturn;
          currentValue = currentValue * (1 + monthlyReturn) + monthly;
          yearlyGrowth += monthlyGrowth;
        }

        schedule.push({
          year,
          age: age + year,
          deposit: yearlyContribution,
          growth: yearlyGrowth,
          balance: currentValue,
        });
      }

      setNPSResult({
        totalInvestment,
        maturityCorpus,
        totalGrowth,
        pensionAmount,
        lumpsumAmount,
        annuityAmount,
        annuityDetails,
        yearlySchedule: schedule,
      });

      setSnackbarMessage("NPS calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage(
        "Please enter valid values (Age: 18+, Retirement: 60+, Valid contribution)"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadNPSDetails = async (format: "png" | "pdf" | "csv" = "png") => {
    setIsDownloading(true);
    setDownloadMenuAnchorEl(null);

    if (!npsResult) {
      setSnackbarMessage("No NPS calculation results to download");
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
    if (!npsResult) return;

    try {
      const csvContent = [
        ["NATIONAL PENSION SYSTEM CALCULATOR RESULTS"],
        [
          "Generated on",
          new Date().toLocaleDateString() +
            " at " +
            new Date().toLocaleTimeString(),
        ],
        ["Website", "www.KodeKit.in"],
        [""],
        ["NPS INVESTMENT DETAILS"],
        ["Current Age", currentAge + " years"],
        ["Retirement Age", retirementAge + " years"],
        [
          "Monthly Contribution (₹)",
          parseFloat(monthlyContribution).toLocaleString("en-IN"),
        ],
        ["Expected Annual Return (%)", expectedReturn],
        [
          "Investment Period",
          (parseInt(retirementAge) - parseInt(currentAge)).toString() +
            " years",
        ],
        [""],
        ["NPS SUMMARY"],
        ["Total Investment (₹)", npsResult.totalInvestment.toFixed(0)],
        ["Retirement Corpus (₹)", npsResult.maturityCorpus.toFixed(0)],
        ["Total Growth (₹)", npsResult.totalGrowth.toFixed(0)],
        ["Lumpsum Amount (60%) (₹)", npsResult.lumpsumAmount.toFixed(0)],
        ["Annuity Amount (40%) (₹)", npsResult.annuityAmount.toFixed(0)],
        ["Monthly Pension (₹)", npsResult.pensionAmount.toFixed(0)],
        [
          "Returns as % of Investment",
          ((npsResult.totalGrowth / npsResult.totalInvestment) * 100).toFixed(
            2
          ) + "%",
        ],
        [
          "Wealth Multiplier",
          (npsResult.maturityCorpus / npsResult.totalInvestment).toFixed(2) +
            "x",
        ],
        [""],
        ["DETAILED ANNUITY INFORMATION"],
        [
          "Minimum Annuity Investment (₹)",
          npsResult.annuityDetails.minimumAnnuity.toFixed(0),
        ],
        [
          "Annuity Rate (%)",
          npsResult.annuityDetails.annuityRate.toFixed(1) + "% per annum",
        ],
        [
          "Monthly Pension (₹)",
          npsResult.annuityDetails.monthlyPension.toFixed(0),
        ],
        [
          "Yearly Pension (₹)",
          npsResult.annuityDetails.yearlyPension.toFixed(0),
        ],
        [
          "Total Pension for 20 Years (₹)",
          npsResult.annuityDetails.pensionFor20Years.toFixed(0),
        ],
        [
          "Total Pension for 25 Years (₹)",
          npsResult.annuityDetails.pensionFor25Years.toFixed(0),
        ],
        [
          "Total Pension for 30 Years (₹)",
          npsResult.annuityDetails.pensionFor30Years.toFixed(0),
        ],
        [""],
        ["YEAR-WISE GROWTH SCHEDULE"],
        [
          "Year",
          "Age",
          "Annual Contribution (₹)",
          "Growth (₹)",
          "Account Balance (₹)",
        ],
      ];

      npsResult.yearlySchedule.forEach((row) => {
        csvContent.push([
          row.year.toString(),
          row.age.toString(),
          row.deposit.toFixed(0),
          row.growth.toFixed(0),
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
      link.download = `nps_calculation_${timestamp}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      setSnackbarMessage("NPS details downloaded as CSV successfully");
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
    if (!npsResult) return;

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
      doc.setFillColor(103, 58, 183); // Purple color for NPS
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("National Pension System Calculator", 20, 25);

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

      // NPS Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("NPS Investment Details", 20, currentY);

      doc.setLineWidth(0.5);
      doc.setDrawColor(103, 58, 183);
      doc.line(20, currentY + 2, 100, currentY + 2);

      currentY += 15;

      const npsDetailsData = [
        ["Current Age:", `${currentAge} years`],
        ["Retirement Age:", `${retirementAge} years`],
        [
          "Monthly Contribution:",
          `Rs. ${parseFloat(monthlyContribution).toLocaleString("en-IN")}`,
        ],
        ["Expected Return:", `${expectedReturn}% per annum`],
        [
          "Investment Period:",
          `${parseInt(retirementAge) - parseInt(currentAge)} years`,
        ],
      ];

      doc.setFontSize(11);
      npsDetailsData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, currentY + index * 8);
        doc.setFont("helvetica", "normal");
        doc.text(value, 90, currentY + index * 8);
      });

      currentY += 50;

      // Investment Summary
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("NPS Summary", 20, currentY);
      doc.line(20, currentY + 2, 95, currentY + 2);
      currentY += 15;

      const summaryBoxes = [
        {
          label: "Retirement Corpus",
          value: `Rs. ${npsResult.maturityCorpus.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [103, 58, 183],
        },
        {
          label: "Monthly Pension",
          value: `Rs. ${npsResult.pensionAmount.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [76, 175, 80],
        },
        {
          label: "Lumpsum (60%)",
          value: `Rs. ${npsResult.lumpsumAmount.toLocaleString("en-IN", {
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

      // Annuity Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Detailed Annuity Information", 20, currentY);
      doc.line(20, currentY + 2, 120, currentY + 2);
      currentY += 15;

      const annuityDetailsData = [
        [
          "Minimum Annuity Investment:",
          `Rs. ${npsResult.annuityDetails.minimumAnnuity.toLocaleString(
            "en-IN"
          )}`,
        ],
        ["Annuity Rate:", `${npsResult.annuityDetails.annuityRate}% per annum`],
        [
          "Monthly Pension:",
          `Rs. ${npsResult.annuityDetails.monthlyPension.toLocaleString(
            "en-IN"
          )}`,
        ],
        [
          "Yearly Pension:",
          `Rs. ${npsResult.annuityDetails.yearlyPension.toLocaleString(
            "en-IN"
          )}`,
        ],
        [
          "Total Pension (20 Years):",
          `Rs. ${npsResult.annuityDetails.pensionFor20Years.toLocaleString(
            "en-IN"
          )}`,
        ],
        [
          "Total Pension (25 Years):",
          `Rs. ${npsResult.annuityDetails.pensionFor25Years.toLocaleString(
            "en-IN"
          )}`,
        ],
        [
          "Total Pension (30 Years):",
          `Rs. ${npsResult.annuityDetails.pensionFor30Years.toLocaleString(
            "en-IN"
          )}`,
        ],
      ];

      doc.setFontSize(10);
      annuityDetailsData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, currentY + index * 7);
        doc.setFont("helvetica", "normal");
        doc.text(value, 110, currentY + index * 7);
      });

      currentY += 60;

      // Growth Schedule
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Year-wise Growth Schedule", 20, currentY);
      doc.line(20, currentY + 2, 120, currentY + 2);
      currentY += 10;

      const tableHeaders = [
        "Year",
        "Age",
        "Contribution (Rs.)",
        "Growth (Rs.)",
        "Balance (Rs.)",
      ];
      const tableData = npsResult.yearlySchedule.map((row) => [
        row.year.toString(),
        row.age.toString(),
        row.deposit.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.growth.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.balance.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
      ]);

      if (typeof (doc as any).autoTable === "function") {
        (doc as any).autoTable({
          head: [tableHeaders],
          body: tableData,
          startY: currentY,
          theme: "striped",
          headStyles: {
            fillColor: [103, 58, 183],
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
            1: { halign: "center", cellWidth: 20 },
            2: { halign: "right", cellWidth: 35 },
            3: { halign: "right", cellWidth: 35 },
            4: { halign: "right", cellWidth: 40 },
          },
          margin: { left: 20, right: 20 },
          pageBreak: "auto",
          showHead: "never",
        });
      } else {
        // Fallback: Create table manually if autoTable is not available
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setFillColor(103, 58, 183);
        doc.setTextColor(255, 255, 255);

        // Table header with better spacing
        const colWidths = [20, 20, 35, 35, 40];
        const colPositions = [20, 40, 60, 95, 130];

        // Draw header background
        doc.rect(20, currentY, 150, 10, "F");

        // Header text with proper alignment
        tableHeaders.forEach((header, index) => {
          if (index < 2) {
            // Center align Year and Age columns
            const headerWidth = doc.getTextWidth(header);
            doc.text(
              header,
              colPositions[index] + colWidths[index] / 2 - headerWidth / 2,
              currentY + 7
            );
          } else {
            // Right align amount columns
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
            doc.setFillColor(103, 58, 183);
            doc.setTextColor(255, 255, 255);
            doc.rect(20, currentY, 150, 10, "F");

            tableHeaders.forEach((header, index) => {
              if (index < 2) {
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
            doc.rect(20, currentY - 2, 150, 10, "F");
          }

          // Row data with proper alignment
          row.forEach((cell, colIndex) => {
            if (colIndex < 2) {
              // Center align Year and Age columns
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
        doc.text(`Generated by www.KodeKit.in NPS Calculator`, 20, 285);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      doc.save(`nps_calculation_${timestamp}.pdf`);

      setSnackbarMessage("NPS details downloaded as PDF successfully");
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
    if (!resultsRef.current || !npsResult) return;

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
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #673ab7; padding-bottom: 20px;">
        <h1 style="color: #673ab7; margin: 0; font-size: 28px;">National Pension System Calculator</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #673ab7; padding-left: 10px;">NPS Investment Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div><strong>Current Age:</strong> ${currentAge} years</div>
          <div><strong>Retirement Age:</strong> ${retirementAge} years</div>
          <div><strong>Monthly Contribution:</strong> Rs. ${parseFloat(
            monthlyContribution
          ).toLocaleString("en-IN")}</div>
          <div><strong>Expected Return:</strong> ${expectedReturn}%</div>
          <div><strong>Investment Period:</strong> ${
            parseInt(retirementAge) - parseInt(currentAge)
          } years</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #673ab7; padding-left: 10px;">NPS Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #ede7f6; border-radius: 8px; border: 2px solid #673ab7;">
            <div style="font-size: 24px; font-weight: bold; color: #673ab7;">Rs. ${npsResult.maturityCorpus.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Retirement Corpus</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 8px; border: 2px solid #4caf50;">
            <div style="font-size: 24px; font-weight: bold; color: #4caf50;">Rs. ${npsResult.pensionAmount.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Monthly Pension</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 8px; border: 2px solid #ff9800;">
            <div style="font-size: 18px; font-weight: bold; color: #ff9800;">Rs. ${npsResult.lumpsumAmount.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Lumpsum (60%)</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 8px; border: 2px solid #2196f3;">
            <div style="font-size: 18px; font-weight: bold; color: #2196f3;">Rs. ${npsResult.totalInvestment.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Investment</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #673ab7; padding-left: 10px;">Detailed Annuity Information</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div><strong>Minimum Annuity Investment:</strong> Rs. ${npsResult.annuityDetails.minimumAnnuity.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div><strong>Annuity Rate:</strong> ${
              npsResult.annuityDetails.annuityRate
            }% per annum</div>
            <div><strong>Monthly Pension:</strong> Rs. ${npsResult.annuityDetails.monthlyPension.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div><strong>Yearly Pension:</strong> Rs. ${npsResult.annuityDetails.yearlyPension.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
          </div>
          <div style="margin-top: 20px;">
            <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">Pension Projections</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
              <div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 6px;">
                <div style="font-size: 16px; font-weight: bold; color: #4caf50;">Rs. ${npsResult.annuityDetails.pensionFor20Years.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</div>
                <div style="font-size: 12px; color: #666;">20 Years Total</div>
              </div>
              <div style="text-align: center; padding: 15px; background: #e3f2fd; border-radius: 6px;">
                <div style="font-size: 16px; font-weight: bold; color: #2196f3;">Rs. ${npsResult.annuityDetails.pensionFor25Years.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</div>
                <div style="font-size: 12px; color: #666;">25 Years Total</div>
              </div>
              <div style="text-align: center; padding: 15px; background: #fff3e0; border-radius: 6px;">
                <div style="font-size: 16px; font-weight: bold; color: #ff9800;">Rs. ${npsResult.annuityDetails.pensionFor30Years.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</div>
                <div style="font-size: 12px; color: #666;">30 Years Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #673ab7; padding-left: 10px;">Year-wise Growth Schedule</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #673ab7; color: white;">
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Year</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Age</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Contribution (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Growth (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Balance (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${npsResult.yearlySchedule
              .map(
                (row, index) => `
              <tr style="background: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${
                  row.year
                }</td>
                <td style="padding: 8px; text-align: center; border: 1px solid #ddd;">${
                  row.age
                }</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Rs. ${row.deposit.toLocaleString(
                  "en-IN",
                  { maximumFractionDigits: 0 }
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #4caf50;">Rs. ${row.growth.toLocaleString(
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
        <span style="color: #000; font-weight: 900;">Generated by www.KodeKit.in NPS Calculator</span> | <span style="color: #666;">${
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
      link.download = `nps_calculation_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("NPS details downloaded as PNG successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } finally {
      document.body.removeChild(enhancedContent);
    }
  };

  const handleReset = () => {
    setCurrentAge("");
    setRetirementAge("60");
    setMonthlyContribution("");
    setExpectedReturn("10");
    setNPSResult(null);
    setActiveTab(0);
    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!npsResult) return;
    const resultsText = `NPS Summary:
Current Age: ${currentAge} years
Retirement Age: ${retirementAge} years
Monthly Contribution: Rs. ${parseFloat(monthlyContribution).toFixed(2)}
Expected Return: ${expectedReturn}%
Total Investment: Rs. ${npsResult.totalInvestment.toFixed(2)}
Maturity Corpus: Rs. ${npsResult.maturityCorpus.toFixed(2)}
Monthly Pension: Rs. ${npsResult.pensionAmount.toFixed(2)}
Lumpsum Amount: Rs. ${npsResult.lumpsumAmount.toFixed(2)}`;
    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("NPS summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };
  return (
    <>
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
              NPS Calculator - National Pension System Calculator
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
              Calculate your National Pension System returns, retirement corpus,
              and monthly pension amount. Plan your retirement with accurate NPS
              calculations and investment projections.
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
                  <Users
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
                    NPS Calculator
                  </Typography>
                </Box>

                <Box component="form" noValidate autoComplete="off">
                  <TextField
                    fullWidth
                    label="Current Age (years)"
                    variant="outlined"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    type="number"
                    inputProps={{ min: 18, max: 65, step: 1 }}
                    helperText="Minimum age 18 years for NPS"
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Retirement Age (years)"
                    variant="outlined"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                    type="number"
                    inputProps={{ min: 60, max: 75, step: 1 }}
                    helperText="Minimum retirement age 60 years"
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Monthly Contribution (₹)"
                    variant="outlined"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    type="number"
                    inputProps={{ min: 1000, step: 500 }}
                    helperText="Minimum ₹1,000 per month"
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="Expected Annual Return (%)"
                    variant="outlined"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    type="number"
                    inputProps={{ min: 8, max: 15, step: 0.1 }}
                    helperText="Typically 8-12% for NPS"
                    sx={{ mb: 3 }}
                  />

                  <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={calculateNPS}
                      startIcon={<Calculator size={20} />}
                      sx={{
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "1rem",
                      }}
                      disabled={
                        !currentAge ||
                        !retirementAge ||
                        !monthlyContribution ||
                        !expectedReturn
                      }
                    >
                      Calculate NPS
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={
                        !currentAge &&
                        !retirementAge &&
                        !monthlyContribution &&
                        !expectedReturn
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

                {/* NPS Benefits */}
                <Card
                  sx={{ mt: 3, backgroundColor: "rgba(103, 58, 183, 0.05)" }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Shield
                        size={20}
                        style={{ marginRight: 8, color: "#673ab7" }}
                      />
                      NPS Benefits
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Tax benefits under Section 80C & 80CCD"
                          secondary="Up to ₹2 lakh deduction"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Government co-contribution"
                          secondary="For government employees"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Regulated by PFRDA"
                          secondary="Government oversight"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle size={16} color="#4caf50" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Portable across jobs"
                          secondary="Single account for life"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>

            <Grid item xs={12} md={7}>
              {npsResult ? (
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
                        NPS Results
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Copy results">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy NPS results to clipboard"
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
                            aria-label="Download NPS results"
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
                      <MuiMenuItem onClick={() => downloadNPSDetails("png")}>
                        Download as PNG
                      </MuiMenuItem>
                      <MuiMenuItem onClick={() => downloadNPSDetails("pdf")}>
                        Download as PDF
                      </MuiMenuItem>
                      <MuiMenuItem onClick={() => downloadNPSDetails("csv")}>
                        Download as CSV
                      </MuiMenuItem>
                    </Menu>

                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={12} sm={6}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #673ab7 0%, #512da8 100%)",
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
                              {npsResult.maturityCorpus.toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Retirement Corpus
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={6}>
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
                              variant="h4"
                              component="div"
                              fontWeight={700}
                            >
                              ₹
                              {npsResult.pensionAmount.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Monthly Pension
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <CardContent>
                            <Typography
                              variant="h5"
                              component="div"
                              fontWeight={600}
                            >
                              ₹
                              {npsResult.lumpsumAmount.toLocaleString("en-IN", {
                                maximumFractionDigits: 0,
                              })}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                              Lumpsum (60%)
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Card
                          sx={{
                            background:
                              "linear-gradient(135deg, #2196f3 0%, #1565c0 100%)",
                            color: "white",
                            textAlign: "center",
                          }}
                        >
                          <CardContent>
                            <Typography
                              variant="h5"
                              component="div"
                              fontWeight={600}
                            >
                              ₹
                              {npsResult.totalInvestment.toLocaleString(
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
                    </Grid>

                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      sx={{ mb: 3 }}
                      aria-label="NPS results tabs"
                    >
                      <Tab label="Growth Schedule" />
                      <Tab label="Summary" />
                      <Tab label="Annuity Details" />
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
                          aria-label="NPS growth schedule"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Year</TableCell>
                              <TableCell align="center">Age</TableCell>
                              <TableCell align="right">
                                Contribution (₹)
                              </TableCell>
                              <TableCell align="right">Growth (₹)</TableCell>
                              <TableCell align="right">Balance (₹)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {npsResult.yearlySchedule.map((row) => (
                              <TableRow key={row.year}>
                                <TableCell component="th" scope="row">
                                  {row.year}
                                </TableCell>
                                <TableCell align="center">{row.age}</TableCell>
                                <TableCell align="right">
                                  {row.deposit.toLocaleString("en-IN", {
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
                                    Current Age:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {currentAge} years
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
                                    Retirement Age:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {retirementAge} years
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
                                    Monthly Contribution:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    ₹
                                    {parseFloat(
                                      monthlyContribution
                                    ).toLocaleString("en-IN")}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    Expected Return:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {expectedReturn}%
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Retirement Analysis
                                </Typography>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    Investment Period:
                                  </Typography>
                                  <Typography variant="body2" fontWeight={600}>
                                    {parseInt(retirementAge) -
                                      parseInt(currentAge)}{" "}
                                    years
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
                                    Total Returns:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="success.main"
                                  >
                                    {(
                                      (npsResult.totalGrowth /
                                        npsResult.totalInvestment) *
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
                                      npsResult.maturityCorpus /
                                      npsResult.totalInvestment
                                    ).toFixed(2)}
                                    x
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Typography variant="body2">
                                    Tax Benefits:
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color="success.main"
                                  >
                                    Up to ₹2 lakh/year
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {activeTab === 2 && (
                      <Box>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Card variant="outlined" sx={{ mb: 3 }}>
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
                                  Annuity Investment Details
                                </Typography>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                      }}
                                    >
                                      <Typography variant="body2">
                                        Minimum Annuity Investment:
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="primary.main"
                                      >
                                        ₹
                                        {npsResult.annuityDetails.minimumAnnuity.toLocaleString(
                                          "en-IN",
                                          { maximumFractionDigits: 0 }
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
                                        Annuity Rate:
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                      >
                                        {npsResult.annuityDetails.annuityRate}%
                                        per annum
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
                                        Monthly Pension:
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="success.main"
                                      >
                                        ₹
                                        {npsResult.annuityDetails.monthlyPension.toLocaleString(
                                          "en-IN",
                                          { maximumFractionDigits: 0 }
                                        )}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        mb: 1,
                                      }}
                                    >
                                      <Typography variant="body2">
                                        Yearly Pension:
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                      >
                                        ₹
                                        {npsResult.annuityDetails.yearlyPension.toLocaleString(
                                          "en-IN",
                                          { maximumFractionDigits: 0 }
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
                                        Lumpsum Available:
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="warning.main"
                                      >
                                        ₹
                                        {npsResult.lumpsumAmount.toLocaleString(
                                          "en-IN",
                                          { maximumFractionDigits: 0 }
                                        )}{" "}
                                        (60%)
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
                                        Annuity Mandatory:
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        fontWeight={600}
                                        color="error.main"
                                      >
                                        ₹
                                        {npsResult.annuityAmount.toLocaleString(
                                          "en-IN",
                                          { maximumFractionDigits: 0 }
                                        )}{" "}
                                        (40%)
                                      </Typography>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                          </Grid>

                          <Grid item xs={12}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  Pension Projections (Different Durations)
                                </Typography>
                                <Grid container spacing={3}>
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
                                        <Typography
                                          variant="h6"
                                          component="div"
                                          fontWeight={600}
                                        >
                                          20 Years
                                        </Typography>
                                        <Typography
                                          variant="h5"
                                          component="div"
                                          fontWeight={700}
                                          sx={{ mt: 1 }}
                                        >
                                          ₹
                                          {npsResult.annuityDetails.pensionFor20Years.toLocaleString(
                                            "en-IN",
                                            { maximumFractionDigits: 0 }
                                          )}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ opacity: 0.9, mt: 1 }}
                                        >
                                          Total Pension
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
                                        <Typography
                                          variant="h6"
                                          component="div"
                                          fontWeight={600}
                                        >
                                          25 Years
                                        </Typography>
                                        <Typography
                                          variant="h5"
                                          component="div"
                                          fontWeight={700}
                                          sx={{ mt: 1 }}
                                        >
                                          ₹
                                          {npsResult.annuityDetails.pensionFor25Years.toLocaleString(
                                            "en-IN",
                                            { maximumFractionDigits: 0 }
                                          )}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ opacity: 0.9, mt: 1 }}
                                        >
                                          Total Pension
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
                                        <Typography
                                          variant="h6"
                                          component="div"
                                          fontWeight={600}
                                        >
                                          30 Years
                                        </Typography>
                                        <Typography
                                          variant="h5"
                                          component="div"
                                          fontWeight={700}
                                          sx={{ mt: 1 }}
                                        >
                                          ₹
                                          {npsResult.annuityDetails.pensionFor30Years.toLocaleString(
                                            "en-IN",
                                            { maximumFractionDigits: 0 }
                                          )}
                                        </Typography>
                                        <Typography
                                          variant="body2"
                                          sx={{ opacity: 0.9, mt: 1 }}
                                        >
                                          Total Pension
                                        </Typography>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                </Grid>

                                <Box
                                  sx={{
                                    mt: 3,
                                    p: 2,
                                    backgroundColor: "rgba(33, 150, 243, 0.1)",
                                    borderRadius: 2,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    <strong>Note:</strong> These projections
                                    assume a{" "}
                                    {npsResult.annuityDetails.annuityRate}%
                                    annuity rate. Actual pension amounts may
                                    vary based on the annuity provider and
                                    market conditions at the time of retirement.
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2, textAlign: "center" }}
                    >
                      * Pension calculated at 6% annuity rate. Actual rates may
                      vary.
                      <br />* 60% corpus can be withdrawn as lumpsum, 40% must
                      be used for annuity.
                    </Typography>
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
                    Enter NPS Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fill in your details to calculate National Pension System
                    returns and retirement planning projections.
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* AdSense */}
          <AdSense adSlot="6613251015" />

          {/* NPS Information Section */}
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
                About National Pension System (NPS)
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    What is NPS?
                  </Typography>
                  <Typography variant="body1" paragraph>
                    National Pension System is a government-sponsored pension
                    scheme designed to provide retirement income security. It's
                    a market-linked, defined contribution pension system
                    regulated by PFRDA.
                  </Typography>

                  <Typography variant="h6" gutterBottom>
                    Key Features
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Minimum age: 18 years" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Minimum contribution: ₹1,000/year" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Exit age: 60-75 years" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Market-linked returns" />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    NPS Tiers
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Tier I: Retirement account"
                        secondary="Lock-in until 60, tax benefits"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Tier II: Voluntary savings"
                        secondary="No lock-in, limited tax benefits"
                      />
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
                      <ListItemText primary="Section 80C: Up to ₹1.5 lakh" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Section 80CCD(1B): Additional ₹50,000" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Section 80CCD(2): Employer contribution" />
                    </ListItem>
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Withdrawal Rules
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="60% lumpsum withdrawal allowed" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="40% must be used for annuity" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircle size={20} color="#4caf50" />
                      </ListItemIcon>
                      <ListItemText primary="Partial withdrawal allowed after 3 years" />
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

export default NPSCalculator;
