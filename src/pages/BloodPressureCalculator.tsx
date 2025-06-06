import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  FormControl,
  Alert,
  Snackbar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { motion } from "framer-motion";
import { Heart, Activity, Info, AlertCircle } from "lucide-react";
import { Helmet } from "react-helmet";
import { Refresh } from "@mui/icons-material";
import AdSense from "../components/AdSense";

interface BpResult {
  category: string;
  color: string;
  systolic: number;
  diastolic: number;
  recommendation: string;
}

interface BpHistoryEntry {
  date: string;
  systolic: number;
  diastolic: number;
  category: string;
}

const BloodPressureCalculator = () => {
  const theme = useTheme();
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [result, setResult] = useState<BpResult | null>(null);
  const [systolicError, setSystolicError] = useState("");
  const [diastolicError, setDiastolicError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [bpHistory, setBpHistory] = useState<BpHistoryEntry[]>([]);

  // Load BP history from localStorage on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const savedHistory = localStorage.getItem("bpHistory");
    if (savedHistory) {
      try {
        setBpHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Error parsing BP history:", error);
      }
    }
  }, []);

  const validateInputs = (): boolean => {
    let isValid = true;

    // Validate systolic
    if (!systolic) {
      setSystolicError("Systolic pressure is required");
      isValid = false;
    } else {
      const sys = parseFloat(systolic);
      if (isNaN(sys) || sys <= 0) {
        setSystolicError("Please enter a valid systolic pressure");
        isValid = false;
      } else if (sys < 70 || sys > 250) {
        setSystolicError("Systolic pressure should be between 70 and 250 mmHg");
        isValid = false;
      } else {
        setSystolicError("");
      }
    }

    // Validate diastolic
    if (!diastolic) {
      setDiastolicError("Diastolic pressure is required");
      isValid = false;
    } else {
      const dia = parseFloat(diastolic);
      if (isNaN(dia) || dia <= 0) {
        setDiastolicError("Please enter a valid diastolic pressure");
        isValid = false;
      } else if (dia < 40 || dia > 150) {
        setDiastolicError(
          "Diastolic pressure should be between 40 and 150 mmHg"
        );
        isValid = false;
      } else {
        setDiastolicError("");
      }
    }

    return isValid;
  };

  const calculateBP = () => {
    if (!validateInputs()) return;

    const sys = parseFloat(systolic);
    const dia = parseFloat(diastolic);

    let category: string;
    let color: string;
    let recommendation: string;

    // Blood pressure categories based on American Heart Association guidelines
    if (sys < 120 && dia < 80) {
      category = "Normal";
      color = theme.palette.success.main;
      recommendation =
        "Maintain a healthy lifestyle with regular exercise and balanced diet.";
    } else if (sys >= 120 && sys <= 129 && dia < 80) {
      category = "Elevated";
      color = theme.palette.success.light;
      recommendation =
        "Adopt healthy lifestyle changes and monitor your blood pressure regularly.";
    } else if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89)) {
      category = "Hypertension Stage 1";
      color = theme.palette.warning.main;
      recommendation =
        "Consider lifestyle changes and consult with a healthcare provider about potential medication.";
    } else if ((sys >= 140 && sys <= 179) || (dia >= 90 && dia <= 119)) {
      category = "Hypertension Stage 2";
      color = theme.palette.error.light;
      recommendation =
        "Consult with a healthcare provider about lifestyle changes and medication options.";
    } else if (sys >= 180 || dia >= 120) {
      category = "Hypertensive Crisis";
      color = theme.palette.error.dark;
      recommendation =
        "Seek immediate medical attention if there are no accompanying symptoms. If experiencing symptoms like chest pain, shortness of breath, back pain, numbness, weakness, vision changes, or difficulty speaking, call emergency services immediately.";
    } else {
      category = "Invalid Reading";
      color = theme.palette.grey[500];
      recommendation = "Please check your input values and try again.";
    }

    setResult({
      category,
      color,
      systolic: sys,
      diastolic: dia,
      recommendation,
    });

    // Save to history
    const newEntry: BpHistoryEntry = {
      date: new Date().toLocaleString(),
      systolic: sys,
      diastolic: dia,
      category,
    };

    const updatedHistory = [newEntry, ...bpHistory].slice(0, 10); // Keep only the last 10 entries
    setBpHistory(updatedHistory);
    localStorage.setItem("bpHistory", JSON.stringify(updatedHistory));

    // Show success message
    setSnackbarMessage("Blood pressure calculated successfully");
    setSnackbarOpen(true);
  };

  const handleReset = () => {
    setSystolic("");
    setDiastolic("");
    setResult(null);
    setSystolicError("");
    setDiastolicError("");
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Helmet>
          <title>Blood Pressure Calculator - Free BP Category Checker</title>
          <meta
            name="description"
            content="Calculate your blood pressure category and understand your cardiovascular health with our free online blood pressure calculator. Check if your readings indicate normal, elevated, or hypertensive conditions."
          />
          <meta
            property="keywords"
            content="blood pressure calculator, bp calculator, hypertension calculator, systolic diastolic calculator, blood pressure categories, blood pressure chart, hypertension stages, cardiovascular health tool, heart health calculator, blood pressure monitor, bp reading analyzer, hypertension risk assessment, blood pressure tracker, heart health assessment, diastolic systolic calculator, blood pressure classification, hypertensive crisis calculator, normal blood pressure range, elevated blood pressure, stage 1 hypertension, stage 2 hypertension, blood pressure health tool, Blood pressure calculator online free, Free blood pressure checker tool, Online blood pressure reading calculator, Blood pressure chart generator, Systolic diastolic calculator, Blood pressure level checker, Normal blood pressure calculator, Blood pressure measurement tool, Blood pressure test online, Blood pressure range calculator, Blood pressure health checker, Blood pressure calculator with interpretation, Blood pressure calculator for adults, Blood pressure calculator with categories, Hypertension risk calculator, Blood pressure calculator by age, Blood pressure calculator with heart rate, Blood pressure calculator tool for doctors, Blood pressure tracker online, Blood pressure log generator, Blood pressure calculator app online, Blood pressure calculator with BMI, Blood pressure calculator medical tool, Blood pressure calculator for men women, Blood pressure calculator with pulse, Blood pressure calculator in mmHg, Blood pressure calculator online medical, Blood pressure calculator with results chart, Best online blood pressure calculator"
          />
        </Helmet>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            Blood Pressure Calculator
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Calculate your blood pressure category and understand your
            cardiovascular health
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
                    <FormControl fullWidth error={!!systolicError}>
                      <TextField
                        fullWidth
                        label="Systolic Pressure (mmHg)"
                        type="number"
                        value={systolic}
                        onChange={(e) => setSystolic(e.target.value)}
                        error={!!systolicError}
                        helperText={
                          systolicError ||
                          "Top number in blood pressure reading (when heart beats)"
                        }
                        InputProps={{
                          inputProps: {
                            min: 70,
                            max: 250,
                            step: 1,
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth error={!!diastolicError}>
                      <TextField
                        fullWidth
                        label="Diastolic Pressure (mmHg)"
                        type="number"
                        value={diastolic}
                        onChange={(e) => setDiastolic(e.target.value)}
                        error={!!diastolicError}
                        helperText={
                          diastolicError ||
                          "Bottom number in blood pressure reading (when heart rests)"
                        }
                        InputProps={{
                          inputProps: {
                            min: 40,
                            max: 150,
                            step: 1,
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
                        onClick={calculateBP}
                        disabled={!systolic || !diastolic}
                        startIcon={<Heart />}
                      >
                        Calculate
                      </Button>

                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        disabled={!systolic || !diastolic}
                        startIcon={<Refresh />}
                      >
                        Reset
                      </Button>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 3,
                      }}
                    >
                      <Info size={16} style={{ marginRight: 8 }} />
                      <Typography>What is blood pressure?</Typography>
                    </Box>
                    <Typography variant="body2" marginTop={1} paragraph>
                      Blood pressure is the force of blood pushing against the
                      walls of your arteries as your heart pumps blood. It is
                      measured using two numbers:
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.action.hover,
                        p: 2,
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" fontFamily="monospace">
                        <strong>Systolic pressure:</strong> The pressure when
                        your heart beats and pushes blood through your arteries
                      </Typography>
                      <Typography
                        variant="body2"
                        fontFamily="monospace"
                        sx={{ mt: 1 }}
                      >
                        <strong>Diastolic pressure:</strong> The pressure when
                        your heart rests between beats
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Blood pressure is written as systolic over diastolic
                      (e.g., 120/80 mmHg). Both numbers are important in
                      determining the state of your heart health.
                    </Typography>
                  </Grid>
                </Grid>
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
                        variant="h4"
                        sx={{ color: result.color, my: 2 }}
                      >
                        {result.systolic}/{result.diastolic} mmHg
                      </Typography>
                      <Typography variant="h5" sx={{ color: result.color }}>
                        {result.category}
                      </Typography>

                      <Alert
                        severity={
                          result.category === "Hypertensive Crisis"
                            ? "error"
                            : result.category === "Hypertension Stage 2"
                            ? "warning"
                            : result.category === "Hypertension Stage 1"
                            ? "warning"
                            : result.category === "Elevated"
                            ? "info"
                            : "success"
                        }
                        icon={<AlertCircle />}
                        sx={{ mt: 2, mb: 2 }}
                      >
                        {result.recommendation}
                      </Alert>

                      <Divider sx={{ my: 2 }} />

                      {/* BP Categories Table */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1, textAlign: "left" }}
                      >
                        Blood Pressure Categories:
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Category</TableCell>
                              <TableCell>Systolic (mmHg)</TableCell>
                              <TableCell>Diastolic (mmHg)</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow
                              sx={{
                                backgroundColor:
                                  theme.palette.success.main + "20",
                              }}
                            >
                              <TableCell>Normal</TableCell>
                              <TableCell>&lt;120</TableCell>
                              <TableCell>and &lt;80</TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                backgroundColor:
                                  theme.palette.success.light + "20",
                              }}
                            >
                              <TableCell>Elevated</TableCell>
                              <TableCell>120-129</TableCell>
                              <TableCell>and &lt;80</TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                backgroundColor:
                                  theme.palette.warning.main + "20",
                              }}
                            >
                              <TableCell>Hypertension Stage 1</TableCell>
                              <TableCell>130-139</TableCell>
                              <TableCell>or 80-89</TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                backgroundColor:
                                  theme.palette.error.light + "20",
                              }}
                            >
                              <TableCell>Hypertension Stage 2</TableCell>
                              <TableCell>140-179</TableCell>
                              <TableCell>or 90-119</TableCell>
                            </TableRow>
                            <TableRow
                              sx={{
                                backgroundColor:
                                  theme.palette.error.dark + "20",
                              }}
                            >
                              <TableCell>Hypertensive Crisis</TableCell>
                              <TableCell>≥180</TableCell>
                              <TableCell>and/or ≥120</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </motion.div>
                ) : (
                  <Box sx={{ textAlign: "center", color: "text.secondary" }}>
                    <Heart size={48} />
                    <Typography variant="h5" sx={{ mt: 2 }}>
                      Enter your blood pressure readings to calculate
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Blood pressure is measured in millimeters of mercury
                      (mmHg) and is written as systolic/diastolic (e.g., 120/80
                      mmHg).
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          <AdSense adSlot="6613251015" />

          {/* Educational Content */}
          <Grid container spacing={4} sx={{ mt: 2 }}>
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
                  Understanding Blood Pressure
                </Typography>

                <Typography variant="body1" paragraph>
                  Blood pressure is a vital sign that measures the force of
                  blood pushing against the walls of your arteries. It's an
                  important indicator of your overall cardiovascular health.
                  High blood pressure (hypertension) can lead to serious health
                  problems like heart disease, stroke, and kidney failure if
                  left untreated.
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Factors Affecting Blood Pressure
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Lifestyle Factors:
                    </Typography>
                    <ul>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Diet:</strong> High sodium intake, excessive
                          alcohol, and poor nutrition
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Physical activity:</strong> Sedentary
                          lifestyle and lack of regular exercise
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Weight:</strong> Being overweight or obese
                          increases risk
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Tobacco use:</strong> Smoking and exposure to
                          secondhand smoke
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Stress:</strong> Chronic stress can contribute
                          to high blood pressure
                        </Typography>
                      </li>
                    </ul>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Medical and Genetic Factors:
                    </Typography>
                    <ul>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Age:</strong> Blood pressure tends to rise
                          with age
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Family history:</strong> Hypertension often
                          runs in families
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Chronic conditions:</strong> Kidney disease,
                          diabetes, and sleep apnea
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Medications:</strong> Some medications can
                          raise blood pressure
                        </Typography>
                      </li>
                      <li>
                        <Typography variant="body2" paragraph>
                          <strong>Race:</strong> High blood pressure is
                          particularly common in people of African heritage
                        </Typography>
                      </li>
                    </ul>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Managing Blood Pressure
                </Typography>

                <Typography variant="body1" paragraph>
                  If you have high blood pressure, these lifestyle changes can
                  help manage it:
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        Healthy Diet
                      </Typography>
                      <Typography variant="body2">
                        Follow the DASH diet (Dietary Approaches to Stop
                        Hypertension), which emphasizes fruits, vegetables,
                        whole grains, lean proteins, and low-fat dairy while
                        limiting sodium, saturated fats, and added sugars.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        Regular Exercise
                      </Typography>
                      <Typography variant="body2">
                        Aim for at least 150 minutes of moderate-intensity
                        aerobic activity or 75 minutes of vigorous activity per
                        week, plus muscle-strengthening activities twice a week.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        Maintain Healthy Weight
                      </Typography>
                      <Typography variant="body2">
                        Even a small weight loss can help reduce blood pressure.
                        Aim for a BMI between 18.5 and 24.9.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        Limit Alcohol
                      </Typography>
                      <Typography variant="body2">
                        If you drink, do so in moderation: up to one drink per
                        day for women and up to two drinks per day for men.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        Reduce Sodium
                      </Typography>
                      <Typography variant="body2">
                        Aim to consume less than 2,300 mg of sodium per day, or
                        ideally, less than 1,500 mg per day for most adults.
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: theme.palette.background.default,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700}>
                        Manage Stress
                      </Typography>
                      <Typography variant="body2">
                        Practice relaxation techniques such as deep breathing,
                        meditation, yoga, or tai chi to help reduce stress
                        levels.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    This calculator provides estimates based on general
                    guidelines and should not replace professional medical
                    advice. Always consult with a healthcare provider for proper
                    diagnosis and treatment of high blood pressure.
                  </Typography>
                </Alert>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </>
  );
};

export default BloodPressureCalculator;
