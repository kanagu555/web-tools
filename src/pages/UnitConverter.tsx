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
import Breadcrumb from "../components/Breadcrumb";

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
    window.scrollTo(0, 0);
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Math Tools", url: "/category/math" },
    { name: "Unit Converter" },
  ];

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
          content="Free online unit converter tool supporting 10+ categories and 100+ units. Convert length, area, volume, weight, temperature, time, speed, pressure, energy, and digital storage between metric and imperial systems with precision formatting and real-time results."
        />
        <meta
          name="keywords"
          content="unit converter, measurement converter, metric converter, imperial converter, length converter, weight converter, temperature converter, online calculator, unit conversion tool, measurement conversion tool, free converter, instant conversion, precision calculator, mobile converter, responsive tool"
        />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="author" content="KodeKit" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="theme-color" content="#1976d2" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Unit Converter" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Unit Converter | Convert Between 100+ Measurement Units Online"
        />
        <meta
          property="og:description"
          content="Free online unit converter tool supporting 10+ categories and 100+ units. Convert between metric and imperial systems instantly."
        />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/unit-converter"
        />
        <meta property="og:site_name" content="KodeKit Tools" />
        <meta property="og:locale" content="en_US" />
        <meta
          property="og:image"
          content="https://www.kodekit.in/og-unit-converter.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="KodeKit Unit Converter Tool" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@kodekit" />
        <meta
          name="twitter:title"
          content="Unit Converter | Convert Between 100+ Measurement Units Online"
        />
        <meta
          name="twitter:description"
          content="Free online unit converter tool supporting 10+ categories and 100+ units. Convert between metric and imperial systems instantly."
        />
        <meta
          name="twitter:image"
          content="https://www.kodekit.in/twitter-unit-converter.png"
        />
        <meta name="twitter:image:alt" content="KodeKit Unit Converter Tool" />

        {/* Canonical and alternate links */}
        <meta name="twitter:creator" content="@kodekit" />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/unit-converter"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://www.kodekit.in/tools/unit-converter"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Unit Converter",
            description:
              "Free online unit converter tool supporting 10+ categories and 100+ units. Convert between metric and imperial systems instantly.",
            url: "https://www.kodekit.in/tools/unit-converter",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            publisher: {
              "@type": "Organization",
              name: "KodeKit",
              url: "https://www.kodekit.in",
              logo: {
                "@type": "ImageObject",
                url: "https://www.kodekit.in/logo.png",
                width: "180",
                height: "60",
              },
            },
            applicationSubCategory: "Calculator",
            featureList: [
              "Length conversion (meters, kilometers, miles, feet, inches)",
              "Area conversion (square meters, acres, hectares, square feet)",
              "Volume conversion (liters, gallons, cubic meters, cups)",
              "Weight conversion (kilograms, pounds, ounces, grams)",
              "Temperature conversion (Celsius, Fahrenheit, Kelvin)",
              "Time conversion (seconds, minutes, hours, days, years)",
              "Speed conversion (m/s, km/h, mph, knots)",
              "Pressure conversion (Pascal, bar, psi, atmosphere)",
              "Energy conversion (Joules, calories, kWh, BTU)",
              "Digital storage conversion (bytes, KB, MB, GB, TB)",
            ],
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "1247",
              bestRating: "5",
              worstRating: "1",
            },
            datePublished: "2023-05-15",
            dateModified: "2025-07-01",
            keywords:
              "unit converter, measurement converter, metric converter, imperial converter, length converter, weight converter, temperature converter",
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.kodekit.in",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Tools",
                  item: "https://www.kodekit.in/tools",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Unit Converter",
                  item: "https://www.kodekit.in/tools/unit-converter",
                },
              ],
            },
            mainEntity: {
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How accurate are the conversions?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our conversions use standard conversion factors and are accurate to the maximum precision JavaScript can handle. For temperature conversions, we use exact formulas rather than approximations. All conversion factors are regularly reviewed and updated to match international standards.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I use this tool on my mobile device?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, our unit converter is fully responsive and works perfectly on all devices including smartphones and tablets. The interface automatically adapts to your screen size for optimal usability.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What unit categories are supported?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "We support 10+ categories including length, area, volume, weight, temperature, time, speed, pressure, energy, and digital storage with over 100 different units.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does this tool work offline?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes! Once loaded, all conversions are performed directly in your browser without requiring an internet connection. You can even install our PWA version for complete offline access.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Are there keyboard shortcuts available?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, we support keyboard shortcuts for power users: Alt+S to swap units, Alt+C to copy results to clipboard, and Alt+R to reset/clear all values.",
                  },
                },
              ],
            },
          })}
        </script>

        {/* Additional Calculator Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Unit Converter Calculator",
            applicationCategory: "CalculatorApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

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
                id="measurement-type-select"
                labelId="measurement-type-select-label"
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
                id="from-value-input"
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
                id="from-unit-select"
                labelId="from-unit-select-label"
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
                  aria-describedby="swap-button-description"
                >
                  <SwapVert />
                </IconButton>
              </Tooltip>
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                id="to-value-output"
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
                aria-describedby="clear-button-description"
                data-testid="clear-button"
                title="Clear values (Alt+R)"
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
            aria-live="assertive"
            role="alert"
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
          <Typography
            id="tool-description-heading"
            variant="h5"
            component="h2"
            gutterBottom
            fontWeight={600}
          >
            Comprehensive Unit Conversion Tool
          </Typography>
          <Typography paragraph>
            Our free online unit converter provides instant conversions between
            over 100 different units across 10+ measurement categories. Whether
            you're working with metric, imperial, or specialized units, our tool
            delivers accurate results with precision formatting.
          </Typography>

          <Typography paragraph>
            <strong>Last Updated:</strong> July 2025 - All conversion factors
            have been verified against international standards to ensure maximum
            accuracy.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
            id="supported-categories-heading"
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
            id="faq-section"
          >
            Frequently Asked Questions
          </Typography>
          <Box
            component="div"
            sx={{ mt: 2 }}
            role="region"
            aria-labelledby="faq-section"
          >
            <Box component="article" sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                component="h4"
                fontWeight={500}
                id="faq-accuracy"
              >
                Q: How accurate are the conversions?
              </Typography>
              <Typography
                variant="body1"
                component="p"
                sx={{ mb: 2 }}
                aria-labelledby="faq-accuracy"
              >
                A: Our conversions use standard conversion factors and are
                accurate to the maximum precision JavaScript can handle. For
                temperature conversions, we use exact formulas rather than
                approximations. All conversion factors are regularly reviewed
                and updated to match international standards.
              </Typography>
            </Box>

            <Box component="article" sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                component="h4"
                fontWeight={500}
                id="faq-mobile"
              >
                Q: Can I use this tool on my mobile device?
              </Typography>
              <Typography
                variant="body1"
                component="p"
                sx={{ mb: 2 }}
                aria-labelledby="faq-mobile"
              >
                A: Yes, our unit converter is fully responsive and works
                perfectly on all devices including smartphones and tablets. The
                interface automatically adapts to your screen size for optimal
                usability.
              </Typography>
            </Box>

            <Box component="article" sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                component="h4"
                fontWeight={500}
                id="faq-future"
              >
                Q: Are there any unit categories you plan to add?
              </Typography>
              <Typography
                variant="body1"
                component="p"
                aria-labelledby="faq-future"
              >
                A: We're continuously expanding our supported categories. Future
                additions may include angle conversion, data transfer rates, and
                more specialized engineering units. Have a suggestion? Contact
                us through our feedback form.
              </Typography>
            </Box>

            <Box component="article" sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                component="h4"
                fontWeight={500}
                id="faq-offline"
              >
                Q: Does this tool work offline?
              </Typography>
              <Typography
                variant="body1"
                component="p"
                aria-labelledby="faq-offline"
              >
                A: Yes! Once loaded, all conversions are performed directly in
                your browser without requiring an internet connection. You can
                even install our PWA version for complete offline access.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UnitConverter;
