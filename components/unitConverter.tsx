"use client";

import React from "react";

import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  type SelectChangeEvent,
  Card,
  Button,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
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
import AdSense from "./AdSense";

// Unit conversion data
const unitCategories = [
  {
    name: "Length",
    icon: <StraightenIcon />,
    units: [
      { name: "Meter", symbol: "m", toBase: 1 },
      { name: "Kilometer", symbol: "km", toBase: 1000 },
      { name: "Centimeter", symbol: "cm", toBase: 0.01 },
      { name: "Millimeter", symbol: "mm", toBase: 0.001 },
      { name: "Mile", symbol: "mi", toBase: 1609.34 },
      { name: "Yard", symbol: "yd", toBase: 0.9144 },
      { name: "Foot", symbol: "ft", toBase: 0.3048 },
      { name: "Inch", symbol: "in", toBase: 0.0254 },
    ],
  },
  {
    name: "Weight",
    icon: <ScaleIcon />,
    units: [
      { name: "Kilogram", symbol: "kg", toBase: 1 },
      { name: "Gram", symbol: "g", toBase: 0.001 },
      { name: "Milligram", symbol: "mg", toBase: 0.000001 },
      { name: "Pound", symbol: "lb", toBase: 0.453592 },
      { name: "Ounce", symbol: "oz", toBase: 0.0283495 },
      { name: "Ton", symbol: "t", toBase: 1000 },
    ],
  },
  {
    name: "Temperature",
    icon: <DeviceThermostatIcon />,
    units: [
      {
        name: "Celsius",
        symbol: "°C",
        toBase: (c: number) => c,
        fromBase: (c: number) => c,
      },
      {
        name: "Fahrenheit",
        symbol: "°F",
        toBase: (f: number) => ((f - 32) * 5) / 9,
        fromBase: (c: number) => (c * 9) / 5 + 32,
      },
      {
        name: "Kelvin",
        symbol: "K",
        toBase: (k: number) => k - 273.15,
        fromBase: (c: number) => c + 273.15,
      },
    ],
  },
  {
    name: "Time",
    icon: <AccessTimeIcon />,
    units: [
      { name: "Second", symbol: "s", toBase: 1 },
      { name: "Minute", symbol: "min", toBase: 60 },
      { name: "Hour", symbol: "h", toBase: 3600 },
      { name: "Day", symbol: "d", toBase: 86400 },
      { name: "Week", symbol: "wk", toBase: 604800 },
      { name: "Month (avg)", symbol: "mo", toBase: 2629746 },
      { name: "Year", symbol: "yr", toBase: 31556952 },
    ],
  },
  {
    name: "Area",
    icon: <SquareFootIcon />,
    units: [
      { name: "Square Meter", symbol: "m²", toBase: 1 },
      { name: "Square Kilometer", symbol: "km²", toBase: 1000000 },
      { name: "Square Centimeter", symbol: "cm²", toBase: 0.0001 },
      { name: "Square Millimeter", symbol: "mm²", toBase: 0.000001 },
      { name: "Square Mile", symbol: "mi²", toBase: 2589988.11 },
      { name: "Square Yard", symbol: "yd²", toBase: 0.836127 },
      { name: "Square Foot", symbol: "ft²", toBase: 0.092903 },
      { name: "Square Inch", symbol: "in²", toBase: 0.00064516 },
      { name: "Acre", symbol: "ac", toBase: 4046.86 },
      { name: "Hectare", symbol: "ha", toBase: 10000 },
    ],
  },
  {
    name: "Volume",
    icon: <ViewInArIcon />,
    units: [
      { name: "Liter", symbol: "L", toBase: 1 },
      { name: "Milliliter", symbol: "mL", toBase: 0.001 },
      { name: "Cubic Meter", symbol: "m³", toBase: 1000 },
      { name: "Gallon (US)", symbol: "gal", toBase: 3.78541 },
      { name: "Quart (US)", symbol: "qt", toBase: 0.946353 },
      { name: "Pint (US)", symbol: "pt", toBase: 0.473176 },
      { name: "Cup (US)", symbol: "cup", toBase: 0.236588 },
      { name: "Fluid Ounce (US)", symbol: "fl oz", toBase: 0.0295735 },
    ],
  },
  {
    name: "Digital",
    icon: <DataUsageIcon />,
    units: [
      { name: "Bit", symbol: "bit", toBase: 1 / 8 },
      { name: "Byte", symbol: "B", toBase: 1 },
      { name: "Kilobyte", symbol: "KB", toBase: 1000 },
      { name: "Megabyte", symbol: "MB", toBase: 1000000 },
      { name: "Gigabyte", symbol: "GB", toBase: 1000000000 },
      { name: "Terabyte", symbol: "TB", toBase: 1000000000000 },
      { name: "Kibibyte", symbol: "KiB", toBase: 1024 },
      { name: "Mebibyte", symbol: "MiB", toBase: 1048576 },
      { name: "Gibibyte", symbol: "GiB", toBase: 1073741824 },
      { name: "Tebibyte", symbol: "TiB", toBase: 1099511627776 },
    ],
  },
  {
    name: "Speed",
    icon: <SpeedIcon />,
    units: [
      { name: "Meter per Second", symbol: "m/s", toBase: 1 },
      { name: "Kilometer per Hour", symbol: "km/h", toBase: 0.277778 },
      { name: "Mile per Hour", symbol: "mph", toBase: 0.44704 },
      { name: "Knot", symbol: "kn", toBase: 0.514444 },
      { name: "Foot per Second", symbol: "ft/s", toBase: 0.3048 },
    ],
  },
  {
    name: "Energy",
    icon: <BoltIcon />,
    units: [
      { name: "Joule", symbol: "J", toBase: 1 },
      { name: "Kilojoule", symbol: "kJ", toBase: 1000 },
      { name: "Calorie", symbol: "cal", toBase: 4.184 },
      { name: "Kilocalorie", symbol: "kcal", toBase: 4184 },
      { name: "Watt-hour", symbol: "Wh", toBase: 3600 },
      { name: "Kilowatt-hour", symbol: "kWh", toBase: 3600000 },
      { name: "Electronvolt", symbol: "eV", toBase: 1.602176634e-19 },
      { name: "British Thermal Unit", symbol: "BTU", toBase: 1055.06 },
    ],
  },
  {
    name: "Pressure",
    icon: <CompressIcon />,
    units: [
      { name: "Pascal", symbol: "Pa", toBase: 1 },
      { name: "Kilopascal", symbol: "kPa", toBase: 1000 },
      { name: "Bar", symbol: "bar", toBase: 100000 },
      { name: "Pound per Square Inch", symbol: "psi", toBase: 6894.76 },
      { name: "Atmosphere", symbol: "atm", toBase: 101325 },
      { name: "Millimeter of Mercury", symbol: "mmHg", toBase: 133.322 },
      { name: "Inch of Mercury", symbol: "inHg", toBase: 3386.39 },
    ],
  },
];

interface ConversionHistory {
  fromValue: string;
  fromUnit: string;
  fromSymbol: string;
  toValue: string;
  toUnit: string;
  toSymbol: string;
  category: string;
  timestamp: Date;
}

export function UnitConverter() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [fromUnitIndex, setFromUnitIndex] = useState(0);
  const [toUnitIndex, setToUnitIndex] = useState(1);
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const theme = useTheme();

  const currentCategory = unitCategories[categoryIndex];
  const isTemperature = currentCategory.name === "Temperature";

  // Initialize conversion on component mount
  useEffect(() => {
    handleConvert();
  }, []);

  // Calculate conversion when category or units change
  useEffect(() => {
    if (fromValue) {
      handleConvert();
    }
  }, [categoryIndex, fromUnitIndex, toUnitIndex]);

  // Calculate conversion
  const handleConvert = () => {
    if (!fromValue || isNaN(Number(fromValue))) {
      setToValue("");
      return;
    }

    const fromUnit = currentCategory.units[fromUnitIndex];
    const toUnit = currentCategory.units[toUnitIndex];
    const numValue = Number(fromValue);

    try {
      let result: number;

      if (isTemperature) {
        // For temperature, we need to use the special conversion functions
        const toCelsius =
          typeof fromUnit.toBase === "function"
            ? fromUnit.toBase(numValue)
            : numValue;
        result =
          "fromBase" in toUnit && typeof toUnit.fromBase === "function"
            ? toUnit.fromBase(toCelsius)
            : toCelsius;
      } else {
        // For other units, convert to base unit then to target unit
        const valueInBaseUnit = numValue * (fromUnit.toBase as number);
        result = valueInBaseUnit / (toUnit.toBase as number);
      }

      // Format the result based on its magnitude
      const formattedResult = formatNumber(result);
      setToValue(formattedResult);

      // Add to history
      const newHistoryItem: ConversionHistory = {
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

  // Format number to appropriate precision
  const formatNumber = (num: number): string => {
    if (isNaN(num)) return "Error";

    if (Math.abs(num) < 0.000001 && num !== 0) {
      return num.toExponential(6);
    } else if (Math.abs(num) >= 1000000) {
      return num.toExponential(6);
    } else {
      // Use appropriate decimal places based on the number's magnitude
      let decimalPlaces = 6;

      if (num % 1 === 0) {
        decimalPlaces = 0;
      } else if (Math.abs(num) >= 100) {
        decimalPlaces = 2;
      } else if (Math.abs(num) >= 10) {
        decimalPlaces = 3;
      } else if (Math.abs(num) >= 1) {
        decimalPlaces = 4;
      }

      return num.toFixed(decimalPlaces).replace(/\.?0+$/, "");
    }
  };

  const handleFromUnitChange = (event: SelectChangeEvent) => {
    const newIndex = Number.parseInt(event.target.value);
    // Don't allow both units to be the same
    if (newIndex === toUnitIndex) {
      setToUnitIndex(fromUnitIndex);
    }
    setFromUnitIndex(newIndex);
  };

  const handleToUnitChange = (event: SelectChangeEvent) => {
    const newIndex = Number.parseInt(event.target.value);
    // Don't allow both units to be the same
    if (newIndex === fromUnitIndex) {
      setFromUnitIndex(toUnitIndex);
    }
    setToUnitIndex(newIndex);
  };

  const handleFromValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFromValue(value);

    // Only convert if the value is valid
    if (value && !isNaN(Number(value))) {
      handleConvert();
    } else {
      setToValue("");
    }
  };

  const handleSwapUnits = () => {
    // Swap unit indices
    const tempIndex = fromUnitIndex;
    setFromUnitIndex(toUnitIndex);
    setToUnitIndex(tempIndex);

    // Swap values
    const tempValue = fromValue;
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleHistoryItemClick = (item: ConversionHistory) => {
    // Find the indices of the units in the current category
    const category = unitCategories.findIndex(
      (cat) => cat.name === item.category
    );
    if (category !== -1) {
      setCategoryIndex(category);

      const fromUnitIdx = unitCategories[category].units.findIndex(
        (unit) => unit.name === item.fromUnit
      );
      const toUnitIdx = unitCategories[category].units.findIndex(
        (unit) => unit.name === item.toUnit
      );

      if (fromUnitIdx !== -1 && toUnitIdx !== -1) {
        setFromUnitIndex(fromUnitIdx);
        setToUnitIndex(toUnitIdx);
        setFromValue(item.fromValue);
        setToValue(item.toValue);
      }
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8f5ff", py: 4, borderRadius: 2 }}>
      <Typography
        variant="h3"
        component="h1"
        align="center"
        sx={{ mb: 4, color: "#7c4dff", fontWeight: 600 }}
      >
        Unit Converter
      </Typography>

      {/* Category Tabs */}
      <Box sx={{ display: "flex", overflowX: "auto", px: 2, mb: 4, pb: 1 }}>
        {unitCategories.map((category, index) => (
          <Box
            key={category.name}
            onClick={() => setCategoryIndex(index)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mx: 1,
              px: 2,
              py: 1,
              borderRadius: 2,
              cursor: "pointer",
              minWidth: "80px",
              bgcolor: categoryIndex === index ? "#7c4dff" : "transparent",
              color: categoryIndex === index ? "white" : "text.secondary",
              transition: "all 0.2s",
              "&:hover": {
                bgcolor:
                  categoryIndex === index
                    ? "#7c4dff"
                    : "rgba(124, 77, 255, 0.1)",
              },
            }}
          >
            {React.cloneElement(category.icon, { sx: { fontSize: "24px" } })}
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {category.name}
            </Typography>
          </Box>
        ))}
      </Box>

      <Paper
        elevation={1}
        sx={{
          mx: "auto",
          maxWidth: 800,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Category Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#7c4dff",
            }}
          >
            {React.cloneElement(currentCategory.icon, {
              sx: { fontSize: "24px" },
            })}
            <Typography variant="h5" sx={{ ml: 1, color: "#7c4dff" }}>
              {currentCategory.name}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* From Section */}
          <Typography variant="body1" sx={{ mb: 1, color: "text.secondary" }}>
            From
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <Select
              value={fromUnitIndex.toString()}
              onChange={handleFromUnitChange}
              displayEmpty
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {currentCategory.units.map((unit, index) => (
                <MenuItem key={unit.name} value={index.toString()}>
                  {unit.name} ({unit.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            variant="outlined"
            value={fromValue}
            onChange={handleFromValueChange}
            type="number"
            inputProps={{ step: "any" }}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />

          {/* Swap Button */}
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <IconButton
              onClick={handleSwapUnits}
              aria-label="Swap units"
              sx={{
                bgcolor: "rgba(124, 77, 255, 0.1)",
                color: "#7c4dff",
                "&:hover": {
                  bgcolor: "rgba(124, 77, 255, 0.2)",
                },
                width: 48,
                height: 48,
              }}
            >
              <SwapVertIcon />
            </IconButton>
          </Box>

          {/* To Section */}
          <Typography variant="body1" sx={{ mb: 1, color: "text.secondary" }}>
            To
          </Typography>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <Select
              value={toUnitIndex.toString()}
              onChange={handleToUnitChange}
              displayEmpty
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              {currentCategory.units.map((unit, index) => (
                <MenuItem key={unit.name} value={index.toString()}>
                  {unit.name} ({unit.symbol})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            variant="outlined"
            value={toValue}
            InputProps={{
              readOnly: true,
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "rgba(124, 77, 255, 0.05)",
                "& fieldset": {
                  borderColor: "rgba(0, 0, 0, 0.1)",
                },
              },
            }}
          />
        </Box>
      </Paper>

      {/* History Section */}
      {history.length > 0 && (
        <Box sx={{ mt: 4, mx: "auto", maxWidth: 800 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <HistoryIcon sx={{ mr: 1 }} /> Recent Conversions
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={clearHistory}
              size="small"
              sx={{ borderRadius: 2 }}
            >
              Clear History
            </Button>
          </Box>

          <Box sx={{ maxHeight: 300, overflow: "auto" }}>
            {history.slice(0, 5).map((item, index) => (
              <Card
                key={index}
                elevation={1}
                sx={{
                  p: 2,
                  mb: 2,
                  cursor: "pointer",
                  borderRadius: 2,
                  "&:hover": { bgcolor: "rgba(124, 77, 255, 0.05)" },
                  transition: "background-color 0.2s",
                }}
                onClick={() => handleHistoryItemClick(item)}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "medium", wordBreak: "break-word" }}
                >
                  {item.fromValue} {item.fromSymbol} = {item.toValue}{" "}
                  {item.toSymbol}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {item.category}: {item.fromUnit} to {item.toUnit}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.timestamp).toISOString()}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      <AdSense adSlot="1234567890" adFormat="auto" />
    </Box>
  );
}
