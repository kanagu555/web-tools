import React from "react";
import { Box } from "@mui/material";
import {
  FileText,
  FilePlus,
  Split,
  Archive,
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
  Building,
  TrendingUp,
  Heart,
  Activity,
  Timer,
  AlarmClock,
  Clock,
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

// Icon mapping function - much cleaner approach
export const getToolIcon = (iconName: string): JSX.Element => {
  const iconMap: { [key: string]: React.ReactNode } = {
    // PDF Tools
    "image-to-pdf": <FileText size={24} color="#60a5fa" />,
    "pdf-merger": <FilePlus size={24} color="#60a5fa" />,
    "pdf-splitter": <Split size={24} color="#60a5fa" />,
    "pdf-compressor": <Archive size={24} color="#60a5fa" />,

    // Text Tools
    "word-count": <Type size={24} color="#60a5fa" />,
    "text-case-converter": <CaseSensitive size={24} color="#60a5fa" />,
    "lorem-ipsum": <Quote size={24} color="#60a5fa" />,

    // Design Tools
    "color-picker": <Palette size={24} color="#60a5fa" />,
    "gradient-generator": <Zap size={24} color="#60a5fa" />,
    "image-resizer": <Image size={24} color="#60a5fa" />,

    // Developer Tools
    "json-formatter": <Braces size={24} color="#60a5fa" />,
    "base64-encoder": <Shield size={24} color="#60a5fa" />,
    "regex-tester": <Code size={24} color="#60a5fa" />,

    // Calculator Tools
    "basic-calculator": <Calculator size={24} color="#60a5fa" />,
    "loan-calculator": <Building size={24} color="#60a5fa" />,
    "sip-calculator": <TrendingUp size={24} color="#60a5fa" />,

    // Health Tools
    "bmi-calculator": <Heart size={24} color="#60a5fa" />,
    "blood-pressure": <Activity size={24} color="#60a5fa" />,

    // Time Tools
    stopwatch: <Timer size={24} color="#60a5fa" />,
    "countdown-timer": <AlarmClock size={24} color="#60a5fa" />,
    "time-converter": <Clock size={24} color="#60a5fa" />,
  };

  const icon = iconMap[iconName] || <FileText size={24} color="#60a5fa" />;

  return <IconWrapper>{icon}</IconWrapper>;
};
