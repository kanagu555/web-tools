"use client";

import { useState, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert,
  Tooltip,
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Calendar,
  Calculator,
  Download,
  Share2,
  Gift,
  Copy,
} from "lucide-react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
  nextBirthday: {
    daysUntil: number;
    date: Date;
  };
}

const AgeCalculator: React.FC = () => {
  const theme = useTheme();
  const { trackTool } = useAnalytics();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const ageResultsRef = useRef<HTMLDivElement>(null);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const calculateAge = useCallback(() => {
    if (!birthDate) {
      setError("Please select a birth date");
      showSnackbar("Please select a birth date", "error");
      return;
    }

    const today = new Date();

    if (birthDate > today) {
      setError("Birth date cannot be in the future");
      showSnackbar("Birth date cannot be in the future", "error");
      return;
    }

    setError("");

    const currentDate = new Date(today);
    const birthDateCopy = new Date(birthDate);

    let years = currentDate.getFullYear() - birthDateCopy.getFullYear();
    let months = currentDate.getMonth() - birthDateCopy.getMonth();
    let days = currentDate.getDate() - birthDateCopy.getDate();

    if (days < 0) {
      const lastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      days += lastMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    const diffTime = Math.abs(currentDate.getTime() - birthDateCopy.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;

    // Calculate next birthday
    const nextBirthdayThisYear = new Date(
      currentDate.getFullYear(),
      birthDateCopy.getMonth(),
      birthDateCopy.getDate()
    );
    const nextBirthdayDate =
      nextBirthdayThisYear > currentDate
        ? nextBirthdayThisYear
        : new Date(
          currentDate.getFullYear() + 1,
          birthDateCopy.getMonth(),
          birthDateCopy.getDate()
        );

    const daysUntilBirthday = Math.ceil(
      (nextBirthdayDate.getTime() - currentDate.getTime()) /
      (1000 * 60 * 60 * 24)
    );

    setCalculatedAge({
      years,
      months,
      days,
      totalDays,
      totalMonths,
      totalWeeks,
      totalHours,
      totalMinutes,
      nextBirthday: {
        daysUntil: daysUntilBirthday,
        date: nextBirthdayDate,
      },
    });

    showSnackbar("Age calculated successfully!", "success");
    trackTool("age-calculator", "calculate");
  }, [birthDate, showSnackbar, trackTool]);

  const handleReset = useCallback(() => {
    setBirthDate(null);
    setCalculatedAge(null);
    setError("");
    showSnackbar("Calculator reset", "info");
    trackTool("age-calculator", "reset");
  }, [showSnackbar, trackTool]);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showSnackbar("Copied to clipboard!", "success");
        trackTool("age-calculator", "copy");
      } catch (err) {
        showSnackbar("Failed to copy to clipboard", "error");
      }
    },
    [showSnackbar, trackTool]
  );

  const shareAge = useCallback(async () => {
    if (!calculatedAge || !birthDate) return;

    const shareText = `I am ${calculatedAge.years} years, ${calculatedAge.months
      } months, and ${calculatedAge.days
      } days old! That's ${calculatedAge.totalDays.toLocaleString()} days of life! 🎂`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Age Calculation",
          text: shareText,
          url: window.location.href,
        });
        showSnackbar("Shared successfully!", "success");
        trackTool("age-calculator", "share");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  }, [calculatedAge, birthDate, copyToClipboard, showSnackbar, trackTool]);

  const downloadAgeDetails = useCallback(async () => {
    if (!calculatedAge || !ageResultsRef.current) {
      showSnackbar("No age data to download", "error");
      return;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;

      // Create a custom styled element for download
      const downloadElement = document.createElement("div");
      downloadElement.style.cssText = `
        width: 800px;
        padding: 40px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        border-radius: 16px;
        position: absolute;
        left: -9999px;
        top: 0;
      `;

      downloadElement.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 48px; font-weight: 700; margin: 0 0 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
            ${calculatedAge.years} years, ${calculatedAge.months} months, ${calculatedAge.days
        } days
          </h1>
          <p style="font-size: 18px; margin: 0; opacity: 0.9;">My Age Calculation</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 30px; backdrop-filter: blur(10px);">
          <h2 style="font-size: 24px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">Detailed Statistics</h2>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <div style="font-size: 28px; font-weight: 700; margin-bottom: 5px;">
                ${calculatedAge.totalDays.toLocaleString()}
              </div>
              <div style="font-size: 14px; opacity: 0.8;">Total Days</div>
            </div>
            
            <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <div style="font-size: 28px; font-weight: 700; margin-bottom: 5px;">
                ${calculatedAge.totalWeeks.toLocaleString()}
              </div>
              <div style="font-size: 14px; opacity: 0.8;">Total Weeks</div>
            </div>
            
            <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <div style="font-size: 28px; font-weight: 700; margin-bottom: 5px;">
                ${calculatedAge.totalMonths}
              </div>
              <div style="font-size: 14px; opacity: 0.8;">Total Months</div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
            <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">
                ${calculatedAge.totalHours.toLocaleString()}
              </div>
              <div style="font-size: 14px; opacity: 0.8;">Total Hours</div>
            </div>
            
            <div style="text-align: center; background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: 700; margin-bottom: 5px;">
                ${calculatedAge.totalMinutes.toLocaleString()}
              </div>
              <div style="font-size: 14px; opacity: 0.8;">Total Minutes</div>
            </div>
          </div>
          
          <div style="text-align: center; background: rgba(255,255,255,0.15); padding: 20px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.2);">
            <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px; color: #FFD700;">
              ${calculatedAge.nextBirthday.daysUntil}
            </div>
            <div style="font-size: 16px; opacity: 0.9;">Days Until Next Birthday 🎂</div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; opacity: 0.8;">
          <p style="margin: 0; font-size: 14px;">Generated by KodeKit.in - Age Calculator</p>
        </div>
      `;

      document.body.appendChild(downloadElement);

      const canvas = await html2canvas(downloadElement, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      document.body.removeChild(downloadElement);

      const link = document.createElement("a");
      link.download = `my-age-calculation-${new Date().toISOString().split("T")[0]
        }.png`;
      link.href = canvas.toDataURL();
      link.click();

      showSnackbar("Age details downloaded!", "success");
      trackTool("age-calculator", "download");
    } catch (error) {
      console.error("Error downloading age details:", error);
      showSnackbar("Failed to download age details", "error");
    }
  }, [calculatedAge, showSnackbar, trackTool]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Navigation />

          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            fontWeight={700}
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              textAlign: { xs: "center", md: "left" },
              mb: 2,
            }}
          >
            Age Calculator
          </Typography>
          <Typography
            variant="h2"
            component="p"
            color="text.secondary"
            paragraph
            sx={{
              fontSize: "1.25rem",
              fontWeight: 400,
              textAlign: { xs: "center", md: "left" },
              mb: 4,
            }}
          >
            Calculate your exact age in years, months, and days with precision.
            Perfect for birthdays, anniversaries, and age verification.
          </Typography>

          <Grid container spacing={4}>
            {/* Input Section */}
            <Grid item xs={12} lg={5}>
              <Box
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
                  borderRadius: 4,
                  p: 4,
                  border: `1px solid ${theme.palette.divider}`,
                  position: "relative",
                  overflow: "hidden",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Calculator size={24} aria-hidden="true" />
                  </Box>
                  <Typography
                    variant="h3"
                    component="h3"
                    fontWeight={600}
                    sx={{ fontSize: "1.5rem" }}
                  >
                    Calculate Your Age
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <DatePicker
                    label="Select Your Birth Date"
                    value={birthDate}
                    onChange={(newValue) => {
                      setBirthDate(newValue);
                      setCalculatedAge(null);
                      setError("");
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        error: !!error,
                        helperText:
                          error || "Choose your date of birth to get started",
                        "aria-label": "Select your birth date",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper,
                            "&:hover": {
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                          },
                        },
                      },
                    }}
                    disableFuture
                    maxDate={new Date()}
                    minDate={new Date(1900, 0, 1)}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    onClick={calculateAge}
                    startIcon={<Calculator size={20} aria-hidden="true" />}
                    disabled={!birthDate}
                    aria-label="Calculate your exact age"
                    size="large"
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
                      "&:hover": {
                        boxShadow: `0 6px 25px ${theme.palette.primary.main}60`,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Calculate Age
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    disabled={!birthDate && !calculatedAge}
                    aria-label="Reset calculator and clear all data"
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      borderColor: theme.palette.error.main,
                      color: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: `${theme.palette.error.main}10`,
                        borderColor: theme.palette.error.dark,
                      },
                    }}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Results Section */}
            <Grid item xs={12} lg={7}>
              {calculatedAge ? (
                <Box
                  ref={ageResultsRef}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                    borderRadius: 4,
                    p: 4,
                    border: `1px solid ${theme.palette.divider}`,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
                    },
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: theme.palette.success.main,
                        color: "white",
                        mr: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Gift size={24} aria-hidden="true" />
                    </Box>
                    <Typography
                      variant="h3"
                      component="h3"
                      fontWeight={600}
                      sx={{ fontSize: "1.5rem" }}
                    >
                      Your Age Results
                    </Typography>
                  </Box>

                  {/* Main Age Display */}
                  <Box
                    sx={{
                      textAlign: "center",
                      mb: 4,
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}10 100%)`,
                      border: `1px solid ${theme.palette.primary.main}30`,
                    }}
                  >
                    <Typography
                      variant="h2"
                      component="p"
                      fontWeight={700}
                      color="primary"
                      aria-label={`Your exact age is ${calculatedAge.years} years, ${calculatedAge.months} months, and ${calculatedAge.days} days`}
                      sx={{
                        fontSize: { xs: "1.8rem", sm: "2.5rem" },
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        mb: 1,
                      }}
                    >
                      {calculatedAge.years} years, {calculatedAge.months}{" "}
                      months, {calculatedAge.days} days
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      That's your exact age right now!
                    </Typography>
                  </Box>

                  {/* Statistics Grid */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.info.main}15 0%, ${theme.palette.info.main}05 100%)`,
                          border: `1px solid ${theme.palette.info.main}30`,
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "translateY(-2px)" },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mt: 1 }}
                          color="info.main"
                        >
                          {calculatedAge.totalDays.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Days
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.secondary.main}15 0%, ${theme.palette.secondary.main}05 100%)`,
                          border: `1px solid ${theme.palette.secondary.main}30`,
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "translateY(-2px)" },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mt: 1 }}
                          color="secondary.main"
                        >
                          {calculatedAge.totalWeeks.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Weeks
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.warning.main}15 0%, ${theme.palette.warning.main}05 100%)`,
                          border: `1px solid ${theme.palette.warning.main}30`,
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "translateY(-2px)" },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="warning.main"
                          sx={{ mt: 1 }}
                        >
                          {calculatedAge.totalMonths}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Months
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.main}05 100%)`,
                          border: `1px solid ${theme.palette.success.main}30`,
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "translateY(-2px)" },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="success.main"
                          sx={{ mt: 1 }}
                        >
                          {calculatedAge.totalHours.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Hours
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}05 100%)`,
                          border: `1px solid ${theme.palette.primary.main}30`,
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "translateY(-2px)" },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="primary.main"
                          sx={{ mt: 1 }}
                        >
                          {calculatedAge.totalMinutes.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total Minutes
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={6} sm={4}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${theme.palette.error.main}15 0%, ${theme.palette.error.main}05 100%)`,
                          border: `1px solid ${theme.palette.error.main}30`,
                          transition: "transform 0.2s ease",
                          "&:hover": { transform: "translateY(-2px)" },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mt: 1 }}
                          color="error.main"
                        >
                          {calculatedAge.nextBirthday.daysUntil}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Days to Birthday
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      justifyContent: "center",
                      pt: 2,
                      borderTop: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Tooltip title="Copy age details to clipboard">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Copy size={16} />}
                        onClick={() =>
                          copyToClipboard(
                            `I am ${calculatedAge.years} years, ${calculatedAge.months} months, and ${calculatedAge.days} days old!`
                          )
                        }
                        aria-label="Copy age details to clipboard"
                        sx={{
                          borderRadius: 2,
                          color: "white",
                          backgroundColor: theme.palette.secondary.main,
                          borderColor: theme.palette.secondary.main,
                          "&:hover": {
                            backgroundColor: theme.palette.secondary.dark,
                            borderColor: theme.palette.secondary.dark,
                          },
                        }}
                      >
                        Copy
                      </Button>
                    </Tooltip>
                    <Tooltip title="Share your age">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={shareAge}
                        startIcon={<Share2 size={16} />}
                        aria-label="Share your age calculation"
                        sx={{
                          borderRadius: 2,
                          color: "white",
                          backgroundColor: theme.palette.info.main,
                          borderColor: theme.palette.info.main,
                          "&:hover": {
                            backgroundColor: theme.palette.info.dark,
                            borderColor: theme.palette.info.dark,
                          },
                        }}
                      >
                        Share
                      </Button>
                    </Tooltip>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<Download size={16} />}
                      onClick={downloadAgeDetails}
                      aria-label="Download age results as image"
                      sx={{
                        borderRadius: 2,
                        color: "white",
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        "&:hover": {
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        },
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                    borderRadius: 4,
                    p: 6,
                    border: `2px dashed ${theme.palette.divider}`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "400px",
                    textAlign: "center",
                  }}
                  aria-label="Age results will appear here after calculation"
                >
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: "50%",
                      backgroundColor: `${theme.palette.primary.main}10`,
                      mb: 3,
                    }}
                  >
                    <Calendar
                      size={64}
                      color={theme.palette.primary.main}
                      aria-hidden="true"
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    gutterBottom
                    color="primary"
                  >
                    Ready to Calculate!
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: 300 }}
                  >
                    Select your birth date and click Calculate to see your
                    detailed age information with beautiful statistics
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* AdSense Ad */}
          <AdSense adSlot="3047962369" />

          {/* Enhanced SEO-friendly content section */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mt: 6,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
            component="section"
            aria-labelledby="age-calculator-guide"
          >
            <Typography
              id="age-calculator-guide"
              variant="h2"
              component="h2"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.5rem", mb: 3 }}
            >
              Complete Guide to Age Calculation
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h3"
                  component="h3"
                  gutterBottom
                  fontWeight={600}
                  sx={{ fontSize: "1.1rem" }}
                >
                  How Our Age Calculator Works
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Our age calculator uses precise mathematical algorithms to
                  determine your exact age. The calculation starts by finding
                  the difference between the current date and your birth date,
                  then adjusts for cases where the current day of the month is
                  earlier than the birth day.
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  The system accounts for leap years, varying month lengths, and
                  ensures accurate results even for complex dates like February
                  29th in leap years. This makes our calculator reliable for
                  legal, administrative, and personal use.
                </Typography>

                <Typography
                  variant="h3"
                  component="h3"
                  gutterBottom
                  fontWeight={600}
                  sx={{ fontSize: "1.1rem", mt: 3 }}
                >
                  Age Calculation Features
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                >
                  <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                    <li>Exact age in years, months, and days</li>
                    <li>Total days, weeks, and months lived</li>
                    <li>Hours and minutes of life calculation</li>
                    <li>Next birthday countdown</li>
                    <li>Leap year accurate calculations</li>
                    <li>Historical date support (back to 1900)</li>
                    <li>Download results as image</li>
                    <li>Share age calculations easily</li>
                  </ul>
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="h3"
                  component="h3"
                  gutterBottom
                  fontWeight={600}
                  sx={{ fontSize: "1.1rem" }}
                >
                  Common Uses for Age Calculation
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                >
                  <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                    <li>Legal age verification for contracts and services</li>
                    <li>School enrollment and grade placement</li>
                    <li>Insurance premium calculations</li>
                    <li>Retirement planning and benefits</li>
                    <li>Medical age-related assessments</li>
                    <li>Birthday and anniversary planning</li>
                    <li>Senior citizen discount eligibility</li>
                    <li>Age-restricted product purchases</li>
                    <li>Employment age requirements</li>
                    <li>Social security and pension calculations</li>
                  </ul>
                </Typography>

                <Typography
                  variant="h3"
                  component="h3"
                  gutterBottom
                  fontWeight={600}
                  sx={{ fontSize: "1.1rem", mt: 3 }}
                >
                  Why Choose Our Age Calculator?
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Our calculator stands out with its precision, user-friendly
                  interface, and comprehensive results. Unlike basic
                  calculators, we provide detailed statistics including total
                  hours lived, next birthday countdown, and easy sharing
                  options.
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.25rem" }}
            >
              Frequently Asked Questions
            </Typography>

            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    How accurate is this age calculator?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our age calculator is extremely accurate, accounting for
                    leap years, varying month lengths, and all calendar
                    complexities. It provides exact age calculations down to the
                    day, making it suitable for legal and official purposes.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    Can I calculate age for future dates?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No, our calculator only works for birth dates in the past.
                    Future dates will display an error message since age
                    calculation requires a past birth date.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    What's the oldest date I can calculate?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You can calculate age for any date back to January 1, 1900.
                    This covers virtually all living people and many historical
                    calculations you might need.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    How do you handle leap years?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our calculator automatically accounts for leap years in its
                    calculations. This ensures accurate results even for people
                    born on February 29th or during leap year periods.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    Can I download or share my results?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yes! You can download your age calculation as a high-quality
                    image, copy the results to your clipboard, or share them
                    directly using your device's sharing features.
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    component="h4"
                    fontWeight={600}
                    gutterBottom
                  >
                    Is my birth date information stored?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No, we don't store any personal information. All
                    calculations are performed in your browser, and your birth
                    date is never sent to our servers or saved anywhere.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* AdSense Ad */}
          <AdSense adSlot="1925476988" />

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
        </motion.div>
      </Container>
    </LocalizationProvider>
  );
};

export default AgeCalculator;
