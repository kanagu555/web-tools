/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
  ContentCopy,
} from "@mui/icons-material";
import { Helmet } from "react-helmet";
import SEOHelmet from "../components/SEOHelmet";
import {
  generateToolSEO,
  generateWebAppData,
  generateHowToData,
  generateBreadcrumbData,
} from "../Utils/seoUtils";
import AdSense from "../components/AdSense";
import Breadcrumb from "../components/Breadcrumb";

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
  const [, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  // Generate SEO data
  const seoData = generateToolSEO(
    "Matrix Calculator",
    "Perform matrix operations online including addition, subtraction, multiplication, transpose, determinant, and inverse calculations. Supports matrices up to 10x10",
    "math"
  );

  const webAppData = generateWebAppData(
    "Matrix Calculator",
    "Free online matrix calculator for addition, subtraction, multiplication, transpose, determinant, and inverse. Supports matrices up to 10x10 with step-by-step calculations.",
    "math"
  );

  const howToSteps = [
    {
      name: "Set Matrix Size",
      text: "Choose the dimensions for your matrices (rows and columns)",
    },
    {
      name: "Select Operation",
      text: "Choose the matrix operation you want to perform from the dropdown menu",
    },
    {
      name: "Enter Matrix Values",
      text: "Fill in the matrix cells with your numerical values",
    },
    {
      name: "Calculate Result",
      text: "Click the Calculate button to perform the operation and view the result",
    },
  ];

  const howToData = generateHowToData("Matrix Calculator", howToSteps);

  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Math Tools", url: "https://kodekit.in/category/math" },
    {
      name: "Matrix Calculator",
      url: "https://kodekit.in/tools/matrix-calculator",
    },
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Math Tools", url: "/category/math" },
    { name: "Matrix Calculator" },
  ];

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
      {matrix.map((_row, i) => (
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
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
      />

      {/* Structured Data */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(webAppData)}</script>
        <script type="application/ld+json">{JSON.stringify(howToData)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

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
          aria-label="Matrix calculator tool"
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
                  <FormControl>
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
                      aria-labelledby="matrix-size-label"
                      aria-describedby="matrix-size-description"
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
                          if (value > 0) setRows(value);
                        }}
                        sx={{ width: 100 }}
                        InputProps={{
                          inputProps: { min: 1, max: 10 },
                        }}
                        aria-labelledby="rows-label"
                        aria-describedby="rows-description"
                      />
                    </FormControl>
                    <FormControl>
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
                        aria-labelledby="columns-label"
                        aria-describedby="columns-description"
                      />
                    </FormControl>
                  </>
                )}

                <Tooltip title="Increase matrix size">
                  <IconButton
                    onClick={handleIncreaseSize}
                    color="primary"
                    aria-label="Increase matrix size"
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Decrease matrix size">
                  <IconButton
                    onClick={handleDecreaseSize}
                    color="primary"
                    disabled={rows <= 1 || cols <= 1}
                    aria-label="Decrease matrix size"
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                </Tooltip>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="operation-label">Operation</InputLabel>
                  <Select
                    value={operation}
                    label="Operation"
                    onChange={(e) => setOperation(e.target.value)}
                    aria-labelledby="operation-label"
                    aria-describedby="operation-description"
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
                    id="multiplication-instructions"
                  >
                    For matrix multiplication, the number of columns in Matrix A
                    must equal the number of rows in Matrix B. The number of
                    columns in Matrix B can be different.
                  </Typography>
                  <FormControl>
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
                      aria-labelledby="matrix2-cols-label"
                      aria-describedby="matrix2-cols-description"
                    />
                  </FormControl>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Matrix A
                  </Typography>
                  {renderMatrix(matrix1, 1)}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleRandomFill(1)}
                      aria-label="Fill Matrix A with random values"
                    >
                      Random Fill
                    </Button>
                  </Box>
                </Grid>
                {!isSingleMatrixOperation && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      Matrix B
                    </Typography>
                    {renderMatrix(
                      matrix2,
                      2,
                      operation === "multiply" ? matrix2Cols : cols
                    )}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleRandomFill(2)}
                        aria-label="Fill Matrix B with random values"
                      >
                        Random Fill
                      </Button>
                    </Box>
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={calculateResult}
                    sx={{ mr: 2 }}
                    aria-label="Calculate matrix operation"
                  >
                    Calculate
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    onClick={handleClear}
                    sx={{ mr: 2 }}
                    aria-label="Clear all matrices"
                  >
                    Clear
                  </Button>
                </Grid>
                {operation !== "multiply" && (
                  <Grid item>
                    <Tooltip title="Swap Matrices A and B">
                      <IconButton
                        onClick={handleSwapMatrices}
                        color="primary"
                        aria-label="Swap matrices A and B"
                      >
                        <SwapHoriz />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>

              {result.length > 0 && (
                <Grid item xs={12} sx={{ mt: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      Result
                    </Typography>
                    <Tooltip title="Copy result">
                      <IconButton
                        onClick={handleCopyResult}
                        aria-label="Copy result to clipboard"
                      >
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      p: 2,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                    }}
                    aria-live="polite"
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
                            aria-label={`Result matrix cell at row ${
                              i + 1
                            }, column ${j + 1}`}
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

        {/* SEO Content Section */}
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
            About the Matrix Calculator
          </Typography>
          <Typography paragraph>
            Our free online matrix calculator provides a comprehensive tool for
            performing various matrix operations. Whether you're a student
            learning linear algebra or a professional needing quick
            calculations, this tool supports all fundamental matrix operations
            with precision and ease.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            Supported Matrix Operations
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Addition</strong>: Add two matrices of the same
                  dimensions
                </li>
                <li>
                  <strong>Subtraction</strong>: Subtract one matrix from another
                  of the same dimensions
                </li>
                <li>
                  <strong>Multiplication</strong>: Multiply two compatible
                  matrices (columns of first must equal rows of second)
                </li>
                <li>
                  <strong>Transpose</strong>: Flip a matrix over its diagonal
                </li>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Determinant</strong>: Calculate the determinant of a
                  square matrix
                </li>
                <li>
                  <strong>Inverse</strong>: Find the inverse of an invertible
                  square matrix
                </li>
                <li>
                  <strong>Random Generation</strong>: Quickly fill matrices with
                  random values for experimentation
                </li>
              </Typography>
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            How to Use the Matrix Calculator
          </Typography>
          <Typography component="ol" sx={{ pl: 2 }}>
            <li>Select the matrix dimensions (rows and columns)</li>
            <li>Choose the operation you want to perform</li>
            <li>Enter the matrix values or use the random fill feature</li>
            <li>Click "Calculate" to see the result</li>
            <li>Use "Clear" to reset or "Swap" to exchange matrices A and B</li>
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            Technical Details
          </Typography>
          <Typography paragraph>
            The calculator uses precise algorithms for all operations:
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Determinant calculation using recursive expansion by minors</li>
            <li>Matrix inversion through adjugate matrix and determinant</li>
            <li>Precision handling with floating-point arithmetic</li>
            <li>Input validation to prevent invalid operations</li>
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            Common Use Cases
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Solving systems of linear equations</li>
            <li>Linear transformations in computer graphics</li>
            <li>Statistics and data analysis</li>
            <li>Engineering and physics calculations</li>
            <li>Academic learning and homework help</li>
          </Typography>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          role="status"
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
            aria-live="polite"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default MatrixCalculator;
