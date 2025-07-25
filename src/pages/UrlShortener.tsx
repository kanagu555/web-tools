import React, { useState, useEffect } from "react";
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
  Alert,
  Chip,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ContentCopy,
  Clear,
  Link as LinkIcon,
  OpenInNew,
  Info,
} from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

interface ShortenedUrl {
  originalUrl: string;
  shortUrl: string;
  timestamp: Date;
}

const UrlShortener: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [history, setHistory] = useState<ShortenedUrl[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Load history from localStorage
    const savedHistory = localStorage.getItem("urlShortenerHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setHistory(parsedHistory);
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    }
  }, []);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("urlShortenerHistory", JSON.stringify(history));
  }, [history]);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(event.target.value);
    setError("");
  };

  const shortenUrl = async () => {
    if (!inputUrl.trim()) {
      setError("Please enter a URL to shorten.");
      return;
    }

    if (!validateUrl(inputUrl)) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Using TinyURL API (free, no auth required)
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(inputUrl)}`
      );

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const shortUrl = await response.text();

      if (shortUrl.includes("Error") || shortUrl.includes("Invalid")) {
        throw new Error("Invalid URL provided");
      }

      setShortenedUrl(shortUrl);

      // Add to history
      const newEntry: ShortenedUrl = {
        originalUrl: inputUrl,
        shortUrl: shortUrl,
        timestamp: new Date(),
      };
      setHistory((prev) => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 items

      setSnackbarMessage("URL shortened successfully!");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error shortening URL:", err);
      setError(
        "Failed to shorten URL. Please try again or check if the URL is valid."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string = shortenedUrl) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setSnackbarMessage("Copied to clipboard!");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setError("Failed to copy to clipboard.");
      });
  };

  const clearAll = () => {
    setInputUrl("");
    setShortenedUrl("");
    setError("");
    setSnackbarMessage("All fields cleared");
    setSnackbarOpen(true);
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const clearHistory = () => {
    setHistory([]);
    setSnackbarMessage("History cleared!");
    setSnackbarOpen(true);
  };

  const getUrlInfo = (url: string) => {
    try {
      const urlObj = new URL(url);
      return {
        domain: urlObj.hostname,
        protocol: urlObj.protocol,
        hasParams: urlObj.search.length > 0,
        hasFragment: urlObj.hash.length > 0,
      };
    } catch {
      return null;
    }
  };

  const urlInfo = inputUrl ? getUrlInfo(inputUrl) : null;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Free URL Shortener Tool - Create Short Links Online</title>
        <meta
          name="description"
          content="Free online URL shortener tool. Create short, shareable links instantly. Perfect for social media, email campaigns, and link management. No registration required."
        />
        <meta
          name="keywords"
          content="URL shortener, short links, link shortener, free URL shortener, create short links, link management, social media links, email links, online URL shortener"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="KodeKit" />
        <meta
          property="og:title"
          content="Free URL Shortener Tool - Create Short Links Online"
        />
        <meta
          property="og:description"
          content="Free online URL shortener tool. Create short, shareable links instantly."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Free URL Shortener Tool" />
        <meta
          name="twitter:description"
          content="Free online URL shortener tool. Create short, shareable links instantly."
        />
        <link rel="canonical" href={window.location.href} />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "URL Shortener Tool",
            description: "Free online tool to create short, shareable links",
            url: window.location.href,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "URL Shortening",
              "Link Management",
              "History Tracking",
              "Copy to Clipboard",
              "Link Validation",
            ],
          })}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
        >
          Free URL Shortener Tool
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          color="text.secondary"
          paragraph
          sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" }, fontWeight: 400 }}
        >
          Create short, shareable links instantly. Perfect for social media,
          email campaigns, and link management.
        </Typography>

        {/* Main Tool Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enter URL to Shorten"
                value={inputUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                variant="outlined"
                aria-describedby="url-help"
                inputProps={{
                  "aria-label": "Enter URL to shorten",
                }}
              />
              <Typography
                id="url-help"
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Enter any valid URL starting with http:// or https://
              </Typography>
            </Grid>

            {/* URL Info Display */}
            {urlInfo && (
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                    component="h3"
                  >
                    URL Information:
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                    role="list"
                    aria-label="URL information"
                  >
                    <Chip
                      label={`Domain: ${urlInfo.domain}`}
                      size="small"
                      variant="outlined"
                      role="listitem"
                    />
                    <Chip
                      label={urlInfo.protocol.toUpperCase()}
                      size="small"
                      variant="outlined"
                      color={
                        urlInfo.protocol === "https:" ? "success" : "warning"
                      }
                      role="listitem"
                    />
                    {urlInfo.hasParams && (
                      <Chip
                        label="Has Parameters"
                        size="small"
                        variant="outlined"
                        role="listitem"
                      />
                    )}
                    {urlInfo.hasFragment && (
                      <Chip
                        label="Has Fragment"
                        size="small"
                        variant="outlined"
                        role="listitem"
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 1,
                }}
                role="group"
                aria-label="URL shortening actions"
              >
                <Button
                  variant="contained"
                  onClick={shortenUrl}
                  disabled={!inputUrl.trim() || loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <LinkIcon />
                  }
                  aria-describedby="shorten-button-help"
                >
                  {loading ? "Shortening..." : "Shorten URL"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearAll}
                  disabled={!inputUrl.trim() && !shortenedUrl}
                  startIcon={<Clear />}
                  aria-label="Clear all input and output"
                >
                  Clear All
                </Button>
              </Box>
              <Typography
                id="shorten-button-help"
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center" }}
              >
                Click to create a shortened version of your URL
              </Typography>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" role="alert" aria-live="polite">
                  {error}
                </Alert>
              </Grid>
            )}

            {shortenedUrl && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h3"
                    sx={{ fontSize: "1.25rem" }}
                  >
                    Shortened URL:
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1 }}
                    role="group"
                    aria-label="Shortened URL actions"
                  >
                    <Tooltip title="Open shortened URL in new tab">
                      <IconButton
                        onClick={() => openUrl(shortenedUrl)}
                        size="small"
                        aria-label="Open shortened URL in new tab"
                      >
                        <OpenInNew />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        copied
                          ? "Copied to clipboard!"
                          : "Copy shortened URL to clipboard"
                      }
                    >
                      <IconButton
                        onClick={() => copyToClipboard()}
                        color={copied ? "success" : "default"}
                        size="small"
                        aria-label={
                          copied
                            ? "Shortened URL copied to clipboard"
                            : "Copy shortened URL to clipboard"
                        }
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    backgroundColor: "background.default",
                    wordBreak: "break-all",
                  }}
                  role="region"
                  aria-label="Shortened URL result"
                  tabIndex={0}
                >
                  <Typography
                    fontFamily="monospace"
                    component="a"
                    href={shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      textDecoration: "none",
                      color: "primary.main",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {shortenedUrl}
                  </Typography>
                </Paper>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                  aria-live="polite"
                >
                  Original length: {inputUrl.length} characters → Shortened
                  length: {shortenedUrl.length} characters
                </Typography>
              </Grid>
            )}

            {/* History Section */}
            {history.length > 0 && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h3"
                    component="h3"
                    sx={{ fontSize: "1.25rem" }}
                  >
                    Recent Shortened URLs
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearHistory}
                    aria-label="Clear URL history"
                  >
                    Clear History
                  </Button>
                </Box>
                <Paper elevation={1} sx={{ maxHeight: 300, overflow: "auto" }}>
                  {history.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 2,
                        borderBottom:
                          index < history.length - 1 ? "1px solid" : "none",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {item.timestamp.toLocaleString()}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Tooltip title="Copy original URL">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(item.originalUrl)}
                              aria-label="Copy original URL"
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Copy short URL">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(item.shortUrl)}
                              aria-label="Copy short URL"
                            >
                              <LinkIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "monospace",
                          wordBreak: "break-all",
                          mb: 0.5,
                        }}
                      >
                        <strong>Original:</strong>{" "}
                        {item.originalUrl.substring(0, 60)}
                        {item.originalUrl.length > 60 ? "..." : ""}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", wordBreak: "break-all" }}
                      >
                        <strong>Short:</strong> {item.shortUrl}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>

        <AdSense adSlot="6613251015" />

        {/* Information Section */}
        <Paper
          elevation={3}
          sx={{ p: 3, mb: 3, borderRadius: 2 }}
          component="section"
          aria-labelledby="info-heading"
        >
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.5rem" }}
            id="info-heading"
          >
            What is URL Shortening? - Complete Guide
          </Typography>

          <Typography paragraph>
            URL shortening is a technique that creates a shorter alias for a
            long URL. When users click the short link, they are redirected to
            the original long URL. This is particularly useful for social media
            platforms with character limits, email campaigns, and improving user
            experience.
          </Typography>

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3, fontSize: "1.25rem" }}
          >
            Benefits of URL Shortening
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1.1rem" }}
              >
                User Experience:
              </Typography>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    Easier to share on social media platforms
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    Cleaner appearance in emails and messages
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Easier to remember and type manually</Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    Better for print materials and QR codes
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1.1rem" }}
              >
                Technical Benefits:
              </Typography>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    Reduces character count in limited-space contexts
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Masks complex query parameters</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    Can provide click tracking and analytics
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    Allows for link management and updates
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="h4"
            component="h4"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3, fontSize: "1.1rem" }}
          >
            Key Features of This Tool:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Free Service:</strong> No registration or payment
                required
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Instant Results:</strong> Get shortened URLs immediately
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>URL Validation:</strong> Ensures only valid URLs are
                processed
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>History Tracking:</strong> Keep track of your recent
                shortened URLs
              </Typography>
            </Box>
            <Box component="li">
              <Typography>
                <strong>One-Click Copy:</strong> Easy copying to clipboard
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "action.hover",
              borderRadius: 1,
              fontStyle: "italic",
            }}
          >
            <strong>Privacy Note:</strong> This tool uses TinyURL's free service
            to create short links. While we don't store your URLs, TinyURL may
            have their own data retention policies. Always review the privacy
            policy of URL shortening services for sensitive links.
          </Typography>
        </Paper>

        <AdSense adSlot="6613251015" />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          aria-live="polite"
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            sx={{ width: "100%" }}
            role="alert"
            variant="filled"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default UrlShortener;
