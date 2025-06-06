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
} from "@mui/material";
import { motion } from "framer-motion";
import { Scale, Activity, Info, AlertCircle } from "lucide-react";
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
          >
            <Typography
              variant="caption"
              sx={{
                color: "white",
                fontWeight: isCurrentCategory ? "bold" : "normal",
                fontSize: isCurrentCategory ? 12 : 10,
              }}
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>BMI Calculator - Free Body Mass Index Calculator Tool</title>
        <meta
          name="description"
          content="Calculate your Body Mass Index (BMI) with our free online BMI calculator. Check your weight category, health risk, and get personalized insights."
        />
        <meta
          property="keywords"
          content="bmi calculator, body mass index, weight calculator, health calculator, bmi chart, bmi categories, weight categories, obesity calculator, weight health tool, bmi health risk, ideal weight calculator, metric bmi calculator, imperial bmi calculator, online bmi tool, free bmi calculator, bmi formula, calculate bmi, weight status, underweight calculator, overweight calculator, healthy weight range, bmi measurement tool, weight assessment, body weight calculator, height weight ratio, bmi tracking, weight management tool, fitness calculator, health assessment tool, nutrition calculator, weight classification, medical bmi calculator, weight health index, body composition calculator, weight status tool, BMI calculator online free, Body Mass Index calculator tool, Free BMI calculator for adults, Online BMI calculator with interpretation, Calculate BMI for men women, BMI calculator with categories, Healthy weight calculator, BMI calculator by age and gender, Medical BMI calculator tool, BMI calculator for body fat estimation, Online BMI chart generator, BMI calculator with result analysis, Best online BMI calculator, BMI calculator for weight loss tracking, BMI calculator for fitness enthusiasts, BMI calculator with height weight input, BMI calculator metric imperial units, BMI calculator for overweight assessment, BMI calculator for obesity check, BMI calculator for healthcare professionals, BMI calculator with printable results, BMI calculator app online, BMI calculator for body composition, BMI calculator for children adults seniors, BMI calculator with health advice, BMI calculator with nutritional guidance, BMI calculator for health checkup, BMI calculator for personal trainers, BMI calculator for doctors nurses, BMI calculator with downloadable report"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          BMI Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Calculate your Body Mass Index (BMI) and check your weight category.
        </Typography>

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
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="unit-select-label">Unit System</InputLabel>
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
                    >
                      <MenuItem value="metric">Metric (kg/cm)</MenuItem>
                      <MenuItem value="imperial">Imperial (lbs/in)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={!!heightError}>
                    <TextField
                      fullWidth
                      label={
                        unit === "metric" ? "Height (cm)" : "Height (inches)"
                      }
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      error={!!heightError}
                      helperText={heightError}
                      InputProps={{
                        inputProps: {
                          min: unit === "metric" ? 50 : 20,
                          max: unit === "metric" ? 300 : 120,
                          step: unit === "metric" ? 1 : 0.1,
                        },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth error={!!weightError}>
                    <TextField
                      fullWidth
                      label={unit === "metric" ? "Weight (kg)" : "Weight (lbs)"}
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      error={!!weightError}
                      helperText={weightError}
                      InputProps={{
                        inputProps: {
                          min: unit === "metric" ? 10 : 22,
                          max: unit === "metric" ? 500 : 1100,
                          step: 0.1,
                        },
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={calculateBmi}
                      disabled={!height || !weight}
                      startIcon={<Scale />}
                    >
                      Calculate BMI
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      disabled={!height || !weight}
                      startIcon={<Refresh />}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", alignItems: "center", marginTop: 3 }}>
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
                or health. The relation between BMI and body fat varies by sex,
                age, and fitness level.
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
            >
              {result ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box sx={{ textAlign: "center" }}>
                    <Activity size={48} color={result.color} />
                    <Typography
                      variant="h2"
                      sx={{ color: result.color, my: 2 }}
                    >
                      {result.bmi.toFixed(1)}
                    </Typography>
                    <Typography variant="h5" sx={{ color: result.color }}>
                      {result.category}
                    </Typography>

                    <Alert
                      severity={
                        result.bmi < 18.5 || result.bmi >= 25
                          ? "warning"
                          : "success"
                      }
                      icon={<AlertCircle />}
                      sx={{ mt: 2, mb: 2 }}
                    >
                      {result.healthRisk}
                    </Alert>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Ideal weight range for your height:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {result.idealWeightRange}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* BMI Chart */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      BMI Categories:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        mt: 1,
                        mb: 2,
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      {getBmiChartData()}
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                  <Scale size={48} />
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    Enter your height and weight to calculate BMI
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    BMI is a measurement of a person's weight with respect to
                    their height. It's a good way to gauge whether your weight
                    is in healthy proportion to your height.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <AdSense adSlot="6613251015" />

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
          >
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Understanding Body Mass Index (BMI)
            </Typography>

            <Typography variant="body1" paragraph>
              Body Mass Index (BMI) is a numerical value derived from a person's
              weight and height. It provides a simple way to classify weight
              status into categories that may indicate health risks. BMI is
              widely used as a screening tool to identify potential weight
              problems in adults.
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
                  <Typography variant="caption">Severe health risk</Typography>
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
              While BMI is a useful screening tool, it has several limitations:
            </Typography>

            <ul>
              <li>
                <Typography variant="body1" paragraph>
                  <strong>Muscle mass:</strong> BMI doesn't distinguish between
                  muscle and fat. Athletes and people with high muscle mass may
                  have a high BMI despite having healthy body fat levels.
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
                  <strong>Pregnancy:</strong> BMI is not applicable for pregnant
                  women.
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

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                This calculator provides estimates and should not replace
                professional medical advice. Consult a healthcare provider for a
                comprehensive health assessment.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default BmiCalculator;
