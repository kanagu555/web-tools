"use client";

import { useState, useEffect, useCallback } from "react";
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
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  Plus,
  Minus,
  Copy,
  Shuffle,
  Trash2,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

const MatrixCalculator = () => {
  const theme = useTheme();
  const { trackTool } = useAnalytics();
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [operation, setOperation] = useState("add");
  const [matrix1, setMatrix1] = useState<string[][]>(
    Array(2)
      .fill(0)
      .map(() => Array(2).fill(""))
  );
  const [matrix2, setMatrix2] = useState<string[][]>(
    Array(2)
      .fill(0)
      .map(() => Array(2).fill(""))
  );
  const [result, setResult] = useState<number[][]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  // Special case for multiplication - second matrix columns can be different
  const [matrix2Cols, setMatrix2Cols] = useState(cols);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  // Reset matrices when dimensions change
  useEffect(() => {
    setMatrix1(
      Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(""))
    );
    setMatrix2(
      Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(""))
    );
    setResult([]);
  }, [rows, cols]);

  useEffect(() => {
    if (operation === "multiply") {
      // For multiplication, matrix2 rows must equal matrix1 columns
      const newMatrix2 = Array(cols)
        .fill(0)
        .map(() => Array(matrix2Cols).fill(""));
      setMatrix2(newMatrix2);
    } else {
      // For addition and subtraction, matrices must have same dimensions
      setMatrix2Cols(cols);
      setMatrix2(
        Array(rows)
          .fill(0)
          .map(() => Array(cols).fill(""))
      );
    }
    setResult([]);
  }, [operation, cols, rows, matrix2Cols]);

  const handleMatrixChange = useCallback(
    (matrixNumber: number, row: number, col: number, value: string) => {
      // Only allow numbers and decimal points
      if (value !== "" && !/^-?\d*\.?\d*$/.test(value)) {
        return;
      }

      if (matrixNumber === 1) {
        const newMatrix = [...matrix1];
        newMatrix[row] = [...newMatrix[row]];
        newMatrix[row][col] = value;
        setMatrix1(newMatrix);
      } else {
        const newMatrix = [...matrix2];
        newMatrix[row] = [...newMatrix[row]];
        newMatrix[row][col] = value;
        setMatrix2(newMatrix);
      }
    },
    [matrix1, matrix2]
  );

  const validateMatrices = useCallback(() => {
    // Check if matrices have empty cells
    const hasEmptyCell1 = matrix1.some((row) =>
      row.some((cell) => cell === "")
    );
    const hasEmptyCell2 = matrix2.some((row) =>
      row.some((cell) => cell === "")
    );

    if (hasEmptyCell1 || hasEmptyCell2) {
      showSnackbar("All cells must be filled with numbers", "error");
      return false;
    }

    if (operation === "multiply") {
      // For multiplication, matrix1 columns must equal matrix2 rows
      if (matrix1[0].length !== matrix2.length) {
        showSnackbar("Invalid dimensions for multiplication", "error");
        return false;
      }
    } else {
      // For addition and subtraction, matrices must have same dimensions
      if (
        matrix1.length !== matrix2.length ||
        matrix1[0].length !== matrix2[0].length
      ) {
        showSnackbar("Matrices must have the same dimensions", "error");
        return false;
      }
    }

    return true;
  }, [matrix1, matrix2, operation, showSnackbar]);

  const transposeMatrix = useCallback((matrix: number[][]): number[][] => {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const result = Array(cols)
      .fill(0)
      .map(() => Array(rows).fill(0));

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        result[j][i] = matrix[i][j];
      }
    }

    return result;
  }, []);

  const calculateDeterminant = useCallback((matrix: number[][]): number => {
    const n = matrix.length;

    if (n === 1) {
      return matrix[0][0];
    }

    if (n === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }

    let det = 0;
    for (let j = 0; j < n; j++) {
      det +=
        Math.pow(-1, j) *
        matrix[0][j] *
        calculateDeterminant(getSubmatrix(matrix, 0, j));
    }

    return det;
  }, []);

  const getSubmatrix = useCallback(
    (matrix: number[][], row: number, col: number): number[][] => {
      const n = matrix.length;
      const submatrix = Array(n - 1)
        .fill(0)
        .map(() => Array(n - 1).fill(0));

      let r = 0;
      for (let i = 0; i < n; i++) {
        if (i === row) continue;

        let c = 0;
        for (let j = 0; j < n; j++) {
          if (j === col) continue;

          submatrix[r][c] = matrix[i][j];
          c++;
        }

        r++;
      }

      return submatrix;
    },
    []
  );

  const calculateInverse = useCallback(
    (matrix: number[][]): number[][] => {
      const n = matrix.length;

      // Check if matrix is invertible
      const det = calculateDeterminant(matrix);
      if (Math.abs(det) < 1e-10) {
        throw new Error("Matrix is not invertible (determinant is zero)");
      }

      // For 1x1 matrix
      if (n === 1) {
        return [[1 / matrix[0][0]]];
      }

      // Calculate adjugate matrix
      const adjugate = Array(n)
        .fill(0)
        .map(() => Array(n).fill(0));
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const cofactor =
            Math.pow(-1, i + j) *
            calculateDeterminant(getSubmatrix(matrix, i, j));
          // Note: adjugate is the transpose of the cofactor matrix
          adjugate[j][i] = cofactor;
        }
      }

      // Divide adjugate by determinant
      return adjugate.map((row) => row.map((val) => val / det));
    },
    [calculateDeterminant, getSubmatrix]
  );

  const calculateResult = useCallback(() => {
    if (!validateMatrices()) {
      return;
    }

    const m1 = matrix1.map((row) => row.map((val) => parseFloat(val) || 0));
    const m2 = matrix2.map((row) => row.map((val) => parseFloat(val) || 0));
    let resultMatrix: number[][] = [];

    try {
      switch (operation) {
        case "add":
          resultMatrix = m1.map((row, i) =>
            row.map((val, j) => val + m2[i][j])
          );
          break;
        case "subtract":
          resultMatrix = m1.map((row, i) =>
            row.map((val, j) => val - m2[i][j])
          );
          break;
        case "multiply":
          resultMatrix = Array(m1.length)
            .fill(0)
            .map(() => Array(m2[0].length).fill(0));
          for (let i = 0; i < m1.length; i++) {
            for (let j = 0; j < m2[0].length; j++) {
              resultMatrix[i][j] = 0;
              for (let k = 0; k < m2.length; k++) {
                resultMatrix[i][j] += m1[i][k] * m2[k][j];
              }
            }
          }
          break;
        case "transpose1":
          resultMatrix = transposeMatrix(m1);
          break;
        case "transpose2":
          resultMatrix = transposeMatrix(m2);
          break;
        case "determinant1": {
          if (m1.length !== m1[0].length) {
            throw new Error("Matrix must be square to calculate determinant");
          }
          const det1 = calculateDeterminant(m1);
          resultMatrix = [[det1]];
          break;
        }
        case "determinant2": {
          if (m2.length !== m2[0].length) {
            throw new Error("Matrix must be square to calculate determinant");
          }
          const det2 = calculateDeterminant(m2);
          resultMatrix = [[det2]];
          break;
        }
        case "inverse1":
          if (m1.length !== m1[0].length) {
            throw new Error("Matrix must be square to calculate inverse");
          }
          resultMatrix = calculateInverse(m1);
          break;
        case "inverse2":
          if (m2.length !== m2[0].length) {
            throw new Error("Matrix must be square to calculate inverse");
          }
          resultMatrix = calculateInverse(m2);
          break;
      }

      setResult(resultMatrix);
      showSnackbar("Calculation completed successfully", "success");
      trackTool("matrix-calculator", "calculate");
    } catch (err) {
      showSnackbar(
        err instanceof Error ? err.message : "Calculation error",
        "error"
      );
    }
  }, [
    validateMatrices,
    matrix1,
    matrix2,
    operation,
    transposeMatrix,
    calculateDeterminant,
    calculateInverse,
    showSnackbar,
    trackTool,
  ]);

  const renderMatrix = useCallback(
    (matrix: string[][], matrixNumber: number, matrixCols: number = cols) => (
      <Grid container spacing={1}>
        {matrix.map((_, i) => (
          <Grid item xs={12} key={i}>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {Array.from({ length: matrixCols }).map((_, j) => (
                <TextField
                  key={j}
                  size="small"
                  value={
                    matrix[i] && matrix[i][j] !== undefined ? matrix[i][j] : ""
                  }
                  onChange={(e) =>
                    handleMatrixChange(matrixNumber, i, j, e.target.value)
                  }
                  sx={{ width: 70 }}
                  inputProps={{
                    style: { textAlign: "center" },
                    inputMode: "numeric",
                    "aria-label": `Matrix ${matrixNumber} cell ${i + 1},${
                      j + 1
                    }`,
                  }}
                />
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>
    ),
    [cols, handleMatrixChange]
  );

  const handleCopyResult = useCallback(async () => {
    if (result.length === 0) return;

    // Format the result as a tab-separated string
    const formattedResult = result
      .map((row) => row.map((val) => val.toFixed(2)).join("\t"))
      .join("\n");

    try {
      await navigator.clipboard.writeText(formattedResult);
      showSnackbar("Result copied to clipboard", "success");
      trackTool("matrix-calculator", "copy");
    } catch (err) {
      showSnackbar("Failed to copy to clipboard", "error");
    }
  }, [result, showSnackbar, trackTool]);

  const handleClear = useCallback(() => {
    setMatrix1(
      Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(""))
    );
    setMatrix2(
      Array(operation === "multiply" ? cols : rows)
        .fill(0)
        .map(() =>
          Array(operation === "multiply" ? matrix2Cols : cols).fill("")
        )
    );
    setResult([]);
    showSnackbar("Matrices cleared", "info");
    trackTool("matrix-calculator", "clear");
  }, [rows, cols, operation, matrix2Cols, showSnackbar, trackTool]);

  const handleRandomFill = useCallback(
    (matrixNumber: number) => {
      if (matrixNumber === 1) {
        const randomMatrix = Array(rows)
          .fill(0)
          .map(() =>
            Array(cols)
              .fill(0)
              .map(() => Math.floor(Math.random() * 10).toString())
          );
        setMatrix1(randomMatrix);
        showSnackbar("Matrix A filled with random values", "success");
      } else {
        const r = operation === "multiply" ? cols : rows;
        const c = operation === "multiply" ? matrix2Cols : cols;
        const randomMatrix = Array(r)
          .fill(0)
          .map(() =>
            Array(c)
              .fill(0)
              .map(() => Math.floor(Math.random() * 10).toString())
          );
        setMatrix2(randomMatrix);
        showSnackbar("Matrix B filled with random values", "success");
      }
      trackTool("matrix-calculator", "random-fill");
    },
    [rows, cols, operation, matrix2Cols, showSnackbar, trackTool]
  );

  const handleSwapMatrices = useCallback(() => {
    if (operation === "multiply") {
      showSnackbar("Cannot swap matrices during multiplication", "error");
      return;
    }

    const temp = [...matrix1];
    setMatrix1([...matrix2]);
    setMatrix2(temp);
    showSnackbar("Matrices swapped", "success");
    trackTool("matrix-calculator", "swap");
  }, [operation, matrix1, matrix2, showSnackbar, trackTool]);

  const handleIncreaseSize = useCallback(() => {
    if (rows < 10 && cols < 10) {
      setRows((prev) => prev + 1);
      setCols((prev) => prev + 1);
      showSnackbar("Matrix size increased", "info");
    }
  }, [rows, cols, showSnackbar]);

  const handleDecreaseSize = useCallback(() => {
    if (rows > 1 && cols > 1) {
      setRows((prev) => prev - 1);
      setCols((prev) => prev - 1);
      showSnackbar("Matrix size decreased", "info");
    }
  }, [rows, cols, showSnackbar]);

  const needsSquareMatrix = [
    "determinant1",
    "determinant2",
    "inverse1",
    "inverse2",
  ].includes(operation);

  const isSingleMatrixOperation = [
    "transpose1",
    "transpose2",
    "determinant1",
    "determinant2",
    "inverse1",
    "inverse2",
  ].includes(operation);

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
          Matrix Calculator
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
          Perform matrix operations including addition, subtraction,
          multiplication, transpose, determinant, and inverse calculations.
        </Typography>

        <Card
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3,
                    alignItems: "center",
                  }}
                >
                  {needsSquareMatrix ? (
                    <FormControl>
                      <TextField
                        label="Matrix Size"
                        type="number"
                        value={rows}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0 && value <= 10) {
                            setRows(value);
                            setCols(value);
                          }
                        }}
                        sx={{ width: 120 }}
                        InputProps={{
                          inputProps: { min: 1, max: 10 },
                        }}
                        aria-label="Matrix size for square operations"
                      />
                    </FormControl>
                  ) : (
                    <>
                      <FormControl>
                        <TextField
                          label="Rows"
                          type="number"
                          value={rows}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 0 && value <= 10) setRows(value);
                          }}
                          sx={{ width: 100 }}
                          InputProps={{
                            inputProps: { min: 1, max: 10 },
                          }}
                          aria-label="Number of rows"
                        />
                      </FormControl>
                      <FormControl>
                        <TextField
                          label="Columns"
                          type="number"
                          value={cols}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (value > 0 && value <= 10) setCols(value);
                          }}
                          sx={{ width: 100 }}
                          InputProps={{
                            inputProps: { min: 1, max: 10 },
                          }}
                          aria-label="Number of columns"
                        />
                      </FormControl>
                    </>
                  )}

                  <Tooltip title="Increase matrix size">
                    <IconButton
                      onClick={handleIncreaseSize}
                      color="primary"
                      disabled={rows >= 10 || cols >= 10}
                      aria-label="Increase matrix size"
                    >
                      <Plus size={20} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Decrease matrix size">
                    <IconButton
                      onClick={handleDecreaseSize}
                      color="primary"
                      disabled={rows <= 1 || cols <= 1}
                      aria-label="Decrease matrix size"
                    >
                      <Minus size={20} />
                    </IconButton>
                  </Tooltip>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="operation-label">Operation</InputLabel>
                    <Select
                      value={operation}
                      label="Operation"
                      onChange={(e) => setOperation(e.target.value)}
                      aria-labelledby="operation-label"
                    >
                      <MenuItem value="add">Addition (A + B)</MenuItem>
                      <MenuItem value="subtract">Subtraction (A - B)</MenuItem>
                      <MenuItem value="multiply">
                        Multiplication (A × B)
                      </MenuItem>
                      <MenuItem value="transpose1">Transpose Matrix A</MenuItem>
                      <MenuItem value="transpose2">Transpose Matrix B</MenuItem>
                      <MenuItem value="determinant1">Determinant of A</MenuItem>
                      <MenuItem value="determinant2">Determinant of B</MenuItem>
                      <MenuItem value="inverse1">Inverse of A</MenuItem>
                      <MenuItem value="inverse2">Inverse of B</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {operation === "multiply" && !isSingleMatrixOperation && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      For matrix multiplication, the number of columns in Matrix
                      A must equal the number of rows in Matrix B.
                    </Typography>
                    <FormControl>
                      <TextField
                        label="Columns in Matrix B"
                        type="number"
                        value={matrix2Cols}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0 && value <= 10) setMatrix2Cols(value);
                        }}
                        sx={{ width: 150 }}
                        InputProps={{
                          inputProps: { min: 1, max: 10 },
                        }}
                        aria-label="Number of columns in Matrix B"
                      />
                    </FormControl>
                  </Box>
                )}

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography
                      variant="h3"
                      component="h3"
                      gutterBottom
                      sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                    >
                      Matrix A
                    </Typography>
                    {renderMatrix(matrix1, 1)}
                    <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleRandomFill(1)}
                        startIcon={<Shuffle size={16} />}
                        aria-label="Fill Matrix A with random values"
                      >
                        Random Fill
                      </Button>
                    </Box>
                  </Grid>
                  {!isSingleMatrixOperation && (
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="h3"
                        component="h3"
                        gutterBottom
                        sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                      >
                        Matrix B
                      </Typography>
                      {renderMatrix(
                        matrix2,
                        2,
                        operation === "multiply" ? matrix2Cols : cols
                      )}
                      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleRandomFill(2)}
                          startIcon={<Shuffle size={16} />}
                          aria-label="Fill Matrix B with random values"
                        >
                          Random Fill
                        </Button>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <Button
                    variant="contained"
                    onClick={calculateResult}
                    aria-label="Calculate matrix operation"
                  >
                    Calculate
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClear}
                    startIcon={<Trash2 size={16} />}
                    aria-label="Clear all matrices"
                  >
                    Clear
                  </Button>
                  {!isSingleMatrixOperation && operation !== "multiply" && (
                    <Tooltip title="Swap Matrices A and B">
                      <IconButton
                        onClick={handleSwapMatrices}
                        color="primary"
                        aria-label="Swap matrices A and B"
                      >
                        <ArrowLeftRight size={20} />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {result.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h3"
                        component="h3"
                        sx={{ fontSize: "1.1rem", fontWeight: 600 }}
                      >
                        Result
                      </Typography>
                      <Tooltip title="Copy result">
                        <IconButton
                          onClick={handleCopyResult}
                          aria-label="Copy result to clipboard"
                          color="primary"
                        >
                          <Copy size={16} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        p: 2,
                        backgroundColor: theme.palette.background.paper,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                      role="region"
                      aria-label="Matrix calculation result"
                    >
                      {result.map((row, i) => (
                        <Box
                          key={i}
                          sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}
                        >
                          {row.map((val, j) => (
                            <TextField
                              key={j}
                              value={val.toFixed(2)}
                              InputProps={{ readOnly: true }}
                              size="small"
                              sx={{ width: 80 }}
                              aria-label={`Result cell ${i + 1},${
                                j + 1
                              }: ${val.toFixed(2)}`}
                            />
                          ))}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* AdSense Ad */}
        <AdSense adSlot="3047962369" />

        {/* SEO Content Section */}
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
          aria-labelledby="matrix-calculator-guide"
        >
          <Typography
            id="matrix-calculator-guide"
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            Complete Guide to Matrix Calculator
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
                Supported Operations
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>
                    <strong>Addition:</strong> Add corresponding elements of two
                    matrices
                  </li>
                  <li>
                    <strong>Subtraction:</strong> Subtract corresponding
                    elements
                  </li>
                  <li>
                    <strong>Multiplication:</strong> Matrix multiplication (A ×
                    B)
                  </li>
                  <li>
                    <strong>Transpose:</strong> Flip matrix over its diagonal
                  </li>
                  <li>
                    <strong>Determinant:</strong> Calculate determinant for
                    square matrices
                  </li>
                  <li>
                    <strong>Inverse:</strong> Find the inverse matrix (if it
                    exists)
                  </li>
                </ul>
              </Typography>

              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.1rem", mt: 3 }}
              >
                Matrix Requirements
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>
                    <strong>Addition/Subtraction:</strong> Matrices must have
                    the same dimensions
                  </li>
                  <li>
                    <strong>Multiplication:</strong> Columns in Matrix A = Rows
                    in Matrix B
                  </li>
                  <li>
                    <strong>Determinant/Inverse:</strong> Matrix must be square
                    (n×n)
                  </li>
                  <li>
                    <strong>Size Limit:</strong> Maximum 10×10 matrices
                    supported
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
                How to Use
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                1. Set the matrix dimensions using the rows and columns controls
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                2. Choose your desired operation from the dropdown menu
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                3. Fill in the matrix values by clicking on each cell
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                4. Click "Calculate" to perform the operation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                5. Use "Random Fill" to populate matrices with sample data
              </Typography>

              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.1rem", mt: 2 }}
              >
                Features
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>Support for decimal numbers and negative values</li>
                  <li>Copy results to clipboard for easy sharing</li>
                  <li>Random matrix generation for testing</li>
                  <li>Matrix swapping for quick comparisons</li>
                  <li>Error handling and validation</li>
                  <li>Responsive design for all devices</li>
                </ul>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default MatrixCalculator;
