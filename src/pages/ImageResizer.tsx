import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Upload, Download, Image as ImageIcon, RefreshCw } from "lucide-react";
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

const ImageResizer = () => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState<number>(90);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generate SEO data using seoUtils
  const seoData = generateToolSEO(
    "Image Resizer",
    "Resize and optimize your images with precise control over dimensions and quality. Convert between JPEG, PNG, and WebP formats",
    "design"
  );

  // Generate structured data
  const webAppData = generateWebAppData(
    "Image Resizer",
    "Resize and optimize your images with precise control over dimensions and quality. Convert between JPEG, PNG, and WebP formats",
    "design"
  );

  const howToSteps = [
    {
      name: "Upload Image",
      text: "Click the 'Select Image' button or drag and drop your image file into the upload area",
    },
    {
      name: "Set Dimensions",
      text: "Enter your desired width and height in pixels. Toggle the aspect ratio lock if needed",
    },
    {
      name: "Choose Format",
      text: "Select output format (JPEG, PNG, or WebP) and adjust quality slider for optimal file size",
    },
    {
      name: "Download",
      text: "Click the 'Download Image' button to save your resized image to your device",
    },
  ];

  const howToData = generateHowToData("Image Resizer", howToSteps);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Design Tools", url: "/category/design" },
    { name: "Image Resizer" },
  ];

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Design Tools", url: "https://kodekit.in/category/design" },
    { name: "Image Resizer", url: "https://kodekit.in/tools/image-resizer" },
  ]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setPreviewUrl(URL.createObjectURL(file));
        };
        img.src = URL.createObjectURL(file);
      }
    }
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspectRatio && selectedFile) {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setHeight(Math.round(newWidth / aspectRatio));
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspectRatio && selectedFile) {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        setWidth(Math.round(newHeight * aspectRatio));
      };
      img.src = URL.createObjectURL(selectedFile);
    }
  };

  const resizeImage = () => {
    if (!selectedFile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `resized-image.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        },
        `image/${format}`,
        quality / 100
      );
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
        canonical="https://kodekit.in/tools/image-resizer"
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
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          fontWeight={700}
          sx={{ fontSize: "2.5rem" }}
        >
          Image Resizer
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          color="text.secondary"
          paragraph
          sx={{ fontSize: "1.25rem", fontWeight: 400 }}
        >
          Resize and optimize your images with precise control over dimensions
          and quality.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="image-upload-section"
            >
              {previewUrl ? (
                <Box
                  sx={{
                    width: "100%",
                    height: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={previewUrl}
                    alt="Preview of uploaded image"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: 400,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 2,
                    border: `2px dashed ${theme.palette.divider}`,
                  }}
                  aria-label="Image upload area"
                >
                  <ImageIcon
                    size={48}
                    color={theme.palette.text.secondary}
                    aria-hidden="true"
                  />
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    Drag and drop an image here, or click to select
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    id="image-input"
                    aria-label="Select image file"
                  />
                  <label htmlFor="image-input">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<Upload aria-hidden="true" />}
                      sx={{ mt: 2 }}
                      aria-label="Upload image button"
                    >
                      Select Image
                    </Button>
                  </label>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="resize-options-section"
            >
              <Typography variant="h4" component="h4" gutterBottom mb="14px">
                Resize Options
              </Typography>

              {selectedFile ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Width"
                      type="number"
                      value={width}
                      onChange={(e) =>
                        handleWidthChange(Number(e.target.value))
                      }
                      inputProps={{
                        "aria-label": "Image width in pixels",
                        min: 1,
                        max: 5000,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Height"
                      type="number"
                      value={height}
                      onChange={(e) =>
                        handleHeightChange(Number(e.target.value))
                      }
                      inputProps={{
                        "aria-label": "Image height in pixels",
                        min: 1,
                        max: 5000,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() =>
                        setMaintainAspectRatio(!maintainAspectRatio)
                      }
                      startIcon={<RefreshCw aria-hidden="true" />}
                      aria-label={
                        maintainAspectRatio
                          ? "Lock aspect ratio"
                          : "Unlock aspect ratio"
                      }
                    >
                      {maintainAspectRatio
                        ? "Lock Aspect Ratio"
                        : "Unlock Aspect Ratio"}
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      id="format-label"
                    >
                      Output Format
                    </Typography>
                    <Select
                      fullWidth
                      value={format}
                      onChange={(e) =>
                        setFormat(e.target.value as "jpeg" | "png" | "webp")
                      }
                      aria-labelledby="format-label"
                    >
                      <MenuItem value="jpeg">JPEG</MenuItem>
                      <MenuItem value="png">PNG</MenuItem>
                      <MenuItem value="webp">WebP</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      id="quality-label"
                    >
                      Quality ({quality}%)
                    </Typography>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      style={{ width: "100%" }}
                      aria-labelledby="quality-label"
                      aria-valuemin={1}
                      aria-valuemax={100}
                      aria-valuenow={quality}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={resizeImage}
                        disabled={!selectedFile}
                        startIcon={<Download aria-hidden="true" />}
                        aria-label="Download resized image"
                      >
                        Download Image
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleReset}
                        disabled={!selectedFile}
                        aria-label="Reset image resizer"
                      >
                        Reset
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Typography color="text.secondary">
                  Select or upload an image to start resizing
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          aria-hidden="true"
        />

        <Box
          sx={{ mt: 4, mb: 4 }}
          component="section"
          aria-labelledby="features-section"
        >
          <Box
            id="features-section"
            component="h2"
            sx={{
              border: 0,
              clip: "rect(0 0 0 0)",
              height: 1,
              margin: -1,
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              width: 1,
              whiteSpace: "nowrap",
            }}
          >
            Features
          </Box>

          <Typography variant="body1" paragraph>
            Our free online image resizer tool helps you easily resize and
            convert images for your website, social media, or documents.
            Maintain aspect ratio or customize dimensions exactly as needed.
            Convert between JPEG, PNG, and WebP formats with quality control.
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>Key features:</strong>
          </Typography>

          <ul style={{ marginLeft: "20px", marginBottom: "20px" }}>
            <li>
              <Typography variant="body1">
                Resize images to exact pixel dimensions
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Lock or unlock aspect ratio as needed
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Convert between JPEG, PNG, and WebP formats
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Adjust quality settings to optimize file size
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                Preview changes before downloading
              </Typography>
            </li>
          </ul>
        </Box>

        <AdSense adSlot="6613251015" />

        <Box
          sx={{ mt: 6, mb: 2 }}
          component="section"
          aria-labelledby="instructions-section"
        >
          <Box
            id="instructions-section"
            component="h2"
            sx={{
              border: 0,
              clip: "rect(0 0 0 0)",
              height: 1,
              margin: -1,
              overflow: "hidden",
              padding: 0,
              position: "absolute",
              width: 1,
              whiteSpace: "nowrap",
            }}
          >
            Instructions
          </Box>

          <Typography variant="h3" component="h3" gutterBottom fontWeight={600}>
            How to Use the Image Resizer Tool
          </Typography>

          <Typography variant="body1" paragraph>
            1. <strong>Upload an image</strong> - Click the "Select Image"
            button or drag and drop your image file.
          </Typography>
          <Typography variant="body1" paragraph>
            2. <strong>Set dimensions</strong> - Enter your desired width and
            height in pixels. Toggle the aspect ratio lock if needed.
          </Typography>
          <Typography variant="body1" paragraph>
            3. <strong>Choose format and quality</strong> - Select output format
            (JPEG, PNG, or WebP) and adjust quality slider.
          </Typography>
          <Typography variant="body1" paragraph>
            4. <strong>Download</strong> - Click the "Download Image" button to
            save your resized image.
          </Typography>

          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            <strong>Tips:</strong> Use PNG for graphics with transparency.
            Choose WebP for the best balance of quality and file size. Lower the
            quality setting for smaller file sizes.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default ImageResizer;
