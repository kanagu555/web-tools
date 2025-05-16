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
} from "@mui/material";
import { motion } from "framer-motion";
import { ContentCopy, Refresh, Help } from "@mui/icons-material";

const EquationSolver = () => {
  const theme = useTheme();
  const [equation, setEquation] = useState("");
  const [solution, setSolution] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [equationType, setEquationType] = useState("linear");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setSolution("");
      setSteps([]);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(solution);
      setSnackbarMessage("Solution copied to clipboard");
      setSnackbarOpen(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setSnackbarMessage("Failed to copy to clipboard");
      setSnackbarOpen(true);
    }
  };

  const handleClear = () => {
    setEquation("");
    setSolution("");
    setError("");
    setSteps([]);
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
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
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Equation Type</InputLabel>
                <Select
                  value={equationType}
                  onChange={(e) => setEquationType(e.target.value as string)}
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
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" onClick={solveEquation} fullWidth>
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
                >
                  <Typography variant="h5" align="center">
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
                >
                  <Typography variant="h6" gutterBottom>
                    Steps:
                  </Typography>
                  <List>
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
              >
                Copy Solution
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleClear}
                fullWidth
              >
                Clear
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Tooltip title={getHelpText()}>
                <IconButton
                  color="primary"
                  onClick={() => setShowHelp(!showHelp)}
                  aria-label="help"
                >
                  <Help />
                </IconButton>
              </Tooltip>
            </Grid>

            {showHelp && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                  }}
                >
                  {getHelpText()}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default EquationSolver;
