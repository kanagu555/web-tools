import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const Calculator = () => {
  const theme = useTheme();
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [lastOperation, setLastOperation] = useState("");
  const [, setLastNumber] = useState("");

  const buttons = [
    "C",
    "(",
    ")",
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
    "0",
    ".",
    "=",
    "DEL",
  ];

  const isOperator = (value: string) => {
    return ["+", "-", "*", "/"].includes(value);
  };

  const formatNumber = (num: string) => {
    // Handle potential floating point precision issues
    const parsed = parseFloat(num);
    if (Number.isInteger(parsed)) {
      return parsed.toString();
    }

    // Limit decimal places to avoid very long numbers
    return parsed.toString();
  };

  const calculateResult = (eq: string): string => {
    try {
      // Use Function instead of eval for slightly better security
      // Still not recommended for production without proper validation
      const result = Function('"use strict";return (' + eq + ")")();
      return formatNumber(result.toString());
    } catch (error) {
      return `Error ${error}`;
    }
  };

  const handleClick = (value: string) => {
    switch (value) {
      case "C":
        // Clear all state
        setDisplay("0");
        setEquation("");
        setIsNewNumber(true);
        setLastOperation("");
        break;

      case "=":
        if (equation) {
          try {
            // Store the last number for repeat operations
            const currentNumber = display;

            // Calculate the result
            const result = calculateResult(equation);

            // Update display and equation
            setDisplay(result);
            setEquation(result);

            // Store the operation for repeat equals
            if (lastOperation && isNewNumber === false) {
              setLastNumber(currentNumber);
            }

            setIsNewNumber(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            setDisplay("Error");
            setIsNewNumber(true);
          }
        }
        break;

      case "DEL":
        if (display === "Error") {
          // Clear error state
          setDisplay("0");
          setEquation("");
          setIsNewNumber(true);
        } else if (display.length > 1) {
          // Remove last character
          const newDisplay = display.slice(0, -1);
          setDisplay(newDisplay);

          // Also update the equation if we're editing the current number
          if (!isNewNumber) {
            const eqWithoutLastNum = equation.slice(
              0,
              equation.length - display.length
            );
            setEquation(eqWithoutLastNum + newDisplay);
          }
        } else {
          // If only one character left, reset to 0
          setDisplay("0");

          // If this is the only number in the equation, clear equation too
          if (!isNewNumber) {
            const eqWithoutLastNum = equation.slice(
              0,
              equation.length - display.length
            );
            setEquation(eqWithoutLastNum + "0");
          }

          setIsNewNumber(true);
        }
        break;

      case ".":
        // Handle decimal point
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
        if (isOperator(value)) {
          // Handle operators
          setLastOperation(value);

          // If we're starting with an operator, add a 0 first
          if (equation === "" && ["+", "*", "/"].includes(value)) {
            setEquation("0" + value);
          } else if (isOperator(equation.slice(-1))) {
            // Replace the last operator if there's already one
            setEquation(equation.slice(0, -1) + value);
          } else {
            // Add the operator to the equation
            setEquation(equation + value);
          }

          setIsNewNumber(true);
        } else if (value === "(" || value === ")") {
          // Handle parentheses
          if (isNewNumber || display === "0") {
            setEquation(equation + value);
          } else {
            // If we're in the middle of entering a number, add the parenthesis to the equation
            setEquation(equation + value);
            setIsNewNumber(true);
            setDisplay(value);
          }
        } else {
          // Handle numbers
          if (isNewNumber) {
            setDisplay(value);

            // If the last character is an operator or parenthesis, append the number
            if (
              equation === "" ||
              isOperator(equation.slice(-1)) ||
              ["(", ")"].includes(equation.slice(-1))
            ) {
              setEquation(equation + value);
            } else {
              // Otherwise replace the current number
              setEquation(value);
            }

            setIsNewNumber(false);
          } else {
            // Append to the current number
            // Don't allow leading zeros
            if (display === "0" && value !== "0") {
              setDisplay(value);

              // Update the equation by replacing the last character
              setEquation(equation.slice(0, -1) + value);
            } else if (display !== "0") {
              setDisplay(display + value);
              setEquation(equation + value);
            }
          }
        }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Online Calculator | Free Basic Calculator Tool</title>
        <meta
          name="description"
          content="Free online calculator for basic arithmetic operations. Perform addition, subtraction, multiplication, and division with this easy-to-use calculator tool."
        />
        <meta
          name="keywords"
          content="online calculator, basic calculator, arithmetic calculator, math calculator, free calculator, web calculator, simple calculator"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Perform basic mathematical calculations with ease.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 400,
            mx: "auto",
          }}
        >
          <Box
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 2,
              backgroundColor: theme.palette.background.default,
              textAlign: "right",
              minHeight: 60,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ wordBreak: "break-all", minHeight: "1.5rem" }}
            >
              {equation !== display ? equation : ""}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ wordBreak: "break-all" }}
            >
              {display}
            </Typography>
          </Box>

          <Grid container spacing={1}>
            {buttons.map((btn) => (
              <Grid item xs={3} key={btn}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleClick(btn)}
                  sx={{
                    height: 60,
                    fontSize: "1.25rem",
                    backgroundColor:
                      btn === "="
                        ? theme.palette.primary.main
                        : ["C", "DEL"].includes(btn)
                        ? theme.palette.error.main
                        : ["+", "-", "*", "/", "(", ")"].includes(btn)
                        ? theme.palette.secondary.main
                        : theme.palette.background.default,
                    "&:hover": {
                      backgroundColor:
                        btn === "="
                          ? theme.palette.primary.dark
                          : ["C", "DEL"].includes(btn)
                          ? theme.palette.error.dark
                          : ["+", "-", "*", "/", "(", ")"].includes(btn)
                          ? theme.palette.secondary.dark
                          : theme.palette.action.hover,
                    },
                  }}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>

      <AdSense adSlot="6613251015" />

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
      >
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          About Our Online Calculator
        </Typography>
        <Typography paragraph>
          Our free online calculator provides a simple and convenient way to
          perform basic arithmetic calculations directly in your browser.
          Whether you need to quickly add numbers, subtract values, multiply
          figures, or divide quantities, this calculator tool has you covered.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Features of Our Calculator
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>Simple and intuitive interface</li>
          <li>
            Support for basic arithmetic operations (addition, subtraction,
            multiplication, division)
          </li>
          <li>Parentheses for complex expressions</li>
          <li>Clear and delete functions for easy correction</li>
          <li>Responsive design that works on all devices</li>
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          How to Use the Calculator
        </Typography>
        <Typography paragraph>
          Using our calculator is straightforward. Simply click the number
          buttons to input values, use the operation buttons (+, -, *, /) to
          select your desired calculation, and press the equals (=) button to
          see the result. You can clear the display with the "C" button or
          delete the last character with the "DEL" button.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Why Use an Online Calculator?
        </Typography>
        <Typography paragraph>
          Online calculators offer several advantages over physical calculators
          or smartphone apps. They're always accessible from any device with an
          internet connection, require no installation, and provide a clean,
          easy-to-use interface optimized for quick calculations. Our calculator
          is completely free to use and doesn't require any downloads or
          sign-ups.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Calculator;
