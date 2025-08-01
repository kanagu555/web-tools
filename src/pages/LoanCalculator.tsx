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
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Calculator,
  Download,
  Copy,
  RefreshCw,
  ChevronDown,
  Info,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Helmet } from "react-helmet";
import html2canvas from "html2canvas";
import AdSense from "../components/AdSense";
import SocialShare from "../components/SocialShare";
import Breadcrumb from "../components/Breadcrumb";

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

const LoanCalculator = () => {
  const theme = useTheme();
  const shareLink = window.location.href;
  const isProductionEnv = import.meta.env.PROD;
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [loanType, setLoanType] = useState("personal");
  const [activeTab, setActiveTab] = useState(0);
  const [loanResult, setLoanResult] = useState<LoanResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Finance Tools", url: "/category/finance" },
    { name: "Loan Calculator" },
  ];

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      newErrors.loanAmount = "Please enter a valid loan amount";
    } else if (parseFloat(loanAmount) > 10000000) {
      newErrors.loanAmount = "Loan amount cannot exceed Rs. 1 crore";
    }

    if (!interestRate || parseFloat(interestRate) <= 0) {
      newErrors.interestRate = "Please enter a valid interest rate";
    } else if (parseFloat(interestRate) > 50) {
      newErrors.interestRate = "Interest rate seems too high (max 50%)";
    }

    if (!loanTerm || parseFloat(loanTerm) <= 0) {
      newErrors.loanTerm = "Please enter a valid loan term";
    } else if (parseFloat(loanTerm) > 50) {
      newErrors.loanTerm = "Loan term cannot exceed 50 years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateLoan = () => {
    if (!validateInputs()) {
      setSnackbarMessage("Please fix the errors and try again");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm) * 12;

    if (principal > 0 && rate > 0 && months > 0) {
      const x = Math.pow(1 + rate, months);
      const monthly = (principal * x * rate) / (x - 1);
      const total = monthly * months;
      const totalInterestPaid = total - principal;

      // Generate amortization schedule
      const schedule = [];
      let balance = principal;

      for (let month = 1; month <= months; month++) {
        const interestPayment = balance * rate;
        const principalPayment = monthly - interestPayment;
        balance -= principalPayment;

        schedule.push({
          month,
          payment: monthly,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: balance > 0 ? balance : 0,
        });
      }

      setLoanResult({
        monthlyPayment: monthly,
        totalPayment: total,
        totalInterest: totalInterestPaid,
        amortizationSchedule: schedule,
      });

      setSnackbarMessage("Loan calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const downloadLoanDetails = async (format: "png" | "pdf" | "csv" = "png") => {
    if (!loanResult) {
      setSnackbarMessage("No loan calculation results to download");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const timestamp = new Date().toISOString().split("T")[0];
    const loanTypeInfo = getLoanTypeInfo(loanType);

    try {
      if (format === "csv") {
        // Generate CSV format
        await downloadAsCSV(timestamp);
      } else if (format === "pdf") {
        // Generate PDF format
        await downloadAsPDF(timestamp, loanTypeInfo);
      } else {
        // Generate PNG format (enhanced)
        await downloadAsPNG(timestamp, loanTypeInfo);
      }
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()}:`, error);
      setSnackbarMessage(
        `Failed to generate ${format.toUpperCase()}. Please try again.`
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadAsCSV = async (timestamp: string) => {
    if (!loanResult) return;

    try {
      const csvContent = [
        // Header information
        ["LOAN CALCULATOR RESULTS"],
        [
          "Generated on",
          new Date().toLocaleDateString() +
            " at " +
            new Date().toLocaleTimeString(),
        ],
        ["Website", window.location.origin],
        [""],
        ["LOAN DETAILS"],
        ["Loan Type", getLoanTypeInfo(loanType).name],
        ["Loan Amount (₹)", parseFloat(loanAmount).toLocaleString("en-IN")],
        ["Interest Rate (%)", interestRate],
        ["Loan Term (Years)", loanTerm],
        ["Loan Term (Months)", (parseFloat(loanTerm) * 12).toString()],
        [""],
        ["PAYMENT SUMMARY"],
        ["Monthly EMI (₹)", loanResult.monthlyPayment.toFixed(0)],
        ["Total Payment (₹)", loanResult.totalPayment.toFixed(0)],
        ["Total Interest (₹)", loanResult.totalInterest.toFixed(0)],
        [
          "Interest as % of Principal",
          ((loanResult.totalInterest / parseFloat(loanAmount)) * 100).toFixed(
            2
          ) + "%",
        ],
        [""],
        ["AMORTIZATION SCHEDULE"],
        [
          "Month",
          "Payment (₹)",
          "Principal (₹)",
          "Interest (₹)",
          "Remaining Balance (₹)",
          "Cumulative Principal (₹)",
          "Cumulative Interest (₹)",
        ],
      ];

      // Add amortization data with cumulative calculations
      let cumulativePrincipal = 0;
      let cumulativeInterest = 0;

      loanResult.amortizationSchedule.forEach((row) => {
        cumulativePrincipal += row.principal;
        cumulativeInterest += row.interest;

        csvContent.push([
          row.month.toString(),
          row.payment.toFixed(0),
          row.principal.toFixed(0),
          row.interest.toFixed(0),
          row.remainingBalance.toFixed(0),
          cumulativePrincipal.toFixed(0),
          cumulativeInterest.toFixed(0),
        ]);
      });

      // Add summary statistics
      csvContent.push(
        [""],
        ["SUMMARY STATISTICS"],
        ["Total Months", loanResult.amortizationSchedule.length.toString()],
        [
          "Average Monthly Principal",
          (
            parseFloat(loanAmount) / loanResult.amortizationSchedule.length
          ).toFixed(0),
        ],
        [
          "Average Monthly Interest",
          (
            loanResult.totalInterest / loanResult.amortizationSchedule.length
          ).toFixed(0),
        ],
        [
          "First Month Interest",
          loanResult.amortizationSchedule[0]?.interest.toFixed(0) || "0",
        ],
        [
          "Last Month Interest",
          loanResult.amortizationSchedule[
            loanResult.amortizationSchedule.length - 1
          ]?.interest.toFixed(0) || "0",
        ],
        [
          "Interest Savings vs Simple Interest",
          "Calculated using compound interest method",
        ]
      );

      // Convert to CSV string with proper escaping
      const csvString = csvContent
        .map((row) =>
          row
            .map((cell) => {
              // Handle cells that contain commas, quotes, or newlines
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
      link.download = `loan_calculation_${timestamp}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      setSnackbarMessage("Loan details downloaded as CSV successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error generating CSV:", error);
      setSnackbarMessage("Failed to generate CSV. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadAsPDF = async (timestamp: string, loanTypeInfo: any) => {
    if (!loanResult) return;

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
      doc.setFont(undefined, "bold");
      doc.text("Loan Calculator Results", 20, 25);

      // Reset color and add generation info
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      currentY = 45;
      doc.text(
        `Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
        20,
        currentY
      );
      doc.text(`Website: ${window.location.origin}`, 20, currentY + 5);

      currentY += 20;

      // Loan Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Loan Details", 20, currentY);

      // Add underline
      doc.setLineWidth(0.5);
      doc.setDrawColor(25, 118, 210);
      doc.line(20, currentY + 2, 80, currentY + 2);

      currentY += 15;

      // Loan details in a structured format
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");

      const loanDetailsData = [
        ["Loan Type:", loanTypeInfo.name],
        [
          "Loan Amount:",
          `Rs. ${parseFloat(loanAmount).toLocaleString("en-IN")}`,
        ],
        ["Interest Rate:", `${interestRate}% per annum`],
        [
          "Loan Term:",
          `${loanTerm} years (${parseFloat(loanTerm) * 12} months)`,
        ],
      ];

      loanDetailsData.forEach(([label, value], index) => {
        doc.setFont(undefined, "bold");
        doc.text(label, 25, currentY + index * 8);
        doc.setFont(undefined, "normal");
        doc.text(value, 80, currentY + index * 8);
      });

      currentY += 45;

      // Payment Summary Section
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Payment Summary", 20, currentY);

      // Add underline
      doc.line(20, currentY + 2, 95, currentY + 2);
      currentY += 15;

      // Summary in boxes
      const summaryBoxes = [
        {
          label: "Monthly EMI",
          value: `Rs. ${loanResult.monthlyPayment.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [25, 118, 210],
        },
        {
          label: "Total Payment",
          value: `Rs. ${loanResult.totalPayment.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [156, 39, 176],
        },
        {
          label: "Total Interest",
          value: `Rs. ${loanResult.totalInterest.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`,
          color: [244, 67, 54],
        },
      ];

      summaryBoxes.forEach((box, index) => {
        const x = 20 + index * 60;
        const y = currentY;

        // Draw box
        doc.setFillColor(...box.color);
        doc.roundedRect(x, y, 55, 25, 3, 3, "F");

        // Add text
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont(undefined, "normal");
        doc.text(box.label, x + 3, y + 8);

        doc.setFontSize(10);
        doc.setFont(undefined, "bold");
        // Split long values into multiple lines if needed
        const lines = doc.splitTextToSize(box.value, 50);
        doc.text(lines, x + 3, y + 15);
      });

      currentY += 40;

      // Amortization Schedule
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Amortization Schedule", 20, currentY);

      doc.line(20, currentY + 2, 120, currentY + 2);
      currentY += 10;

      // Prepare table data
      const tableHeaders = [
        "Month",
        "Payment (Rs.)",
        "Principal (Rs.)",
        "Interest (Rs.)",
        "Balance (Rs.)",
      ];
      const tableData = loanResult.amortizationSchedule.map((row) => [
        row.month.toString(),
        row.payment.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.principal.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.interest.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
        row.remainingBalance.toLocaleString("en-IN", {
          maximumFractionDigits: 0,
        }),
      ]);

      if (typeof doc.autoTable === "function") {
        // Use autoTable if available
        doc.autoTable({
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
            1: { halign: "right", cellWidth: 35 },
            2: { halign: "right", cellWidth: 35 },
            3: { halign: "right", cellWidth: 35 },
            4: { halign: "right", cellWidth: 40 },
          },
          margin: { left: 20, right: 20 },
          pageBreak: "auto",
          showHead: "everyPage",
        });
      } else {
        // Fallback to basic table
        doc.setFontSize(8);
        doc.setFont(undefined, "bold");

        // Table headers
        const colWidths = [20, 35, 35, 35, 40];
        const colPositions = [20, 40, 75, 110, 145];

        // Header background
        doc.setFillColor(25, 118, 210);
        doc.rect(20, currentY, 165, 8, "F");

        doc.setTextColor(255, 255, 255);
        tableHeaders.forEach((header, index) => {
          doc.text(header, colPositions[index] + 2, currentY + 6);
        });

        currentY += 12;
        doc.setTextColor(40, 40, 40);
        doc.setFont(undefined, "normal");

        // Table rows
        tableData.forEach((row, rowIndex) => {
          if (currentY > 270) {
            doc.addPage();
            currentY = 20;
          }

          // Alternate row colors
          if (rowIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(20, currentY - 2, 165, 8, "F");
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
        doc.text(`Generated by KodeKit Loan Calculator`, 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      // Save the PDF
      doc.save(`loan_calculation_${timestamp}.pdf`);

      setSnackbarMessage("Loan details downloaded as PDF successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setSnackbarMessage("Failed to generate PDF. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadAsPNG = async (timestamp: string, loanTypeInfo: any) => {
    if (!resultsRef.current) return;

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
        <h1 style="color: #1976d2; margin: 0; font-size: 28px;">Loan Calculator Results</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #1976d2; padding-left: 10px;">Loan Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div><strong>Loan Type:</strong> ${loanTypeInfo.name}</div>
          <div><strong>Loan Amount:</strong> Rs. ${parseFloat(
            loanAmount
          ).toLocaleString("en-IN")}</div>
          <div><strong>Interest Rate:</strong> ${interestRate}% per annum</div>
          <div><strong>Loan Term:</strong> ${loanTerm} years</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #1976d2; padding-left: 10px;">Payment Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
            <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Rs. ${loanResult.monthlyPayment.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Monthly EMI</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f3e5f5; border-radius: 8px; border: 2px solid #9c27b0;">
            <div style="font-size: 18px; font-weight: bold; color: #9c27b0;">Rs. ${loanResult.totalPayment.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Payment</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #ffebee; border-radius: 8px; border: 2px solid #f44336;">
            <div style="font-size: 18px; font-weight: bold; color: #f44336;">Rs. ${loanResult.totalInterest.toLocaleString(
              "en-IN",
              { maximumFractionDigits: 0 }
            )}</div>
            <div style="font-size: 14px; color: #666;">Total Interest</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #1976d2; padding-left: 10px;">Amortization Schedule (First 12 Months)</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #1976d2; color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Month</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Payment (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Principal (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Interest (Rs.)</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Balance (Rs.)</th>
            </tr>
          </thead>
          <tbody>
            ${loanResult.amortizationSchedule
              .slice(0, 12)
              .map(
                (row, index) => `
              <tr style="background: ${index % 2 === 0 ? "#f9f9f9" : "white"};">
                <td style="padding: 8px; border: 1px solid #ddd;">${
                  row.month
                }</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Rs. ${row.payment.toFixed(
                  0
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #4caf50;">Rs. ${row.principal.toFixed(
                  0
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd; color: #f44336;">Rs. ${row.interest.toFixed(
                  0
                )}</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">Rs. ${row.remainingBalance.toFixed(
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
        Generated by KodeKit Loan Calculator | ${window.location.href}
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
      link.download = `loan_calculation_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("Loan details downloaded as PNG successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } finally {
      document.body.removeChild(enhancedContent);
    }
  };

  const handleReset = () => {
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
    setLoanType("personal");
    setLoanResult(null);
    setActiveTab(0);
    setErrors({});

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLoanTypeInfo = (type: string) => {
    const loanTypes: {
      [key: string]: { name: string; description: string; typicalRate: string };
    } = {
      personal: {
        name: "Personal Loan",
        description: "Unsecured loan for personal expenses",
        typicalRate: "10-24%",
      },
      home: {
        name: "Home Loan",
        description: "Secured loan for property purchase",
        typicalRate: "6.5-9.5%",
      },
      auto: {
        name: "Auto Loan",
        description: "Secured loan for vehicle purchase",
        typicalRate: "7-12%",
      },
      education: {
        name: "Education Loan",
        description: "Loan for educational expenses",
        typicalRate: "8-15%",
      },
      business: {
        name: "Business Loan",
        description: "Loan for business purposes",
        typicalRate: "11-20%",
      },
    };
    return loanTypes[type] || loanTypes.personal;
  };

  const handleCopyResults = () => {
    if (!loanResult) return;

    const resultsText = `
Loan Summary:
Loan Amount: Rs. ${parseFloat(loanAmount).toFixed(2)}
Interest Rate: ${interestRate}%
Loan Term: ${loanTerm} years
Monthly Payment: Rs. ${loanResult.monthlyPayment.toFixed(2)}
Total Payment: Rs. ${loanResult.totalPayment.toFixed(2)}
Total Interest: Rs. ${loanResult.totalInterest.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("Loan summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>
          Free Online Loan Calculator | Calculate EMI, Interest & Amortization |
          KodeKit
        </title>
        <meta
          name="description"
          content="Free online loan calculator to estimate your monthly EMI payments, total interest, and amortization schedule for home loans, personal loans, auto loans, and more. Plan your finances better with our easy-to-use tool."
        />
        <meta
          name="keywords"
          content="loan calculator, EMI calculator, mortgage calculator, auto loan calculator, personal loan calculator, home loan calculator, car loan calculator, amortization schedule, monthly payment calculator, interest calculator, financial planning tool, debt calculator, loan repayment calculator, loan EMI calculator online, free loan calculator, loan payment calculator, loan interest calculator, home loan EMI calculator, personal loan EMI calculator, auto loan payment calculator, education loan calculator, business loan calculator, loan comparison calculator, loan affordability calculator, loan amortization table, monthly installment calculator, loan tenure calculator, prepayment calculator, loan eligibility calculator"
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/loan-calculator"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Free Online Loan Calculator | Calculate EMI, Interest & Amortization"
        />
        <meta
          property="og:description"
          content="Calculate your loan EMI, total interest, and view complete amortization schedule with our free online loan calculator."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/loan-calculator"
        />
        <meta
          property="og:image"
          content="https://www.kodekit.in/og-loan-calculator.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Free Online Loan Calculator | Calculate EMI & Interest"
        />
        <meta
          name="twitter:description"
          content="Calculate loan EMI, total interest, and amortization schedule with our free online calculator."
        />
        <meta
          name="twitter:image"
          content="https://www.kodekit.in/og-loan-calculator.jpg"
        />

        {/* Structured Data (Schema.org) */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Loan Calculator",
              "description": "Free online loan calculator to calculate EMI, total interest, and amortization schedule for various types of loans including home loans, personal loans, auto loans, and more.",
              "url": "https://www.kodekit.in/tools/loan-calculator",
              "category": "Financial Calculator",
              "operatingSystem": "Web Browser",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "EMI calculation",
                "Interest calculation",
                "Amortization schedule",
                "Multiple loan types support",
                "Download results",
                "Copy to clipboard",
                "Real-time calculations"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            }
          `}
        </script>
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: "2.5rem", fontWeight: 700, mb: 2 }}
        >
          Loan Calculator
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Calculate your monthly loan payments (EMI), total interest, and view
          complete amortization schedule for home loans, personal loans, auto
          loans, and more.
        </Typography>

        <section aria-labelledby="loan-calculator-section">
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
                role="region"
                aria-labelledby="loan-details-heading"
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Calculator size={20} aria-hidden="true" />
                  <Typography
                    variant="h2"
                    component="h2"
                    id="loan-details-heading"
                    sx={{ fontSize: "1.25rem", fontWeight: 600, ml: 1 }}
                  >
                    Loan Details
                  </Typography>
                </Box>

                <Grid
                  container
                  spacing={3}
                  component="form"
                  role="form"
                  aria-label="Loan calculation form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    calculateLoan();
                  }}
                >
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="loan-type-label">Loan Type</InputLabel>
                      <Select
                        labelId="loan-type-label"
                        value={loanType}
                        onChange={(e) => setLoanType(e.target.value)}
                        label="Loan Type"
                        aria-describedby="loan-type-help"
                      >
                        <MenuItem value="personal">Personal Loan</MenuItem>
                        <MenuItem value="home">Home Loan</MenuItem>
                        <MenuItem value="auto">Auto Loan</MenuItem>
                        <MenuItem value="education">Education Loan</MenuItem>
                        <MenuItem value="business">Business Loan</MenuItem>
                      </Select>
                    </FormControl>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      id="loan-type-help"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      {getLoanTypeInfo(loanType).description} (Typical rate:{" "}
                      {getLoanTypeInfo(loanType).typicalRate})
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Loan Amount (₹)"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => {
                        setLoanAmount(e.target.value);
                        if (errors.loanAmount) {
                          setErrors((prev) => ({ ...prev, loanAmount: "" }));
                        }
                      }}
                      error={!!errors.loanAmount}
                      helperText={errors.loanAmount}
                      inputProps={{
                        "aria-label": "Enter loan amount in rupees",
                        min: "0",
                        step: "1000",
                      }}
                      placeholder="e.g., 500000"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Annual Interest Rate (%)"
                      type="number"
                      value={interestRate}
                      onChange={(e) => {
                        setInterestRate(e.target.value);
                        if (errors.interestRate) {
                          setErrors((prev) => ({ ...prev, interestRate: "" }));
                        }
                      }}
                      error={!!errors.interestRate}
                      helperText={errors.interestRate}
                      inputProps={{
                        "aria-label": "Enter annual interest rate percentage",
                        min: "0",
                        max: "50",
                        step: "0.01",
                      }}
                      placeholder="e.g., 12.5"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Loan Term (Years)"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => {
                        setLoanTerm(e.target.value);
                        if (errors.loanTerm) {
                          setErrors((prev) => ({ ...prev, loanTerm: "" }));
                        }
                      }}
                      error={!!errors.loanTerm}
                      helperText={errors.loanTerm}
                      inputProps={{
                        "aria-label": "Enter loan term in years",
                        min: "1",
                        max: "50",
                      }}
                      placeholder="e.g., 5"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Stack spacing={2}>
                      <Button
                        variant="contained"
                        onClick={calculateLoan}
                        disabled={!loanAmount || !interestRate || !loanTerm}
                        startIcon={<Calculator size={18} />}
                        fullWidth
                        size="large"
                        aria-label="Calculate loan payments and EMI"
                        type="submit"
                      >
                        Calculate EMI
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        startIcon={<RefreshCw size={18} />}
                        fullWidth
                        aria-label="Reset loan calculator form"
                      >
                        Reset Form
                      </Button>
                    </Stack>
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
                role="region"
                aria-labelledby="loan-results-heading"
              >
                {loanResult ? (
                  <Box ref={resultsRef}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TrendingUp size={20} aria-hidden="true" />
                        <Typography
                          variant="h2"
                          component="h2"
                          id="loan-results-heading"
                          sx={{ fontSize: "1.25rem", fontWeight: 600, ml: 1 }}
                        >
                          Loan Summary
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Copy results to clipboard">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy loan results to clipboard"
                          >
                            <Copy size={18} />
                          </IconButton>
                        </Tooltip>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                          <InputLabel id="download-format-label">
                            Download
                          </InputLabel>
                          <Select
                            labelId="download-format-label"
                            value=""
                            onChange={(e) => {
                              const format = e.target.value as
                                | "png"
                                | "pdf"
                                | "csv";
                              if (format) {
                                downloadLoanDetails(format);
                              }
                            }}
                            label="Download"
                            displayEmpty
                            renderValue={() => ""}
                            startAdornment={<Download size={16} />}
                            aria-label="Select download format"
                          >
                            <MenuItem value="png">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Download size={16} />
                                PNG Image
                              </Box>
                            </MenuItem>
                            <MenuItem value="pdf">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Download size={16} />
                                PDF Document
                              </Box>
                            </MenuItem>
                            <MenuItem value="csv">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Download size={16} />
                                CSV Spreadsheet
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>
                    </Box>

                    {/* Loan Type Info */}
                    <Box sx={{ mb: 3 }}>
                      <Chip
                        icon={<Info size={14} />}
                        label={getLoanTypeInfo(loanType).name}
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Paper
                            sx={{
                              p: 3,
                              backgroundColor:
                                theme.palette.primary.main + "10",
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.primary.main}30`,
                            }}
                            role="article"
                            aria-labelledby="monthly-payment-label"
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                              }}
                            >
                              <DollarSign
                                size={20}
                                color={theme.palette.primary.main}
                                aria-hidden="true"
                              />
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                                id="monthly-payment-label"
                                sx={{ ml: 1 }}
                              >
                                Monthly Payment (EMI)
                              </Typography>
                            </Box>
                            <Typography
                              variant="h4"
                              color="primary"
                              fontWeight={700}
                            >
                              {formatCurrency(loanResult.monthlyPayment)}
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
                            role="article"
                            aria-labelledby="total-payment-label"
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              id="total-payment-label"
                            >
                              Total Payment
                            </Typography>
                            <Typography variant="h6" fontWeight={600}>
                              {formatCurrency(loanResult.totalPayment)}
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
                            role="article"
                            aria-labelledby="total-interest-label"
                          >
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                              id="total-interest-label"
                            >
                              Total Interest
                            </Typography>
                            <Typography
                              variant="h6"
                              color="error"
                              fontWeight={600}
                            >
                              {formatCurrency(loanResult.totalInterest)}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} aria-hidden="true" />

                    <Box sx={{ width: "100%", mb: 2 }}>
                      <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        variant="fullWidth"
                        aria-label="Loan details tabs"
                      >
                        <Tab
                          label="Amortization Schedule"
                          id="amortization-tab"
                          aria-controls="amortization-tabpanel"
                        />
                      </Tabs>
                    </Box>

                    <div
                      id="amortization-tabpanel"
                      role="tabpanel"
                      aria-labelledby="amortization-tab"
                    >
                      <TableContainer sx={{ maxHeight: 300, overflow: "auto" }}>
                        <Table
                          size="small"
                          stickyHeader
                          aria-label="Monthly amortization schedule showing payment breakdown"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell scope="col">Month</TableCell>
                              <TableCell scope="col" align="right">
                                Payment (₹)
                              </TableCell>
                              <TableCell scope="col" align="right">
                                Principal (₹)
                              </TableCell>
                              <TableCell scope="col" align="right">
                                Interest (₹)
                              </TableCell>
                              <TableCell scope="col" align="right">
                                Balance (₹)
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {loanResult.amortizationSchedule.map((row) => (
                              <TableRow
                                key={row.month}
                                sx={{
                                  "&:nth-of-type(odd)": {
                                    backgroundColor: theme.palette.action.hover,
                                  },
                                }}
                              >
                                <TableCell scope="row" sx={{ fontWeight: 500 }}>
                                  {row.month}
                                </TableCell>
                                <TableCell align="right">
                                  {formatCurrency(row.payment)}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: theme.palette.success.main }}
                                >
                                  {formatCurrency(row.principal)}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ color: theme.palette.error.main }}
                                >
                                  {formatCurrency(row.interest)}
                                </TableCell>
                                <TableCell
                                  align="right"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {formatCurrency(row.remainingBalance)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
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
                    role="status"
                    aria-live="polite"
                  >
                    <Calculator
                      size={48}
                      color={theme.palette.text.secondary}
                      aria-hidden="true"
                    />
                    <Typography
                      component="p"
                      sx={{ mt: 2, textAlign: "center" }}
                    >
                      Enter loan details to calculate your EMI and view payment
                      breakdown
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </section>

        {isProductionEnv && <AdSense adSlot="6613251015" />}

        <Box sx={{ mt: 8 }}>
          <Divider sx={{ mb: 4 }} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              What is a Loan Calculator?
            </Typography>
            <Typography variant="body1" paragraph>
              A loan calculator is a financial tool that helps you estimate your
              monthly EMI (Equated Monthly Installment) payments, total interest
              costs, and complete amortization schedule for different types of
              loans. It's an essential tool for financial planning that allows
              you to compare loan options, understand payment structures, and
              make informed borrowing decisions.
            </Typography>
            <Typography variant="body1" paragraph>
              Our free online loan calculator supports various loan types
              including personal loans, home loans, auto loans, education loans,
              and business loans. It provides instant calculations with detailed
              breakdowns to help you plan your finances effectively.
            </Typography>
          </motion.div>

          {/* Common Use Cases */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
              sx={{ mt: 4 }}
            >
              Types of Loans and Their Uses
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="personal-loan-content"
                  id="personal-loan-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Personal Loans (10-24% Interest)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="personal-loan-content">
                  <Typography variant="body1">
                    Unsecured loans for various personal expenses including debt
                    consolidation, medical emergencies, home improvements,
                    weddings, or travel. These loans typically have higher
                    interest rates but offer quick approval and flexible usage.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="home-loan-content"
                  id="home-loan-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Home Loans (6.5-9.5% Interest)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="home-loan-content">
                  <Typography variant="body1">
                    Long-term secured loans for purchasing residential or
                    commercial properties. These loans offer the lowest interest
                    rates as the property serves as collateral. Terms typically
                    range from 15-30 years with tax benefits available.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="auto-loan-content"
                  id="auto-loan-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Auto Loans (7-12% Interest)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="auto-loan-content">
                  <Typography variant="body1">
                    Secured loans specifically for purchasing new or used
                    vehicles. The vehicle serves as collateral, resulting in
                    moderate interest rates. Loan terms typically range from 3-7
                    years with options for both individual and commercial
                    vehicles.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="education-loan-content"
                  id="education-loan-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Education Loans (8-15% Interest)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="education-loan-content">
                  <Typography variant="body1">
                    Specialized loans for educational expenses including tuition
                    fees, accommodation, books, and other study-related costs.
                    These loans often offer favorable terms like grace periods,
                    moratorium options, and tax benefits under Section 80E.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="business-loan-content"
                  id="business-loan-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Business Loans (11-20% Interest)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="business-loan-content">
                  <Typography variant="body1">
                    Loans for business purposes including startup funding,
                    working capital, equipment purchase, or business expansion.
                    Interest rates and terms vary based on business profile,
                    credit history, and loan purpose.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
              sx={{ mt: 4 }}
            >
              How Loan EMI Calculation Works
            </Typography>
            <Typography variant="body1" paragraph>
              Loan EMI calculation uses a mathematical formula that considers
              three key factors: Principal amount (P), Annual interest rate (R),
              and Loan tenure in months (N). The formula is: EMI = [P x R x
              (1+R)^N] / [(1+R)^N-1], where R is the monthly interest rate
              (annual rate/12).
            </Typography>
            <Typography variant="body1" paragraph>
              The amortization schedule shows how each EMI payment is divided
              between principal repayment and interest payment. Initially, a
              larger portion goes toward interest, but as the loan progresses,
              more of your payment goes toward the principal amount.
            </Typography>
            <Typography variant="body1" paragraph>
              Understanding this breakdown helps you make informed decisions
              about loan tenure, prepayments, and choosing between different
              loan offers. A longer tenure means lower EMI but higher total
              interest, while a shorter tenure means higher EMI but lower total
              cost.
            </Typography>
          </motion.div>

          {/* Tips for Better Loan Management */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
              sx={{ mt: 4 }}
            >
              Tips for Smart Loan Management
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Typography component="li" variant="body1" paragraph>
                <strong>Compare Multiple Offers:</strong> Use the calculator to
                compare different loan offers by varying interest rates and
                tenures to find the most cost-effective option.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Consider Total Cost:</strong> Don't just focus on EMI
                amount. Calculate the total interest payable over the loan
                tenure to understand the true cost of borrowing.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Plan for Prepayments:</strong> If possible, make
                prepayments to reduce the principal amount, which significantly
                reduces the total interest burden.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Maintain Good Credit Score:</strong> A higher credit
                score helps you negotiate better interest rates, potentially
                saving thousands in interest payments.
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Choose Appropriate Tenure:</strong> Balance between
                affordable EMI and total interest cost. Shorter tenures save
                money but increase monthly burden.
              </Typography>
            </Box>
          </motion.div>
        </Box>

        <SocialShare
          title="Free Online Loan Calculator | Calculate EMI & Interest"
          url={shareLink}
          description="Calculate loan EMI, total interest, and amortization schedule with our free online calculator."
          hashtags={[
            "LoanCalculator",
            "EMI",
            "FinancialPlanning",
            "OnlineTool",
          ]}
        />
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        aria-live="polite"
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          role="alert"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoanCalculator;
