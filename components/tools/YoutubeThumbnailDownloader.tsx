"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { YouTube } from "@mui/icons-material";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  extractVideoId,
  generateThumbnailUrls,
  validateYouTubeUrl,
  ThumbnailQuality,
} from "@/lib/utils/youtubeHelpers";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";

const YoutubeThumbnailDownloader: React.FC = () => {
  const { trackTool } = useAnalytics();
  const [youtubeUrl, setYoutubeUrl] = useState<string>("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<ThumbnailQuality[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [downloadProgress, setDownloadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleUrlSubmit = async () => {
    setError("");
    setLoading(true);

    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube video URL.");
      setLoading(false);
      return;
    }

    if (!validateYouTubeUrl(youtubeUrl)) {
      setError("Invalid YouTube URL. Please enter a valid YouTube video URL.");
      setLoading(false);
      return;
    }

    const extractedVideoId = extractVideoId(youtubeUrl);

    if (!extractedVideoId) {
      setError("Could not extract video ID from the URL.");
      setLoading(false);
      return;
    }

    setVideoId(extractedVideoId);
    const thumbnailUrls = generateThumbnailUrls(extractedVideoId);

    // Validate thumbnails exist
    const validThumbnails = await validateThumbnails(thumbnailUrls);
    setThumbnails(validThumbnails);

    if (validThumbnails.length === 0) {
      setError("No thumbnails available for this video.");
    }

    setLoading(false);
    trackTool("youtube-thumbnail-downloader", "extract");
  };

  const validateThumbnails = async (
    thumbnails: ThumbnailQuality[]
  ): Promise<ThumbnailQuality[]> => {
    const validThumbnails: ThumbnailQuality[] = [];

    for (const thumbnail of thumbnails) {
      try {
        const response = await fetch(thumbnail.url, { method: "HEAD" });
        if (response.ok) {
          validThumbnails.push(thumbnail);
        }
      } catch (error) {
        console.warn(`Thumbnail ${thumbnail.name} not available`);
      }
    }

    return validThumbnails;
  };

  const downloadThumbnail = async (thumbnail: ThumbnailQuality) => {
    try {
      setDownloadProgress((prev) => ({ ...prev, [thumbnail.name]: 0 }));

      const response = await fetch(thumbnail.url);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `youtube-thumbnail-${videoId}-${thumbnail.name}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadProgress((prev) => ({ ...prev, [thumbnail.name]: 100 }));
      showSnackbar(`Downloaded ${thumbnail.description}`);

      setTimeout(() => {
        setDownloadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[thumbnail.name];
          return newProgress;
        });
      }, 2000);

      trackTool("youtube-thumbnail-downloader", "download");
    } catch (error) {
      setError(`Failed to download ${thumbnail.description}`);
      console.error("Download error:", error);
    }
  };

  const resetForm = () => {
    setYoutubeUrl("");
    setVideoId(null);
    setThumbnails([]);
    setError("");
    setDownloadProgress({});
    trackTool("youtube-thumbnail-downloader", "reset");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navigation />

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          YouTube Thumbnail Downloader
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Download YouTube video thumbnails in HD, SD, and custom resolutions
          instantly for free
        </Typography>

        {/* URL Input Section */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Enter YouTube Video URL
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              fullWidth
              label="YouTube Video URL"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              error={!!error}
              helperText={
                error || "Paste any YouTube video URL to extract thumbnails"
              }
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleUrlSubmit();
                }
              }}
            />
            <Button
              variant="contained"
              onClick={handleUrlSubmit}
              disabled={loading || !youtubeUrl.trim()}
              startIcon={
                loading ? <RotateCcw className="animate-spin" /> : <YouTube />
              }
              sx={{ minWidth: 120, height: 56 }}
            >
              {loading ? "Processing..." : "Extract"}
            </Button>
            {(youtubeUrl || thumbnails.length > 0) && (
              <Button
                variant="outlined"
                color="error"
                onClick={resetForm}
                startIcon={<RotateCcw />}
                sx={{ minWidth: 100, height: 56 }}
              >
                Reset
              </Button>
            )}
          </Box>
        </Paper>

        {/* Thumbnail Grid */}
        {thumbnails.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Available Thumbnails
            </Typography>
            <Grid container spacing={3}>
              {thumbnails.map((thumbnail) => (
                <Grid item xs={12} sm={6} md={4} key={thumbnail.name}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={thumbnail.url}
                      alt={`YouTube thumbnail ${thumbnail.description}`}
                      sx={{ height: 200, objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {thumbnail.description}
                      </Typography>
                      <Chip
                        label={`${thumbnail.width}x${thumbnail.height}`}
                        size="small"
                        color="primary"
                      />
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Download />}
                        onClick={() => downloadThumbnail(thumbnail)}
                        disabled={
                          downloadProgress[thumbnail.name] !== undefined
                        }
                      >
                        {downloadProgress[thumbnail.name] !== undefined
                          ? `Downloading... ${
                              downloadProgress[thumbnail.name]
                            }%`
                          : "Download"}
                      </Button>
                    </CardActions>
                    {downloadProgress[thumbnail.name] !== undefined && (
                      <LinearProgress
                        variant="determinate"
                        value={downloadProgress[thumbnail.name]}
                      />
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        )}

        {/* AdSense Ad */}
        <AdSense adSlot="4552615729" />

        {/* Information Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            How It Works
          </Typography>
          <Typography paragraph>
            This tool extracts thumbnail images directly from YouTube's public
            CDN. Simply paste any YouTube video URL and get instant access to
            all available thumbnail resolutions. No account required, completely
            free, and works entirely in your browser.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 3 }}>
            Supported URL Formats
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
            <li>https://youtu.be/VIDEO_ID</li>
            <li>https://youtube.com/watch?v=VIDEO_ID</li>
            <li>https://m.youtube.com/watch?v=VIDEO_ID</li>
            <li>https://www.youtube.com/embed/VIDEO_ID</li>
          </Box>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 3 }}>
            Thumbnail Resolutions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500}>
                HD Quality (1280x720)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Maximum resolution thumbnail, best for high-quality designs
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500}>
                SD Quality (640x480)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Standard definition, good balance of quality and file size
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="4999412635" />
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default YoutubeThumbnailDownloader;
