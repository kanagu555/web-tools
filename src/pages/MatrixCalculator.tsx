import React, { useState } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, Grid, Select, MenuItem, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const MatrixCalculator = () => {
  const theme = useTheme();
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [operation, setOperation] = useState('add');
  const [matrix1, setMatrix1] = useState(Array(rows).fill(Array(cols).fill('')));
  const [matrix2, setMatrix2] = useState(Array(rows).fill(Array(cols).fill('')));
  const [result, setResult] = useState<number[][]>([]);

  const handleMatrixChange = (matrixNumber: number, row: number, col: number, value: string) => {
    const newMatrix = matrixNumber === 1 ? [...matrix1] : [...matrix2];
    newMatrix[row] = [...newMatrix[row]];
    newMatrix[row][col] = value;
    
    if (matrixNumber === 1) {
      setMatrix1(newMatrix);
    } else {
      setMatrix2(newMatrix);
    }
  };

  const calculateResult = () => {
    const m1 = matrix1.map(row => row.map(val => parseFloat(val) || 0));
    const m2 = matrix2.map(row => row.map(val => parseFloat(val) || 0));
    let resultMatrix: number[][] = [];

    switch (operation) {
      case 'add':
        resultMatrix = m1.map((row, i) => row.map((val, j) => val + m2[i][j]));
        break;
      case 'subtract':
        resultMatrix = m1.map((row, i) => row.map((val, j) => val - m2[i][j]));
        break;
      case 'multiply':
        resultMatrix = Array(m1.length).fill(0).map(() => Array(m2[0].length).fill(0));
        for (let i = 0; i < m1.length; i++) {
          for (let j = 0; j < m2[0].length; j++) {
            for (let k = 0; k < m2.length; k++) {
              resultMatrix[i][j] += m1[i][k] * m2[k][j];
            }
          }
        }
        break;
    }

    setResult(resultMatrix);
  };

  const renderMatrix = (matrix: any[][], matrixNumber: number) => (
    <Grid container spacing={1}>
      {matrix.map((row, i) => (
        <Grid item xs={12} key={i}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {row.map((_, j) => (
              <TextField
                key={j}
                size="small"
                type="number"
                value={matrix[i][j]}
                onChange={(e) => handleMatrixChange(matrixNumber, i, j, e.target.value)}
                sx={{ width: 80 }}
              />
            ))}
          </Box>
        </Grid>
      ))}
    </Grid>
  );

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
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  label="Rows"
                  type="number"
                  value={rows}
                  onChange={(e) => setRows(parseInt(e.target.value))}
                  sx={{ width: 100 }}
                />
                <TextField
                  label="Columns"
                  type="number"
                  value={cols}
                  onChange={(e) => setCols(parseInt(e.target.value))}
                  sx={{ width: 100 }}
                />
                <Select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  sx={{ width: 200 }}
                >
                  <MenuItem value="add">Add</MenuItem>
                  <MenuItem value="subtract">Subtract</MenuItem>
                  <MenuItem value="multiply">Multiply</MenuItem>
                </Select>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Matrix 1</Typography>
              {renderMatrix(matrix1, 1)}
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Matrix 2</Typography>
              {renderMatrix(matrix2, 2)}
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={calculateResult}
                sx={{ mt: 2 }}
              >
                Calculate
              </Button>
            </Grid>

            {result.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Result</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {result.map((row, i) => (
                    <Box key={i} sx={{ display: 'flex', gap: 1 }}>
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
        </Paper>
      </motion.div>
    </Container>
  );
};

export default MatrixCalculator;