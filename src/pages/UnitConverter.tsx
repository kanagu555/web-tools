import React, { useState } from 'react';
import { Box, Container, Typography, Paper, TextField, Select, MenuItem, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface UnitType {
  name: string;
  units: {
    [key: string]: number;
  };
}

const unitTypes: { [key: string]: UnitType } = {
  length: {
    name: 'Length',
    units: {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.34,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254,
    },
  },
  weight: {
    name: 'Weight',
    units: {
      kilograms: 1,
      grams: 0.001,
      milligrams: 0.000001,
      pounds: 0.453592,
      ounces: 0.0283495,
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      celsius: 'C',
      fahrenheit: 'F',
      kelvin: 'K',
    },
  },
};

const UnitConverter = () => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('kilometers');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  const handleConvert = (value: string, from: string, to: string) => {
    if (!value) {
      setToValue('');
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setToValue('Invalid input');
      return;
    }

    if (selectedType === 'temperature') {
      let result;
      if (from === 'celsius' && to === 'fahrenheit') {
        result = (numValue * 9/5) + 32;
      } else if (from === 'fahrenheit' && to === 'celsius') {
        result = (numValue - 32) * 5/9;
      } else if (from === 'celsius' && to === 'kelvin') {
        result = numValue + 273.15;
      } else if (from === 'kelvin' && to === 'celsius') {
        result = numValue - 273.15;
      } else if (from === 'fahrenheit' && to === 'kelvin') {
        result = (numValue - 32) * 5/9 + 273.15;
      } else if (from === 'kelvin' && to === 'fahrenheit') {
        result = (numValue - 273.15) * 9/5 + 32;
      } else {
        result = numValue;
      }
      setToValue(result.toFixed(2));
    } else {
      const fromRate = unitTypes[selectedType].units[from];
      const toRate = unitTypes[selectedType].units[to];
      const result = (numValue * fromRate) / toRate;
      setToValue(result.toFixed(4));
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
          Unit Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert between different units of measurement quickly and accurately.
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
              <Select
                fullWidth
                value={selectedType}
                onChange={(e) => {
                  const newType = e.target.value;
                  setSelectedType(newType);
                  const units = Object.keys(unitTypes[newType].units);
                  setFromUnit(units[0]);
                  setToUnit(units[1]);
                  setFromValue('');
                  setToValue('');
                }}
              >
                {Object.entries(unitTypes).map(([key, type]) => (
                  <MenuItem key={key} value={key}>{type.name}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="From"
                type="number"
                value={fromValue}
                onChange={(e) => {
                  setFromValue(e.target.value);
                  handleConvert(e.target.value, fromUnit, toUnit);
                }}
                sx={{ mb: 2 }}
              />
              <Select
                fullWidth
                value={fromUnit}
                onChange={(e) => {
                  setFromUnit(e.target.value);
                  handleConvert(fromValue, e.target.value, toUnit);
                }}
              >
                {Object.keys(unitTypes[selectedType].units).map((unit) => (
                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h5">=</Typography>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="To"
                value={toValue}
                InputProps={{ readOnly: true }}
                sx={{ mb: 2 }}
              />
              <Select
                fullWidth
                value={toUnit}
                onChange={(e) => {
                  setToUnit(e.target.value);
                  handleConvert(fromValue, fromUnit, e.target.value);
                }}
              >
                {Object.keys(unitTypes[selectedType].units).map((unit) => (
                  <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UnitConverter;