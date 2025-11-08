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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
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
  CheckCircle,
  Coins,
  Scale,
} from "lucide-react";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface GoldResult {
  totalAmount: number;
  pricePerGram: number;
  goldInGrams: number;
  goldInOunces: number;
  goldInTolas: number;
  goldInKilograms: number;
  currency: string;
  purity: number;
  purityAdjustedGrams: number;
  marketDetails: {
    priceType: string;
    lastUpdated: string;
  };
}

interface GoldPurity {
  karat: number;
  percentage: number;
  label: string;
}

const GoldCalculator = () => {
  const theme = useTheme();
  const [totalAmount, setTotalAmount] = useState("");
  const [pricePerGram, setPricePerGram] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [goldPurity, setGoldPurity] = useState(24);

  const [goldResult, setGoldResult] = useState<GoldResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Gold purity options
  const goldPurities: GoldPurity[] = [
    { karat: 24, percentage: 100, label: "24K (Pure Gold)" },
    { karat: 22, percentage: 91.67, label: "22K (Jewelry Gold)" },
    { karat: 21, percentage: 87.5, label: "21K" },
    { karat: 20, percentage: 83.33, label: "20K" },
    { karat: 18, percentage: 75, label: "18K" },
    { karat: 14, percentage: 58.33, label: "14K" },
    { karat: 10, percentage: 41.67, label: "10K" },
  ];

  // Currency options
  const currencies = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateGold = () => {
    const amount = parseFloat(totalAmount);
    const price = parseFloat(pricePerGram);
    const selectedPurity = goldPurities.find((p) => p.karat === goldPurity);

    if (amount > 0 && price > 0 && selectedPurity) {
      // Calculate pure gold grams
      const goldInGrams = amount / price;

      // Adjust for purity
      const purityAdjustedGrams =
        goldInGrams * (selectedPurity.percentage / 100);

      // Convert to other units
      const goldInOunces = goldInGrams / 31.1035; // 1 troy ounce = 31.1035 grams
      const goldInTolas = goldInGrams / 11.6638; // 1 tola = 11.6638 grams
      const goldInKilograms = goldInGrams / 1000;

      setGoldResult({
        totalAmount: amount,
        pricePerGram: price,
        goldInGrams,
        goldInOunces,
        goldInTolas,
        goldInKilograms,
        currency,
        purity: selectedPurity.percentage,
        purityAdjustedGrams,
        marketDetails: {
          priceType: `${selectedPurity.label} Gold`,
          lastUpdated: new Date().toLocaleString(),
        },
      });

      setSnackbarMessage("Gold calculation completed successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Please enter valid amount and price per gram");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const downloadGoldDetails = async (format: "png" | "pdf" | "csv" = "png") => {
    setIsDownloading(true);
    setDownloadMenuAnchorEl(null);

    if (!goldResult) {
      setSnackbarMessage("No gold calculation results to download");
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
    if (!goldResult) return;

    try {
      const currencyInfo = currencies.find(
        (c) => c.code === goldResult.currency
      );
      const csvContent = [
        ["GOLD CALCULATOR RESULTS"],
        [
          "Generated on",
          new Date().toLocaleDateString() +
            " at " +
            new Date().toLocaleTimeString(),
        ],
        ["Website", window.location.origin],
        [""],
        ["PURCHASE DETAILS"],
        [
          "Total Amount",
          `${
            currencyInfo?.symbol || ""
          }${goldResult.totalAmount.toLocaleString()}`,
        ],
        [
          "Price per Gram",
          `${
            currencyInfo?.symbol || ""
          }${goldResult.pricePerGram.toLocaleString()}`,
        ],
        ["Currency", goldResult.currency],
        ["Gold Purity", `${goldResult.purity}% (${goldPurity}K)`],
        [""],
        ["GOLD QUANTITY RESULTS"],
        ["Gold in Grams", goldResult.goldInGrams.toFixed(4)],
        ["Gold in Ounces", goldResult.goldInOunces.toFixed(4)],
        ["Gold in Tolas", goldResult.goldInTolas.toFixed(4)],
        ["Gold in Kilograms", goldResult.goldInKilograms.toFixed(6)],
        ["Purity Adjusted Grams", goldResult.purityAdjustedGrams.toFixed(4)],
        [""],
        ["CONVERSION RATES"],
        ["1 Troy Ounce", "31.1035 grams"],
        ["1 Tola", "11.6638 grams"],
        ["1 Kilogram", "1000 grams"],
        [""],
        ["MARKET INFORMATION"],
        ["Price Type", goldResult.marketDetails.priceType],
        ["Last Updated", goldResult.marketDetails.lastUpdated],
      ];

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
      link.download = `gold_calculation_${timestamp}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      setSnackbarMessage("Gold details downloaded as CSV successfully");
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
    if (!goldResult) return;

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
      doc.setFillColor(255, 193, 7); // Gold color
      doc.rect(0, 0, 210, 35, "F");

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("Gold Calculator Results", 20, 25);

      // Generation info
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

      // Purchase Details Section
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Purchase Details", 20, currentY);

      doc.setLineWidth(0.5);
      doc.setDrawColor(255, 193, 7);
      doc.line(20, currentY + 2, 80, currentY + 2);

      currentY += 15;

      const purchaseDetailsData = [
        ["Total Amount:", `${goldResult.totalAmount.toLocaleString()}`],
        ["Price per Gram:", `${goldResult.pricePerGram.toLocaleString()}`],
        ["Currency:", goldResult.currency],
        ["Gold Purity:", `${goldResult.purity}% (${goldPurity}K)`],
      ];

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      purchaseDetailsData.forEach(([label, value], index) => {
        doc.setFont("helvetica", "bold");
        doc.text(label, 25, currentY + index * 8);
        doc.setFont("helvetica", "normal");
        doc.text(value, 90, currentY + index * 8);
      });

      currentY += 45;

      // Gold Quantity Results
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Gold Quantity Results", 20, currentY);
      doc.line(20, currentY + 2, 105, currentY + 2);
      currentY += 15;

      const quantityBoxes = [
        {
          label: "Grams",
          value: goldResult.goldInGrams.toFixed(4),
          color: [255, 193, 7],
        },
        {
          label: "Ounces",
          value: goldResult.goldInOunces.toFixed(4),
          color: [255, 152, 0],
        },
        {
          label: "Tolas",
          value: goldResult.goldInTolas.toFixed(4),
          color: [255, 111, 0],
        },
      ];

      quantityBoxes.forEach((box, index) => {
        const x = 20 + index * 60;
        const y = currentY;

        doc.setFillColor(box.color[0], box.color[1], box.color[2]);
        doc.roundedRect(x, y, 55, 25, 3, 3, "F");

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(box.label, x + 3, y + 8);

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(box.value, x + 3, y + 18);
      });

      currentY += 40;

      // Conversion Table
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Conversion Reference", 20, currentY);
      doc.line(20, currentY + 2, 95, currentY + 2);
      currentY += 10;

      const conversionData = [
        ["Unit", "Equivalent in Grams"],
        ["1 Troy Ounce", "31.1035 grams"],
        ["1 Tola", "11.6638 grams"],
        ["1 Kilogram", "1000 grams"],
      ];

      if (typeof (doc as any).autoTable === "function") {
        (doc as any).autoTable({
          head: [conversionData[0]],
          body: conversionData.slice(1),
          startY: currentY,
          theme: "striped",
          headStyles: {
            fillColor: [255, 193, 7],
            textColor: [0, 0, 0],
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
          margin: { left: 20, right: 20 },
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generated by KodeKit Gold Calculator`, 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }

      doc.save(`gold_calculation_${timestamp}.pdf`);

      setSnackbarMessage("Gold details downloaded as PDF successfully");
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
    if (!resultsRef.current || !goldResult) return;

    const currencyInfo = currencies.find((c) => c.code === goldResult.currency);
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
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ffc107; padding-bottom: 20px;">
        <h1 style="color: #f57c00; margin: 0; font-size: 28px;">Gold Calculator Results</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #ffc107; padding-left: 10px;">Purchase Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #fff8e1; padding: 20px; border-radius: 8px;">
          <div><strong>Total Amount:</strong> ${
            currencyInfo?.symbol || ""
          }${goldResult.totalAmount.toLocaleString()}</div>
          <div><strong>Price per Gram:</strong> ${
            currencyInfo?.symbol || ""
          }${goldResult.pricePerGram.toLocaleString()}</div>
          <div><strong>Currency:</strong> ${goldResult.currency}</div>
          <div><strong>Gold Purity:</strong> ${
            goldResult.purity
          }% (${goldPurity}K)</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #ffc107; padding-left: 10px;">Gold Quantity Results</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 8px; border: 2px solid #ff9800;">
            <div style="font-size: 20px; font-weight: bold; color: #f57c00;">${goldResult.goldInGrams.toFixed(
              4
            )}</div>
            <div style="font-size: 14px; color: #666;">Grams</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 8px; border: 2px solid #ff9800;">
            <div style="font-size: 18px; font-weight: bold; color: #f57c00;">${goldResult.goldInOunces.toFixed(
              4
            )}</div>
            <div style="font-size: 14px; color: #666;">Ounces</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 8px; border: 2px solid #ff9800;">
            <div style="font-size: 18px; font-weight: bold; color: #f57c00;">${goldResult.goldInTolas.toFixed(
              4
            )}</div>
            <div style="font-size: 14px; color: #666;">Tolas</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #fff3e0; border-radius: 8px; border: 2px solid #ff9800;">
            <div style="font-size: 18px; font-weight: bold; color: #f57c00;">${goldResult.goldInKilograms.toFixed(
              6
            )}</div>
            <div style="font-size: 14px; color: #666;">Kilograms</div>
          </div>
        </div>
      </div>

      <div>
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #ffc107; padding-left: 10px;">Conversion Reference</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #ffc107; color: black;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Unit</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Equivalent in Grams</th>
            </tr>
          </thead>
          <tbody>
            <tr style="background: #fff8e1;">
              <td style="padding: 8px; border: 1px solid #ddd;">1 Troy Ounce</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">31.1035 grams</td>
            </tr>
            <tr style="background: white;">
              <td style="padding: 8px; border: 1px solid #ddd;">1 Tola</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">11.6638 grams</td>
            </tr>
            <tr style="background: #fff8e1;">
              <td style="padding: 8px; border: 1px solid #ddd;">1 Kilogram</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">1000 grams</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 20px;">
        Generated by KodeKit Gold Calculator | ${window.location.href}
      </div>
    `;

    enhancedContent.style.position = "absolute";
    enhancedContent.style.left = "-9999px";
    enhancedContent.style.top = "0";
    document.body.appendChild(enhancedContent);

    try {
      const canvas = await html2canvas(enhancedContent, {
        width: 800,
        height: enhancedContent.scrollHeight,
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `gold_calculation_${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSnackbarMessage("Gold details downloaded as PNG successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } finally {
      document.body.removeChild(enhancedContent);
    }
  };

  const handleReset = () => {
    setTotalAmount("");
    setPricePerGram("");
    setCurrency("INR");
    setGoldPurity(24);
    setGoldResult(null);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!goldResult) return;

    const currencyInfo = currencies.find((c) => c.code === goldResult.currency);
    const resultsText = `
Gold Purchase Summary:
Total Amount: ${
      currencyInfo?.symbol || ""
    }${goldResult.totalAmount.toLocaleString()}
Price per Gram: ${
      currencyInfo?.symbol || ""
    }${goldResult.pricePerGram.toLocaleString()}
Gold Purity: ${goldResult.purity}% (${goldPurity}K)

Gold Quantity:
Grams: ${goldResult.goldInGrams.toFixed(4)}
Ounces: ${goldResult.goldInOunces.toFixed(4)}
Tolas: ${goldResult.goldInTolas.toFixed(4)}
Kilograms: ${goldResult.goldInKilograms.toFixed(6)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("Gold calculation copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  // const getCurrentGoldPrice = () => {
  //   // This would typically fetch from a real API
  //   // For demo purposes, showing sample prices
  //   const samplePrices: { [key: string]: number } = {
  //     INR: 6200, // per gram in INR
  //     USD: 75,   // per gram in USD
  //     EUR: 68,   // per gram in EUR
  //     GBP: 58,   // per gram in GBP
  //     AED: 275,  // per gram in AED
  //     SAR: 281,  // per gram in SAR
  //   };

  //   setPricePerGram(samplePrices[currency]?.toString() || "");
  //   setSnackbarMessage(`Sample ${currency} gold price loaded. Please verify with current market rates.`);
  //   setSnackbarSeverity("info");
  //   setSnackbarOpen(true);
  // };

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
              Gold Calculator - Calculate Gold Quantity from Budget
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
              Calculate how much gold you can buy with your budget. Enter the
              market price per gram and your total amount to get precise gold
              quantities in grams, ounces, tolas, and kilograms.
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
                aria-labelledby="gold-calculator-form"
              >
                <Typography
                  id="gold-calculator-form"
                  variant="h3"
                  component="h3"
                  gutterBottom
                  fontWeight={600}
                  mb={2}
                  sx={{ fontSize: "1.5rem" }}
                >
                  Gold Purchase Details
                </Typography>

                <Grid
                  container
                  spacing={3}
                  component="form"
                  role="form"
                  aria-label="Gold calculation form"
                >
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="total-amount"
                      label="Total Amount to Spend"
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      required
                      aria-describedby="total-amount-help"
                      inputProps={{
                        min: 1,
                        step: 1,
                        "aria-label": "Total amount to spend on gold",
                        "aria-required": "true",
                      }}
                      helperText="Enter the total amount you want to spend on gold"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}
                    >
                      <TextField
                        fullWidth
                        id="price-per-gram"
                        label="Price per Gram"
                        type="number"
                        value={pricePerGram}
                        onChange={(e) => setPricePerGram(e.target.value)}
                        required
                        aria-describedby="price-per-gram-help"
                        inputProps={{
                          min: 1,
                          step: 0.01,
                          "aria-label": "Current gold price per gram",
                          "aria-required": "true",
                        }}
                        helperText="Enter current market price per gram of gold"
                      />
                      {/* <Button
                        variant="outlined"
                        onClick={getCurrentGoldPrice}
                        sx={{ mb: 2.75, minWidth: "auto", px: 2 }}
                        aria-label="Load sample gold price"
                      >
                        <Info size={18} />
                      </Button> */}
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="currency-label">Currency</InputLabel>
                      <Select
                        labelId="currency-label"
                        id="currency"
                        value={currency}
                        label="Currency"
                        onChange={(e) => setCurrency(e.target.value)}
                        aria-describedby="currency-help"
                      >
                        {currencies.map((curr) => (
                          <MenuItem key={curr.code} value={curr.code}>
                            {curr.symbol} {curr.name} ({curr.code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="gold-purity-label">
                        Gold Purity
                      </InputLabel>
                      <Select
                        labelId="gold-purity-label"
                        id="gold-purity"
                        value={goldPurity}
                        label="Gold Purity"
                        onChange={(e) =>
                          setGoldPurity(e.target.value as number)
                        }
                        aria-describedby="gold-purity-help"
                      >
                        {goldPurities.map((purity) => (
                          <MenuItem key={purity.karat} value={purity.karat}>
                            {purity.label} - {purity.percentage}%
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                        onClick={calculateGold}
                        disabled={!totalAmount || !pricePerGram}
                        startIcon={<Calculator size={18} />}
                        size="large"
                        aria-describedby="calculate-button-help"
                        sx={{
                          flex: 1,
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          backgroundColor: "#ffc107",
                          color: "#000",
                          "&:hover": {
                            backgroundColor: "#ffb300",
                          },
                        }}
                      >
                        Calculate Gold Quantity
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        disabled={!totalAmount && !pricePerGram}
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
                      Click to calculate how much gold you can buy with your
                      budget
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
                aria-labelledby="gold-results"
                role="region"
              >
                {goldResult ? (
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
                        id="gold-results"
                        variant="h3"
                        component="h3"
                        gutterBottom
                        fontWeight={600}
                        sx={{ fontSize: "1.5rem" }}
                      >
                        Your Gold Purchase Summary
                      </Typography>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Tooltip title="Copy results to clipboard">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy gold results to clipboard"
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
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: "#fff8e1",
                              borderRadius: 2,
                              border: "1px solid #ffc107",
                            }}
                          >
                            <Typography
                              variant="h4"
                              component="h4"
                              color="#000"
                              sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
                            >
                              Total Gold (Grams)
                            </Typography>
                            <Typography
                              variant="h3"
                              component="div"
                              sx={{
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                                fontWeight: 700,
                                color: "#f57c00",
                              }}
                              aria-label={`Total gold is ${goldResult.goldInGrams.toFixed(
                                4
                              )} grams`}
                            >
                              {goldResult.goldInGrams.toFixed(4)} g
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: "#fff3e0",
                              borderRadius: 2,
                              border: "1px solid #ff9800",
                            }}
                          >
                            <Typography
                              variant="h4"
                              component="h4"
                              color="#000"
                              sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
                            >
                              Purity Adjusted
                            </Typography>
                            <Typography
                              variant="h3"
                              component="div"
                              sx={{
                                fontSize: { xs: "1.5rem", sm: "2rem" },
                                fontWeight: 700,
                                color: "#f57c00",
                              }}
                              aria-label={`Purity adjusted gold is ${goldResult.purityAdjustedGrams.toFixed(
                                4
                              )} grams`}
                            >
                              {goldResult.purityAdjustedGrams.toFixed(4)} g
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
                        Gold Quantity in Different Units
                      </Typography>
                    </Box>

                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{ border: `1px solid ${theme.palette.divider}` }}
                    >
                      <Table
                        size="small"
                        aria-label="Gold quantity in different units"
                      >
                        <TableHead>
                          <TableRow sx={{ backgroundColor: "#fff8e1" }}>
                            <TableCell>
                              <Typography
                                variant="subtitle2"
                                color="#000"
                                fontWeight={600}
                              >
                                Unit
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="subtitle2"
                                color="#000"
                                fontWeight={600}
                              >
                                Quantity
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="subtitle2"
                                color="#000"
                                fontWeight={600}
                              >
                                Conversion Rate
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Scale size={16} color="#f57c00" />
                                <Typography variant="body2" fontWeight={500}>
                                  Grams
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="#f57c00"
                              >
                                {goldResult.goldInGrams.toFixed(4)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Base unit
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Coins size={16} color="#f57c00" />
                                <Typography variant="body2" fontWeight={500}>
                                  Troy Ounces
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="#f57c00"
                              >
                                {goldResult.goldInOunces.toFixed(4)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                31.1035 g/oz
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Target size={16} color="#f57c00" />
                                <Typography variant="body2" fontWeight={500}>
                                  Tolas
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="#f57c00"
                              >
                                {goldResult.goldInTolas.toFixed(4)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                11.6638 g/tola
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Scale size={16} color="#f57c00" />
                                <Typography variant="body2" fontWeight={500}>
                                  Kilograms
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="#f57c00"
                              >
                                {goldResult.goldInKilograms.toFixed(6)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                1000 g/kg
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Box sx={{ mt: 3 }}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Gold Purity:</strong> {goldResult.purity}% (
                          {goldPurity}K) - Purity adjusted quantity:{" "}
                          {goldResult.purityAdjustedGrams.toFixed(4)} grams of
                          pure gold content.
                        </Typography>
                      </Alert>

                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        <Chip
                          icon={<DollarSign size={16} />}
                          label={`Total: ${
                            currencies.find(
                              (c) => c.code === goldResult.currency
                            )?.symbol
                          }${goldResult.totalAmount.toLocaleString()}`}
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          icon={<TrendingUp size={16} />}
                          label={`Rate: ${
                            currencies.find(
                              (c) => c.code === goldResult.currency
                            )?.symbol
                          }${goldResult.pricePerGram}/g`}
                          variant="outlined"
                          color="secondary"
                        />
                        <Chip
                          icon={<Coins size={16} />}
                          label={`${goldResult.purity}% Purity`}
                          variant="outlined"
                          sx={{ color: "#f57c00", borderColor: "#f57c00" }}
                        />
                      </Box>
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
                      id="gold-results"
                      variant="h3"
                      component="h3"
                      gutterBottom
                      sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 3 }}
                    >
                      Gold Calculator Ready
                    </Typography>

                    <Coins size={48} color="#ffc107" aria-hidden="true" />
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
                      Enter your budget and gold price
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
                      Calculate exactly how much gold you can purchase with your
                      budget. Get quantities in grams, ounces, tolas, and
                      kilograms with purity adjustments.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          <AdSense adSlot="3146398237" />

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
              Key Features of Our Gold Calculator
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
                    <Calculator size={40} color="#ffc107" />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Accurate Gold Calculations
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Precise calculations based on current market prices and
                      gold purity levels.
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
                    <Scale size={40} color="#ff9800" />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Multiple Units
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get results in grams, ounces, tolas, and kilograms with
                      conversion rates.
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
                    <Coins size={40} color="#f57c00" />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Purity Adjustment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calculates pure gold content based on karat rating (10K to
                      24K).
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
                    <DollarSign size={40} color="#4caf50" />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Multi-Currency Support
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Supports major currencies including INR, USD, EUR, GBP,
                      AED, and SAR.
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
                    <Download size={40} color="#2196f3" />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Export Results
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Download calculations as PNG, PDF, or CSV for record
                      keeping.
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
                    <CheckCircle size={40} color="#4caf50" />
                    <Typography
                      variant="h6"
                      component="h4"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Free & Secure
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completely free to use with no registration. All
                      calculations done locally.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* About Gold Section */}
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
            aria-labelledby="about-gold"
          >
            <Typography
              id="about-gold"
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.75rem" }}
            >
              Understanding Gold Measurements and Purity
            </Typography>
            <Typography paragraph>
              Gold is measured in various units worldwide, and understanding
              these measurements is crucial for making informed purchases. Our
              calculator helps you convert between different units and adjust
              for gold purity to give you accurate quantities.
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
                  Gold Measurement Units
                </Typography>
                <List sx={{ pl: 0 }}>
                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Scale size={20} color="#ffc107" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Gram (g)
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          The most common unit for gold measurement worldwide.
                          Base unit for most calculations.
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Coins size={20} color="#ffc107" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Troy Ounce (oz)
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Standard unit for precious metals trading. 1 troy
                          ounce = 31.1035 grams.
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Target size={20} color="#ffc107" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Tola
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Traditional unit in South Asia. 1 tola = 11.6638 grams
                          (10 grams in some regions).
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Scale size={20} color="#ffc107" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          Kilogram (kg)
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Used for large quantities. 1 kilogram = 1000 grams.
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="h4"
                  component="h4"
                  gutterBottom
                  fontWeight={600}
                  sx={{ fontSize: "1.25rem" }}
                >
                  Gold Purity (Karat System)
                </Typography>
                <List sx={{ pl: 0 }}>
                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Coins size={20} color="#ffd700" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          24K Gold (100% Pure)
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Pure gold, soft and malleable. Mainly used for
                          investment and bullion.
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Coins size={20} color="#ffcc02" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          22K Gold (91.67% Pure)
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Most common for jewelry in India and Middle East. Good
                          balance of purity and durability.
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Coins size={20} color="#ffb300" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          18K Gold (75% Pure)
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Popular for fine jewelry worldwide. More durable than
                          higher karat gold.
                        </Typography>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                      <Coins size={20} color="#ff9800" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2" fontWeight={600}>
                          14K Gold (58.33% Pure)
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Common in Western countries. More affordable and
                          durable for everyday wear.
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
                    How accurate is this gold calculator?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Our calculator uses standard conversion rates and
                    mathematical formulas to provide accurate results. However,
                    actual gold prices fluctuate constantly, so always verify
                    current market rates before making purchases.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    What's the difference between 22K and 24K gold?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    24K gold is 100% pure but soft and malleable. 22K gold
                    (91.67% pure) is mixed with other metals for durability,
                    making it ideal for jewelry. The price difference reflects
                    the purity percentage.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    How do I get current gold prices?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Check reputable financial websites, local jewelers, or
                    precious metals dealers for current gold prices. Prices vary
                    by location, purity, and whether you're buying coins, bars,
                    or jewelry.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    What is a tola and where is it used?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    A tola is a traditional unit of mass used in South Asia,
                    particularly India, Pakistan, and Nepal. 1 tola equals
                    11.6638 grams. It's commonly used for gold trading in these
                    regions.
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
                    Should I buy gold by weight or by piece?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    For investment purposes, buying by weight (grams/ounces) is
                    more transparent and fair. For jewelry, consider both weight
                    and craftsmanship. Always ask for weight certificates and
                    purity hallmarks.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    What additional costs should I consider?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Besides the gold price, consider making charges (for
                    jewelry), taxes, certification fees, and dealer premiums.
                    These can add 10-25% to the base gold price depending on the
                    type of purchase.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    How do I verify gold purity?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Look for hallmark stamps indicating karat rating and
                    certification. Reputable dealers provide purity
                    certificates. For expensive purchases, consider third-party
                    testing or buy from certified dealers only.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    Can I use this calculator for selling gold?
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Yes, but remember that selling prices are typically lower
                    than buying prices. Dealers offer 85-95% of current market
                    rates. Use the calculator to estimate value, but get quotes
                    from multiple dealers.
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
              How to Use the Gold Calculator
            </Typography>

            <List sx={{ pl: 0 }}>
              <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: "#ffc107",
                      color: "black",
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
                      Enter Your Budget
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Input the total amount you want to spend on gold in your
                      preferred currency.
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
                      backgroundColor: "#ffc107",
                      color: "black",
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
                      Set Current Gold Price
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Enter the current market price per gram. Use the info
                      button to load sample prices, but verify with current
                      rates.
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
                      backgroundColor: "#ffc107",
                      color: "black",
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
                      Select Currency and Purity
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Choose your currency and gold purity (karat rating) from
                      10K to 24K based on your purchase type.
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
                      backgroundColor: "#ffc107",
                      color: "black",
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
                      Calculate and Review Results
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="text.secondary">
                      Click "Calculate Gold Quantity" to see how much gold you
                      can buy in grams, ounces, tolas, and kilograms with purity
                      adjustments.
                    </Typography>
                  }
                />
              </ListItem>
            </List>

            <Alert severity="warning" sx={{ mt: 3 }} role="note">
              <Typography variant="body2">
                <strong>Investment Disclaimer:</strong> Gold prices fluctuate
                constantly based on market conditions. This calculator provides
                estimates based on your inputs. Always verify current market
                prices and consider additional costs like taxes, making charges,
                and dealer premiums before making purchases.
              </Typography>
            </Alert>
          </Paper>

          {/* AdSense */}
          <AdSense adSlot="4201858400" />
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
            onClick={() => downloadGoldDetails("png")}
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
            onClick={() => downloadGoldDetails("pdf")}
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
            onClick={() => downloadGoldDetails("csv")}
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

export default GoldCalculator;
