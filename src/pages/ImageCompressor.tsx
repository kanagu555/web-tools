import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  useTheme,
  LinearProgress,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Minimize2,
  RefreshCcw,
  Info,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import SocialShare from "../components/SocialShare";
import Breadcrumb from "../components/Breadcrumb";
import SEOHelmet from "../components/SEOHelmet";
import {
  generateToolSEO,
  generateWebAppData,
  generateHowToData,
  generateBreadcrumbData,
} from "../Utils/seoUtils";

const ImageCompressor = () => {
  const theme = useTheme();
  const shareLink = window.location.href;
  const isProductionEnv = import.meta.env.PROD;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [quality, setQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [format, setFormat] = useState<
    "image/jpeg" | "image/png" | "image/webp"
  >("image/jpeg");
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);
  const [error, setError] = useState<string>("");
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [autoCompress, setAutoCompress] = useState<boolean>(false);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
  const [imageMetadata, setImageMetadata] = useState<{
    width: number;
    height: number;
    type: string;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generate SEO data using seoUtils
  const seoData = generateToolSEO(
    "Image Compressor",
    "Reduce image file size while maintaining quality. Perfect for web optimization and faster loading times. Supports JPEG, PNG, WebP formats",
    "design"
  );

  // Generate structured data
  const webAppData = generateWebAppData(
    "Image Compressor",
    "Reduce image file size while maintaining quality. Perfect for web optimization and faster loading times. Supports JPEG, PNG, WebP formats",
    "design"
  );

  const howToSteps = [
    {
      name: "Upload Image",
      text: "Drag and drop an image or click to select from your device. Supports JPEG, PNG, WebP, and GIF formats up to 50MB",
    },
    {
      name: "Adjust Settings",
      text: "Set quality level, output format, and maximum dimensions. Enable auto-compress for instant results",
    },
    {
      name: "Compress Image",
      text: "Click 'Compress Image' to reduce file size while maintaining visual quality",
    },
    {
      name: "Download Result",
      text: "Download your compressed image with reduced file size and optimized quality",
    },
  ];

  const howToData = generateHowToData("Image Compressor", howToSteps);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Design Tools", url: "/category/design" },
    { name: "Image Compressor" },
  ];

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Design Tools", url: "https://kodekit.in/category/design" },
    {
      name: "Image Compressor",
      url: "https://kodekit.in/tools/image-compressor",
    },
  ]);

  const validateImageFile = (file: File): boolean => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, WebP, or GIF)");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 50MB");
      return false;
    }

    return true;
  };

  const loadImageMetadata = (file: File) => {
    const img = new Image();
    img.onload = () => {
      setImageMetadata({
        width: img.width,
        height: img.height,
        type: file.type,
      });
      URL.revokeObjectURL(img.src);

      if (autoCompress) {
        compressImage();
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        if (!validateImageFile(file)) return;

        setError("");
        setSelectedFile(file);
        setOriginalSize(file.size);
        setPreviewUrl(URL.createObjectURL(file));
        setCompressedUrl("");
        setCompressedSize(0);
        loadImageMetadata(file);
      }
    },
    [autoCompress]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);

      const file = event.dataTransfer.files[0];
      if (!validateImageFile(file)) return;

      setError("");
      setSelectedFile(file);
      setOriginalSize(file.size);
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedUrl("");
      setCompressedSize(0);
      loadImageMetadata(file);
    },
    [autoCompress]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragOver(false);
    },
    []
  );

  const compressImage = async () => {
    if (!selectedFile || !canvasRef.current) return;

    setIsCompressing(true);
    setCompressionProgress(0);
    setError("");

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context not available");

      const img = new Image();

      img.onload = () => {
        try {
          setCompressionProgress(25);

          // Calculate new dimensions
          let width = img.width;
          let height = img.height;

          if (maintainAspectRatio) {
            if (width > maxWidth) {
              height = (maxWidth * height) / width;
              width = maxWidth;
            }
            if (height > maxHeight) {
              width = (maxHeight * width) / height;
              height = maxHeight;
            }
          } else {
            width = Math.min(width, maxWidth);
            height = Math.min(height, maxHeight);
          }

          canvas.width = width;
          canvas.height = height;
          setCompressionProgress(50);

          // Apply advanced smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Optional: Apply filters for better compression
          if (format === "image/jpeg" && quality < 70) {
            ctx.filter = "contrast(1.1) saturate(0.9)";
          }

          ctx.drawImage(img, 0, 0, width, height);
          setCompressionProgress(75);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                setCompressedSize(blob.size);
                const url = URL.createObjectURL(blob);
                setCompressedUrl(url);
                setCompressionProgress(100);

                setTimeout(() => {
                  setIsCompressing(false);
                  setCompressionProgress(0);
                }, 500);
              } else {
                throw new Error("Failed to compress image");
              }
            },
            format,
            quality / 100
          );
        } catch (err) {
          setError("Error during compression: " + (err as Error).message);
          setIsCompressing(false);
          setCompressionProgress(0);
        }
      };

      img.onerror = () => {
        setError("Failed to load image for compression");
        setIsCompressing(false);
        setCompressionProgress(0);
      };

      img.src = URL.createObjectURL(selectedFile);
    } catch (err) {
      setError("Compression failed: " + (err as Error).message);
      setIsCompressing(false);
      setCompressionProgress(0);
    }
  };

  const downloadCompressed = () => {
    if (!compressedUrl || !selectedFile) return;

    const extension =
      format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
    const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `compressed-${fileName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setCompressedUrl("");
    setOriginalSize(0);
    setCompressedSize(0);
    setQuality(80);
    setMaxWidth(1920);
    setMaxHeight(1080);
    setImageMetadata(null);
    setError("");
    setIsCompressing(false);
    setCompressionProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo(0, 0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const compressionRatio =
    originalSize > 0 && compressedSize > 0
      ? (((originalSize - compressedSize) / originalSize) * 100).toFixed(1)
      : 0;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
        canonical="https://kodekit.in/tools/image-compressor"
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
          Image Compressor
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Reduce image file size while maintaining quality. Perfect for web
          optimization and faster loading times.
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            role="alert"
            aria-live="polite"
          >
            {error}
          </Alert>
        )}

        <section aria-labelledby="compression-tool-section">
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                role="region"
                aria-label="Image upload and preview area"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {!selectedFile ? (
                  <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload image area - drag and drop or click to select files"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                    sx={{
                      width: "100%",
                      height: 400,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isDragOver
                        ? theme.palette.action.hover
                        : theme.palette.background.default,
                      borderRadius: 2,
                      border: `2px dashed ${
                        isDragOver
                          ? theme.palette.primary.main
                          : theme.palette.divider
                      }`,
                      transition: "all 0.2s ease-in-out",
                      cursor: "pointer",
                      "&:focus": {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: "2px",
                      },
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <motion.div
                      animate={{ scale: isDragOver ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ImageIcon
                        size={48}
                        color={
                          isDragOver
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary
                        }
                      />
                    </motion.div>

                    <Typography
                      color={isDragOver ? "primary" : "text.secondary"}
                      sx={{ mt: 2, mb: 2, textAlign: "center" }}
                    >
                      {isDragOver
                        ? "Drop your image here"
                        : "Drag & drop an image or click to select"}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Supports JPEG, PNG, WebP, GIF (max 50MB)
                    </Typography>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      style={{ display: "none" }}
                      aria-label="Select image file for compression"
                    />

                    <Button
                      variant="contained"
                      startIcon={<Upload />}
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      aria-label="Select image file button"
                    >
                      Select Image
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        id="original-image-label"
                      >
                        Original ({formatFileSize(originalSize)})
                      </Typography>
                      <Box
                        role="img"
                        aria-labelledby="original-image-label"
                        sx={{
                          width: "100%",
                          height: 300,
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
                          alt={`Original image: ${
                            selectedFile?.name || "uploaded image"
                          }`}
                          loading="lazy"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        id="compressed-image-label"
                      >
                        Compressed{" "}
                        {compressedSize > 0 &&
                          `(${formatFileSize(compressedSize)})`}
                      </Typography>
                      <Box
                        role="img"
                        aria-labelledby="compressed-image-label"
                        sx={{
                          width: "100%",
                          height: 300,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          overflow: "hidden",
                        }}
                      >
                        {compressedUrl ? (
                          <img
                            src={compressedUrl}
                            alt={`Compressed image: ${
                              selectedFile?.name || "compressed image"
                            } - reduced by ${compressionRatio}%`}
                            loading="lazy"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          <Typography color="text.secondary" aria-live="polite">
                            Compressed image will appear here
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                role="region"
                aria-labelledby="compression-settings-title"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Settings size={20} aria-hidden="true" />
                  <Typography
                    variant="h6"
                    sx={{ ml: 1 }}
                    id="compression-settings-title"
                  >
                    Compression Settings
                  </Typography>
                </Box>

                {/* Image Metadata */}
                {imageMetadata && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 3,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      Image Info
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Chip
                        size="small"
                        label={`${imageMetadata.width}×${imageMetadata.height}`}
                        icon={<Info size={14} />}
                      />
                      <Chip
                        size="small"
                        label={imageMetadata.type.split("/")[1].toUpperCase()}
                        variant="outlined"
                      />
                    </Stack>
                  </Paper>
                )}

                {/* Auto Compress Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoCompress}
                      onChange={(e) => setAutoCompress(e.target.checked)}
                      inputProps={{
                        "aria-label": "Auto compress images when uploaded",
                      }}
                    />
                  }
                  label="Auto compress on upload"
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="output-format-label">
                    Output Format
                  </InputLabel>
                  <Select
                    value={format}
                    onChange={(e) =>
                      setFormat(
                        e.target.value as
                          | "image/jpeg"
                          | "image/png"
                          | "image/webp"
                      )
                    }
                    label="Output Format"
                    labelId="output-format-label"
                    aria-describedby="output-format-help"
                  >
                    <MenuItem value="image/jpeg">
                      JPEG (Best compression)
                    </MenuItem>
                    <MenuItem value="image/png">PNG (Lossless)</MenuItem>
                    <MenuItem value="image/webp">WebP (Modern format)</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography gutterBottom id="quality-slider-label">
                      Quality: {quality}%
                    </Typography>
                    <Tooltip title="Higher quality = larger file size">
                      <IconButton size="small" aria-label="Quality information">
                        <Info size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={quality}
                    onChange={(_, value) => setQuality(value as number)}
                    min={10}
                    max={100}
                    step={5}
                    marks={[
                      { value: 10, label: "10%" },
                      { value: 50, label: "50%" },
                      { value: 100, label: "100%" },
                    ]}
                    disabled={format === "image/png"}
                    aria-labelledby="quality-slider-label"
                    aria-describedby="quality-help-text"
                  />
                  {format === "image/png" && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      id="quality-help-text"
                    >
                      PNG is lossless - quality setting disabled
                    </Typography>
                  )}
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom id="width-slider-label">
                    Max Width: {maxWidth}px
                  </Typography>
                  <Slider
                    value={maxWidth}
                    onChange={(_, value) => setMaxWidth(value as number)}
                    min={400}
                    max={3840}
                    step={80}
                    marks={[
                      { value: 800, label: "800px" },
                      { value: 1920, label: "1920px" },
                      { value: 3840, label: "4K" },
                    ]}
                    aria-labelledby="width-slider-label"
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom id="height-slider-label">
                    Max Height: {maxHeight}px
                  </Typography>
                  <Slider
                    value={maxHeight}
                    onChange={(_, value) => setMaxHeight(value as number)}
                    min={400}
                    max={2160}
                    step={80}
                    marks={[
                      { value: 600, label: "600px" },
                      { value: 1080, label: "1080px" },
                      { value: 2160, label: "4K" },
                    ]}
                    aria-labelledby="height-slider-label"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      inputProps={{
                        "aria-label": "Maintain aspect ratio when resizing",
                      }}
                    />
                  }
                  label="Maintain aspect ratio"
                  sx={{ mb: 3 }}
                />

                {/* Progress Bar */}
                {isCompressing && (
                  <Box sx={{ mb: 2 }} role="status" aria-live="polite">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      id="compression-progress-label"
                    >
                      Compressing... {compressionProgress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={compressionProgress}
                      sx={{ borderRadius: 1 }}
                      aria-labelledby="compression-progress-label"
                    />
                  </Box>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={compressImage}
                  disabled={!selectedFile || isCompressing}
                  startIcon={<Minimize2 />}
                  sx={{ mb: 2 }}
                  aria-label={
                    isCompressing
                      ? "Compressing image in progress"
                      : "Start image compression"
                  }
                >
                  {isCompressing ? "Compressing..." : "Compress Image"}
                </Button>

                {compressedUrl && (
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={downloadCompressed}
                      startIcon={<Download />}
                      aria-label="Download compressed image file"
                    >
                      Download Compressed
                    </Button>
                  </Stack>
                )}

                {Number(compressionRatio) > 0 && (
                  <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                    role="status"
                    aria-live="polite"
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>Size reduced by {compressionRatio}%</span>
                      <Chip
                        size="small"
                        label={`Saved ${formatFileSize(
                          originalSize - compressedSize
                        )}`}
                        color="success"
                        variant="outlined"
                        aria-label={`File size saved: ${formatFileSize(
                          originalSize - compressedSize
                        )}`}
                      />
                    </Box>
                  </Alert>
                )}

                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={resetAll}
                  disabled={!selectedFile}
                  startIcon={<RefreshCcw />}
                  aria-label="Reset all settings and clear uploaded image"
                >
                  Reset All
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </section>

        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          aria-hidden="true"
        />
      </motion.div>

      {isProductionEnv && <AdSense adSlot="6613251015" />}

      <Box sx={{ mt: 8 }}>
        <Divider sx={{ mb: 4 }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            What is Image Compression?
          </Typography>
          <Typography variant="body1" paragraph>
            Image compression is the process of reducing the file size of
            digital images while maintaining acceptable visual quality. Our
            online image compressor uses advanced algorithms to optimize your
            photos by removing unnecessary data, adjusting quality levels, and
            resizing dimensions without significantly impacting the visual
            appearance.
          </Typography>
          <Typography variant="body1" paragraph>
            This free tool supports multiple formats including JPEG, PNG, and
            WebP, allowing you to compress images for web optimization, email
            attachments, social media uploads, or storage space management. The
            compression happens entirely in your browser, ensuring your images
            remain private and secure.
          </Typography>
        </motion.div>

        {/* Common Use Cases */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 4 }}
          >
            Common Use Cases for Image Compression
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="web-optimization-content"
                id="web-optimization-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Web Optimization and SEO
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="web-optimization-content">
                <Typography variant="body1">
                  Compress images for faster website loading times, improved
                  user experience, and better search engine rankings. Smaller
                  image files reduce bandwidth usage and improve Core Web Vitals
                  scores, which are crucial for SEO performance.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="social-media-content"
                id="social-media-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Social Media and Email
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="social-media-content">
                <Typography variant="body1">
                  Optimize images for social media platforms, email newsletters,
                  and messaging apps. Most platforms have file size limits, and
                  compressed images upload faster while maintaining visual
                  quality for your audience.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="storage-content"
                id="storage-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Storage Space Management
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="storage-content">
                <Typography variant="body1">
                  Reduce storage requirements for photo libraries, cloud
                  backups, and device memory. Compressed images take up
                  significantly less space while preserving the visual content
                  you want to keep.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="ecommerce-content"
                id="ecommerce-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  E-commerce and Product Images
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="ecommerce-content">
                <Typography variant="body1">
                  Optimize product photos for online stores to ensure fast page
                  loading while maintaining image quality that showcases your
                  products effectively. This improves conversion rates and
                  customer experience.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 4 }}
          >
            How Our Image Compressor Works
          </Typography>
          <Typography variant="body1" paragraph>
            Our image compression tool uses client-side processing with HTML5
            Canvas technology, ensuring your images never leave your device. The
            compression process involves several steps: image analysis, quality
            adjustment, dimension optimization, and format conversion when
            needed.
          </Typography>
          <Typography variant="body1" paragraph>
            You can control the compression level through quality settings
            (10-100%), maximum dimensions, and output format selection. The tool
            supports JPEG for photographs with excellent compression ratios, PNG
            for images requiring transparency, and WebP for modern browsers
            seeking optimal compression.
          </Typography>
          <Typography variant="body1" paragraph>
            Advanced features include automatic compression on upload, aspect
            ratio maintenance, and real-time preview comparison between original
            and compressed versions. The drag-and-drop interface makes it easy
            to process multiple images quickly.
          </Typography>
        </motion.div>

        {/* Tips for Best Results */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 4 }}
          >
            Tips for Optimal Image Compression
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              <strong>Choose the Right Format:</strong> Use JPEG for photographs
              and complex images, PNG for graphics with transparency, and WebP
              for modern web applications requiring the best compression.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Quality vs. Size Balance:</strong> Start with 80% quality
              for most use cases. Reduce to 60-70% for web images where file
              size is critical, or increase to 90-95% for high-quality prints.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Dimension Optimization:</strong> Resize images to their
              display dimensions. A 4000px image displayed at 400px wastes
              bandwidth and storage space.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Batch Processing:</strong> Use the auto-compress feature
              when processing multiple similar images to maintain consistent
              quality and settings.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Preview Before Download:</strong> Always check the
              compressed preview to ensure the quality meets your requirements
              before downloading the final image.
            </Typography>
          </Box>
        </motion.div>
      </Box>

      <SocialShare
        title="Image Compressor - Reduce Image Size Online Free"
        url={shareLink}
        description="Compress images online while maintaining quality. Free tool for JPEG, PNG, WebP optimization."
        hashtags={["ImageCompression", "WebOptimization", "SEO", "OnlineTool"]}
      />
    </Container>
  );
};

export default ImageCompressor;
