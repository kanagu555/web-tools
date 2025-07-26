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
  Switch,
  FormControlLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ContentCopy,
  Clear,
  Link as LinkIcon,
  OpenInNew,
  Delete,
  Cloud,
  Computer,
  Security,
} from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

interface ShortenedUrl {
  id?: number;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  timestamp: Date;
  source: "custom" | "tinyurl";
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

  // Backend configuration
  const [useCustomBackend, setUseCustomBackend] = useState<boolean>(true);
  const [isExternalMode, setIsExternalMode] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<
    "checking" | "online" | "offline"
  >("checking");

  // API URLs
  const getApiUrl = () => {
    if (!useCustomBackend) return null; // Will use TinyURL
    return isExternalMode
      ? "http://kodekit.ddns.net:3001"
      : "http://localhost:3001";
  };

  const getShortUrl = (shortCode: string) => {
    if (isExternalMode) {
      return `http://kodekit.ddns.net/${shortCode}`;
    }
    return `http://localhost:3001/${shortCode}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadHistoryFromStorage();
    if (useCustomBackend) {
      checkBackendStatus();
      loadUrlsFromBackend();
    }
  }, [useCustomBackend, isExternalMode]);

  // Check backend health
  const checkBackendStatus = async () => {
    if (!useCustomBackend) return;

    setBackendStatus("checking");
    try {
      const response = await fetch(`${getApiUrl()}/api/health`, {
        method: "GET",
        timeout: 5000,
      } as any);

      console.log("Checkingbackendstatus:", response);
      

      if (response.ok) {
        setBackendStatus("online");
      } else {
        setBackendStatus("offline");
      }
    } catch (error) {
      setBackendStatus("offline");
    }
  };

  // Load URLs from custom backend
  const loadUrlsFromBackend = async () => {
    if (!useCustomBackend || backendStatus !== "online") return;

    try {
      const response = await fetch(`${getApiUrl()}/api/urls`);
      console.log("Loading URLs from backend:", response);
      
      if (response.ok) {
        const urls = await response.json();
        console.log("URLsloadedfrombackend:", urls);
        
        const formattedUrls: ShortenedUrl[] = urls.map((url: any) => ({
          id: url.id,
          originalUrl: url.long_url,
          shortUrl: getShortUrl(url.short_code),
          shortCode: url.short_code,
          timestamp: new Date(url.created_at),
          source: "custom" as const,
        }));
        console.log("Loaded URLs from backend:", formattedUrls);
        setHistory(formattedUrls);
      }
    } catch (error) {
      console.error("Failed to load URLs from backend:", error);
    }
  };

  // Load history from localStorage (for TinyURL entries)
  const loadHistoryFromStorage = () => {
    const savedHistory = localStorage.getItem("urlShortenerHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          source: item.source || "tinyurl",
        }));
        if (!useCustomBackend) {
          setHistory(parsedHistory);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      }
    }
  };

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Save history to localStorage (only for TinyURL)
  useEffect(() => {
    if (!useCustomBackend) {
      const tinyUrlHistory = history.filter(
        (item) => item.source === "tinyurl"
      );
      localStorage.setItem(
        "urlShortenerHistory",
        JSON.stringify(tinyUrlHistory)
      );
    }
  }, [history, useCustomBackend]);

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

  // Generate short code for custom backend
  const generateShortCode = (): string => {
    return Math.random().toString(36).substring(2, 8);
  };

  // Shorten URL using custom backend
  const shortenUrlCustom = async (): Promise<string> => {
    const shortCode = generateShortCode();

    const response = await fetch(`${getApiUrl()}/api/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        long_url: inputUrl,
        short_code: shortCode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to shorten URL");
    }

    const data = await response.json();
    return getShortUrl(data.short_code);
  };

  // Shorten URL using TinyURL
  const shortenUrlTinyUrl = async (): Promise<string> => {
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

    return shortUrl;
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

    if (useCustomBackend && backendStatus !== "online") {
      setError(
        "Custom backend is not available. Please check your server or switch to TinyURL."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      let shortUrl: string;

      if (useCustomBackend) {
        shortUrl = await shortenUrlCustom();
        // Reload from backend to get the latest data
        await loadUrlsFromBackend();
      } else {
        shortUrl = await shortenUrlTinyUrl();

        // Add to local history for TinyURL
        const newEntry: ShortenedUrl = {
          originalUrl: inputUrl,
          shortUrl: shortUrl,
          shortCode: shortUrl.split("/").pop() || "",
          timestamp: new Date(),
          source: "tinyurl",
        };
        setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
      }

      setShortenedUrl(shortUrl);
      setSnackbarMessage("URL shortened successfully!");
      setSnackbarOpen(true);
    } catch (err: any) {
      console.error("Error shortening URL:", err);
      setError(
        err.message ||
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

  const clearHistory = async () => {
    if (useCustomBackend) {
      // For custom backend, we don't clear the server data, just reload
      await loadUrlsFromBackend();
      setSnackbarMessage("History refreshed from server!");
    } else {
      // For TinyURL, clear local storage
      setHistory([]);
      setSnackbarMessage("History cleared!");
    }
    setSnackbarOpen(true);
  };

  // Delete URL from custom backend
  const deleteUrl = async (id: number) => {
    if (!useCustomBackend || !id) return;

    try {
      const response = await fetch(`${getApiUrl()}/api/urls/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSnackbarMessage("URL deleted successfully!");
        setSnackbarOpen(true);
        await loadUrlsFromBackend(); // Refresh the list
      } else {
        setError("Failed to delete URL");
      }
    } catch (error) {
      setError("Failed to connect to server");
    }
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
          content="Free online URL shortener tool with custom backend support. Create short, shareable links instantly. Perfect for social media, email campaigns, and link management."
        />
        <meta
          name="keywords"
          content="URL shortener, short links, link shortener, free URL shortener, create short links, link management, social media links, email links, online URL shortener, custom backend"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="KodeKit" />
        <meta
          property="og:title"
          content="Free URL Shortener Tool - Create Short Links Online"
        />
        <meta
          property="og:description"
          content="Free online URL shortener tool with custom backend support. Create short, shareable links instantly."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Free URL Shortener Tool" />
        <meta
          name="twitter:description"
          content="Free online URL shortener tool with custom backend support."
        />
        <link rel="canonical" href={window.location.href} />
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
          Advanced URL Shortener Tool
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          color="text.secondary"
          paragraph
          sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" }, fontWeight: 400 }}
        >
          Create short, shareable links with custom backend support. Perfect for
          social media, email campaigns, and professional link management.
        </Typography>

        {/* Backend Configuration */}
        <Paper
          elevation={3}
          sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "background.default" }}
        >
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.25rem" }}
          >
            Backend Configuration
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useCustomBackend}
                    onChange={(e) => {
                      setUseCustomBackend(e.target.checked);
                      setShortenedUrl("");
                      setError("");
                    }}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {useCustomBackend ? <Computer /> : <Cloud />}
                    <span>
                      {useCustomBackend ? "Custom Backend" : "TinyURL Service"}
                    </span>
                  </Box>
                }
              />
            </Grid>

            {useCustomBackend && (
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isExternalMode}
                      onChange={(e) => {
                        setIsExternalMode(e.target.checked);
                        setShortenedUrl("");
                        setError("");
                      }}
                      color="secondary"
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {isExternalMode ? <Security /> : <Computer />}
                      <span>
                        {isExternalMode ? "External (HTTPS)" : "Local (HTTP)"}
                      </span>
                    </Box>
                  }
                />
              </Grid>
            )}
          </Grid>

          {useCustomBackend && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
              <Typography
                variant="body2"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <strong>Status:</strong>
                <Chip
                  label={
                    backendStatus === "online"
                      ? "Online"
                      : backendStatus === "offline"
                      ? "Offline"
                      : "Checking..."
                  }
                  color={
                    backendStatus === "online"
                      ? "success"
                      : backendStatus === "offline"
                      ? "error"
                      : "default"
                  }
                  size="small"
                />
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                <strong>Endpoint:</strong> {getApiUrl()}
              </Typography>
              {isExternalMode && (
                <Typography
                  variant="body2"
                  color="success.main"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                  }}
                >
                  <Security fontSize="small" />
                  SSL Encrypted Connection
                </Typography>
              )}
            </Box>
          )}
        </Paper>

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
                  disabled={
                    !inputUrl.trim() ||
                    loading ||
                    (useCustomBackend && backendStatus !== "online")
                  }
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
                {useCustomBackend
                  ? `Using ${
                      isExternalMode ? "external HTTPS" : "local"
                    } custom backend`
                  : "Using TinyURL service"}
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
                    backgroundColor:
                      useCustomBackend && isExternalMode
                        ? "success.light"
                        : "background.default",
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
                  {useCustomBackend && (
                    <Chip
                      label={isExternalMode ? "SSL Secured" : "Local Backend"}
                      size="small"
                      color={isExternalMode ? "success" : "primary"}
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
              </Grid>
            )}

            {/* History Section */}
            {/* {history.length > 0 && (
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
                    {useCustomBackend ? "Server URLs" : "Recent Shortened URLs"}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={clearHistory}
                    aria-label={
                      useCustomBackend
                        ? "Refresh from server"
                        : "Clear URL history"
                    }
                  >
                    {useCustomBackend ? "Refresh" : "Clear History"}
                  </Button>
                </Box>
                <Paper elevation={1} sx={{ maxHeight: 400, overflow: "auto" }}>
                  {history.map((item, index) => (
                    <Box
                      key={item.id || index}
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
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {item.timestamp.toLocaleString()}
                          </Typography>
                          <Chip
                            label={
                              item.source === "custom" ? "Custom" : "TinyURL"
                            }
                            size="small"
                            color={
                              item.source === "custom" ? "primary" : "default"
                            }
                          />
                        </Box>
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
                          {useCustomBackend && item.id && (
                            <Tooltip title="Delete URL">
                              <IconButton
                                size="small"
                                onClick={() => deleteUrl(item.id!)}
                                aria-label="Delete URL"
                                color="error"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
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
            )} */}
          </Grid>
        </Paper>

        <AdSense adSlot="6613251015" />

        {/* Information Section - Enhanced with custom backend info */}
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
            Advanced URL Shortening with Custom Backend
          </Typography>

          <Typography paragraph>
            This advanced URL shortener offers both traditional cloud-based
            shortening (TinyURL) and a custom backend solution. The custom
            backend provides enhanced control, privacy, and customization
            options for professional use cases.
          </Typography>

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3, fontSize: "1.25rem" }}
          >
            Backend Options
          </Typography>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1.1rem" }}
              >
                Custom Backend:
              </Typography>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Full control over your data and URLs</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    Custom domain support (your-domain.com)
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>SSL encryption with Let's Encrypt</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Local and external access modes</Typography>
                </Box>
                <Box component="li">
                  <Typography>Delete and manage your URLs</Typography>
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
                TinyURL Service:
              </Typography>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Reliable third-party service</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>No setup required</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Global CDN for fast redirects</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Local history tracking</Typography>
                </Box>
                <Box component="li">
                  <Typography>Established and trusted service</Typography>
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
            Key Features of This Advanced Tool:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Dual Backend Support:</strong> Switch between custom
                backend and TinyURL
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>SSL Encryption:</strong> HTTPS support with Let's
                Encrypt certificates
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Local/External Modes:</strong> Test locally or use
                external DDNS access
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Real-time Status:</strong> Backend health monitoring and
                status display
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>URL Management:</strong> Delete and manage URLs with
                custom backend
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Data Persistence:</strong> SQLite database for reliable
                storage
              </Typography>
            </Box>
            <Box component="li">
              <Typography>
                <strong>Professional Setup:</strong> Production-ready with
                auto-renewal SSL
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="h4"
            component="h4"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3, fontSize: "1.1rem" }}
          >
            Setup Requirements:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Custom Backend:</strong> Node.js server with SQLite
                database
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Domain Setup:</strong> DDNS configuration
                (kodekit.ddns.net)
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Port Forwarding:</strong> Ports 80, 443, and 3001
                configured
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>SSL Certificate:</strong> Let's Encrypt for HTTPS
                encryption
              </Typography>
            </Box>
            <Box component="li">
              <Typography>
                <strong>Fallback Option:</strong> TinyURL service when custom
                backend is unavailable
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
            <strong>Privacy & Security:</strong> When using the custom backend,
            all data is stored on your own server with full control over privacy
            and retention. SSL encryption ensures secure transmission. The
            TinyURL option provides convenience but follows their privacy
            policies. Always choose the appropriate backend based on your
            privacy and control requirements.
          </Typography>

          <Typography
            variant="h4"
            component="h4"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3, fontSize: "1.1rem" }}
          >
            Use Cases:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                component="h5"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1rem" }}
              >
                Custom Backend Ideal For:
              </Typography>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Corporate/business link management</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Branded short domains</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Analytics and tracking requirements</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Data privacy compliance</Typography>
                </Box>
                <Box component="li">
                  <Typography>High-volume link generation</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h5"
                component="h5"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1rem" }}
              >
                TinyURL Perfect For:
              </Typography>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Quick, one-off link shortening</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Personal use and social media</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>No setup or maintenance required</Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>Reliable global service</Typography>
                </Box>
                <Box component="li">
                  <Typography>Testing and prototyping</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
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
