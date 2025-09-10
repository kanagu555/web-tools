"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  FormControlLabel,
  Switch,
  Chip,
  CircularProgress,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Tabs,
  Tab,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  Copy,
  RefreshCw,
  Calendar,
  Globe,
  Zap,
  ArrowRight,
  Timer,
  FileText,
  FileSpreadsheet,
  Image,
} from "lucide-react";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

// Timezone data for common timezones
const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: 0 },
  { value: "America/New_York", label: "Eastern Time (ET)", offset: -5 },
  { value: "America/Chicago", label: "Central Time (CT)", offset: -6 },
  { value: "America/Denver", label: "Mountain Time (MT)", offset: -7 },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)", offset: -8 },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)", offset: 0 },
  { value: "Europe/Paris", label: "Central European Time (CET)", offset: 1 },
  { value: "Europe/Moscow", label: "Moscow Time (MSK)", offset: 3 },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)", offset: 9 },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)", offset: 8 },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)", offset: 5.5 },
  {
    value: "Australia/Sydney",
    label: "Australian Eastern Time (AET)",
    offset: 10,
  },
];

// Common timestamp formats
const TIMESTAMP_FORMATS = [
  { value: "seconds", label: "Unix Timestamp (seconds)", multiplier: 1 },
  {
    value: "milliseconds",
    label: "Unix Timestamp (milliseconds)",
    multiplier: 1000,
  },
  {
    value: "microseconds",
    label: "Unix Timestamp (microseconds)",
    multiplier: 1000000,
  },
  {
    value: "nanoseconds",
    label: "Unix Timestamp (nanoseconds)",
    multiplier: 1000000000,
  },
];

interface ConversionResult {
  timestamp: number;
  date: Date;
  timezone: string;
  formats: {
    [key: string]: string;
  };
  relativeTime: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`timestamp-tabpanel-${index}`}
      aria-labelledby={`timestamp-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TimestampConverter = () => {
  const theme = useTheme();
  // const shareLink = window.location.href;
  const [tabValue, setTabValue] = useState(0);

  const faqData = [
    {
      question: "What is a Unix timestamp?",
      answer:
        "A Unix timestamp is the number of seconds (or milliseconds) that have elapsed since January 1, 1970, 00:00:00 UTC. It's a standard way to represent time in computer systems.",
    },
    {
      question: "What timestamp formats are supported?",
      answer:
        "We support Unix timestamps in seconds, milliseconds, microseconds, and nanoseconds. You can convert between any of these formats and human-readable dates.",
    },
    {
      question: "Can I convert dates to timestamps?",
      answer:
        "Yes! Our tool works both ways. You can convert Unix timestamps to readable dates, or convert dates and times to Unix timestamps in your preferred format.",
    },
    {
      question: "Are different timezones supported?",
      answer:
        "Absolutely! We support 12+ major timezones including UTC, EST, PST, GMT, CET, JST, IST, and more. Select your timezone for accurate conversions.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, all conversions happen locally in your browser. No data is sent to our servers, ensuring complete privacy and security of your timestamps and dates.",
    },
    {
      question: "Can I download the conversion results?",
      answer:
        "Yes! You can download your conversion results as PNG images, PDF documents, or CSV files for documentation and sharing purposes.",
    },
  ];

  // Timestamp to Date conversion
  const [timestampInput, setTimestampInput] = useState("");
  const [timestampFormat, setTimestampFormat] = useState("seconds");
  const [timestampTimezone, setTimestampTimezone] = useState("UTC");

  // Date to Timestamp conversion
  const [dateInput, setDateInput] = useState("");
  const [dateTimezone, setDateTimezone] = useState("UTC");
  const [outputFormat, setOutputFormat] = useState("seconds");

  // Current time display
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoUpdate, setAutoUpdate] = useState(true);

  // Results and UI state
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const timestampInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Auto-update current time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoUpdate) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoUpdate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title =
      "Timestamp Converter | Convert Unix Timestamps to Human-Readable Dates";

    // Set current date/time as default
    const now = new Date();
    setDateInput(now.toISOString().slice(0, 16)); // Format for datetime-local input
  }, []);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  // Convert timestamp to date
  const convertTimestampToDate = () => {
    const value = parseFloat(timestampInput);

    if (isNaN(value)) {
      showSnackbar("Please enter a valid timestamp", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const format = TIMESTAMP_FORMATS.find(
          (f) => f.value === timestampFormat
        );
        if (!format) {
          throw new Error("Invalid timestamp format");
        }

        // Convert to milliseconds
        const timestampMs = (value / format.multiplier) * 1000;
        const date = new Date(timestampMs);

        if (isNaN(date.getTime())) {
          throw new Error("Invalid timestamp value");
        }

        const result: ConversionResult = {
          timestamp: value,
          date,
          timezone: timestampTimezone,
          formats: {
            iso: date.toISOString(),
            rfc2822: date.toUTCString(),
            locale: date.toLocaleString(),
            unix_seconds: Math.floor(date.getTime() / 1000).toString(),
            unix_milliseconds: date.getTime().toString(),
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, "0"),
            day: date.getDate().toString().padStart(2, "0"),
            hour: date.getHours().toString().padStart(2, "0"),
            minute: date.getMinutes().toString().padStart(2, "0"),
            second: date.getSeconds().toString().padStart(2, "0"),
            dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
            monthName: date.toLocaleDateString("en-US", { month: "long" }),
          },
          relativeTime: getRelativeTime(date),
        };

        setConversionResult(result);
        showSnackbar("Timestamp converted successfully", "success");
      } catch (error) {
        console.error("Conversion error:", error);
        showSnackbar(
          `Conversion failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  // Convert date to timestamp
  const convertDateToTimestamp = () => {
    if (!dateInput) {
      showSnackbar("Please enter a valid date", "error");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const date = new Date(dateInput);

        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format");
        }

        const format = TIMESTAMP_FORMATS.find((f) => f.value === outputFormat);
        if (!format) {
          throw new Error("Invalid output format");
        }

        const timestampValue = Math.floor(
          (date.getTime() / 1000) * format.multiplier
        );

        const result: ConversionResult = {
          timestamp: timestampValue,
          date,
          timezone: dateTimezone,
          formats: {
            iso: date.toISOString(),
            rfc2822: date.toUTCString(),
            locale: date.toLocaleString(),
            unix_seconds: Math.floor(date.getTime() / 1000).toString(),
            unix_milliseconds: date.getTime().toString(),
            year: date.getFullYear().toString(),
            month: (date.getMonth() + 1).toString().padStart(2, "0"),
            day: date.getDate().toString().padStart(2, "0"),
            hour: date.getHours().toString().padStart(2, "0"),
            minute: date.getMinutes().toString().padStart(2, "0"),
            second: date.getSeconds().toString().padStart(2, "0"),
            dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
            monthName: date.toLocaleDateString("en-US", { month: "long" }),
          },
          relativeTime: getRelativeTime(date),
        };

        setConversionResult(result);
        showSnackbar("Date converted successfully", "success");
      } catch (error) {
        console.error("Conversion error:", error);
        showSnackbar(
          `Conversion failed: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          "error"
        );
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  // Get relative time (e.g., "2 hours ago", "in 3 days")
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffSeconds = Math.floor(Math.abs(diffMs) / 1000);
    const isPast = diffMs < 0;

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "week", seconds: 604800 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffSeconds / interval.seconds);
      if (count >= 1) {
        const plural = count > 1 ? "s" : "";
        return isPast
          ? `${count} ${interval.label}${plural} ago`
          : `in ${count} ${interval.label}${plural}`;
      }
    }

    return "just now";
  };

  // Quick timestamp actions
  const useCurrentTimestamp = () => {
    const now = Date.now();
    const format = TIMESTAMP_FORMATS.find((f) => f.value === timestampFormat);
    if (format) {
      const value = Math.floor((now / 1000) * format.multiplier);
      setTimestampInput(value.toString());
    }
  };

  const useCurrentDate = () => {
    const now = new Date();
    setDateInput(now.toISOString().slice(0, 16));
  };

  // Copy functionality
  const handleCopyResults = () => {
    if (!conversionResult) return;

    const resultsText = `
Timestamp Conversion Results:
Original: ${conversionResult.timestamp}
Date: ${conversionResult.date.toISOString()}
Timezone: ${conversionResult.timezone}
Relative: ${conversionResult.relativeTime}

Formats:
- ISO 8601: ${conversionResult.formats.iso}
- RFC 2822: ${conversionResult.formats.rfc2822}
- Locale: ${conversionResult.formats.locale}
- Unix (seconds): ${conversionResult.formats.unix_seconds}
- Unix (milliseconds): ${conversionResult.formats.unix_milliseconds}

Generated by www.KodeKit.in - Timestamp Converter
${new Date().toLocaleString()}
`;

    navigator.clipboard.writeText(resultsText);
    showSnackbar("Results copied to clipboard", "success");
  };

  // Reset functionality
  const handleReset = () => {
    setTimestampInput("");
    setDateInput("");
    setConversionResult(null);
    showSnackbar("Form reset successfully", "info");
  };

  // Tab change handler
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setConversionResult(null); // Clear results when switching tabs
  };

  // Download functionality
  const downloadResults = async (format: "png" | "pdf" | "csv" = "png") => {
    if (!conversionResult) {
      showSnackbar("No conversion results to download", "error");
      return;
    }

    setIsDownloading(true);
    setDownloadMenuAnchorEl(null);

    try {
      switch (format) {
        case "png":
          await downloadAsPNG();
          break;
        case "pdf":
          await downloadAsPDF();
          break;
        case "csv":
          downloadAsCSV();
          break;
        default:
          await downloadAsPNG();
      }
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()}:`, error);
      showSnackbar(
        `Failed to generate ${format.toUpperCase()}. Please try again.`,
        "error"
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Download as PNG image
  const downloadAsPNG = async () => {
    if (!resultsRef.current || !conversionResult) return;

    const container = document.createElement("div");
    container.style.width = "800px";
    container.style.backgroundColor = "#ffffff";
    container.style.padding = "30px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.color = "#333333";
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.boxSizing = "border-box";
    container.style.border = "1px solid #e0e0e0";
    container.style.borderRadius = "8px";
    container.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";

    // Add header
    const header = document.createElement("div");
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; margin-bottom: 20px; border-bottom: 2px solid #1976d2;">
        <div style="display: flex; align-items: center;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #1976d2; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Timestamp Conversion Results</div>
        </div>
        <div style="font-size: 14px; color: #666;">Generated: ${new Date().toLocaleString()}</div>
      </div>
    `;
    container.appendChild(header);

    // Add main result
    const mainResult = document.createElement("div");
    mainResult.innerHTML = `
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e0e0e0;">
        <div style="font-size: 14px; color: #666; margin-bottom: 5px;">${
          tabValue === 0 ? "Converted Date" : "Converted Timestamp"
        }</div>
        <div style="font-size: 22px; font-weight: 600; margin-bottom: 10px;">${
          tabValue === 0
            ? conversionResult.formats.iso
            : conversionResult.timestamp.toString()
        }</div>
        <div style="font-size: 14px; color: #666;">${
          conversionResult.relativeTime
        }</div>
      </div>
    `;
    container.appendChild(mainResult);

    // Add formats table
    const tableHeader = document.createElement("div");
    tableHeader.innerHTML = `
      <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">All Formats</div>
      <div style="display: grid; grid-template-columns: 1fr 2fr; background-color: #1976d2; color: white; padding: 12px 15px; border-radius: 8px 8px 0 0; font-weight: bold;">
        <div>Format</div>
        <div>Value</div>
      </div>
    `;
    container.appendChild(tableHeader);

    const tableBody = document.createElement("div");
    tableBody.style.border = "1px solid #e0e0e0";
    tableBody.style.borderTop = "none";
    tableBody.style.borderRadius = "0 0 8px 8px";
    tableBody.style.overflow = "hidden";

    const formats = [
      { label: "ISO 8601", value: conversionResult.formats.iso },
      { label: "RFC 2822", value: conversionResult.formats.rfc2822 },
      { label: "Locale String", value: conversionResult.formats.locale },
      { label: "Unix (seconds)", value: conversionResult.formats.unix_seconds },
      {
        label: "Unix (milliseconds)",
        value: conversionResult.formats.unix_milliseconds,
      },
    ];

    formats.forEach((format, index) => {
      const row = document.createElement("div");
      row.style.display = "grid";
      row.style.gridTemplateColumns = "1fr 2fr";
      row.style.padding = "12px 15px";
      row.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff";
      row.style.borderBottom =
        index < formats.length - 1 ? "1px solid #e0e0e0" : "none";

      row.innerHTML = `
        <div style="font-weight: 600;">${format.label}</div>
        <div style="font-family: monospace; font-size: 14px;">${format.value}</div>
      `;
      tableBody.appendChild(row);
    });

    container.appendChild(tableBody);

    // Add date components
    const dateComponents = document.createElement("div");
    dateComponents.innerHTML = `
      <div style="margin-top: 25px;">
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">Date Components</div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
          <div style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e0e0e0;">
            <div style="font-size: 24px; font-weight: 600; color: #1976d2; margin-bottom: 5px;">${conversionResult.formats.day}</div>
            <div style="font-size: 12px; color: #666;">Day</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e0e0e0;">
            <div style="font-size: 24px; font-weight: 600; color: #1976d2; margin-bottom: 5px;">${conversionResult.formats.month}</div>
            <div style="font-size: 12px; color: #666;">Month</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e0e0e0;">
            <div style="font-size: 24px; font-weight: 600; color: #1976d2; margin-bottom: 5px;">${conversionResult.formats.year}</div>
            <div style="font-size: 12px; color: #666;">Year</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e0e0e0;">
            <div style="font-size: 24px; font-weight: 600; color: #1976d2; margin-bottom: 5px;">${conversionResult.formats.hour}:${conversionResult.formats.minute}</div>
            <div style="font-size: 12px; color: #666;">Time</div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(dateComponents);

    // Add footer
    const footer = document.createElement("div");
    footer.innerHTML = `
      <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #1976d2; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 12px; color: #666;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
        <div style="font-size: 16px; font-weight: bold; color: #1976d2;">
          www.KodeKit.in - Timestamp Converter
        </div>
      </div>
    `;
    container.appendChild(footer);

    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `timestamp_conversion_${conversionResult.timestamp}_${
        new Date().toISOString().split("T")[0]
      }.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar("PNG image downloaded successfully", "success");
    } finally {
      document.body.removeChild(container);
    }
  };

  // Download as PDF
  const downloadAsPDF = async () => {
    if (!conversionResult) return;

    try {
      const script = document.createElement("script");
      script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      script.async = true;

      const scriptLoaded = new Promise<void>((resolve, reject) => {
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load jsPDF script"));
      });

      document.body.appendChild(script);
      await scriptLoaded;

      const jsPDF = (window as any).jspdf.jsPDF;
      if (!jsPDF) {
        throw new Error("jsPDF not available after loading");
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;

      // Add header
      doc.setFillColor(25, 118, 210);
      doc.rect(0, 0, pageWidth, 25, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Timestamp Conversion Results", margin, 15);
      doc.setFontSize(10);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth - margin,
        15,
        { align: "right" }
      );

      // Add main result
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(
        tabValue === 0 ? "Converted Date:" : "Converted Timestamp:",
        margin,
        35
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(
        tabValue === 0
          ? conversionResult.formats.iso
          : conversionResult.timestamp.toString(),
        margin,
        45
      );
      doc.text(`Relative: ${conversionResult.relativeTime}`, margin, 55);

      // Add formats table
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("All Formats", margin, 70);

      const formats = [
        { label: "ISO 8601", value: conversionResult.formats.iso },
        { label: "RFC 2822", value: conversionResult.formats.rfc2822 },
        { label: "Locale String", value: conversionResult.formats.locale },
        {
          label: "Unix (seconds)",
          value: conversionResult.formats.unix_seconds,
        },
        {
          label: "Unix (milliseconds)",
          value: conversionResult.formats.unix_milliseconds,
        },
      ];

      let y = 85;
      doc.setFontSize(10);
      formats.forEach((format) => {
        doc.setFont("helvetica", "bold");
        doc.text(`${format.label}:`, margin, y);
        doc.setFont("helvetica", "normal");
        doc.text(format.value, margin + 50, y);
        y += 10;
      });

      // Add date components
      y += 10;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Date Components", margin, y);
      y += 15;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Day: ${conversionResult.formats.day}`, margin, y);
      doc.text(`Month: ${conversionResult.formats.month}`, margin + 60, y);
      y += 10;
      doc.text(`Year: ${conversionResult.formats.year}`, margin, y);
      doc.text(
        `Time: ${conversionResult.formats.hour}:${conversionResult.formats.minute}`,
        margin + 60,
        y
      );
      y += 10;
      doc.text(`Day of Week: ${conversionResult.formats.dayOfWeek}`, margin, y);
      doc.text(
        `Month Name: ${conversionResult.formats.monthName}`,
        margin + 60,
        y
      );

      // Add footer
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("www.KodeKit.in - Timestamp Converter", margin, footerY);

      doc.save(
        `timestamp_conversion_${conversionResult.timestamp}_${
          new Date().toISOString().split("T")[0]
        }.pdf`
      );
      document.body.removeChild(script);
      showSnackbar("PDF document downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  // Download as CSV
  const downloadAsCSV = () => {
    if (!conversionResult) return;

    try {
      let csvContent = "Format,Value\n";
      csvContent += `"Original ${tabValue === 0 ? "Timestamp" : "Date"}","${
        tabValue === 0
          ? conversionResult.timestamp
          : conversionResult.formats.iso
      }"\n`;
      csvContent += `"Relative Time","${conversionResult.relativeTime}"\n`;
      csvContent += `"Timezone","${conversionResult.timezone}"\n\n`;

      csvContent += "All Formats\n";
      csvContent += `"ISO 8601","${conversionResult.formats.iso}"\n`;
      csvContent += `"RFC 2822","${conversionResult.formats.rfc2822}"\n`;
      csvContent += `"Locale String","${conversionResult.formats.locale}"\n`;
      csvContent += `"Unix (seconds)","${conversionResult.formats.unix_seconds}"\n`;
      csvContent += `"Unix (milliseconds)","${conversionResult.formats.unix_milliseconds}"\n\n`;

      csvContent += "Date Components\n";
      csvContent += `"Year","${conversionResult.formats.year}"\n`;
      csvContent += `"Month","${conversionResult.formats.month}"\n`;
      csvContent += `"Day","${conversionResult.formats.day}"\n`;
      csvContent += `"Hour","${conversionResult.formats.hour}"\n`;
      csvContent += `"Minute","${conversionResult.formats.minute}"\n`;
      csvContent += `"Second","${conversionResult.formats.second}"\n`;
      csvContent += `"Day of Week","${conversionResult.formats.dayOfWeek}"\n`;
      csvContent += `"Month Name","${conversionResult.formats.monthName}"\n`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `timestamp_conversion_${conversionResult.timestamp}_${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showSnackbar("CSV file downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating CSV:", error);
      throw error;
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      role="main"
      aria-label="Timestamp Converter Tool"
    >
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight={700}
            id="main-heading"
          >
            Timestamp Converter
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            component="p"
            role="doc-subtitle"
          >
            Convert between Unix timestamps and human-readable dates with
            support for multiple formats and timezones. Supports seconds,
            milliseconds, microseconds, and nanoseconds precision with 12+
            timezone options.
          </Typography>
        </header>

        {/* Current Time Display */}
        <section aria-labelledby="current-time-heading">
          <Card
            sx={{
              mb: 4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
            }}
            role="region"
            aria-labelledby="current-time-heading"
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Timer
                    size={24}
                    color={theme.palette.primary.main}
                    aria-hidden="true"
                  />
                  <Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      id="current-time-heading"
                    >
                      Current Time
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      aria-live="polite"
                      aria-label={`Current time: ${currentTime.toLocaleString()}, Unix timestamp: ${Math.floor(
                        currentTime.getTime() / 1000
                      )}`}
                    >
                      {currentTime.toLocaleString()} (
                      {currentTime.toISOString()})
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={`Unix: ${Math.floor(currentTime.getTime() / 1000)}`}
                    variant="outlined"
                    size="small"
                    aria-label={`Current Unix timestamp: ${Math.floor(
                      currentTime.getTime() / 1000
                    )}`}
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoUpdate}
                        onChange={(e) => setAutoUpdate(e.target.checked)}
                        size="small"
                        inputProps={{
                          "aria-label": "Auto-update current time display",
                        }}
                      />
                    }
                    label="Auto-update"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </section>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <section aria-labelledby="converter-section-heading">
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: "hidden",
                }}
                role="region"
                aria-labelledby="converter-section-heading"
              >
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    "& .MuiTab-root": {
                      minHeight: 60,
                    },
                  }}
                  aria-label="Conversion type selection"
                >
                  <Tab
                    icon={<ArrowRight size={20} aria-hidden="true" />}
                    label="Timestamp → Date"
                    iconPosition="start"
                    id="timestamp-to-date-tab"
                    aria-controls="timestamp-to-date-panel"
                    aria-label="Convert timestamp to date"
                  />
                  <Tab
                    icon={
                      <ArrowRight
                        size={20}
                        style={{ transform: "rotate(180deg)" }}
                        aria-hidden="true"
                      />
                    }
                    label="Date → Timestamp"
                    iconPosition="start"
                    id="date-to-timestamp-tab"
                    aria-controls="date-to-timestamp-panel"
                    aria-label="Convert date to timestamp"
                  />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={600}
                    id="converter-section-heading"
                    component="h2"
                  >
                    Convert Timestamp to Date
                  </Typography>

                  <Grid
                    container
                    spacing={3}
                    role="form"
                    aria-labelledby="converter-section-heading"
                  >
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Timestamp"
                        type="text"
                        value={timestampInput}
                        onChange={(e) => setTimestampInput(e.target.value)}
                        inputRef={timestampInputRef}
                        placeholder="1642248600"
                        helperText="Enter a Unix timestamp (e.g., 1642248600)"
                        inputProps={{
                          "aria-label": "Enter Unix timestamp to convert",
                          "aria-describedby": "timestamp-help-text",
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Use current timestamp">
                                <IconButton
                                  onClick={useCurrentTimestamp}
                                  size="small"
                                  aria-label="Insert current timestamp"
                                >
                                  <Zap size={16} aria-hidden="true" />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="timestamp-format-label">
                          Timestamp Format
                        </InputLabel>
                        <Select
                          value={timestampFormat}
                          onChange={(e) => setTimestampFormat(e.target.value)}
                          label="Timestamp Format"
                          labelId="timestamp-format-label"
                          inputProps={{
                            "aria-label": "Select timestamp format",
                            "aria-describedby": "timestamp-format-help",
                          }}
                        >
                          {TIMESTAMP_FORMATS.map((format) => (
                            <MenuItem
                              key={format.value}
                              value={format.value}
                              aria-label={`${format.label} format`}
                            >
                              {format.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          id="timestamp-format-help"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Choose the precision level of your timestamp
                        </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="timestamp-timezone-label">
                          Timezone
                        </InputLabel>
                        <Select
                          value={timestampTimezone}
                          onChange={(e) => setTimestampTimezone(e.target.value)}
                          label="Timezone"
                          labelId="timestamp-timezone-label"
                          inputProps={{
                            "aria-label": "Select timezone for conversion",
                            "aria-describedby": "timezone-help",
                          }}
                        >
                          {TIMEZONES.map((tz) => (
                            <MenuItem
                              key={tz.value}
                              value={tz.value}
                              aria-label={`${tz.label} timezone`}
                            >
                              {tz.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          id="timezone-help"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Select your preferred timezone for display
                        </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={convertTimestampToDate}
                        disabled={!timestampInput || isLoading}
                        startIcon={
                          isLoading ? (
                            <CircularProgress size={18} aria-hidden="true" />
                          ) : (
                            <Calendar size={18} aria-hidden="true" />
                          )
                        }
                        fullWidth
                        size="large"
                        aria-label={`Convert timestamp to date${
                          timestampInput ? ` for value ${timestampInput}` : ""
                        }`}
                        aria-describedby="convert-button-help"
                      >
                        {isLoading ? "Converting..." : "Convert to Date"}
                      </Button>
                    </Grid>
                  </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    fontWeight={600}
                    component="h2"
                  >
                    Convert Date to Timestamp
                  </Typography>

                  <Grid
                    container
                    spacing={3}
                    role="form"
                    aria-label="Date to timestamp conversion form"
                  >
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Date and Time"
                        type="datetime-local"
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        inputRef={dateInputRef}
                        helperText="Select date and time to convert"
                        inputProps={{
                          "aria-label": "Select date and time for conversion",
                          "aria-describedby": "date-input-help",
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Tooltip title="Use current date/time">
                                <IconButton
                                  onClick={useCurrentDate}
                                  size="small"
                                  aria-label="Insert current date and time"
                                >
                                  <Zap size={16} aria-hidden="true" />
                                </IconButton>
                              </Tooltip>
                            </InputAdornment>
                          ),
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{
                          '& input[type="datetime-local"]::-webkit-calendar-picker-indicator':
                            {
                              filter: "invert(1)",
                              cursor: "pointer",
                            },
                          '& input[type="datetime-local"]::-webkit-datetime-edit-text':
                            {
                              color: "transparent",
                            },
                          '& input[type="datetime-local"]:focus::-webkit-datetime-edit-text':
                            {
                              color: "inherit",
                            },
                          '& input[type="datetime-local"]::-webkit-datetime-edit-month-field:not([aria-valuenow])':
                            {
                              color: "transparent",
                            },
                          '& input[type="datetime-local"]::-webkit-datetime-edit-day-field:not([aria-valuenow])':
                            {
                              color: "transparent",
                            },
                          '& input[type="datetime-local"]::-webkit-datetime-edit-year-field:not([aria-valuenow])':
                            {
                              color: "transparent",
                            },
                          '& input[type="datetime-local"]::-webkit-datetime-edit-hour-field:not([aria-valuenow])':
                            {
                              color: "transparent",
                            },
                          '& input[type="datetime-local"]::-webkit-datetime-edit-minute-field:not([aria-valuenow])':
                            {
                              color: "transparent",
                            },
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        id="date-input-help"
                        sx={{ display: "block", mt: 0.5 }}
                      >
                        Use the date picker or click the lightning bolt for
                        current time
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="output-format-label">
                          Output Format
                        </InputLabel>
                        <Select
                          value={outputFormat}
                          onChange={(e) => setOutputFormat(e.target.value)}
                          label="Output Format"
                          labelId="output-format-label"
                          inputProps={{
                            "aria-label": "Select output timestamp format",
                            "aria-describedby": "output-format-help",
                          }}
                        >
                          {TIMESTAMP_FORMATS.map((format) => (
                            <MenuItem
                              key={format.value}
                              value={format.value}
                              aria-label={`Output as ${format.label}`}
                            >
                              {format.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          id="output-format-help"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Choose the precision level for your timestamp output
                        </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel id="date-timezone-label">
                          Timezone
                        </InputLabel>
                        <Select
                          value={dateTimezone}
                          onChange={(e) => setDateTimezone(e.target.value)}
                          label="Timezone"
                          labelId="date-timezone-label"
                          inputProps={{
                            "aria-label": "Select timezone for date conversion",
                            "aria-describedby": "date-timezone-help",
                          }}
                        >
                          {TIMEZONES.map((tz) => (
                            <MenuItem
                              key={tz.value}
                              value={tz.value}
                              aria-label={`${tz.label} timezone`}
                            >
                              {tz.label}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          id="date-timezone-help"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          Select the timezone for your date input
                        </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        onClick={convertDateToTimestamp}
                        disabled={!dateInput || isLoading}
                        startIcon={
                          isLoading ? (
                            <CircularProgress size={18} aria-hidden="true" />
                          ) : (
                            <Clock size={18} aria-hidden="true" />
                          )
                        }
                        fullWidth
                        size="large"
                        aria-label={`Convert date to timestamp${
                          dateInput
                            ? ` for ${new Date(dateInput).toLocaleString()}`
                            : ""
                        }`}
                        aria-describedby="date-convert-button-help"
                      >
                        {isLoading ? "Converting..." : "Convert to Timestamp"}
                      </Button>
                    </Grid>
                  </Grid>
                </TabPanel>

                <Box sx={{ p: 3, pt: 0 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleReset}
                    startIcon={<RefreshCw size={18} aria-hidden="true" />}
                    fullWidth
                    aria-label="Reset all form fields and clear results"
                    aria-describedby="reset-button-help"
                  >
                    Reset
                  </Button>
                </Box>
              </Paper>
            </section>
          </Grid>

          <Grid item xs={12} md={6}>
            {conversionResult && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <section aria-labelledby="results-heading">
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                    ref={resultsRef}
                    role="region"
                    aria-labelledby="results-heading"
                    aria-live="polite"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        id="results-heading"
                        component="h2"
                      >
                        Conversion Results
                      </Typography>
                      <Box
                        sx={{ display: "flex", gap: 1 }}
                        role="toolbar"
                        aria-label="Result actions"
                      >
                        <Tooltip title="Copy results to clipboard">
                          <IconButton
                            onClick={handleCopyResults}
                            size="small"
                            aria-label="Copy conversion results to clipboard"
                          >
                            <Copy size={16} aria-hidden="true" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download results">
                          <IconButton
                            onClick={(e) =>
                              setDownloadMenuAnchorEl(e.currentTarget)
                            }
                            size="small"
                            disabled={isDownloading}
                            aria-label={
                              isDownloading
                                ? "Generating download..."
                                : "Download conversion results"
                            }
                          >
                            {isDownloading ? (
                              <CircularProgress size={16} aria-hidden="true" />
                            ) : (
                              <Download size={16} aria-hidden="true" />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    {/* Main Result */}
                    <Card
                      sx={{ mb: 3, bgcolor: theme.palette.primary.main + "10" }}
                      role="region"
                      aria-labelledby="main-result-heading"
                    >
                      <CardContent>
                        <Typography
                          variant="subtitle2"
                          color="text.secondary"
                          gutterBottom
                          id="main-result-heading"
                          component="h3"
                        >
                          {tabValue === 0
                            ? "Converted Date"
                            : "Converted Timestamp"}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                          }}
                          aria-label={`Main result: ${
                            tabValue === 0
                              ? conversionResult.formats.iso
                              : conversionResult.timestamp.toString()
                          }`}
                        >
                          {tabValue === 0
                            ? conversionResult.formats.iso
                            : conversionResult.timestamp.toString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          aria-label={`Relative time: ${conversionResult.relativeTime}`}
                        >
                          {conversionResult.relativeTime}
                        </Typography>
                      </CardContent>
                    </Card>

                    {/* Detailed Formats */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                      component="h3"
                      id="formats-heading"
                    >
                      All Formats
                    </Typography>

                    <TableContainer
                      role="region"
                      aria-labelledby="formats-heading"
                    >
                      <Table
                        size="small"
                        aria-label="Timestamp conversion formats table"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell component="th" scope="col">
                              <strong>Format</strong>
                            </TableCell>
                            <TableCell component="th" scope="col">
                              <strong>Value</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">
                              <strong>ISO 8601</strong>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                wordBreak: "break-all",
                              }}
                              aria-label={`ISO 8601 format: ${conversionResult.formats.iso}`}
                            >
                              {conversionResult.formats.iso}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">
                              <strong>RFC 2822</strong>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                wordBreak: "break-all",
                              }}
                              aria-label={`RFC 2822 format: ${conversionResult.formats.rfc2822}`}
                            >
                              {conversionResult.formats.rfc2822}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">
                              <strong>Locale String</strong>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                wordBreak: "break-all",
                              }}
                              aria-label={`Locale string format: ${conversionResult.formats.locale}`}
                            >
                              {conversionResult.formats.locale}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">
                              <strong>Unix (seconds)</strong>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                wordBreak: "break-all",
                              }}
                              aria-label={`Unix seconds: ${conversionResult.formats.unix_seconds}`}
                            >
                              {conversionResult.formats.unix_seconds}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">
                              <strong>Unix (milliseconds)</strong>
                            </TableCell>
                            <TableCell
                              sx={{
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                                wordBreak: "break-all",
                              }}
                              aria-label={`Unix milliseconds: ${conversionResult.formats.unix_milliseconds}`}
                            >
                              {conversionResult.formats.unix_milliseconds}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Divider sx={{ my: 2 }} aria-hidden="true" />

                    {/* Date Components */}
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                      component="h3"
                      id="date-components-heading"
                    >
                      Date Components
                    </Typography>

                    <Grid
                      container
                      spacing={2}
                      role="region"
                      aria-labelledby="date-components-heading"
                    >
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 1,
                            bgcolor: theme.palette.background.default,
                            borderRadius: 1,
                          }}
                          role="img"
                          aria-label={`Day: ${conversionResult.formats.day}`}
                        >
                          <Typography
                            variant="h4"
                            fontWeight={600}
                            color="primary"
                            aria-hidden="true"
                          >
                            {conversionResult.formats.day}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Day
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 1,
                            bgcolor: theme.palette.background.default,
                            borderRadius: 1,
                          }}
                          role="img"
                          aria-label={`Month: ${conversionResult.formats.month}`}
                        >
                          <Typography
                            variant="h4"
                            fontWeight={600}
                            color="primary"
                            aria-hidden="true"
                          >
                            {conversionResult.formats.month}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Month
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 1,
                            bgcolor: theme.palette.background.default,
                            borderRadius: 1,
                          }}
                          role="img"
                          aria-label={`Year: ${conversionResult.formats.year}`}
                        >
                          <Typography
                            variant="h4"
                            fontWeight={600}
                            color="primary"
                            aria-hidden="true"
                          >
                            {conversionResult.formats.year}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Year
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 1,
                            bgcolor: theme.palette.background.default,
                            borderRadius: 1,
                          }}
                          role="img"
                          aria-label={`Time: ${conversionResult.formats.hour}:${conversionResult.formats.minute}`}
                        >
                          <Typography
                            variant="h4"
                            fontWeight={600}
                            color="primary"
                            aria-hidden="true"
                          >
                            {conversionResult.formats.hour}:
                            {conversionResult.formats.minute}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Time
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box
                      sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}
                      role="list"
                      aria-label="Additional date information"
                    >
                      <Chip
                        label={conversionResult.formats.dayOfWeek}
                        size="small"
                        variant="outlined"
                        role="listitem"
                        aria-label={`Day of week: ${conversionResult.formats.dayOfWeek}`}
                      />
                      <Chip
                        label={conversionResult.formats.monthName}
                        size="small"
                        variant="outlined"
                        role="listitem"
                        aria-label={`Month name: ${conversionResult.formats.monthName}`}
                      />
                      <Chip
                        label={conversionResult.timezone}
                        size="small"
                        variant="outlined"
                        icon={<Globe size={14} aria-hidden="true" />}
                        role="listitem"
                        aria-label={`Timezone: ${conversionResult.timezone}`}
                      />
                    </Box>
                  </Paper>
                </section>
              </motion.div>
            )}
          </Grid>
        </Grid>

        {/* AdSense Ad */}
        <AdSense adSlot="4240504971" />

        {/* FAQ Section */}
        <Box sx={{ mt: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
            role="region"
            aria-labelledby="faq-heading"
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
              textAlign="center"
              id="faq-heading"
            >
              Frequently Asked Questions
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {faqData.map((faq, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.default,
                      height: "100%",
                    }}
                    role="article"
                    aria-labelledby={`faq-question-${index}`}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      gutterBottom
                      id={`faq-question-${index}`}
                      component="h3"
                    >
                      {faq.question}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      aria-describedby={`faq-question-${index}`}
                    >
                      {faq.answer}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        {/* AdSense Ad */}
        <AdSense adSlot="5673150300" />
      </motion.div>

      {/* Download Menu */}
      <Menu
        anchorEl={downloadMenuAnchorEl}
        open={Boolean(downloadMenuAnchorEl)}
        onClose={() => setDownloadMenuAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        role="menu"
        aria-label="Download options menu"
      >
        <MuiMenuItem
          onClick={() => downloadResults("png")}
          disabled={isDownloading}
          role="menuitem"
          aria-label={
            isDownloading
              ? "Generating PNG image..."
              : "Download results as PNG image"
          }
        >
          <ListItemIcon>
            {isDownloading ? (
              <CircularProgress size={16} aria-hidden="true" />
            ) : (
              <Image size={16} aria-hidden="true" />
            )}
          </ListItemIcon>
          <ListItemText>
            {isDownloading ? "Generating PNG..." : "Download as PNG"}
          </ListItemText>
        </MuiMenuItem>
        <MuiMenuItem
          onClick={() => downloadResults("pdf")}
          disabled={isDownloading}
          role="menuitem"
          aria-label={
            isDownloading
              ? "Generating PDF document..."
              : "Download results as PDF document"
          }
        >
          <ListItemIcon>
            {isDownloading ? (
              <CircularProgress size={16} aria-hidden="true" />
            ) : (
              <FileText size={16} aria-hidden="true" />
            )}
          </ListItemIcon>
          <ListItemText>
            {isDownloading ? "Generating PDF..." : "Download as PDF"}
          </ListItemText>
        </MuiMenuItem>
        <MuiMenuItem
          onClick={() => downloadResults("csv")}
          disabled={isDownloading}
          role="menuitem"
          aria-label={
            isDownloading
              ? "Generating CSV file..."
              : "Download results as CSV file"
          }
        >
          <ListItemIcon>
            {isDownloading ? (
              <CircularProgress size={16} aria-hidden="true" />
            ) : (
              <FileSpreadsheet size={16} aria-hidden="true" />
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
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TimestampConverter;
