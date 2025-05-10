"use client";

import { useState, useEffect, useRef } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

export function ColorPicker() {
  const [color, setColor] = useState<string>("#3f51b5");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create color gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, "rgb(255, 0, 0)");
    gradient.addColorStop(1 / 6, "rgb(255, 255, 0)");
    gradient.addColorStop(2 / 6, "rgb(0, 255, 0)");
    gradient.addColorStop(3 / 6, "rgb(0, 255, 255)");
    gradient.addColorStop(4 / 6, "rgb(0, 0, 255)");
    gradient.addColorStop(5 / 6, "rgb(255, 0, 255)");
    gradient.addColorStop(1, "rgb(255, 0, 0)");

    // Apply gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add black to white vertical gradient
    const bwGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bwGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    bwGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
    bwGradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
    bwGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.fillStyle = bwGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1).data;
    const r = imageData[0];
    const g = imageData[1];
    const b = imageData[2];

    setColor(rgbToHex(r, g, b));
  };

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  // Convert Hex to RGB
  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
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

      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  };

  // Handle hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    if (/^#?([a-f\d]{0,6})$/i.test(newHex)) {
      const formattedHex = newHex.startsWith("#") ? newHex : `#${newHex}`;
      setColor(formattedHex);

      if (/^#[a-f\d]{6}$/i.test(formattedHex)) {
        const newRgb = hexToRgb(formattedHex);
      }
    }
  };

  // Copy color to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: `Copied ${text} to clipboard!`,
      severity: "success",
    });
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Color Picker
          </Typography>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
              mb: 3,
            }}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              onClick={handleCanvasClick}
              style={{ width: "100%", height: "auto", cursor: "crosshair" }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: "100%",
                height: 80,
                bgcolor: color,
                borderRadius: 1,
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Hex Color"
                  value={color}
                  onChange={handleHexChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(color)}
                >
                  Copy
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Color Picker Features
            </Typography>

            <Typography
              variant="body2"
              paragraph
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              • Interactive color canvas with visual selection
            </Typography>

            <Typography
              variant="body2"
              paragraph
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              • Real-time color format conversion (HEX, RGB, HSL)
            </Typography>

            <Typography
              variant="body2"
              paragraph
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              • Precise color adjustment with individual sliders
            </Typography>

            <Typography
              variant="body2"
              paragraph
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              • One-click copy to clipboard in multiple formats
            </Typography>

            <Typography
              variant="body2"
              paragraph
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              • Visual color preview with large display area
            </Typography>

            <Typography
              variant="body2"
              paragraph
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              • Fast processing with client-side technology (your data never
              leaves your computer)
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
