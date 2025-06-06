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
} from "@mui/material";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Helmet>
        <title>Calorie Calculator - Calculate Daily Calorie Needs</title>
        <meta
          name="description"
          content="Calculate your daily calorie needs based on your age, gender, weight, height, and activity level. Find out how many calories you need for weight loss, maintenance, or weight gain."
        />
        <meta
          name="keywords"
          content="calorie calculator, daily calorie needs, BMR calculator, TDEE calculator, weight loss calories, weight gain calories, maintenance calories, diet calculator, Calorie calculator online free, Daily calorie intake calculator, Free calorie counter tool, Online daily caloric needs calculator, Calculate calories for weight loss, Calorie calculator with activity level, TDEE calculator tool online, Basal metabolic rate calculator, Calorie calculator for men women, Calorie intake for weight gain loss maintenance, Best online calorie calculator, Calorie calculator with macronutrients, Calorie counter for fitness enthusiasts, Calorie calculator by age weight height, Calorie calculator for weight management, Calorie calculator with meal plan suggestion, Online BMR and T"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Calorie Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Calculate your daily calorie needs based on your personal metrics
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
              <Typography variant="h5" component="h2" gutterBottom>
                Enter Your Details
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <RadioGroup
                      row
                      value={gender}
                      onChange={(e) =>
                        setGender(e.target.value as "male" | "female")
                      }
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
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="unit-select-label">Unit System</InputLabel>
                    <Select
                      labelId="unit-select-label"
                      value={unit}
                      label="Unit System"
                      onChange={(e) => {
                        setUnit(e.target.value as "metric" | "imperial");
                        setWeight("");
                        setHeight("");
                      }}
                    >
                      <MenuItem value="metric">Metric (kg, cm)</MenuItem>
                      <MenuItem value="imperial">Imperial (lbs, in)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    error={!!ageError}
                    helperText={ageError}
                    InputProps={{
                      endAdornment: (
                        <Typography variant="body2">years</Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Weight"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    error={!!weightError}
                    helperText={weightError}
                    InputProps={{
                      endAdornment: (
                        <Typography variant="body2">
                          {unit === "metric" ? "kg" : "lbs"}
                        </Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Height"
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    error={!!heightError}
                    helperText={heightError}
                    InputProps={{
                      endAdornment: (
                        <Typography variant="body2">
                          {unit === "metric" ? "cm" : "in"}
                        </Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="activity-level-label">
                      Activity Level
                    </InputLabel>
                    <Select
                      labelId="activity-level-label"
                      value={activityLevel}
                      label="Activity Level"
                      onChange={(e) => setActivityLevel(e.target.value)}
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
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={calculateCalories}
                      startIcon={<Flame />}
                    >
                      Calculate
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      startIcon={<Refresh />}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
              {result ? (
                <Box>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Your Calorie Needs
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Basal Metabolic Rate (BMR)
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {result.bmr} calories/day
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This is the number of calories your body needs to maintain
                      basic functions at rest.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Maintenance Calories
                    </Typography>
                    <Typography variant="h4" color="secondary" gutterBottom>
                      {result.maintenance} calories/day
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      This is your Total Daily Energy Expenditure (TDEE) - the
                      calories needed to maintain your current weight.
                    </Typography>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Weight Loss Goals
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
                      <Typography variant="h6" gutterBottom>
                        Weight Gain Goals
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
                >
                  <Flame size={60} color={theme.palette.text.secondary} />
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 2 }}
                  >
                    Enter your details and click Calculate to see your daily
                    calorie needs
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <AdSense adSlot="6613251015" />

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
                  functions while at rest. This includes breathing, circulating
                  blood, cell production, and maintaining body temperature.
                </Typography>

                <Typography variant="body1" paragraph>
                  <strong>Total Daily Energy Expenditure (TDEE)</strong> is your
                  BMR plus the calories you burn through physical activity and
                  digestion. This calculator uses the Mifflin-St Jeor equation
                  to estimate BMR, which is considered one of the most accurate
                  formulas.
                </Typography>

                <Typography variant="body1" paragraph>
                  <strong>For weight loss:</strong> Consume fewer calories than
                  your TDEE. A deficit of 500 calories per day is often
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
                  <strong>Calorie Quality Matters:</strong> Not all calories are
                  created equal. Focus on nutrient-dense foods that provide
                  essential vitamins, minerals, and macronutrients.
                </Typography>

                <Typography variant="body1" paragraph>
                  <strong>Individual Variations:</strong> This calculator
                  provides an estimate. Your actual calorie needs may vary based
                  on genetics, medical conditions, and other factors not
                  accounted for in standard formulas.
                </Typography>

                <Typography variant="body1" paragraph>
                  <strong>Extreme Deficits:</strong> Very low-calorie diets
                  (below 1200 calories for women or 1500 for men) should only be
                  followed under medical supervision as they can lead to
                  nutrient deficiencies and metabolic issues.
                </Typography>

                <Typography variant="body1" paragraph>
                  <strong>Macronutrient Balance:</strong> Beyond total calories,
                  consider the balance of proteins, carbohydrates, and fats in
                  your diet. Generally, a balanced diet includes:
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

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Medical Disclaimer:</strong> This calculator
                    provides estimates only and should not replace professional
                    medical advice. Consult with a healthcare provider or
                    registered dietitian before making significant changes to
                    your diet or exercise routine, especially if you have any
                    health conditions.
                  </Typography>
                </Alert>
              </Paper>
            </Grid>
          </Grid>
          <AdSense adSlot="6613251015" />
        </Grid>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default CalorieCalculator;
