import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Container,
  Divider,
  Tooltip,
  IconButton,
  FormControlLabel,
  Switch,
  Alert,
  Slider,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ContentCopy,
  Refresh,
  FileUpload,
  Download,
} from "@mui/icons-material";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import Breadcrumb from "../components/Breadcrumb";
import SEOHelmet from "../components/SEOHelmet";
import {
  generateToolSEO,
  generateWebAppData,
  generateHowToData,
  generateBreadcrumbData,
} from "../Utils/seoUtils";

const QrCodeGenerator: React.FC = () => {
  // State for input value and QR code properties
  const [inputValue, setInputValue] = useState<string>("");
  const [size, setSize] = useState<number>(200);
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [includeMargin, setIncludeMargin] = useState<boolean>(true);
  const [renderAs, setRenderAs] = useState<"svg" | "canvas">("canvas");
  const isProductionEnv = import.meta.env.PROD;

  // State for UI feedback
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  // Refs
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generate SEO data using seoUtils
  const seoData = generateToolSEO(
    "QR Code Generator",
    "Create customizable QR codes for websites, text, contact information, and more. Adjust size, colors, error correction level, and download as SVG or PNG",
    "design"
  );

  // Generate structured data
  const webAppData = generateWebAppData(
    "QR Code Generator",
    "Create customizable QR codes for websites, text, contact information, and more. Adjust size, colors, error correction level, and download as SVG or PNG",
    "design"
  );

  const howToSteps = [
    {
      name: "Enter Content",
      text: "Enter the text, URL, or data you want to encode in the QR code input field",
    },
    {
      name: "Customize Appearance",
      text: "Adjust size, colors, error correction level, and choose between SVG or PNG format",
    },
    {
      name: "Preview QR Code",
      text: "View the generated QR code with your custom settings in real-time",
    },
    {
      name: "Download QR Code",
      text: "Click the download button to save your QR code as SVG or PNG file",
    },
  ];

  const howToData = generateHowToData("QR Code Generator", howToSteps);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Design Tools", url: "/category/design" },
    { name: "QR Code Generator" },
  ];

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Design Tools", url: "https://kodekit.in/category/design" },
    {
      name: "QR Code Generator",
      url: "https://kodekit.in/tools/qr-code-generator",
    },
  ]);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setError("");
  };

  const handleErrorLevelChange = (event: SelectChangeEvent) => {
    setErrorLevel(event.target.value as "L" | "M" | "Q" | "H");
  };

  const handleRenderAsChange = (event: SelectChangeEvent) => {
    setRenderAs(event.target.value as "svg" | "canvas");
  };

  const resetForm = () => {
    setInputValue("");
    setSize(200);
    setFgColor("#000000");
    setBgColor("#ffffff");
    setErrorLevel("M");
    setIncludeMargin(true);
    setRenderAs("canvas");
    setError("");
    setSnackbarMessage("Form reset");
    setSnackbarOpen(true);
  };

  const copyToClipboard = () => {
    if (!inputValue) return;

    navigator.clipboard
      .writeText(inputValue)
      .then(() => {
        setCopied(true);
        setSnackbarMessage("Copied to clipboard");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setError("Failed to copy to clipboard.");
      });
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setInputValue(content);
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
    };

    reader.readAsText(file);

    // Reset the file input
    event.target.value = "";
  };

  const downloadQRCode = () => {
    if (!inputValue) {
      setError("Please enter some text to generate a QR code.");
      return;
    }

    if (renderAs === "svg") {
      // Download as SVG
      const svgElement = qrRef.current?.querySelector("svg");
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `qrcode_${new Date().getTime()}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } else {
      // Download as PNG
      const canvas = qrRef.current?.querySelector("canvas");
      if (!canvas) return;

      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `qrcode_${new Date().getTime()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }

    setSnackbarMessage(
      `QR code downloaded as ${renderAs === "svg" ? "SVG" : "PNG"}`
    );
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
        canonical="https://kodekit.in/tools/qr-code-generator"
      />

      <Helmet>
        {/* Additional Structured Data */}
        <script type="application/ld+json">{JSON.stringify(webAppData)}</script>
        <script type="application/ld+json">{JSON.stringify(howToData)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          QR Code Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Create customizable QR codes for websites, text, contact information,
          and more.
        </Typography>

        {/* Main Tool Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Text or URL"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter text or URL to generate QR code..."
                variant="outlined"
                aria-label="Input field for QR code content"
                aria-describedby="qr-input-description"
                InputProps={{
                  endAdornment: (
                    <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                      <IconButton
                        onClick={copyToClipboard}
                        color={copied ? "success" : "default"}
                        disabled={!inputValue}
                        aria-label="Copy text to clipboard"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
              <Typography
                id="qr-input-description"
                variant="caption"
                color="text.secondary"
              >
                Enter any text, URL, contact info, or other data you want to
                encode in the QR code
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom id="qr-size-label">
                QR Code Size
              </Typography>
              <Slider
                value={size}
                onChange={(_, newValue) => setSize(newValue as number)}
                min={100}
                max={400}
                step={10}
                valueLabelDisplay="auto"
                aria-labelledby="qr-size-label"
                aria-describedby="qr-size-description"
              />
              <Typography
                id="qr-size-description"
                variant="caption"
                color="text.secondary"
              >
                Adjust the size of the QR code (100px to 400px)
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography gutterBottom id="fg-color-label">
                    Foreground Color
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: fgColor,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        mr: 1,
                      }}
                      aria-hidden="true"
                    />
                    <TextField
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      sx={{ width: "100%" }}
                      aria-labelledby="fg-color-label"
                      aria-describedby="fg-color-description"
                    />
                  </Box>
                  <Typography
                    id="fg-color-description"
                    variant="caption"
                    color="text.secondary"
                  >
                    Color of the QR code pattern
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom id="bg-color-label">
                    Background Color
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        backgroundColor: bgColor,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                        mr: 1,
                      }}
                      aria-hidden="true"
                    />
                    <TextField
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      sx={{ width: "100%" }}
                      aria-labelledby="bg-color-label"
                      aria-describedby="bg-color-description"
                    />
                  </Box>
                  <Typography
                    id="bg-color-description"
                    variant="caption"
                    color="text.secondary"
                  >
                    Background color of the QR code
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="error-level-label">
                  Error Correction Level
                </InputLabel>
                <Select
                  value={errorLevel}
                  label="Error Correction Level"
                  onChange={handleErrorLevelChange}
                  aria-labelledby="error-level-label"
                  aria-describedby="error-level-description"
                >
                  <MenuItem value="L">Low (7%)</MenuItem>
                  <MenuItem value="M">Medium (15%)</MenuItem>
                  <MenuItem value="Q">Quartile (25%)</MenuItem>
                  <MenuItem value="H">High (30%)</MenuItem>
                </Select>
                <Typography
                  id="error-level-description"
                  variant="caption"
                  color="text.secondary"
                >
                  Higher levels allow the QR code to be readable even if damaged
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="render-as-label">Render As</InputLabel>
                  <Select
                    value={renderAs}
                    label="Render As"
                    onChange={handleRenderAsChange}
                    aria-labelledby="render-as-label"
                    aria-describedby="render-as-description"
                  >
                    <MenuItem value="svg">SVG (Scalable)</MenuItem>
                    <MenuItem value="canvas">PNG (Faster)</MenuItem>
                  </Select>
                  <Typography
                    id="render-as-description"
                    variant="caption"
                    color="text.secondary"
                  >
                    SVG for printing, PNG for digital use
                  </Typography>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={includeMargin}
                      onChange={(e) => setIncludeMargin(e.target.checked)}
                      color="primary"
                      aria-label="Toggle QR code margin"
                    />
                  }
                  label="Margin"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleFileUpload}
                  startIcon={<FileUpload />}
                  aria-label="Upload text file"
                >
                  Upload Text File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".txt,.json,.csv,.md"
                  aria-hidden="true"
                />
                <Button
                  variant="outlined"
                  color="error"
                  onClick={resetForm}
                  startIcon={<Refresh />}
                  aria-label="Reset form"
                >
                  Reset
                </Button>
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" role="alert">
                  {error}
                </Alert>
              </Grid>
            )}

            {inputValue && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom component="h2">
                  Generated QR Code:
                </Typography>
                <Box
                  ref={qrRef}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 3,
                    backgroundColor: "background.default",
                    borderRadius: 2,
                  }}
                  aria-label="Generated QR code preview"
                >
                  {renderAs === "svg" ? (
                    <QRCodeSVG
                      value={inputValue}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={errorLevel}
                      includeMargin={includeMargin}
                      aria-label="QR code in SVG format"
                    />
                  ) : (
                    <QRCodeCanvas
                      value={inputValue}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={errorLevel}
                      includeMargin={includeMargin}
                      aria-label="QR code in PNG format"
                    />
                  )}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={downloadQRCode}
                    startIcon={<Download />}
                    aria-label={`Download QR code as ${
                      renderAs === "svg" ? "SVG" : "PNG"
                    }`}
                  >
                    Download QR Code ({renderAs === "svg" ? "SVG" : "PNG"})
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        {isProductionEnv && <AdSense adSlot="6613251015" />}

        {/* Information Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            What are QR Codes?
          </Typography>
          <Typography paragraph>
            QR (Quick Response) codes are two-dimensional barcodes that can be
            scanned using a smartphone camera or QR code reader. They can store
            various types of information such as URLs, text, contact
            information, or even Wi-Fi network credentials.
          </Typography>

          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            How to Use This QR Code Generator
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  1.
                </Typography>
                <Typography>
                  Enter the text or URL you want to encode in the input field
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  2.
                </Typography>
                <Typography>
                  Customize the QR code appearance using the available options
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  3.
                </Typography>
                <Typography>
                  Download the generated QR code as an SVG or PNG file
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>Error Correction:</strong> Higher levels allow the QR
                  code to be readable even if partially damaged
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>SVG format:</strong> Best for printing or scaling to
                  different sizes
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>PNG format:</strong> Better for digital use or when
                  transparency is needed
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="h5"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            Common Uses for QR Codes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Website URLs and social media profiles</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Business cards and contact information</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Wi-Fi network credentials for easy connection
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Product information and marketing materials
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Event tickets and registration information
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Payment information for contactless transactions
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Tip: For best results, keep the text length reasonable and test your
            QR code with different scanning apps to ensure compatibility.
          </Typography>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        role="status"
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
          aria-live="polite"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QrCodeGenerator;
