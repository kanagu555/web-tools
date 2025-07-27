import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  useTheme,
  Tooltip,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Divider,
  useMediaQuery,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Scale,
  Activity,
  Info,
  AlertCircle,
  CheckCircle,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Refresh } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  healthRisk: string;
  idealWeightRange: string;
}

interface BmiHistoryEntry {
  date: string;
  bmi: number;
  weight: string;
  height: string;
  unit: string;
}

const BmiCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<BmiResult | null>(null);
  const [heightError, setHeightError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bmiHistory, setBmiHistory] = useState<BmiHistoryEntry[]>([]);

  // Load BMI history from localStorage on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateInputs = (): boolean => {
    let isValid = true;

    // Validate height
    if (!height) {
      setHeightError("Height is required");
      isValid = false;
    } else {
      const h = parseFloat(height);
      if (isNaN(h) || h <= 0) {
        setHeightError("Please enter a valid height");
        isValid = false;
      } else if (unit === "metric" && (h < 50 || h > 300)) {
        setHeightError("Height should be between 50cm and 300cm");
        isValid = false;
      } else if (unit === "imperial" && (h < 20 || h > 120)) {
        setHeightError("Height should be between 20in and 120in");
        isValid = false;
      } else {
        setHeightError("");
      }
    }

    // Validate weight
    if (!weight) {
      setWeightError("Weight is required");
      isValid = false;
    } else {
      const w = parseFloat(weight);
      if (isNaN(w) || w <= 0) {
        setWeightError("Please enter a valid weight");
        isValid = false;
      } else if (unit === "metric" && (w < 10 || w > 500)) {
        setWeightError("Weight should be between 10kg and 500kg");
        isValid = false;
      } else if (unit === "imperial" && (w < 22 || w > 1100)) {
        setWeightError("Weight should be between 22lbs and 1100lbs");
        isValid = false;
      } else {
        setWeightError("");
      }
    }

    return isValid;
  };

  const calculateBmi = () => {
    if (!validateInputs()) return;

    let bmi: number;
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (unit === "metric") {
      // Weight in kg, height in cm
      bmi = w / Math.pow(h / 100, 2);
    } else {
      // Weight in lbs, height in inches
      bmi = (w * 703) / Math.pow(h, 2);
    }

    let category: string;
    let color: string;
    let healthRisk: string;
    let idealWeightRange: string;

    if (bmi < 16) {
      category = "Severe Thinness";
      color = theme.palette.error.main;
      healthRisk = "Very severe health risk";
    } else if (bmi < 17) {
      category = "Moderate Thinness";
      color = theme.palette.error.light;
      healthRisk = "Severe health risk";
    } else if (bmi < 18.5) {
      category = "Mild Thinness";
      color = theme.palette.warning.main;
      healthRisk = "Moderate health risk";
    } else if (bmi < 25) {
      category = "Normal weight";
      color = theme.palette.success.main;
      healthRisk = "Low risk";
    } else if (bmi < 30) {
      category = "Overweight";
      color = theme.palette.warning.main;
      healthRisk = "Enhanced risk";
    } else if (bmi < 35) {
      category = "Obese Class I";
      color = theme.palette.error.light;
      healthRisk = "High risk";
    } else if (bmi < 40) {
      category = "Obese Class II";
      color = theme.palette.error.main;
      healthRisk = "Very high risk";
    } else {
      category = "Obese Class III";
      color = theme.palette.error.dark;
      healthRisk = "Extremely high risk";
    }

    // Calculate ideal weight range based on BMI 18.5-24.9
    if (unit === "metric") {
      const heightInM = h / 100;
      const lowerWeight = (18.5 * Math.pow(heightInM, 2)).toFixed(1);
      const upperWeight = (24.9 * Math.pow(heightInM, 2)).toFixed(1);
      idealWeightRange = `${lowerWeight}kg - ${upperWeight}kg`;
    } else {
      const lowerWeight = ((18.5 * Math.pow(h, 2)) / 703).toFixed(1);
      const upperWeight = ((24.9 * Math.pow(h, 2)) / 703).toFixed(1);
      idealWeightRange = `${lowerWeight}lbs - ${upperWeight}lbs`;
    }

    setResult({ bmi, category, color, healthRisk, idealWeightRange });

    // Save to history
    const newEntry: BmiHistoryEntry = {
      date: new Date().toLocaleString(),
      bmi: bmi,
      weight: weight,
      height: height,
      unit: unit,
    };

    const updatedHistory = [newEntry, ...bmiHistory].slice(0, 10); // Keep only the last 10 entries
    setBmiHistory(updatedHistory);
    localStorage.setItem("bmiHistory", JSON.stringify(updatedHistory));

    // Show success message
    setSnackbarMessage("BMI calculated successfully");
    setSnackbarOpen(true);
  };

  const handleReset = () => {
    setHeight("");
    setWeight("");
    setResult(null);
    setHeightError("");
    setWeightError("");
  };

  const getBmiChartData = () => {
    const categories = [
      {
        range: "<16",
        label: "Severe Thinness",
        color: theme.palette.error.main,
      },
      {
        range: "16-16.9",
        label: "Moderate Thinness",
        color: theme.palette.error.light,
      },
      {
        range: "17-18.4",
        label: "Mild Thinness",
        color: theme.palette.warning.main,
      },
      {
        range: "18.5-24.9",
        label: "Normal",
        color: theme.palette.success.main,
      },
      {
        range: "25-29.9",
        label: "Overweight",
        color: theme.palette.warning.main,
      },
      {
        range: "30-34.9",
        label: "Obese Class I",
        color: theme.palette.error.light,
      },
      {
        range: "35-39.9",
        label: "Obese Class II",
        color: theme.palette.error.main,
      },
      {
        range: "≥40",
        label: "Obese Class III",
        color: theme.palette.error.dark,
      },
    ];

    return categories.map((category, index) => {
      const isCurrentCategory =
        result &&
        ((index === 0 && result.bmi < 16) ||
          (index === 1 && result.bmi >= 16 && result.bmi < 17) ||
          (index === 2 && result.bmi >= 17 && result.bmi < 18.5) ||
          (index === 3 && result.bmi >= 18.5 && result.bmi < 25) ||
          (index === 4 && result.bmi >= 25 && result.bmi < 30) ||
          (index === 5 && result.bmi >= 30 && result.bmi < 35) ||
          (index === 6 && result.bmi >= 35 && result.bmi < 40) ||
          (index === 7 && result.bmi >= 40));

      return (
        <Box
          key={index}
          sx={{
            height: 40,
            backgroundColor: category.color,
            opacity: isCurrentCategory ? 1 : 0.7,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            border: isCurrentCategory
              ? `2px solid ${theme.palette.common.white}`
              : "none",
            borderRadius:
              index === 0
                ? "10px 0px 0px 10px"
                : index === 7
                ? "0px 10px 10px 0px"
                : "0px",
            boxShadow: isCurrentCategory ? 3 : 0,
            transition: "all 0.3s ease",
          }}
        >
          <Tooltip
            title={`${category.label} (${category.range})`}
            arrow
            placement="top"
            enterTouchDelay={0}
            leaveTouchDelay={1500}
          >
            <Typography
              variant="caption"
              sx={{
                color: "white",
                fontWeight: isCurrentCategory ? "bold" : "normal",
                fontSize: isCurrentCategory ? 12 : 10,
                cursor: "help",
              }}
              role="button"
              tabIndex={0}
              aria-label={`BMI category: ${category.label}, range: ${
                category.range
              }${isCurrentCategory ? " - This is your current category" : ""}`}
            >
              {!isMobile ? category.label : category.range}
            </Typography>
          </Tooltip>
          {isCurrentCategory && (
            <Box
              sx={{
                position: "absolute",
                bottom: -25,
                left: "50%",
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderBottom: `10px solid ${theme.palette.background.paper}`,
                transform: "translateX(-50%) rotate(180deg)",
              }}
            />
          )}
        </Box>
      );
    });
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
      <Box
        component="a"
        href="#main-content"
        sx={{
          position: "absolute",
          left: "-9999px",
          zIndex: 999,
          padding: "8px 16px",
          background: theme.palette.primary.main,
          color: "white",
          textDecoration: "none",
          "&:focus": {
            left: "10px",
            top: "10px",
          },
        }}
      >
        Skip to main content
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }} id="main-content">
        <Helmet>
          <title>
            BMI Calculator - Free Body Mass Index Calculator Tool | KodeKit
          </title>
          <meta
            name="description"
            content="Calculate your Body Mass Index (BMI) instantly with our free online BMI calculator. Get accurate BMI results, weight categories, health risk assessment, and ideal weight ranges for both metric and imperial units."
          />
          <meta
            name="keywords"
            content="bmi calculator, body mass index, weight calculator, health calculator, bmi chart, bmi categories, weight categories, obesity calculator, weight health tool, bmi health risk, ideal weight calculator, metric bmi calculator, imperial bmi calculator, online bmi tool, free bmi calculator, bmi formula, calculate bmi, weight status, underweight calculator, overweight calculator, healthy weight range, bmi measurement tool, weight assessment, body weight calculator, height weight ratio, bmi tracking, weight management tool, fitness calculator, health assessment tool, nutrition calculator, weight classification, medical bmi calculator, weight health index, body composition calculator, weight status tool"
          />
          <meta name="author" content="KodeKit" />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="BMI Calculator - Free Body Mass Index Calculator Tool | KodeKit"
          />
          <meta
            property="og:description"
            content="Calculate your Body Mass Index (BMI) instantly with our free online BMI calculator. Get accurate BMI results, weight categories, health risk assessment, and ideal weight ranges."
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content="https://kodekit.in/tools/bmi-calculator"
          />
          <meta
            property="og:image"
            content="https://kodekit.in/images/bmi-calculator-og.jpg"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="BMI Calculator - Free Body Mass Index Calculator Tool"
          />
          <meta
            name="twitter:description"
            content="Calculate your Body Mass Index (BMI) instantly with our free online BMI calculator. Get accurate BMI results and health insights."
          />
          <link
            rel="canonical"
            href="https://kodekit.in/tools/bmi-calculator"
          />

          {/* Structured Data for SEO */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "BMI Calculator",
              description:
                "Free online Body Mass Index (BMI) calculator tool to calculate BMI and assess weight categories and health risks",
              url: "https://kodekit.in/tools/bmi-calculator",
              applicationCategory: "HealthApplication",
              operatingSystem: "Any",
              permissions: "browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Calculate BMI for metric and imperial units",
                "Weight category classification",
                "Health risk assessment",
                "Ideal weight range calculation",
                "BMI chart visualization",
                "Instant results",
              ],
            })}
          </script>

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is BMI and how is it calculated?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "BMI (Body Mass Index) is a measure of body fat based on height and weight. It's calculated as weight in kilograms divided by height in meters squared (kg/m²), or for imperial units: 703 × weight in pounds divided by height in inches squared.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What are the BMI categories?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "BMI categories are: Underweight (below 18.5), Normal weight (18.5-24.9), Overweight (25-29.9), Obese Class I (30-34.9), Obese Class II (35-39.9), and Obese Class III (40 and above).",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is BMI accurate for everyone?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "BMI is a screening tool but has limitations. It doesn't distinguish between muscle and fat, doesn't account for bone density or body fat distribution, and may not be accurate for athletes, elderly, or pregnant women.",
                  },
                },
              ],
            })}
          </script>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box component="header" sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              fontWeight={700}
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.2,
              }}
            >
              BMI Calculator - Body Mass Index Calculator
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              color="text.secondary"
              paragraph
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                fontWeight: 400,
                mt: 2,
              }}
            >
              Calculate your Body Mass Index (BMI) instantly and get
              comprehensive health insights including weight categories, health
              risk assessment, and ideal weight ranges.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
                component="section"
                aria-labelledby="bmi-calculator-form"
              >
                <Typography
                  id="bmi-calculator-form"
                  variant="h3"
                  component="h3"
                  gutterBottom
                  sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 3 }}
                >
                  BMI Calculator Form
                </Typography>

                <Grid
                  container
                  spacing={3}
                  component="form"
                  role="form"
                  aria-label="BMI calculation form"
                >
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="unit-select-label"
                        sx={{
                          "&.Mui-focused": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        Unit System
                      </InputLabel>
                      <Select
                        labelId="unit-select-label"
                        id="unit-select"
                        value={unit}
                        label="Unit System"
                        onChange={(e) => {
                          setUnit(e.target.value as "metric" | "imperial");
                          setHeight("");
                          setWeight("");
                          setResult(null);
                          setHeightError("");
                          setWeightError("");
                        }}
                        aria-describedby="unit-help-text"
                        inputProps={{
                          "aria-label":
                            "Select unit system for BMI calculation",
                        }}
                      >
                        <MenuItem value="metric">Metric (kg/cm)</MenuItem>
                        <MenuItem value="imperial">Imperial (lbs/in)</MenuItem>
                      </Select>
                      <Typography
                        id="unit-help-text"
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Choose between metric (kilograms/centimeters) or
                        imperial (pounds/inches) units
                      </Typography>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!heightError}>
                      <TextField
                        fullWidth
                        id="height-input"
                        label={
                          unit === "metric" ? "Height (cm)" : "Height (inches)"
                        }
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        error={!!heightError}
                        helperText={
                          heightError ||
                          `Enter your height in ${
                            unit === "metric" ? "centimeters" : "inches"
                          }`
                        }
                        required
                        aria-describedby="height-helper-text"
                        inputProps={{
                          min: unit === "metric" ? 50 : 20,
                          max: unit === "metric" ? 300 : 120,
                          step: unit === "metric" ? 1 : 0.1,
                          "aria-label": `Height in ${
                            unit === "metric" ? "centimeters" : "inches"
                          }`,
                          "aria-required": "true",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!weightError}>
                      <TextField
                        fullWidth
                        id="weight-input"
                        label={
                          unit === "metric" ? "Weight (kg)" : "Weight (lbs)"
                        }
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        error={!!weightError}
                        helperText={
                          weightError ||
                          `Enter your weight in ${
                            unit === "metric" ? "kilograms" : "pounds"
                          }`
                        }
                        required
                        aria-describedby="weight-helper-text"
                        inputProps={{
                          min: unit === "metric" ? 10 : 22,
                          max: unit === "metric" ? 500 : 1100,
                          step: 0.1,
                          "aria-label": `Weight in ${
                            unit === "metric" ? "kilograms" : "pounds"
                          }`,
                          "aria-required": "true",
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={calculateBmi}
                        disabled={!height || !weight}
                        startIcon={<Scale />}
                        size="large"
                        aria-describedby="calculate-button-help"
                        sx={{
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                        }}
                      >
                        Calculate BMI
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        disabled={!height || !weight}
                        startIcon={<Refresh />}
                        size="large"
                        aria-label="Reset form fields"
                        sx={{
                          py: 1.5,
                          minWidth: { xs: "auto", sm: "120px" },
                        }}
                      >
                        Reset
                      </Button>
                    </Box>
                    <Typography
                      id="calculate-button-help"
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Click to calculate your Body Mass Index based on entered
                      height and weight
                    </Typography>
                  </Grid>
                </Grid>

                <Box
                  sx={{ display: "flex", alignItems: "center", marginTop: 3 }}
                >
                  <Info size={16} style={{ marginRight: 8 }} />
                  <Typography>
                    BMI is calculated using the following formulas:
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: theme.palette.action.hover,
                    p: 2,
                    borderRadius: 1,
                    mb: 2,
                    mt: 1,
                  }}
                >
                  <Typography variant="body2" fontFamily="monospace">
                    <strong>Metric:</strong> BMI = weight(kg) / height(m)²
                  </Typography>
                  <Typography
                    variant="body2"
                    fontFamily="monospace"
                    sx={{ mt: 1 }}
                  >
                    <strong>Imperial:</strong> BMI = 703 × weight(lb) /
                    height(in)²
                  </Typography>
                </Box>
                <Typography variant="body2">
                  BMI is a screening tool, but it does not diagnose body fatness
                  or health. The relation between BMI and body fat varies by
                  sex, age, and fitness level.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: 350,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                component="section"
                aria-labelledby="bmi-results"
                role="region"
              >
                {result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{ textAlign: "center" }}
                      role="region"
                      aria-live="polite"
                    >
                      <Typography
                        id="bmi-results"
                        variant="h3"
                        component="h3"
                        gutterBottom
                        sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 3 }}
                      >
                        Your BMI Results
                      </Typography>

                      <Box sx={{ mb: 3 }}>
                        <Activity
                          size={48}
                          color={result.color}
                          aria-hidden="true"
                        />
                        <Typography
                          variant="h2"
                          component="div"
                          sx={{
                            color: result.color,
                            my: 2,
                            fontSize: { xs: "2.5rem", sm: "3rem" },
                            fontWeight: 700,
                          }}
                          aria-label={`Your BMI is ${result.bmi.toFixed(1)}`}
                        >
                          {result.bmi.toFixed(1)}
                        </Typography>
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            color: result.color,
                            fontSize: { xs: "1.25rem", sm: "1.5rem" },
                            fontWeight: 600,
                          }}
                          aria-label={`BMI category: ${result.category}`}
                        >
                          {result.category}
                        </Typography>
                      </Box>

                      <Alert
                        severity={
                          result.bmi < 18.5 || result.bmi >= 25
                            ? "warning"
                            : "success"
                        }
                        icon={<AlertCircle />}
                        sx={{ mt: 2, mb: 2 }}
                        role="alert"
                        aria-live="polite"
                      >
                        <Typography component="span" sx={{ fontWeight: 600 }}>
                          Health Risk Assessment: {result.healthRisk}
                        </Typography>
                      </Alert>

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ mb: 3 }}>
                        <Typography
                          variant="h5"
                          component="h4"
                          color="text.secondary"
                          sx={{ mb: 1, fontSize: "1.1rem", fontWeight: 600 }}
                        >
                          Ideal Weight Range for Your Height:
                        </Typography>
                        <Typography
                          variant="h4"
                          component="div"
                          fontWeight="bold"
                          sx={{
                            fontSize: "1.25rem",
                            color: theme.palette.success.main,
                          }}
                          aria-label={`Ideal weight range: ${result.idealWeightRange}`}
                        >
                          {result.idealWeightRange}
                        </Typography>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* BMI Chart */}
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h5"
                          component="h4"
                          color="text.secondary"
                          sx={{ mb: 2, fontSize: "1.1rem", fontWeight: 600 }}
                        >
                          BMI Categories Chart:
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            mt: 1,
                            mb: 2,
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                          role="img"
                          aria-label="BMI categories visualization chart"
                        >
                          {getBmiChartData()}
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                ) : (
                  <Box
                    sx={{ textAlign: "center", color: "text.secondary" }}
                    role="region"
                    aria-live="polite"
                  >
                    <Typography
                      id="bmi-results"
                      variant="h3"
                      component="h3"
                      gutterBottom
                      sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 3 }}
                    >
                      BMI Calculator Ready
                    </Typography>

                    <Scale size={48} aria-hidden="true" />
                    <Typography
                      variant="h4"
                      component="h4"
                      sx={{
                        mt: 2,
                        mb: 2,
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        fontWeight: 600,
                      }}
                    >
                      Enter your height and weight to calculate BMI
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        maxWidth: "400px",
                        mx: "auto",
                      }}
                    >
                      BMI (Body Mass Index) is a measurement of a person's
                      weight with respect to their height. It's a reliable
                      indicator to assess whether your weight is in healthy
                      proportion to your height and identify potential health
                      risks.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

        <AdSense adSlot="6613251015" />

        {/* Key Features Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="key-features"
            >
              <Typography
                id="key-features"
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.75rem", mb: 3 }}
              >
                Key Features of Our BMI Calculator
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <CheckCircle
                        size={40}
                        color={theme.palette.success.main}
                      />
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        Instant Results
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get your BMI calculated instantly with accurate results
                        and comprehensive health insights.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Scale size={40} color={theme.palette.primary.main} />
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        Dual Unit Support
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Calculate BMI using both metric (kg/cm) and imperial
                        (lbs/in) measurement systems.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Heart size={40} color={theme.palette.error.main} />
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        Health Risk Assessment
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Understand your health risks with detailed BMI category
                        explanations and recommendations.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <TrendingUp size={40} color={theme.palette.info.main} />
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        Ideal Weight Range
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Discover your ideal weight range based on your height
                        for optimal health.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Activity size={40} color={theme.palette.warning.main} />
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        Visual BMI Chart
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Interactive BMI chart showing all categories with your
                        current position highlighted.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Info size={40} color={theme.palette.secondary.main} />
                      <Typography
                        variant="h6"
                        component="h4"
                        sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                      >
                        Free & Private
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completely free to use with no registration required.
                        Your data stays private and secure.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="understanding-bmi"
            >
              <Typography
                id="understanding-bmi"
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.75rem" }}
              >
                Understanding Body Mass Index (BMI)
              </Typography>

              <Typography variant="body1" paragraph>
                Body Mass Index (BMI) is a numerical value derived from a
                person's weight and height. It provides a simple way to classify
                weight status into categories that may indicate health risks.
                BMI is widely used as a screening tool to identify potential
                weight problems in adults.
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom fontWeight={600}>
                BMI Categories and Health Risks
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.error.main,
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Severe Thinness
                    </Typography>
                    <Typography variant="body2">BMI: Less than 16</Typography>
                    <Typography variant="caption">
                      Very severe health risk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.error.light,
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Moderate Thinness
                    </Typography>
                    <Typography variant="body2">BMI: 16 - 16.9</Typography>
                    <Typography variant="caption">
                      Severe health risk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.warning.main,
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Mild Thinness
                    </Typography>
                    <Typography variant="body2">BMI: 17 - 18.4</Typography>
                    <Typography variant="caption">
                      Moderate health risk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.success.main,
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Normal Weight
                    </Typography>
                    <Typography variant="body2">BMI: 18.5 - 24.9</Typography>
                    <Typography variant="caption">Low health risk</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.warning.main,
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Overweight
                    </Typography>
                    <Typography variant="body2">BMI: 25 - 29.9</Typography>
                    <Typography variant="caption">
                      Enhanced health risk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.error.light,
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Obese Class I
                    </Typography>
                    <Typography variant="body2">BMI: 30 - 34.9</Typography>
                    <Typography variant="caption">High health risk</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.error.main,
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Obese Class II
                    </Typography>
                    <Typography variant="body2">BMI: 35 - 39.9</Typography>
                    <Typography variant="caption">
                      Very high health risk
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: theme.palette.error.dark,
                      color: "white",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={700}>
                      Obese Class III
                    </Typography>
                    <Typography variant="body2">BMI: 40 or higher</Typography>
                    <Typography variant="caption">
                      Extremely high health risk
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom fontWeight={600}>
                Limitations of BMI
              </Typography>

              <Typography variant="body1" paragraph>
                While BMI is a useful screening tool, it has several
                limitations:
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Muscle mass:</strong> BMI doesn't distinguish
                    between muscle and fat. Athletes and people with high muscle
                    mass may have a high BMI despite having healthy body fat
                    levels.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Body composition:</strong> BMI doesn't account for
                    differences in bone density, body fat distribution, or
                    proportion of fat to lean mass.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Age and sex:</strong> BMI interpretation should
                    consider age, sex, ethnicity, and muscle mass. The same BMI
                    may indicate different levels of body fat for different
                    individuals.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Pregnancy:</strong> BMI is not applicable for
                    pregnant women.
                  </Typography>
                </li>
              </ul>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom fontWeight={600}>
                Using BMI Results
              </Typography>

              <Typography variant="body1" paragraph>
                BMI is just one factor in evaluating health risks. For a
                comprehensive assessment, consider:
              </Typography>

              <ul>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Waist circumference:</strong> Excess fat around the
                    waist increases health risks more than fat elsewhere.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Lifestyle factors:</strong> Diet quality, physical
                    activity level, and smoking status.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Family history:</strong> Genetic factors that may
                    increase disease risk.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Other health metrics:</strong> Blood pressure,
                    cholesterol levels, and blood sugar levels.
                  </Typography>
                </li>
              </ul>

              <Alert severity="info" sx={{ mt: 2 }} role="note">
                <Typography variant="body2">
                  <strong>Medical Disclaimer:</strong> This calculator provides
                  estimates and should not replace professional medical advice.
                  Consult a healthcare provider for a comprehensive health
                  assessment and personalized recommendations.
                </Typography>
              </Alert>
            </Paper>
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="faq-section"
            >
              <Typography
                id="faq-section"
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.75rem", mb: 3 }}
              >
                Frequently Asked Questions (FAQ)
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      fontWeight={600}
                      gutterBottom
                    >
                      What is BMI and how is it calculated?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      BMI (Body Mass Index) is a measure of body fat based on
                      height and weight that applies to adult men and women.
                      It's calculated as weight in kilograms divided by height
                      in meters squared (kg/m²). For imperial units, the formula
                      is: 703 × weight in pounds divided by height in inches
                      squared.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      fontWeight={600}
                      gutterBottom
                    >
                      What are the different BMI categories?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      BMI categories are: Underweight (below 18.5), Normal
                      weight (18.5-24.9), Overweight (25-29.9), Obese Class I
                      (30-34.9), Obese Class II (35-39.9), and Obese Class III
                      (40 and above). Each category indicates different health
                      risk levels.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      fontWeight={600}
                      gutterBottom
                    >
                      Is BMI accurate for everyone?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      BMI is a useful screening tool but has limitations. It
                      doesn't distinguish between muscle and fat, doesn't
                      account for bone density or body fat distribution, and may
                      not be accurate for athletes, elderly individuals, or
                      pregnant women. It's best used as one factor among many in
                      health assessment.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      fontWeight={600}
                      gutterBottom
                    >
                      How often should I calculate my BMI?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      For general health monitoring, calculating BMI monthly or
                      quarterly is sufficient. If you're actively trying to lose
                      or gain weight, weekly calculations can help track
                      progress. However, focus on overall health trends rather
                      than daily fluctuations.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      fontWeight={600}
                      gutterBottom
                    >
                      What should I do if my BMI is outside the normal range?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      If your BMI is outside the normal range (18.5-24.9),
                      consider consulting a healthcare professional. They can
                      provide personalized advice based on your overall health,
                      medical history, and individual circumstances. Gradual
                      lifestyle changes in diet and exercise are typically
                      recommended.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      fontWeight={600}
                      gutterBottom
                    >
                      Can BMI be used for children and teenagers?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      BMI calculations for children and teenagers (ages 2-19)
                      use age and sex-specific percentiles rather than standard
                      adult categories. This calculator is designed for adults
                      aged 20 and older. For children, consult pediatric BMI
                      charts and healthcare providers.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      fontWeight={600}
                      gutterBottom
                    >
                      What factors can affect BMI accuracy?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Several factors can affect BMI accuracy: muscle mass
                      (athletes may have high BMI but low body fat), age (muscle
                      mass decreases with age), ethnicity (different populations
                      have varying health risks at the same BMI), and pregnancy
                      or medical conditions affecting weight distribution.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      component="h4"
                      fontWeight={600}
                      gutterBottom
                    >
                      Is this BMI calculator free to use?
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Yes, our BMI calculator is completely free to use with no
                      registration required. Your data is processed locally in
                      your browser and is not stored or transmitted to our
                      servers, ensuring complete privacy and security.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* How to Use Section */}
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="how-to-use"
            >
              <Typography
                id="how-to-use"
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.75rem", mb: 3 }}
              >
                How to Use the BMI Calculator
              </Typography>

              <List sx={{ pl: 0 }}>
                <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      1
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="h4" fontWeight={600}>
                        Select Your Unit System
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Choose between Metric (kg/cm) or Imperial (lbs/in) units
                        based on your preference and familiarity.
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      2
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="h4" fontWeight={600}>
                        Enter Your Height
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Input your height in centimeters (metric) or inches
                        (imperial). Ensure accuracy for precise BMI calculation.
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      3
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="h4" fontWeight={600}>
                        Enter Your Weight
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Input your current weight in kilograms (metric) or
                        pounds (imperial). Use your most recent accurate
                        measurement.
                      </Typography>
                    }
                  />
                </ListItem>

                <ListItem sx={{ pl: 0, alignItems: "flex-start" }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      4
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="h6" component="h4" fontWeight={600}>
                        Calculate and Review Results
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        Click "Calculate BMI" to get your results including BMI
                        value, category, health risk assessment, and ideal
                        weight range.
                      </Typography>
                    }
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          aria-live="polite"
          role="status"
        />
      </Container>
    </>
  );
};

export default BmiCalculator;
