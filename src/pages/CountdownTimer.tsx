import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Chip,
  CircularProgress,
  Menu,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  LinearProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Download,
  Copy,
  Timer,
  FileText,
  FileSpreadsheet,
  Image,
  Plus,
  Minus,
  Volume2,
  VolumeX,
  Clock,
} from "lucide-react";
import html2canvas from "html2canvas";
import AdSense from "../components/AdSense";
import SocialShare from "../components/SocialShare";
import SEOHelmet from "../components/SEOHelmet";
import Breadcrumb from "../components/Breadcrumb";
import {
  generateToolSEO,
  generateWebAppData,
  generateHowToData,
  generateFAQData,
  generateBreadcrumbData,
} from "../Utils/seoUtils";

interface Preset {
  name: string;
  minutes: number;
  seconds: number;
  description: string;
}

const PRESETS: Preset[] = [
  { name: "Pomodoro", minutes: 25, seconds: 0, description: "Focus session" },
  { name: "Short Break", minutes: 5, seconds: 0, description: "Quick break" },
  {
    name: "Long Break",
    minutes: 15,
    seconds: 0,
    description: "Extended break",
  },
  { name: "Workout", minutes: 1, seconds: 0, description: "Exercise interval" },
  {
    name: "Meditation",
    minutes: 10,
    seconds: 0,
    description: "Mindfulness session",
  },
  {
    name: "Tea Timer",
    minutes: 3,
    seconds: 0,
    description: "Perfect brew time",
  },
  {
    name: "Presentation",
    minutes: 20,
    seconds: 0,
    description: "Speaking time",
  },
  { name: "Power Nap", minutes: 20, seconds: 0, description: "Quick rest" },
];

const CountdownTimer = () => {
  const theme = useTheme();
  const shareLink = window.location.href;
  const isProductionEnv = import.meta.env.PROD;

  // Generate SEO data using seoUtils
  const seoData = generateToolSEO(
    "Countdown Timer",
    "Free online countdown timer with presets, sound alerts, and customizable features. Perfect for Pomodoro technique, cooking, workouts, productivity, and time management with visual progress tracking",
    "time"
  );

  // Generate structured data
  const webAppData = generateWebAppData(
    "Countdown Timer",
    "Free online countdown timer with presets, sound alerts, and customizable features. Perfect for Pomodoro technique, cooking, workouts, productivity, and time management",
    "time"
  );

  const howToData = generateHowToData("Countdown Timer", [
    {
      name: "Set Your Time",
      text: "Enter your desired countdown time using the minute and second inputs, or click the +/- buttons to adjust. You can set anywhere from 1 second to 99 minutes and 59 seconds",
    },
    {
      name: "Choose a Preset",
      text: "Select from popular presets like Pomodoro (25 min), Short Break (5 min), Workout intervals, Meditation sessions, or cooking timers for quick setup",
    },
    {
      name: "Configure Settings",
      text: "Enable sound alerts for notifications when timer finishes, turn on auto-restart for repeating timers, and show/hide the visual progress bar",
    },
    {
      name: "Start and Control",
      text: "Click Start to begin countdown, use Pause/Resume for breaks, Stop to end early, or Reset to return to original time. Monitor progress with the visual indicator",
    },
    {
      name: "Export Results",
      text: "Copy timer results to clipboard or download as PNG images, PDF documents, or CSV files for documentation and sharing your timing sessions",
    },
  ]);

  const faqData = generateFAQData([
    {
      question: "What timer presets are available?",
      answer:
        "We offer 8 popular presets: Pomodoro (25 min), Short Break (5 min), Long Break (15 min), Workout (1 min), Meditation (10 min), Tea Timer (3 min), Presentation (20 min), and Power Nap (20 min). Each preset is optimized for its specific use case.",
    },
    {
      question: "Can I set custom countdown times?",
      answer:
        "Yes! You can set any custom time from 1 second up to 99 minutes and 59 seconds. Use the input fields or +/- buttons to adjust minutes and seconds precisely to your needs.",
    },
    {
      question: "Does the timer have sound notifications?",
      answer:
        "Absolutely! The timer includes built-in sound alerts that play when your countdown reaches zero. You can enable or disable sound notifications in the settings panel.",
    },
    {
      question: "What is the auto-restart feature?",
      answer:
        "Auto-restart automatically begins a new countdown with the same duration when the current timer finishes. This is perfect for interval training, Pomodoro sessions, or any repetitive timing needs.",
    },
    {
      question: "Can I use this timer offline?",
      answer:
        "Yes, the countdown timer works entirely in your browser and doesn't require an internet connection once loaded. All timing calculations happen locally on your device.",
    },
    {
      question: "How accurate is the countdown timer?",
      answer:
        "Our timer updates every 100 milliseconds for smooth visual feedback and maintains high accuracy for timing sessions. It's suitable for most timing needs including productivity and fitness applications.",
    },
  ]);

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Time Tools", url: "https://kodekit.in/category/time" },
    {
      name: "Countdown Timer",
      url: "https://kodekit.in/tools/countdown-timer",
    },
  ]);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Time Tools", url: "/category/time" },
    { name: "Countdown Timer" },
  ];

  // Timer state
  const [initialTime, setInitialTime] = useState(300000); // 5 minutes in ms
  const [timeLeft, setTimeLeft] = useState(300000);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Input state
  const [inputMinutes, setInputMinutes] = useState(5);
  const [inputSeconds, setInputSeconds] = useState(0);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRestart, setAutoRestart] = useState(false);
  const [showProgress, setShowProgress] = useState(true);

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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Create audio element for notification fallback
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Create a simple beep sound data URL
      audioRef.current.src =
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT";
      audioRef.current.volume = 0.5;
      audioRef.current.preload = "auto";
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Separate useEffect for title updates to avoid conflicts
  useEffect(() => {
    const updateTitle = () => {
      if (isRunning && !isPaused) {
        document.title = `${formatTime(
          timeLeft
        )} - Running | Countdown Timer - KodeKit`;
      } else if (isPaused) {
        document.title = `${formatTime(
          timeLeft
        )} - Paused | Countdown Timer - KodeKit`;
      } else if (isFinished) {
        document.title = "Finished! | Countdown Timer - KodeKit";
      } else {
        document.title =
          "Countdown Timer | Online Timer with Presets and Alerts - KodeKit";
      }
    };

    updateTitle();
  }, [timeLeft, isRunning, isPaused, isFinished]);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const playNotificationSound = useCallback(() => {
    if (soundEnabled) {
      // Create a simple beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // 800 Hz frequency
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Volume

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5); // Play for 0.5 seconds
      } catch (error) {
        // Fallback to HTML5 audio if Web Audio API fails
        if (audioRef.current) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  }, [soundEnabled]);

  const updateTimer = useCallback(() => {
    setTimeLeft((prev) => {
      const newTime = prev - 100; // Decrease by 100ms

      if (newTime <= 0) {
        // Use setTimeout to avoid calling state setters inside the state update function
        setTimeout(() => {
          setIsRunning(false);
          setIsPaused(false);
          setIsFinished(true);
          playNotificationSound();
          showSnackbar("Timer finished!", "success");

          if (autoRestart) {
            setTimeout(() => {
              setTimeLeft(initialTime);
              setIsFinished(false);
              setIsRunning(true);
              showSnackbar("Timer restarted automatically", "info");
            }, 2000);
          }
        }, 0);

        return 0;
      }

      return newTime;
    });
  }, [initialTime, autoRestart, playNotificationSound, showSnackbar]);

  useEffect(() => {
    if (isRunning && !isPaused && !isFinished) {
      intervalRef.current = setInterval(updateTimer, 100);
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
  }, [isRunning, isPaused, isFinished, updateTimer]);

  const handleStart = () => {
    if (!isRunning && !isPaused) {
      // Starting fresh
      const totalMs = (inputMinutes * 60 + inputSeconds) * 1000;
      if (totalMs <= 0) {
        showSnackbar("Please set a valid time", "error");
        return;
      }
      setInitialTime(totalMs);
      setTimeLeft(totalMs);
      setIsFinished(false);
    }

    setIsRunning(true);
    setIsPaused(false);
    showSnackbar(isPaused ? "Timer resumed" : "Timer started", "success");
  };

  const handlePause = () => {
    if (isRunning && !isPaused) {
      setIsPaused(true);
      showSnackbar("Timer paused", "warning");
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    showSnackbar("Timer stopped", "info");
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setIsFinished(false);
    setTimeLeft(initialTime);

    // Reset input fields to match the initial time
    const totalSeconds = Math.floor(initialTime / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    setInputMinutes(minutes);
    setInputSeconds(seconds);

    showSnackbar("Timer reset", "info");
  };

  const adjustTime = (minutes: number, seconds: number) => {
    const newMinutes = Math.max(0, Math.min(99, inputMinutes + minutes));
    const newSeconds = Math.max(0, Math.min(59, inputSeconds + seconds));
    setInputMinutes(newMinutes);
    setInputSeconds(newSeconds);

    if (!isRunning && !isPaused) {
      const totalMs = (newMinutes * 60 + newSeconds) * 1000;
      setInitialTime(totalMs);
      setTimeLeft(totalMs);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (isFinished) return theme.palette.success.main;
    if (!isRunning) return theme.palette.text.primary;
    if (isPaused) return theme.palette.warning.main;
    if (timeLeft <= 10000) return theme.palette.error.main; // Last 10 seconds
    if (timeLeft <= 60000) return theme.palette.warning.main; // Last minute
    return theme.palette.primary.main;
  };

  const getProgressValue = () => {
    if (initialTime === 0) return 0;
    return ((initialTime - timeLeft) / initialTime) * 100;
  };

  const getProgressColor = () => {
    const progress = getProgressValue();
    if (progress < 50) return "primary";
    if (progress < 80) return "warning";
    return "error";
  };

  // Copy functionality
  const handleCopyResults = () => {
    const resultsText = `
Countdown Timer Results:
Initial Time: ${formatTime(initialTime)}
Time Remaining: ${formatTime(timeLeft)}
Status: ${
      isFinished
        ? "Finished"
        : isRunning
        ? isPaused
          ? "Paused"
          : "Running"
        : "Stopped"
    }
Progress: ${getProgressValue().toFixed(1)}%

Generated by www.KodeKit.in - Countdown Timer
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
          <div style="font-size: 24px; font-weight: bold; color: #1976d2;">Countdown Timer Results</div>
        </div>
        <div style="font-size: 14px; color: #666;">Generated: ${new Date().toLocaleString()}</div>
      </div>
    `;
    container.appendChild(header);

    // Add main time display
    const timeDisplay = document.createElement("div");
    timeDisplay.innerHTML = `
      <div style="text-align: center; background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 25px;">
        <div style="font-size: 48px; font-weight: bold; color: #1976d2; font-family: monospace; margin-bottom: 10px;">${formatTime(
          timeLeft
        )}</div>
        <div style="font-size: 16px; color: #666;">Time Remaining</div>
        <div style="margin-top: 15px;">
          <div style="background-color: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden;">
            <div style="background-color: #1976d2; height: 100%; width: ${getProgressValue()}%; transition: width 0.3s ease;"></div>
          </div>
          <div style="font-size: 14px; color: #666; margin-top: 5px;">${getProgressValue().toFixed(
            1
          )}% Complete</div>
        </div>
      </div>
    `;
    container.appendChild(timeDisplay);

    // Add details
    const details = document.createElement("div");
    details.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;">
        <div style="text-align: center; padding: 15px; background-color: #e3f2fd; border-radius: 8px;">
          <div style="font-size: 20px; font-weight: bold; color: #1976d2;">${formatTime(
            initialTime
          )}</div>
          <div style="font-size: 12px; color: #666;">Initial Time</div>
        </div>
        <div style="text-align: center; padding: 15px; background-color: ${
          isFinished ? "#e8f5e8" : "#fff3e0"
        }; border-radius: 8px;">
          <div style="font-size: 20px; font-weight: bold; color: ${
            isFinished ? "#2e7d32" : "#f57c00"
          };">${
      isFinished
        ? "Finished"
        : isRunning
        ? isPaused
          ? "Paused"
          : "Running"
        : "Stopped"
    }</div>
          <div style="font-size: 12px; color: #666;">Status</div>
        </div>
        <div style="text-align: center; padding: 15px; background-color: #f3e5f5; border-radius: 8px;">
          <div style="font-size: 20px; font-weight: bold; color: #7b1fa2;">${"Custom"}</div>
          <div style="font-size: 12px; color: #666;">Preset</div>
        </div>
      </div>
    `;
    container.appendChild(details);

    // Add footer
    const footer = document.createElement("div");
    footer.innerHTML = `
      <div style="margin-top: 30px; padding-top: 15px; border-top: 2px solid #1976d2; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 12px; color: #666;">
          Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        </div>
        <div style="font-size: 16px; font-weight: bold; color: #1976d2;">
          www.KodeKit.in - Countdown Timer
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
      link.download = `countdown_timer_${
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
      doc.text("Countdown Timer Results", margin, 15);
      doc.setFontSize(10);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth - margin,
        15,
        { align: "right" }
      );

      // Add main details
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text(`Time Remaining: ${formatTime(timeLeft)}`, margin, 45);

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`Initial Time: ${formatTime(initialTime)}`, margin, 65);
      doc.text(
        `Status: ${
          isFinished
            ? "Finished"
            : isRunning
            ? isPaused
              ? "Paused"
              : "Running"
            : "Stopped"
        }`,
        margin,
        80
      );
      doc.text(`Progress: ${getProgressValue().toFixed(1)}%`, margin, 95);
      doc.text(`Preset: ${"Custom"}`, margin, 110);

      // Add footer
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("www.KodeKit.in - Countdown Timer", margin, footerY);

      doc.save(`countdown_timer_${new Date().toISOString().split("T")[0]}.pdf`);
      document.body.removeChild(script);
      showSnackbar("PDF document downloaded successfully", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  const downloadAsCSV = () => {
    try {
      let csvContent = "Countdown Timer Results\n";
      csvContent += `"Initial Time","${formatTime(initialTime)}"\n`;
      csvContent += `"Time Remaining","${formatTime(timeLeft)}"\n`;
      csvContent += `"Status","${
        isFinished
          ? "Finished"
          : isRunning
          ? isPaused
            ? "Paused"
            : "Running"
          : "Stopped"
      }"\n`;
      csvContent += `"Progress","${getProgressValue().toFixed(1)}%"\n`;
      csvContent += `"Preset","${"Custom"}"\n`;
      csvContent += `"Generated","${new Date().toLocaleString()}"\n`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `countdown_timer_${new Date().toISOString().split("T")[0]}.csv`
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
      aria-label="Countdown Timer Tool"
    >
      {/* Enhanced SEO with SEOHelmet component */}
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
        canonical="https://kodekit.in/tools/countdown-timer"
        structuredData={[
          webAppData,
          howToData,
          faqData,
          breadcrumbData,
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Online Countdown Timer",
            description:
              "Countdown timer with presets, alerts, and productivity features",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            permissions: "No special permissions required",
            isAccessibleForFree: true,
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Customizable countdown timers",
              "Popular timing presets",
              "Sound notifications",
              "Auto-restart functionality",
              "Visual progress tracking",
              "Export capabilities",
            ],
          },
        ]}
      />

      <Breadcrumb items={breadcrumbItems} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Online Countdown Timer - Presets, Alerts & Productivity Features
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Free countdown timer with popular presets including Pomodoro, cooking
          timers, workout intervals, and meditation sessions. Features sound
          alerts, auto-restart, visual progress tracking, and export
          capabilities for enhanced productivity and time management.
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
              ref={resultsRef}
            >
              {/* Time Display */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "3rem", sm: "4rem", md: "5rem" },
                    fontWeight: "bold",
                    fontFamily: "monospace",
                    color: getTimeColor(),
                    transition: "color 0.3s ease",
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                  {isFinished
                    ? "Finished!"
                    : !isRunning
                    ? "Ready"
                    : isPaused
                    ? "Paused"
                    : "Running"}
                </Typography>

                {/* Progress Bar */}
                {showProgress && (
                  <Box sx={{ mt: 3, mx: 4 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue()}
                      color={getProgressColor()}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      {getProgressValue().toFixed(1)}% Complete
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Time Input */}
              {!isRunning && !isPaused && (
                <Box
                  sx={{
                    mb: 4,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={() => adjustTime(-1, 0)} size="small">
                      <Minus size={16} />
                    </IconButton>
                    <TextField
                      type="number"
                      value={inputMinutes}
                      onChange={(e) => {
                        const val = Math.max(
                          0,
                          Math.min(99, parseInt(e.target.value) || 0)
                        );
                        setInputMinutes(val);
                        const totalMs = (val * 60 + inputSeconds) * 1000;
                        setInitialTime(totalMs);
                        setTimeLeft(totalMs);
                      }}
                      inputProps={{
                        min: 0,
                        max: 99,
                        style: { textAlign: "center" },
                      }}
                      sx={{ width: 80 }}
                      label="Min"
                    />
                    <IconButton onClick={() => adjustTime(1, 0)} size="small">
                      <Plus size={16} />
                    </IconButton>
                  </Box>

                  <Typography variant="h6">:</Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={() => adjustTime(0, -1)} size="small">
                      <Minus size={16} />
                    </IconButton>
                    <TextField
                      type="number"
                      value={inputSeconds}
                      onChange={(e) => {
                        const val = Math.max(
                          0,
                          Math.min(59, parseInt(e.target.value) || 0)
                        );
                        setInputSeconds(val);
                        const totalMs = (inputMinutes * 60 + val) * 1000;
                        setInitialTime(totalMs);
                        setTimeLeft(totalMs);
                      }}
                      inputProps={{
                        min: 0,
                        max: 59,
                        style: { textAlign: "center" },
                      }}
                      sx={{ width: 80 }}
                      label="Sec"
                    />
                    <IconButton onClick={() => adjustTime(0, 1)} size="small">
                      <Plus size={16} />
                    </IconButton>
                  </Box>
                </Box>
              )}

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
              </Box>

              {/* Status Indicators */}
              {(isRunning || isPaused || isFinished) && (
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    icon={<Timer size={16} />}
                    label={`Initial: ${formatTime(initialTime)}`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<Clock size={16} />}
                    label={`Progress: ${getProgressValue().toFixed(1)}%`}
                    variant="outlined"
                    size="small"
                    color={getProgressColor()}
                  />
                  {/* {selectedPreset && (
                    <Chip
                      label={selectedPreset}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  )} */}
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Settings and Presets */}
          <Grid item xs={12} md={4}>
            {/* Settings */}
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
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {soundEnabled ? (
                        <Volume2 size={16} />
                      ) : (
                        <VolumeX size={16} />
                      )}
                      Sound Alerts
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={autoRestart}
                      onChange={(e) => setAutoRestart(e.target.checked)}
                    />
                  }
                  label="Auto Restart"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={showProgress}
                      onChange={(e) => setShowProgress(e.target.checked)}
                    />
                  }
                  label="Show Progress Bar"
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* AdSense */}
        {isProductionEnv && <AdSense adSlot="6613251015" />}

        {/* Features Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Countdown Timer Features
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
                  Popular Presets
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose from 8 carefully crafted presets including Pomodoro (25
                  min), Short Break (5 min), Workout intervals, Meditation
                  sessions, Tea Timer, and more. Each preset is optimized for
                  its specific use case.
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
                  Sound Alerts & Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Built-in sound notifications alert you when your countdown
                  reaches zero. Enable or disable sound alerts based on your
                  environment and preferences for distraction-free timing
                  sessions.
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
                  Visual Progress Tracking
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor your countdown progress with a visual progress bar
                  that changes color as time advances. Perfect for maintaining
                  focus and understanding how much time remains at a glance.
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
                  Auto-Restart & Export
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enable auto-restart for repeating intervals perfect for
                  interval training or Pomodoro sessions. Export your timing
                  results as PNG, PDF, or CSV files for documentation and
                  sharing.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Timer Presets Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Popular Timer Presets
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {PRESETS.map((preset, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
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
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {preset.name}
                  </Typography>
                  <Typography
                    variant="h5"
                    color="primary"
                    fontWeight={600}
                    gutterBottom
                  >
                    {formatTime((preset.minutes * 60 + preset.seconds) * 1000)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {preset.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
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
                title: "Pomodoro Technique",
                desc: "25-minute focus sessions with 5-minute breaks for enhanced productivity",
              },
              {
                title: "Cooking & Baking",
                desc: "Precise timing for recipes, boiling, steaming, and baking processes",
              },
              {
                title: "Workout Intervals",
                desc: "HIIT training, rest periods, and exercise duration timing",
              },
              {
                title: "Meditation & Mindfulness",
                desc: "Guided meditation sessions and mindfulness practice timing",
              },
              {
                title: "Study Sessions",
                desc: "Focused study periods with scheduled breaks for optimal learning",
              },
              {
                title: "Presentations & Meetings",
                desc: "Time management for presentations, speeches, and meeting segments",
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
            {faqData.mainEntity.map((faq, index) => (
              <Box
                key={index}
                sx={{ mb: index < faqData.mainEntity.length - 1 ? 4 : 0 }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {faq.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {faq.acceptedAnswer.text}
                </Typography>
                {index < faqData.mainEntity.length - 1 && (
                  <Divider sx={{ mt: 3 }} />
                )}
              </Box>
            ))}
          </Paper>
        </Box>

        {/* Social Share */}
        <Box sx={{ mt: 6 }}>
          <SocialShare
            url={shareLink}
            title="Online Countdown Timer with Presets - KodeKit"
            description="Free countdown timer with Pomodoro, cooking, workout presets and sound alerts. Perfect for productivity and time management."
            hashtags={[
              "countdown",
              "timer",
              "pomodoro",
              "productivity",
              "cooking",
              "workout",
            ]}
          />
        </Box>
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
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

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
    </Container>
  );
};

export default CountdownTimer;
