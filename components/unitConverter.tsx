"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Paper,
  IconButton,
  Divider,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReplayIcon from "@mui/icons-material/SwapHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import StraightenIcon from "@mui/icons-material/Straighten";
import ScaleIcon from "@mui/icons-material/Scale";
import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import SpeedIcon from "@mui/icons-material/Speed";
import BoltIcon from "@mui/icons-material/Bolt";
import CompressIcon from "@mui/icons-material/Compress";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

// Define proper interfaces for units and categories
interface Unit {
  id: string;
  name: string;
  symbol: string;
  toBase: number | ((value: number) => number);
  fromBase?: (value: number) => number;
}

interface UnitCategory {
  id: string;
  name: string;
  icon: React.ReactElement;
  units: Unit[];
}

interface ConversionHistory {
  id: string;
  fromValue: string;
  fromUnit: string;
  fromSymbol: string;
  toValue: string;
  toUnit: string;
  toSymbol: string;
  category: string;
  timestamp: Date;
}

// Unit conversion data
const unitCategories: UnitCategory[] = [
  {
    id: "length",
    name: "Length",
    icon: <StraightenIcon />,
    units: [
      { id: "meter", name: "Meter", symbol: "m", toBase: 1 },
      { id: "kilometer", name: "Kilometer", symbol: "km", toBase: 1000 },
      { id: "centimeter", name: "Centimeter", symbol: "cm", toBase: 0.01 },
      { id: "millimeter", name: "Millimeter", symbol: "mm", toBase: 0.001 },
      { id: "mile", name: "Mile", symbol: "mi", toBase: 1609.34 },
      { id: "yard", name: "Yard", symbol: "yd", toBase: 0.9144 },
      { id: "foot", name: "Foot", symbol: "ft", toBase: 0.3048 },
      { id: "inch", name: "Inch", symbol: "in", toBase: 0.0254 },
      {
        id: "nautical-mile",
        name: "Nautical Mile",
        symbol: "nmi",
        toBase: 1852,
      },
    ],
  },
  {
    id: "weight",
    name: "Weight",
    icon: <ScaleIcon />,
    units: [
      { id: "kilogram", name: "Kilogram", symbol: "kg", toBase: 1 },
      { id: "gram", name: "Gram", symbol: "g", toBase: 0.001 },
      { id: "milligram", name: "Milligram", symbol: "mg", toBase: 0.000001 },
      { id: "pound", name: "Pound", symbol: "lb", toBase: 0.453592 },
      { id: "ounce", name: "Ounce", symbol: "oz", toBase: 0.0283495 },
      { id: "ton", name: "Metric Ton", symbol: "t", toBase: 1000 },
      { id: "stone", name: "Stone", symbol: "st", toBase: 6.35029 },
      { id: "us-ton", name: "US Ton", symbol: "ton", toBase: 907.185 },
    ],
  },
  {
    id: "temperature",
    name: "Temperature",
    icon: <DeviceThermostatIcon />,
    units: [
      {
        id: "celsius",
        name: "Celsius",
        symbol: "°C",
        toBase: (c) => c,
        fromBase: (c) => c,
      },
      {
        id: "fahrenheit",
        name: "Fahrenheit",
        symbol: "°F",
        toBase: (f) => ((f - 32) * 5) / 9,
        fromBase: (c) => (c * 9) / 5 + 32,
      },
      {
        id: "kelvin",
        name: "Kelvin",
        symbol: "K",
        toBase: (k) => k - 273.15,
        fromBase: (c) => c + 273.15,
      },
    ],
  },
  {
    id: "time",
    name: "Time",
    icon: <AccessTimeIcon />,
    units: [
      { id: "second", name: "Second", symbol: "s", toBase: 1 },
      { id: "millisecond", name: "Millisecond", symbol: "ms", toBase: 0.001 },
      {
        id: "microsecond",
        name: "Microsecond",
        symbol: "μs",
        toBase: 0.000001,
      },
      { id: "minute", name: "Minute", symbol: "min", toBase: 60 },
      { id: "hour", name: "Hour", symbol: "h", toBase: 3600 },
      { id: "day", name: "Day", symbol: "d", toBase: 86400 },
      { id: "week", name: "Week", symbol: "wk", toBase: 604800 },
      { id: "month", name: "Month (avg)", symbol: "mo", toBase: 2629800 },
      { id: "year", name: "Year", symbol: "yr", toBase: 31557600 },
    ],
  },
  {
    id: "area",
    name: "Area",
    icon: <SquareFootIcon />,
    units: [
      { id: "square-meter", name: "Square Meter", symbol: "m²", toBase: 1 },
      {
        id: "square-kilometer",
        name: "Square Kilometer",
        symbol: "km²",
        toBase: 1000000,
      },
      {
        id: "square-centimeter",
        name: "Square Centimeter",
        symbol: "cm²",
        toBase: 0.0001,
      },
      {
        id: "square-millimeter",
        name: "Square Millimeter",
        symbol: "mm²",
        toBase: 0.000001,
      },
      {
        id: "square-mile",
        name: "Square Mile",
        symbol: "mi²",
        toBase: 2589988.11,
      },
      {
        id: "square-yard",
        name: "Square Yard",
        symbol: "yd²",
        toBase: 0.836127,
      },
      {
        id: "square-foot",
        name: "Square Foot",
        symbol: "ft²",
        toBase: 0.092903,
      },
      {
        id: "square-inch",
        name: "Square Inch",
        symbol: "in²",
        toBase: 0.00064516,
      },
      { id: "acre", name: "Acre", symbol: "ac", toBase: 4046.86 },
      { id: "hectare", name: "Hectare", symbol: "ha", toBase: 10000 },
    ],
  },
  {
    id: "volume",
    name: "Volume",
    icon: <ViewInArIcon />,
    units: [
      { id: "liter", name: "Liter", symbol: "L", toBase: 1 },
      { id: "milliliter", name: "Milliliter", symbol: "mL", toBase: 0.001 },
      { id: "cubic-meter", name: "Cubic Meter", symbol: "m³", toBase: 1000 },
      {
        id: "cubic-centimeter",
        name: "Cubic Centimeter",
        symbol: "cm³",
        toBase: 0.001,
      },
      { id: "gallon-us", name: "Gallon (US)", symbol: "gal", toBase: 3.78541 },
      {
        id: "gallon-uk",
        name: "Gallon (UK)",
        symbol: "gal UK",
        toBase: 4.54609,
      },
      { id: "quart-us", name: "Quart (US)", symbol: "qt", toBase: 0.946353 },
      { id: "pint-us", name: "Pint (US)", symbol: "pt", toBase: 0.473176 },
      { id: "cup-us", name: "Cup (US)", symbol: "cup", toBase: 0.236588 },
      {
        id: "fluid-ounce-us",
        name: "Fluid Ounce (US)",
        symbol: "fl oz",
        toBase: 0.0295735,
      },
      {
        id: "tablespoon-us",
        name: "Tablespoon (US)",
        symbol: "tbsp",
        toBase: 0.0147868,
      },
      {
        id: "teaspoon-us",
        name: "Teaspoon (US)",
        symbol: "tsp",
        toBase: 0.00492892,
      },
    ],
  },
  {
    id: "data",
    name: "Data",
    icon: <DataUsageIcon />,
    units: [
      { id: "bit", name: "Bit", symbol: "bit", toBase: 1 / 8 },
      { id: "byte", name: "Byte", symbol: "B", toBase: 1 },
      { id: "kilobyte", name: "Kilobyte", symbol: "KB", toBase: 1000 },
      { id: "megabyte", name: "Megabyte", symbol: "MB", toBase: 1000000 },
      { id: "gigabyte", name: "Gigabyte", symbol: "GB", toBase: 1000000000 },
      { id: "terabyte", name: "Terabyte", symbol: "TB", toBase: 1000000000000 },
      {
        id: "petabyte",
        name: "Petabyte",
        symbol: "PB",
        toBase: 1000000000000000,
      },
      { id: "kibibyte", name: "Kibibyte", symbol: "KiB", toBase: 1024 },
      { id: "mebibyte", name: "Mebibyte", symbol: "MiB", toBase: 1048576 },
      { id: "gibibyte", name: "Gibibyte", symbol: "GiB", toBase: 1073741824 },
      {
        id: "tebibyte",
        name: "Tebibyte",
        symbol: "TiB",
        toBase: 1099511627776,
      },
      {
        id: "pebibyte",
        name: "Pebibyte",
        symbol: "PiB",
        toBase: 1125899906842624,
      },
    ],
  },
  {
    id: "speed",
    name: "Speed",
    icon: <SpeedIcon />,
    units: [
      {
        id: "meter-per-second",
        name: "Meter per Second",
        symbol: "m/s",
        toBase: 1,
      },
      {
        id: "kilometer-per-hour",
        name: "Kilometer per Hour",
        symbol: "km/h",
        toBase: 0.277778,
      },
      {
        id: "mile-per-hour",
        name: "Mile per Hour",
        symbol: "mph",
        toBase: 0.44704,
      },
      { id: "knot", name: "Knot", symbol: "kn", toBase: 0.514444 },
      {
        id: "foot-per-second",
        name: "Foot per Second",
        symbol: "ft/s",
        toBase: 0.3048,
      },
    ],
  },
  {
    id: "energy",
    name: "Energy",
    icon: <BoltIcon />,
    units: [
      { id: "joule", name: "Joule", symbol: "J", toBase: 1 },
      { id: "kilojoule", name: "Kilojoule", symbol: "kJ", toBase: 1000 },
      { id: "calorie", name: "Calorie", symbol: "cal", toBase: 4.184 },
      { id: "kilocalorie", name: "Kilocalorie", symbol: "kcal", toBase: 4184 },
      { id: "watt-hour", name: "Watt-hour", symbol: "Wh", toBase: 3600 },
      {
        id: "kilowatt-hour",
        name: "Kilowatt-hour",
        symbol: "kWh",
        toBase: 3600000,
      },
      {
        id: "electronvolt",
        name: "Electronvolt",
        symbol: "eV",
        toBase: 1.602176634e-19,
      },
      {
        id: "british-thermal-unit",
        name: "British Thermal Unit",
        symbol: "BTU",
        toBase: 1055.06,
      },
      {
        id: "foot-pound",
        name: "Foot-pound",
        symbol: "ft⋅lb",
        toBase: 1.35582,
      },
    ],
  },
  {
    id: "pressure",
    name: "Pressure",
    icon: <CompressIcon />,
    units: [
      { id: "pascal", name: "Pascal", symbol: "Pa", toBase: 1 },
      { id: "kilopascal", name: "Kilopascal", symbol: "kPa", toBase: 1000 },
      { id: "bar", name: "Bar", symbol: "bar", toBase: 100000 },
      {
        id: "psi",
        name: "Pound per Square Inch",
        symbol: "psi",
        toBase: 6894.76,
      },
      { id: "atmosphere", name: "Atmosphere", symbol: "atm", toBase: 101325 },
      { id: "torr", name: "Torr", symbol: "Torr", toBase: 133.322 },
      {
        id: "millimeter-of-mercury",
        name: "Millimeter of Mercury",
        symbol: "mmHg",
        toBase: 133.322,
      },
      {
        id: "inch-of-mercury",
        name: "Inch of Mercury",
        symbol: "inHg",
        toBase: 3386.39,
      },
    ],
  },
  {
    id: "currency",
    name: "Currency",
    icon: <MonetizationOnIcon />,
    units: [
      { id: "usd", name: "US Dollar", symbol: "$", toBase: 1 },
      { id: "eur", name: "Euro", symbol: "€", toBase: 1.08 },
      { id: "gbp", name: "British Pound", symbol: "£", toBase: 1.27 },
      { id: "jpy", name: "Japanese Yen", symbol: "¥", toBase: 0.0067 },
      { id: "cad", name: "Canadian Dollar", symbol: "C$", toBase: 0.73 },
      { id: "aud", name: "Australian Dollar", symbol: "A$", toBase: 0.66 },
      { id: "chf", name: "Swiss Franc", symbol: "Fr", toBase: 1.12 },
      { id: "cny", name: "Chinese Yuan", symbol: "¥", toBase: 0.14 },
      { id: "inr", name: "Indian Rupee", symbol: "₹", toBase: 0.012 },
      { id: "btc", name: "Bitcoin", symbol: "₿", toBase: 61000 },
    ],
  },
];

export function UnitConverter() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [categoryIndex, setCategoryIndex] = useState<number>(0);
  const [fromUnitId, setFromUnitId] = useState<string>("");
  const [toUnitId, setToUnitId] = useState<string>("");
  const [fromValue, setFromValue] = useState<string>("1"); // Set default value to "1"
  const [toValue, setToValue] = useState<string>("");
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const currentCategory = unitCategories[categoryIndex];
  const isTemperature = currentCategory.id === "temperature";

  // Set default units when category changes
  useEffect(() => {
    if (currentCategory.units.length > 0) {
      setFromUnitId(currentCategory.units[0].id);
      setToUnitId(
        currentCategory.units.length > 1
          ? currentCategory.units[1].id
          : currentCategory.units[0].id
      );
    }
    setFromValue("");
    setToValue("");
  }, [categoryIndex, currentCategory]);

  // Convert values when inputs change
  useEffect(() => {
    handleConvert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromValue, fromUnitId, toUnitId]);

  const getUnitById = (id: string): Unit | undefined => {
    return currentCategory.units.find((unit) => unit.id === id);
  };

  const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromValue(e.target.value);
    // Trigger conversion after a short delay to allow state to update
    setTimeout(() => {
      handleConvert();
    }, 0);
  };

  const handleClearInput = () => {
    setFromValue("");
    setToValue("");
  };

  const handleSwapUnits = () => {
    setFromUnitId(toUnitId);
    setToUnitId(fromUnitId);
    setFromValue(toValue);
  };

  const handleCopyResult = () => {
    if (toValue) {
      navigator.clipboard.writeText(toValue);
      // You could add a toast notification here
    }
  };

  const formatNumber = (num: number): string => {
    if (Math.abs(num) < 0.000001 || Math.abs(num) > 1000000000) {
      return num.toExponential(6);
    }

    // For most values, use fixed precision but trim trailing zeros
    const fixed = num.toFixed(6);
    return fixed.replace(/\.?0+$/, "");
  };

  const handleConvert = () => {
    if (!fromValue || isNaN(Number(fromValue)) || !fromUnitId || !toUnitId) {
      setToValue("");
      return;
    }

    const fromUnit = getUnitById(fromUnitId);
    const toUnit = getUnitById(toUnitId);

    if (!fromUnit || !toUnit) {
      setToValue("Error: Invalid units");
      return;
    }

    const numValue = Number(fromValue);

    try {
      let result: number;

      if (isTemperature) {
        // For temperature, use special conversion functions
        const toCelsius =
          typeof fromUnit.toBase === "function"
            ? fromUnit.toBase(numValue)
            : numValue;
        result =
          typeof toUnit.fromBase === "function"
            ? toUnit.fromBase(toCelsius)
            : toCelsius;
      } else if (currentCategory.id === "data") {
        // Special handling for data units to fix the conversion issue
        if (fromUnitId === "gigabyte" && toUnitId === "megabyte") {
          result = numValue * 1000; // Ensure 1 GB = 1000 MB (not 1024)
        } else if (fromUnitId === "megabyte" && toUnitId === "gigabyte") {
          result = numValue / 1000; // Ensure 1000 MB = 1 GB
        } else {
          // Convert to bytes first, then to target unit
          const valueInBytes = numValue * (fromUnit.toBase as number);
          result = valueInBytes / (toUnit.toBase as number);
        }
      } else {
        // For other units, convert to base unit then to target unit
        const valueInBaseUnit = numValue * (fromUnit.toBase as number);
        result = valueInBaseUnit / (toUnit.toBase as number);
      }

      // Format the result
      const formattedResult = formatNumber(result);
      setToValue(formattedResult);

      // Add to history
      const newHistoryItem: ConversionHistory = {
        id: Date.now().toString(),
        fromValue,
        fromUnit: fromUnit.name,
        fromSymbol: fromUnit.symbol,
        toValue: formattedResult,
        toUnit: toUnit.name,
        toSymbol: toUnit.symbol,
        category: currentCategory.name,
        timestamp: new Date(),
      };

      // Only add to history if it's a new conversion
      const isDuplicate = history.some(
        (item) =>
          item.fromValue === newHistoryItem.fromValue &&
          item.fromUnit === newHistoryItem.fromUnit &&
          item.toUnit === newHistoryItem.toUnit
      );

      if (!isDuplicate) {
        setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      setToValue("Error");
      console.error("Conversion error:", error);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        maxWidth: 900,
        mx: "auto",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5" component="h1" fontWeight="medium">
          Unit Converter
        </Typography>
        <Tooltip title={showHistory ? "Hide history" : "Show history"}>
          <IconButton
            color="inherit"
            onClick={() => setShowHistory(!showHistory)}
            disabled={history.length === 0}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={categoryIndex}
          onChange={(_, newValue) => setCategoryIndex(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="unit categories"
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: "medium",
              px: 2,
            },
          }}
        >
          {unitCategories.map((category, index) => (
            <Tab
              key={category.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ fontSize: "small" }}>{category.icon}</Box>
                  {category.name}
                </Box>
              }
              id={`unit-tab-${index}`}
              aria-controls={`unit-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {/* Main Converter */}
      <Box sx={{ p: 3 }}>
        {/* From Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            From
          </Typography>
          <TextField
            select
            fullWidth
            value={fromUnitId}
            onChange={(e) => setFromUnitId(e.target.value)}
            variant="outlined"
            margin="normal"
            sx={{ mb: 2 }}
          >
            {currentCategory.units.map((unit) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.name} ({unit.symbol})
              </MenuItem>
            ))}
          </TextField>

          {/* Always visible input field with explicit height and border */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              height: 56, // Explicit height to match MUI default
              px: 2,
              width: "100%",
              bgcolor: "background.paper",
            }}
          >
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              placeholder="Enter value"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                backgroundColor: "transparent",
              }}
            />
            <IconButton
              size="small"
              onClick={handleClearInput}
              disabled={!fromValue}
              edge="end"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Swap Button - Centered */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <IconButton
            onClick={handleSwapUnits}
            sx={{
              bgcolor: "rgba(0, 0, 0, 0.04)",
              p: 1.5,
              borderRadius: "50%",
            }}
          >
            <SwapHorizIcon />
          </IconButton>
        </Box>

        {/* To Section */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ fontWeight: "medium" }}
          >
            To
          </Typography>
          <TextField
            select
            fullWidth
            value={toUnitId}
            onChange={(e) => setToUnitId(e.target.value)}
            variant="outlined"
            margin="normal"
            sx={{ mb: 2 }}
          >
            {currentCategory.units.map((unit) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.name} ({unit.symbol})
              </MenuItem>
            ))}
          </TextField>

          {/* Always visible output field with explicit height and border */}
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              height: 56, // Explicit height to match MUI default
              px: 2,
              width: "100%",
              bgcolor: "background.paper",
            }}
          >
            <input
              type="text"
              value={toValue}
              readOnly
              placeholder="Converted value will appear here"
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                backgroundColor: "transparent",
              }}
            />
            <IconButton
              size="small"
              onClick={handleCopyResult}
              disabled={!toValue}
              edge="end"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Conversion Formula */}
        {fromUnitId && toUnitId && fromValue && toValue && (
          <Box
            sx={{
              p: 2,
              bgcolor: "rgba(0,0,0,0.03)",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {`${fromValue} ${
                getUnitById(fromUnitId)?.symbol || ""
              } = ${toValue} ${getUnitById(toUnitId)?.symbol || ""}`}
            </Typography>
          </Box>
        )}
      </Box>

      {/* History Panel */}
      {showHistory && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography variant="subtitle1" gutterBottom>
            Conversion History
          </Typography>
          {history.length > 0 ? (
            <List dense>
              {history.map((item) => (
                <ListItem
                  key={item.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => {
                        setCategoryIndex(
                          unitCategories.findIndex(
                            (cat) => cat.name === item.category
                          )
                        );
                        setFromValue(item.fromValue);
                        // Find the unit IDs
                        const category = unitCategories.find(
                          (cat) => cat.name === item.category
                        );
                        if (category) {
                          const fromUnit = category.units.find(
                            (u) => u.name === item.fromUnit
                          );
                          const toUnit = category.units.find(
                            (u) => u.name === item.toUnit
                          );
                          if (fromUnit) setFromUnitId(fromUnit.id);
                          if (toUnit) setToUnitId(toUnit.id);
                        }
                      }}
                    >
                      <ReplayIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={`${item.fromValue} ${item.fromSymbol} = ${item.toValue} ${item.toSymbol}`}
                    secondary={`${
                      item.category
                    } • ${item.timestamp.toLocaleTimeString()}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2 }}
            >
              No conversion history yet
            </Typography>
          )}
        </Box>
      )}
    </Paper>
  );
}
