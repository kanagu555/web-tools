"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
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
  Card,
  CardContent,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Copy,
  Trash2,
  FileText,
  Download,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface StatisticsResult {
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
}

const StatisticsCalculator = () => {
  const theme = useTheme();
  const { trackTool } = useAnalytics();
  const [numbers, setNumbers] = useState("");
  const [stats, setStats] = useState<StatisticsResult | null>(null);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [activeTab, setActiveTab] = useState(0);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );
  const calculateStats = useCallback(() => {
    try {
      const values = numbers
        .split(/[,\s]+/)
        .map((n) => parseFloat(n.trim()))
        .filter((n) => !isNaN(n));

      if (values.length === 0) {
        setError("Please enter valid numbers");
        showSnackbar("Please enter valid numbers", "error");
        return;
      }

      // Sort values for median and quartiles
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
        .filter(([, freq]) => freq === maxFrequency)
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
      showSnackbar("Statistics calculated successfully", "success");
      trackTool("statistics-calculator", "calculate");
    } catch (err) {
      setError("Error calculating statistics");
      setStats(null);
      showSnackbar("Error calculating statistics", "error");
    }
  }, [numbers, showSnackbar, trackTool]);
  const handleClear = useCallback(() => {
    setNumbers("");
    setStats(null);
    setError("");
    showSnackbar("Data cleared", "info");
    trackTool("statistics-calculator", "clear");
  }, [showSnackbar, trackTool]);

  const handleCopy = useCallback(async () => {
    if (!stats) return;

    const statsText = `Statistics Summary:
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
IQR: ${stats.iqr.toFixed(4)}`;

    try {
      await navigator.clipboard.writeText(statsText);
      showSnackbar("Statistics copied to clipboard", "success");
      trackTool("statistics-calculator", "copy");
    } catch (err) {
      showSnackbar("Failed to copy to clipboard", "error");
    }
  }, [stats, showSnackbar, trackTool]);

  const handlePaste = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setNumbers(clipboardText);
      showSnackbar("Data pasted from clipboard", "success");
      trackTool("statistics-calculator", "paste");
    } catch (err) {
      showSnackbar("Failed to read clipboard", "error");
    }
  }, [showSnackbar, trackTool]);

  const handleExportCSV = useCallback(() => {
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
    URL.revokeObjectURL(url);

    showSnackbar("Statistics exported as CSV", "success");
    trackTool("statistics-calculator", "export");
  }, [stats, showSnackbar, trackTool]);

  const handleSampleData = useCallback(() => {
    setNumbers("42, 36, 15, 73, 49, 65, 58, 27, 52, 81, 36, 45, 71, 59, 28");
    showSnackbar("Sample data loaded", "success");
    trackTool("statistics-calculator", "sample-data");
  }, [showSnackbar, trackTool]);
  const StatCard = ({
    title,
    value,
    icon,
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
  }) => (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          {icon}
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h6" fontWeight={600} color="primary.main">
          {typeof value === "number" ? value.toFixed(4) : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
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
          Statistics Calculator
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
          Calculate statistical measures and analyze numerical data with
          comprehensive statistics including mean, median, mode, standard
          deviation, and more.
        </Typography>
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
            maxWidth: 900,
            mx: "auto",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Enter numbers"
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  error={!!error}
                  helperText={
                    error ||
                    "Enter numbers separated by commas or spaces (e.g., 1, 2, 3, 4, 5)"
                  }
                  placeholder="42, 36, 15, 73, 49, 65, 58, 27, 52, 81"
                  aria-label="Enter numbers for statistical analysis"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.paper,
                    },
                  }}
                />
                <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
                  <Tooltip title="Paste from clipboard">
                    <IconButton
                      onClick={handlePaste}
                      color="primary"
                      aria-label="Paste numbers from clipboard"
                    >
                      <FileText size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear data">
                    <IconButton
                      onClick={handleClear}
                      disabled={!numbers}
                      color="error"
                      aria-label="Clear input data"
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleSampleData}
                    sx={{ ml: "auto" }}
                    aria-label="Load sample data"
                  >
                    Load Sample Data
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={calculateStats}
                  fullWidth
                  size="large"
                  disabled={!numbers.trim()}
                  aria-label="Calculate statistics"
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  Calculate Statistics
                </Button>
              </Grid>
              {stats && (
                <Grid item xs={12}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      variant="fullWidth"
                      aria-label="Statistics results tabs"
                    >
                      <Tab
                        label="Basic Statistics"
                        icon={<BarChart3 size={20} />}
                        iconPosition="start"
                        id="basic-stats-tab"
                        aria-controls="basic-stats-panel"
                      />
                      <Tab
                        label="Advanced Statistics"
                        icon={<TrendingUp size={20} />}
                        iconPosition="start"
                        id="advanced-stats-tab"
                        aria-controls="advanced-stats-panel"
                      />
                    </Tabs>
                  </Box>

                  {activeTab === 0 && (
                    <div
                      id="basic-stats-panel"
                      role="tabpanel"
                      aria-labelledby="basic-stats-tab"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Count"
                            value={stats.count}
                            icon={
                              <BarChart3
                                size={16}
                                color={theme.palette.primary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Sum"
                            value={stats.sum}
                            icon={
                              <TrendingUp
                                size={16}
                                color={theme.palette.primary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Mean (Average)"
                            value={stats.mean}
                            icon={
                              <BarChart3
                                size={16}
                                color={theme.palette.primary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Median"
                            value={stats.median}
                            icon={
                              <TrendingUp
                                size={16}
                                color={theme.palette.primary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Mode"
                            value={stats.mode
                              .map((m) => m.toFixed(4))
                              .join(", ")}
                            icon={
                              <BarChart3
                                size={16}
                                color={theme.palette.primary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Range"
                            value={stats.range}
                            icon={
                              <TrendingUp
                                size={16}
                                color={theme.palette.primary.main}
                              />
                            }
                          />
                        </Grid>
                      </Grid>
                    </div>
                  )}
                  {activeTab === 1 && (
                    <div
                      id="advanced-stats-panel"
                      role="tabpanel"
                      aria-labelledby="advanced-stats-tab"
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Minimum"
                            value={stats.min}
                            icon={
                              <BarChart3
                                size={16}
                                color={theme.palette.secondary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Maximum"
                            value={stats.max}
                            icon={
                              <TrendingUp
                                size={16}
                                color={theme.palette.secondary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Standard Deviation"
                            value={stats.standardDeviation}
                            icon={
                              <BarChart3
                                size={16}
                                color={theme.palette.secondary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Variance"
                            value={stats.variance}
                            icon={
                              <TrendingUp
                                size={16}
                                color={theme.palette.secondary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Q1 (25th Percentile)"
                            value={stats.quartiles[0]}
                            icon={
                              <BarChart3
                                size={16}
                                color={theme.palette.secondary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="Q3 (75th Percentile)"
                            value={stats.quartiles[2]}
                            icon={
                              <TrendingUp
                                size={16}
                                color={theme.palette.secondary.main}
                              />
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <StatCard
                            title="IQR (Interquartile Range)"
                            value={stats.iqr}
                            icon={
                              <BarChart3
                                size={16}
                                color={theme.palette.secondary.main}
                              />
                            }
                          />
                        </Grid>
                      </Grid>
                    </div>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 2,
                      mt: 3,
                      flexWrap: "wrap",
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<Copy size={16} />}
                      onClick={handleCopy}
                      aria-label="Copy statistics results to clipboard"
                    >
                      Copy Results
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download size={16} />}
                      onClick={handleExportCSV}
                      aria-label="Export statistics as CSV file"
                    >
                      Export CSV
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* AdSense Ad */}
        <AdSense adSlot="3047962369" />

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
          itemScope
          itemType="https://schema.org/WebApplication"
        >
          <meta itemProp="name" content="Statistics Calculator" />
          <meta
            itemProp="description"
            content="Free online statistics calculator for data analysis"
          />
          <meta itemProp="applicationCategory" content="Educational" />
          <meta itemProp="operatingSystem" content="Web" />

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            fontWeight={600}
            itemProp="headline"
          >
            About Our Statistics Calculator
          </Typography>
          <Typography paragraph itemProp="description">
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
            <li itemProp="featureList">
              Calculate basic statistics: mean, median, mode, range
            </li>
            <li itemProp="featureList">
              Compute advanced measures: standard deviation, variance
            </li>
            <li itemProp="featureList">
              Determine quartiles and interquartile range (IQR)
            </li>
            <li itemProp="featureList">
              Find minimum and maximum values in your data set
            </li>
            <li itemProp="featureList">
              Export results in CSV format for further analysis
            </li>
            <li itemProp="featureList">
              Copy results to clipboard with a single click
            </li>
            <li itemProp="featureList">
              Clear interface with separate tabs for basic and advanced
              statistics
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
            Using our statistics calculator is straightforward. Simply enter
            your data set in the input field, with numbers separated by commas
            or spaces. Click the "Calculate Statistics" button, and the tool
            will instantly compute all relevant statistical measures. You can
            view the results in two convenient tabs: Basic Stats for common
            measures and Advanced Stats for more detailed analysis. Use the
            "Copy Results" button to copy all statistics to your clipboard or
            "Export CSV" to download the results in a spreadsheet-compatible
            format.
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
            <strong>Mode:</strong> The most frequently occurring value(s) in
            your data set.
            <br />
            <strong>Range:</strong> The difference between the maximum and
            minimum values, indicating the spread of your data.
            <br />
            <strong>Standard Deviation:</strong> A measure of how dispersed the
            data is in relation to the mean.
            <br />
            <strong>Variance:</strong> The average of the squared differences
            from the mean, indicating how far values are from the average.
            <br />
            <strong>Quartiles:</strong> Values that divide your data into
            quarters, with Q1 (25th percentile), Q2 (median), and Q3 (75th
            percentile).
            <br />
            <strong>IQR (Interquartile Range):</strong> The difference between
            Q3 and Q1, representing the middle 50% of your data and useful for
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
            Statistical analysis is essential in numerous fields and
            applications:
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>
              <strong>Academic Research:</strong> Analyzing experimental results
              and survey data
            </li>
            <li>
              <strong>Business Intelligence:</strong> Making data-driven
              decisions based on performance metrics
            </li>
            <li>
              <strong>Financial Analysis:</strong> Evaluating investment
              performance and risk assessment
            </li>
            <li>
              <strong>Quality Control:</strong> Monitoring manufacturing
              processes and product consistency
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
            traditional methods or specialized software. It's accessible from
            any device with an internet connection, requires no installation or
            downloads, and provides instant results with a user-friendly
            interface. The tool handles all the complex calculations for you,
            eliminating the risk of manual calculation errors. Whether you're
            working with small or large data sets, our calculator delivers
            accurate statistical measures to help you understand and interpret
            your data effectively.
          </Typography>
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
  );
};

export default StatisticsCalculator;
