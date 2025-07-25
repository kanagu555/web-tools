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
} from "@mui/icons-material";
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
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

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
      let result = "";

      if (activeTab === 0) {
        // Encode
        if (preserveSpecialChars) {
          // Preserve some special characters that are commonly used in URLs
          result = inputText
            .replace(/%/g, "%25") // Encode % first to avoid double encoding
            .replace(/\+/g, "%2B")
            .replace(/\s/g, "+") // Replace spaces with +
            .replace(/[^\w\-.~!$&'()*+,;=:/?@]/g, (char) => {
              return (
                "%" +
                char.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")
              );
            });
        } else {
          // Standard encodeURIComponent with space to + conversion
          result = encodeURIComponent(inputText).replace(/%20/g, "+");
          setSnackbarMessage("Encoded successfully");
          setSnackbarOpen(true);
        }
      } else {
        // Decode
        // First replace + with space, then use decodeURIComponent
        const prepared = inputText.replace(/\+/g, " ");
        result = decodeURIComponent(prepared);
        setSnackbarMessage("Decoded successfully");
        setSnackbarOpen(true);
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>
          Free URL Encoder & Decoder Tool - Encode/Decode URLs Online
        </title>
        <meta
          name="description"
          content="Free online URL encoder and decoder tool. Instantly encode and decode URLs, query parameters, and special characters. Perfect for web developers, SEO professionals, and anyone working with URLs. No registration required."
        />
        <meta
          name="keywords"
          content="URL encoder, URL decoder, online tool, URL encode, URL decode, percent encoding, web utilities, query parameter encoder, URI encoding, web development tools, free URL tools, online encoder decoder"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="URL Tools" />
        <meta
          property="og:title"
          content="Free URL Encoder & Decoder Tool - Encode/Decode URLs Online"
        />
        <meta
          property="og:description"
          content="Free online URL encoder and decoder tool. Instantly encode and decode URLs, query parameters, and special characters."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Free URL Encoder & Decoder Tool" />
        <meta
          name="twitter:description"
          content="Free online URL encoder and decoder tool. Instantly encode and decode URLs, query parameters, and special characters."
        />
        <link rel="canonical" href={window.location.href} />

        {/* Structured Data for SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "URL Encoder & Decoder Tool",
            description:
              "Free online tool to encode and decode URLs, query parameters, and special characters",
            url: window.location.href,
            applicationCategory: "DeveloperApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "URL Encoding",
              "URL Decoding",
              "Query Parameter Encoding",
              "Special Character Handling",
              "Batch Processing",
              "File Upload Support",
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
          Free URL Encoder & Decoder Tool
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          color="text.secondary"
          paragraph
          sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" }, fontWeight: 400 }}
        >
          Instantly encode and decode URLs, query parameters, and special
          characters online. Perfect for web developers and SEO professionals.
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
            aria-label="URL encoding and decoding options"
          >
            <Tab
              label="Encode URL"
              id="encode-tab"
              aria-controls="encode-panel"
              aria-label="Switch to URL encoding mode"
            />
            <Tab
              label="Decode URL"
              id="decode-tab"
              aria-controls="decode-panel"
              aria-label="Switch to URL decoding mode"
            />
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
                    ? "Enter URL or text to encode (e.g., https://example.com/search?q=hello world)"
                    : "Enter encoded URL or text to decode (e.g., https%3A//example.com/search%3Fq%3Dhello%2Bworld)"
                }
                variant="outlined"
                aria-describedby={
                  activeTab === 0 ? "encode-help" : "decode-help"
                }
                inputProps={{
                  "aria-label":
                    activeTab === 0
                      ? "Enter text to encode"
                      : "Enter text to decode",
                }}
              />
              <Typography
                id={activeTab === 0 ? "encode-help" : "decode-help"}
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {activeTab === 0
                  ? "Enter any URL or text containing special characters that need to be URL-encoded"
                  : "Enter URL-encoded text that you want to decode back to readable format"}
              </Typography>
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
                      inputProps={{
                        "aria-describedby": "preserve-chars-help",
                      }}
                    />
                  }
                  label="Preserve URL-Safe Special Characters"
                />
                <Tooltip title="When enabled, keeps URL-safe characters like :, /, ?, =, & unencoded. Useful for encoding parts of already structured URLs while preserving their structure.">
                  <IconButton
                    size="small"
                    aria-label="Information about preserving special characters"
                  >
                    <Info fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography
                  id="preserve-chars-help"
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
                  gap: 1,
                }}
                role="group"
                aria-label="URL processing actions"
              >
                <Button
                  variant="contained"
                  onClick={() => processText()}
                  disabled={!inputText.trim()}
                  aria-describedby="process-button-help"
                >
                  {activeTab === 0 ? "Encode URL" : "Decode URL"}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={clearAll}
                  disabled={!inputText.trim() && !outputText}
                  startIcon={<Clear />}
                  aria-label="Clear all input and output text"
                >
                  Clear All
                </Button>
                <input
                  accept=".txt,.csv,.json"
                  style={{ display: "none" }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  aria-describedby="file-upload-help"
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                    aria-label="Upload text file to process"
                  >
                    Upload File
                  </Button>
                </label>
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error" role="alert" aria-live="polite">
                  {error}
                </Alert>
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
                  <Typography
                    variant="h3"
                    component="h3"
                    sx={{ fontSize: "1.25rem" }}
                  >
                    {activeTab === 0 ? "Encoded Result:" : "Decoded Result:"}
                  </Typography>
                  <Box
                    sx={{ display: "flex", gap: 1 }}
                    role="group"
                    aria-label="Result actions"
                  >
                    <Tooltip title="Download result as text file">
                      <IconButton
                        onClick={downloadResult}
                        size="small"
                        aria-label="Download result as text file"
                      >
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
                        aria-label={
                          copied
                            ? "Result copied to clipboard"
                            : "Copy result to clipboard"
                        }
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
                      component="h4"
                    >
                      Detected URL components:
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                      role="list"
                      aria-label="Detected URL components"
                    >
                      {detectUrlComponents(inputText).map(
                        (component, index) => (
                          <Chip
                            key={index}
                            label={component}
                            size="small"
                            variant="outlined"
                            role="listitem"
                          />
                        )
                      )}
                    </Box>
                  </Box>
                )}

                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    backgroundColor: "background.default",
                    wordBreak: "break-all",
                    maxHeight: 300,
                    overflow: "auto",
                  }}
                  role="region"
                  aria-label={`${
                    activeTab === 0 ? "Encoded" : "Decoded"
                  } result output`}
                  tabIndex={0}
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
                  aria-live="polite"
                >
                  Result length: {outputText.length} characters
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* Examples Section */}
        <Paper
          elevation={3}
          sx={{ p: 3, borderRadius: 2 }}
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
            Common URL Encoding Examples
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                fontWeight={500}
                sx={{ fontSize: "1.1rem" }}
              >
                Character → Encoded
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box
                component="dl"
                sx={{
                  "& dt": { display: "inline", fontFamily: "monospace" },
                  "& dd": {
                    display: "inline",
                    fontFamily: "monospace",
                    ml: 0,
                    float: "right",
                  },
                  "& div": { mb: 1, overflow: "hidden" },
                }}
              >
                <Box component="div">
                  <Typography component="dt">Space</Typography>
                  <Typography component="dd">%20 or +</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">&</Typography>
                  <Typography component="dd">%26</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">?</Typography>
                  <Typography component="dd">%3F</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">=</Typography>
                  <Typography component="dd">%3D</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                fontWeight={500}
                sx={{ fontSize: "1.1rem" }}
              >
                Character → Encoded
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box
                component="dl"
                sx={{
                  "& dt": { display: "inline", fontFamily: "monospace" },
                  "& dd": {
                    display: "inline",
                    fontFamily: "monospace",
                    ml: 0,
                    float: "right",
                  },
                  "& div": { mb: 1, overflow: "hidden" },
                }}
              >
                <Box component="div">
                  <Typography component="dt">+</Typography>
                  <Typography component="dd">%2B</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">/</Typography>
                  <Typography component="dd">%2F</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">#</Typography>
                  <Typography component="dd">%23</Typography>
                </Box>
                <Box component="div">
                  <Typography component="dt">%</Typography>
                  <Typography component="dd">%25</Typography>
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
            What is URL Encoding? - Complete Guide
          </Typography>

          <Typography paragraph>
            URL encoding converts characters into a format that can be
            transmitted over the Internet. URLs can only be sent over the
            Internet using the ASCII character set, so URL encoding replaces
            unsafe ASCII characters with a "%" followed by two hexadecimal
            digits.
          </Typography>

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3, fontSize: "1.25rem" }}
          >
            When to Use URL Encoding & Decoding
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1.1rem" }}
              >
                Encoding Use Cases:
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1.1rem" }}
              >
                Decoding Use Cases:
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
                <strong>Bidirectional Processing:</strong> Both encode and
                decode URLs with a single tool
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Smart Character Preservation:</strong> Option to
                preserve URL-safe characters during encoding
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Auto-Processing:</strong> Real-time encoding/decoding as
                you type
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>File Support:</strong> Upload text files for batch
                processing
              </Typography>
            </Box>
            <Box component="li">
              <Typography>
                <strong>Component Detection:</strong> Automatically identifies
                URL components
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
            <strong>Pro Tip:</strong> Use the "Preserve URL-Safe Special
            Characters" option when you need to encode only certain parts of a
            URL while keeping its structure intact. This is particularly useful
            for encoding query parameter values without affecting the URL's
            basic structure.
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default UrlDecoderEncoder;
