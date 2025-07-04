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

    if (birthDate > today) {
      setError("Birth date cannot be in the future");
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

    const ageResultsClone = ageResultsRef.current.cloneNode(
      true
    ) as HTMLElement;

    const downloadButton = ageResultsClone.querySelector(
      "[data-download-button]"
    );
    if (downloadButton) {
      downloadButton.parentNode?.removeChild(downloadButton);
    }

    ageResultsClone.style.backgroundColor = theme.palette.background.paper;
    ageResultsClone.style.padding = "20px";
    ageResultsClone.style.borderRadius = "0px";
    ageResultsClone.style.position = "absolute";
    ageResultsClone.style.left = "-9999px";
    document.body.appendChild(ageResultsClone);

    html2canvas(ageResultsClone).then((canvas) => {
      try {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `age_calculation_${
          new Date().toISOString().split("T")[0]
        }.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating PNG:", error);
        alert("Failed to generate PNG. Please try again.");
      } finally {
        document.body.removeChild(ageResultsClone);
      }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>
          Age Calculator | Calculate Your Exact Age in Years, Months & Days
        </title>
        <meta
          name="description"
          content="Free online age calculator tool. Calculate your exact age in years, months, and days with precision. Perfect for birthdays, anniversaries, and legal age verification."
        />
        <meta
          name="keywords"
          content="age calculator, birthday calculator, date of birth calculator, how old am I, calculate age in years months days, exact age calculator, online age tool, age verification, birth date calculator, chronological age calculator"
        />
        <meta
          property="og:title"
          content="Age Calculator | Calculate Your Exact Age in Years, Months & Days"
        />
        <meta
          property="og:description"
          content="Free online age calculator tool. Calculate your exact age in years, months, and days with precision. Perfect for birthdays, anniversaries, and legal age verification."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/age-calculator"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Age Calculator | Calculate Your Exact Age in Years, Months & Days"
        />
        <meta
          name="twitter:description"
          content="Free online age calculator tool. Calculate your exact age in years, months, and days with precision. Perfect for birthdays, anniversaries, and legal age verification."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/age-calculator"
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
          aria-label="Age calculator tool"
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                fontWeight={600}
              >
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
                        "aria-label": "Select your birth date",
                        "aria-describedby": "birth-date-description",
                      },
                    }}
                    disableFuture
                  />
                </LocalizationProvider>
                <Typography
                  id="birth-date-description"
                  variant="caption"
                  color="text.secondary"
                >
                  Select your date of birth to calculate your exact age
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={calculateAge}
                  startIcon={<Calculator size={20} />}
                  disabled={!birthDate}
                  aria-label="Calculate age"
                >
                  Calculate Age
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleReset}
                  disabled={!birthDate && !calculatedAge}
                  aria-label="Reset calculator"
                >
                  Reset
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                fontWeight={600}
              >
                Your Age Results
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
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Typography
                    variant="h4"
                    component="p"
                    gutterBottom
                    fontWeight={700}
                    color="primary"
                    aria-label="Your exact age"
                  >
                    {calculatedAge.years} years, {calculatedAge.months} months,{" "}
                    {calculatedAge.days} days
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" component="h3" gutterBottom>
                    Additional Age Information:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body1" aria-label="Total months">
                        <strong>Total Months:</strong>{" "}
                        {calculatedAge.totalMonths}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" aria-label="Total weeks">
                        <strong>Total Weeks:</strong> {calculatedAge.totalWeeks}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1" aria-label="Total days">
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
                      aria-label="Download age results"
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
                  aria-label="Age results will appear here"
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
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                fontWeight={600}
              >
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
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                fontWeight={600}
              >
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
                <li>Verifying school enrollment ages</li>
                <li>Calculating senior citizen discounts</li>
              </Typography>
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography component="div" sx={{ mt: 2 }}>
            <Typography variant="subtitle1" component="h4" fontWeight={500}>
              Q: How accurate is this age calculator?
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 2 }}>
              A: Our age calculator is highly accurate, accounting for leap
              years and varying month lengths. It provides exact age down to the
              day.
            </Typography>

            <Typography variant="subtitle1" component="h4" fontWeight={500}>
              Q: Can I calculate age for future dates?
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 2 }}>
              A: No, our calculator only works for dates in the past. Future
              dates will show an error message.
            </Typography>

            <Typography variant="subtitle1" component="h4" fontWeight={500}>
              Q: Does this work for historical dates?
            </Typography>
            <Typography variant="body1" component="p">
              A: Yes, you can calculate age for any valid date in the past, even
              centuries ago.
            </Typography>
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default AgeCalculator;
