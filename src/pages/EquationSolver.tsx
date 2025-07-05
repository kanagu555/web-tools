import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { ContentCopy, Refresh, Help } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const EquationSolver = () => {
  const theme = useTheme();
  const [equation, setEquation] = useState("");
  const [solution, setSolution] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [equationType, setEquationType] = useState("linear");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const solveLinearEquation = (eq: string) => {
    try {
      const parts = eq.split("=");
      if (parts.length !== 2) throw new Error("Invalid equation format");

      let leftSide = parts[0].trim();
      let rightSide = parts[1].trim();

      setSteps([`Original equation: ${eq}`]);

      // Move all terms with x to the left side
      if (rightSide.includes("x")) {
        const rightTerms = rightSide.split(/([+-])/);
        let newRightSide = "";
        const termsMovedToLeft = [];

        for (let i = 0; i < rightTerms.length; i++) {
          const term = rightTerms[i];
          if (term.includes("x")) {
            // Get the sign for moving to the left side (opposite)
            const sign = i > 0 && rightTerms[i - 1] === "-" ? "+" : "-";
            termsMovedToLeft.push(`${sign}${term}`);
            // Skip this term in the new right side
          } else {
            newRightSide += term;
          }
        }

        if (termsMovedToLeft.length > 0) {
          leftSide += termsMovedToLeft.join("");
          rightSide = newRightSide || "0";
          setSteps((prev) => [
            ...prev,
            `Move terms with x to the left: ${leftSide} = ${rightSide}`,
          ]);
        }
      }

      // Move all numbers to the right side
      const leftTerms = leftSide.split(/([+-])/);
      let newLeftSide = "";
      const newRightSide = rightSide;
      const termsMovedToRight = [];

      for (let i = 0; i < leftTerms.length; i++) {
        const term = leftTerms[i];
        if (
          term !== "" &&
          !term.includes("x") &&
          !isNaN(parseFloat(term)) &&
          term !== "+" &&
          term !== "-"
        ) {
          // Get the sign for moving to the right side (opposite)
          const sign = i > 0 && leftTerms[i - 1] === "-" ? "+" : "-";
          termsMovedToRight.push(`${sign}${term}`);
        } else {
          newLeftSide += term;
        }
      }

      if (termsMovedToRight.length > 0) {
        leftSide = newLeftSide || "0";
        rightSide = `${newRightSide}${termsMovedToRight.join("")}`;
        setSteps((prev) => [
          ...prev,
          `Move constant terms to the right: ${leftSide} = ${rightSide}`,
        ]);
      }

      // Simplify the right side
      const rightValue = eval(rightSide);
      setSteps((prev) => [
        ...prev,
        `Simplify the right side: ${leftSide} = ${rightValue}`,
      ]);

      // Get coefficient of x
      let coefficient = 1;
      if (leftSide === "x") {
        coefficient = 1;
      } else if (leftSide === "-x") {
        coefficient = -1;
      } else {
        // Replace x with 1x for easier parsing
        const normalizedLeftSide = leftSide.replace(/([+-]?)x/g, "$11x");

        // Extract the coefficient
        const match = normalizedLeftSide.match(/([+-]?\d*\.?\d*)x/);
        if (match && match[1]) {
          coefficient =
            match[1] === "+" || match[1] === "-" || match[1] === ""
              ? match[1] === "-"
                ? -1
                : 1
              : parseFloat(match[1]);
        }
      }

      setSteps((prev) => [
        ...prev,
        `Identify the coefficient of x: ${coefficient}x = ${rightValue}`,
      ]);

      // Solve for x
      const x = rightValue / coefficient;
      setSteps((prev) => [
        ...prev,
        `Divide both sides by ${coefficient}: x = ${x}`,
      ]);

      return `x = ${x}`;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      throw new Error("Invalid linear equation format");
    }
  };

  const solveQuadraticEquation = (eq: string) => {
    try {
      // Normalize the equation to standard form: ax² + bx + c = 0
      const normalized = eq.replace(/\s/g, "");

      // Make sure we have one side equal to zero
      if (!normalized.includes("=")) {
        throw new Error("Equation must contain an equals sign");
      }

      const parts = normalized.split("=");
      if (parts.length !== 2) {
        throw new Error("Invalid equation format");
      }

      let leftSide = parts[0];
      let rightSide = parts[1];

      // Move everything to the left side
      if (rightSide !== "0") {
        // Change signs when moving terms
        const rightTerms = rightSide.replace(/([+-])/g, (match) =>
          match === "+" ? "-" : "+"
        );
        leftSide =
          leftSide +
          (rightTerms.startsWith("+") || rightTerms.startsWith("-")
            ? ""
            : "+") +
          rightTerms;
        rightSide = "0";
      }

      setSteps([`Original equation: ${eq}`, `Standard form: ${leftSide} = 0`]);

      // Replace x² with x^2 for easier parsing
      leftSide = leftSide.replace(/x²/g, "x^2");

      // Extract coefficients a, b, c
      let a = 0,
        b = 0,
        c = 0;

      // Match a coefficient (for x^2 term)
      const aMatch = leftSide.match(/([+-]?\d*\.?\d*)x\^2/);
      if (aMatch) {
        a =
          aMatch[1] === "+" || aMatch[1] === "-" || aMatch[1] === ""
            ? aMatch[1] === "-"
              ? -1
              : 1
            : parseFloat(aMatch[1]);
      }

      // Match b coefficient (for x term)
      const bMatch = leftSide.match(/([+-]?\d*\.?\d*)x(?!\^)/);
      if (bMatch) {
        b =
          bMatch[1] === "+" || bMatch[1] === "-" || bMatch[1] === ""
            ? bMatch[1] === "-"
              ? -1
              : 1
            : parseFloat(bMatch[1]);
      }

      // Match c coefficient (constant term)
      const cMatch = leftSide.match(/([+-]?\d+\.?\d*)(?![x\d])/);
      if (cMatch) {
        c = parseFloat(cMatch[1]);
      }

      setSteps((prev) => [
        ...prev,
        `Identify coefficients: a=${a}, b=${b}, c=${c}`,
      ]);

      // Check if it's actually a quadratic equation
      if (a === 0) {
        throw new Error("Not a quadratic equation (a=0)");
      }

      // Calculate discriminant
      const discriminant = b * b - 4 * a * c;
      setSteps((prev) => [
        ...prev,
        `Calculate discriminant: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`,
      ]);

      // Calculate solutions based on discriminant
      if (discriminant > 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        setSteps((prev) => [
          ...prev,
          `Discriminant > 0, two real solutions:`,
          `x₁ = (-b + √Δ) / 2a = (${-b} + √${discriminant}) / (2 × ${a}) = ${x1}`,
          `x₂ = (-b - √Δ) / 2a = (${-b} - √${discriminant}) / (2 × ${a}) = ${x2}`,
        ]);
        return `x₁ = ${x1}, x₂ = ${x2}`;
      } else if (discriminant === 0) {
        const x = -b / (2 * a);
        setSteps((prev) => [
          ...prev,
          `Discriminant = 0, one real solution:`,
          `x = -b / 2a = ${-b} / (2 × ${a}) = ${x}`,
        ]);
        return `x = ${x}`;
      } else {
        const realPart = -b / (2 * a);
        const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
        setSteps((prev) => [
          ...prev,
          `Discriminant < 0, two complex solutions:`,
          `x₁ = ${realPart} + ${imaginaryPart}i`,
          `x₂ = ${realPart} - ${imaginaryPart}i`,
        ]);
        return `x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`;
      }
    } catch (err) {
      throw new Error(
        err instanceof Error ? err.message : "Invalid quadratic equation format"
      );
    }
  };

  const solveSystemOfEquations = (eq: string) => {
    try {
      // Parse two equations separated by comma, semicolon, or newline
      const equations = eq
        .split(/[,;\n]/)
        .map((e) => e.trim())
        .filter((e) => e);

      if (equations.length !== 2) {
        throw new Error(
          "Please enter exactly two equations separated by comma, semicolon, or newline"
        );
      }

      setSteps([`System of equations:`, ...equations]);

      // Parse each equation into the form ax + by = c
      const parsedEquations = equations.map((equation) => {
        const sides = equation.split("=");
        if (sides.length !== 2) {
          throw new Error(`Invalid equation format: ${equation}`);
        }

        let leftSide = sides[0].trim();
        let rightSide = sides[1].trim();

        // Move everything to the left side
        if (rightSide !== "0") {
          // Change signs when moving terms
          const rightTerms = rightSide.replace(/([+-])/g, (match) =>
            match === "+" ? "-" : "+"
          );
          leftSide =
            leftSide +
            (rightTerms.startsWith("+") || rightTerms.startsWith("-")
              ? ""
              : "+") +
            rightTerms;
          rightSide = "0";
        }

        // Extract coefficients for x and y
        let a = 0,
          b = 0,
          c = 0;

        // Replace standalone x and y with 1x and 1y for easier parsing
        leftSide = leftSide
          .replace(/([+-]?)x/g, "$11x")
          .replace(/([+-]?)y/g, "$11y");

        // Match a coefficient (for x term)
        const aMatch = leftSide.match(/([+-]?\d*\.?\d*)x/);
        if (aMatch) {
          a =
            aMatch[1] === "+" || aMatch[1] === "-" || aMatch[1] === ""
              ? aMatch[1] === "-"
                ? -1
                : 1
              : parseFloat(aMatch[1]);
        }

        // Match b coefficient (for y term)
        const bMatch = leftSide.match(/([+-]?\d*\.?\d*)y/);
        if (bMatch) {
          b =
            bMatch[1] === "+" || bMatch[1] === "-" || bMatch[1] === ""
              ? bMatch[1] === "-"
                ? -1
                : 1
              : parseFloat(bMatch[1]);
        }

        // Extract constant terms
        const terms = leftSide.split(/([+-])/);
        for (let i = 0; i < terms.length; i++) {
          const term = terms[i];
          if (
            term !== "" &&
            !term.includes("x") &&
            !term.includes("y") &&
            !isNaN(parseFloat(term)) &&
            term !== "+" &&
            term !== "-"
          ) {
            const sign = i > 0 && terms[i - 1] === "-" ? -1 : 1;
            c -= sign * parseFloat(term); // Note: we're moving to the right side, so negate
          }
        }

        return { a, b, c };
      });

      const [eq1, eq2] = parsedEquations;

      setSteps((prev) => [
        ...prev,
        `Equation 1: ${eq1.a}x + ${eq1.b}y = ${eq1.c}`,
        `Equation 2: ${eq2.a}x + ${eq2.b}y = ${eq2.c}`,
      ]);

      // Solve using Cramer's rule
      const determinant = eq1.a * eq2.b - eq1.b * eq2.a;

      if (Math.abs(determinant) < 1e-10) {
        // Check if the system has no solution or infinite solutions
        const ratio1 =
          eq1.a !== 0 ? eq1.c / eq1.a : eq1.b !== 0 ? eq1.c / eq1.b : 0;
        const ratio2 =
          eq2.a !== 0 ? eq2.c / eq2.a : eq2.b !== 0 ? eq2.c / eq2.b : 0;

        if (Math.abs(ratio1 - ratio2) < 1e-10) {
          return "Infinite solutions (dependent equations)";
        } else {
          return "No solution (inconsistent equations)";
        }
      }

      const x = (eq1.c * eq2.b - eq1.b * eq2.c) / determinant;
      const y = (eq1.a * eq2.c - eq1.c * eq2.a) / determinant;

      setSteps((prev) => [
        ...prev,
        `Using Cramer's rule:`,
        `Determinant = ${eq1.a} × ${eq2.b} - ${eq1.b} × ${eq2.a} = ${determinant}`,
        `x = (${eq1.c} × ${eq2.b} - ${eq1.b} × ${eq2.c}) / ${determinant} = ${x}`,
        `y = (${eq1.a} × ${eq2.c} - ${eq1.c} × ${eq2.a}) / ${determinant} = ${y}`,
      ]);

      return `x = ${x}, y = ${y}`;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "Invalid system of equations format"
      );
    }
  };

  const solveEquation = () => {
    try {
      setSteps([]);

      if (!equation.trim()) {
        setError("Please enter an equation");
        setSnackbarMessage("Please enter an equation");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      let result = "";

      switch (equationType) {
        case "linear":
          if (!equation.includes("x")) {
            throw new Error("Linear equation must contain variable x");
          }
          result = solveLinearEquation(equation);
          break;
        case "quadratic":
          result = solveQuadraticEquation(equation);
          break;
        case "system":
          result = solveSystemOfEquations(equation);
          break;
        default:
          throw new Error("Unknown equation type");
      }

      setSolution(result);
      setError("");
      setSnackbarMessage("Equation solved successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSolution("");
      setSteps([]);
      setSnackbarMessage(
        err instanceof Error ? err.message : "An error occurred"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(solution);
      setSnackbarMessage("Solution copied to clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSnackbarMessage("Failed to copy to clipboard");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClear = () => {
    setEquation("");
    setSolution("");
    setError("");
    setSteps([]);
    setSnackbarMessage("Input cleared");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getPlaceholderText = () => {
    switch (equationType) {
      case "linear":
        return "Enter linear equation (e.g., 2x + 3 = 7)";
      case "quadratic":
        return "Enter quadratic equation (e.g., x² + 5x + 6 = 0)";
      case "system":
        return "Enter two equations (e.g., 2x + y = 5, 3x - y = 1)";
      default:
        return "Enter equation";
    }
  };

  const getHelpText = () => {
    switch (equationType) {
      case "linear":
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Linear Equation Help:
            </Typography>
            <Typography variant="body2" paragraph>
              Enter a linear equation in the form: ax + b = c
            </Typography>
            <Typography variant="body2" paragraph>
              Examples:
              <ul>
                <li>2x + 3 = 7</li>
                <li>x/2 - 5 = 10</li>
                <li>3x = 15</li>
              </ul>
            </Typography>
          </>
        );
      case "quadratic":
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Quadratic Equation Help:
            </Typography>
            <Typography variant="body2" paragraph>
              Enter a quadratic equation in the form: ax² + bx + c = 0
            </Typography>
            <Typography variant="body2" paragraph>
              You can use x² or x^2 for the squared term.
            </Typography>
            <Typography variant="body2" paragraph>
              Examples:
              <ul>
                <li>x² + 5x + 6 = 0</li>
                <li>2x² - 3x + 1 = 0</li>
                <li>4x² = 16</li>
              </ul>
            </Typography>
          </>
        );
      case "system":
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              System of Equations Help:
            </Typography>
            <Typography variant="body2" paragraph>
              Enter two linear equations separated by a comma, semicolon, or
              newline.
            </Typography>
            <Typography variant="body2" paragraph>
              Each equation should be in the form: ax + by = c
            </Typography>
            <Typography variant="body2" paragraph>
              Examples:
              <ul>
                <li>2x + y = 5, 3x - y = 1</li>
                <li>x - 2y = 3; 4x + y = 7</li>
                <li>
                  3x + 4y = 12
                  <br />
                  5x - 2y = 8
                </li>
              </ul>
            </Typography>
          </>
        );
      default:
        return (
          <>
            <Typography variant="subtitle1" gutterBottom>
              General Equation Help:
            </Typography>
            <Typography variant="body2" paragraph>
              This equation solver supports linear, quadratic, and systems of
              linear equations.
            </Typography>
            <Typography variant="body2" paragraph>
              Choose the appropriate equation type from the dropdown menu.
            </Typography>
            <Typography variant="body2" paragraph>
              Click the help icon for more information on each type.
            </Typography>
          </>
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Equation Solver | Free Online Math Equation Calculator</title>
        <meta
          name="description"
          content="Free online equation solver with step-by-step solutions. Solve linear equations, quadratic equations, and systems of equations with our easy-to-use calculator tool."
        />
        <meta
          name="keywords"
          content="equation solver, math equation solver, linear equation calculator, quadratic equation calculator, system of equations solver, algebra calculator, step by step equation solver, math tool"
        />
        <meta
          property="og:title"
          content="Equation Solver | Free Online Math Equation Calculator"
        />
        <meta
          property="og:description"
          content="Free online equation solver with step-by-step solutions. Solve linear equations, quadratic equations, and systems of equations with our easy-to-use calculator tool."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/equation-solver"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Equation Solver | Free Online Math Equation Calculator"
        />
        <meta
          name="twitter:description"
          content="Free online equation solver with step-by-step solutions. Solve linear equations, quadratic equations, and systems of equations with our easy-to-use calculator tool."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/equation-solver"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight={700}
          id="main-heading"
        >
          Equation Solver
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Solve mathematical equations step by step.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 600,
            mx: "auto",
          }}
          aria-labelledby="main-heading"
          role="region"
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="equation-type-label">Equation Type</InputLabel>
                <Select
                  value={equationType}
                  label="Equation Type"
                  onChange={(e) => setEquationType(e.target.value as string)}
                  labelId="equation-type-label"
                  id="equation-type-select"
                  aria-label="Select equation type"
                >
                  <MenuItem value="linear">Linear Equation</MenuItem>
                  <MenuItem value="quadratic">Quadratic Equation</MenuItem>
                  <MenuItem value="system">System of Equations</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enter equation"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                error={!!error}
                helperText={
                  error || "Use 'x' for variables. Example: 2x + 3 = 7"
                }
                placeholder={getPlaceholderText()}
                id="equation-input"
                aria-label="Enter your equation"
                aria-describedby="equation-help-text"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={solveEquation}
                fullWidth
                aria-label="Solve equation"
              >
                Solve
              </Button>
            </Grid>

            {solution && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                  }}
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <Typography variant="h5" align="center" id="solution-result">
                    {solution}
                  </Typography>
                </Paper>
              </Grid>
            )}

            {steps.length > 0 && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                  }}
                  aria-labelledby="steps-heading"
                >
                  <Typography variant="h6" gutterBottom id="steps-heading">
                    Steps:
                  </Typography>
                  <List aria-label="Solution steps">
                    {steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={step} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopy}
                fullWidth
                disabled={!solution}
                aria-label="Copy solution to clipboard"
                aria-describedby={solution ? "solution-result" : undefined}
              >
                Copy Solution
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Refresh />}
                onClick={handleClear}
                disabled={!equation && !solution}
                fullWidth
                aria-label="Clear input and results"
              >
                Clear
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Tooltip
                title={getHelpText()}
                aria-label="Help information"
                describeChild
              >
                <IconButton
                  color="primary"
                  onClick={() => setShowHelp(!showHelp)}
                  aria-label="Toggle help information"
                  aria-expanded={showHelp}
                  aria-controls="help-section"
                >
                  <Help />
                </IconButton>
              </Tooltip>
            </Grid>

            {showHelp && (
              <Grid item xs={12} id="help-section">
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                  }}
                  aria-label="Help section"
                >
                  {getHelpText()}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>
        <AdSense adSlot="6613251015" />
      </motion.div>

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
        itemScope
        itemType="https://schema.org/WebApplication"
      >
        <meta itemProp="name" content="Equation Solver" />
        <meta
          itemProp="description"
          content="Free online equation solver with step-by-step solutions for linear, quadratic, and systems of equations."
        />
        <meta itemProp="applicationCategory" content="Educational" />
        <meta itemProp="operatingSystem" content="Web" />

        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          fontWeight={600}
          itemProp="headline"
        >
          About Our Equation Solver
        </Typography>
        <Typography paragraph itemProp="description">
          Our free online equation solver is a powerful mathematical tool
          designed to help students, teachers, and professionals solve various
          types of equations quickly and accurately. This calculator provides
          step-by-step solutions, making it an excellent learning resource for
          understanding the process of solving equations.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Types of Equations You Can Solve
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li itemProp="featureList">
            <strong>Linear Equations:</strong> Solve first-degree equations in
            the form ax + b = c, where a, b, and c are constants and a ≠ 0.
          </li>
          <li itemProp="featureList">
            <strong>Quadratic Equations:</strong> Find solutions for
            second-degree equations in the form ax² + bx + c = 0, where a, b,
            and c are constants and a ≠ 0.
          </li>
          <li itemProp="featureList">
            <strong>Systems of Linear Equations:</strong> Solve two linear
            equations with two variables (x and y) simultaneously.
          </li>
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          How to Use the Equation Solver
        </Typography>
        <Typography paragraph>
          Using our equation solver is simple and intuitive:
        </Typography>
        <Typography component="ol" sx={{ pl: 2 }}>
          <li>
            Select the type of equation you want to solve from the dropdown menu
            (linear, quadratic, or system of equations).
          </li>
          <li>
            Enter your equation in the input field following the format shown in
            the placeholder text.
          </li>
          <li>Click the "Solve" button to get your solution.</li>
          <li>
            Review the step-by-step solution process to understand how the
            equation was solved.
          </li>
          <li>
            Use the "Copy Solution" button to copy the result to your clipboard.
          </li>
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Educational Benefits
        </Typography>
        <Typography paragraph>
          Our equation solver is more than just a calculator—it's an educational
          tool that helps users understand the mathematical principles behind
          equation solving:
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>
            Step-by-step solutions help students learn the process of solving
            equations
          </li>
          <li>
            Clear explanations of each step reinforce mathematical concepts
          </li>
          <li>
            Practice with different equation types builds problem-solving skills
          </li>
          <li>Immediate feedback helps identify and correct mistakes</li>
          <li>
            Visual representation of the solution process enhances understanding
          </li>
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Applications in Real Life
        </Typography>
        <Typography paragraph>
          Equation solving is a fundamental skill with applications across
          numerous fields:
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>Engineering calculations and problem-solving</li>
          <li>Scientific research and data analysis</li>
          <li>Financial modeling and economic forecasting</li>
          <li>Computer programming and algorithm development</li>
          <li>Statistical analysis and probability calculations</li>
          <li>Physics simulations and theoretical modeling</li>
        </Typography>

        <Typography paragraph sx={{ mt: 2 }}>
          Whether you're a student working on algebra homework, a teacher
          preparing lesson materials, or a professional needing quick
          mathematical solutions, our equation solver provides a reliable,
          accessible, and educational tool for all your equation-solving needs.
        </Typography>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        role="alert"
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          aria-live="assertive"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EquationSolver;
