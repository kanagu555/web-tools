import React, { useState, useRef } from "react";
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
import AdSense from "../components/AdSense";

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

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Image Resizer
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
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
                    alt="Preview"
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
                >
                  <ImageIcon size={48} color={theme.palette.text.secondary} />
                  <Typography color="text.secondary" sx={{ mt: 2 }}>
                    Drag and drop an image here, or click to select
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
                      sx={{ mt: 2 }}
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
            >
              <Typography variant="h6" gutterBottom>
                Resize Options
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Width"
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Height"
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                    startIcon={<RefreshCw />}
                  >
                    {maintainAspectRatio
                      ? "Lock Aspect Ratio"
                      : "Unlock Aspect Ratio"}
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Output Format
                  </Typography>
                  <Select
                    fullWidth
                    value={format}
                    onChange={(e) =>
                      setFormat(e.target.value as "jpeg" | "png" | "webp")
                    }
                  >
                    <MenuItem value="jpeg">JPEG</MenuItem>
                    <MenuItem value="png">PNG</MenuItem>
                    <MenuItem value="webp">WebP</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Quality ({quality}%)
                  </Typography>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    style={{ width: "100%" }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={resizeImage}
                    disabled={!selectedFile}
                    startIcon={<Download />}
                  >
                    Download Resized Image
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </motion.div>
      <AdSense adSlot="6613251015" />
    </Container>
  );
};

export default ImageResizer;
