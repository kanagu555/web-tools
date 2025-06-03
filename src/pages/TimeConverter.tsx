import React, { useState, useRef } from "react";
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

    // Create a clone of the results div without the download button
    const resultsClone = resultsRef.current.cloneNode(true) as HTMLElement;

    // Find and remove the download button from the clone
    const downloadButton = resultsClone.querySelector("[data-download-button]");
    if (downloadButton) {
      downloadButton.parentNode?.removeChild(downloadButton);
    }

    // Set a white background for better image quality
    resultsClone.style.backgroundColor = theme.palette.background.paper;
    resultsClone.style.padding = "20px";
    resultsClone.style.borderRadius = "0px";

    // Temporarily add the clone to the document for capturing
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
        // Remove the temporary clone
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
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
          content="time converter, financial time converter, interest period converter, payment frequency converter, time unit converter, seconds to minutes, minutes to hours, hours to days, days to weeks, weeks to months, months to years, years to decades, finance calculator, financial tool, time calculation, investment period calculator, loan period calculator, compound interest period, finance time units, time conversion tool, online time converter, free time converter, web-based time converter, time unit calculator, time zone converter, world clock converter, online time converter, time difference calculator, meeting time converter, convert time zones, timezone map tool, international time converter, business hours converter, utc time converter, gmt converter, pst to est converter, london to new york time, time zone calculator, remote work time tool, react time converter, browser time zone tool, free time converter, daylight saving time tool, time converter with location, city time comparison, timezone planner, schedule across timezones, time converter github, open source time tool"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Unit"
                    value={inputUnit}
                    onChange={(e) => setInputUnit(e.target.value)}
                  >
                    {Object.keys(TIME_UNITS).map((unit) => (
                      <MenuItem key={unit} value={unit}>
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
                    >
                      Convert
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      startIcon={<RefreshCw size={18} />}
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
                        <IconButton onClick={handleCopyResults} size="small">
                          <Copy size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download results">
                        <IconButton
                          onClick={downloadResults}
                          size="small"
                          data-download-button="true"
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
                      <Typography variant="h6">
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
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Unit</TableCell>
                          <TableCell align="right">Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {conversionResult.conversions.map((conversion) => (
                          <TableRow key={conversion.unit}>
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
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About Time Units in Finance
          </Typography>
          <Typography paragraph>
            Time units play a crucial role in financial calculations, affecting
            interest rates, payment frequencies, investment periods, and more.
            Understanding how to convert between different time units is
            essential for accurate financial planning and analysis.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Financial Applications of Time Conversion
              </Typography>
              <Typography paragraph>
                Time conversion is essential in finance for standardizing
                periods across different calculations. For example, converting
                annual interest rates to monthly, daily, or continuous rates
                requires precise time unit conversion.
              </Typography>
              <Typography paragraph>
                When comparing investments with different compounding
                frequencies or payment schedules, converting all time periods to
                a standard unit allows for accurate comparison of returns and
                costs.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Common Financial Time Periods
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Daily:</strong> Used for daily compounding interest or
                  short-term money market calculations.
                </li>
                <li>
                  <strong>Weekly:</strong> Common for certain payment schedules
                  and short-term financial planning.
                </li>
                <li>
                  <strong>Monthly:</strong> The standard period for most loan
                  payments, mortgage calculations, and regular investment plans.
                </li>
                <li>
                  <strong>Quarterly:</strong> Used for dividend payments,
                  corporate financial reporting, and some investment products.
                </li>
                <li>
                  <strong>Annual:</strong> The baseline for most interest rates,
                  returns, and long-term financial planning.
                </li>
                <li>
                  <strong>Decades:</strong> Useful for retirement planning,
                  long-term investments, and generational wealth calculations.
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
  );
};

export default TimeConverter;
