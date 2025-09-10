"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  useTheme,
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
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Flag,
  Download,
  Copy,
  FileText,
  FileSpreadsheet,
  Image,
} from "lucide-react";
import html2canvas from "html2canvas";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface LapTime {
  lapNumber: number;
  lapTime: number;
  totalTime: number;
  timestamp: Date;
}

const Stopwatch = () => {
  const theme = useTheme();
  // const shareLink = window.location.href;

  const faqData = [
    {
      question: "How accurate is the stopwatch?",
      answer:
        "Our stopwatch provides millisecond accuracy (0.01 second precision) using high-resolution browser timing APIs. It's suitable for most timing needs including sports and professional applications.",
    },
    {
      question: "Can I track multiple lap times?",
      answer:
        "Yes! Click the 'Lap' button while the stopwatch is running to record split times. You can record unlimited laps with detailed statistics including best, worst, and average lap times.",
    },
    {
      question: "Does the stopwatch work offline?",
      answer:
        "Absolutely! The stopwatch runs entirely in your browser and doesn't require an internet connection. All timing calculations happen locally on your device.",
    },
    {
      question: "Can I export my timing results?",
      answer:
        "Yes, you can export your stopwatch results in multiple formats: PNG images for visual sharing, PDF documents for reports, or CSV files for data analysis and spreadsheet import.",
    },
    {
      question: "What's the auto-lap feature?",
      answer:
        "Auto-lap automatically records lap times at regular intervals (default 60 seconds). Enable it in settings to track consistent time segments without manual intervention.",
    },
    {
      question: "Is my timing data secure?",
      answer:
        "Yes, all timing data is processed locally in your browser. No data is sent to our servers, ensuring complete privacy and security of your timing sessions.",
    },
  ];

  // Stopwatch state
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  // Settings
  const [showMilliseconds, setShowMilliseconds] = useState(true);
  const [autoLap, setAutoLap] = useState(false);
  const [autoLapInterval, _setAutoLapInterval] = useState(60); // seconds

  // UI state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadMenuAnchorEl, setDownloadMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Dynamic title updates based on stopwatch state
    const updateTitle = () => {
      if (isRunning && !isPaused) {
        document.title = `${formatTime(time)} - Running | Stopwatch - KodeKit`;
      } else if (isPaused) {
        document.title = `${formatTime(time)} - Paused | Stopwatch - KodeKit`;
      } else {
        document.title =
          "Stopwatch | Online Precision Timer with Lap Tracking - KodeKit";
      }
    };

    updateTitle();
  }, [time, isRunning, isPaused]);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  // Auto lap functionality
  useEffect(() => {
    if (autoLap && isRunning && !isPaused && time > 0) {
      const currentSeconds = Math.floor(time / 1000);
      const lastLapSeconds = Math.floor(lastLapTime / 1000);

      if (
        currentSeconds > 0 &&
        currentSeconds % autoLapInterval === 0 &&
        currentSeconds !== lastLapSeconds
      ) {
        handleLap();
      }
    }
  }, [time, autoLap, autoLapInterval, isRunning, isPaused, lastLapTime]);

  const updateTime = useCallback(() => {
    if (isRunning && !isPaused) {
      const now = Date.now();
      setTime(now - startTimeRef.current + pausedTimeRef.current);
    }
  }, [isRunning, isPaused]);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(updateTime, 10); // Update every 10ms for smooth display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, updateTime]);

  const handleStart = () => {
    if (!isRunning) {
      // Starting fresh
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      setIsRunning(true);
      setIsPaused(false);
      showSnackbar("Stopwatch started", "success");
    } else if (isPaused) {
      // Resuming from pause
      startTimeRef.current = Date.now() - pausedTimeRef.current;
      setIsPaused(false);
      showSnackbar("Stopwatch resumed", "info");
    }
  };

  const handlePause = () => {
    if (isRunning && !isPaused) {
      pausedTimeRef.current = time;
      setIsPaused(true);
      showSnackbar("Stopwatch paused", "warning");
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    showSnackbar("Stopwatch stopped", "info");
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setIsPaused(false);
    setLaps([]);
    setLastLapTime(0);
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    showSnackbar("Stopwatch reset", "info");
  };

  const handleLap = () => {
    if (isRunning) {
      const currentTime = time;
      const lapTime = currentTime - lastLapTime;
      const newLap: LapTime = {
        lapNumber: laps.length + 1,
        lapTime,
        totalTime: currentTime,
        timestamp: new Date(),
      };

      setLaps((prev) => [newLap, ...prev]); // Add to beginning for latest first
      setLastLapTime(currentTime);
      showSnackbar(`Lap ${newLap.lapNumber} recorded`, "success");
    }
  };

  const formatTime = (
    milliseconds: number,
    includeMs: boolean = showMilliseconds
  ): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);

    const minutesStr = minutes.toString().padStart(2, "0");
    const secondsStr = seconds.toString().padStart(2, "0");
    const msStr = ms.toString().padStart(2, "0");

    return includeMs
      ? `${minutesStr}:${secondsStr}.${msStr}`
      : `${minutesStr}:${secondsStr}`;
  };

  const getTimeColor = () => {
    if (!isRunning) return theme.palette.text.primary;
    if (isPaused) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  const getBestLap = (): LapTime | null => {
    if (laps.length === 0) return null;
    return laps.reduce((best, current) =>
      current.lapTime < best.lapTime ? current : best
    );
  };

  const getWorstLap = (): LapTime | null => {
    if (laps.length === 0) return null;
    return laps.reduce((worst, current) =>
      current.lapTime > worst.lapTime ? current : worst
    );
  };

  const getAverageLapTime = (): number => {
    if (laps.length === 0) return 0;
    const totalLapTime = laps.reduce((sum, lap) => sum + lap.lapTime, 0);
    return totalLapTime / laps.length;
  };

  // Copy functionality
  const handleCopyResults = () => {
    const resultsText = `
Stopwatch Results:
Total Time: ${formatTime(time)}
Laps Recorded: ${laps.length}
${laps.length > 0 ? `Best Lap: ${formatTime(getBestLap()!.lapTime)}` : ""}
${laps.length > 0 ? `Worst Lap: ${formatTime(getWorstLap()!.lapTime)}` : ""}
${laps.length > 0 ? `Average Lap: ${formatTime(getAverageLapTime())}` : ""}

Lap Details:
${laps
  .map(
    (lap) =>
      `Lap ${lap.lapNumber}: ${formatTime(lap.lapTime)} (Total: ${formatTime(
        lap.totalTime
      )})`
  )
  .join("\n")}

Generated by www.KodeKit.in - Stopwatch Tool
${new Date().toLocaleString()}
`;

    navigator.clipboard.writeText(resultsText);
    showSnackbar("Results copied to clipboard", "success");
  };

  // Download functionality
  const downloadResults = async (format: "png" | "pdf" | "csv" = "png") => {
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

  const downloadAsPNG = async () => {
    if (!resultsRef.current) return;

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

    // Add header
    const header = document.createElement("div");
    header.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 15px; margin-bottom: 20px; border-bottom: 2px solid #1976d2;">
        <div style="display: flex; align-items: center;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background-color: #1976d2; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Stopwatch Results</div>
        </div>
        <div style="font-size: 14px; color: #666;">Generated: ${new Date().toLocaleString()}</div>
      </div>
    `;
    container.appendChild(header);

    // Add main time display
    const timeDisplay = document.createElement("div");
    timeDisplay.innerHTML = `
      <div style="text-align: center; background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 25px;">
        <div style="font-size: 48px; font-weight: bold; color: #1976d2; font-family: monospace;">${formatTime(
          time
        )}</div>
        <div style="font-size: 16px; color: #666; margin-top: 10px;">Total Time</div>
      </div>
    `;
    container.appendChild(timeDisplay);

    // Add statistics if laps exist
    if (laps.length > 0) {
      const stats = document.createElement("div");
      stats.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 25px;">
          <div style="text-align: center; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #1976d2;">${
              laps.length
            }</div>
            <div style="font-size: 12px; color: #666;">Total Laps</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #e8f5e8; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #2e7d32;">${formatTime(
              getBestLap()!.lapTime
            )}</div>
            <div style="font-size: 12px; color: #666;">Best Lap</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #fff3e0; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #f57c00;">${formatTime(
              getWorstLap()!.lapTime
            )}</div>
            <div style="font-size: 12px; color: #666;">Worst Lap</div>
          </div>
          <div style="text-align: center; padding: 15px; background-color: #f3e5f5; border-radius: 8px;">
            <div style="font-size: 20px; font-weight: bold; color: #7b1fa2;">${formatTime(
              getAverageLapTime()
            )}</div>
            <div style="font-size: 12px; color: #666;">Average Lap</div>
          </div>
        </div>
      `;
      container.appendChild(stats);

      // Add lap table
      const lapTable = document.createElement("div");
      lapTable.innerHTML = `
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">Lap Details</div>
        <div style="display: grid; grid-template-columns: 1fr 2fr 2fr; background-color: #1976d2; color: white; padding: 12px 15px; border-radius: 8px 8px 0 0; font-weight: bold;">
          <div>Lap</div>
          <div>Lap Time</div>
          <div>Total Time</div>
        </div>
      `;

      const tableBody = document.createElement("div");
      tableBody.style.border = "1px solid #e0e0e0";
      tableBody.style.borderTop = "none";
      tableBody.style.borderRadius = "0 0 8px 8px";
      tableBody.style.overflow = "hidden";

      laps
        .slice()
        .reverse()
        .forEach((lap, index) => {
          const row = document.createElement("div");
          row.style.display = "grid";
          row.style.gridTemplateColumns = "1fr 2fr 2fr";
          row.style.padding = "12px 15px";
          row.style.backgroundColor = index % 2 === 0 ? "#f8f9fa" : "#ffffff";
          row.style.borderBottom =
            index < laps.length - 1 ? "1px solid #e0e0e0" : "none";

          row.innerHTML = `
          <div style="font-weight: 600;">${lap.lapNumber}</div>
          <div style="font-family: monospace;">${formatTime(lap.lapTime)}</div>
          <div style="font-family: monospace;">${formatTime(
            lap.totalTime
          )}</div>
        `;
          tableBody.appendChild(row);
        });

      lapTable.appendChild(tableBody);
      container.appendChild(lapTable);
    }

    // Add footer
    const footer = document.createElement("div");
    footer.innerHTML = `
      <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #1976d2; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 12px; color: #666;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
        <div style="font-size: 16px; font-weight: bold; color: #1976d2;">
          www.KodeKit.in - Stopwatch Tool
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
      link.download = `stopwatch_results_${
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

  const downloadAsPDF = async () => {
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
      doc.text("Stopwatch Results", margin, 15);
      doc.setFontSize(10);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth - margin,
        15,
        { align: "right" }
      );

      // Add main time
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Time: ${formatTime(time)}`, margin, 45);

      let y = 60;

      if (laps.length > 0) {
        // Add statistics
        doc.setFontSize(14);
        doc.text("Statistics", margin, y);
        y += 15;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Laps: ${laps.length}`, margin, y);
        doc.text(
          `Best Lap: ${formatTime(getBestLap()!.lapTime)}`,
          margin + 60,
          y
        );
        y += 10;
        doc.text(`Worst Lap: ${formatTime(getWorstLap()!.lapTime)}`, margin, y);
        doc.text(
          `Average Lap: ${formatTime(getAverageLapTime())}`,
          margin + 60,
          y
        );
        y += 20;

        // Add lap details
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Lap Details", margin, y);
        y += 15;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Lap", margin, y);
        doc.text("Lap Time", margin + 30, y);
        doc.text("Total Time", margin + 80, y);
        y += 5;

        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        doc.setFont("helvetica", "normal");
        laps
          .slice()
          .reverse()
          .forEach((lap) => {
            doc.text(lap.lapNumber.toString(), margin, y);
            doc.text(formatTime(lap.lapTime), margin + 30, y);
            doc.text(formatTime(lap.totalTime), margin + 80, y);
            y += 10;
          });
      }

      // Add footer
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("www.KodeKit.in - Stopwatch Tool", margin, footerY);

      doc.save(
        `stopwatch_results_${new Date().toISOString().split("T")[0]}.pdf`
      );
      document.body.removeChild(script);
      showSnackbar("PDF document downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const downloadAsCSV = () => {
    try {
      let csvContent = "Stopwatch Results\n";
      csvContent += `"Total Time","${formatTime(time)}"\n`;
      csvContent += `"Total Laps","${laps.length}"\n`;

      if (laps.length > 0) {
        csvContent += `"Best Lap","${formatTime(getBestLap()!.lapTime)}"\n`;
        csvContent += `"Worst Lap","${formatTime(getWorstLap()!.lapTime)}"\n`;
        csvContent += `"Average Lap","${formatTime(getAverageLapTime())}"\n\n`;

        csvContent += "Lap Details\n";
        csvContent += "Lap Number,Lap Time,Total Time,Timestamp\n";

        laps
          .slice()
          .reverse()
          .forEach((lap) => {
            csvContent += `${lap.lapNumber},"${formatTime(
              lap.lapTime
            )}","${formatTime(
              lap.totalTime
            )}","${lap.timestamp.toLocaleString()}"\n`;
          });
      }

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `stopwatch_results_${new Date().toISOString().split("T")[0]}.csv`
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
      aria-label="Stopwatch Tool"
    >
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Online Stopwatch - Precision Timer with Lap Tracking
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Professional-grade stopwatch with millisecond accuracy, unlimited lap
          tracking, and comprehensive statistics. Perfect for sports training,
          fitness workouts, cooking, and any activity requiring precise time
          measurement. Export results as PNG, PDF, or CSV files.
        </Typography>

        <Grid container spacing={4}>
          {/* Main Timer Display */}
          <Grid item xs={12} md={8}>
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
              {/* Time Display */}
              <Box
                sx={{ mb: 4 }}
                role="timer"
                aria-live="polite"
                aria-label="Stopwatch display"
              >
                <Typography
                  variant="h1"
                  component="time"
                  sx={{
                    fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    color: getTimeColor(),
                    transition: "color 0.3s ease",
                  }}
                  aria-label={`Current time: ${formatTime(time)}`}
                >
                  {formatTime(time)}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  aria-label={`Stopwatch status: ${
                    !isRunning ? "Ready" : isPaused ? "Paused" : "Running"
                  }`}
                >
                  {!isRunning ? "Ready" : isPaused ? "Paused" : "Running"}
                </Typography>
              </Box>

              {/* Control Buttons */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {!isRunning || isPaused ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<Play size={20} />}
                    onClick={handleStart}
                    sx={{ minWidth: 120 }}
                  >
                    {!isRunning ? "Start" : "Resume"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="warning"
                    size="large"
                    startIcon={<Pause size={20} />}
                    onClick={handlePause}
                    sx={{ minWidth: 120 }}
                  >
                    Pause
                  </Button>
                )}

                <Button
                  variant="outlined"
                  color="error"
                  size="large"
                  startIcon={<Square size={20} />}
                  onClick={handleStop}
                  disabled={!isRunning && !isPaused}
                  sx={{ minWidth: 120 }}
                >
                  Stop
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<RotateCcw size={20} />}
                  onClick={handleReset}
                  sx={{ minWidth: 120 }}
                >
                  Reset
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<Flag size={20} />}
                  onClick={handleLap}
                  disabled={!isRunning || isPaused}
                  sx={{ minWidth: 120 }}
                >
                  Lap
                </Button>
              </Box>

              {/* Statistics */}
              {laps.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Card sx={{ bgcolor: theme.palette.primary.main + "10" }}>
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="primary"
                          >
                            {laps.length}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Total Laps
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Card sx={{ bgcolor: theme.palette.success.main + "10" }}>
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="success.main"
                          >
                            {formatTime(getBestLap()!.lapTime, false)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Best Lap
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Card sx={{ bgcolor: theme.palette.warning.main + "10" }}>
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="warning.main"
                          >
                            {formatTime(getWorstLap()!.lapTime, false)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Worst Lap
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Card
                        sx={{ bgcolor: theme.palette.secondary.main + "10" }}
                      >
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Typography
                            variant="h6"
                            fontWeight={600}
                            color="secondary.main"
                          >
                            {formatTime(getAverageLapTime(), false)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Average
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Settings and Controls */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Settings
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Copy results">
                    <IconButton onClick={handleCopyResults} size="small">
                      <Copy size={16} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download results">
                    <IconButton
                      onClick={(e) => setDownloadMenuAnchorEl(e.currentTarget)}
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

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showMilliseconds}
                      onChange={(e) => setShowMilliseconds(e.target.checked)}
                    />
                  }
                  label="Show Milliseconds"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={autoLap}
                      onChange={(e) => setAutoLap(e.target.checked)}
                    />
                  }
                  label={`Auto Lap (${autoLapInterval}s)`}
                />
              </Box>
            </Paper>

            {/* Lap Times */}
            {laps.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: "hidden",
                }}
                ref={resultsRef}
              >
                <Box
                  sx={{
                    p: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    Lap Times
                  </Typography>
                </Box>

                <TableContainer sx={{ maxHeight: 400 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Lap</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Time</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Total</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {laps.map((lap) => {
                        const bestLap = getBestLap();
                        const worstLap = getWorstLap();
                        const isBest =
                          bestLap && lap.lapTime === bestLap.lapTime;
                        const isWorst =
                          worstLap &&
                          lap.lapTime === worstLap.lapTime &&
                          laps.length > 1;

                        return (
                          <TableRow
                            key={lap.lapNumber}
                            sx={{
                              bgcolor: isBest
                                ? theme.palette.success.main + "10"
                                : isWorst
                                ? theme.palette.error.main + "10"
                                : "inherit",
                            }}
                          >
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                {lap.lapNumber}
                                {isBest && (
                                  <Chip
                                    label="Best"
                                    size="small"
                                    color="success"
                                  />
                                )}
                                {isWorst && (
                                  <Chip
                                    label="Worst"
                                    size="small"
                                    color="error"
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell sx={{ fontFamily: "monospace" }}>
                              {formatTime(lap.lapTime)}
                            </TableCell>
                            <TableCell sx={{ fontFamily: "monospace" }}>
                              {formatTime(lap.totalTime)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* AdSense Ad */}
        <AdSense adSlot="4240504971" />

        {/* Features Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Stopwatch Features
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Millisecond Precision
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  High-accuracy timing with 0.01 second precision using advanced
                  browser APIs. Perfect for sports timing, cooking, workouts,
                  and professional applications requiring precise time
                  measurement.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Advanced Lap Tracking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Record unlimited lap times with comprehensive statistics. View
                  best lap, worst lap, average lap time, and total laps with
                  visual indicators for performance analysis and improvement
                  tracking.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Export & Share Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download timing results as PNG images, PDF reports, or CSV
                  data files. Copy results to clipboard for easy sharing.
                  Perfect for coaches, trainers, and athletes who need to
                  document and analyze performance.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  height: "100%",
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Privacy & Security
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All timing calculations happen locally in your browser. No
                  data is sent to servers, ensuring complete privacy and
                  security. Works offline and doesn't require registration or
                  personal information.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Use Cases Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Perfect For
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {[
              {
                title: "Sports Training",
                desc: "Track sprint times, lap times, and workout intervals",
              },
              {
                title: "Cooking & Baking",
                desc: "Time cooking processes and baking stages precisely",
              },
              {
                title: "Fitness Workouts",
                desc: "Monitor exercise durations and rest periods",
              },
              {
                title: "Study Sessions",
                desc: "Use Pomodoro technique and track focus time",
              },
              {
                title: "Professional Timing",
                desc: "Meeting durations, presentation timing, and project phases",
              },
              {
                title: "Gaming & Competitions",
                desc: "Speedrun timing and competitive event measurement",
              },
            ].map((useCase, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {useCase.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {useCase.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Frequently Asked Questions
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              mt: 2,
            }}
          >
            {faqData.map((faq, index) => (
              <Box key={index} sx={{ mb: index < faqData.length - 1 ? 4 : 0 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {faq.question}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {faq.answer}
                </Typography>
                {index < faqData.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            ))}
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
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MuiMenuItem
          onClick={() => downloadResults("png")}
          disabled={isDownloading}
        >
          <ListItemIcon>
            {isDownloading ? (
              <CircularProgress size={16} />
            ) : (
              <Image size={16} />
            )}
          </ListItemIcon>
          <ListItemText>
            {isDownloading ? "Generating PNG..." : "Download as PNG"}
          </ListItemText>
        </MuiMenuItem>
        <MuiMenuItem
          onClick={() => downloadResults("pdf")}
          disabled={isDownloading}
        >
          <ListItemIcon>
            {isDownloading ? (
              <CircularProgress size={16} />
            ) : (
              <FileText size={16} />
            )}
          </ListItemIcon>
          <ListItemText>
            {isDownloading ? "Generating PDF..." : "Download as PDF"}
          </ListItemText>
        </MuiMenuItem>
        <MuiMenuItem
          onClick={() => downloadResults("csv")}
          disabled={isDownloading}
        >
          <ListItemIcon>
            {isDownloading ? (
              <CircularProgress size={16} />
            ) : (
              <FileSpreadsheet size={16} />
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

export default Stopwatch;
