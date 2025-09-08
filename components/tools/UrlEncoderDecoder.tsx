"use client";

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
  FormControlLabel,
  Switch,
  Alert,
  Tabs,
  Tab,
  Chip,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ContentCopy,
  Info,
  Clear,
  Download,
  Upload,
  Link,
  Code,
  Security,
} from "@mui/icons-material";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

const UrlEncoderDecoder: React.FC = () => {
  const { trackTool } = useAnalytics();

  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0); // 0 for encode, 1 for decode
  const [preserveSpecialChars, setPreserveSpecialChars] =
    useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
    setError("");
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setOutputText(""); // Clear output when switching tabs
    setError("");
    trackTool(
      "url-encoder-decoder",
      newValue === 0 ? "switch_encode" : "switch_decode"
    );
  };

  const processText = () => {
    if (!inputText.trim()) {
      setError("Please enter some text to process.");
      setOutputText("");
      return;
    }

    try {
      let result = "";

      if (activeTab === 0) {
        // Encode
        if (preserveSpecialChars) {
          // Preserve some special characters that are commonly used in URLs
          result = inputText
            .replace(/%/g, "%25") // Encode % first to avoid double encoding
            .replace(/\+/g, "%2B")
            .replace(/\s/g, "+") // Replace spaces with +
            .replace(/[^\w\-.~!'()*+,;=:/?@]/g, (char) => {
              return (
                "%" +
                char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")
              );
            });
        } else {
          // Standard encodeURIComponent with space to + conversion
          result = encodeURIComponent(inputText).replace(/%20/g, "+");
        }
        setSnackbarMessage("Encoded successfully");
        setSnackbarOpen(true);
        trackTool("url-encoder-decoder", "encode");
      } else {
        // Decode
        // First replace + with space, then use decodeURIComponent
        const prepared = inputText.replace(/\+/g, " ");
        result = decodeURIComponent(prepared);
        setSnackbarMessage("Decoded successfully");
        setSnackbarOpen(true);
        trackTool("url-encoder-decoder", "decode");
      }

      setOutputText(result);
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unknown error occurred.");
      }
      console.error("Processing error:", err);
    }
  };

  const copyToClipboard = (text: string = outputText) => {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setSnackbarMessage("Copied to clipboard!");
        setSnackbarOpen(true);
        trackTool("url-encoder-decoder", "copy");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setError("Failed to copy to clipboard.");
      });
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setError("");
    setSnackbarMessage("All fields cleared");
    setSnackbarOpen(true);
    trackTool("url-encoder-decoder", "clear");
  };

  const downloadResult = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab === 0 ? "encoded" : "decoded"}_result.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setSnackbarMessage("Result downloaded");
    setSnackbarOpen(true);
    trackTool("url-encoder-decoder", "download");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setError("File size must be less than 1MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["text/plain", "text/csv", "application/json"];
    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(txt|csv|json)$/i)
    ) {
      setError("Please upload a valid text file (.txt, .csv, or .json)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInputText(content);
      setSnackbarMessage(`File "${file.name}" loaded successfully`);
      setSnackbarOpen(true);
      trackTool("url-encoder-decoder", "file_upload");
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
    };
    reader.readAsText(file);
  };

  const detectUrlComponents = (text: string) => {
    const components = [];
    if (text.includes("://")) components.push("Protocol");
    if (text.includes("?")) components.push("Query Parameters");
    if (text.includes("#")) components.push("Fragment");
    if (text.includes("%")) components.push("Encoded Characters");
    if (text.includes("+")) components.push("Encoded Spaces");
    return components;
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
          URL Encoder & Decoder
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            Instantly encode and decode URLs, query parameters, and special
            characters online. Perfect for web developers and SEO professionals.
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Link sx={{ fontSize: 18 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    URL Processing
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Encode and decode URLs with special characters, query
                  parameters, and preserve URL structure for web development.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Code sx={{ fontSize: 18 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    Developer Tools
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Essential tool for web developers working with APIs, forms,
                  and dynamic URL generation with proper encoding.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Security sx={{ fontSize: 18 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    Safe Processing
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Handle special characters safely in URLs to prevent security
                  issues and ensure proper data transmission.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

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
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{ mb: 3 }}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Encode URL" />
            <Tab label="Decode URL" />
          </Tabs>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                {activeTab === 0 ? "Text to Encode" : "Text to Decode"}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={inputText}
                onChange={handleInputChange}
                placeholder={
                  activeTab === 0
                    ? "Enter URL or text to encode (e.g., https://example.com/search?q=hello world)"
                    : "Enter encoded URL or text to decode (e.g., https%3A//example.com/search%3Fq%3Dhello%2Bworld)"
                }
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "background.default",
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {activeTab === 0
                  ? "Enter any URL or text containing special characters that need to be URL-encoded"
                  : "Enter URL-encoded text that you want to decode back to readable format"}
              </Typography>
            </Grid>

            {activeTab === 0 && (
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preserveSpecialChars}
                        onChange={(e) =>
                          setPreserveSpecialChars(e.target.checked)
                        }
                        color="primary"
                      />
                    }
                    label="Preserve URL-Safe Special Characters"
                  />
                  <Tooltip title="When enabled, keeps URL-safe characters like :, /, ?, =, & unencoded. Useful for encoding parts of already structured URLs while preserving their structure.">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, ml: 4 }}
                >
                  When enabled, URL-safe characters like :, /, ?, =, & remain
                  unencoded
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  onClick={processText}
                  disabled={!inputText.trim()}
                  size="large"
                >
                  {activeTab === 0 ? "Encode URL" : "Decode URL"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearAll}
                  disabled={!inputText.trim() && !outputText}
                  startIcon={<Clear />}
                >
                  Clear All
                </Button>
                <input
                  accept=".txt,.csv,.json"
                  style={{ display: "none" }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                  >
                    Upload File
                  </Button>
                </label>
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            {outputText && (
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
                  <Typography variant="subtitle1" fontWeight={600}>
                    {activeTab === 0 ? "Encoded Result:" : "Decoded Result:"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Tooltip title="Download result as text file">
                      <IconButton onClick={downloadResult} size="small">
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={
                        copied
                          ? "Copied to clipboard!"
                          : "Copy result to clipboard"
                      }
                    >
                      <IconButton
                        onClick={() => copyToClipboard()}
                        color={copied ? "success" : "default"}
                        size="small"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* URL Components Detection */}
                {inputText && detectUrlComponents(inputText).length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Detected URL components:
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {detectUrlComponents(inputText).map(
                        (component, index) => (
                          <Chip
                            key={index}
                            label={component}
                            size="small"
                            variant="outlined"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "background.default",
                    wordBreak: "break-all",
                    maxHeight: 300,
                    overflow: "auto",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    fontFamily="monospace"
                    component="pre"
                    sx={{ whiteSpace: "pre-wrap", margin: 0 }}
                  >
                    {outputText}
                  </Typography>
                </Paper>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Result length: {outputText.length} characters
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="3174835314" />

        {/* Examples Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            Common URL Encoding Examples
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="h3"
                fontWeight={500}
                gutterBottom
              >
                Character → Encoded
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  "& .example-row": {
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    fontFamily: "monospace",
                  },
                }}
              >
                <Box className="example-row">
                  <Typography>Space</Typography>
                  <Typography>%20 or +</Typography>
                </Box>
                <Box className="example-row">
                  <Typography>&</Typography>
                  <Typography>%26</Typography>
                </Box>
                <Box className="example-row">
                  <Typography>?</Typography>
                  <Typography>%3F</Typography>
                </Box>
                <Box className="example-row">
                  <Typography>=</Typography>
                  <Typography>%3D</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="h3"
                fontWeight={500}
                gutterBottom
              >
                Character → Encoded
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  "& .example-row": {
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    fontFamily: "monospace",
                  },
                }}
              >
                <Box className="example-row">
                  <Typography>+</Typography>
                  <Typography>%2B</Typography>
                </Box>
                <Box className="example-row">
                  <Typography>/</Typography>
                  <Typography>%2F</Typography>
                </Box>
                <Box className="example-row">
                  <Typography>#</Typography>
                  <Typography>%23</Typography>
                </Box>
                <Box className="example-row">
                  <Typography>%</Typography>
                  <Typography>%25</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Information Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            What is URL Encoding?
          </Typography>
          <Typography variant="body1" paragraph>
            URL encoding converts characters into a format that can be
            transmitted over the Internet. URLs can only be sent over the
            Internet using the ASCII character set, so URL encoding replaces
            unsafe ASCII characters with a "%" followed by two hexadecimal
            digits.
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Encoding Use Cases
                </Typography>
                <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      Creating dynamic URLs with query parameters for web
                      applications
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      Handling user input that will be part of a URL safely
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      Working with REST APIs that require encoded parameters
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      Processing form data for URL transmission
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Decoding Use Cases
                </Typography>
                <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      Debugging URL-related issues in web development
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      Extracting and processing data from encoded URLs
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      Analyzing web server logs and URL parameters
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      Working with internationalized domain names and special
                      characters
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mt: 3,
              borderRadius: 2,
              backgroundColor: "info.light",
              border: (theme) => `1px solid ${theme.palette.info.main}`,
            }}
          >
            <Typography
              variant="body2"
              color="info.dark"
              sx={{ fontWeight: 500 }}
            >
              💡 Pro Tip: Use the "Preserve URL-Safe Special Characters" option
              when you need to encode only certain parts of a URL while keeping
              its structure intact. This is particularly useful for encoding
              query parameter values without affecting the URL structure.
            </Typography>
          </Paper>
        </Box>

        {/* AdSense Ad */}
        <AdSense adSlot="6613251015" />
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
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UrlEncoderDecoder;
