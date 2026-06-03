"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Slider,
  useTheme,
  TextField,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import { Copy, Check, Sparkles, Layers, Sliders, Code } from "lucide-react";
import AdSense from "../AdSense";
import Navigation from "@/components/Navigation";


interface GlassPreset {
  name: string;
  blur: number;
  opacity: number;
  color: string;
  borderOpacity: number;
  borderWidth: number;
  borderRadius: number;
  shadowOpacity: number;
  shadowBlur: number;
  shadowColor: string;
}

const presets: GlassPreset[] = [
  {
    name: "Frosted Glass",
    blur: 16,
    opacity: 0.2,
    color: "#ffffff",
    borderOpacity: 0.1,
    borderWidth: 1,
    borderRadius: 16,
    shadowOpacity: 0.15,
    shadowBlur: 24,
    shadowColor: "#000000",
  },
  {
    name: "Dark Ice",
    blur: 20,
    opacity: 0.45,
    color: "#111827",
    borderOpacity: 0.15,
    borderWidth: 1,
    borderRadius: 16,
    shadowOpacity: 0.3,
    shadowBlur: 32,
    shadowColor: "#000000",
  },
  {
    name: "Electric Lavender",
    blur: 12,
    opacity: 0.25,
    color: "#a855f7",
    borderOpacity: 0.3,
    borderWidth: 1.5,
    borderRadius: 20,
    shadowOpacity: 0.25,
    shadowBlur: 20,
    shadowColor: "#a855f7",
  },
  {
    name: "Golden Glow",
    blur: 10,
    opacity: 0.15,
    color: "#fbbf24",
    borderOpacity: 0.25,
    borderWidth: 1,
    borderRadius: 12,
    shadowOpacity: 0.2,
    shadowBlur: 16,
    shadowColor: "#d97706",
  },
];

const gradientPresets = [
  {
    name: "Aurora Borealis",
    value: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)",
    hasBubbles: true,
  },
  {
    name: "Sunset Glow",
    value: "linear-gradient(135deg, #f59e0b 0%, #db2777 50%, #4338ca 100%)",
    hasBubbles: false,
  },
  {
    name: "Emerald Dream",
    value: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #10b981 100%)",
    hasBubbles: false,
  },
  {
    name: "Soft Pastel",
    value: "linear-gradient(135deg, #ffedd5 0%, #fbcfe8 50%, #e0f2fe 100%)",
    hasBubbles: false,
  },
];

const imagePresets = [
  {
    name: "Abstract Waves",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cyberpunk City",
    url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Foggy Mountains",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  },
];

const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace("#", "");
  let r = 255, g = 255, b = 255;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const GlassmorphismGenerator = () => {
  const theme = useTheme();

  // Glass settings state
  const [blur, setBlur] = useState<number>(16);
  const [opacity, setOpacity] = useState<number>(0.2);
  const [color, setColor] = useState<string>("#ffffff");
  const [borderOpacity, setBorderOpacity] = useState<number>(0.1);
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [shadowOpacity, setShadowOpacity] = useState<number>(0.15);
  const [shadowBlur, setShadowBlur] = useState<number>(24);
  const [shadowColor, setShadowColor] = useState<string>("#000000");

  // Background state
  const [backgroundType, setBackgroundType] = useState<"gradient" | "image" | "custom">("gradient");
  const [selectedGradient, setSelectedGradient] = useState<number>(0);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [customBgValue, setCustomBgValue] = useState<string>("");

  // Code copy state
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0); // 0 for CSS, 1 for Tailwind
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const applyPreset = (preset: GlassPreset) => {
    setBlur(preset.blur);
    setOpacity(preset.opacity);
    setColor(preset.color);
    setBorderOpacity(preset.borderOpacity);
    setBorderWidth(preset.borderWidth);
    setBorderRadius(preset.borderRadius);
    setShadowOpacity(preset.shadowOpacity);
    setShadowBlur(preset.shadowBlur);
    setShadowColor(preset.shadowColor);
  };

  const getBackgroundStyle = () => {
    if (backgroundType === "gradient") {
      return { background: gradientPresets[selectedGradient].value };
    } else if (backgroundType === "image") {
      return {
        backgroundImage: `url(${imagePresets[selectedImage].url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else {
      // Custom background type
      if (!customBgValue.trim()) {
        return { background: "linear-gradient(135deg, #1e293b, #0f172a)" };
      }
      if (customBgValue.includes("gradient") || customBgValue.startsWith("#") || customBgValue.startsWith("rgb")) {
        return { background: customBgValue };
      }
      return {
        backgroundImage: `url(${customBgValue})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
  };

  const getGlassStyle = () => {
    const bgRgba = hexToRgba(color, opacity);
    const borderRgba = hexToRgba(color, borderOpacity); // Using primary color for border to match frosted look
    const shadowRgba = hexToRgba(shadowColor, shadowOpacity);

    return {
      background: bgRgba,
      borderRadius: `${borderRadius}px`,
      boxShadow: `0 8px ${shadowBlur}px ${shadowRgba}`,
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      border: `${borderWidth}px solid ${borderRgba}`,
    };
  };

  const generateCSSCode = () => {
    const bgRgba = hexToRgba(color, opacity);
    const borderRgba = hexToRgba(color, borderOpacity);
    const shadowRgba = hexToRgba(shadowColor, shadowOpacity);

    return `/* Glassmorphism card effect */
background: ${bgRgba};
border-radius: ${borderRadius}px;
box-shadow: 0 8px ${shadowBlur}px ${shadowRgba};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: ${borderWidth}px solid ${borderRgba};`;
  };

  const generateTailwindCode = () => {
    const bgRgba = hexToRgba(color, opacity).replace(/\s/g, "");
    const borderRgba = hexToRgba(color, borderOpacity).replace(/\s/g, "");
    const shadowRgba = hexToRgba(shadowColor, shadowOpacity).replace(/\s/g, "");

    return `bg-[${bgRgba}] rounded-[${borderRadius}px] shadow-[0_8px_${shadowBlur}px_${shadowRgba}] backdrop-blur-[${blur}px] border border-[${borderRgba}]`;
  };

  const handleCopyCode = async () => {
    const code = activeTab === 0 ? generateCSSCode() : generateTailwindCode();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} component="main">
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Layers size={36} color={theme.palette.primary.main} />
          <Typography
            variant="h4"
            component="h1"
            fontWeight={800}
            sx={{ letterSpacing: "-0.5px" }}
          >
            Glassmorphism CSS Generator
          </Typography>
        </Box>

        <Typography
          variant="h6"
          component="p"
          color="text.secondary"
          paragraph
          fontWeight={400}
          sx={{ mb: 4 }}
        >
          Interactively design high-end frosted glass containers. Preview your glassmorphism styles in real-time on custom backgrounds, and copy the CSS or Tailwind CSS properties.
        </Typography>

        {/* Preset Selector */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Sparkles size={18} color={theme.palette.warning.main} />
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              Presets:
            </Typography>
          </Box>
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="outlined"
              size="small"
              onClick={() => applyPreset(preset)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 500,
                borderColor: theme.palette.divider,
                color: "text.primary",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: "rgba(96, 165, 250, 0.08)",
                },
              }}
            >
              {preset.name}
            </Button>
          ))}
        </Paper>

        <Grid container spacing={3}>
          {/* Controls Column */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Sliders size={20} color={theme.palette.primary.main} />
                <Typography variant="h6" fontWeight={700}>
                  Visual Controls
                </Typography>
              </Box>

              {/* Glass Color */}
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Glass Color
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      style={{
                        border: "none",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        overflow: "hidden",
                        backgroundColor: "transparent",
                      }}
                    />
                    <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                      {color.toUpperCase()}
                    </Typography>
                  </Box>
                </Grid>
              </Box>

              {/* Blur Radius */}
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Backdrop Blur
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {blur}px
                  </Typography>
                </Grid>
                <Slider
                  value={blur}
                  onChange={(_, val) => setBlur(val as number)}
                  min={0}
                  max={40}
                  step={1}
                />
              </Box>

              {/* Glass Opacity */}
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Glass Transparency (Opacity)
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {Math.round(opacity * 100)}%
                  </Typography>
                </Grid>
                <Slider
                  value={opacity}
                  onChange={(_, val) => setOpacity(val as number)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Box>

              {/* Border Thickness */}
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Border Thickness
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {borderWidth}px
                  </Typography>
                </Grid>
                <Slider
                  value={borderWidth}
                  onChange={(_, val) => setBorderWidth(val as number)}
                  min={0}
                  max={8}
                  step={0.5}
                />
              </Box>

              {/* Border Opacity */}
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Border Opacity
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {Math.round(borderOpacity * 100)}%
                  </Typography>
                </Grid>
                <Slider
                  value={borderOpacity}
                  onChange={(_, val) => setBorderOpacity(val as number)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Box>

              {/* Border Radius */}
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Border Radius (Corner Roundness)
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {borderRadius}px
                  </Typography>
                </Grid>
                <Slider
                  value={borderRadius}
                  onChange={(_, val) => setBorderRadius(val as number)}
                  min={0}
                  max={60}
                  step={1}
                />
              </Box>

              {/* Shadow Color */}
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Shadow Color
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <input
                      type="color"
                      value={shadowColor}
                      onChange={(e) => setShadowColor(e.target.value)}
                      style={{
                        border: "none",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        overflow: "hidden",
                        backgroundColor: "transparent",
                      }}
                    />
                    <Typography variant="caption" fontFamily="monospace" color="text.secondary">
                      {shadowColor.toUpperCase()}
                    </Typography>
                  </Box>
                </Grid>
              </Box>

              {/* Shadow Size (Blur) */}
              <Box sx={{ mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Shadow Spread (Blur)
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {shadowBlur}px
                  </Typography>
                </Grid>
                <Slider
                  value={shadowBlur}
                  onChange={(_, val) => setShadowBlur(val as number)}
                  min={0}
                  max={80}
                  step={1}
                />
              </Box>

              {/* Shadow Opacity */}
              <Box sx={{ mb: 1 }}>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Shadow Opacity
                  </Typography>
                  <Typography variant="caption" fontWeight={600}>
                    {Math.round(shadowOpacity * 100)}%
                  </Typography>
                </Grid>
                <Slider
                  value={shadowOpacity}
                  onChange={(_, val) => setShadowOpacity(val as number)}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </Box>
            </Paper>
          </Grid>

          {/* Preview & Code Column */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} direction="column">
              {/* Preview Box */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Interactive Sandbox
                  </Typography>

                  {/* Backdrop Background Selectors */}
                  <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                    <Button
                      variant={backgroundType === "gradient" ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setBackgroundType("gradient")}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      Preset Gradients
                    </Button>
                    <Button
                      variant={backgroundType === "image" ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setBackgroundType("image")}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      Preset Images
                    </Button>
                    <Button
                      variant={backgroundType === "custom" ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setBackgroundType("custom")}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      Custom Backplate
                    </Button>
                  </Box>

                  {/* Options based on selected background type */}
                  {backgroundType === "gradient" && (
                    <Box sx={{ display: "flex", gap: 1, mb: 3, overflowX: "auto", pb: 1 }}>
                      {gradientPresets.map((grad, idx) => (
                        <Box
                          key={grad.name}
                          onClick={() => setSelectedGradient(idx)}
                          sx={{
                            p: 0.5,
                            border: `2px solid ${selectedGradient === idx ? theme.palette.primary.main : "transparent"}`,
                            borderRadius: 2,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <Box
                            sx={{
                              width: 50,
                              height: 35,
                              background: grad.value,
                              borderRadius: 1.5,
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}

                  {backgroundType === "image" && (
                    <Box sx={{ display: "flex", gap: 1, mb: 3, overflowX: "auto", pb: 1 }}>
                      {imagePresets.map((img, idx) => (
                        <Box
                          key={img.name}
                          onClick={() => setSelectedImage(idx)}
                          sx={{
                            p: 0.5,
                            border: `2px solid ${selectedImage === idx ? theme.palette.primary.main : "transparent"}`,
                            borderRadius: 2,
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                        >
                          <Box
                            component="img"
                            src={img.url}
                            alt={img.name}
                            sx={{
                              width: 50,
                              height: 35,
                              borderRadius: 1.5,
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  )}

                  {backgroundType === "custom" && (
                    <Box sx={{ mb: 3 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="CSS linear-gradient(...) or Unsplash image URL"
                        value={customBgValue}
                        onChange={(e) => setCustomBgValue(e.target.value)}
                        variant="outlined"
                        label="Custom CSS style or Image URL"
                      />
                    </Box>
                  )}

                  {/* Sandbox Board Container */}
                  <Box
                    sx={{
                      width: "100%",
                      height: 350,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "inset 0 0 10px rgba(0,0,0,0.3)",
                      ...getBackgroundStyle(),
                    }}
                  >
                    {/* Floating Mesh Bubbles if Aurora is selected */}
                    {backgroundType === "gradient" && gradientPresets[selectedGradient].hasBubbles && (
                      <>
                        <motion.div
                          animate={{
                            x: [0, 80, -40, 0],
                            y: [0, -60, 40, 0],
                          }}
                          transition={{
                            duration: 14,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            position: "absolute",
                            width: 140,
                            height: 140,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #ec4899 0%, rgba(236,72,153,0) 70%)",
                            top: "10%",
                            left: "15%",
                            filter: "blur(12px)",
                          }}
                        />
                        <motion.div
                          animate={{
                            x: [0, -80, 50, 0],
                            y: [0, 80, -50, 0],
                          }}
                          transition={{
                            duration: 17,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            position: "absolute",
                            width: 170,
                            height: 170,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #3b82f6 0%, rgba(59,130,246,0) 70%)",
                            bottom: "15%",
                            right: "15%",
                            filter: "blur(12px)",
                          }}
                        />
                        <motion.div
                          animate={{
                            x: [0, 50, -60, 0],
                            y: [0, 60, -70, 0],
                          }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            position: "absolute",
                            width: 120,
                            height: 120,
                            borderRadius: "50%",
                            background: "radial-gradient(circle, #a855f7 0%, rgba(168,85,247,0) 70%)",
                            top: "35%",
                            left: "40%",
                            filter: "blur(10px)",
                          }}
                        />
                      </>
                    )}

                    {/* Actual Glassmorphism Preview Card */}
                    <Box
                      style={getGlassStyle()}
                      sx={{
                        width: "80%",
                        maxWidth: 340,
                        padding: 3,
                        transition: "backdrop-filter 0.1s, background 0.1s, border-radius 0.15s, box-shadow 0.15s, border 0.1s",
                        position: "relative",
                        zIndex: 2,
                        color: opacity < 0.35 && color === "#111827" ? "#fff" : (color === "#ffffff" ? "#fff" : "#000"),
                        textShadow: color === "#ffffff" ? "0 1px 2px rgba(0,0,0,0.5)" : "none",
                      }}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                        <Box>
                          <Typography variant="h6" fontWeight={700} sx={{ m: 0, lineHeight: 1.2 }}>
                            KodeKit Card
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.8 }}>
                            Glassmorphism sandbox
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                          <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#eab308" }} />
                          <Box sx={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#22c55e" }} />
                        </Box>
                      </Box>

                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle2" sx={{ opacity: 0.8, mb: 0.5, textTransform: "uppercase", fontSize: 9, letterSpacing: 1.5 }}>
                          Card Balance
                        </Typography>
                        <Typography variant="h5" fontWeight={800}>
                          $12,450.80
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <Box>
                          <Typography variant="caption" sx={{ opacity: 0.7, fontSize: 8 }}>
                            CARD HOLDER
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
                            KK DEVELOPER
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            backgroundColor: "rgba(255, 255, 255, 0.15)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            padding: "4px 10px",
                            borderRadius: "10px",
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#fff",
                            cursor: "pointer",
                            backdropFilter: "blur(2px)",
                            transition: "background-color 0.2s",
                            "&:hover": {
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                            },
                          }}
                        >
                          Transfer
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Code Generation Box */}
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Code size={20} color={theme.palette.primary.main} />
                      <Typography variant="h6" fontWeight={700}>
                        Code Output
                      </Typography>
                    </Box>
                    <Tooltip title={copied ? "Copied!" : "Copy Code to Clipboard"}>
                      <IconButton onClick={handleCopyCode} color={copied ? "success" : "default"}>
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Tabs
                    value={activeTab}
                    onChange={(_, val) => setActiveTab(val)}
                    sx={{ mb: 2, minHeight: 36 }}
                    indicatorColor="primary"
                    textColor="primary"
                  >
                    <Tab label="Vanilla CSS" sx={{ textTransform: "none", minHeight: 36, py: 1 }} />
                    <Tab label="Tailwind CSS" sx={{ textTransform: "none", minHeight: 36, py: 1 }} />
                  </Tabs>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: "background.default",
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      overflowX: "auto",
                      maxHeight: 200,
                    }}
                  >
                    <Typography
                      fontFamily="monospace"
                      component="pre"
                      sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-all",
                        margin: 0,
                        fontSize: 13,
                        color: "text.primary",
                      }}
                    >
                      {activeTab === 0 ? generateCSSCode() : generateTailwindCode()}
                    </Typography>
                  </Paper>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <AdSense adSlot="6613251015" />

        {/* Informational Guidelines */}
        <Box sx={{ mt: 5 }}>
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom fontWeight={700}>
              What is Glassmorphism?
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Glassmorphism is an aesthetic UI design trend popularized by modern operating systems. It uses a combination of semi-transparent layers, multi-stop backdrop blurs, subtle glowing borders, and drop shadows to establish visual hierarchy and convey depth. The container appears like a plate of frosted glass floating above an active background.
            </Typography>

            <Typography variant="h6" component="h3" gutterBottom fontWeight={600} sx={{ mt: 3 }}>
              CSS Properties Explained
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      backdrop-filter: blur()
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Applies a graphical filter (Gaussian Blur) to the area directly behind the element. This frosted effect is what gives the "glass" look its texture and readability.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      rgba() Backgrounds
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Setting an alpha channel opacity (0.1 to 0.4) on light or dark background colors lets details shine through without drowning out text contrast.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      Semi-Transparent Borders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Adding a thin border with low opacity color mimics the reflection and refraction along the edge of real cut glass sheets.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </motion.div>

      {/* Copied Alert */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          Code copied successfully to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default GlassmorphismGenerator;
