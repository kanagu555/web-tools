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
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Divider,
  RadioGroup,
  Radio,
  FormControlLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Flame,
  Calculator,
  Target,
  TrendingUp,
  Activity,
  Heart,
  Info,
  CheckCircle,
} from "lucide-react";
import { Refresh } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

interface CalorieResult {
  bmr: number;
  maintenance: number;
  weightLoss: {
    mild: number;
    moderate: number;
    extreme: number;
  };
  weightGain: {
    mild: number;
    moderate: number;
    extreme: number;
  };
}

interface CalorieHistoryEntry {
  date: string;
  gender: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  bmr: number;
  maintenance: number;
}

const CalorieCalculator = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<CalorieResult | null>(null);
  const [ageError, setAgeError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [calorieHistory, setCalorieHistory] = useState<CalorieHistoryEntry[]>(
    []
  );

  // Load calorie history from localStorage on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const savedHistory = localStorage.getItem("calorieHistory");
    if (savedHistory) {
      try {
        setCalorieHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing calorie history:", error);
      }
    }
  }, []);

  const validateInputs = (): boolean => {
    let isValid = true;

    // Validate age
    if (!age) {
      setAgeError("Age is required");
      isValid = false;
    } else {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum) || ageNum <= 0) {
        setAgeError("Please enter a valid age");
        isValid = false;
      } else if (ageNum < 15 || ageNum > 100) {
        setAgeError("Age should be between 15 and 100 years");
        isValid = false;
      } else {
        setAgeError("");
      }
    }

    // Validate weight
    if (!weight) {
      setWeightError("Weight is required");
      isValid = false;
    } else {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum) || weightNum <= 0) {
        setWeightError("Please enter a valid weight");
        isValid = false;
      } else if (unit === "metric" && (weightNum < 30 || weightNum > 300)) {
        setWeightError("Weight should be between 30kg and 300kg");
        isValid = false;
      } else if (unit === "imperial" && (weightNum < 66 || weightNum > 660)) {
        setWeightError("Weight should be between 66lbs and 660lbs");
        isValid = false;
      } else {
        setWeightError("");
      }
    }

    // Validate height
    if (!height) {
      setHeightError("Height is required");
      isValid = false;
    } else {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum) || heightNum <= 0) {
        setHeightError("Please enter a valid height");
        isValid = false;
      } else if (unit === "metric" && (heightNum < 120 || heightNum > 250)) {
        setHeightError("Height should be between 120cm and 250cm");
        isValid = false;
      } else if (unit === "imperial" && (heightNum < 48 || heightNum > 96)) {
        setHeightError("Height should be between 48in and 96in");
        isValid = false;
      } else {
        setHeightError("");
      }
    }

    return isValid;
  };

  const calculateCalories = () => {
    console.log("ageError:", ageError);

    if (!validateInputs()) return;

    // Convert to metric if using imperial
    let weightKg = parseFloat(weight);
    let heightCm = parseFloat(height);

    if (unit === "imperial") {
      weightKg = weightKg * 0.453592; // lbs to kg
      heightCm = heightCm * 2.54; // inches to cm
    }

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * parseInt(age, 10) + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * parseInt(age, 10) - 161;
    }

    // Calculate maintenance calories based on activity level
    let maintenanceCalories = 0;
    switch (activityLevel) {
      case "sedentary":
        maintenanceCalories = bmr * 1.2;
        break;
      case "light":
        maintenanceCalories = bmr * 1.375;
        break;
      case "moderate":
        maintenanceCalories = bmr * 1.55;
        break;
      case "active":
        maintenanceCalories = bmr * 1.725;
        break;
      case "veryActive":
        maintenanceCalories = bmr * 1.9;
        break;
      default:
        maintenanceCalories = bmr * 1.2;
    }

    // Calculate weight loss and gain calories
    const calorieResult: CalorieResult = {
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenanceCalories),
      weightLoss: {
        mild: Math.round(maintenanceCalories - 250),
        moderate: Math.round(maintenanceCalories - 500),
        extreme: Math.round(maintenanceCalories - 1000),
      },
      weightGain: {
        mild: Math.round(maintenanceCalories + 250),
        moderate: Math.round(maintenanceCalories + 500),
        extreme: Math.round(maintenanceCalories + 1000),
      },
    };

    setResult(calorieResult);

    // Save to history
    const newEntry: CalorieHistoryEntry = {
      date: new Date().toLocaleString(),
      gender,
      age: parseInt(age, 10),
      weight: parseFloat(weight),
      height: parseFloat(height),
      activityLevel,
      bmr: calorieResult.bmr,
      maintenance: calorieResult.maintenance,
    };

    const updatedHistory = [newEntry, ...calorieHistory].slice(0, 10); // Keep only the last 10 entries
    setCalorieHistory(updatedHistory);
    localStorage.setItem("calorieHistory", JSON.stringify(updatedHistory));

    // Show success message
    setSnackbarMessage("Calorie needs calculated successfully!");
    setSnackbarOpen(true);
  };

  const handleReset = () => {
    setGender("male");
    setAge("");
    setWeight("");
    setHeight("");
    setActivityLevel("sedentary");
    setResult(null);
    setAgeError("");
    setWeightError("");
    setHeightError("");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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

      <Container maxWidth="lg" sx={{ py: 4 }} id="main-content">
        <Helmet>
          <title>
            Calorie Calculator - Free Daily Calorie Needs Calculator | KodeKit
          </title>
          <meta
            name="description"
            content="Calculate your daily calorie needs instantly with our free calorie calculator. Get accurate BMR, TDEE, and personalized calorie recommendations for weight loss, maintenance, or weight gain based on your age, gender, weight, height, and activity level."
          />
          <meta
            name="keywords"
            content="calorie calculator, daily calorie needs, BMR calculator, TDEE calculator, weight loss calories, weight gain calories, maintenance calories, diet calculator, basal metabolic rate, total daily energy expenditure, calorie counter, nutrition calculator, fitness calculator, health calculator, weight management tool"
          />
          <meta name="author" content="KodeKit" />
          <meta name="robots" content="index, follow" />
          <meta
            property="og:title"
            content="Calorie Calculator - Free Daily Calorie Needs Calculator | KodeKit"
          />
          <meta
            property="og:description"
            content="Calculate your daily calorie needs instantly with our free calorie calculator. Get accurate BMR, TDEE, and personalized calorie recommendations for weight management."
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content="https://kodekit.in/tools/calorie-calculator"
          />
          <meta
            property="og:image"
            content="https://kodekit.in/images/calorie-calculator-og.jpg"
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Calorie Calculator - Free Daily Calorie Needs Calculator"
          />
          <meta
            name="twitter:description"
            content="Calculate your daily calorie needs instantly with our free calorie calculator. Get accurate BMR and TDEE calculations."
          />
          <link
            rel="canonical"
            href="https://kodekit.in/tools/calorie-calculator"
          />

          {/* Structured Data for SEO */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Calorie Calculator",
              description:
                "Free online calorie calculator to determine daily calorie needs, BMR, and TDEE for weight management",
              url: "https://kodekit.in/tools/calorie-calculator",
              applicationCategory: "HealthApplication",
              operatingSystem: "Any",
              permissions: "browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Calculate Basal Metabolic Rate (BMR)",
                "Calculate Total Daily Energy Expenditure (TDEE)",
                "Weight loss calorie recommendations",
                "Weight gain calorie recommendations",
                "Maintenance calorie calculations",
                "Support for metric and imperial units",
                "Activity level adjustments",
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
                  name: "What is BMR and how is it calculated?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "BMR (Basal Metabolic Rate) is the number of calories your body needs to maintain basic physiological functions at rest. It's calculated using the Mifflin-St Jeor equation: For men: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5. For women: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is TDEE and why is it important?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor. It represents the total calories you burn in a day including exercise and daily activities. TDEE is crucial for weight management as it determines your maintenance calories.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How many calories should I eat to lose weight?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "For safe weight loss, create a calorie deficit of 250-500 calories below your TDEE. A 500-calorie deficit typically results in 1 pound (0.45kg) of weight loss per week. Extreme deficits below 1200 calories for women or 1500 for men should be medically supervised.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How accurate is this calorie calculator?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "This calculator uses the scientifically validated Mifflin-St Jeor equation, which is considered one of the most accurate BMR formulas. However, individual variations exist due to genetics, medical conditions, and body composition, so results are estimates that may need adjustment based on real-world results.",
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
              Calorie Calculator - Daily Calorie Needs Calculator
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
              Calculate your daily calorie needs instantly based on your age,
              gender, weight, height, and activity level. Get accurate BMR,
              TDEE, and personalized recommendations for weight loss,
              maintenance, or weight gain.
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
                aria-labelledby="calorie-calculator-form"
              >
                <Typography
                  id="calorie-calculator-form"
                  variant="h3"
                  component="h3"
                  gutterBottom
                  sx={{ fontSize: "1.5rem", fontWeight: 600 }}
                >
                  Enter Your Personal Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid
                  container
                  spacing={2}
                  component="form"
                  role="form"
                  aria-label="Calorie calculation form"
                >
                  <Grid item xs={12}>
                    <FormControl fullWidth component="fieldset">
                      <Typography
                        component="legend"
                        variant="subtitle1"
                        sx={{ mb: 1, fontWeight: 600 }}
                      >
                        Gender
                      </Typography>
                      <RadioGroup
                        row
                        value={gender}
                        onChange={(e) =>
                          setGender(e.target.value as "male" | "female")
                        }
                        aria-label="Select your gender"
                        name="gender-selection"
                      >
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                      </RadioGroup>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Gender affects BMR calculation due to differences in
                        muscle mass and metabolism
                      </Typography>
                    </FormControl>
                  </Grid>

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
                        value={unit}
                        label="Unit System"
                        onChange={(e) => {
                          setUnit(e.target.value as "metric" | "imperial");
                          setWeight("");
                          setHeight("");
                        }}
                        aria-describedby="unit-help-text"
                        inputProps={{
                          "aria-label": "Select measurement unit system",
                        }}
                      >
                        <MenuItem value="metric">Metric (kg, cm)</MenuItem>
                        <MenuItem value="imperial">Imperial (lbs, in)</MenuItem>
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
                    <TextField
                      fullWidth
                      id="age-input"
                      label="Age"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      error={!!ageError}
                      helperText={
                        ageError || "Enter your age in years (15-100)"
                      }
                      required
                      aria-describedby="age-helper-text"
                      inputProps={{
                        min: 15,
                        max: 100,
                        "aria-label": "Age in years",
                        "aria-required": "true",
                      }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" aria-hidden="true">
                            years
                          </Typography>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="weight-input"
                      label="Weight"
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
                        min: unit === "metric" ? 30 : 66,
                        max: unit === "metric" ? 300 : 660,
                        step: 0.1,
                        "aria-label": `Weight in ${
                          unit === "metric" ? "kilograms" : "pounds"
                        }`,
                        "aria-required": "true",
                      }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" aria-hidden="true">
                            {unit === "metric" ? "kg" : "lbs"}
                          </Typography>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="height-input"
                      label="Height"
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
                        min: unit === "metric" ? 120 : 48,
                        max: unit === "metric" ? 250 : 96,
                        step: unit === "metric" ? 1 : 0.1,
                        "aria-label": `Height in ${
                          unit === "metric" ? "centimeters" : "inches"
                        }`,
                        "aria-required": "true",
                      }}
                      InputProps={{
                        endAdornment: (
                          <Typography variant="body2" aria-hidden="true">
                            {unit === "metric" ? "cm" : "in"}
                          </Typography>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel
                        id="activity-level-label"
                        sx={{
                          "&.Mui-focused": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        Activity Level
                      </InputLabel>
                      <Select
                        labelId="activity-level-label"
                        value={activityLevel}
                        label="Activity Level"
                        onChange={(e) => setActivityLevel(e.target.value)}
                        aria-describedby="activity-help-text"
                        inputProps={{
                          "aria-label": "Select your activity level",
                        }}
                      >
                        <MenuItem value="sedentary">
                          Sedentary (little or no exercise)
                        </MenuItem>
                        <MenuItem value="light">
                          Light (exercise 1-3 times/week)
                        </MenuItem>
                        <MenuItem value="moderate">
                          Moderate (exercise 3-5 times/week)
                        </MenuItem>
                        <MenuItem value="active">
                          Active (exercise 6-7 times/week)
                        </MenuItem>
                        <MenuItem value="veryActive">
                          Very Active (hard exercise & physical job)
                        </MenuItem>
                      </Select>
                      <Typography
                        id="activity-help-text"
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        Select the activity level that best describes your
                        typical weekly exercise routine
                      </Typography>
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
                        onClick={calculateCalories}
                        startIcon={<Flame />}
                        size="large"
                        aria-describedby="calculate-button-help"
                        sx={{
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                        }}
                      >
                        Calculate Calorie Needs
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        startIcon={<Refresh />}
                        size="large"
                        aria-label="Reset all form fields"
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
                      Click to calculate your daily calorie needs including BMR,
                      TDEE, and weight management recommendations
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{ p: 3, borderRadius: 3, height: "100%" }}
                component="section"
                aria-labelledby="calorie-results"
                role="region"
              >
                {result ? (
                  <Box role="region" aria-live="polite">
                    <Typography
                      id="calorie-results"
                      variant="h3"
                      component="h3"
                      gutterBottom
                      sx={{ fontSize: "1.5rem", fontWeight: 600 }}
                    >
                      Your Daily Calorie Needs
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h4"
                        component="h4"
                        gutterBottom
                        sx={{ fontSize: "1.25rem", fontWeight: 600 }}
                      >
                        Basal Metabolic Rate (BMR)
                      </Typography>
                      <Typography
                        variant="h3"
                        component="div"
                        color="primary"
                        gutterBottom
                        sx={{
                          fontSize: { xs: "2rem", sm: "2.5rem" },
                          fontWeight: 700,
                        }}
                        aria-label={`Your BMR is ${result.bmr} calories per day`}
                      >
                        {result.bmr} calories/day
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This is the number of calories your body needs to
                        maintain basic physiological functions while at rest,
                        including breathing, circulation, and cell production.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h4"
                        component="h4"
                        gutterBottom
                        sx={{ fontSize: "1.25rem", fontWeight: 600 }}
                      >
                        Maintenance Calories (TDEE)
                      </Typography>
                      <Typography
                        variant="h3"
                        component="div"
                        color="secondary"
                        gutterBottom
                        sx={{
                          fontSize: { xs: "2rem", sm: "2.5rem" },
                          fontWeight: 700,
                        }}
                        aria-label={`Your maintenance calories are ${result.maintenance} calories per day`}
                      >
                        {result.maintenance} calories/day
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This is your Total Daily Energy Expenditure (TDEE) - the
                        total calories needed to maintain your current weight
                        including daily activities and exercise.
                      </Typography>
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={12}>
                        <Typography
                          variant="h4"
                          component="h4"
                          gutterBottom
                          sx={{ fontSize: "1.25rem", fontWeight: 600 }}
                        >
                          Weight Loss Calorie Goals
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: theme.palette.success.light + "20",
                          }}
                        >
                          <Typography variant="body2" gutterBottom>
                            Mild Loss
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {result.weightLoss.mild}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            -0.25kg/week
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: theme.palette.success.main + "20",
                          }}
                        >
                          <Typography variant="body2" gutterBottom>
                            Moderate Loss
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {result.weightLoss.moderate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            -0.5kg/week
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: theme.palette.warning.light + "20",
                          }}
                        >
                          <Typography variant="body2" gutterBottom>
                            Extreme Loss
                          </Typography>
                          <Typography variant="h6" color="warning.main">
                            {result.weightLoss.extreme}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            -1kg/week
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="h4"
                          component="h4"
                          gutterBottom
                          sx={{ fontSize: "1.25rem", fontWeight: 600 }}
                        >
                          Weight Gain Calorie Goals
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: theme.palette.info.light + "20",
                          }}
                        >
                          <Typography variant="body2" gutterBottom>
                            Mild Gain
                          </Typography>
                          <Typography variant="h6" color="info.main">
                            {result.weightGain.mild}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            +0.25kg/week
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: theme.palette.info.main + "20",
                          }}
                        >
                          <Typography variant="body2" gutterBottom>
                            Moderate Gain
                          </Typography>
                          <Typography variant="h6" color="info.main">
                            {result.weightGain.moderate}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            +0.5kg/week
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: theme.palette.primary.light + "20",
                          }}
                        >
                          <Typography variant="body2" gutterBottom>
                            Fast Gain
                          </Typography>
                          <Typography variant="h6" color="primary.main">
                            {result.weightGain.extreme}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            +1kg/week
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      p: 3,
                    }}
                    role="region"
                    aria-live="polite"
                  >
                    <Typography
                      id="calorie-results"
                      variant="h3"
                      component="h3"
                      gutterBottom
                      sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 3 }}
                    >
                      Calorie Calculator Ready
                    </Typography>

                    <Flame
                      size={60}
                      color={theme.palette.text.secondary}
                      aria-hidden="true"
                    />
                    <Typography
                      variant="h4"
                      component="h4"
                      color="text.secondary"
                      align="center"
                      sx={{
                        mt: 2,
                        fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        fontWeight: 600,
                      }}
                    >
                      Enter your details and click Calculate to see your daily
                      calorie needs
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      align="center"
                      sx={{
                        mt: 2,
                        maxWidth: "400px",
                        lineHeight: 1.6,
                      }}
                    >
                      Get personalized calorie recommendations for weight loss,
                      maintenance, or weight gain based on your BMR and activity
                      level.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <AdSense adSlot="6613251015" />
            </Grid>

            {/* Key Features Section */}
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
                  Key Features of Our Calorie Calculator
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
                        <Calculator
                          size={40}
                          color={theme.palette.primary.main}
                        />
                        <Typography
                          variant="h6"
                          component="h4"
                          sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                        >
                          Accurate BMR Calculation
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Uses the scientifically validated Mifflin-St Jeor
                          equation for precise Basal Metabolic Rate
                          calculations.
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
                        <Activity
                          size={40}
                          color={theme.palette.success.main}
                        />
                        <Typography
                          variant="h6"
                          component="h4"
                          sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                        >
                          Activity Level Adjustment
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Calculates TDEE by adjusting BMR based on your
                          specific activity level and exercise frequency.
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
                        <Target size={40} color={theme.palette.warning.main} />
                        <Typography
                          variant="h6"
                          component="h4"
                          sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                        >
                          Weight Management Goals
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Provides specific calorie targets for weight loss,
                          maintenance, and weight gain at different rates.
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
                          Dual Unit Support
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Calculate calories using both metric (kg/cm) and
                          imperial (lbs/in) measurement systems.
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
                          Health-Focused Results
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Provides safe and sustainable calorie recommendations
                          with health considerations and warnings.
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
                        <CheckCircle
                          size={40}
                          color={theme.palette.secondary.main}
                        />
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

            <Grid item xs={12}>
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
                  <Typography
                    variant="h5"
                    gutterBottom
                    fontWeight={600}
                    sx={{ mt: 3 }}
                  >
                    Understanding Calorie Needs
                  </Typography>

                  <Typography variant="body1" paragraph>
                    Calories are a measure of energy that your body needs to
                    function. Your daily calorie needs depend on several factors
                    including your age, gender, weight, height, and activity
                    level.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body1" paragraph>
                    <strong>Basal Metabolic Rate (BMR)</strong> is the number of
                    calories your body needs to maintain basic physiological
                    functions while at rest. This includes breathing,
                    circulating blood, cell production, and maintaining body
                    temperature.
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Total Daily Energy Expenditure (TDEE)</strong> is
                    your BMR plus the calories you burn through physical
                    activity and digestion. This calculator uses the Mifflin-St
                    Jeor equation to estimate BMR, which is considered one of
                    the most accurate formulas.
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>For weight loss:</strong> Consume fewer calories
                    than your TDEE. A deficit of 500 calories per day is often
                    recommended for sustainable weight loss of about 0.5kg (1lb)
                    per week.
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>For weight maintenance:</strong> Consume calories
                    equal to your TDEE.
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>For weight gain:</strong> Consume more calories than
                    your TDEE. A surplus of 500 calories per day can lead to
                    weight gain of about 0.5kg (1lb) per week.
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="h5"
                    gutterBottom
                    fontWeight={600}
                    sx={{ mt: 3 }}
                  >
                    Important Considerations
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Calorie Quality Matters:</strong> Not all calories
                    are created equal. Focus on nutrient-dense foods that
                    provide essential vitamins, minerals, and macronutrients.
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Individual Variations:</strong> This calculator
                    provides an estimate. Your actual calorie needs may vary
                    based on genetics, medical conditions, and other factors not
                    accounted for in standard formulas.
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Extreme Deficits:</strong> Very low-calorie diets
                    (below 1200 calories for women or 1500 for men) should only
                    be followed under medical supervision as they can lead to
                    nutrient deficiencies and metabolic issues.
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Macronutrient Balance:</strong> Beyond total
                    calories, consider the balance of proteins, carbohydrates,
                    and fats in your diet. Generally, a balanced diet includes:
                    <ul>
                      <li>Proteins: 10-35% of daily calories</li>
                      <li>Carbohydrates: 45-65% of daily calories</li>
                      <li>Fats: 20-35% of daily calories</li>
                    </ul>
                  </Typography>

                  <Typography variant="body1" paragraph>
                    <strong>Hydration:</strong> Water intake is crucial for
                    metabolism and overall health. Aim for at least 8 glasses (2
                    liters) of water daily.
                  </Typography>

                  <Alert severity="info" sx={{ mt: 2 }} role="note">
                    <Typography variant="body2">
                      <strong>Medical Disclaimer:</strong> This calculator
                      provides estimates only and should not replace
                      professional medical advice. Consult with a healthcare
                      provider or registered dietitian before making significant
                      changes to your diet or exercise routine, especially if
                      you have any health conditions.
                    </Typography>
                  </Alert>
                </Paper>
              </Grid>
            </Grid>

            {/* FAQ Section */}
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
                        What is BMR and how is it calculated?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        BMR (Basal Metabolic Rate) is the number of calories
                        your body needs to maintain basic physiological
                        functions at rest. This calculator uses the Mifflin-St
                        Jeor equation: For men: BMR = 10 × weight(kg) + 6.25 ×
                        height(cm) - 5 × age + 5. For women: BMR = 10 ×
                        weight(kg) + 6.25 × height(cm) - 5 × age - 161.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        component="h4"
                        fontWeight={600}
                        gutterBottom
                      >
                        What is TDEE and why is it important?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        TDEE (Total Daily Energy Expenditure) is your BMR
                        multiplied by an activity factor. It represents the
                        total calories you burn in a day including exercise and
                        daily activities. TDEE is crucial for weight management
                        as it determines your maintenance calories.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        component="h4"
                        fontWeight={600}
                        gutterBottom
                      >
                        How many calories should I eat to lose weight?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        For safe weight loss, create a calorie deficit of
                        250-500 calories below your TDEE. A 500-calorie deficit
                        typically results in 1 pound (0.45kg) of weight loss per
                        week. Extreme deficits below 1200 calories for women or
                        1500 for men should be medically supervised.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        component="h4"
                        fontWeight={600}
                        gutterBottom
                      >
                        How accurate is this calorie calculator?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        This calculator uses the scientifically validated
                        Mifflin-St Jeor equation, which is considered one of the
                        most accurate BMR formulas. However, individual
                        variations exist due to genetics, medical conditions,
                        and body composition, so results are estimates that may
                        need adjustment.
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
                        What activity level should I choose?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Choose based on your weekly exercise routine: Sedentary
                        (desk job, no exercise), Light (1-3 days/week), Moderate
                        (3-5 days/week), Active (6-7 days/week), Very Active
                        (intense daily exercise + physical job). Be honest about
                        your actual activity level for accurate results.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        component="h4"
                        fontWeight={600}
                        gutterBottom
                      >
                        Can I use this calculator if I'm pregnant or
                        breastfeeding?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        This calculator is designed for general adult
                        populations and doesn't account for the additional
                        calorie needs during pregnancy or breastfeeding.
                        Pregnant and breastfeeding women should consult
                        healthcare providers for personalized calorie
                        recommendations.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        component="h4"
                        fontWeight={600}
                        gutterBottom
                      >
                        Why do men and women have different BMR calculations?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Men typically have higher BMRs due to greater muscle
                        mass and different body composition. The Mifflin-St Jeor
                        equation accounts for these physiological differences by
                        using different constants (+5 for men, -161 for women)
                        in the calculation.
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        component="h4"
                        fontWeight={600}
                        gutterBottom
                      >
                        How often should I recalculate my calorie needs?
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Recalculate when your weight changes significantly (5+
                        pounds), when you change your activity level, or every
                        few months during weight loss/gain phases. Your calorie
                        needs change as your body weight and composition change.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* How to Use Section */}
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
                  How to Use the Calorie Calculator
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
                        <Typography
                          variant="h6"
                          component="h4"
                          fontWeight={600}
                        >
                          Select Your Gender
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Choose male or female as this affects BMR calculation
                          due to differences in muscle mass and metabolism.
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
                        <Typography
                          variant="h6"
                          component="h4"
                          fontWeight={600}
                        >
                          Choose Unit System
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Select between metric (kg/cm) or imperial (lbs/in)
                          units based on your preference and familiarity.
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
                        <Typography
                          variant="h6"
                          component="h4"
                          fontWeight={600}
                        >
                          Enter Personal Details
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Input your age (15-100 years), current weight, and
                          height. Use accurate measurements for precise
                          calculations.
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
                        <Typography
                          variant="h6"
                          component="h4"
                          fontWeight={600}
                        >
                          Select Activity Level
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Choose the activity level that best describes your
                          typical weekly exercise routine and daily activity.
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
                        5
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="h6"
                          component="h4"
                          fontWeight={600}
                        >
                          Calculate and Review Results
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Click "Calculate Calorie Needs" to get your BMR, TDEE,
                          and personalized calorie recommendations for different
                          goals.
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          aria-live="polite"
          role="status"
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: "100%" }}
            role="alert"
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default CalorieCalculator;
