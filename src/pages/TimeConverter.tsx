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
} from "@mui/material";
import { motion } from "framer-motion";
import { Clock, Download, Copy, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet";
import html2canvas from "html2canvas";
import AdSense from "../components/AdSense";

// Time units in seconds
const TIME_UNITS = {
  seconds: 1,
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2592000, // 30 days
  quarters: 7776000, // 90 days
  years: 31536000, // 365 days
  decades: 315360000, // 10 years
};

interface ConversionResult {
  inputValue: number;
  inputUnit: string;
  conversions: Array<{
    unit: string;
    value: number;
  }>;
}

const TimeConverter = () => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [inputUnit, setInputUnit] = useState("days");
  const [conversionResult, setConversionResult] =
    useState<ConversionResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const convertTime = () => {
    const value = parseFloat(inputValue);

    if (value > 0) {
      // Convert input to seconds
      const valueInSeconds =
        value * TIME_UNITS[inputUnit as keyof typeof TIME_UNITS];

      // Convert seconds to all other units
      const conversions = Object.entries(TIME_UNITS).map(([unit, seconds]) => ({
        unit,
        value: valueInSeconds / seconds,
      }));

      setConversionResult({
        inputValue: value,
        inputUnit,
        conversions,
      });

      setSnackbarMessage("Time conversion completed successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const downloadResults = () => {
    if (!conversionResult || !resultsRef.current) return;

    const resultsClone = resultsRef.current.cloneNode(true) as HTMLElement;
    const downloadButton = resultsClone.querySelector("[data-download-button]");
    if (downloadButton) {
      downloadButton.parentNode?.removeChild(downloadButton);
    }

    resultsClone.style.backgroundColor = theme.palette.background.paper;
    resultsClone.style.padding = "20px";
    resultsClone.style.borderRadius = "0px";
    resultsClone.style.position = "absolute";
    resultsClone.style.left = "-9999px";
    document.body.appendChild(resultsClone);

    html2canvas(resultsClone).then((canvas) => {
      try {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `time_conversion_${
          new Date().toISOString().split("T")[0]
        }.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSnackbarMessage("Time conversion details downloaded successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error generating PNG:", error);
        setSnackbarMessage("Failed to generate PNG. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        document.body.removeChild(resultsClone);
      }
    });
  };

  const handleReset = () => {
    setInputValue("");
    setInputUnit("days");
    setConversionResult(null);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!conversionResult) return;

    const resultsText = `
Time Conversion Summary:
Input: ${conversionResult.inputValue} ${conversionResult.inputUnit}

Conversions:
${conversionResult.conversions
  .map((c) => `${c.unit}: ${c.value.toFixed(6)}`)
  .join("\n")}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("Time conversion summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const formatUnitLabel = (unit: string) => {
    return unit.charAt(0).toUpperCase() + unit.slice(1);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      role="main"
      aria-label="Time Converter Tool"
    >
      <Helmet>
        <title>
          Time Converter | Convert Between Time Units for Financial Calculations
        </title>
        <meta
          name="description"
          content="Free online time converter for financial calculations. Convert between seconds, minutes, hours, days, weeks, months, quarters, years, and decades for interest periods and payment frequencies."
        />
        <meta
          name="keywords"
          content="time converter, financial time converter, interest period converter, payment frequency converter, time unit converter, seconds to minutes, minutes to hours, hours to days, days to weeks, weeks to months, months to years, years to decades, finance calculator, financial tool, time calculation, investment period calculator, loan period calculator"
        />
        <meta
          property="og:title"
          content="Time Converter | Convert Between Time Units for Financial Calculations"
        />
        <meta
          property="og:description"
          content="Free online time converter for financial calculations. Convert between seconds, minutes, hours, days, weeks, months, quarters, years, and decades."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/time-converter"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Time Converter | Convert Between Time Units for Financial Calculations"
        />
        <meta
          name="twitter:description"
          content="Free online time converter for financial calculations. Convert between seconds, minutes, hours, days, weeks, months, quarters, years, and decades."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/time-converter"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Time Converter",
            description:
              "Convert between different time units for financial calculations",
            url: "https://www.kodekit.in/tools/time-converter",
            applicationCategory: [
              "EducationalApplication",
              "FinanceApplication",
            ],
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "KodeKit",
            },
            keywords:
              "time converter, financial calculator, time unit conversion",
            audience: {
              "@type": "EducationalAudience",
              educationalRole: "student, teacher, financial professional",
            },
          })}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-labelledby="time-converter-heading"
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight={700}
          id="time-converter-heading"
        >
          Time Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert between different time units for financial calculations,
          interest periods, and payment frequencies.
        </Typography>

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
              role="form"
              aria-label="Time conversion form"
            >
              <Typography variant="h6" gutterBottom fontWeight={600} mb={2}>
                Conversion Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Value"
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    inputProps={{
                      "aria-label": "Enter time value to convert",
                      "aria-required": "true",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Unit"
                    value={inputUnit}
                    onChange={(e) => setInputUnit(e.target.value)}
                    inputProps={{
                      "aria-label": "Select time unit to convert from",
                    }}
                  >
                    {Object.keys(TIME_UNITS).map((unit) => (
                      <MenuItem
                        key={unit}
                        value={unit}
                        aria-label={`Convert from ${unit}`}
                      >
                        {formatUnitLabel(unit)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={convertTime}
                      disabled={!inputValue}
                      startIcon={<Clock size={18} />}
                      sx={{ flex: 1 }}
                      aria-label="Convert time units"
                    >
                      Convert
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={!inputValue}
                      startIcon={<RefreshCw size={18} />}
                      aria-label="Reset time converter form"
                    >
                      Reset
                    </Button>
                  </Box>
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
              aria-live="polite"
              aria-atomic="true"
            >
              {conversionResult ? (
                <Box ref={resultsRef}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Conversion Results
                    </Typography>
                    <Box>
                      <Tooltip title="Copy results">
                        <IconButton
                          onClick={handleCopyResults}
                          size="small"
                          aria-label="Copy conversion results to clipboard"
                        >
                          <Copy size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download results">
                        <IconButton
                          onClick={downloadResults}
                          size="small"
                          data-download-button="true"
                          aria-label="Download conversion results as image"
                        >
                          <Download size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: theme.palette.background.default,
                        borderRadius: 2,
                        mb: 2,
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Input
                      </Typography>
                      <Typography variant="h6" aria-label="Conversion input">
                        {conversionResult.inputValue}{" "}
                        {formatUnitLabel(conversionResult.inputUnit)}
                      </Typography>
                    </Paper>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Equivalent Values
                  </Typography>

                  <TableContainer sx={{ maxHeight: 300, overflow: "auto" }}>
                    <Table
                      size="small"
                      stickyHeader
                      aria-label="Time conversion results table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Unit</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {conversionResult.conversions.map((conversion) => (
                          <TableRow
                            key={conversion.unit}
                            aria-label={`${conversion.value.toFixed(6)} ${
                              conversion.unit
                            }`}
                          >
                            <TableCell>
                              {formatUnitLabel(conversion.unit)}
                            </TableCell>
                            <TableCell align="right">
                              {conversion.value.toFixed(6)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
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
                  aria-label="No conversion results yet"
                >
                  <Clock size={48} color={theme.palette.text.secondary} />
                  <Typography sx={{ mt: 2 }}>
                    Enter a value to convert between time units
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <AdSense adSlot="6613251015" />

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mt: 4,
          }}
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About Time Units in Finance
          </Typography>
          <Typography paragraph itemProp="description">
            Time units play a crucial role in financial calculations, affecting
            interest rates, payment frequencies, investment periods, and more.
            Understanding how to convert between different time units is
            essential for accurate financial planning and analysis.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
                itemProp="name"
              >
                Financial Applications of Time Conversion
              </Typography>
              <Typography
                paragraph
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <span itemProp="text">
                  Time conversion is essential in finance for standardizing
                  periods across different calculations. For example, converting
                  annual interest rates to monthly, daily, or continuous rates
                  requires precise time unit conversion.
                </span>
              </Typography>
              <Typography
                paragraph
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <span itemProp="text">
                  When comparing investments with different compounding
                  frequencies or payment schedules, converting all time periods
                  to a standard unit allows for accurate comparison of returns
                  and costs.
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
                itemProp="name"
              >
                Common Financial Time Periods
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Daily:</strong> Used for daily compounding interest
                    or short-term money market calculations.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Weekly:</strong> Common for certain payment
                    schedules and short-term financial planning.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Monthly:</strong> The standard period for most loan
                    payments, mortgage calculations, and regular investment
                    plans.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Quarterly:</strong> Used for dividend payments,
                    corporate financial reporting, and some investment products.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Annual:</strong> The baseline for most interest
                    rates, returns, and long-term financial planning.
                  </span>
                </li>
                <li
                  itemProp="acceptedAnswer"
                  itemScope
                  itemType="https://schema.org/Answer"
                >
                  <span itemProp="text">
                    <strong>Decades:</strong> Useful for retirement planning,
                    long-term investments, and generational wealth calculations.
                  </span>
                </li>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        role="status"
        aria-live="polite"
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          aria-label="Notification message"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TimeConverter;
