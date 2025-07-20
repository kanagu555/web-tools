import React, { useState, useRef } from "react";
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
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Upload,
  Download,
  Image as ImageIcon,
  Minimize2,
  RefreshCcw,
  AlertCircle,
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
  const [format, setFormat] = useState<"image/jpeg" | "image/png">("image/jpeg");
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [error, setError] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      setError("");
      setSelectedFile(file);
      setOriginalSize(file.size);
      setPreviewUrl(URL.createObjectURL(file));
      setCompressedUrl("");
      setCompressedSize(0);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    setError("");
    setSelectedFile(file);
    setOriginalSize(file.size);
    setPreviewUrl(URL.createObjectURL(file));
    setCompressedUrl("");
    setCompressedSize(0);
  };

  const compressImage = async () => {
    if (!selectedFile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (maxWidth * height) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Apply smoothing for better quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
          }
        },
        format,
        quality / 100
      );
    };
    img.src = URL.createObjectURL(selectedFile);
  };

  const downloadCompressed = () => {
    if (!compressedUrl || !selectedFile) return;

    const extension = format === "image/jpeg" ? "jpg" : "png";
    const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
    const link = document.createElement("a");
    link.href = compressedUrl;
    link.download = `compressed-${fileName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                >
                  <ImageIcon size={48} color={theme.palette.text.secondary} />

                  <Typography color="text.secondary" sx={{ mt: 2, mb: 2 }}>
                    Select an image to compress
                  </Typography>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                    id="image-input"
                  />

                  <label htmlFor="image-input">
                    <Button
                      variant="contained"
                      component="span"
                      startIcon={<Upload />}
                    >
                      Select Image
                    </Button>
                  </label>
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
              <Typography variant="h6" gutterBottom>
                Compression Settings
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as "image/jpeg" | "image/png")}
                  label="Output Format"
                >
                  <MenuItem value="image/jpeg">JPEG</MenuItem>
                  <MenuItem value="image/png">PNG</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Quality: {quality}%</Typography>
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
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Max Width: {maxWidth}px</Typography>
                <Slider
                  value={maxWidth}
                  onChange={(_, value) => setMaxWidth(value as number)}
                  min={800}
                  max={3840}
                  step={160}
                  marks={[
                    { value: 800, label: "800px" },
                    { value: 1920, label: "1920px" },
                    { value: 3840, label: "3840px" },
                  ]}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                onClick={compressImage}
                disabled={!selectedFile}
                startIcon={<Minimize2 />}
                sx={{ mb: 2 }}
              >
                Compress Image
              </Button>

              {compressedUrl && (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={downloadCompressed}
                  startIcon={<Download />}
                  sx={{ mb: 2 }}
                >
                  Download Compressed
                </Button>
              )}

              {Number(compressionRatio) > 0 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Size reduced by {compressionRatio}%
                </Alert>
              )}

              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl("");
                  setCompressedUrl("");
                  setOriginalSize(0);
                  setCompressedSize(0);
                  setQuality(80);
                }}
                disabled={!selectedFile}
                startIcon={<RefreshCcw />}
              >
                Reset
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
