"use client";

import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Paper,
  Chip,
} from "@mui/material";
import {
  Calculate as CalculateIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import AdSense from "../AdSense";
import Navigation from "@/components/Navigation";

interface CalculationResult {
  type: string;
  result: number;
  formula: string;
  explanation: string;
}

export default function PercentageCalculator() {
  const [value1, setValue1] = useState<string>("");
  const [value2, setValue2] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");
  const [results, setResults] = useState<CalculationResult[]>([]);
  const [error, setError] = useState<string>("");

  const calculatePercentages = () => {
    setError("");
    const calculations: CalculationResult[] = [];

    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);
    const percent = parseFloat(percentage);

    try {
      // What is X% of Y?
      if (!isNaN(percent) && !isNaN(num1)) {
        const result = (percent / 100) * num1;
        calculations.push({
          type: "Percentage of Number",
          result: result,
          formula: `${percent}% of ${num1} = (${percent} ÷ 100) × ${num1}`,
          explanation: `${percent}% of ${num1} equals ${result.toFixed(2)}`,
        });
      }

      // X is what percent of Y?
      if (!isNaN(num1) && !isNaN(num2) && num2 !== 0) {
        const result = (num1 / num2) * 100;
        calculations.push({
          type: "Percentage Ratio",
          result: result,
          formula: `${num1} is ${result.toFixed(2)}% of ${num2}`,
          explanation: `${num1} represents ${result.toFixed(2)}% of ${num2}`,
        });
      }

      // Percentage increase/decrease
      if (!isNaN(num1) && !isNaN(num2) && num1 !== 0) {
        const change = num2 - num1;
        const percentChange = (change / num1) * 100;
        const isIncrease = percentChange > 0;

        calculations.push({
          type: isIncrease ? "Percentage Increase" : "Percentage Decrease",
          result: Math.abs(percentChange),
          formula: `((${num2} - ${num1}) ÷ ${num1}) × 100`,
          explanation: `${
            isIncrease ? "Increase" : "Decrease"
          } from ${num1} to ${num2} is ${Math.abs(percentChange).toFixed(2)}%`,
        });
      }

      // Add/Subtract percentage from number
      if (!isNaN(num1) && !isNaN(percent)) {
        const increase = num1 + (num1 * percent) / 100;
        const decrease = num1 - (num1 * percent) / 100;

        calculations.push({
          type: "Add Percentage",
          result: increase,
          formula: `${num1} + (${num1} × ${percent}%) = ${num1} + ${(
            (num1 * percent) /
            100
          ).toFixed(2)}`,
          explanation: `${num1} increased by ${percent}% equals ${increase.toFixed(
            2
          )}`,
        });

        calculations.push({
          type: "Subtract Percentage",
          result: decrease,
          formula: `${num1} - (${num1} × ${percent}%) = ${num1} - ${(
            (num1 * percent) /
            100
          ).toFixed(2)}`,
          explanation: `${num1} decreased by ${percent}% equals ${decrease.toFixed(
            2
          )}`,
        });
      }

      if (calculations.length === 0) {
        setError("Please enter valid numbers to perform calculations");
      } else {
        setResults(calculations);
      }
    } catch (err) {
      setError("Invalid input. Please enter valid numbers.");
    }
  };

  const clearAll = () => {
    setValue1("");
    setValue2("");
    setPercentage("");
    setResults([]);
    setError("");
  };

  const commonPercentages = [5, 10, 15, 20, 25, 30, 50, 75];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Percentage Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Calculate percentages, tips, discounts, and percentage changes with
          ease
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Enter Values
              </Typography>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Number 1"
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  placeholder="Enter first number"
                  sx={{
                    mb: 2,
                    "& input[type=number]": {
                      "-moz-appearance": "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Number 2 (optional)"
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  placeholder="Enter second number"
                  sx={{
                    mb: 2,
                    "& input[type=number]": {
                      "-moz-appearance": "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Percentage"
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="Enter percentage"
                  InputProps={{
                    endAdornment: <Typography>%</Typography>,
                  }}
                  sx={{
                    "& input[type=number]": {
                      "-moz-appearance": "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Quick Percentages:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {commonPercentages.map((percent) => (
                    <Chip
                      key={percent}
                      label={`${percent}%`}
                      onClick={() => setPercentage(percent.toString())}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<CalculateIcon />}
                  onClick={calculatePercentages}
                  fullWidth
                >
                  Calculate
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<ClearIcon />}
                  onClick={clearAll}
                >
                  Clear
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Results
              </Typography>

              {results.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    Enter values and click Calculate to see results
                  </Typography>
                </Box>
              ) : (
                <Box>
                  {results.map((result, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Paper
                        sx={{
                          p: 3,
                          bgcolor: "info.dark",
                          color: "primary.contrastText",
                        }}
                      >
                        <Typography variant="h6" gutterBottom>
                          {result.type}
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {result.result.toFixed(2)}
                          {result.type.includes("Percentage") &&
                          !result.type.includes("of Number")
                            ? "%"
                            : ""}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ opacity: 0.9, mb: 1 }}
                        >
                          {result.explanation}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Formula: {result.formula}
                        </Typography>
                      </Paper>
                      {index < results.length - 1 && <Divider sx={{ my: 2 }} />}
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AdSense Ad */}
      <AdSense adSlot="3047962369" />

      {/* Usage Examples */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            How to Use
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary" gutterBottom>
                Calculate X% of Y
              </Typography>
              <Typography variant="body2">
                Enter the number in "Number 1" and percentage in "Percentage"
                field. Example: 20% of 150 = 30
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary" gutterBottom>
                Find Percentage Ratio
              </Typography>
              <Typography variant="body2">
                Enter both numbers to find what percentage the first is of the
                second. Example: 25 is 50% of 50
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="primary" gutterBottom>
                Percentage Change
              </Typography>
              <Typography variant="body2">
                Enter original value in "Number 1" and new value in "Number 2".
                Example: From 100 to 120 is a 20% increase
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* AdSense Ad */}
      <AdSense adSlot="1925476988" />
    </Container>
  );
}
