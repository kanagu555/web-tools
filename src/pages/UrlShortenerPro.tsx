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
  QrCode,
} from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import { createClient } from "@supabase/supabase-js";
import Breadcrumb from "../components/Breadcrumb";

// Supabase configuration - You'll need to replace these with your actual values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const UrlShortenerPro: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>("");
  const [customCode, setCustomCode] = useState<string>("");
  const [shortenedUrl, setShortenedUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [useCustomCode, setUseCustomCode] = useState<boolean>(false);

  const baseUrl = window.location.origin;
  const isProductionEnv = import.meta.env.PROD;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Developer Tools", url: "/category/developer" },
    { name: "URL Shortener" },
  ];

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
    // Allow alphanumeric characters, hyphens, and underscores
    const regex = /^[a-zA-Z0-9_-]+$/;
    return regex.test(code) && code.length >= 3 && code.length <= 20;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(event.target.value);
    setError("");
  };

  const handleCustomCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomCode(event.target.value);
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

      // Check if custom code already exists
      if (useCustomCode) {
        const { data: existing } = await supabase
          .from("url_shortener")
          .select("short_code")
          .eq("short_code", shortCode)
          .single();

        if (existing) {
          setError(
            "This custom code is already taken. Please choose a different one."
          );
          setLoading(false);
          return;
        }
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from("url_shortener")
        .insert([
          {
            short_code: shortCode,
            long_url: processedUrl,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          if (useCustomCode) {
            setError(
              "This custom code is already taken. Please choose a different one."
            );
          } else {
            // Retry with a new generated code
            return shortenUrl();
          }
        } else {
          throw error;
        }
        return;
      }

      const fullShortUrl = `${baseUrl}/s/${shortCode}`;
      setShortenedUrl(fullShortUrl);

      setSnackbarMessage("URL shortened successfully!");
      setSnackbarOpen(true);

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
    setCustomCode("");
    setError("");
    setSnackbarMessage("All fields cleared");
    setSnackbarOpen(true);
  };

  const openUrl = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
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

  const urlInfo = inputUrl
    ? getUrlInfo(inputUrl.startsWith("http") ? inputUrl : "https://" + inputUrl)
    : null;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>URL Shortener Pro - Custom Short Links with Analytics</title>
        <meta
          name="description"
          content="Professional URL shortener with custom codes, analytics, and link management. Create branded short links with detailed tracking and statistics."
        />
        <meta
          name="keywords"
          content="URL shortener pro, custom short links, link analytics, branded links, professional URL shortener, link management, click tracking"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="KodeKit" />
        <meta
          property="og:title"
          content="URL Shortener Pro - Custom Short Links with Analytics"
        />
        <meta
          property="og:description"
          content="Professional URL shortener with custom codes, analytics, and link management."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="URL Shortener Pro" />
        <meta
          name="twitter:description"
          content="Professional URL shortener with custom codes, analytics, and link management."
        />
        <link rel="canonical" href={window.location.href} />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "URL Shortener Pro",
            description:
              "Professional URL shortener with custom codes and analytics",
            url: window.location.href,
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Custom Short Codes",
              "Link Analytics",
              "Bulk URL Management",
              "Click Tracking",
              "Professional Dashboard",
            ],
          })}
        </script>
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

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
          Free URL Shortener Pro
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          color="text.secondary"
          paragraph
          sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" }, fontWeight: 400 }}
        >
          Professional URL shortener with custom codes, analytics, and advanced
          link management features.
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

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useCustomCode}
                    onChange={(e) => setUseCustomCode(e.target.checked)}
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
                  aria-describedby="custom-code-help"
                  inputProps={{
                    "aria-label": "Enter custom short code",
                  }}
                />
                <Typography
                  id="custom-code-help"
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
                  {loading ? "Creating..." : "Create Short Link"}
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
                Create a professional short link with optional custom code
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
                    Your Short Link:
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1 }}
                    role="group"
                    aria-label="Short link actions"
                  >
                    <Tooltip title="Open short link in new tab">
                      <IconButton
                        onClick={() => openUrl(shortenedUrl)}
                        size="small"
                        aria-label="Open short link in new tab"
                      >
                        <OpenInNew />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate QR Code">
                      <IconButton
                        onClick={() =>
                          openUrl(
                            `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                              shortenedUrl
                            )}`
                          )
                        }
                        size="small"
                        aria-label="Generate QR code for short link"
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
                        aria-label={
                          copied
                            ? "Short link copied to clipboard"
                            : "Copy short link to clipboard"
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
                  aria-label="Short link result"
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
                  aria-live="polite"
                >
                  Original length: {inputUrl.length} characters → Short length:{" "}
                  {shortenedUrl.length} characters
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Examples Section */}
        <Paper
          elevation={3}
          sx={{ p: 3, mb: 3, borderRadius: 2 }}
          component="section"
          aria-labelledby="examples-heading"
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
                  sx={{ fontSize: "1rem", mb: 1, color: "success.dark" }}
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
                  sx={{ fontSize: "1rem", mb: 1, color: "error.dark" }}
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
                  sx={{ fontSize: "1rem", mb: 1, color: "info.dark" }}
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

        {isProductionEnv && <AdSense adSlot="6613251015" />}

        {/* Features Section */}
        <Paper
          elevation={3}
          sx={{ p: 3, mb: 3, borderRadius: 2 }}
          component="section"
          aria-labelledby="features-heading"
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

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
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

export default UrlShortenerPro;
