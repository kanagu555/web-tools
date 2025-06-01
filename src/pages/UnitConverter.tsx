import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  Grid,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { motion } from "framer-motion";
import { SwapVert, ContentCopy, Refresh } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

interface UnitType {
  name: string;
  units: {
    [key: string]: number | string;
  };
  symbols?: {
    [key: string]: string;
  };
}

const unitTypes: { [key: string]: UnitType } = {
  length: {
    name: "Length",
    units: {
      meters: 1,
      kilometers: 1000,
      centimeters: 0.01,
      millimeters: 0.001,
      miles: 1609.34,
      yards: 0.9144,
      feet: 0.3048,
      inches: 0.0254,
      nauticalMiles: 1852,
    },
    symbols: {
      meters: "m",
      kilometers: "km",
      centimeters: "cm",
      millimeters: "mm",
      miles: "mi",
      yards: "yd",
      feet: "ft",
      inches: "in",
      nauticalMiles: "nmi",
    },
  },
  area: {
    name: "Area",
    units: {
      squareMeters: 1,
      squareKilometers: 1000000,
      squareCentimeters: 0.0001,
      squareMillimeters: 0.000001,
      squareMiles: 2589988.11,
      acres: 4046.86,
      hectares: 10000,
      squareFeet: 0.092903,
      squareInches: 0.00064516,
    },
    symbols: {
      squareMeters: "m²",
      squareKilometers: "km²",
      squareCentimeters: "cm²",
      squareMillimeters: "mm²",
      squareMiles: "mi²",
      acres: "ac",
      hectares: "ha",
      squareFeet: "ft²",
      squareInches: "in²",
    },
  },
  volume: {
    name: "Volume",
    units: {
      liters: 1,
      milliliters: 0.001,
      cubicMeters: 1000,
      gallons: 3.78541,
      quarts: 0.946353,
      pints: 0.473176,
      cups: 0.236588,
      fluidOunces: 0.0295735,
      cubicFeet: 28.3168,
      cubicInches: 0.0163871,
    },
    symbols: {
      liters: "L",
      milliliters: "mL",
      cubicMeters: "m³",
      gallons: "gal",
      quarts: "qt",
      pints: "pt",
      cups: "cup",
      fluidOunces: "fl oz",
      cubicFeet: "ft³",
      cubicInches: "in³",
    },
  },
  weight: {
    name: "Weight",
    units: {
      kilograms: 1,
      grams: 0.001,
      milligrams: 0.000001,
      metricTons: 1000,
      pounds: 0.453592,
      ounces: 0.0283495,
      stones: 6.35029,
      tons: 907.185,
    },
    symbols: {
      kilograms: "kg",
      grams: "g",
      milligrams: "mg",
      metricTons: "t",
      pounds: "lb",
      ounces: "oz",
      stones: "st",
      tons: "ton",
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: "C",
      fahrenheit: "F",
      kelvin: "K",
    },
    symbols: {
      celsius: "°C",
      fahrenheit: "°F",
      kelvin: "K",
    },
  },
  time: {
    name: "Time",
    units: {
      seconds: 1,
      minutes: 60,
      hours: 3600,
      days: 86400,
      weeks: 604800,
      months: 2629746,
      years: 31556952,
    },
    symbols: {
      seconds: "s",
      minutes: "min",
      hours: "hr",
      days: "d",
      weeks: "wk",
      months: "mo",
      years: "yr",
    },
  },
  speed: {
    name: "Speed",
    units: {
      metersPerSecond: 1,
      kilometersPerHour: 0.277778,
      milesPerHour: 0.44704,
      knots: 0.514444,
      feetPerSecond: 0.3048,
    },
    symbols: {
      metersPerSecond: "m/s",
      kilometersPerHour: "km/h",
      milesPerHour: "mph",
      knots: "kn",
      feetPerSecond: "ft/s",
    },
  },
  pressure: {
    name: "Pressure",
    units: {
      pascal: 1,
      kilopascal: 1000,
      bar: 100000,
      psi: 6894.76,
      atmosphere: 101325,
      mmHg: 133.322,
    },
    symbols: {
      pascal: "Pa",
      kilopascal: "kPa",
      bar: "bar",
      psi: "psi",
      atmosphere: "atm",
      mmHg: "mmHg",
    },
  },
  energy: {
    name: "Energy",
    units: {
      joules: 1,
      kilojoules: 1000,
      calories: 4.184,
      kilocalories: 4184,
      wattHours: 3600,
      kilowattHours: 3600000,
      electronvolts: 1.602176634e-19,
      britishThermalUnits: 1055.06,
    },
    symbols: {
      joules: "J",
      kilojoules: "kJ",
      calories: "cal",
      kilocalories: "kcal",
      wattHours: "Wh",
      kilowattHours: "kWh",
      electronvolts: "eV",
      britishThermalUnits: "BTU",
    },
  },
  data: {
    name: "Digital Storage",
    units: {
      bit: 1,
      byte: 8,
      kilobyte: 8 * 1024,
      megabyte: 8 * 1024 * 1024,
      gigabyte: 8 * 1024 * 1024 * 1024,
      terabyte: 8 * 1024 * 1024 * 1024 * 1024,
      petabyte: 8 * 1024 * 1024 * 1024 * 1024 * 1024,
    },
    symbols: {
      bit: "bit",
      byte: "B",
      kilobyte: "KB",
      megabyte: "MB",
      gigabyte: "GB",
      terabyte: "TB",
      petabyte: "PB",
    },
  },
};

const UnitConverter = () => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState("length");
  const [fromUnit, setFromUnit] = useState("meters");
  const [toUnit, setToUnit] = useState("kilometers");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  // Initialize with default units when type changes
  useEffect(() => {
    const units = Object.keys(unitTypes[selectedType].units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue("");
    setToValue("");
  }, [selectedType]);

  const handleConvert = (value: string, from: string, to: string) => {
    if (!value) {
      setToValue("");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setToValue("Invalid input");
      setSnackbarMessage("Invalid input: Please enter a valid number");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    let result: number;

    if (selectedType === "temperature") {
      if (from === "celsius" && to === "fahrenheit") {
        result = (numValue * 9) / 5 + 32;
      } else if (from === "fahrenheit" && to === "celsius") {
        result = ((numValue - 32) * 5) / 9;
      } else if (from === "celsius" && to === "kelvin") {
        result = numValue + 273.15;
      } else if (from === "kelvin" && to === "celsius") {
        result = numValue - 273.15;
      } else if (from === "fahrenheit" && to === "kelvin") {
        result = ((numValue - 32) * 5) / 9 + 273.15;
      } else if (from === "kelvin" && to === "fahrenheit") {
        result = ((numValue - 273.15) * 9) / 5 + 32;
      } else {
        result = numValue;
      }
    } else {
      const fromRate = unitTypes[selectedType].units[from] as number;
      const toRate = unitTypes[selectedType].units[to] as number;
      result = (numValue * fromRate) / toRate;
    }

    // Format the result based on the magnitude
    let formattedResult: string;
    if (Math.abs(result) < 0.0001 || Math.abs(result) >= 10000000) {
      formattedResult = result.toExponential(4);
    } else {
      // Use more decimal places for small numbers, fewer for large numbers
      const decimalPlaces =
        Math.abs(result) < 0.1 ? 6 : Math.abs(result) < 10 ? 4 : 2;
      formattedResult = result.toFixed(decimalPlaces);
      // Remove trailing zeros
      formattedResult = formattedResult.replace(/\.?0+$/, "");
    }

    setToValue(formattedResult);

    // Only show conversion success notification when manually triggered (not on every input change)
    if (from !== fromUnit || to !== toUnit) {
      setSnackbarMessage(
        `Converted ${numValue} ${getUnitSymbol(
          selectedType,
          from
        )} to ${formattedResult} ${getUnitSymbol(selectedType, to)}`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
    setSnackbarMessage("Units swapped");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleCopyResult = () => {
    if (toValue) {
      navigator.clipboard.writeText(toValue);
      setSnackbarMessage("Result copied to clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const handleClear = () => {
    setFromValue("");
    setToValue("");
    setSnackbarMessage("Values cleared");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const getUnitSymbol = (unitType: string, unit: string): string => {
    return unitTypes[unitType].symbols?.[unit] || unit;
  };

  // Format unit name for display (e.g., "squareMeters" -> "Square Meters")
  const formatUnitName = (unit: string): string => {
    return unit.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Unit Converter | Convert Measurements Online</title>
        <meta
          name="description"
          content="Free online unit converter tool. Convert between different units of length, area, volume, weight, temperature, time, speed, pressure, energy, and digital storage."
        />
        <meta
          name="keywords"
          content="unit converter, measurement converter, length converter, weight converter, temperature converter, metric converter, imperial converter, unit calculator, measurement tool"
        />
      </Helmet>

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
            mx: "auto",
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
                  setSnackbarMessage(
                    `Changed to ${unitTypes[newType].name} conversion`
                  );
                  setSnackbarSeverity("info");
                  setSnackbarOpen(true);
                }}
              >
                {Object.entries(unitTypes).map(([key, type]) => (
                  <MenuItem key={key} value={key}>
                    {type.name}
                  </MenuItem>
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {getUnitSymbol(selectedType, fromUnit)}
                    </InputAdornment>
                  ),
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
                  <MenuItem key={unit} value={unit}>
                    {formatUnitName(unit)} ({getUnitSymbol(selectedType, unit)})
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid
              item
              xs={12}
              sm={2}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tooltip title="Swap units">
                <IconButton
                  onClick={handleSwapUnits}
                  sx={{
                    backgroundColor: theme.palette.background.default,
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <SwapVert />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="To"
                value={toValue}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {getUnitSymbol(selectedType, toUnit)}
                        <Tooltip title="Copy result">
                          <IconButton
                            size="small"
                            onClick={handleCopyResult}
                            disabled={!toValue}
                            sx={{ ml: 0.5 }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </InputAdornment>
                  ),
                }}
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
                  <MenuItem key={unit} value={unit}>
                    {formatUnitName(unit)} ({getUnitSymbol(selectedType, unit)})
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleClear}
                disabled={!fromValue}
                sx={{ minWidth: 120 }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Snackbar for notifications */}
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

        <AdSense adSlot="6613251015" />

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
            About Our Unit Converter
          </Typography>
          <Typography paragraph>
            Our free online unit converter provides a simple and accurate way to
            convert between different units of measurement. Whether you need to
            convert between metric and imperial systems or work with specialized
            units, our tool makes the process quick and error-free.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Supported Conversion Categories
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Length</strong>: meters, kilometers, miles, yards,
                  feet, inches, etc.
                </li>
                <li>
                  <strong>Area</strong>: square meters, acres, hectares, square
                  feet, etc.
                </li>
                <li>
                  <strong>Volume</strong>: liters, gallons, cubic meters, cups,
                  etc.
                </li>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Weight</strong>: kilograms, pounds, ounces, tons, etc.
                </li>
                <li>
                  <strong>Temperature</strong>: Celsius, Fahrenheit, Kelvin
                </li>
                <li>
                  <strong>Time</strong>: seconds, minutes, hours, days, weeks,
                  etc.
                </li>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Speed</strong>: m/s, km/h, mph, knots, etc.
                </li>
                <li>
                  <strong>Pressure</strong>: pascal, bar, psi, atmosphere, etc.
                </li>
                <li>
                  <strong>Energy</strong>: joules, calories, watt-hours, BTU,
                  etc.
                </li>
                <li>
                  <strong>Digital Storage</strong>: bit, byte, KB, MB, GB, etc.
                </li>
              </Typography>
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            How to Use the Unit Converter
          </Typography>
          <Typography paragraph>
            Using our unit converter is straightforward:
          </Typography>
          <Typography component="ol" sx={{ pl: 2 }}>
            <li>
              Select the category of measurement you want to convert (length,
              weight, temperature, etc.)
            </li>
            <li>Enter the value you want to convert in the "From" field</li>
            <li>Select the source unit from the dropdown menu</li>
            <li>Select the target unit from the "To" dropdown menu</li>
            <li>The converted result will appear automatically</li>
          </Typography>
          <Typography paragraph>
            You can also swap the units using the swap button, copy the result
            to your clipboard, or clear the values to start a new conversion.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Why Use Our Unit Converter?
          </Typography>
          <Typography paragraph>
            Our unit converter stands out for several reasons:
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>
              <strong>Comprehensive</strong>: Covers all common measurement
              categories and units
            </li>
            <li>
              <strong>Accurate</strong>: Provides precise conversions with
              appropriate decimal places
            </li>
            <li>
              <strong>Easy to use</strong>: Simple, intuitive interface with
              instant results
            </li>
            <li>
              <strong>No installation required</strong>: Works directly in your
              browser
            </li>
            <li>
              <strong>Free</strong>: No cost, no registration, no limitations
            </li>
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UnitConverter;
