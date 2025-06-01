import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Tab,
  Tabs,
} from "@mui/material";
import { motion } from "framer-motion";
import { Copy, Trash2, FileText, Download } from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const StatisticsCalculator = () => {
  const theme = useTheme();
  const [numbers, setNumbers] = useState("");
  const [stats, setStats] = useState<{
    mean: number;
    median: number;
    mode: number[];
    range: number;
    standardDeviation: number;
    variance: number;
    sum: number;
    count: number;
    min: number;
    max: number;
    quartiles: number[];
    iqr: number;
  } | null>(null);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [activeTab, setActiveTab] = useState(0);

  const calculateStats = () => {
    try {
      const values = numbers
        .split(/[,\s]+/)
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !isNaN(n));

      if (values.length === 0) {
        setError("Please enter valid numbers");
        setSnackbarMessage("Please enter valid numbers");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Sort values for median and range
      const sortedValues = [...values].sort((a, b) => a - b);
      const count = values.length;

      // Calculate mean
      const sum = values.reduce((a, b) => a + b, 0);
      const mean = sum / count;

      // Calculate median
      const median =
        sortedValues.length % 2 === 0
          ? (sortedValues[count / 2 - 1] + sortedValues[count / 2]) / 2
          : sortedValues[Math.floor(count / 2)];

      // Calculate mode
      const frequency: { [key: number]: number } = {};
      values.forEach((value) => {
        frequency[value] = (frequency[value] || 0) + 1;
      });
      const maxFrequency = Math.max(...Object.values(frequency));
      const mode = Object.entries(frequency)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, freq]) => freq === maxFrequency)
        .map(([value]) => parseFloat(value));

      // Calculate range
      const min = sortedValues[0];
      const max = sortedValues[sortedValues.length - 1];
      const range = max - min;

      // Calculate variance and standard deviation
      const variance =
        values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
      const standardDeviation = Math.sqrt(variance);

      // Calculate quartiles and IQR
      const q1Index = Math.floor(count * 0.25);
      const q3Index = Math.floor(count * 0.75);
      const q1 =
        count % 4 === 0
          ? (sortedValues[q1Index - 1] + sortedValues[q1Index]) / 2
          : sortedValues[q1Index];
      const q3 =
        count % 4 === 0
          ? (sortedValues[q3Index - 1] + sortedValues[q3Index]) / 2
          : sortedValues[q3Index];
      const iqr = q3 - q1;

      setStats({
        mean,
        median,
        mode,
        range,
        standardDeviation,
        variance,
        sum,
        count,
        min,
        max,
        quartiles: [q1, median, q3],
        iqr,
      });
      setError("");
      setSnackbarMessage("Statistics calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error calculating statistics");
      setStats(null);
      setSnackbarMessage("Error calculating statistics");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClear = () => {
    setNumbers("");
    setStats(null);
    setError("");
    setSnackbarMessage("Data cleared");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopy = () => {
    if (!stats) return;

    const statsText = `
Statistics Summary:
Count: ${stats.count}
Sum: ${stats.sum.toFixed(4)}
Min: ${stats.min.toFixed(4)}
Max: ${stats.max.toFixed(4)}
Range: ${stats.range.toFixed(4)}
Mean: ${stats.mean.toFixed(4)}
Median: ${stats.median.toFixed(4)}
Mode: ${stats.mode.map((m) => m.toFixed(4)).join(", ")}
Variance: ${stats.variance.toFixed(4)}
Standard Deviation: ${stats.standardDeviation.toFixed(4)}
Q1: ${stats.quartiles[0].toFixed(4)}
Q3: ${stats.quartiles[2].toFixed(4)}
IQR: ${stats.iqr.toFixed(4)}
    `.trim();

    navigator.clipboard.writeText(statsText);
    setSnackbarMessage("Statistics copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setNumbers(clipboardText);
      setSnackbarMessage("Data pasted from clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSnackbarMessage("Failed to read clipboard");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleExportCSV = () => {
    if (!stats) return;

    const headers = ["Statistic", "Value"];
    const rows = [
      ["Count", stats.count],
      ["Sum", stats.sum],
      ["Min", stats.min],
      ["Max", stats.max],
      ["Range", stats.range],
      ["Mean", stats.mean],
      ["Median", stats.median],
      ["Mode", stats.mode.join(", ")],
      ["Variance", stats.variance],
      ["Standard Deviation", stats.standardDeviation],
      ["Q1", stats.quartiles[0]],
      ["Q3", stats.quartiles[2]],
      ["IQR", stats.iqr],
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => `${row[0]},${row[1]}`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "statistics_summary.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSnackbarMessage("Statistics exported as CSV");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleSampleData = () => {
    setNumbers("42, 36, 15, 73, 49, 65, 58, 27, 52, 81, 36, 45, 71, 59, 28");
    setSnackbarMessage("Sample data loaded");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Statistics Calculator | Online Data Analysis Tool</title>
        <meta
          name="description"
          content="Free online statistics calculator for data analysis. Calculate mean, median, mode, standard deviation, variance, quartiles, and more with this easy-to-use tool."
        />
        <meta
          name="keywords"
          content="statistics calculator, data analysis, mean calculator, median calculator, standard deviation calculator, variance calculator, quartiles calculator, statistical analysis, online statistics tool"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Statistics Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Calculate statistical measures and analyze numerical data.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Enter numbers"
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  error={!!error}
                  helperText={
                    error || "Enter numbers separated by commas or spaces"
                  }
                />
              </Box>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Tooltip title="Paste from clipboard">
                  <IconButton onClick={handlePaste} color="primary">
                    <FileText size={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Clear data">
                  <IconButton onClick={handleClear} color="error">
                    <Trash2 size={20} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Load sample data">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSampleData}
                    sx={{ ml: "auto" }}
                  >
                    Load Sample Data
                  </Button>
                </Tooltip>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={calculateStats}
                fullWidth
                sx={{ mb: 3 }}
              >
                Calculate Statistics
              </Button>
            </Grid>

            {stats && (
              <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                  <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                  >
                    <Tab label="Basic Stats" />
                    <Tab label="Advanced Stats" />
                  </Tabs>
                </Box>

                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  {activeTab === 0 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Count
                        </Typography>
                        <Typography variant="h6">{stats.count}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Sum
                        </Typography>
                        <Typography variant="h6">
                          {stats.sum.toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Mean
                        </Typography>
                        <Typography variant="h6">
                          {stats.mean.toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Median
                        </Typography>
                        <Typography variant="h6">
                          {stats.median.toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Mode
                        </Typography>
                        <Typography variant="h6">
                          {stats.mode.map((m) => m.toFixed(4)).join(", ")}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Range
                        </Typography>
                        <Typography variant="h6">
                          {stats.range.toFixed(4)}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {activeTab === 1 && (
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Min
                        </Typography>
                        <Typography variant="h6">
                          {stats.min.toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Max
                        </Typography>
                        <Typography variant="h6">
                          {stats.max.toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Standard Deviation
                        </Typography>
                        <Typography variant="h6">
                          {stats.standardDeviation.toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Variance
                        </Typography>
                        <Typography variant="h6">
                          {stats.variance.toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Q1 (25th Percentile)
                        </Typography>
                        <Typography variant="h6">
                          {stats.quartiles[0].toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Q3 (75th Percentile)
                        </Typography>
                        <Typography variant="h6">
                          {stats.quartiles[2].toFixed(4)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle1" color="text.secondary">
                          IQR
                        </Typography>
                        <Typography variant="h6">
                          {stats.iqr.toFixed(4)}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </Paper>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Copy />}
                    onClick={handleCopy}
                  >
                    Copy Results
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleExportCSV}
                  >
                    Export CSV
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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
      <AdSense adSlot="6613251015" />

      {/* SEO-friendly content section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          About Our Statistics Calculator
        </Typography>
        <Typography paragraph>
          Our free online statistics calculator provides a comprehensive
          solution for analyzing numerical data sets. Whether you're a student
          working on a statistics assignment, a researcher analyzing
          experimental data, or a professional making data-driven decisions,
          this tool offers quick and accurate statistical calculations.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Features of Our Statistics Calculator
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>Calculate basic statistics: mean, median, mode, range</li>
          <li>Compute advanced measures: standard deviation, variance</li>
          <li>Determine quartiles and interquartile range (IQR)</li>
          <li>Find minimum and maximum values in your data set</li>
          <li>Export results in CSV format for further analysis</li>
          <li>Copy results to clipboard with a single click</li>
          <li>
            Clear interface with separate tabs for basic and advanced statistics
          </li>
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          How to Use the Statistics Calculator
        </Typography>
        <Typography paragraph>
          Using our statistics calculator is straightforward. Simply enter your
          data set in the input field, with numbers separated by commas or
          spaces. Click the "Calculate Statistics" button, and the tool will
          instantly compute all relevant statistical measures. You can view the
          results in two convenient tabs: Basic Stats for common measures and
          Advanced Stats for more detailed analysis. Use the "Copy Results"
          button to copy all statistics to your clipboard or "Export CSV" to
          download the results in a spreadsheet-compatible format.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Understanding Statistical Measures
        </Typography>
        <Typography paragraph>
          <strong>Mean:</strong> The average of all values in your data set,
          calculated by summing all values and dividing by the count.
          <br />
          <strong>Median:</strong> The middle value when your data is arranged
          in order, representing the central tendency without being skewed by
          outliers.
          <br />
          <strong>Mode:</strong> The most frequently occurring value(s) in your
          data set.
          <br />
          <strong>Range:</strong> The difference between the maximum and minimum
          values, indicating the spread of your data.
          <br />
          <strong>Standard Deviation:</strong> A measure of how dispersed the
          data is in relation to the mean.
          <br />
          <strong>Variance:</strong> The average of the squared differences from
          the mean, indicating how far values are from the average.
          <br />
          <strong>Quartiles:</strong> Values that divide your data into
          quarters, with Q1 (25th percentile), Q2 (median), and Q3 (75th
          percentile).
          <br />
          <strong>IQR (Interquartile Range):</strong> The difference between Q3
          and Q1, representing the middle 50% of your data and useful for
          identifying outliers.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Applications of Statistical Analysis
        </Typography>
        <Typography paragraph>
          Statistical analysis is essential in numerous fields and applications:
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>
            <strong>Academic Research:</strong> Analyzing experimental results
            and survey data
          </li>
          <li>
            <strong>Business Intelligence:</strong> Making data-driven decisions
            based on performance metrics
          </li>
          <li>
            <strong>Financial Analysis:</strong> Evaluating investment
            performance and risk assessment
          </li>
          <li>
            <strong>Quality Control:</strong> Monitoring manufacturing processes
            and product consistency
          </li>
          <li>
            <strong>Healthcare:</strong> Analyzing patient data and clinical
            trial results
          </li>
          <li>
            <strong>Sports Analytics:</strong> Evaluating player and team
            performance statistics
          </li>
          <li>
            <strong>Environmental Science:</strong> Analyzing climate data and
            pollution measurements
          </li>
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Why Use an Online Statistics Calculator?
        </Typography>
        <Typography paragraph>
          Our online statistics calculator offers several advantages over
          traditional methods or specialized software. It's accessible from any
          device with an internet connection, requires no installation or
          downloads, and provides instant results with a user-friendly
          interface. The tool handles all the complex calculations for you,
          eliminating the risk of manual calculation errors. Whether you're
          working with small or large data sets, our calculator delivers
          accurate statistical measures to help you understand and interpret
          your data effectively.
        </Typography>
      </Paper>
    </Container>
  );
};

export default StatisticsCalculator;
