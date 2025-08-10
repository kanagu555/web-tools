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
          variant="h2"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ fontSize: "2.5rem" }}
        >
          Color Picker
        </Typography>
        <Typography
          variant="h3"
          component="h2"
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

        <AdSense adSlot="6613251015" />

        {/* Color Theory Guide for SEO */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          component="section"
          aria-labelledby="color-theory-guide"
        >
          <Typography
            id="color-theory-guide"
            variant="h2"
            component="h2"
            gutterBottom
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            Color Theory & Design Guide
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 2, fontWeight: 600 }}
              >
                Understanding Color Formats
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Hex Colors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hexadecimal color codes (like #FF5733) are the most common
                  format for web design. They represent colors using 6
                  characters: 2 for red, 2 for green, and 2 for blue values.
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  RGB Colors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  RGB (Red, Green, Blue) uses values from 0-255 for each color
                  channel. Perfect for digital displays and web development.
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  HSL Colors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  HSL (Hue, Saturation, Lightness) is more intuitive for
                  designers, making it easier to create color variations and
                  harmonious palettes.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 2, fontWeight: 600 }}
              >
                Color Harmony Principles
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Analogous Colors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Colors that are next to each other on the color wheel. Our
                  palette generator creates analogous colors for harmonious
                  designs.
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Complementary Colors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Colors opposite each other on the color wheel create high
                  contrast and vibrant designs when used together.
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Color Psychology
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Different colors evoke different emotions. Blue conveys trust,
                  red creates urgency, green suggests nature and growth.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h3"
              component="h3"
              sx={{ fontSize: "1.1rem", mb: 2, fontWeight: 600 }}
            >
              Perfect For
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                >
                  <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                    <li>Web developers choosing CSS colors</li>
                    <li>Graphic designers creating brand palettes</li>
                    <li>UI/UX designers building interfaces</li>
                    <li>Digital artists selecting color schemes</li>
                  </ul>
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                >
                  <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                    <li>Marketing teams creating campaigns</li>
                    <li>Interior designers planning spaces</li>
                    <li>Fashion designers coordinating outfits</li>
                    <li>Students learning color theory</li>
                  </ul>
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* FAQ Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          component="section"
          aria-labelledby="faq-section"
        >
          <Typography
            id="faq-section"
            variant="h2"
            component="h2"
            gutterBottom
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            Frequently Asked Questions
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  What color formats are supported?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our color picker supports hex color codes (like #FF5733), and
                  can generate RGB and HSL values. The tool primarily works with
                  hex codes for easy web development use.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  How does the palette generation work?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The palette generator creates analogous colors by adjusting
                  the hue of your selected color. It generates 5 harmonious
                  colors that work well together in design projects.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  Can I enter custom hex codes?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes! You can directly type or paste hex color codes into the
                  input field. The color wheel will automatically update to show
                  your selected color.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  Is this tool free to use?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absolutely! Our color picker is completely free to use with no
                  registration required. You can pick colors, generate palettes,
                  and copy codes without any limitations.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  How do I use these colors in my projects?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Simply copy the hex codes and paste them into your CSS, design
                  software, or any application that accepts hex color values.
                  The colors are ready to use in web development and graphic
                  design.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <AdSense adSlot="6613251015" />
      </motion.div>
    </Container>
  );
};

export default ColorPicker;
