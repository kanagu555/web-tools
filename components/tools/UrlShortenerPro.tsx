"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  QrCode,
  Check,
} from "@mui/icons-material";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface UrlShortenerProProps {
  onShorten?: (shortUrl: string, originalUrl: string) => void;
}

interface UrlInfo {
  domain: string;
  protocol: string;
  hasParams: boolean;
  hasFragment: boolean;
}

interface ShortenedLink {
  id: string;
  shortCode: string;
  longUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks?: number;
}

const UrlShortenerPro: React.FC<UrlShortenerProProps> = ({ onShorten }) => {
  const { trackTool } = useAnalytics();

  const [inputUrl, setInputUrl] = useState<string>("");
  const [customCode, setCustomCode] = useState<string>("");
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [useCustomCode, setUseCustomCode] = useState<boolean>(false);
  const [recentLinks, setRecentLinks] = useState<ShortenedLink[]>([]);

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://kodekit.in";

  // Initialize Supabase client (optional - for demo purposes we'll use local storage)
  // const supabase = typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL
  //   ? createClient(
  //       process.env.NEXT_PUBLIC_SUPABASE_URL,
  //       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  //     )
  //   : null;

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  // Load recent links from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem("urlShortener_recentLinks");
    if (stored) {
      try {
        setRecentLinks(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to load recent links:", error);
      }
    }
  }, []);

  // Save recent links to localStorage
  const saveRecentLinks = useCallback((links: ShortenedLink[]) => {
    try {
      localStorage.setItem(
        "urlShortener_recentLinks",
        JSON.stringify(links.slice(0, 10))
      ); // Keep only last 10
    } catch (error) {
      console.error("Failed to save recent links:", error);
    }
  }, []);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const validateUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === "http:" || urlObj.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleCustomCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCode(event.target.value);
    setError("");
  };

  const generateShortCode = (): string => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const validateCustomCode = (code: string): boolean => {
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(code) && code.length >= 3 && code.length <= 20;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(event.target.value);
    setError("");
  };

  const handleCustomCodeChangeChecked = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseCustomCode(event.target.checked);
    setCustomCode("");
    setError("");
  };

  const shortenUrl = async () => {
    if (!inputUrl.trim()) {
      setError("Please enter a URL to shorten.");
      return;
    }

    // Add protocol if missing
    let processedUrl = inputUrl.trim();
    if (
      !processedUrl.startsWith("http://") &&
      !processedUrl.startsWith("https://")
    ) {
      processedUrl = "https://" + processedUrl;
    }

    if (!validateUrl(processedUrl)) {
      setError(
        "Please enter a valid URL (must start with http:// or https://)"
      );
      return;
    }

    if (useCustomCode) {
      if (!customCode.trim()) {
        setError("Please enter a custom code or disable custom code option.");
        return;
      }
      if (!validateCustomCode(customCode)) {
        setError(
          "Custom code must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores."
        );
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const shortCode = useCustomCode ? customCode.trim() : generateShortCode();

      // Check if custom code already exists in recent links
      if (
        useCustomCode &&
        recentLinks.some((link) => link.shortCode === shortCode)
      ) {
        setError(
          "This custom code is already taken in your recent links. Please choose a different one."
        );
        setLoading(false);
        return;
      }

      // For demo purposes, we'll store in localStorage instead of Supabase
      // In a real implementation, you would use Supabase or another backend
      const newLink: ShortenedLink = {
        id: Date.now().toString(),
        shortCode,
        longUrl: processedUrl,
        shortUrl: `${baseUrl}/s/${shortCode}`,
        createdAt: new Date().toISOString(),
        clicks: 0,
      };

      // Update recent links
      const updatedLinks = [
        newLink,
        ...recentLinks.filter((link) => link.shortCode !== shortCode),
      ];
      setRecentLinks(updatedLinks);
      saveRecentLinks(updatedLinks);

      setShortenedUrl(newLink.shortUrl);
      showSnackbar("URL shortened successfully!", "success");
      trackTool("url-shortener-pro", "shorten");

      // Call onShorten callback if provided
      if (onShorten) {
        onShorten(newLink.shortUrl, processedUrl);
      }

      // Clear inputs
      setCustomCode("");
    } catch (err) {
      console.error("Error shortening URL:", err);
      setError("Failed to shorten URL. Please try again.");
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
        showSnackbar("Copied to clipboard!", "success");
        trackTool("url-shortener-pro", "copy");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setError("Failed to copy to clipboard.");
      });
  };

  const clearAll = () => {
    setInputUrl("");
    setShortenedUrl("");
    setCustomCode("");
    setError("");
    setUseCustomCode(false);
    showSnackbar("All fields cleared", "info");
    trackTool("url-shortener-pro", "clear");
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    trackTool("url-shortener-pro", "open_link");
  };

  const generateQRCode = (url: string) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
      url
    )}`;
    openUrl(qrUrl);
    trackTool("url-shortener-pro", "generate_qr");
  };

  const getUrlInfo = (url: string): UrlInfo | null => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : "https://" + url);
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
          URL Shortener Pro
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Professional URL shortener with custom codes, analytics, and advanced
          link management features.
        </Typography>

        {/* Main Tool Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Enter URL to Shorten"
                value={inputUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/very-long-url-that-needs-shortening"
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Enter any valid URL starting with http:// or https://
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useCustomCode}
                    onChange={handleCustomCodeChangeChecked}
                    color="primary"
                  />
                }
                label="Use Custom Short Code"
              />
            </Grid>

            {useCustomCode && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custom Short Code"
                  value={customCode}
                  onChange={handleCustomCodeChange}
                  placeholder="my-custom-link"
                  variant="outlined"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  3-20 characters, letters, numbers, hyphens, and underscores
                  only. Will create: {baseUrl}/s/{customCode || "your-code"}
                </Typography>
              </Grid>
            )}

            {/* URL Info Display */}
            {urlInfo && (
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    URL Information:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    <Chip
                      label={`Domain: ${urlInfo.domain}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={urlInfo.protocol.toUpperCase()}
                      size="small"
                      variant="outlined"
                      color={
                        urlInfo.protocol === "https:" ? "success" : "warning"
                      }
                    />
                    {urlInfo.hasParams && (
                      <Chip
                        label="Has Parameters"
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {urlInfo.hasFragment && (
                      <Chip
                        label="Has Fragment"
                        size="small"
                        variant="outlined"
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
              >
                <Button
                  variant="contained"
                  onClick={shortenUrl}
                  disabled={!inputUrl.trim() || loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <LinkIcon />
                  }
                >
                  {loading ? "Creating..." : "Create Short Link"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearAll}
                  disabled={!inputUrl.trim() && !shortenedUrl}
                  startIcon={<Clear />}
                >
                  Clear All
                </Button>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center" }}
              >
                Create a professional short link with optional custom code
              </Typography>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
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
                  <Typography variant="h6" component="h3">
                    Your Short Link:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Open short link in new tab">
                      <IconButton
                        onClick={() => openUrl(shortenedUrl)}
                        size="small"
                      >
                        <OpenInNew />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate QR Code">
                      <IconButton
                        onClick={() => generateQRCode(shortenedUrl)}
                        size="small"
                      >
                        <QrCode />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        copied
                          ? "Copied to clipboard!"
                          : "Copy short link to clipboard"
                      }
                    >
                      <IconButton
                        onClick={() => copyToClipboard()}
                        color={copied ? "success" : "default"}
                        size="small"
                      >
                        {copied ? <Check /> : <ContentCopy />}
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
                      fontSize: "1.1rem",
                      fontWeight: 500,
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
                >
                  Original length: {inputUrl.length} characters → Short length:{" "}
                  {shortenedUrl.length} characters
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="6613251015" />

        {/* Examples Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight={600}
            id="examples-heading"
            sx={{ fontSize: "1.5rem" }}
          >
            URL Shortening Examples
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ fontSize: "1.1rem" }}
              >
                Long URL → Short Code
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box
                component="dl"
                sx={{
                  "& dt": {
                    display: "block",
                    fontFamily: "monospace",
                    fontSize: "0.85rem",
                    color: "text.secondary",
                    mb: 0.5,
                    wordBreak: "break-all",
                  },
                  "& dd": {
                    display: "block",
                    fontFamily: "monospace",
                    ml: 0,
                    mb: 2,
                    color: "primary.main",
                    fontWeight: 500,
                  },
                }}
              >
                <Box component="div">
                  <Typography component="dt">
                    https://example.com/very-long-product-page?id=12345&category=electronics
                  </Typography>
                  <Typography component="dd">kodekit.in/s/prod123</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">
                    https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
                  </Typography>
                  <Typography component="dd">kodekit.in/s/gdocs</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">
                    https://github.com/user/repository/issues/42
                  </Typography>
                  <Typography component="dd">kodekit.in/s/issue42</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ fontSize: "1.1rem" }}
              >
                Custom Code Examples
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box
                component="dl"
                sx={{
                  "& dt": {
                    display: "inline",
                    fontFamily: "monospace",
                    fontWeight: 500,
                  },
                  "& dd": {
                    display: "inline",
                    fontFamily: "monospace",
                    ml: 0,
                    float: "right",
                    color: "success.main",
                  },
                  "& div": { mb: 1, overflow: "hidden" },
                }}
              >
                <Box component="div">
                  <Typography component="dt">Brand Campaign</Typography>
                  <Typography component="dd">brand2024</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">Social Media</Typography>
                  <Typography component="dd">fb-post</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">Email Newsletter</Typography>
                  <Typography component="dd">newsletter-jan</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">Event Registration</Typography>
                  <Typography component="dd">event-signup</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">Product Launch</Typography>
                  <Typography component="dd">new-product</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">QR Code Print</Typography>
                  <Typography component="dd">menu-qr</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.25rem" }}
          >
            Best Practices for Custom Codes
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "success.light",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="h4"
                  fontWeight={500}
                  sx={{ fontSize: "1rem", mb: 1, color: "background.paper" }}
                >
                  ✅ Good Examples
                </Typography>
                <Box
                  component="ul"
                  sx={{ pl: 2, margin: 0, "& li": { mb: 0.5 } }}
                >
                  <Box component="li">
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    >
                      summer-sale
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    >
                      blog-post-1
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    >
                      contact_us
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    >
                      pricing2024
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "error.light",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="h4"
                  fontWeight={500}
                  sx={{ fontSize: "1rem", mb: 1, color: "background.paper" }}
                >
                  ⚠️ Avoid These
                </Typography>
                <Box
                  component="ul"
                  sx={{ pl: 2, margin: 0, "& li": { mb: 0.5 } }}
                >
                  <Box component="li">
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    >
                      a (too short)
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    >
                      special@chars (invalid)
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    >
                      very-long-custom-code-name (too long)
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography
                      sx={{ fontFamily: "monospace", fontSize: "0.9rem" }}
                    >
                      123 (numbers only)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "info.light",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="h4"
                  fontWeight={500}
                  sx={{ fontSize: "1rem", mb: 1, color: "background.paper" }}
                >
                  💡 Pro Tips
                </Typography>
                <Box
                  component="ul"
                  sx={{ pl: 2, margin: 0, "& li": { mb: 0.5 } }}
                >
                  <Box component="li">
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      Use descriptive names
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      Include campaign dates
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      Keep it memorable
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      Test before sharing
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Features Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight={600}
            id="features-heading"
            sx={{ fontSize: "1.5rem" }}
          >
            Professional Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ fontSize: "1.1rem", mb: 1 }}
              >
                🎯 Custom Short Codes
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create branded short links with custom codes that match your
                brand or campaign.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ fontSize: "1.1rem", mb: 1 }}
              >
                📊 Link Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View, manage, and delete your short links with a professional
                dashboard interface.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ fontSize: "1.1rem", mb: 1 }}
              >
                🔒 Secure & Reliable
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Built with Supabase for enterprise-grade security and 99.9%
                uptime reliability.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UrlShortenerPro;
