"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
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
  Card,
  CardContent,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { ArrowUpDown, Copy, RotateCcw, Calculator, Ruler } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";

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
  const { trackTool } = useAnalytics();
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

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  useEffect(() => {
    const units = Object.keys(unitTypes[selectedType].units);
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue("");
    setToValue("");
  }, [selectedType]);

  const handleConvert = useCallback(
    (value: string, from: string, to: string) => {
      if (!value) {
        setToValue("");
        return;
      }

      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setToValue("Invalid input");
        showSnackbar("Invalid input: Please enter a valid number", "error");
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
    },
    [selectedType, showSnackbar]
  );

  const handleSwapUnits = useCallback(() => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
    showSnackbar("Units swapped", "info");
    trackTool("unit-converter", "swap");
  }, [toUnit, fromUnit, toValue, fromValue, showSnackbar, trackTool]);

  const handleCopyResult = useCallback(async () => {
    if (toValue && toValue !== "Invalid input") {
      try {
        await navigator.clipboard.writeText(toValue);
        showSnackbar("Result copied to clipboard", "success");
        trackTool("unit-converter", "copy");
      } catch (err) {
        showSnackbar("Failed to copy to clipboard", "error");
      }
    }
  }, [toValue, showSnackbar, trackTool]);

  const handleClear = useCallback(() => {
    setFromValue("");
    setToValue("");
    showSnackbar("Values cleared", "info");
    trackTool("unit-converter", "clear");
  }, [showSnackbar, trackTool]);

  const getUnitSymbol = useCallback(
    (unitType: string, unit: string): string => {
      return unitTypes[unitType].symbols?.[unit] || unit;
    },
    []
  );

  // Format unit name for display (e.g., "squareMeters" -> "Square Meters")
  const formatUnitName = useCallback((unit: string): string => {
    return unit.replace(/([A-Z])/g, " $1").trim();
  }, []);

  const handleTypeChange = useCallback(
    (newType: string) => {
      setSelectedType(newType);
      showSnackbar(`Changed to ${unitTypes[newType].name} conversion`, "info");
      trackTool("unit-converter", "change-type");
    },
    [showSnackbar, trackTool]
  );

  const handleFromValueChange = useCallback(
    (value: string) => {
      setFromValue(value);
      handleConvert(value, fromUnit, toUnit);
      if (value) {
        trackTool("unit-converter", "convert");
      }
    },
    [fromUnit, toUnit, handleConvert, trackTool]
  );

  const handleFromUnitChange = useCallback(
    (unit: string) => {
      setFromUnit(unit);
      handleConvert(fromValue, unit, toUnit);
    },
    [fromValue, toUnit, handleConvert]
  );

  const handleToUnitChange = useCallback(
    (unit: string) => {
      setToUnit(unit);
      handleConvert(fromValue, fromUnit, unit);
    },
    [fromValue, fromUnit, handleConvert]
  );

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
          Unit Converter
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
          Convert between different units of measurement quickly and accurately
          across 10+ categories including length, weight, temperature, and more.
        </Typography>

        <Card
          elevation={0}
          sx={{
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.secondary.main}08 100%)`,
            maxWidth: 800,
            mx: "auto",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="measurement-type-label">
                    Measurement Category
                  </InputLabel>
                  <Select
                    labelId="measurement-type-label"
                    value={selectedType}
                    label="Measurement Category"
                    onChange={(e) => handleTypeChange(e.target.value)}
                    aria-label="Select measurement type"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.paper,
                      },
                    }}
                  >
                    {Object.entries(unitTypes).map(([key, type]) => (
                      <MenuItem key={key} value={key}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {key === "length" && <Ruler size={16} />}
                          {key === "weight" && <Calculator size={16} />}
                          {key !== "length" && key !== "weight" && (
                            <Calculator size={16} />
                          )}
                          {type.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="From Value"
                  type="number"
                  value={fromValue}
                  onChange={(e) => handleFromValueChange(e.target.value)}
                  placeholder="Enter value to convert"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {getUnitSymbol(selectedType, fromUnit)}
                      </InputAdornment>
                    ),
                  }}
                  aria-label="Input value to convert"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.paper,
                    },
                  }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="from-unit-label">From Unit</InputLabel>
                  <Select
                    labelId="from-unit-label"
                    value={fromUnit}
                    label="From Unit"
                    onChange={(e) => handleFromUnitChange(e.target.value)}
                    aria-label="Select source unit"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.paper,
                      },
                    }}
                  >
                    {Object.keys(unitTypes[selectedType].units).map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {formatUnitName(unit)} (
                        {getUnitSymbol(selectedType, unit)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    color="primary"
                    sx={{
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                        transform: "rotate(180deg)",
                      },
                      transition: "all 0.3s ease",
                    }}
                    aria-label="Swap source and target units"
                  >
                    <ArrowUpDown size={20} />
                  </IconButton>
                </Tooltip>
              </Grid>

              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="To Value"
                  value={toValue}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {getUnitSymbol(selectedType, toUnit)}
                          <Tooltip title="Copy result">
                            <IconButton
                              size="small"
                              onClick={handleCopyResult}
                              disabled={!toValue || toValue === "Invalid input"}
                              aria-label="Copy converted result to clipboard"
                              color="primary"
                            >
                              <Copy size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                  aria-label="Converted result"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.default,
                    },
                  }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel id="to-unit-label">To Unit</InputLabel>
                  <Select
                    labelId="to-unit-label"
                    value={toUnit}
                    label="To Unit"
                    onChange={(e) => handleToUnitChange(e.target.value)}
                    aria-label="Select target unit"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.paper,
                      },
                    }}
                  >
                    {Object.keys(unitTypes[selectedType].units).map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {formatUnitName(unit)} (
                        {getUnitSymbol(selectedType, unit)})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<RotateCcw size={16} />}
                  onClick={handleClear}
                  disabled={!fromValue}
                  aria-label="Clear all inputs and results"
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {/* SEO Content Section */}
        <Card
          elevation={0}
          sx={{
            p: 4,
            mt: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          component="section"
          aria-labelledby="unit-converter-guide"
        >
          <Typography
            id="unit-converter-guide"
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            Complete Guide to Unit Converter
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
                Supported Categories
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>
                    <strong>Length:</strong> Meters, kilometers, miles, feet,
                    inches, yards
                  </li>
                  <li>
                    <strong>Area:</strong> Square meters, acres, hectares,
                    square feet
                  </li>
                  <li>
                    <strong>Volume:</strong> Liters, gallons, cubic meters,
                    cups, fluid ounces
                  </li>
                  <li>
                    <strong>Weight:</strong> Kilograms, pounds, ounces, grams,
                    tons
                  </li>
                  <li>
                    <strong>Temperature:</strong> Celsius, Fahrenheit, Kelvin
                  </li>
                  <li>
                    <strong>Time:</strong> Seconds, minutes, hours, days, weeks,
                    years
                  </li>
                  <li>
                    <strong>Speed:</strong> m/s, km/h, mph, knots
                  </li>
                  <li>
                    <strong>Pressure:</strong> Pascal, bar, psi, atmosphere
                  </li>
                  <li>
                    <strong>Energy:</strong> Joules, calories, watt-hours, BTU
                  </li>
                  <li>
                    <strong>Digital Storage:</strong> Bits, bytes, KB, MB, GB,
                    TB
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
                Key Features
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>Real-time conversion as you type</li>
                  <li>Precision formatting for optimal readability</li>
                  <li>Unit swapping with one click</li>
                  <li>Copy results to clipboard</li>
                  <li>Support for scientific notation</li>
                  <li>Mobile-friendly responsive design</li>
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
                1. Select the measurement category from the dropdown menu
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                2. Enter the value you want to convert in the "From Value" field
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                3. Choose the source and target units from the respective
                dropdowns
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                4. The result appears instantly in the "To Value" field
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                5. Use the swap button to quickly reverse the conversion
              </Typography>

              <Typography
                variant="h3"
                component="h3"
                gutterBottom
                fontWeight={600}
                sx={{ fontSize: "1.1rem", mt: 2 }}
              >
                Common Use Cases
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>Cooking and recipe measurements</li>
                  <li>Construction and DIY projects</li>
                  <li>Science and engineering calculations</li>
                  <li>Travel planning and navigation</li>
                  <li>Fitness and health tracking</li>
                  <li>File size calculations</li>
                  <li>Weather and temperature conversions</li>
                </ul>
              </Typography>
            </Grid>
          </Grid>

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.1rem", mt: 3 }}
          >
            Accuracy and Precision
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Our unit converter uses standard conversion factors and precise
            formulas to ensure accurate results. Temperature conversions use
            exact mathematical formulas rather than approximations. The tool
            automatically formats results with appropriate precision and
            switches to scientific notation for very large or small numbers.
          </Typography>

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.1rem", mt: 2 }}
          >
            Supported Unit Systems
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
              <li>
                <strong>Metric System:</strong> Meters, kilograms, liters,
                Celsius
              </li>
              <li>
                <strong>Imperial System:</strong> Feet, pounds, gallons,
                Fahrenheit
              </li>
              <li>
                <strong>Scientific Units:</strong> Kelvin, Pascal, Joules
              </li>
              <li>
                <strong>Specialized Units:</strong> Nautical miles, knots, BTU,
                atmospheres
              </li>
            </ul>
          </Typography>
        </Card>

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

export default UnitConverter;
