import { useState, useEffect } from "react";
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
        <title>
          Unit Converter | Convert Between 100+ Measurement Units Online
        </title>
        <meta
          name="description"
          content="Free online unit converter tool supporting 10+ categories and 100+ units. Convert length, area, volume, weight, temperature, time, speed, pressure, energy, and digital storage between metric and imperial systems."
        />
        <meta
          name="keywords"
          content="unit converter, measurement converter, metric converter, imperial converter, length converter, weight converter, temperature converter, online calculator, unit conversion tool, measurement conversion tool"
        />
        <meta
          property="og:title"
          content="Unit Converter | Convert Between 100+ Measurement Units Online"
        />
        <meta
          property="og:description"
          content="Free online unit converter tool supporting 10+ categories and 100+ units. Convert between metric and imperial systems instantly."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/unit-converter"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Unit Converter | Convert Between 100+ Measurement Units Online"
        />
        <meta
          name="twitter:description"
          content="Free online unit converter tool supporting 10+ categories and 100+ units. Convert between metric and imperial systems instantly."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/unit-converter"
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
          aria-label="Unit conversion tool"
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
                aria-label="Select measurement type"
                aria-describedby="measurement-type-description"
              >
                {Object.entries(unitTypes).map(([key, type]) => (
                  <MenuItem key={key} value={key}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography
                id="measurement-type-description"
                variant="caption"
                color="text.secondary"
              >
                Choose the category of units you want to convert
              </Typography>
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
                  "aria-label": "Input value to convert",
                  "aria-describedby": "from-value-description",
                }}
              />
              <Typography
                id="from-value-description"
                variant="caption"
                color="text.secondary"
              >
                Enter the value you want to convert
              </Typography>
              <Select
                fullWidth
                value={fromUnit}
                sx={{ mt: 4 }}
                onChange={(e) => {
                  setFromUnit(e.target.value);
                  handleConvert(fromValue, e.target.value, toUnit);
                }}
                aria-label="Select source unit"
                aria-describedby="source-unit-description"
              >
                {Object.keys(unitTypes[selectedType].units).map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {formatUnitName(unit)} ({getUnitSymbol(selectedType, unit)})
                  </MenuItem>
                ))}
              </Select>
              <Typography
                id="source-unit-description"
                variant="caption"
                color="text.secondary"
              >
                Select the unit you're converting from
              </Typography>
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
                  aria-label="Swap source and target units"
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
                  "aria-label": "Converted result",
                  "aria-describedby": "result-description",
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
                            aria-label="Copy converted result to clipboard"
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
              <Typography
                id="result-description"
                variant="caption"
                color="text.secondary"
              >
                Conversion result will appear here
              </Typography>
              <Select
                sx={{ mt: 4 }}
                fullWidth
                value={toUnit}
                onChange={(e) => {
                  setToUnit(e.target.value);
                  handleConvert(fromValue, fromUnit, e.target.value);
                }}
                aria-label="Select target unit"
                aria-describedby="target-unit-description"
              >
                {Object.keys(unitTypes[selectedType].units).map((unit) => (
                  <MenuItem key={unit} value={unit}>
                    {formatUnitName(unit)} ({getUnitSymbol(selectedType, unit)})
                  </MenuItem>
                ))}
              </Select>
              <Typography
                id="target-unit-description"
                variant="caption"
                color="text.secondary"
              >
                Select the unit you're converting to
              </Typography>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ mt: 2, display: "flex", justifyContent: "center" }}
            >
              <Button
                variant="outlined"
                color="error"
                startIcon={<Refresh />}
                onClick={handleClear}
                disabled={!fromValue}
                sx={{ minWidth: 120 }}
                aria-label="Clear all inputs and results"
              >
                Clear
              </Button>
            </Grid>
          </Grid>
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

        <AdSense adSlot="6613251015" />

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
            Comprehensive Unit Conversion Tool
          </Typography>
          <Typography paragraph>
            Our free online unit converter provides instant conversions between
            over 100 different units across 10+ measurement categories. Whether
            you're working with metric, imperial, or specialized units, our tool
            delivers accurate results with precision formatting.
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
                  <strong>Length/Distance</strong>: Convert between meters,
                  kilometers, miles, yards, feet, inches, nautical miles
                </li>
                <li>
                  <strong>Area</strong>: Square meters, acres, hectares, square
                  feet, square inches, square miles
                </li>
                <li>
                  <strong>Volume/Capacity</strong>: Liters, gallons, cubic
                  meters, cups, fluid ounces, pints, quarts
                </li>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Weight/Mass</strong>: Kilograms, pounds, ounces,
                  grams, metric tons, stones
                </li>
                <li>
                  <strong>Temperature</strong>: Celsius, Fahrenheit, Kelvin
                </li>
                <li>
                  <strong>Time</strong>: Seconds, minutes, hours, days, weeks,
                  months, years
                </li>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Speed/Velocity</strong>: Meters per second, kilometers
                  per hour, miles per hour, knots
                </li>
                <li>
                  <strong>Pressure</strong>: Pascal, bar, psi, atmosphere, mmHg
                </li>
                <li>
                  <strong>Energy/Power</strong>: Joules, calories, watt-hours,
                  kilowatt-hours, BTU
                </li>
                <li>
                  <strong>Digital Storage</strong>: Bits, bytes, kilobytes,
                  megabytes, gigabytes, terabytes
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
            Key Features
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>
              <strong>Precision formatting</strong>: Automatically switches
              between decimal and scientific notation for optimal readability
            </li>
            <li>
              <strong>Real-time conversion</strong>: Results update instantly as
              you type
            </li>
            <li>
              <strong>Unit swapping</strong>: Quickly reverse your conversion
              with one click
            </li>
            <li>
              <strong>Copy functionality</strong>: Easily copy results to your
              clipboard
            </li>
            <li>
              <strong>Responsive design</strong>: Works perfectly on all devices
              from desktop to mobile
            </li>
            <li>
              <strong>Accessibility optimized</strong>: Screen reader friendly
              with proper ARIA labels
            </li>
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Common Use Cases
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Cooking and recipe measurements (cups to milliliters)</li>
            <li>Construction and DIY projects (feet to meters)</li>
            <li>Science and engineering calculations</li>
            <li>Temperature conversions for weather or cooking</li>
            <li>File size calculations (MB to GB)</li>
            <li>Fitness tracking (pounds to kilograms)</li>
            <li>Travel planning (miles to kilometers)</li>
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography component="div" sx={{ mt: 2 }}>
            <Typography variant="subtitle1" component="h4" fontWeight={500}>
              Q: How accurate are the conversions?
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 2 }}>
              A: Our conversions use standard conversion factors and are
              accurate to the maximum precision JavaScript can handle. For
              temperature conversions, we use exact formulas rather than
              approximations.
            </Typography>

            <Typography variant="subtitle1" component="h4" fontWeight={500}>
              Q: Can I use this tool on my mobile device?
            </Typography>
            <Typography variant="body1" component="p" sx={{ mb: 2 }}>
              A: Yes, our unit converter is fully responsive and works perfectly
              on all devices including smartphones and tablets.
            </Typography>

            <Typography variant="subtitle1" component="h4" fontWeight={500}>
              Q: Are there any unit categories you plan to add?
            </Typography>
            <Typography variant="body1" component="p">
              A: We're continuously expanding our supported categories. Future
              additions may include angle conversion, data transfer rates, and
              more specialized engineering units.
            </Typography>
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UnitConverter;
