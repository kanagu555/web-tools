import React, { useState } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const EquationSolver = () => {
  const theme = useTheme();
  const [equation, setEquation] = useState('');
  const [solution, setSolution] = useState('');
  const [error, setError] = useState('');

  const solveEquation = () => {
    try {
      // This is a simple implementation. In a real application,
      // you would want to use a math library for more complex equations
      if (equation.includes('x')) {
        const parts = equation.split('=');
        if (parts.length !== 2) throw new Error('Invalid equation format');

        let leftSide = parts[0].trim();
        let rightSide = parts[1].trim();

        // Move all terms with x to the left side
        if (rightSide.includes('x')) {
          const rightTerms = rightSide.split(/([+-])/);
          rightTerms.forEach((term, i) => {
            if (term.includes('x')) {
              leftSide += (rightTerms[i-1] === '-' ? '+' : '-') + term;
              rightTerms[i] = '0';
            }
          });
          rightSide = rightTerms.join('');
        }

        // Move all numbers to the right side
        const leftTerms = leftSide.split(/([+-])/);
        let newLeftSide = '';
        let newRightSide = rightSide;
        
        leftTerms.forEach((term, i) => {
          if (!term.includes('x') && !isNaN(parseFloat(term))) {
            newRightSide += (leftTerms[i-1] === '-' ? '+' : '-') + term;
          } else {
            newLeftSide += term;
          }
        });

        // Evaluate right side
        const rightValue = eval(newRightSide);
        
        // Get coefficient of x
        const coefficient = eval(newLeftSide.replace('x', '1')) || 1;
        
        const x = rightValue / coefficient;
        setSolution(`x = ${x}`);
        setError('');
      } else {
        const result = eval(equation);
        setSolution(`Result: ${result}`);
        setError('');
      }
    } catch (err) {
      setError('Invalid equation format');
      setSolution('');
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
            mx: 'auto',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enter equation (e.g., 2x + 3 = 7)"
                value={equation}
                onChange={(e) => setEquation(e.target.value)}
                error={!!error}
                helperText={error || "Use 'x' for variables. Example: 2x + 3 = 7"}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={solveEquation}
                fullWidth
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
                >
                  <Typography variant="h5" align="center">
                    {solution}
                  </Typography>
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