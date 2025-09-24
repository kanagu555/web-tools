"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  useTheme,
  Button,
  Tooltip,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Trash2,
  ArrowLeftRight,
  ClipboardPaste,
  Upload,
  Download,
} from "lucide-react";
import AdSense from "../AdSense";
import Navigation from "@/components/Navigation";

const SpaceToNewlineConverter = () => {
  const theme = useTheme();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const handleConvert = useCallback(() => {
    if (!inputText.trim()) {
      setSnackbarMessage("Please enter some text first");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const convertedText = inputText.replace(/ /g, "\n");
    setOutputText(convertedText);
    setSnackbarMessage("Text converted successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }, [inputText]);

  const handleCopy = useCallback(async () => {
    if (!outputText) {
      setSnackbarMessage("No text to copy");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setSnackbarMessage("Clipboard not available");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setSnackbarMessage("Text copied to clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(
        "Failed to copy text. Please select and copy manually."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, [outputText]);

  const handleClear = useCallback(() => {
    setInputText("");
    setOutputText("");
    setSnackbarMessage("Text cleared");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  }, []);

  const handlePaste = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setSnackbarMessage("Clipboard not available. Please paste manually.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      setInputText(clipboardText);
      setSnackbarMessage("Text pasted from clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(
        "Failed to read from clipboard. Please paste manually."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }, []);

  const handleSwap = useCallback(() => {
    if (!outputText) {
      setSnackbarMessage("No converted text to swap");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }
    setInputText(outputText);
    setOutputText("");
    setSnackbarMessage("Output text moved to input");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }, [outputText]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        setSnackbarMessage(
          "File size too large. Please select a file smaller than 1MB."
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      // Check file type
      if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
        setSnackbarMessage("Please select a text file (.txt)");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputText(content);
        setSnackbarMessage("File uploaded successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      };
      reader.onerror = () => {
        setSnackbarMessage("Failed to read file");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      };
      reader.readAsText(file);
    },
    []
  );

  const handleDownload = useCallback(() => {
    if (!outputText) {
      setSnackbarMessage("No converted text to download");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-text.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbarMessage("Text downloaded successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }, [outputText]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} component="main">
      <Navigation />

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
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Space to Newline Converter
        </Typography>
        <Typography
          variant="h2"
          component="p"
          color="text.secondary"
          paragraph
          sx={{
            fontSize: "1.25rem",
            fontWeight: 400,
            textAlign: { xs: "center", md: "left" },
            mb: 4,
          }}
        >
          Convert spaces to newlines in your text. Perfect for formatting lists
          and data processing.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          component="section"
          aria-labelledby="space-converter-section"
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Conversion Options
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                variant="contained"
                onClick={handleConvert}
                disabled={!inputText.trim()}
                sx={{ minWidth: 120 }}
              >
                Convert Spaces to Newlines
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Quick Actions
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <input
                accept=".txt,text/*"
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
                aria-label="Upload text file"
              />
              <label htmlFor="file-upload">
                <Tooltip title="Upload text file">
                  <Button
                    variant="outlined"
                    size="small"
                    component="span"
                    startIcon={<Upload size={16} aria-hidden="true" />}
                    aria-label="Upload text file"
                  >
                    Upload
                  </Button>
                </Tooltip>
              </label>
              <Tooltip title="Paste from clipboard">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handlePaste}
                  startIcon={<ClipboardPaste size={16} aria-hidden="true" />}
                  aria-label="Paste text from clipboard"
                >
                  Paste
                </Button>
              </Tooltip>
              <Tooltip title="Download converted text">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDownload}
                  disabled={!outputText}
                  startIcon={<Download size={16} aria-hidden="true" />}
                  aria-label="Download converted text as file"
                >
                  Download
                </Button>
              </Tooltip>
              <Tooltip title="Clear all text">
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  onClick={handleClear}
                  disabled={!inputText && !outputText}
                  startIcon={<Trash2 size={16} aria-hidden="true" />}
                  aria-label="Clear all text"
                >
                  Clear
                </Button>
              </Tooltip>
              <Tooltip title="Move output to input">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSwap}
                  disabled={!outputText}
                  startIcon={<ArrowLeftRight size={16} aria-hidden="true" />}
                  aria-label="Swap input and output text"
                >
                  Swap
                </Button>
              </Tooltip>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} aria-hidden="true" />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} component="h4">
                  Input Text
                </Typography>
                <Typography
                  variant="body2"
                  color={inputText.length > 10000 ? "error" : "text.secondary"}
                >
                  {inputText.length.toLocaleString()} / 50,000 characters
                </Typography>
              </Box>
              <TextField
                multiline
                fullWidth
                minRows={8}
                maxRows={15}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type, paste, or upload your text here to convert spaces to newlines..."
                variant="outlined"
                aria-label="Input text to convert spaces to newlines"
                inputProps={{
                  "aria-describedby": "input-text-description",
                  maxLength: 50000,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  },
                }}
              />
              <Typography
                id="input-text-description"
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Enter the text you want to convert spaces to newlines
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} component="h4">
                  Converted Text
                </Typography>
                <Box
                  onClick={handleCopy}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    cursor: "pointer",
                    color: copied
                      ? theme.palette.success.main
                      : theme.palette.text.secondary,
                  }}
                  role="button"
                  aria-label={
                    copied ? "Text copied to clipboard" : "Copy converted text"
                  }
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCopy();
                    }
                  }}
                >
                  {copied ? (
                    <Check size={16} aria-hidden="true" />
                  ) : (
                    <Copy size={16} aria-hidden="true" />
                  )}
                  <Typography variant="body2">
                    {copied ? "Copied!" : "Copy"}
                  </Typography>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                minRows={8}
                maxRows={15}
                value={outputText}
                variant="outlined"
                InputProps={{ readOnly: true }}
                aria-label="Converted text result"
                inputProps={{
                  "aria-describedby": "output-text-description",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                    fontSize: "1rem",
                    lineHeight: 1.6,
                  },
                }}
              />
              <Typography
                id="output-text-description"
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Result of your space to newline conversion will appear here
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="8427161992" />

        {/* Informational Content */}
        <Box sx={{ mt: 4 }}>
          {/* Features Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Why Use Our Space to Newline Converter?
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Copy size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Simple Conversion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instantly convert all spaces in your text to newlines with
                    one click. Perfect for formatting lists and data processing.
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
                      backgroundColor: theme.palette.success.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Upload size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    File Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload text files, convert content, and download results.
                    Supports clipboard operations and batch processing.
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
                      backgroundColor: theme.palette.warning.main,
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
                    Easy Download
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download your converted text as a file for later use.
                    Supports multiple download formats.
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
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              How to Convert Spaces to Newlines
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    1
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Enter Text
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type, paste, or upload your text content. Supports up to
                    50,000 characters.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    2
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Convert
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Click the "Convert Spaces to Newlines" button to instantly
                    convert all spaces to newlines.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    3
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Review Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Check the converted text in the output area. All spaces have
                    been replaced with newlines.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    4
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Copy or Download
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Copy the converted text to clipboard or download as a file
                    for later use.
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
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
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
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      100% Free & No Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use our space to newline converter completely free without
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
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Privacy Protected
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      All processing happens locally in your browser. Your text
                      never leaves your device.
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
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Works on All Devices
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Compatible with Windows, Mac, Linux, iOS, and Android.
                      Works in any modern web browser.
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
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      High Quality Output
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Maintains text integrity and formatting. Supports large
                      files with precise conversion algorithms.
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
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Frequently Asked Questions
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                What does this tool do?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                This tool converts all spaces in your text to newlines (line
                breaks). This is useful for converting space-separated data into
                line-separated format, which is often needed for data processing
                or creating lists.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Can I upload files for conversion?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Yes, you can upload text files (.txt) up to 1MB in size. The
                tool will load and convert the content, then allow you to
                download the result.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Is my text data secure?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Yes, absolutely. All text processing happens entirely in your
                browser using client-side JavaScript. Your text is never
                uploaded to our servers.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Can I convert newlines back to spaces?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You can use our "Swap" button to move the converted text back to
                the input field, then manually replace newlines with spaces if
                needed. We're considering adding a dedicated tool for this in
                the future.
              </Typography>
            </Box>
          </Paper>
        </Box>
        {/* AdSense Ad */}
        <AdSense adSlot="8876847424" />
      </motion.div>

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
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SpaceToNewlineConverter;
