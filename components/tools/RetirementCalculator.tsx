"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Chip,
  Switch,
  FormControlLabel,
  Paper,
  LinearProgress,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Slider,
  Container,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  AccountBalance as AccountBalanceIcon,
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { Calculator } from "lucide-react";
import Navigation from "@/components/Navigation";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import {
  RetirementInputs,
  RetirementResults,
  YearlyBreakdown,
} from "@/lib/types/retirement";
import {
  calculateRetirement,
  generateYearlyBreakdown,
  formatCurrency,
  formatPercentage,
} from "@/lib/utils/retirementCalculator";
import AdSense from "@/components/AdSense";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const RetirementCalculator = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [inputs, setInputs] = useState<RetirementInputs>({
    currentAge: 0,
    retirementAge: 0,
    currentSavings: 0,
    monthlyContribution: 0,
    monthlyExpenses: 0,
    annualReturnRate: 12,
    inflationRate: 6,
    lifeExpectancy: 85,
    employerMatch: 0,
    salary: 0,
    contributionIncreaseRate: 0,
  });

  const [results, setResults] = useState<RetirementResults | null>(null);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<YearlyBreakdown[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scenarios, setScenarios] = useState<RetirementInputs[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<RetirementInputs>>({});

  // Validate form inputs
  const validateForm = (): boolean => {
    const errors: Partial<RetirementInputs> = {};

    if (
      !inputs.currentAge ||
      inputs.currentAge < 18 ||
      inputs.currentAge > 65
    ) {
      errors.currentAge = 18;
    }
    if (
      !inputs.retirementAge ||
      inputs.retirementAge <= inputs.currentAge ||
      inputs.retirementAge > 75
    ) {
      errors.retirementAge = inputs.currentAge + 1;
    }
    if (inputs.currentSavings < 0) {
      errors.currentSavings = 0;
    }
    if (!inputs.monthlyContribution || inputs.monthlyContribution <= 0) {
      errors.monthlyContribution = 1000;
    }
    if (!inputs.monthlyExpenses || inputs.monthlyExpenses <= 0) {
      errors.monthlyExpenses = 1000;
    }
    if (
      !inputs.lifeExpectancy ||
      inputs.lifeExpectancy <= inputs.retirementAge
    ) {
      errors.lifeExpectancy = inputs.retirementAge + 1;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Perform calculation
  const performCalculation = () => {
    if (
      inputs.currentAge < inputs.retirementAge &&
      inputs.retirementAge < inputs.lifeExpectancy
    ) {
      setIsCalculating(true);
      try {
        const calculatedResults = calculateRetirement(inputs);
        const breakdown = generateYearlyBreakdown(inputs);
        setResults(calculatedResults);
        setYearlyBreakdown(breakdown);
      } catch (error) {
        console.error("Calculation error:", error);
        setResults(null);
      }
      setTimeout(() => setIsCalculating(false), 300);
    }
  };

  // Handle form submission (first time)
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setHasSubmitted(true);
    performCalculation();
  };

  // Real-time calculation after first submission
  useEffect(() => {
    if (hasSubmitted) {
      performCalculation();
    }
  }, [inputs, hasSubmitted]);

  const handleInputChange =
    (field: keyof RetirementInputs) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value) || 0;
      setInputs((prev) => ({ ...prev, [field]: value }));
    };

  const handleSliderChange =
    (field: keyof RetirementInputs) => (_: Event, value: number | number[]) => {
      setInputs((prev) => ({ ...prev, [field]: value as number }));
    };

  // Chart data preparation
  const chartData = useMemo(() => {
    if (!yearlyBreakdown.length) return [];

    return yearlyBreakdown.map((item) => ({
      year: item.year,
      age: item.age,
      balance: Math.round(item.endingBalance),
      contribution: Math.round(item.contribution),
      employerMatch: Math.round(item.employerMatch),
      investmentReturn: Math.round(item.investmentReturn),
      inflationAdjusted: Math.round(item.inflationAdjustedValue),
    }));
  }, [yearlyBreakdown]);

  const pieChartData = useMemo(() => {
    if (!results) return [];

    return [
      {
        name: "Current Savings",
        value: inputs.currentSavings,
        color: COLORS[0],
      },
      {
        name: "Your Contributions",
        value: results.monthlyContributionsTotal,
        color: COLORS[1],
      },
      {
        name: "Employer Match",
        value: results.employerContributionsTotal,
        color: COLORS[2],
      },
      {
        name: "Investment Growth",
        value: results.investmentGrowth,
        color: COLORS[3],
      },
    ].filter((item) => item.value > 0);
  }, [results, inputs.currentSavings]);

  // Custom label function for pie chart
  const renderPieLabel = (entry: any) => {
    const total = pieChartData.reduce((sum, item) => sum + item.value, 0);
    const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0";
    return `${percent}%`;
  };

  const addScenario = () => {
    setScenarios((prev) => [...prev, { ...inputs }]);
  };

  const exportResults = () => {
    if (!results || !yearlyBreakdown.length) return;

    const exportData = {
      inputs,
      results,
      yearlyBreakdown,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "retirement-plan.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetInputs = () => {
    setInputs({
      currentAge: 0,
      retirementAge: 0,
      currentSavings: 0,
      monthlyContribution: 0,
      monthlyExpenses: 0,
      annualReturnRate: 12,
      inflationRate: 6,
      lifeExpectancy: 85,
      employerMatch: 0,
      salary: 0,
      contributionIncreaseRate: 0,
    });
    setScenarios([]);
    setResults(null);
    setYearlyBreakdown([]);
    setHasSubmitted(false);
    setFormErrors({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

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
            Retirement Planning Calculator
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
            Plan your retirement with comprehensive calculations, inflation
            adjustments, and investment growth projections. Calculate required
            corpus, savings goals, and retirement income planning.
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            color="error"
            startIcon={<RefreshIcon />}
            onClick={resetInputs}
          >
            Reset
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={exportResults}
            disabled={!results}
          >
            Export Plan
          </Button>
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
            onClick={addScenario}
            disabled={!results}
          >
            Add Scenario
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={showAdvanced}
                onChange={(e) => setShowAdvanced(e.target.checked)}
              />
            }
            label="Advanced Options"
          />
        </Box>

        <Grid container spacing={4}>
          {/* Input Section */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="calculator-form"
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AccountBalanceIcon
                  sx={{
                    fontSize: 28,
                    color: theme.palette.primary.main,
                    mr: 1.5,
                  }}
                />
                <Typography
                  id="calculator-form"
                  variant="h3"
                  component="h3"
                  fontWeight={600}
                  sx={{ fontSize: "1.5rem" }}
                >
                  Retirement Inputs
                </Typography>
              </Box>

              <Box component="form" noValidate autoComplete="off">
                <Grid container spacing={2}>
                  {/* Basic Inputs */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Current Age"
                      type="number"
                      value={inputs.currentAge || ""}
                      onChange={handleInputChange("currentAge")}
                      inputProps={{ min: 18, max: 65 }}
                      error={!!formErrors.currentAge}
                      helperText={
                        formErrors.currentAge
                          ? "Age must be between 18 and 65"
                          : ""
                      }
                      placeholder="e.g., 30"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Retirement Age"
                      type="number"
                      value={inputs.retirementAge || ""}
                      onChange={handleInputChange("retirementAge")}
                      inputProps={{ min: inputs.currentAge + 1, max: 75 }}
                      error={!!formErrors.retirementAge}
                      helperText={
                        formErrors.retirementAge
                          ? "Must be greater than current age"
                          : ""
                      }
                      placeholder="e.g., 60"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Savings (₹)"
                      type="number"
                      value={inputs.currentSavings || ""}
                      onChange={handleInputChange("currentSavings")}
                      inputProps={{ min: 0 }}
                      error={!!formErrors.currentSavings}
                      helperText={
                        formErrors.currentSavings ? "Cannot be negative" : ""
                      }
                      placeholder="e.g., 500000"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Monthly Contribution (₹)"
                      type="number"
                      value={inputs.monthlyContribution || ""}
                      onChange={handleInputChange("monthlyContribution")}
                      inputProps={{ min: 0 }}
                      error={!!formErrors.monthlyContribution}
                      helperText={
                        formErrors.monthlyContribution
                          ? "Monthly contribution is required"
                          : ""
                      }
                      placeholder="e.g., 25000"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Monthly Expenses (₹)"
                      type="number"
                      value={inputs.monthlyExpenses || ""}
                      onChange={handleInputChange("monthlyExpenses")}
                      inputProps={{ min: 0 }}
                      error={!!formErrors.monthlyExpenses}
                      helperText={
                        formErrors.monthlyExpenses
                          ? "Monthly expenses are required for accurate planning"
                          : "Your current monthly living expenses"
                      }
                      placeholder="e.g., 50000"
                    />
                  </Grid>
                  {/* Rate Sliders */}
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      Annual Return Rate: {inputs.annualReturnRate}%
                    </Typography>
                    <Slider
                      value={inputs.annualReturnRate}
                      onChange={handleSliderChange("annualReturnRate")}
                      min={4}
                      max={20}
                      step={0.5}
                      marks={[
                        { value: 6, label: "6%" },
                        { value: 12, label: "12%" },
                        { value: 18, label: "18%" },
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      Inflation Rate: {inputs.inflationRate}%
                    </Typography>
                    <Slider
                      value={inputs.inflationRate}
                      onChange={handleSliderChange("inflationRate")}
                      min={2}
                      max={12}
                      step={0.5}
                      marks={[
                        { value: 3, label: "3%" },
                        { value: 6, label: "6%" },
                        { value: 9, label: "9%" },
                      ]}
                    />
                  </Grid>
                  {/* Advanced Options */}
                  {showAdvanced && (
                    <>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Life Expectancy"
                          type="number"
                          value={inputs.lifeExpectancy || ""}
                          onChange={handleInputChange("lifeExpectancy")}
                          inputProps={{
                            min: inputs.retirementAge + 1,
                            max: 100,
                          }}
                          error={!!formErrors.lifeExpectancy}
                          helperText={
                            formErrors.lifeExpectancy
                              ? "Must be greater than retirement age"
                              : ""
                          }
                          placeholder="e.g., 85"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Annual Salary (₹)"
                          type="number"
                          value={inputs.salary || ""}
                          onChange={handleInputChange("salary")}
                          placeholder="e.g., 1000000"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Employer Match (%)"
                          type="number"
                          value={inputs.employerMatch || ""}
                          onChange={handleInputChange("employerMatch")}
                          inputProps={{ min: 0, max: 100 }}
                          placeholder="e.g., 50"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Contribution Growth (%)"
                          type="number"
                          value={inputs.contributionIncreaseRate || ""}
                          onChange={handleInputChange(
                            "contributionIncreaseRate"
                          )}
                          inputProps={{ min: 0, max: 20 }}
                          placeholder="e.g., 5"
                        />
                      </Grid>
                    </>
                  )}
                  {/* Calculate Button - Only show if not submitted yet */}
                  {!hasSubmitted && (
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        onClick={handleSubmit}
                        startIcon={<Calculator size={20} />}
                        sx={{
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: "1rem",
                        }}
                      >
                        Calculate Retirement Plan
                      </Button>
                    </Grid>
                  )}
                  {/* Real-time indicator after submission */}
                  {hasSubmitted && (
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mt: 1 }}>
                        ✨ Real-time updates enabled! Your plan updates
                        automatically as you change inputs.
                      </Alert>
                    </Grid>
                  )}{" "}
                </Grid>
              </Box>
            </Paper>
          </Grid>

          {/* Results Section */}
          <Grid item xs={12} md={7}>
            {isCalculating && <LinearProgress sx={{ mb: 2 }} />}

            {!hasSubmitted && !results && (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <AccountBalanceIcon
                    sx={{ fontSize: 80, color: "primary.main", mb: 3 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Ready to Plan Your Retirement?
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
                  >
                    Fill out your financial information on the left and click
                    "Calculate Retirement Plan" to see your personalized
                    retirement projections and recommendations.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Comprehensive analysis with inflation adjustments
                    <br />
                    • Interactive charts and year-by-year breakdown
                    <br />• Personalized recommendations for your goals
                  </Typography>
                </CardContent>
              </Card>
            )}

            {results && (
              <Card>
                <CardContent>
                  <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{ mb: 3 }}
                  >
                    <Tab label="Summary" />
                    <Tab label="Projections" />
                    <Tab label="Breakdown" />
                    <Tab label="Analysis" />
                  </Tabs>

                  {/* Summary Tab */}
                  <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={3}>
                      {/* Key Metrics */}
                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, textAlign: "center" }}>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Retirement Corpus
                          </Typography>
                          <Typography
                            variant="h3"
                            fontWeight="bold"
                            color="success.main"
                          >
                            {formatCurrency(results.totalSavingsAtRetirement)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total savings at age {inputs.retirementAge}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, textAlign: "center" }}>
                          <Typography variant="h6" color="primary" gutterBottom>
                            Goal Status
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 1,
                            }}
                          >
                            {results.isGoalAchievable ? (
                              <CheckCircleIcon
                                sx={{ color: "success.main", fontSize: 40 }}
                              />
                            ) : (
                              <WarningIcon
                                sx={{ color: "error.main", fontSize: 40 }}
                              />
                            )}
                          </Box>
                          <Typography
                            variant="h6"
                            color={
                              results.isGoalAchievable
                                ? "success.main"
                                : "error.main"
                            }
                          >
                            {results.isGoalAchievable
                              ? "On Track"
                              : "Needs Adjustment"}
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Contribution Breakdown */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Contribution Breakdown
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={120}
                              dataKey="value"
                              label={renderPieLabel}
                              fontSize={14}
                              fontWeight={600}
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              formatter={(value, name) => [
                                formatCurrency(value as number),
                                name,
                              ]}
                            />
                            <Legend
                              verticalAlign="bottom"
                              height={36}
                              wrapperStyle={{
                                paddingTop: "20px",
                                fontSize: "14px",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Grid>

                      {/* Key Stats */}
                      <Grid item xs={12}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Card variant="outlined">
                              <CardContent sx={{ textAlign: "center" }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Years to Retirement
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                  {results.yearsToRetirement}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Card variant="outlined">
                              <CardContent sx={{ textAlign: "center" }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Withdrawal Rate
                                </Typography>
                                <Typography
                                  variant="h5"
                                  fontWeight="bold"
                                  color={
                                    results.withdrawalRate <= 4
                                      ? "success.main"
                                      : "error.main"
                                  }
                                >
                                  {formatPercentage(results.withdrawalRate)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Card variant="outlined">
                              <CardContent sx={{ textAlign: "center" }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Shortfall/ Surplus
                                </Typography>
                                <Typography
                                  variant="h5"
                                  fontWeight="bold"
                                  color={
                                    results.shortfallOrSurplus >= 0
                                      ? "success.main"
                                      : "error.main"
                                  }
                                >
                                  {formatCurrency(results.shortfallOrSurplus)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Card variant="outlined">
                              <CardContent sx={{ textAlign: "center" }}>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Investment Growth
                                </Typography>
                                <Typography
                                  variant="h5"
                                  fontWeight="bold"
                                  color="success.main"
                                >
                                  {formatCurrency(results.investmentGrowth)}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TabPanel>

                  {/* Projections Tab */}
                  <TabPanel value={tabValue} index={1}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Retirement Savings Growth
                      </Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="age" />
                          <YAxis
                            tickFormatter={(value) =>
                              `₹${(value / 100000).toFixed(1)}L`
                            }
                          />
                          <RechartsTooltip
                            formatter={(value, name) => [
                              formatCurrency(value as number),
                              name,
                            ]}
                            labelFormatter={(age) => `Age: ${age}`}
                          />
                          <Area
                            type="monotone"
                            dataKey="balance"
                            stackId="1"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                            name="Portfolio Value"
                          />
                          <Area
                            type="monotone"
                            dataKey="inflationAdjusted"
                            stackId="2"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.4}
                            name="Inflation Adjusted"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Box>

                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Annual Contributions vs Returns
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.slice(-10)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="age" />
                          <YAxis
                            tickFormatter={(value) =>
                              `₹${(value / 1000).toFixed(0)}K`
                            }
                          />
                          <RechartsTooltip
                            formatter={(value) =>
                              formatCurrency(value as number)
                            }
                          />
                          <Legend />
                          <Bar
                            dataKey="contribution"
                            fill="#8884d8"
                            name="Your Contributions"
                          />
                          <Bar
                            dataKey="employerMatch"
                            fill="#82ca9d"
                            name="Employer Match"
                          />
                          <Bar
                            dataKey="investmentReturn"
                            fill="#ffc658"
                            name="Investment Returns"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </TabPanel>

                  {/* Breakdown Tab */}
                  <TabPanel value={tabValue} index={2}>
                    <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Age</TableCell>
                            <TableCell align="right">
                              Starting Balance
                            </TableCell>
                            <TableCell align="right">Contributions</TableCell>
                            <TableCell align="right">Employer Match</TableCell>
                            <TableCell align="right">Returns</TableCell>
                            <TableCell align="right">Ending Balance</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {yearlyBreakdown.map((row) => (
                            <TableRow key={row.year} hover>
                              <TableCell>{row.age}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(row.beginningBalance)}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(row.contribution)}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(row.employerMatch)}
                              </TableCell>
                              <TableCell align="right">
                                {formatCurrency(row.investmentReturn)}
                              </TableCell>
                              <TableCell
                                align="right"
                                sx={{ fontWeight: "bold" }}
                              >
                                {formatCurrency(row.endingBalance)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </TabPanel>

                  {/* Analysis Tab */}
                  <TabPanel value={tabValue} index={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Alert
                          severity={
                            results.isGoalAchievable ? "success" : "warning"
                          }
                          sx={{ mb: 3 }}
                        >
                          <Typography variant="h6" gutterBottom>
                            {results.isGoalAchievable
                              ? "Congratulations!"
                              : "Action Required"}
                          </Typography>
                          <Typography>
                            {results.isGoalAchievable
                              ? "Your retirement plan is on track to meet your goals."
                              : "Your current plan may not meet your retirement goals. Review the recommendations below."}
                          </Typography>
                        </Alert>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Personalized Recommendations
                        </Typography>
                        {results.recommendations.map(
                          (recommendation, index) => (
                            <Alert key={index} severity="info" sx={{ mb: 2 }}>
                              {recommendation}
                            </Alert>
                          )
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Financial Metrics
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>Required Corpus:</Typography>
                              <Typography fontWeight="bold">
                                {formatCurrency(
                                  results.requiredCorpusForIncome
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>Projected Corpus:</Typography>
                              <Typography fontWeight="bold">
                                {formatCurrency(
                                  results.totalSavingsAtRetirement
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>
                                Inflation Adjusted Income:
                              </Typography>
                              <Typography fontWeight="bold">
                                {formatCurrency(
                                  results.inflationAdjustedIncome
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>Savings Rate:</Typography>
                              <Typography
                                fontWeight="bold"
                                color={
                                  results.savingsRate >= 15
                                    ? "success.main"
                                    : results.savingsRate >= 10
                                    ? "warning.main"
                                    : "error.main"
                                }
                              >
                                {formatPercentage(results.savingsRate)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Expense Analysis
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>Current Monthly Expenses:</Typography>
                              <Typography fontWeight="bold">
                                {formatCurrency(inputs.monthlyExpenses)}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>
                                Inflation Adjusted Expenses:
                              </Typography>
                              <Typography fontWeight="bold">
                                {formatCurrency(
                                  results.inflationAdjustedExpenses
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>
                                Required Retirement Income:
                              </Typography>
                              <Typography
                                fontWeight="bold"
                                color="primary.main"
                              >
                                {formatCurrency(
                                  results.inflationAdjustedIncome
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>Income Buffer:</Typography>
                              <Typography
                                fontWeight="bold"
                                color="success.main"
                              >
                                20% (Healthcare & Lifestyle)
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Contribution Summary
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>Your Contributions:</Typography>
                              <Typography fontWeight="bold">
                                {formatCurrency(
                                  results.monthlyContributionsTotal
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>Employer Match:</Typography>
                              <Typography fontWeight="bold">
                                {formatCurrency(
                                  results.employerContributionsTotal
                                )}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                              }}
                            >
                              <Typography>Investment Growth:</Typography>
                              <Typography
                                fontWeight="bold"
                                color="success.main"
                              >
                                {formatCurrency(results.investmentGrowth)}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </TabPanel>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>

        {/* Scenarios Comparison */}
        {scenarios.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scenario Comparison
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Scenario</TableCell>
                      <TableCell align="right">Monthly Contribution</TableCell>
                      <TableCell align="right">Return Rate</TableCell>
                      <TableCell align="right">Final Corpus</TableCell>
                      <TableCell align="right">Goal Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Current</TableCell>
                      <TableCell align="right">
                        {formatCurrency(inputs.monthlyContribution)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(inputs.annualReturnRate)}
                      </TableCell>
                      <TableCell align="right">
                        {results
                          ? formatCurrency(results.totalSavingsAtRetirement)
                          : "-"}
                      </TableCell>
                      <TableCell align="right">
                        {results && (
                          <Chip
                            label={
                              results.isGoalAchievable
                                ? "On Track"
                                : "Shortfall"
                            }
                            color={
                              results.isGoalAchievable ? "success" : "error"
                            }
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>-</TableCell>
                    </TableRow>
                    {scenarios.map((scenario, index) => {
                      const scenarioResults = calculateRetirement(scenario);
                      return (
                        <TableRow key={index}>
                          <TableCell>Scenario {index + 1}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(scenario.monthlyContribution)}
                          </TableCell>
                          <TableCell align="right">
                            {formatPercentage(scenario.annualReturnRate)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(
                              scenarioResults.totalSavingsAtRetirement
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={
                                scenarioResults.isGoalAchievable
                                  ? "On Track"
                                  : "Shortfall"
                              }
                              color={
                                scenarioResults.isGoalAchievable
                                  ? "success"
                                  : "error"
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() =>
                                setScenarios((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                            >
                              <WarningIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* AdSense */}
      <AdSense adSlot="3146398237" />

      {/* Informational Content */}
      <Box sx={{ mt: 4 }}>
        {/* Features Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Why Use Our Retirement Calculator?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <AccountBalanceIcon sx={{ fontSize: 24, color: "white" }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Comprehensive Planning
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Calculate your retirement corpus considering inflation,
                  returns, and life expectancy for accurate financial planning.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 24, color: "white" }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Interactive Charts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Visualize your retirement journey with detailed charts showing
                  growth projections and yearly breakdowns.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.warning.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 24, color: "white" }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Smart Recommendations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get personalized recommendations to optimize your retirement
                  strategy and achieve your financial goals.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* How It Works Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            How to Plan Your Retirement
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  1
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Enter Basic Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Input your current age, planned retirement age, current
                  savings, and monthly expenses.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  2
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Set Investment Parameters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure expected returns, inflation rate, and monthly
                  contribution amounts.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  3
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Analyze Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Review your projected retirement corpus, withdrawal rates, and
                  goal achievement status.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  4
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Optimize Strategy
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Adjust parameters based on recommendations to improve your
                  retirement planning.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Benefits Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Key Benefits
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    100% Free & No Registration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use our retirement calculator completely free without
                    creating an account or providing personal information.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Real-time Calculations
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    See instant updates as you modify parameters, helping you
                    understand the impact of different scenarios.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Comprehensive Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Includes inflation adjustment, employer contributions, and
                    detailed year-by-year projections.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Visual Charts & Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Interactive charts and detailed breakdowns help you
                    visualize your retirement journey.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* FAQ Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            fontWeight={600}
            itemProp="name"
          >
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Box
              itemProp="mainEntity"
              itemScope
              itemType="https://schema.org/Question"
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                itemProp="name"
              >
                What return rate should I use for retirement planning?
              </Typography>
              <Box
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                  itemProp="text"
                >
                  For long-term retirement planning, consider using 8-12% for
                  equity-heavy portfolios, 6-8% for balanced portfolios, and
                  4-6% for conservative portfolios. Our default of 12% assumes a
                  growth-oriented investment strategy.
                </Typography>
              </Box>
            </Box>

            <Box
              itemProp="mainEntity"
              itemScope
              itemType="https://schema.org/Question"
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                itemProp="name"
              >
                How much should I save for retirement?
              </Typography>
              <Box
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                  itemProp="text"
                >
                  Financial experts recommend saving 10-15% of your income for
                  retirement. Start early to take advantage of compound growth,
                  and increase contributions whenever possible.
                </Typography>
              </Box>
            </Box>

            <Box
              itemProp="mainEntity"
              itemScope
              itemType="https://schema.org/Question"
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                itemProp="name"
              >
                What is the 4% withdrawal rule?
              </Typography>
              <Box
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                  itemProp="text"
                >
                  The 4% rule suggests withdrawing 4% of your retirement corpus
                  annually to make your savings last 30+ years. Our calculator
                  helps you understand if your planned withdrawals align with
                  this guideline.
                </Typography>
              </Box>
            </Box>

            <Box
              itemProp="mainEntity"
              itemScope
              itemType="https://schema.org/Question"
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                itemProp="name"
              >
                Should I include inflation in my calculations?
              </Typography>
              <Box
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  itemProp="text"
                >
                  Yes, inflation significantly impacts long-term purchasing
                  power. Our calculator includes inflation adjustments to show
                  the real value of your future retirement income and ensure
                  your planning accounts for rising costs.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* AdSense */}
      <AdSense adSlot="4201858400" />
    </Container>
  );
};

export default RetirementCalculator;
