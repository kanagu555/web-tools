"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  FormControlLabel,
  Switch,
  CircularProgress,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AdSense from "./AdSense";

// QR Code library
import QRCode from "qrcode";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [size, setSize] = useState(200);
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [margin, setMargin] = useState(4);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [includeMargin, setIncludeMargin] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  // Generate QR code when parameters change
  useEffect(() => {
    generateQRCode();
  }, [
    text,
    size,
    foregroundColor,
    backgroundColor,
    errorCorrectionLevel,
    margin,
    includeMargin,
  ]);

  const generateQRCode = async () => {
    if (!text) return;

    setLoading(true);

    try {
      const options = {
        errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
        margin: includeMargin ? margin : 0,
        width: size,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      };

      const dataURL = await QRCode.toDataURL(text, options);
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleErrorCorrectionChange = (e: SelectChangeEvent) => {
    setErrorCorrectionLevel(e.target.value);
  };

  const handleSizeChange = (event: Event, newValue: number | number[]) => {
    setSize(newValue as number);
  };

  const handleMarginChange = (event: Event, newValue: number | number[]) => {
    setMargin(newValue as number);
  };

  const handleDownload = () => {
    if (!qrCodeDataURL) return;

    const link = document.createElement("a");
    link.href = qrCodeDataURL;
    link.download = `qrcode-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      setForegroundColor("#FFFFFF");
      setBackgroundColor("#000000");
    } else {
      setForegroundColor("#000000");
      setBackgroundColor("#FFFFFF");
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            QR Code Generator
          </Typography>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Text or URL"
              value={text}
              onChange={handleTextChange}
              variant="outlined"
              placeholder="Enter text or URL to encode"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<QrCodeIcon />}
              onClick={generateQRCode}
              disabled={!text || loading}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Generate QR Code"
              )}
            </Button>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Customization Options
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              >
                <InputLabel>Error Correction</InputLabel>
                <Select
                  value={errorCorrectionLevel}
                  onChange={handleErrorCorrectionChange}
                  label="Error Correction"
                >
                  <MenuItem value="L">Low (7%)</MenuItem>
                  <MenuItem value="M">Medium (15%)</MenuItem>
                  <MenuItem value="Q">Quartile (25%)</MenuItem>
                  <MenuItem value="H">High (30%)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch checked={darkMode} onChange={toggleDarkMode} />
                }
                label="Dark Mode"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Size: {size}px</Typography>
              <Slider
                value={size}
                min={100}
                max={400}
                step={10}
                onChange={handleSizeChange}
                aria-labelledby="size-slider"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Margin: {margin}</Typography>
              <Slider
                value={margin}
                min={0}
                max={10}
                step={1}
                onChange={handleMarginChange}
                aria-labelledby="margin-slider"
                disabled={!includeMargin}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={includeMargin}
                    onChange={(e) => setIncludeMargin(e.target.checked)}
                  />
                }
                label="Include Margin"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Foreground Color</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "4px",
                    bgcolor: foregroundColor,
                    border: "1px solid",
                    borderColor: "divider",
                    mr: 1,
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  sx={{ fontFamily: "monospace" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Background Color</Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "4px",
                    bgcolor: backgroundColor,
                    border: "1px solid",
                    borderColor: "divider",
                    mr: 1,
                  }}
                />
                <TextField
                  fullWidth
                  size="small"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  sx={{ fontFamily: "monospace" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Generated QR Code
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 3,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              minHeight: 300,
              bgcolor: "background.paper",
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : qrCodeDataURL ? (
              <Box sx={{ textAlign: "center" }}>
                <Box
                  component="img"
                  src={qrCodeDataURL}
                  alt="QR Code"
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    mb: 2,
                  }}
                />
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary">
                Enter text or URL and click "Generate QR Code" to create your QR
                code.
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              QR Code Information
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Error Correction Level:</strong>{" "}
              {errorCorrectionLevel === "L"
                ? "Low (7%)"
                : errorCorrectionLevel === "M"
                ? "Medium (15%)"
                : errorCorrectionLevel === "Q"
                ? "Quartile (25%)"
                : "High (30%)"}
            </Typography>
            <Typography variant="body2" paragraph>
              Higher error correction levels make the QR code more resistant to
              damage but increase its complexity.
            </Typography>
            <Typography variant="body2">
              <strong>Size:</strong> {size}px × {size}px
            </Typography>
            <Typography variant="body2">
              <strong>Margin:</strong> {includeMargin ? margin : 0} modules
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <AdSense adSlot="1234567890" adFormat="auto" />
    </Paper>
  );
}
