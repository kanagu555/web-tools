/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
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
  const isProductionEnv = import.meta.env.PROD;

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
    const parsed = parseFloat(num);
    if (Number.isInteger(parsed)) {
      return parsed.toString();
    }
    return parsed.toString();
  };

  const calculateResult = (eq: string): string => {
    try {
      const result = Function('"use strict";return (' + eq + ")")();
      return formatNumber(result.toString());
    } catch (error) {
      return `Error ${error}`;
    }
  };

  const handleClick = (value: string) => {
    switch (value) {
      case "C":
        setDisplay("0");
        setEquation("");
        setIsNewNumber(true);
        setLastOperation("");
        break;

      case "=":
        if (equation) {
          try {
            const currentNumber = display;
            const result = calculateResult(equation);
            setDisplay(result);
            setEquation(result);

            if (lastOperation && isNewNumber === false) {
              setLastNumber(currentNumber);
            }

            setIsNewNumber(true);
          } catch (error) {
            setDisplay("Error");
            setIsNewNumber(true);
          }
        }
        break;

      case "DEL":
        if (display === "Error") {
          setDisplay("0");
          setEquation("");
          setIsNewNumber(true);
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
        break;

      case ".":
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
          setLastOperation(value);

          if (equation === "" && ["+", "*", "/"].includes(value)) {
            setEquation("0" + value);
          } else if (isOperator(equation.slice(-1))) {
            setEquation(equation.slice(0, -1) + value);
          } else {
            setEquation(equation + value);
          }

          setIsNewNumber(true);
        } else if (value === "(" || value === ")") {
          if (isNewNumber || display === "0") {
            setEquation(equation + value);
          } else {
            setEquation(equation + value);
            setIsNewNumber(true);
            setDisplay(value);
          }
        } else {
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
            } else if (display !== "0") {
              setDisplay(display + value);
              setEquation(equation + value);
            }
          }
        }
    }
  };

  const getButtonLabel = (btn: string) => {
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
      case "(":
        return "Open parenthesis";
      case ")":
        return "Close parenthesis";
      case ".":
        return "Decimal point";
      default:
        return `Number ${btn}`;
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
          content="online calculator, basic calculator, arithmetic calculator, math calculator, free calculator, web calculator, simple calculator, scientific calculator, financial calculator, graphing calculator"
        />
        <meta
          property="og:title"
          content="Online Calculator | Free Basic Calculator Tool"
        />
        <meta
          property="og:description"
          content="Free online calculator for basic arithmetic operations. Perform addition, subtraction, multiplication, and division with this easy-to-use calculator tool."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/calculator"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Online Calculator | Free Basic Calculator Tool"
        />
        <meta
          name="twitter:description"
          content="Free online calculator for basic arithmetic operations. Perform addition, subtraction, multiplication, and division with this easy-to-use calculator tool."
        />
        <link rel="canonical" href="https://www.kodekit.in/tools/calculator" />
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
          aria-label="Calculator interface"
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
            aria-live="polite"
            aria-atomic="true"
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ wordBreak: "break-all", minHeight: "1.5rem" }}
              id="equation-display"
              aria-label="Current equation"
            >
              {equation !== display ? equation : ""}
            </Typography>
            <Typography
              variant="h4"
              component="div"
              sx={{ wordBreak: "break-all" }}
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
            {buttons.map((btn) => (
              <Grid item xs={3} key={btn} role="gridcell">
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
                  aria-label={getButtonLabel(btn)}
                  aria-controls="result-display equation-display"
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>
      {isProductionEnv && <AdSense adSlot="6613251015" />}

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
          <li>Simple and intuitive interface with full keyboard support</li>
          <li>
            Support for basic arithmetic operations (addition, subtraction,
            multiplication, division)
          </li>
          <li>Parentheses for complex expressions and order of operations</li>
          <li>Clear and delete functions for easy correction</li>
          <li>Responsive design that works on all devices</li>
          <li>Accessible interface with screen reader support</li>
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
          delete the last character with the "DEL" button. The calculator also
          supports keyboard input for faster calculations.
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
          sign-ups. It's also accessible to users with disabilities, supporting
          screen readers and keyboard navigation.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Advanced Calculator Functions
        </Typography>
        <Typography paragraph>
          While this calculator focuses on basic arithmetic operations, we're
          continuously improving it to include more advanced functions like
          square roots, percentages, and memory functions. Check back regularly
          for updates and new features that will make your calculations even
          easier.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Calculator;
