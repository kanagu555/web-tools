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
    Divider,
    Snackbar,
    Alert,
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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tooltip,
    Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
    Calculator,
    Download,
    Copy,
    RefreshCw,
    TrendingUp,
    DollarSign,
    CheckCircle,
    Landmark,
    CalendarClock,
    Percent,
} from "lucide-react";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface FDResult {
    principalAmount: number;
    interestEarned: number;
    maturityAmount: number;
    effectiveInterestRate: number;
    growthSchedule: Array<{
        year: number;
        quarter: number;
        principalAmount: number;
        interestEarned: number;
        totalValue: number;
    }>;
}

type CompoundingFrequency = "quarterly" | "monthly" | "annually" | "cumulative";

const FDCalculator = () => {
    const theme = useTheme();
    const [principalAmount, setPrincipalAmount] = useState("");
    const [interestRate, setInterestRate] = useState("");
    const [tenure, setTenure] = useState("");
    const [tenureUnit, setTenureUnit] = useState<"years" | "months">("years");
    const [compoundingFrequency, setCompoundingFrequency] =
        useState<CompoundingFrequency>("quarterly");
    const [activeTab, setActiveTab] = useState(0);
    const [fdResult, setFdResult] = useState<FDResult | null>(null);
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

    const calculateFD = () => {
        const principal = parseFloat(principalAmount);
        const rate = parseFloat(interestRate) / 100;
        const tenureInYears =
            tenureUnit === "years" ? parseFloat(tenure) : parseFloat(tenure) / 12;

        if (principal > 0 && rate > 0 && tenureInYears > 0) {
            let maturityAmount = 0;
            let compoundingPeriodsPerYear = 0;
            let effectiveRate = 0;

            // Determine compounding frequency
            switch (compoundingFrequency) {
                case "quarterly":
                    compoundingPeriodsPerYear = 4;
                    break;
                case "monthly":
                    compoundingPeriodsPerYear = 12;
                    break;
                case "annually":
                    compoundingPeriodsPerYear = 1;
                    break;
                case "cumulative":
                    compoundingPeriodsPerYear = 1;
                    break;
            }

            // Calculate maturity amount using compound interest formula
            // A = P(1 + r/n)^(nt)
            if (compoundingFrequency === "cumulative") {
                // For cumulative, interest is paid at maturity
                maturityAmount = principal * (1 + rate * tenureInYears);
                effectiveRate = rate;
            } else {
                const n = compoundingPeriodsPerYear;
                const t = tenureInYears;
                maturityAmount = principal * Math.pow(1 + rate / n, n * t);

                // Calculate effective annual rate
                effectiveRate = Math.pow(1 + rate / n, n) - 1;
            }

            const interestEarned = maturityAmount - principal;

            // Generate growth schedule
            const schedule = [];
            const totalQuarters = Math.ceil(tenureInYears * 4);

            for (let quarter = 1; quarter <= totalQuarters; quarter++) {
                const timeInYears = quarter / 4;
                let currentValue = 0;

                if (compoundingFrequency === "cumulative") {
                    currentValue = principal * (1 + rate * timeInYears);
                } else {
                    const n = compoundingPeriodsPerYear;
                    currentValue = principal * Math.pow(1 + rate / n, n * timeInYears);
                }

                const currentInterest = currentValue - principal;

                // Add quarterly entries for the first year, then yearly
                if (quarter <= 4 || quarter % 4 === 0 || quarter === totalQuarters) {
                    schedule.push({
                        year: Math.ceil(quarter / 4),
                        quarter,
                        principalAmount: principal,
                        interestEarned: currentInterest,
                        totalValue: currentValue,
                    });
                }
            }

            setFdResult({
                principalAmount: principal,
                interestEarned,
                maturityAmount,
                effectiveInterestRate: effectiveRate * 100,
                growthSchedule: schedule,
            });

            setSnackbarMessage("FD calculated successfully");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage("Please enter valid values for all fields");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const downloadFDDetails = async (format: "png" | "pdf" | "csv" = "png") => {
        setIsDownloading(true);
        setDownloadMenuAnchorEl(null);

        if (!fdResult) {
            setSnackbarMessage("No FD calculation results to download");
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
        if (!fdResult) return;

        try {
            const csvContent = [
                ["FIXED DEPOSIT CALCULATOR RESULTS"],
                [
                    "Generated on",
                    new Date().toLocaleDateString() +
                    " at " +
                    new Date().toLocaleTimeString(),
                ],
                ["Website", window.location.origin],
                [""],
                ["FD INVESTMENT DETAILS"],
                [
                    "Principal Amount (₹)",
                    parseFloat(principalAmount).toLocaleString("en-IN"),
                ],
                ["Interest Rate (% p.a.)", interestRate],
                ["Tenure", `${tenure} ${tenureUnit}`],
                ["Compounding Frequency", compoundingFrequency],
                [""],
                ["INVESTMENT SUMMARY"],
                ["Principal Amount (₹)", fdResult.principalAmount.toFixed(0)],
                ["Interest Earned (₹)", fdResult.interestEarned.toFixed(0)],
                ["Maturity Amount (₹)", fdResult.maturityAmount.toFixed(0)],
                [
                    "Effective Interest Rate (%)",
                    fdResult.effectiveInterestRate.toFixed(2),
                ],
                [
                    "Returns as % of Investment",
                    (
                        (fdResult.interestEarned / fdResult.principalAmount) *
                        100
                    ).toFixed(2) + "%",
                ],
                [""],
                ["GROWTH SCHEDULE"],
                [
                    "Year",
                    "Quarter",
                    "Principal (₹)",
                    "Interest Earned (₹)",
                    "Total Value (₹)",
                ],
            ];

            fdResult.growthSchedule.forEach((row) => {
                csvContent.push([
                    row.year.toString(),
                    row.quarter.toString(),
                    row.principalAmount.toFixed(0),
                    row.interestEarned.toFixed(0),
                    row.totalValue.toFixed(0),
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
            link.download = `fd_calculation_${timestamp}.csv`;
            link.style.display = "none";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => URL.revokeObjectURL(link.href), 100);

            setSnackbarMessage("FD details downloaded as CSV successfully");
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
        if (!fdResult) return;

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
            doc.setFillColor(25, 118, 210); // Blue color
            doc.rect(0, 0, 210, 35, "F");

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("Fixed Deposit Calculator Results", 20, 25);

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

            // FD Details Section
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("FD Investment Details", 20, currentY);

            doc.setLineWidth(0.5);
            doc.setDrawColor(25, 118, 210);
            doc.line(20, currentY + 2, 100, currentY + 2);

            currentY += 15;

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");

            const fdDetailsData = [
                [
                    "Principal Amount:",
                    `Rs. ${parseFloat(principalAmount).toLocaleString("en-IN")}`,
                ],
                ["Interest Rate:", `${interestRate}% per annum`],
                ["Tenure:", `${tenure} ${tenureUnit}`],
                ["Compounding:", compoundingFrequency],
            ];

            fdDetailsData.forEach(([label, value], index) => {
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

            doc.line(20, currentY + 2, 95, currentY + 2);
            currentY += 15;

            const summaryBoxes = [
                {
                    label: "Maturity Amount",
                    value: `Rs. ${fdResult.maturityAmount.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                    })}`,
                    color: [25, 118, 210],
                },
                {
                    label: "Principal Amount",
                    value: `Rs. ${fdResult.principalAmount.toLocaleString("en-IN", {
                        maximumFractionDigits: 0,
                    })}`,
                    color: [156, 39, 176],
                },
                {
                    label: "Interest Earned",
                    value: `Rs. ${fdResult.interestEarned.toLocaleString("en-IN", {
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
            doc.text("Investment Growth Schedule", 20, currentY);

            doc.line(20, currentY + 2, 120, currentY + 2);
            currentY += 10;

            const tableHeaders = [
                "Year",
                "Quarter",
                "Principal (Rs.)",
                "Interest (Rs.)",
                "Total (Rs.)",
            ];
            const tableData = fdResult.growthSchedule.map((row) => [
                row.year.toString(),
                `Q${((row.quarter - 1) % 4) + 1}`,
                row.principalAmount.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                }),
                row.interestEarned.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                }),
                row.totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 }),
            ]);

            if (typeof (doc as any).autoTable === "function") {
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
                        1: { halign: "center", cellWidth: 25 },
                        2: { halign: "right", cellWidth: 40 },
                        3: { halign: "right", cellWidth: 40 },
                        4: { halign: "right", cellWidth: 40 },
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
                doc.text(`Generated by KodeKit FD Calculator`, 20, 285);
                doc.text(`Page ${i} of ${pageCount}`, 170, 285);
            }

            doc.save(`fd_calculation_${timestamp}.pdf`);

            setSnackbarMessage("FD details downloaded as PDF successfully");
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
        if (!resultsRef.current || !fdResult) return;

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
        <h1 style="color: #1976d2; margin: 0; font-size: 28px;">Fixed Deposit Calculator Results</h1>
        <p style="color: #666; margin: 5px 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #1976d2; padding-left: 10px;">FD Investment Details</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #e3f2fd; padding: 20px; border-radius: 8px;">
          <div><strong>Principal Amount:</strong> Rs. ${parseFloat(
            principalAmount
        ).toLocaleString("en-IN")}</div>
          <div><strong>Interest Rate:</strong> ${interestRate}% p.a.</div>
          <div><strong>Tenure:</strong> ${tenure} ${tenureUnit}</div>
          <div><strong>Compounding:</strong> ${compoundingFrequency}</div>
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #1976d2; padding-left: 10px;">Investment Summary</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
          <div style="text-align: center; padding: 20px; background: #e3f2fd; border-radius: 8px; border: 2px solid #1976d2;">
            <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Rs. ${fdResult.maturityAmount.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 0 }
        )}</div>
            <div style="font-size: 14px; color: #666;">Maturity Amount</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #f3e5f5; border-radius: 8px; border: 2px solid #9c27b0;">
            <div style="font-size: 18px; font-weight: bold; color: #9c27b0;">Rs. ${fdResult.principalAmount.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 0 }
        )}</div>
            <div style="font-size: 14px; color: #666;">Principal Amount</div>
          </div>
          <div style="text-align: center; padding: 20px; background: #e8f5e8; border-radius: 8px; border: 2px solid #4caf50;">
            <div style="font-size: 18px; font-weight: bold; color: #4caf50;">Rs. ${fdResult.interestEarned.toLocaleString(
            "en-IN",
            { maximumFractionDigits: 0 }
        )}</div>
            <div style="font-size: 14px; color: #666;">Interest Earned</div>
          </div>
        </div>
      </div>

      <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #ddd; padding-top: 20px;">
        Generated by KodeKit FD Calculator | ${window.location.href}
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
            link.download = `fd_calculation_${timestamp}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setSnackbarMessage("FD details downloaded as PNG successfully");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
        } finally {
            document.body.removeChild(enhancedContent);
        }
    };

    const handleReset = () => {
        setPrincipalAmount("");
        setInterestRate("");
        setTenure("");
        setTenureUnit("years");
        setCompoundingFrequency("quarterly");
        setFdResult(null);
        setActiveTab(0);

        setSnackbarMessage("Form reset successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
    };

    const handleCopyResults = () => {
        if (!fdResult) return;

        const resultsText = `
Fixed Deposit Summary:
Principal Amount: Rs. ${parseFloat(principalAmount).toFixed(2)}
Interest Rate: ${interestRate}% p.a.
Tenure: ${tenure} ${tenureUnit}
Compounding: ${compoundingFrequency}
Maturity Amount: Rs. ${fdResult.maturityAmount.toFixed(2)}
Interest Earned: Rs. ${fdResult.interestEarned.toFixed(2)}
`;

        navigator.clipboard.writeText(resultsText);
        setSnackbarMessage("FD summary copied to clipboard");
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
                            Fixed Deposit Calculator (FD)
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
                            Calculate your Fixed Deposit maturity amount and interest details
                            instantly. Plan your investments with our accurate FD calculator.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {/* Input Section */}
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
                                aria-labelledby="fd-calculator-form"
                            >
                                <Typography
                                    id="fd-calculator-form"
                                    variant="h3"
                                    component="h3"
                                    gutterBottom
                                    fontWeight={600}
                                    mb={2}
                                    sx={{ fontSize: "1.5rem" }}
                                >
                                    FD Details
                                </Typography>

                                <Box component="form" noValidate autoComplete="off">
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Principal Amount (₹)"
                                                type="number"
                                                value={principalAmount}
                                                onChange={(e) => setPrincipalAmount(e.target.value)}
                                                required
                                                variant="outlined"
                                                inputProps={{ min: 0, step: 1000 }}
                                                helperText="Minimum deposit amount"
                                                sx={{
                                                    "& input[type=number]": {
                                                        MozAppearance: "textfield",
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Interest Rate (% per annum)"
                                                type="number"
                                                value={interestRate}
                                                onChange={(e) => setInterestRate(e.target.value)}
                                                required
                                                variant="outlined"
                                                inputProps={{ min: 0, max: 20, step: 0.1 }}
                                                helperText="Annual interest rate offered by bank"
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={7}>
                                                    <TextField
                                                        fullWidth
                                                        label="Tenure"
                                                        type="number"
                                                        value={tenure}
                                                        onChange={(e) => setTenure(e.target.value)}
                                                        required
                                                        variant="outlined"
                                                        inputProps={{ min: 0, step: 1 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <FormControl fullWidth>
                                                        <InputLabel>Unit</InputLabel>
                                                        <Select
                                                            value={tenureUnit}
                                                            label="Unit"
                                                            onChange={(e) =>
                                                                setTenureUnit(
                                                                    e.target.value as "years" | "months"
                                                                )
                                                            }
                                                        >
                                                            <MenuItem value="years">Years</MenuItem>
                                                            <MenuItem value="months">Months</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Compounding Frequency</InputLabel>
                                                <Select
                                                    value={compoundingFrequency}
                                                    label="Compounding Frequency"
                                                    onChange={(e) =>
                                                        setCompoundingFrequency(
                                                            e.target.value as CompoundingFrequency
                                                        )
                                                    }
                                                >
                                                    <MenuItem value="quarterly">Quarterly</MenuItem>
                                                    <MenuItem value="monthly">Monthly</MenuItem>
                                                    <MenuItem value="annually">Annually</MenuItem>
                                                    <MenuItem value="cumulative">
                                                        Cumulative (At Maturity)
                                                    </MenuItem>
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
                                                    fullWidth
                                                    variant="contained"
                                                    size="large"
                                                    onClick={calculateFD}
                                                    disabled={
                                                        !principalAmount || !interestRate || !tenure
                                                    }
                                                    startIcon={<Calculator size={20} />}
                                                    sx={{
                                                        flex: 1,
                                                        py: 1.5,
                                                        fontWeight: 600,
                                                        fontSize: "1.1rem",
                                                        textTransform: "none",
                                                        backgroundColor: theme.palette.primary.main,
                                                    }}
                                                >
                                                    Calculate FD
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    size="large"
                                                    color="error"
                                                    onClick={handleReset}
                                                    disabled={!principalAmount && !interestRate && !tenure}
                                                    startIcon={<RefreshCw size={20} />}
                                                    sx={{
                                                        py: 1.5,
                                                        minWidth: { xs: "auto", sm: "120px" },
                                                        fontWeight: 600,
                                                        textTransform: "none",
                                                    }}
                                                >
                                                    Reset
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Results Section */}
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
                                aria-labelledby="fd-results"
                                role="region"
                            >
                                {fdResult ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        ref={resultsRef}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 2,
                                            }}
                                        >
                                            <Typography
                                                id="fd-results"
                                                variant="h3"
                                                component="h3"
                                                gutterBottom
                                                fontWeight={600}
                                                sx={{ fontSize: "1.5rem" }}
                                            >
                                                Your FD Maturity Details
                                            </Typography>
                                            <Box
                                                sx={{ display: "flex", gap: 1, alignItems: "center" }}
                                            >
                                                <Tooltip title="Copy results">
                                                    <IconButton
                                                        onClick={handleCopyResults}
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        <Copy size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Download results">
                                                    <IconButton
                                                        onClick={(e) =>
                                                            setDownloadMenuAnchorEl(e.currentTarget)
                                                        }
                                                        color="primary"
                                                        disabled={isDownloading}
                                                        size="small"
                                                    >
                                                        {isDownloading ? (
                                                            <CircularProgress size={20} />
                                                        ) : (
                                                            <Download size={20} />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                                <Menu
                                                    anchorEl={downloadMenuAnchorEl}
                                                    open={Boolean(downloadMenuAnchorEl)}
                                                    onClose={() => setDownloadMenuAnchorEl(null)}
                                                >
                                                    <MuiMenuItem
                                                        onClick={() => downloadFDDetails("png")}
                                                    >
                                                        Download as PNG
                                                    </MuiMenuItem>
                                                    <MuiMenuItem
                                                        onClick={() => downloadFDDetails("pdf")}
                                                    >
                                                        Download as PDF
                                                    </MuiMenuItem>
                                                    <MuiMenuItem
                                                        onClick={() => downloadFDDetails("csv")}
                                                    >
                                                        Download as CSV
                                                    </MuiMenuItem>
                                                </Menu>
                                            </Box>
                                        </Box>

                                        {/* Summary Cards */}
                                        <Grid container spacing={2} sx={{ mb: 3 }}>
                                            <Grid item xs={12} sm={6}>
                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: "#e3f2fd", // Light blue
                                                        borderRadius: 2,
                                                        border: `1px solid ${theme.palette.primary.main}`,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h4"
                                                        component="h4"
                                                        color="text.primary"
                                                        sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
                                                    >
                                                        Maturity Amount
                                                    </Typography>
                                                    <Typography
                                                        variant="h3"
                                                        component="div"
                                                        sx={{
                                                            fontSize: { xs: "1.5rem", sm: "2rem" },
                                                            fontWeight: 700,
                                                            color: theme.palette.primary.main,
                                                        }}
                                                    >
                                                        ₹
                                                        {fdResult.maturityAmount.toLocaleString("en-IN", {
                                                            maximumFractionDigits: 0,
                                                        })}
                                                    </Typography>
                                                </Paper>
                                            </Grid>

                                            <Grid item xs={12} sm={6}>
                                                <Paper
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: "#e8f5e9", // Light green
                                                        borderRadius: 2,
                                                        border: `1px solid ${theme.palette.success.main}`,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h4"
                                                        component="h4"
                                                        color="text.primary"
                                                        sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
                                                    >
                                                        Interest Earned
                                                    </Typography>
                                                    <Typography
                                                        variant="h3"
                                                        component="div"
                                                        sx={{
                                                            fontSize: { xs: "1.5rem", sm: "2rem" },
                                                            fontWeight: 700,
                                                            color: theme.palette.success.main,
                                                        }}
                                                    >
                                                        ₹
                                                        {fdResult.interestEarned.toLocaleString("en-IN", {
                                                            maximumFractionDigits: 0,
                                                        })}
                                                    </Typography>
                                                </Paper>
                                            </Grid>
                                        </Grid>

                                        <Divider sx={{ my: 2 }} />

                                        {/* Tabs */}
                                        <Tabs
                                            value={activeTab}
                                            onChange={(_, newValue) => setActiveTab(newValue)}
                                            sx={{ mb: 2 }}
                                            variant="fullWidth"
                                        >
                                            <Tab label="Growth Schedule" />
                                            <Tab label="Detailed Summary" />
                                        </Tabs>

                                        {/* Growth Schedule Tab */}
                                        {activeTab === 0 && (
                                            <TableContainer
                                                component={Paper}
                                                elevation={0}
                                                sx={{
                                                    border: `1px solid ${theme.palette.divider}`,
                                                    maxHeight: 300,
                                                }}
                                            >
                                                <Table stickyHeader size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                                                            <TableCell>
                                                                <strong>Year</strong>
                                                            </TableCell>
                                                            <TableCell>
                                                                <strong>Quarter</strong>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <strong>Principal (₹)</strong>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <strong>Interest (₹)</strong>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <strong>Total (₹)</strong>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {fdResult.growthSchedule.map((row, index) => (
                                                            <TableRow
                                                                key={index}
                                                                sx={{
                                                                    "&:nth-of-type(odd)": {
                                                                        backgroundColor: "action.hover",
                                                                    },
                                                                }}
                                                            >
                                                                <TableCell>{row.year}</TableCell>
                                                                <TableCell>
                                                                    Q{((row.quarter - 1) % 4) + 1}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {row.principalAmount.toLocaleString("en-IN", {
                                                                        maximumFractionDigits: 0,
                                                                    })}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{ color: "success.main" }}
                                                                >
                                                                    {row.interestEarned.toLocaleString("en-IN", {
                                                                        maximumFractionDigits: 0,
                                                                    })}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{ fontWeight: 600 }}
                                                                >
                                                                    {row.totalValue.toLocaleString("en-IN", {
                                                                        maximumFractionDigits: 0,
                                                                    })}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}

                                        {/* Summary Tab */}
                                        {activeTab === 1 && (
                                            <Box sx={{ mt: 2 }}>
                                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                                                    <Chip
                                                        icon={<DollarSign size={16} />}
                                                        label={`Principal: ₹${fdResult.principalAmount.toLocaleString("en-IN")}`}
                                                        variant="outlined"
                                                        color="primary"
                                                    />
                                                    <Chip
                                                        icon={<Percent size={16} />}
                                                        label={`Rate: ${interestRate}%`}
                                                        variant="outlined"
                                                        color="secondary"
                                                    />
                                                </Box>

                                                <List dense>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <Landmark size={20} color={theme.palette.primary.main} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Effective Yield"
                                                            secondary={`${fdResult.effectiveInterestRate.toFixed(2)}%`}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <CalendarClock size={20} color={theme.palette.secondary.main} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Tenure"
                                                            secondary={`${tenure} ${tenureUnit}`}
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            <TrendingUp size={20} color={theme.palette.success.main} />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Returns on Investment"
                                                            secondary={`${((fdResult.interestEarned / fdResult.principalAmount) * 100).toFixed(2)}%`}
                                                        />
                                                    </ListItem>
                                                </List>
                                            </Box>
                                        )}
                                    </motion.div>
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
                                    >
                                        <Typography
                                            variant="h3"
                                            component="h3"
                                            gutterBottom
                                            sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 3 }}
                                        >
                                            Ready to Calculate?
                                        </Typography>
                                        <Landmark
                                            size={48}
                                            color={theme.palette.primary.main}
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
                                            Enter your FD details
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
                                            Find out your returns, maturity amount and interest earned with our easy-to-use Fixed Deposit Calculator.
                                        </Typography>
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* AdSense */}
                    <Box sx={{ mt: 6 }}>
                        <AdSense adSlot="4201858400" />
                    </Box>

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
                    >
                        <Typography
                            variant="h3"
                            component="h3"
                            gutterBottom
                            fontWeight={600}
                            sx={{ fontSize: "1.75rem", mb: 3 }}
                        >
                            Key Features of FD Calculator
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                                        <Calculator size={40} color={theme.palette.primary.main} />
                                        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>Accurate Results</Typography>
                                        <Typography variant="body2" color="text.secondary">Precise calculation of interest and maturity amount.</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                                        <RefreshCw size={40} color={theme.palette.secondary.main} />
                                        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>Flexible Compounding</Typography>
                                        <Typography variant="body2" color="text.secondary">Support for Monthly, Quarterly, and Annual compounding.</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Card elevation={0} sx={{ height: '100%', border: `1px solid ${theme.palette.divider}` }}>
                                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                                        <Download size={40} color={theme.palette.success.main} />
                                        <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>Instant Exports</Typography>
                                        <Typography variant="body2" color="text.secondary">Download reports in PDF, CSV or PNG formats.</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* About FD Section */}
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
                    >
                        <Typography variant="h3" component="h3" gutterBottom fontWeight={600} sx={{ fontSize: "1.75rem" }}>
                            Understanding Fixed Deposits
                        </Typography>
                        <Typography paragraph>
                            A Fixed Deposit (FD) is a secure investment instrument offered by banks and non-banking financial companies (NBFCs). It offers higher interest rates compared to regular savings accounts, making it a popular choice for risk-free returns.
                        </Typography>
                        <Grid container spacing={3} sx={{ mt: 2 }}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" component="h4" fontWeight={600} gutterBottom sx={{ fontSize: "1.25rem" }}>
                                    Benefits of FD
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemIcon><CheckCircle size={20} color={theme.palette.success.main} /></ListItemIcon>
                                        <ListItemText primary="Guaranteed Returns" secondary="Market fluctuations do not affect your returns." />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><CheckCircle size={20} color={theme.palette.success.main} /></ListItemIcon>
                                        <ListItemText primary="High Liquidity" secondary="You can withdraw prematurely with a small penalty." />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><CheckCircle size={20} color={theme.palette.success.main} /></ListItemIcon>
                                        <ListItemText primary="Tax Saving Options" secondary="5-year Tax Saving FDs are eligible for deductions under 80C." />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h4" component="h4" fontWeight={600} gutterBottom sx={{ fontSize: "1.25rem" }}>
                                    How it Works
                                </Typography>
                                <List>
                                    <ListItem>
                                        <ListItemIcon><Landmark size={20} color={theme.palette.primary.main} /></ListItemIcon>
                                        <ListItemText primary="Deposit" secondary="You deposit a lump sum amount for a fixed tenure." />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><TrendingUp size={20} color={theme.palette.primary.main} /></ListItemIcon>
                                        <ListItemText primary="Interest" secondary="Interest accumulates at the agreed rate (simple or compound)." />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemIcon><DollarSign size={20} color={theme.palette.primary.main} /></ListItemIcon>
                                        <ListItemText primary="Maturity" secondary="At the end of tenure, you receive the principal plus interest." />
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
                    >
                        <Typography variant="h3" component="h3" gutterBottom fontWeight={600} sx={{ fontSize: "1.75rem", mb: 3 }}>
                            Frequently Asked Questions (FAQ)
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>How is FD interest calculated?</Typography>
                                    <Typography variant="body2">FD interest is usually compounded quarterly. The formula is A = P(1 + r/n)^(nt), where P is principal, r is rate, n is frequency, and t is time.</Typography>
                                </Box>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>Is FD interest taxable?</Typography>
                                    <Typography variant="body2">Yes, interest earned on FD is taxable as per your income tax slab. TDS is deducted if interest exceeds ₹40,000 (₹50,000 for seniors) in a year.</Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>Can I withdraw FD before maturity?</Typography>
                                    <Typography variant="body2">Yes, premature withdrawal is allowed but banks usually charge a penalty of 0.5% to 1% on the interest rate.</Typography>
                                </Box>
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" component="h4" fontWeight={600} gutterBottom>What is the minimum tenure for FD?</Typography>
                                    <Typography variant="body2">The tenure usually ranges from 7 days to 10 years depending on the bank.</Typography>
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
                    >
                        <Typography variant="h3" component="h3" gutterBottom fontWeight={600} sx={{ fontSize: "1.75rem", mb: 3 }}>
                            How to Use the FD Calculator
                        </Typography>
                        <List>
                            <ListItem sx={{ pl: 0, alignItems: 'flex-start' }}>
                                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: theme.palette.primary.main, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 600 }}>1</Box>
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="h6" component="h4" fontWeight={600}>Enter Principal Amount</Typography>} secondary="Input the total amount you wish to invest in the Fixed Deposit." />
                            </ListItem>
                            <ListItem sx={{ pl: 0, alignItems: 'flex-start' }}>
                                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: theme.palette.primary.main, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 600 }}>2</Box>
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="h6" component="h4" fontWeight={600}>Set Interest Rate & Tenure</Typography>} secondary="Enter the annual interest rate offered by the bank and the duration of the deposit." />
                            </ListItem>
                            <ListItem sx={{ pl: 0, alignItems: 'flex-start' }}>
                                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                                    <Box sx={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: theme.palette.primary.main, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 600 }}>3</Box>
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="h6" component="h4" fontWeight={600}>Choose Frequency</Typography>} secondary="Select how often the interest is compounded (Monthly, Quarterly, etc.). Quarterly is standard for most Indian banks." />
                            </ListItem>
                        </List>
                        <Alert severity="info" sx={{ mt: 3 }}>
                            <Typography variant="body2">
                                <strong>Note:</strong> This calculator provides estimates. Actual returns may vary slightly due to bank-specific policies or leap years.
                            </Typography>
                        </Alert>
                    </Paper>

                    {/* AdSense */}
                    <AdSense adSlot="4201858400" />

                </motion.div>
            </Container>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default FDCalculator;
