"use client";

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
  Stack,
  Tooltip,
  Divider,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Popover,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import QrCodeIcon from "@mui/icons-material/QrCode";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import CheckIcon from "@mui/icons-material/Check";
import PaletteIcon from "@mui/icons-material/Palette";

// QR Code library
import QRCode from "qrcode";

export function QrCodeGenerator() {
  const theme = useTheme();
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
  const [copied, setCopied] = useState(false);
  const [qrStyle, setQrStyle] = useState("classic");

  // Color picker state
  const [fgColorPickerAnchor, setFgColorPickerAnchor] =
    useState<HTMLElement | null>(null);
  const [bgColorPickerAnchor, setBgColorPickerAnchor] =
    useState<HTMLElement | null>(null);
  const [tempFgColor, setTempFgColor] = useState(foregroundColor);
  const [tempBgColor, setTempBgColor] = useState(backgroundColor);

  // Predefined colors for quick selection
  const colorPresets = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
    "#800000",
    "#008080",
    "#000080",
    "#808080",
  ];

  // Color picker handlers
  const handleOpenFgColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setFgColorPickerAnchor(event.currentTarget);
    setTempFgColor(foregroundColor);
  };

  const handleOpenBgColorPicker = (event: React.MouseEvent<HTMLElement>) => {
    setBgColorPickerAnchor(event.currentTarget);
    setTempBgColor(backgroundColor);
  };

  const handleCloseFgColorPicker = () => {
    setFgColorPickerAnchor(null);
    setForegroundColor(tempFgColor);
  };

  const handleCloseBgColorPicker = () => {
    setBgColorPickerAnchor(null);
    setBackgroundColor(tempBgColor);
  };

  const handleFgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
      setTempFgColor(newColor);
    }
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newColor)) {
      setTempBgColor(newColor);
    }
  };

  const applyFgColor = (color: string) => {
    setTempFgColor(color);
  };

  const applyBgColor = (color: string) => {
    setTempBgColor(color);
  };

  // Generate QR code when parameters change
  useEffect(() => {
    const timer = setTimeout(() => {
      generateQRCode();
    }, 300); // Debounce to prevent too many renders

    return () => clearTimeout(timer);
  }, [
    text,
    size,
    foregroundColor,
    backgroundColor,
    errorCorrectionLevel,
    margin,
    includeMargin,
    qrStyle,
  ]);

  const generateQRCode = async () => {
    if (!text) return;

    setLoading(true);

    try {
      // Base options
      const options: any = {
        errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
        margin: includeMargin ? margin : 0,
        width: size,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
      };

      // Apply style-specific options
      switch (qrStyle) {
        case "rounded":
          options.rendererOpts = { quality: 1 };
          break;
        case "thin":
          options.width = size * 0.9;
          break;
        case "smooth":
          options.rendererOpts = { quality: 0.8 };
          break;
        case "circles":
          options.rendererOpts = { quality: 0.9 };
          break;
        default:
          // Classic style - no additional options
          break;
      }

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

  const handleSizeChange = (_event: Event, newValue: number | number[]) => {
    setSize(newValue as number);
  };

  const handleMarginChange = (_event: Event, newValue: number | number[]) => {
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

  const copyToClipboard = async () => {
    if (!qrCodeDataURL) return;

    try {
      const blob = await fetch(qrCodeDataURL).then((r) => r.blob());
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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

  const applyRandomColors = () => {
    const getRandomColor = () =>
      `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
    setForegroundColor(getRandomColor());
    setBackgroundColor(getRandomColor());
  };

  const handleQrStyleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newStyle: string | null
  ) => {
    if (newStyle !== null) {
      setQrStyle(newStyle);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 1000,
        mx: "auto",
        borderRadius: 2,
        bgcolor: theme.palette.background.paper,
        width: "100%",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6} sx={{ width: "100%" }}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
            QR Code Generator
          </Typography>
          <Box sx={{ mb: 3, width: "100%" }}>
            <TextField
              fullWidth
              label="Text or URL"
              value={text}
              onChange={handleTextChange}
              variant="outlined"
              placeholder="Enter text or URL to encode"
              sx={{
                mb: 2,
                width: "100%",
                "& .MuiInputBase-root": {
                  width: "100%",
                },
                "& .MuiOutlinedInput-input": {
                  width: "100%",
                },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<QrCodeIcon />}
                  onClick={generateQRCode}
                  disabled={!text || loading}
                  fullWidth
                  aria-label="Generate QR Code"
                  sx={{ borderRadius: 1, py: 1 }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      color="inherit"
                      aria-label="Loading"
                    />
                  ) : (
                    "Generate QR Code"
                  )}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setText("https://example.com");
                    setSize(200);
                    setForegroundColor("#000000");
                    setBackgroundColor("#FFFFFF");
                    setErrorCorrectionLevel("M");
                    setMargin(4);
                    setIncludeMargin(true);
                    setDarkMode(false);
                    setQrStyle("classic");
                  }}
                  fullWidth
                  aria-label="Reset to Default"
                  sx={{ borderRadius: 1, py: 1 }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* First line: Size, Margin, and Random Colors button */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="size-select-label">Size (px)</InputLabel>
                <Select
                  labelId="size-select-label"
                  id="size-select"
                  value={size}
                  label="Size (px)"
                  onChange={(e) => setSize(Number(e.target.value))}
                  sx={{
                    width: "100%",
                    minWidth: "120px",
                    "& .MuiSelect-select": {
                      width: "100%",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 300 },
                    },
                  }}
                >
                  {[100, 150, 200, 250, 300, 350, 400].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}px
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined" size="small">
                <InputLabel id="margin-select-label">Margin</InputLabel>
                <Select
                  labelId="margin-select-label"
                  id="margin-select"
                  value={margin}
                  label="Margin"
                  onChange={(e) => setMargin(Number(e.target.value))}
                  sx={{
                    width: "100%",
                    minWidth: "120px",
                    "& .MuiSelect-select": {
                      width: "100%",
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: { maxHeight: 300 },
                    },
                  }}
                >
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Button
                variant="outlined"
                startIcon={<ColorLensIcon />}
                onClick={applyRandomColors}
                color="primary"
                size="small"
                sx={{
                  height: "40px",
                  ml: { xs: 0, sm: 2 },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                Random Colors
              </Button>
            </Grid>
          </Grid>

          {/* Second line: Colors */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Foreground Color</Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "4px",
                    bgcolor: foregroundColor,
                    border: "1px solid",
                    borderColor: "divider",
                    mr: 1,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  onClick={handleOpenFgColorPicker}
                />
                <TextField
                  fullWidth
                  size="small"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  sx={{
                    fontFamily: "monospace",
                    width: "100%",
                  }}
                />
              </Box>

              {/* Foreground Color Picker Popover */}
              <Popover
                open={Boolean(fgColorPickerAnchor)}
                anchorEl={fgColorPickerAnchor}
                onClose={handleCloseFgColorPicker}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box sx={{ p: 2, width: 240 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Foreground Color
                  </Typography>

                  {/* Color input */}
                  <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "4px",
                        bgcolor: tempFgColor,
                        border: "1px solid",
                        borderColor: "divider",
                        mr: 1,
                      }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      value={tempFgColor}
                      onChange={handleFgColorChange}
                      sx={{ fontFamily: "monospace" }}
                    />
                  </Box>

                  {/* Color presets */}
                  <Typography variant="caption" gutterBottom>
                    Presets
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {colorPresets.map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: color,
                          borderRadius: "4px",
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "divider",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={() => applyFgColor(color)}
                      />
                    ))}
                  </Box>

                  {/* Native color picker */}
                  <Box sx={{ mb: 2 }}>
                    <input
                      type="color"
                      value={tempFgColor}
                      onChange={(e) => setTempFgColor(e.target.value)}
                      style={{ width: "100%", height: 40 }}
                    />
                  </Box>

                  {/* Apply button */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleCloseFgColorPicker}
                  >
                    Apply Color
                  </Button>
                </Box>
              </Popover>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Background Color</Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "4px",
                    bgcolor: backgroundColor,
                    border: "1px solid",
                    borderColor: "divider",
                    mr: 1,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  onClick={handleOpenBgColorPicker}
                />
                <TextField
                  fullWidth
                  size="small"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  sx={{
                    fontFamily: "monospace",
                    width: "100%",
                  }}
                />
              </Box>

              {/* Background Color Picker Popover */}
              <Popover
                open={Boolean(bgColorPickerAnchor)}
                anchorEl={bgColorPickerAnchor}
                onClose={handleCloseBgColorPicker}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Box sx={{ p: 2, width: 240 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Select Background Color
                  </Typography>

                  {/* Color input */}
                  <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "4px",
                        bgcolor: tempBgColor,
                        border: "1px solid",
                        borderColor: "divider",
                        mr: 1,
                      }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      value={tempBgColor}
                      onChange={handleBgColorChange}
                      sx={{ fontFamily: "monospace" }}
                    />
                  </Box>

                  {/* Color presets */}
                  <Typography variant="caption" gutterBottom>
                    Presets
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                  >
                    {colorPresets.map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 24,
                          height: 24,
                          bgcolor: color,
                          borderRadius: "4px",
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "divider",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                        onClick={() => applyBgColor(color)}
                      />
                    ))}
                  </Box>

                  {/* Native color picker */}
                  <Box sx={{ mb: 2 }}>
                    <input
                      type="color"
                      value={tempBgColor}
                      onChange={(e) => setTempBgColor(e.target.value)}
                      style={{ width: "100%", height: 40 }}
                    />
                  </Box>

                  {/* Apply button */}
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleCloseBgColorPicker}
                  >
                    Apply Color
                  </Button>
                </Box>
              </Popover>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} width={"100%"} md={6}>
          <Typography variant="h6" gutterBottom fontWeight="medium">
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
              borderRadius: 2,
              minHeight: 300,
              bgcolor: "background.paper",
              width: "100%",
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : qrCodeDataURL ? (
              <Box sx={{ textAlign: "center", width: "100%" }}>
                <Box
                  component="img"
                  src={qrCodeDataURL}
                  alt="QR Code"
                  sx={{
                    maxWidth: "100%",
                    height: "auto",
                    mb: 2,
                    borderRadius: 1,
                  }}
                />
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                    color="primary"
                    sx={{ borderRadius: 1 }}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={copyToClipboard}
                    sx={{ borderRadius: 1 }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={generateQRCode}
                    sx={{ borderRadius: 1 }}
                  >
                    Refresh
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Typography color="text.secondary">
                Enter text or URL and click "Generate QR Code" to create your QR
                code.
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
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

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom fontWeight="medium">
            QR Code Generator Features
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                paragraph
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                • Create custom QR codes for any URL or text
              </Typography>
              <Typography
                variant="body2"
                paragraph
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                • Customize colors for foreground and background
              </Typography>
              <Typography
                variant="body2"
                paragraph
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                • Adjust size and margin for different use cases
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body2"
                paragraph
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                • Choose error correction level for durability
              </Typography>
              <Typography
                variant="body2"
                paragraph
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                • Download QR code as PNG image
              </Typography>
              <Typography
                variant="body2"
                paragraph
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                • Copy QR code directly to clipboard
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
