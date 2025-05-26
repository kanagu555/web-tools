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
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  SwapHoriz,
  AddCircleOutline,
  RemoveCircleOutline,
} from "@mui/icons-material";
import AdSense from "../components/AdSense";

const MatrixCalculator = () => {
  const theme = useTheme();
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [operation, setOperation] = useState("add");
  const [matrix1, setMatrix1] = useState<string[][]>(
    Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(""))
  );
  const [matrix2, setMatrix2] = useState<string[][]>(
    Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(""))
  );
  const [result, setResult] = useState<number[][]>([]);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

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
    setError("");
  }, [rows, cols]);

  // Special case for multiplication - second matrix columns can be different
  const [matrix2Cols, setMatrix2Cols] = useState(cols);

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

  const handleMatrixChange = (
    matrixNumber: number,
    row: number,
    col: number,
    value: string
  ) => {
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
  };

  const validateMatrices = () => {
    // Check if matrices have empty cells
    const hasEmptyCell1 = matrix1.some((row) =>
      row.some((cell) => cell === "")
    );
    const hasEmptyCell2 = matrix2.some((row) =>
      row.some((cell) => cell === "")
    );

    if (hasEmptyCell1 || hasEmptyCell2) {
      setError("All cells must be filled with numbers");
      setSnackbarMessage("All cells must be filled with numbers");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return false;
    }

    if (operation === "multiply") {
      // For multiplication, matrix1 columns must equal matrix2 rows
      if (matrix1[0].length !== matrix2.length) {
        setError(
          "For multiplication, the number of columns in the first matrix must equal the number of rows in the second matrix"
        );
        setSnackbarMessage("Invalid dimensions for multiplication");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return false;
      }
    } else {
      // For addition and subtraction, matrices must have same dimensions
      if (
        matrix1.length !== matrix2.length ||
        matrix1[0].length !== matrix2[0].length
      ) {
        setError(
          "For addition and subtraction, matrices must have the same dimensions"
        );
        setSnackbarMessage("Matrices must have the same dimensions");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return false;
      }
    }

    setError("");
    return true;
  };

  const calculateResult = () => {
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
        case "determinant1":
          if (m1.length !== m1[0].length) {
            throw new Error("Matrix must be square to calculate determinant");
          }
          const det1 = calculateDeterminant(m1);
          resultMatrix = [[det1]];
          break;
        case "determinant2":
          if (m2.length !== m2[0].length) {
            throw new Error("Matrix must be square to calculate determinant");
          }
          const det2 = calculateDeterminant(m2);
          resultMatrix = [[det2]];
          break;
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
      setSnackbarMessage("Calculation completed successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during calculation"
      );
      setSnackbarMessage(
        err instanceof Error ? err.message : "Calculation error"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const transposeMatrix = (matrix: number[][]): number[][] => {
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
  };

  const calculateDeterminant = (matrix: number[][]): number => {
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
  };

  const getSubmatrix = (
    matrix: number[][],
    row: number,
    col: number
  ): number[][] => {
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
  };

  const calculateInverse = (matrix: number[][]): number[][] => {
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
  };

  const renderMatrix = (
    matrix: any[][],
    matrixNumber: number,
    matrixCols: number = cols
  ) => (
    <Grid container spacing={1}>
      {matrix.map((row, i) => (
        <Grid item xs={12} key={i}>
          <Box sx={{ display: "flex", gap: 1 }}>
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
                  pattern: "[0-9]*",
                }}
              />
            ))}
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const handleCopyResult = () => {
    if (result.length === 0) return;

    // Format the result as a tab-separated string
    const formattedResult = result
      .map((row) => row.map((val) => val.toFixed(2)).join("\t"))
      .join("\n");

    navigator.clipboard.writeText(formattedResult);
    setSnackbarMessage("Result copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleClear = () => {
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
    setError("");
    setSnackbarMessage("Matrices cleared");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleRandomFill = (matrixNumber: number) => {
    if (matrixNumber === 1) {
      const randomMatrix = Array(rows)
        .fill(0)
        .map(() =>
          Array(cols)
            .fill(0)
            .map(() => Math.floor(Math.random() * 10).toString())
        );
      setMatrix1(randomMatrix);
      setSnackbarMessage("Matrix 1 filled with random values");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
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
      setSnackbarMessage("Matrix 2 filled with random values");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const handleSwapMatrices = () => {
    if (operation === "multiply") {
      // For multiplication, we need to check if dimensions are compatible for swapping
      if (
        matrix1.length === matrix2[0].length &&
        matrix1[0].length === matrix2.length
      ) {
        setMatrix1(
          transposeMatrix(
            matrix2.map((row) => row.map((val) => parseFloat(val) || 0))
          ).map((row) => row.map((val) => val.toString()))
        );
        setMatrix2(
          transposeMatrix(
            matrix1.map((row) => row.map((val) => parseFloat(val) || 0))
          ).map((row) => row.map((val) => val.toString()))
        );
        setRows(cols);
        setCols(rows);
        setMatrix2Cols(matrix1.length);
        setSnackbarMessage("Matrices swapped");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Cannot swap matrices with these dimensions");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } else {
      // For addition and subtraction, matrices have same dimensions
      const temp = [...matrix1];
      setMatrix1([...matrix2]);
      setMatrix2(temp);
      setSnackbarMessage("Matrices swapped");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const handleIncreaseSize = () => {
    setRows((prev) => prev + 1);
    setCols((prev) => prev + 1);
    setSnackbarMessage("Matrix size increased");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleDecreaseSize = () => {
    if (rows > 1 && cols > 1) {
      setRows((prev) => prev - 1);
      setCols((prev) => prev - 1);
      setSnackbarMessage("Matrix size decreased");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
    }
  };

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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Matrix Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Perform matrix operations and calculations with ease.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
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
                  <TextField
                    label="Matrix Size"
                    type="number"
                    value={rows}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) {
                        setRows(value);
                        setCols(value);
                      }
                    }}
                    sx={{ width: 120 }}
                    InputProps={{
                      inputProps: { min: 1, max: 10 },
                    }}
                  />
                ) : (
                  <>
                    <TextField
                      label="Rows"
                      type="number"
                      value={rows}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) setRows(value);
                      }}
                      sx={{ width: 100 }}
                      InputProps={{
                        inputProps: { min: 1, max: 10 },
                      }}
                    />
                    <TextField
                      label="Columns"
                      type="number"
                      value={cols}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) setCols(value);
                      }}
                      sx={{ width: 100 }}
                      InputProps={{
                        inputProps: { min: 1, max: 10 },
                      }}
                    />
                  </>
                )}

                <Tooltip title="Increase size">
                  <IconButton onClick={handleIncreaseSize} color="primary">
                    <AddCircleOutline />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Decrease size">
                  <IconButton
                    onClick={handleDecreaseSize}
                    color="primary"
                    disabled={rows <= 1 || cols <= 1}
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                </Tooltip>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Operation</InputLabel>
                  <Select
                    value={operation}
                    label="Operation"
                    onChange={(e) => setOperation(e.target.value)}
                  >
                    <MenuItem value="add">Addition (A + B)</MenuItem>
                    <MenuItem value="subtract">Subtraction (A - B)</MenuItem>
                    <MenuItem value="multiply">Multiplication (A × B)</MenuItem>
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
                    sx={{ mb: 3 }}
                  >
                    For matrix multiplication, the number of columns in Matrix A
                    must equal the number of rows in Matrix B. The number of
                    columns in Matrix B can be different.
                  </Typography>
                  <TextField
                    label="Columns in Matrix B"
                    type="number"
                    value={matrix2Cols}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0) setMatrix2Cols(value);
                    }}
                    sx={{ width: 150 }}
                    InputProps={{
                      inputProps: { min: 1, max: 10 },
                    }}
                  />
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Matrix 1
                  </Typography>
                  {renderMatrix(matrix1, 1)}
                </Grid>
                {!isSingleMatrixOperation && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Matrix 2
                    </Typography>
                    {renderMatrix(
                      matrix2,
                      2,
                      operation === "multiply" ? matrix2Cols : cols
                    )}
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={calculateResult}
                    sx={{ mr: 2 }}
                  >
                    Calculate
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={handleClear}
                    sx={{ mr: 2 }}
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={() => handleRandomFill(1)}
                    sx={{ mr: 2 }}
                  >
                    Random Fill Matrix 1
                  </Button>
                </Grid>
                {!isSingleMatrixOperation && (
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => handleRandomFill(2)}
                    >
                      Random Fill Matrix 2
                    </Button>
                  </Grid>
                )}
                {operation !== "multiply" && (
                  <Grid item>
                    <Tooltip title="Swap Matrices">
                      <IconButton onClick={handleSwapMatrices} color="primary">
                        <SwapHoriz />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>

              {result.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Result
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {result.map((row, i) => (
                      <Box key={i} sx={{ display: "flex", gap: 1 }}>
                        {row.map((val, j) => (
                          <TextField
                            key={j}
                            value={val.toFixed(2)}
                            InputProps={{ readOnly: true }}
                            size="small"
                            sx={{ width: 80 }}
                          />
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
        <AdSense adSlot="6613251015" />
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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
    </Container>
  );
};

export default MatrixCalculator;
