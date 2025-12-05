"use client";

import { useState } from "react";
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
          variant="h1"
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
                          ? `Downloading... ${downloadProgress[thumbnail.name]
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

        {/* Features Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "1px solid divider",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Why Use Our YouTube Thumbnail Downloader?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Download size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Instant Downloads
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get high-quality YouTube thumbnails instantly with one click.
                  No waiting, no registration required.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <YouTube sx={{ color: "white" }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Multiple Resolutions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download thumbnails in various resolutions from HD to SD
                  quality to suit your specific needs.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "warning.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <img src="/favicon.ico" width={24} height={24} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Completely Free
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our tool is 100% free to use with no hidden fees or
                  registration requirements. Download as many thumbnails as you
                  need.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* How It Works Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "1px solid divider",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            How to Download YouTube Thumbnails
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  1
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Copy Video URL
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Copy the URL of the YouTube video whose thumbnail you want to
                  download.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  2
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Paste URL
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paste the URL into the input field above and click the
                  "Extract" button.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  3
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Select Resolution
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose from available thumbnail resolutions that best fit your
                  needs.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: "primary.main",
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  4
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Download
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click the download button to save the thumbnail to your device
                  instantly.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Benefits Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "1px solid divider",
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Key Benefits
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    100% Free & No Registration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use our YouTube thumbnail downloader completely free without
                    creating an account or providing personal information.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Privacy Protected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All processing happens locally in your browser. Your video
                    URLs are never stored or transmitted to our servers.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Works on All Devices
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compatible with Windows, Mac, Linux, iOS, and Android. Works
                    in any modern web browser.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "success.main",
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    High Quality Output
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download thumbnails in the highest available quality without
                    any compression or quality loss.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* FAQ Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "background.paper",
            border: "1px solid divider",
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Is it legal to download YouTube thumbnails?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Yes, downloading YouTube thumbnails for personal use is generally
              legal as they are publicly accessible. However, be aware of
              copyright restrictions when using thumbnails for commercial
              purposes.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              What thumbnail resolutions are available?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We provide thumbnails in multiple resolutions including Maximum
              Resolution (1280x720), High Quality (480x360), Medium Quality
              (320x180), and Standard Definition (640x480).
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Is my YouTube video data secure?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Yes, absolutely. Our tool works entirely in your browser and never
              sends your video URLs or any personal data to our servers. Your
              privacy is protected.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Can I download thumbnails from private videos?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              No, our tool can only download thumbnails from publicly accessible
              videos. Thumbnails from private or unlisted videos cannot be
              accessed.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              What YouTube URL formats are supported?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our tool supports all major YouTube URL formats including:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              <li>https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>https://youtu.be/VIDEO_ID</li>
              <li>https://youtube.com/watch?v=VIDEO_ID</li>
              <li>https://m.youtube.com/watch?v=VIDEO_ID</li>
              <li>https://www.youtube.com/embed/VIDEO_ID</li>
            </Box>
          </Box>
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
