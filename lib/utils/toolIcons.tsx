import React from "react";
import { Box } from "@mui/material";
import {
  FileText,
  Split,
  Type,
  CaseSensitive,
  Quote,
  Palette,
  Zap,
  QrCode,
  Regex,
  Braces,
  Shield,
  Calculator,
  HandCoins,
  TrendingUp,
  Heart,
  Activity,
  Timer,
  AlarmClock,
  Clock,
  FileImage,
  Merge,
  Paintbrush2,
  Repeat,
  RotateCw,
  Plus,
  X,
  Equal,
  Grid3x3,
  CalendarDays,
  Images,
  ImageDown,
  Link2,
  FileCode2,
  Wifi,
  Hash,
  Key,
  AsteriskSquare,
  Link,
  CreditCard,
  Baby,
  Percent,
  PiggyBank,
  IndianRupee,
  Luggage,
  TrendingDown,
  CandlestickChart,
  PencilRuler,
  CloudCog,
  ArrowDownFromLine,
  Coins,
} from "lucide-react";
import { YouTube } from "@mui/icons-material";

// Icon wrapper component with consistent styling
const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      width: 48,
      height: 48,
      borderRadius: 2,
      backgroundColor: "#111827",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 8px rgba(30, 64, 175, 0.2)",
    }}
  >
    {children}
  </Box>
);

// Icon mapping function - matches actual toolsData.ts icon names
export const getToolIcon = (iconName: string): JSX.Element => {
  const iconMap: { [key: string]: React.ReactNode } = {
    // PDF Tools
    "image-to-pdf": <FileImage size={24} color="#60a5fa" />,
    "pdf-merger": <Merge size={24} color="#60a5fa" />,
    "pdf-splitter": <Split size={24} color="#60a5fa" />,
    "rotate-cw": <RotateCw size={24} color="#60a5fa" />,
    "pencil-ruler": <PencilRuler size={24} color="#60a5fa" />,

    // Text Tools
    "word-count": <Type size={24} color="#60a5fa" />,
    "text-cursor": <CaseSensitive size={24} color="#60a5fa" />,
    quote: <Quote size={24} color="#60a5fa" />,
    "file-text": <FileText size={24} color="#60a5fa" />,
    "arrow-down-from-line": <ArrowDownFromLine size={24} color="#60a5fa" />,

    // Design Tools
    palette: <Palette size={24} color="#60a5fa" />,
    "vector-bezier": <Zap size={24} color="#60a5fa" />,
    "image-compressor": <ImageDown size={24} color="#60a5fa" />,
    "image-resizer": <Images size={24} color="#60a5fa" />,
    "swatch-book": <Paintbrush2 size={24} color="#60a5fa" />,
    "qr-code": <QrCode size={24} color="#60a5fa" />,
    youtube: <YouTube sx={{ color: "#60a5fa", fontSize: 24 }} />,

    // Developer Tools
    braces: <Braces size={24} color="#60a5fa" />,
    "loan-calculator": <HandCoins size={24} color="#60a5fa" />,
    "git-compare-arrows": <Split size={24} color="#60a5fa" />,
    "css-minifier": <FileCode2 size={24} color="#60a5fa" />,
    regex: <Regex size={24} color="#60a5fa" />,
    fingerprint: <Shield size={24} color="#60a5fa" />,
    "url-shortener": <Link2 size={24} color="#60a5fa" />,
    "shield-check": <AsteriskSquare size={24} color="#60a5fa" />,
    wifi: <Wifi size={24} color="#60a5fa" />,
    hash: <Hash size={24} color="#60a5fa" />,
    "jwt-decoder": <Key size={24} color="#60a5fa" />,
    shield: <Shield size={24} color="#60a5fa" />,
    link: <Link size={24} color="#60a5fa" />,
    "xml-to-json": <FileCode2 size={24} color="#60a5fa" />,
    "cloud-cog": <CloudCog size={24} color="#60a5fa" />,

    // Math Tools
    plus: <Plus size={24} color="#60a5fa" />,
    x: <X size={24} color="#60a5fa" />,
    calculator: <Calculator size={24} color="#60a5fa" />,
    calendar: <Clock size={24} color="#60a5fa" />,
    equal: <Equal size={24} color="#60a5fa" />,
    repeat: <Repeat size={24} color="#60a5fa" />,
    grid: <Grid3x3 size={24} color="#60a5fa" />,
    "bar-chart": <TrendingUp size={24} color="#60a5fa" />,
    "age-calculator": <CalendarDays size={24} color="#60a5fa" />,
    percent: <Percent size={24} color="#60a5fa" />,

    // Time Tools
    clock: <Clock size={24} color="#60a5fa" />,
    timer: <Timer size={24} color="#60a5fa" />,
    "alarm-clock": <AlarmClock size={24} color="#60a5fa" />,

    // Finance Tools
    "trending-up": <TrendingUp size={24} color="#60a5fa" />,
    baby: <Baby size={24} color="#60a5fa" />,
    "trending-down": <TrendingDown size={24} color="#60a5fa" />,
    "credit-card": <CreditCard size={24} color="#60a5fa" />,
    "piggy-bank": <PiggyBank size={24} color="#60a5fa" />,
    "indian-rupee": <IndianRupee size={24} color="#60a5fa" />,
    luggage: <Luggage size={24} color="#60a5fa" />,
    "chart-candlestick": <CandlestickChart size={24} color="#60a5fa" />,
    "gold-bars": <Coins size={24} color="#fbbf24" />,

    // Health Tools
    heart: <Heart size={24} color="#60a5fa" />,
    activity: <Activity size={24} color="#60a5fa" />,
  };

  const icon = iconMap[iconName] || <FileText size={24} color="#60a5fa" />;

  return <IconWrapper>{icon}</IconWrapper>;
};
