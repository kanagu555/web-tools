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
} from "@mui/material";
import { motion } from "framer-motion";
import { ContentCopy, Refresh, Info } from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const UrlDecoderEncoder: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0); // 0 for encode, 1 for decode
  const [preserveSpecialChars, setPreserveSpecialChars] =
    useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  };

  const processText = () => {
    if (!inputText.trim()) {
      setError("Please enter some text to process.");
      setOutputText("");
      return;
    }

    try {
      if (activeTab === 0) {
        // Encode
        if (preserveSpecialChars) {
          // Preserve some special characters that are commonly used in URLs
          const result = inputText
            .replace(/%/g, "%25") // Encode % first to avoid double encoding
            .replace(/\+/g, "%2B")
            .replace(/\s/g, "+") // Replace spaces with +
            .replace(/[^\w\-.~!$&'()*+,;=:/?@]/g, (char) => {
              return "%" + char.charCodeAt(0).toString(16).toUpperCase();
            });
          setOutputText(result);
        } else {
          // Standard encodeURIComponent with space to + conversion
          const result = encodeURIComponent(inputText).replace(/%20/g, "+");
          setOutputText(result);
        }
      } else {
        // Decode
        // First replace + with space, then use decodeURIComponent
        const prepared = inputText.replace(/\+/g, " ");
        const result = decodeURIComponent(prepared);
        setOutputText(result);
      }
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

  const resetForm = () => {
    setInputText("");
    setOutputText("");
    setError("");
  };

  const copyToClipboard = () => {
    if (!outputText) return;

    navigator.clipboard
      .writeText(outputText)
      .then(() => {
        setCopied(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setError("Failed to copy to clipboard.");
      });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Online URL Encoder/Decoder Tool</title>
        <meta
          name="description"
          content="Encode and decode URL components instantly with our free online tool. Handle percent-encoding/decoding and URL-safe formats with precision."
        />
        <meta
          name="keywords"
          content="URL encoder, URL decoder, online tool, URL encode, URL decode, percent encoding, web utilities, URL encoder decoder, URL decoder encoder, free URL encoder decoder, free URL encoder decoder online"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          URL Encoder & Decoder
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Easily encode or decode URLs and query parameters for web development.
        </Typography>

        {/* Main Tool Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
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
              <TextField
                fullWidth
                multiline
                rows={4}
                label={activeTab === 0 ? "Text to Encode" : "Text to Decode"}
                value={inputText}
                onChange={handleInputChange}
                placeholder={
                  activeTab === 0
                    ? "Enter text to encode..."
                    : "Enter encoded text to decode..."
                }
                variant="outlined"
              />
            </Grid>

            {activeTab === 0 && (
              <Grid item xs={12}>
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
                  label="Preserve Special Characters"
                />
                <Tooltip title="Keeps some URL-safe special characters unencoded, useful for encoding parts of already structured URLs">
                  <IconButton size="small">
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={processText}
                  disabled={!inputText.trim()}
                >
                  {activeTab === 0 ? "Encode" : "Decode"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  disabled={!inputText.trim()}
                  onClick={resetForm}
                  startIcon={<Refresh />}
                >
                  Reset
                </Button>
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
                <Typography variant="h6" gutterBottom>
                  {activeTab === 0 ? "Encoded Result:" : "Decoded Result:"}
                </Typography>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    backgroundColor: "background.default",
                    position: "relative",
                    wordBreak: "break-all",
                  }}
                >
                  <Typography fontFamily="monospace" sx={{ pr: 5 }}>
                    {outputText}
                  </Typography>
                  <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                    <IconButton
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={copyToClipboard}
                      color={copied ? "success" : "default"}
                    >
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Examples Section */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Common URL Encoding Examples
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500}>
                Character
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">Space</Typography>
                <Typography fontFamily="monospace">%20 or +</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">&</Typography>
                <Typography fontFamily="monospace">%26</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">?</Typography>
                <Typography fontFamily="monospace">%3F</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">=</Typography>
                <Typography fontFamily="monospace">%3D</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500}>
                Character
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">+</Typography>
                <Typography fontFamily="monospace">%2B</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">/</Typography>
                <Typography fontFamily="monospace">%2F</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">#</Typography>
                <Typography fontFamily="monospace">%23</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">%</Typography>
                <Typography fontFamily="monospace">%25</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <AdSense adSlot="6613251015" />

        {/* Information Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            What is URL Encoding?
          </Typography>
          <Typography paragraph>
            URL encoding converts characters into a format that can be
            transmitted over the Internet. URLs can only be sent over the
            Internet using the ASCII character set, so URL encoding replaces
            unsafe ASCII characters with a "%" followed by two hexadecimal
            digits.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            When to Use URL Encoding & Decoding
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  When creating dynamic URLs with query parameters
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  When handling user input that will be part of a URL
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  When working with APIs that require encoded parameters
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>When debugging URL-related issues</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>When extracting data from encoded URLs</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  When working with internationalized domain names
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Tip: The "Preserve Special Characters" option keeps some URL-safe
            special characters unencoded, which is useful when encoding parts of
            already structured URLs.
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UrlDecoderEncoder;
