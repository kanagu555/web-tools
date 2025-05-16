import React, { useState } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const StatisticsCalculator = () => {
  const theme = useTheme();
  const [numbers, setNumbers] = useState('');
  const [stats, setStats] = useState<{
    mean: number;
    median: number;
    mode: number[];
    range: number;
    standardDeviation: number;
    variance: number;
  } | null>(null);
  const [error, setError] = useState('');

  const calculateStats = () => {
    try {
      const values = numbers
        .split(/[,\s]+/)
        .map(n => parseFloat(n.trim()))
        .filter(n => !isNaN(n));

      if (values.length === 0) {
        setError('Please enter valid numbers');
        return;
      }

      // Sort values for median and range
      const sortedValues = [...values].sort((a, b) => a - b);

      // Calculate mean
      const mean = values.reduce((a, b) => a + b) / values.length;

      // Calculate median
      const median = sortedValues.length % 2 === 0
        ? (sortedValues[values.length / 2 - 1] + sortedValues[values.length / 2]) / 2
        : sortedValues[Math.floor(values.length / 2)];

      // Calculate mode
      const frequency: { [key: number]: number } = {};
      values.forEach(value => {
        frequency[value] = (frequency[value] || 0) + 1;
      });
      const maxFrequency = Math.max(...Object.values(frequency));
      const mode = Object.entries(frequency)
        .filter(([_, freq]) => freq === maxFrequency)
        .map(([value]) => parseFloat(value));

      // Calculate range
      const range = sortedValues[sortedValues.length - 1] - sortedValues[0];

      // Calculate variance and standard deviation
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
      const standardDeviation = Math.sqrt(variance);

      setStats({
        mean,
        median,
        mode,
        range,
        standardDeviation,
        variance,
      });
      setError('');
    } catch (err) {
      setError('Error calculating statistics');
      setStats(null);
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
          Statistics Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Calculate statistical measures and analyze numerical data.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 800,
            mx: 'auto',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Enter numbers"
                value={numbers}
                onChange={(e) => setNumbers(e.target.value)}
                error={!!error}
                helperText={error || "Enter numbers separated by commas or spaces"}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={calculateStats}
                fullWidth
              >
                Calculate Statistics
              </Button>
            </Grid>

            {stats && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Mean
                      </Typography>
                      <Typography variant="h6">
                        {stats.mean.toFixed(4)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Median
                      </Typography>
                      <Typography variant="h6">
                        {stats.median.toFixed(4)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Mode
                      </Typography>
                      <Typography variant="h6">
                        {stats.mode.map(m => m.toFixed(4)).join(', ')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Range
                      </Typography>
                      <Typography variant="h6">
                        {stats.range.toFixed(4)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Standard Deviation
                      </Typography>
                      <Typography variant="h6">
                        {stats.standardDeviation.toFixed(4)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Variance
                      </Typography>
                      <Typography variant="h6">
                        {stats.variance.toFixed(4)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default StatisticsCalculator;