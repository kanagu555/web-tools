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
  Image,
  Code,
  Braces,
  Shield,
  Calculator,
  CreditCard,
  TrendingUp,
  Heart,
  Activity,
  Timer,
  AlarmClock,
  Clock,
  FileImage,
  Merge,
  Paintbrush2,
} from "lucide-react";

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

    // Text Tools
    "word-count": <Type size={24} color="#60a5fa" />,
    "text-cursor": <CaseSensitive size={24} color="#60a5fa" />,
    quote: <Quote size={24} color="#60a5fa" />,
    "file-text": <FileText size={24} color="#60a5fa" />,

    // Design Tools
    palette: <Palette size={24} color="#60a5fa" />,
    "vector-bezier": <Zap size={24} color="#60a5fa" />,
    image: <Image size={24} color="#60a5fa" />,
    "swatch-book": <Paintbrush2 size={24} color="#60a5fa" />,
    "qr-code": <Code size={24} color="#60a5fa" />,

    // Developer Tools
    braces: <Braces size={24} color="#60a5fa" />,
    "credit-card": <CreditCard size={24} color="#60a5fa" />,
    "git-compare-arrows": <Split size={24} color="#60a5fa" />,
    "file-code": <Code size={24} color="#60a5fa" />,
    code: <Code size={24} color="#60a5fa" />,
    fingerprint: <Shield size={24} color="#60a5fa" />,
    "link-2": <FileText size={24} color="#60a5fa" />,
    "shield-check": <Shield size={24} color="#60a5fa" />,
    wifi: <Zap size={24} color="#60a5fa" />,
    hash: <Code size={24} color="#60a5fa" />,
    key: <Shield size={24} color="#60a5fa" />,
    shield: <Shield size={24} color="#60a5fa" />,
    link: <FileText size={24} color="#60a5fa" />,

    // Math Tools
    plus: <Calculator size={24} color="#60a5fa" />,
    calculator: <Calculator size={24} color="#60a5fa" />,
    calendar: <Clock size={24} color="#60a5fa" />,
    equal: <Calculator size={24} color="#60a5fa" />,
    repeat: <Split size={24} color="#60a5fa" />,
    grid: <Calculator size={24} color="#60a5fa" />,
    "bar-chart": <TrendingUp size={24} color="#60a5fa" />,

    // Time Tools
    clock: <Clock size={24} color="#60a5fa" />,
    timer: <Timer size={24} color="#60a5fa" />,
    "alarm-clock": <AlarmClock size={24} color="#60a5fa" />,

    // Finance Tools
    "trending-up": <TrendingUp size={24} color="#60a5fa" />,
    baby: <Heart size={24} color="#60a5fa" />,
    "trending-down": <TrendingUp size={24} color="#60a5fa" />,

    // Health Tools
    heart: <Heart size={24} color="#60a5fa" />,
    activity: <Activity size={24} color="#60a5fa" />,
  };

  const icon = iconMap[iconName] || <FileText size={24} color="#60a5fa" />;

  return <IconWrapper>{icon}</IconWrapper>;
};
