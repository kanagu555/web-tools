/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  CircularProgress,
  Alert,
  Chip,
  Tooltip as MuiTooltip,
  IconButton,
  Divider,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Building,
  Calendar,
  BarChart3,
  Download,
  Info,
  Copy,
  HelpCircle,
} from "lucide-react";
import { Helmet } from "react-helmet";
import SEOHelmet from "../components/SEOHelmet";
import {
  generateToolSEO,
  generateWebAppData,
  generateHowToData,
  generateBreadcrumbData,
} from "../Utils/seoUtils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import AdSense from "../components/AdSense";
import Breadcrumb from "../components/Breadcrumb";

interface SchemeSearchResult {
  schemeCode: number;
  schemeName: string;
}

interface FundMeta {
  fund_house: string;
  scheme_type: string;
  scheme_category: string;
  scheme_code: number;
  scheme_name: string;
  isin_growth: string;
  isin_div_reinvestment: string | null;
}

interface NavData {
  date: string;
  nav: string;
}

interface FundDetails {
  meta: FundMeta;
  data: NavData[];
  status: string;
}

interface PerformanceMetrics {
  dayChange: number;
  dayChangePercent: number;
  oneMonthReturn: number;
  threeMonthReturn: number;
  sixMonthReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
  latestNav: number;
}

const MutualFundDetails = () => {
  const theme = useTheme();
  const [selectedFundFamily, setSelectedFundFamily] = useState("");
  const [selectedScheme, setSelectedScheme] = useState("");
  const [availableSchemes, setAvailableSchemes] = useState<
    SchemeSearchResult[]
  >([]);
  const [fundDetails, setFundDetails] = useState<FundDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState<number>(30); // days
  const [fundHistory, setFundHistory] = useState<
    Array<{ schemeCode: number; schemeName: string }>
  >([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Generate SEO data
  const seoData = generateToolSEO(
    "Mutual Fund Details",
    "Search and analyze mutual funds with detailed NAV history, performance metrics, and visual charts. Track fund returns and export investment data",
    "finance"
  );

  const webAppData = generateWebAppData(
    "Mutual Fund Details",
    "Free online mutual fund analysis tool to search funds, view NAV history, track performance metrics, and analyze investment returns with interactive charts.",
    "finance"
  );

  const howToSteps = [
    {
      name: "Select Fund Family",
      text: "Choose a mutual fund family from the dropdown (e.g., HDFC, ICICI, Axis)",
    },
    {
      name: "Choose Scheme",
      text: "Select a specific mutual fund scheme from the available options",
    },
    {
      name: "View Fund Details",
      text: "Analyze fund information including NAV, returns, and performance metrics",
    },
    {
      name: "Track Performance",
      text: "View interactive charts showing NAV history and fund performance over time",
    },
  ];

  const howToData = generateHowToData("Mutual Fund Details", howToSteps);

  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Finance Tools", url: "https://kodekit.in/category/finance" },
    {
      name: "Mutual Fund Details",
      url: "https://kodekit.in/tools/mutual-fund-details",
    },
  ]);

  // Fund families/types for the first dropdown
  const fundFamilies = [
    "Aditya Birla",
    "Axis",
    "Bajaj Finserv",
    "Canara",
    "DSP",
    "Edelweiss",
    "Fidelity",
    "Franklin",
    "Groww",
    "HDFC Nifty",
    "HDFC Elss",
    "ICICI Prudential",
    "Kotak",
    "L&T",
    "LIC",
    "Motilal Owsal",
    "Mahindra",
    "Mirae Asset",
    "Navi",
    "Nippon India",
    "Parag Parikh",
    "Quantum",
    "SBI",
    "Tata",
    "WhiteOak Capital",
    "Zerodha",
  ];

  // Load fund history from localStorage on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const savedHistory = localStorage.getItem("fundHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setFundHistory(parsedHistory);
      } catch (err) {
        console.error("Error parsing fund history:", err);
      }
    }
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Finance Tools", url: "/category/finance" },
    { name: "Mutual Fund Details" },
  ];

  // Save fund history to localStorage when it changes
  useEffect(() => {
    if (fundHistory.length > 0) {
      localStorage.setItem("fundHistory", JSON.stringify(fundHistory));
    }
  }, [fundHistory]);

  const searchFundSchemes = async (fundFamily: string) => {
    if (!fundFamily) return;

    setLoading(true);
    setError("");
    setFundDetails(null);
    setAvailableSchemes([]);
    setSelectedScheme("");

    try {
      const response = await fetch(
        `https://api.mfapi.in/mf/search?q=${encodeURIComponent(fundFamily)}`
      );
      const data: SchemeSearchResult[] = await response.json();

      if (data && data.length > 0) {
        setAvailableSchemes(data);
      } else {
        setError("No schemes found for the selected fund family");
        setAvailableSchemes([]);
      }
    } catch (err) {
      setError("Error searching for fund schemes. Please try again.");
      setAvailableSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFundDetails = async (schemeCode: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
      const data: FundDetails = await response.json();

      if (data.status === "SUCCESS") {
        setFundDetails(data);

        // Add to history if not already present
        if (!fundHistory.some((fund) => fund.schemeCode === schemeCode)) {
          const newHistory = [
            { schemeCode: schemeCode, schemeName: data.meta.scheme_name },
            ...fundHistory,
          ].slice(0, 10); // Keep only the 10 most recent
          setFundHistory(newHistory);
        }
      } else {
        setError("Failed to fetch fund details");
      }
    } catch (err) {
      setError("Error fetching fund details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFundFamilyChange = (fundFamily: string) => {
    setSelectedFundFamily(fundFamily);
    searchFundSchemes(fundFamily);
  };

  const handleSchemeChange = (schemeCode: string) => {
    setSelectedScheme(schemeCode);
    fetchFundDetails(parseInt(schemeCode));
  };

  const calculateReturns = (navData: NavData[]): PerformanceMetrics | null => {
    if (navData.length < 2) return null;

    const latestNav = parseFloat(navData[0].nav);
    const previousNav = parseFloat(navData[1].nav);
    const dayChange = latestNav - previousNav;
    const dayChangePercent = (dayChange / previousNav) * 100;

    // Calculate returns for different periods
    const getReturnForPeriod = (days: number) => {
      const index = Math.min(days, navData.length - 1);
      const periodNav = parseFloat(navData[index].nav);
      return ((latestNav - periodNav) / periodNav) * 100;
    };

    // Calculate 1 month return (approximately 30 days)
    const oneMonthReturn = getReturnForPeriod(30);

    // Calculate 3 month return (approximately 90 days)
    const threeMonthReturn = getReturnForPeriod(90);

    // Calculate 6 month return (approximately 180 days)
    const sixMonthReturn = getReturnForPeriod(180);

    // Calculate 1 year return (approximately 365 days)
    const oneYearReturn = getReturnForPeriod(365);

    // Calculate 3 year return (approximately 1095 days)
    const threeYearReturn = getReturnForPeriod(1095);

    // Calculate 5 year return (approximately 1825 days)
    const fiveYearReturn = getReturnForPeriod(1825);

    return {
      dayChange,
      dayChangePercent,
      oneMonthReturn,
      threeMonthReturn,
      sixMonthReturn,
      oneYearReturn,
      threeYearReturn,
      fiveYearReturn,
      latestNav,
    };
  };

  const exportFundData = () => {
    if (!fundDetails) return;

    const csvContent = [
      ["Date", "NAV"],
      ...fundDetails.data.map((item) => [item.date, item.nav]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${fundDetails.meta.scheme_name.replace(/\s+/g, "_")}_NAV_History.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSnackbar("Fund data exported successfully", "success");
  };

  const copyFundDetails = () => {
    if (!fundDetails) return;

    const returns = calculateReturns(fundDetails.data);
    const textToCopy = `
      Fund Name: ${fundDetails.meta.scheme_name}
      Fund House: ${fundDetails.meta.fund_house}
      Category: ${fundDetails.meta.scheme_category}
      Type: ${fundDetails.meta.scheme_type}
      Latest NAV: ₹${returns?.latestNav.toFixed(4)}
      1 Month Return: ${returns?.oneMonthReturn.toFixed(2)}%
      3 Month Return: ${returns?.threeMonthReturn.toFixed(2)}%
      1 Year Return: ${returns?.oneYearReturn.toFixed(2)}%
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    showSnackbar("Fund details copied to clipboard", "success");
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const returns = fundDetails ? calculateReturns(fundDetails.data) : null;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
      />

      {/* Structured Data */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webAppData)}</script>
        <script type="application/ld+json">{JSON.stringify(howToData)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Mutual Fund Details
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Search and view detailed information about mutual funds including NAV
          history, performance metrics, and visual charts.
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
          <Typography
            variant="h6"
            gutterBottom
            fontWeight={700}
            marginBottom={3}
          >
            Search Funds
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Fund Family</InputLabel>
                <Select
                  value={selectedFundFamily}
                  onChange={(e) => handleFundFamilyChange(e.target.value)}
                  label="Select Fund Family"
                >
                  {fundFamilies.map((family) => (
                    <MenuItem key={family} value={family}>
                      {family}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {availableSchemes.length > 0 && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Select Scheme</InputLabel>
                  <Select
                    value={selectedScheme}
                    onChange={(e) => handleSchemeChange(e.target.value)}
                    label="Select Scheme"
                  >
                    {availableSchemes.map((scheme) => (
                      <MenuItem
                        key={scheme.schemeCode}
                        value={scheme.schemeCode.toString()}
                      >
                        {scheme.schemeName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>

          {availableSchemes.length > 0 && !selectedScheme && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Found {availableSchemes.length} schemes. Please select a scheme
                from the dropdown above to view details.
              </Typography>
            </Box>
          )}
        </Paper>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {fundDetails && (
          <Grid container spacing={4}>
            {/* Fund Information */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Building size={24} color={theme.palette.primary.main} />
                    <Typography variant="h5" fontWeight={600}>
                      Fund Information
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <MuiTooltip title="Copy Fund Details">
                      <IconButton onClick={copyFundDetails} size="small">
                        <Copy size={18} />
                      </IconButton>
                    </MuiTooltip>
                    <MuiTooltip title="Export NAV History">
                      <IconButton onClick={exportFundData} size="small">
                        <Download size={18} />
                      </IconButton>
                    </MuiTooltip>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h5" gutterBottom>
                      {fundDetails.meta.scheme_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Fund House
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {fundDetails.meta.fund_house}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Scheme Type
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {fundDetails.meta.scheme_type}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Category
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {fundDetails.meta.scheme_category}
                      </Typography>
                    </Box>

                    {fundDetails.meta.isin_growth && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          ISIN (Growth)
                        </Typography>
                        <Typography variant="body1" fontWeight={500}>
                          {fundDetails.meta.isin_growth}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Performance Metrics */}
            {returns && (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <TrendingUp size={24} color={theme.palette.primary.main} />
                    <Typography variant="h5" fontWeight={600}>
                      Performance
                    </Typography>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Current NAV
                        </Typography>
                        <Typography
                          variant="h4"
                          color="primary"
                          fontWeight={700}
                        >
                          ₹{returns.latestNav.toFixed(4)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {fundDetails.data[0].date}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Day Change
                        </Typography>
                        <Typography
                          variant="h5"
                          color={
                            returns.dayChange >= 0
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight={600}
                        >
                          {returns.dayChange >= 0 ? "+" : ""}₹
                          {returns.dayChange.toFixed(4)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={
                            returns.dayChangePercent >= 0
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {returns.dayChangePercent >= 0 ? "+" : ""}
                          {returns.dayChangePercent.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        sx={{
                          p: 3.3,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          1 Month Return
                        </Typography>
                        <Typography
                          variant="h5"
                          color={
                            returns.oneMonthReturn >= 0
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight={600}
                        >
                          {returns.oneMonthReturn >= 0 ? "+" : ""}
                          {returns.oneMonthReturn.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper
                        sx={{
                          p: 3.3,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          3 Month Return
                        </Typography>
                        <Typography
                          variant="h5"
                          color={
                            returns.threeMonthReturn >= 0
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight={600}
                        >
                          {returns.threeMonthReturn >= 0 ? "+" : ""}
                          {returns.threeMonthReturn.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Additional Performance Metrics */}
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          6 Month Return
                        </Typography>
                        <Typography
                          variant="h5"
                          color={
                            returns.sixMonthReturn >= 0
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight={600}
                        >
                          {returns.sixMonthReturn >= 0 ? "+" : ""}
                          {returns.sixMonthReturn.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          1 Year Return
                        </Typography>
                        <Typography
                          variant="h5"
                          color={
                            returns.oneYearReturn >= 0
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight={600}
                        >
                          {returns.oneYearReturn >= 0 ? "+" : ""}
                          {returns.oneYearReturn.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          textAlign: "center",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          3 Year Return
                        </Typography>
                        <Typography
                          variant="h5"
                          color={
                            returns.threeYearReturn >= 0
                              ? "success.main"
                              : "error.main"
                          }
                          fontWeight={600}
                        >
                          {returns.threeYearReturn >= 0 ? "+" : ""}
                          {returns.threeYearReturn.toFixed(2)}%
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* NAV History */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <BarChart3 size={24} color={theme.palette.primary.main} />
                    <Typography variant="h5" fontWeight={600}>
                      NAV History
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Time Range</InputLabel>
                      <Select
                        value={timeRange}
                        label="Time Range"
                        onChange={(e) => setTimeRange(Number(e.target.value))}
                        size="small"
                      >
                        <MenuItem value={7}>7 Days</MenuItem>
                        <MenuItem value={30}>30 Days</MenuItem>
                        <MenuItem value={90}>3 Months</MenuItem>
                        <MenuItem value={180}>6 Months</MenuItem>
                        <MenuItem value={365}>1 Year</MenuItem>
                      </Select>
                    </FormControl>

                    <Box
                      sx={{
                        display: "flex",
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                      }}
                    ></Box>
                  </Box>
                </Box>

                <Box sx={{ height: 300, mb: 4 }}>
                  {fundDetails.data.length > 0 && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={fundDetails.data
                          .slice(0, timeRange)
                          .map((item) => ({
                            date: item.date,
                            nav: parseFloat(item.nav),
                          }))
                          .reverse()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(
                              value.split("-").reverse().join("-")
                            );
                            return `${date.getDate()}/${date.getMonth() + 1}`;
                          }}
                          interval={Math.ceil(timeRange / 10)}
                        />
                        <YAxis
                          domain={["auto", "auto"]}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `₹${value.toFixed(2)}`}
                        />
                        <Legend />
                        <Tooltip
                          formatter={(value: number) => [
                            `₹${value.toFixed(4)}`,
                            "NAV",
                          ]}
                          labelFormatter={(label) => `Date: ${label}`}
                          labelStyle={{ color: theme.palette.primary.main }}
                        />
                        <Line
                          type="monotone"
                          dataKey="nav"
                          name={fundDetails.meta.scheme_name}
                          stroke={theme.palette.primary.main}
                          activeDot={{ r: 8 }}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </Box>

                <Box sx={{ maxHeight: 400, overflow: "auto" }}>
                  <Grid container spacing={1}>
                    {fundDetails.data.slice(0, timeRange).map((nav, index) => (
                      <Grid item xs={12} key={index}>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: theme.palette.background.default,
                            borderRadius: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <Calendar size={16} />
                            <Typography variant="body1">{nav.date}</Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography variant="body1" fontWeight={500}>
                              ₹{parseFloat(nav.nav).toFixed(4)}
                            </Typography>
                            {index > 0 && (
                              <Chip
                                size="small"
                                label={
                                  parseFloat(nav.nav) >=
                                  parseFloat(fundDetails.data[index - 1].nav)
                                    ? "↑"
                                    : "↓"
                                }
                                color={
                                  parseFloat(nav.nav) >=
                                  parseFloat(fundDetails.data[index - 1].nav)
                                    ? "success"
                                    : "error"
                                }
                              />
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        <AdSense adSlot="6613251015" />

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Info style={{ marginRight: "8px" }} color="info" />
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <HelpCircle size={20} color={theme.palette.primary.main} />
              <Typography variant="h6">Understanding Mutual Funds</Typography>
            </Box>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" paragraph>
            Mutual funds are investment vehicles that pool money from multiple
            investors to purchase securities like stocks, bonds, and other
            assets. They offer diversification, professional management, and
            liquidity.
          </Typography>

          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Key Terms:
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  NAV (Net Asset Value)
                </Typography>
                <Typography variant="body2">
                  The per-unit market value of a fund, calculated daily.
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Fund House
                </Typography>
                <Typography variant="body2">
                  The company that manages the mutual fund.
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Scheme Type
                </Typography>
                <Typography variant="body2">
                  Classification based on investment objective (Growth,
                  Dividend, etc.).
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Category
                </Typography>
                <Typography variant="body2">
                  Classification based on asset allocation (Equity, Debt,
                  Hybrid, etc.).
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  Returns
                </Typography>
                <Typography variant="body2">
                  The profit or loss on investment over a specific period.
                </Typography>
              </Box>

              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  ISIN
                </Typography>
                <Typography variant="body2">
                  International Securities Identification Number - a unique
                  identifier.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default MutualFundDetails;
