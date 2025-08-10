"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  useTheme,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Copy, History } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";

const Calculator = () => {
  const theme = useTheme();
  const { trackTool } = useAnalytics();
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [lastOperation, setLastOperation] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [hasError, setHasError] = useState(false);

  const buttons = [
    "C",
    "±",
    "%",
    "/",
    "7",
    "8",
    "9",
    "*",
    "4",
    "5",
    "6",
    "-",
    "1",
    "2",
    "3",
    "+",
    "(",
    "0",
    ")",
    ".",
    "DEL",
    "=",
  ];

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }, []);

  const isOperator = useCallback((value: string) => {
    return ["+", "-", "*", "/", "%"].includes(value);
  }, []);

  const formatNumber = useCallback((num: string) => {
    const parsed = parseFloat(num);
    if (isNaN(parsed)) return "0";

    // Handle very large or very small numbers
    if (Math.abs(parsed) > 1e15 || (Math.abs(parsed) < 1e-10 && parsed !== 0)) {
      return parsed.toExponential(6);
    }

    // Format with appropriate decimal places
    if (Number.isInteger(parsed)) {
      return parsed.toString();
    }

    // Limit decimal places to prevent overflow
    const formatted = parsed.toFixed(10);
    return parseFloat(formatted).toString();
  }, []);

  const calculateResult = useCallback(
    (eq: string): string => {
      try {
        // Replace percentage calculations
        let processedEq = eq.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

        // Validate the expression for security
        if (!/^[0-9+\-*/.() ]+$/.test(processedEq)) {
          throw new Error("Invalid characters in expression");
        }

        const result = Function('"use strict";return (' + processedEq + ")")();

        if (!isFinite(result)) {
          throw new Error("Result is not finite");
        }

        return formatNumber(result.toString());
      } catch (error) {
        return "Error";
      }
    },
    [formatNumber]
  );

  const addToHistory = useCallback((calculation: string) => {
    setHistory((prev) => {
      const newHistory = [calculation, ...prev.slice(0, 9)]; // Keep last 10 calculations
      return newHistory;
    });
  }, []);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        showSnackbar("Copied to clipboard");
        trackTool("calculator", "copy");
      } catch (err) {
        showSnackbar("Failed to copy to clipboard");
      }
    },
    [showSnackbar, trackTool]
  );

  const handleClick = useCallback(
    (value: string) => {
      setHasError(false);

      switch (value) {
        case "C":
          setDisplay("0");
          setEquation("");
          setIsNewNumber(true);
          setLastOperation("");
          setHasError(false);
          trackTool("calculator", "clear");
          break;

        case "=":
          if (equation && !hasError) {
            try {
              const result = calculateResult(equation);
              if (result === "Error") {
                setDisplay("Error");
                setHasError(true);
                showSnackbar("Invalid calculation");
              } else {
                const calculation = `${equation} = ${result}`;
                addToHistory(calculation);
                setDisplay(result);
                setEquation(result);
                setIsNewNumber(true);
                trackTool("calculator", "calculate");
              }
            } catch (error) {
              setDisplay("Error");
              setHasError(true);
              showSnackbar("Calculation error");
            }
          }
          break;

        case "DEL":
          if (hasError || display === "Error") {
            setDisplay("0");
            setEquation("");
            setIsNewNumber(true);
            setHasError(false);
          } else if (display.length > 1) {
            const newDisplay = display.slice(0, -1);
            setDisplay(newDisplay);

            if (!isNewNumber) {
              const eqWithoutLastNum = equation.slice(
                0,
                equation.length - display.length
              );
              setEquation(eqWithoutLastNum + newDisplay);
            }
          } else {
            setDisplay("0");
            if (!isNewNumber) {
              const eqWithoutLastNum = equation.slice(
                0,
                equation.length - display.length
              );
              setEquation(eqWithoutLastNum + "0");
            }
            setIsNewNumber(true);
          }
          trackTool("calculator", "delete");
          break;

        case "±":
          if (display !== "0" && !hasError) {
            const newDisplay = display.startsWith("-")
              ? display.slice(1)
              : "-" + display;
            setDisplay(newDisplay);

            if (!isNewNumber) {
              const eqWithoutLastNum = equation.slice(
                0,
                equation.length - display.length
              );
              setEquation(eqWithoutLastNum + newDisplay);
            }
          }
          break;

        case "%":
          if (!hasError && !isNewNumber) {
            setEquation(equation + "%");
            setIsNewNumber(true);
            trackTool("calculator", "percentage");
          }
          break;

        case ".":
          if (hasError) break;
          if (isNewNumber) {
            setDisplay("0.");
            setEquation(equation + "0.");
            setIsNewNumber(false);
          } else if (!display.includes(".")) {
            setDisplay(display + ".");
            setEquation(equation + ".");
          }
          break;

        default:
          if (hasError) break;

          if (isOperator(value)) {
            setLastOperation(value);

            if (equation === "" && ["+", "*", "/", "%"].includes(value)) {
              setEquation("0" + value);
            } else if (isOperator(equation.slice(-1))) {
              setEquation(equation.slice(0, -1) + value);
            } else {
              setEquation(equation + value);
            }

            setIsNewNumber(true);
            trackTool("calculator", "operation");
          } else if (value === "(" || value === ")") {
            if (isNewNumber || display === "0") {
              setEquation(equation + value);
              setDisplay(value);
            } else {
              setEquation(equation + value);
              setDisplay(value);
            }
            setIsNewNumber(true);
          } else {
            // Number input
            if (isNewNumber) {
              setDisplay(value);

              if (
                equation === "" ||
                isOperator(equation.slice(-1)) ||
                ["(", ")"].includes(equation.slice(-1))
              ) {
                setEquation(equation + value);
              } else {
                setEquation(value);
              }

              setIsNewNumber(false);
            } else {
              if (display === "0" && value !== "0") {
                setDisplay(value);
                setEquation(equation.slice(0, -1) + value);
              } else if (display !== "0" || value === "0") {
                const newDisplay = display + value;
                // Prevent display from becoming too long
                if (newDisplay.length <= 15) {
                  setDisplay(newDisplay);
                  setEquation(equation + value);
                }
              }
            }
            trackTool("calculator", "input");
          }
      }
    },
    [
      equation,
      display,
      isNewNumber,
      hasError,
      lastOperation,
      isOperator,
      calculateResult,
      addToHistory,
      showSnackbar,
      trackTool,
    ]
  );

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;

      if (/[0-9]/.test(key)) {
        handleClick(key);
      } else if (["+", "-", "*", "/", "%"].includes(key)) {
        handleClick(key);
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        handleClick("=");
      } else if (key === "Escape" || key === "c" || key === "C") {
        handleClick("C");
      } else if (key === "Backspace") {
        event.preventDefault();
        handleClick("DEL");
      } else if (key === ".") {
        handleClick(".");
      } else if (key === "(" || key === ")") {
        handleClick(key);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleClick]);

  const getButtonLabel = useCallback((btn: string) => {
    switch (btn) {
      case "C":
        return "Clear calculator";
      case "DEL":
        return "Delete last character";
      case "=":
        return "Calculate result";
      case "+":
        return "Addition";
      case "-":
        return "Subtraction";
      case "*":
        return "Multiplication";
      case "/":
        return "Division";
      case "%":
        return "Percentage";
      case "±":
        return "Change sign";
      case "(":
        return "Open parenthesis";
      case ")":
        return "Close parenthesis";
      case ".":
        return "Decimal point";
      default:
        return `Number ${btn}`;
    }
  }, []);

  const getButtonColor = useCallback(
    (btn: string) => {
      if (btn === "=") {
        return {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          "&:hover": { backgroundColor: theme.palette.primary.dark },
        };
      }
      if (["C", "DEL"].includes(btn)) {
        return {
          backgroundColor: theme.palette.error.main,
          color: theme.palette.error.contrastText,
          "&:hover": { backgroundColor: theme.palette.error.dark },
        };
      }
      if (["+", "-", "*", "/", "%", "±"].includes(btn)) {
        return {
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          "&:hover": { backgroundColor: theme.palette.secondary.dark },
        };
      }
      return {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        "&:hover": { backgroundColor: theme.palette.action.hover },
      };
    },
    [theme]
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
          Online Calculator
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
          Perform mathematical calculations with our free online calculator.
          Supports basic arithmetic, percentages, and keyboard input.
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6} lg={5}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h3"
                    fontWeight={600}
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Calculator
                  </Typography>
                  <Box>
                    <Tooltip title="Copy result to clipboard">
                      <IconButton
                        onClick={() => copyToClipboard(display)}
                        disabled={display === "0" || hasError}
                        aria-label="Copy result to clipboard"
                        sx={{
                          color: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: `${theme.palette.primary.main}10`,
                          },
                        }}
                      >
                        <Copy size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Show calculation history">
                      <IconButton
                        onClick={() => {
                          setShowHistory(!showHistory);
                          trackTool("calculator", "toggle-history");
                        }}
                        aria-label="Toggle calculation history"
                        sx={{
                          color: showHistory
                            ? theme.palette.secondary.main
                            : theme.palette.text.secondary,
                          "&:hover": {
                            backgroundColor: `${theme.palette.secondary.main}10`,
                          },
                        }}
                      >
                        <History size={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.paper,
                    textAlign: "right",
                    minHeight: 80,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    border: hasError
                      ? `2px solid ${theme.palette.error.main}`
                      : `1px solid ${theme.palette.divider}`,
                    boxShadow: `0 2px 8px ${theme.palette.primary.main}10`,
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      wordBreak: "break-all",
                      minHeight: "1.5rem",
                      fontSize: "0.875rem",
                    }}
                    id="equation-display"
                    aria-label="Current equation"
                  >
                    {equation !== display && equation ? equation : ""}
                  </Typography>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      wordBreak: "break-all",
                      fontSize: { xs: "1.5rem", sm: "2rem" },
                      color: hasError ? theme.palette.error.main : "inherit",
                      fontWeight: 600,
                    }}
                    id="result-display"
                    aria-label="Calculator result"
                    role="status"
                  >
                    {display}
                  </Typography>
                </Box>

                <Grid
                  container
                  spacing={1}
                  role="grid"
                  aria-label="Calculator buttons"
                >
                  {buttons.map((btn, index) => {
                    const isWideButton = btn === "=" || btn === "DEL";
                    const gridSize = isWideButton ? 6 : 3;

                    return (
                      <Grid
                        item
                        xs={gridSize}
                        key={`${btn}-${index}`}
                        role="gridcell"
                      >
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleClick(btn)}
                          sx={{
                            height: 60,
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            borderRadius: 2,
                            boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                            transition: "all 0.2s ease",
                            ...getButtonColor(btn),
                            "&:hover": {
                              ...getButtonColor(btn)["&:hover"],
                              transform: "translateY(-1px)",
                              boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
                            },
                          }}
                          aria-label={getButtonLabel(btn)}
                          aria-controls="result-display equation-display"
                        >
                          {btn}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "center", mt: 2 }}
                >
                  💡 Tip: You can use your keyboard for input
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* History Panel */}
          {showHistory && (
            <Grid item xs={12} md={6} lg={4}>
              <Card
                elevation={0}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  maxHeight: 500,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}08 0%, ${theme.palette.info.main}08 100%)`,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h3"
                    component="h3"
                    fontWeight={600}
                    gutterBottom
                    sx={{ fontSize: "1.1rem" }}
                  >
                    Calculation History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ maxHeight: 350, overflowY: "auto" }}>
                    {history.length > 0 ? (
                      history.map((calc, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            mb: 1,
                            borderRadius: 2,
                            backgroundColor: theme.palette.background.paper,
                            cursor: "pointer",
                            border: `1px solid ${theme.palette.divider}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                              transform: "translateX(4px)",
                              boxShadow: `0 2px 8px ${theme.palette.primary.main}20`,
                            },
                          }}
                          onClick={() => {
                            const result = calc.split(" = ")[1];
                            if (result) {
                              setDisplay(result);
                              setEquation(result);
                              setIsNewNumber(true);
                              trackTool("calculator", "use-history");
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`Use calculation result: ${calc}`}
                        >
                          <Typography
                            variant="body2"
                            sx={{ 
                              fontFamily: "monospace",
                              fontSize: "0.9rem",
                            }}
                          >
                            {calc}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 4,
                          color: theme.palette.text.secondary,
                        }}
                      >
                        <Typography variant="body2">
                          No calculations yet
                        </Typography>
                        <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
                          Start calculating to see your history here
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {history.length > 0 && (
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => {
                        setHistory([]);
                        trackTool("calculator", "clear-history");
                      }}
                      sx={{ 
                        mt: 2,
                        borderRadius: 2,
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                        "&:hover": {
                          backgroundColor: `${theme.palette.error.main}10`,
                          borderColor: theme.palette.error.dark,
                        },
                      }}
                      aria-label="Clear calculation history"
                    >
                      Clear History
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Enhanced SEO-friendly content section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          component="section"
          aria-labelledby="calculator-guide"
        >
          <Typography
            id="calculator-guide"
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            Complete Guide to Our Online Calculator
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.1rem" }}
              >
                Calculator Features
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>
                    Basic arithmetic operations (addition, subtraction,
                    multiplication, division)
                  </li>
                  <li>Percentage calculations with the % button</li>
                  <li>
                    Sign change functionality (±) for positive/negative numbers
                  </li>
                  <li>Parentheses support for complex expressions</li>
                  <li>Calculation history to track your work</li>
                  <li>Copy results to clipboard with one click</li>
                  <li>Full keyboard support for faster input</li>
                  <li>Error handling and input validation</li>
                  <li>Responsive design for all screen sizes</li>
                </ul>
              </Typography>

              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.1rem", mt: 3 }}
              >
                Keyboard Shortcuts
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>
                    <strong>Numbers (0-9):</strong> Input digits
                  </li>
                  <li>
                    <strong>+, -, *, /:</strong> Arithmetic operations
                  </li>
                  <li>
                    <strong>Enter or =:</strong> Calculate result
                  </li>
                  <li>
                    <strong>Escape or C:</strong> Clear calculator
                  </li>
                  <li>
                    <strong>Backspace:</strong> Delete last character
                  </li>
                  <li>
                    <strong>. (period):</strong> Decimal point
                  </li>
                  <li>
                    <strong>( and ):</strong> Parentheses
                  </li>
                  <li>
                    <strong>%:</strong> Percentage calculation
                  </li>
                </ul>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.1rem" }}
              >
                How to Use the Calculator
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our online calculator is designed for ease of use. Click the
                number buttons to input values, use operation buttons for
                calculations, and press equals (=) to get results. The calculator
                displays both your current equation and the result, making it easy
                to track your calculations.
              </Typography>

              <Typography variant="body2" color="text.secondary" paragraph>
                For percentage calculations, enter a number and press the %
                button. For example, "50%" will calculate 50/100 = 0.5. Use the ±
                button to change the sign of the current number.
              </Typography>

              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.1rem", mt: 2 }}
              >
                Advanced Features
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>
                    <strong>History:</strong> View and reuse previous calculations
                  </li>
                  <li>
                    <strong>Copy Function:</strong> Copy results directly to
                    clipboard
                  </li>
                  <li>
                    <strong>Error Handling:</strong> Clear error messages and
                    invalid inputs
                  </li>
                  <li>
                    <strong>Parentheses:</strong> Support for complex mathematical
                    expressions
                  </li>
                  <li>
                    <strong>Precision:</strong> Handles large numbers and decimal
                    calculations
                  </li>
                </ul>
              </Typography>

              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.1rem", mt: 2 }}
              >
                Perfect For
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>Students working on math homework</li>
                  <li>Professionals doing quick calculations</li>
                  <li>Shoppers calculating discounts and taxes</li>
                  <li>Anyone needing a reliable calculator tool</li>
                </ul>
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.1rem" }}
          >
            Why Choose Our Online Calculator?
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Our calculator combines simplicity with powerful features. Unlike
            basic calculators, it offers calculation history, keyboard support,
            and advanced error handling. It's completely free, requires no
            installation, and works on any device with a web browser. The
            responsive design ensures it works perfectly on desktop computers,
            tablets, and smartphones.
          </Typography>

          <Typography variant="body2" color="text.secondary" paragraph>
            Whether you're a student, professional, or just need to do some quick
            math, our calculator provides the reliability and features you need.
            The clean interface focuses on functionality while remaining
            accessible to users of all technical levels.
          </Typography>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default Calculator;