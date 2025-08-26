"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import { Copy, Check, Palette, RefreshCw } from "lucide-react";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

const ColorPicker = () => {
  const theme = useTheme();
  const [color, setColor] = useState("#6366f1");
  const [copied, setCopied] = useState(false);
  const [palette, setPalette] = useState<string[]>([]);

  const generatePalette = () => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const hsl = rgbToHsl(r, g, b);
    const newPalette = [];

    // Generate analogous colors
    for (let i = -2; i <= 2; i++) {
      let newHue = hsl[0] + i * 30;
      if (newHue < 0) newHue += 360;
      if (newHue > 360) newHue -= 360;
      newPalette.push(hslToHex(newHue, hsl[1], hsl[2]));
    }

    setPalette(newPalette);
  };

  const rgbToHsl = (
    r: number,
    g: number,
    b: number
  ): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;
    }

    return [h, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} component="main">
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Color Picker Tool
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
          Select colors and generate harmonious color palettes for your designs,
          websites, and creative projects.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="color-picker-section"
            >
              <Box sx={{ mb: 3 }}>
                <HexColorPicker
                  color={color}
                  onChange={setColor}
                  aria-label="Color selection wheel"
                />
              </Box>

              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1,
                    backgroundColor: color,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                  aria-label={`Selected color: ${color}`}
                />
                <TextField
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  sx={{ flex: 1 }}
                  aria-label="Hex color code input"
                  inputProps={{
                    "aria-describedby": "color-input-description",
                  }}
                />

                <Button
                  variant="outlined"
                  onClick={() => handleCopy(color)}
                  startIcon={
                    copied ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <Copy size={16} aria-hidden="true" />
                    )
                  }
                  aria-label={
                    copied
                      ? "Color copied to clipboard"
                      : "Copy color to clipboard"
                  }
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
              }}
              component="section"
              aria-labelledby="palette-section"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h4" component="h3" fontWeight={600}>
                  Color Palette
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<RefreshCw size={16} aria-hidden="true" />}
                  onClick={generatePalette}
                  aria-label="Generate color palette"
                >
                  Generate
                </Button>
              </Box>

              <Grid
                container
                spacing={2}
                role="list"
                aria-label="Generated color palette"
              >
                {palette.map((color, index) => (
                  <Grid item xs={12} key={index} role="listitem">
                    <Paper
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        backgroundColor: theme.palette.background.default,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          backgroundColor: color,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                        aria-label={`Palette color ${index + 1}: ${color}`}
                      />
                      <Typography sx={{ flex: 1 }}>{color}</Typography>
                      <Button
                        size="small"
                        onClick={() => handleCopy(color)}
                        startIcon={<Copy size={16} aria-hidden="true" />}
                        aria-label={`Copy color ${color} to clipboard`}
                      >
                        Copy
                      </Button>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {palette.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    py: 4,
                  }}
                  aria-live="polite"
                >
                  <Palette
                    size={48}
                    color={theme.palette.text.secondary}
                    aria-hidden="true"
                  />
                  <Typography color="text.secondary">
                    Click generate to create a color palette
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <AdSense adSlot="4552615729" />

        {/* Informational Content */}
        <Box sx={{ mt: 4 }}>
          {/* Features Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Why Use Our Color Picker Tool?
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Palette size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Interactive Color Selection
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Visual color wheel with real-time hex code updates. Pick any
                    color with precision and accuracy.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <RefreshCw size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Palette Generation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate harmonious color palettes automatically using color
                    theory principles and analogous colors.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.warning.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Copy size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Easy Copy & Export
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Copy hex codes instantly to clipboard. Ready for CSS, design
                    software, and web development projects.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* How It Works Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              How to Pick Colors and Create Palettes
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    1
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Select Color
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click on the color wheel to choose your desired color or
                    enter a hex code directly.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    2
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    View Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    See your selected color in the preview box with the
                    corresponding hex code displayed.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    3
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Generate Palette
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click Generate to create a harmonious 5-color palette based
                    on your selected color.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    4
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Copy & Use
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Copy any color hex code to clipboard and use in your design
                    projects, CSS, or graphics.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Benefits Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Key Benefits
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      100% Free & No Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use our color picker tool completely free without creating
                      an account or providing personal information.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Professional Color Theory
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generate palettes using established color harmony
                      principles for professional design results.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Web-Ready Format
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All colors provided in hex format, ready for immediate use
                      in CSS, HTML, and design applications.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Instant Copy Function
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      One-click copying to clipboard for seamless workflow
                      integration in your design process.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* FAQ Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Frequently Asked Questions
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                What color formats are supported?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Our color picker supports hex color codes (like #FF5733), which
                are the standard format for web development. You can input hex
                codes directly or select colors visually from the wheel.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                How does the palette generation work?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                The palette generator creates analogous colors by adjusting the
                hue of your selected color using color theory principles. It
                generates 5 harmonious colors that work well together.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Can I enter custom hex codes directly?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Yes! You can type or paste hex color codes directly into the
                input field. The color wheel and preview will automatically
                update to show your selected color.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                How do I use these colors in my projects?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simply copy the hex codes and paste them into your CSS, design
                software, or any application that accepts hex values. The colors
                are ready for immediate use in web and graphic design.
              </Typography>
            </Box>
          </Paper>
        </Box>

        <AdSense adSlot="6613251015" />
      </motion.div>
    </Container>
  );
};

export default ColorPicker;
