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
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Minimize2,
  RefreshCcw,
  AlertCircle,
  Info,
  Trash2,
  Copy,
  ZoomIn,
  Settings,
} from "lucide-react";
import AdSense from "../components/AdSense";


const ImageCompressor = () => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [quality, setQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/jpeg");
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

  const validateImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
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

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
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
  }, [autoCompress]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
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
  }, [autoCompress]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

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

    const extension = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
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
          optimization.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
            >
              {!selectedFile ? (
                <Box
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
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
                    border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider
                      }`,
                    transition: "all 0.2s ease-in-out",
                    cursor: "pointer",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <motion.div
                    animate={{ scale: isDragOver ? 1.1 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ImageIcon
                      size={48}
                      color={isDragOver ? theme.palette.primary.main : theme.palette.text.secondary}
                    />
                  </motion.div>

                  <Typography
                    color={isDragOver ? "primary" : "text.secondary"}
                    sx={{ mt: 2, mb: 2, textAlign: "center" }}
                  >
                    {isDragOver
                      ? "Drop your image here"
                      : "Drag & drop an image or click to select"
                    }
                  </Typography>

                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                    Supports JPEG, PNG, WebP, GIF (max 50MB)
                  </Typography>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />

                  <Button
                    variant="contained"
                    startIcon={<Upload />}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Select Image
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Original ({formatFileSize(originalSize)})
                    </Typography>
                    <Box
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
                        alt="Original"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Compressed{" "}
                      {compressedSize > 0 &&
                        `(${formatFileSize(compressedSize)})`}
                    </Typography>
                    <Box
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
                          alt="Compressed"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <Typography color="text.secondary">
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
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Settings size={20} />
                <Typography variant="h6" sx={{ ml: 1 }}>
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
                      label={imageMetadata.type.split('/')[1].toUpperCase()}
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
                  />
                }
                label="Auto compress on upload"
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "image/jpeg" | "image/png" | "image/webp")}
                  label="Output Format"
                >
                  <MenuItem value="image/jpeg">JPEG (Best compression)</MenuItem>
                  <MenuItem value="image/png">PNG (Lossless)</MenuItem>
                  <MenuItem value="image/webp">WebP (Modern format)</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography gutterBottom>Quality: {quality}%</Typography>
                  <Tooltip title="Higher quality = larger file size">
                    <IconButton size="small">
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
                />
                {format === "image/png" && (
                  <Typography variant="caption" color="text.secondary">
                    PNG is lossless - quality setting disabled
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Max Width: {maxWidth}px</Typography>
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
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Max Height: {maxHeight}px</Typography>
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
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  />
                }
                label="Maintain aspect ratio"
                sx={{ mb: 3 }}
              />

              {/* Progress Bar */}
              {isCompressing && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Compressing... {compressionProgress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={compressionProgress}
                    sx={{ borderRadius: 1 }}
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
                  >
                    Download Compressed
                  </Button>

                </Stack>
              )}

              {Number(compressionRatio) > 0 && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Size reduced by {compressionRatio}%</span>
                    <Chip
                      size="small"
                      label={`Saved ${formatFileSize(originalSize - compressedSize)}`}
                      color="success"
                      variant="outlined"
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
              >
                Reset All
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </motion.div>
      <AdSense adSlot="6613251015" />
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          borderRadius: 3,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          About Our Image Compressor
        </Typography>
        <Typography paragraph>
          Our free online image compressor provides a simple and effective way
          to reduce image file sizes while maintaining high quality. Whether you
          need to optimize images for your website, reduce storage space, or
          improve loading times, this tool is perfect for your needs.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Features of Our Image Compressor
        </Typography>
        <Typography component="ul" sx={{ pl: 2 }}>
          <li>Supports all image formats</li>
          <li>Adjustable compression quality</li>
          <li>Preview original and compressed images</li>
          <li>Download compressed images directly</li>
          <li>Responsive design for all devices</li>
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          How to Use the Image Compressor
        </Typography>
        <Typography paragraph>
          Using our image compressor is easy. Simply upload an image by clicking
          the "Select Image" button or dragging and dropping it into the upload
          area. Adjust the compression quality using the slider, then click
          "Compress Image" to reduce the file size. You can preview the
          compressed image and download it directly to your device.
        </Typography>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          fontWeight={600}
          sx={{ mt: 2 }}
        >
          Why Use an Online Image Compressor?
        </Typography>
        <Typography paragraph>
          Online image compressors are convenient and accessible from any device
          with an internet connection. They help optimize images for faster
          loading times, reduce bandwidth usage, and improve user experience on
          websites. Our tool is completely free to use and doesn't require any
          downloads or sign-ups.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ImageCompressor;
