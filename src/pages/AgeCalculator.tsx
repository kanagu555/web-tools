import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  useTheme,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Calendar, Calculator, Download } from "lucide-react";
import { Helmet } from "react-helmet";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import html2canvas from "html2canvas";
import AdSense from "../components/AdSense";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  totalWeeks: number;
}

const AgeCalculator: React.FC = () => {
  const theme = useTheme();
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string>("");
  const ageResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateAge = () => {
    if (!birthDate) {
      setError("Please select a birth date");
      return;
    }

    const today = new Date();

    // Validate birth date is not in the future
    if (birthDate > today) {
      setError("Birth date cannot be in the future");
      return;
    }

    setError("");

    // Clone dates to avoid modifying the original
    const currentDate = new Date(today);
    const birthDateCopy = new Date(birthDate);

    // Calculate years
    let years = currentDate.getFullYear() - birthDateCopy.getFullYear();

    // Calculate months
    let months = currentDate.getMonth() - birthDateCopy.getMonth();

    // Calculate days
    let days = currentDate.getDate() - birthDateCopy.getDate();

    // Adjust if days are negative
    if (days < 0) {
      // Get the last day of the previous month
      const lastMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      );
      days += lastMonth.getDate();
      months--;
    }

    // Adjust if months are negative
    if (months < 0) {
      months += 12;
      years--;
    }

    // Calculate total days, weeks, and months for additional stats
    const diffTime = Math.abs(currentDate.getTime() - birthDateCopy.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;

    setCalculatedAge({
      years,
      months,
      days,
      totalDays,
      totalMonths,
      totalWeeks,
    });
  };

  const handleReset = () => {
    setBirthDate(null);
    setCalculatedAge(null);
    setError("");
  };

  const downloadAgeDetails = () => {
    if (!calculatedAge || !ageResultsRef.current) return;

    // Create a clone of the age results div without the download button
    const ageResultsClone = ageResultsRef.current.cloneNode(true) as HTMLElement;
    
    // Find and remove the download button from the clone
    const downloadButton = ageResultsClone.querySelector('[data-download-button]');
    if (downloadButton) {
      downloadButton.parentNode?.removeChild(downloadButton);
    }
    
    // Set a white background for better image quality
    ageResultsClone.style.backgroundColor = theme.palette.background.paper;
    ageResultsClone.style.padding = '20px';
    ageResultsClone.style.borderRadius = '0px';
    
    // Temporarily add the clone to the document for capturing
    ageResultsClone.style.position = 'absolute';
    ageResultsClone.style.left = '-9999px';
    document.body.appendChild(ageResultsClone);

    html2canvas(ageResultsClone).then((canvas) => {
      try {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `age_calculation_${new Date().toISOString().split("T")[0]}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating PNG:", error);
        alert("Failed to generate PNG. Please try again.");
      } finally {
        // Remove the temporary clone
        document.body.removeChild(ageResultsClone);
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Age Calculator | Calculate Your Exact Age</title>
        <meta
          name="description"
          content="Calculate your exact age in years, months, and days with our free online age calculator tool."
        />
        <meta
          name="keywords"
          content="age calculator, calculate age, years months days, date of birth calculator, how old am I"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Age Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Calculate your exact age in years, months, and days based on your date
          of birth.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Enter Your Birth Date
              </Typography>
              <Box sx={{ mb: 3 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Birth Date"
                    value={birthDate}
                    onChange={(newValue) => {
                      setBirthDate(newValue);
                      setCalculatedAge(null);
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        error: !!error,
                        helperText: error,
                      },
                    }}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateAge}
                  startIcon={<Calculator />}
                  disabled={!birthDate}
                >
                  Calculate Age
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReset}
                  disabled={!birthDate && !calculatedAge}
                >
                  Reset
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Your Age
              </Typography>
              {calculatedAge ? (
                <Box
                  ref={ageResultsRef}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.2)"
                        : "rgba(0, 0, 0, 0.03)",
                  }}
                >
                  <Typography
                    variant="h4"
                    gutterBottom
                    fontWeight={700}
                    color="primary"
                  >
                    {calculatedAge.years} years, {calculatedAge.months} months,{" "}
                    {calculatedAge.days} days
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Additional Age Information:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        <strong>Total Months:</strong>{" "}
                        {calculatedAge.totalMonths}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        <strong>Total Weeks:</strong> {calculatedAge.totalWeeks}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        <strong>Total Days:</strong> {calculatedAge.totalDays}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<Download size={18} />}
                      onClick={downloadAgeDetails}
                      data-download-button="true"
                    >
                      Download
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(0, 0, 0, 0.2)"
                        : "rgba(0, 0, 0, 0.03)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "200px",
                  }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Calendar size={48} color={theme.palette.text.secondary} />
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Select your birth date and click Calculate to see your age
                    </Typography>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>

        <AdSense adSlot="6613251015" />

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About Age Calculation
          </Typography>
          <Typography paragraph>
            Age calculation is the process of determining the elapsed time
            between a person's birth date and the current date. Our age
            calculator provides precise results in years, months, and days,
            accounting for leap years and varying month lengths.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                How Age Is Calculated
              </Typography>
              <Typography paragraph>
                The calculation starts by finding the difference between the
                current date and birth date. It then adjusts for cases where the
                current day of the month is earlier than the birth day,
                borrowing days from the previous month and adjusting the month
                count accordingly.
              </Typography>
              <Typography paragraph>
                Similarly, if the resulting month count is negative, it borrows
                12 months from the year count. This ensures accurate results
                even for dates like February 29th in leap years.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Common Uses for Age Calculation
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  Determining eligibility for age-restricted services or
                  products
                </li>
                <li>
                  Calculating exact age for legal or administrative purposes
                </li>
                <li>Planning birthday celebrations and anniversaries</li>
                <li>Tracking developmental milestones for children</li>
                <li>Calculating retirement planning timeframes</li>
                <li>Determining age-based insurance premiums</li>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AgeCalculator;
