import React, { useState, useEffect } from "react";
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
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const ColorPicker = () => {
  const theme = useTheme();
  const [color, setColor] = useState("#6366f1");
  const [copied, setCopied] = useState(false);
  const [palette, setPalette] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      <Helmet>
        <title>Color Picker - Web Tools</title>
        <meta
          name="description"
          content="Advanced color picker tool with hex, RGB, HSL conversions and palette generation. Extract colors from images and create perfect color schemes for your designs."
        />
        <meta
          name="keywords"
          content="color picker, hex color, RGB converter, HSL values, color palette generator, image color extraction, web design tools, online color picker, hex color picker, rgb color picker, hsl color picker, color code generator, color picker tool, react color picker, html color picker, css color picker, color palette generator, eyedropper tool online, web color picker, color selector tool, free color picker, color converter, color picker with preview, pick color from image, advanced color picker, color gradient picker, color picker, online color picker, hex color picker, rgb color picker, hsl color picker, color selector tool, free color picker, web color picker, react color picker, color palette generator, eyedropper tool, color code finder, image color picker, color scheme tool, designer color tool, ui color picker, browser color picker, digital color picker, color wheel picker, color converter, copy color code, accessible color picker, contrast checker, open source color picker, colorpicker github, get hex code from image online"
        />
        <meta property="og:title" content="Color Picker - Web Tools" />
        <meta
          property="og:description"
          content="Advanced color picker tool with hex, RGB, HSL conversions and palette generation. Extract colors from images and create perfect color schemes for your designs."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/color-picker"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Color Picker - Web Tools" />
        <meta
          name="twitter:description"
          content="Advanced color picker tool with hex, RGB, HSL conversions and palette generation. Extract colors from images and create perfect color schemes for your designs."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/color-picker"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          fontWeight={700}
          sx={{ fontSize: "2.5rem" }}
        >
          Color Picker
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          color="text.secondary"
          paragraph
          sx={{ fontSize: "1.25rem", fontWeight: 400 }}
        >
          Select colors and generate harmonious color palettes for your designs.
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
                <Typography variant="h4" component="h4" fontWeight={600}>
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
      </motion.div>
      <AdSense adSlot="6613251015" />
    </Container>
  );
};

export default ColorPicker;
