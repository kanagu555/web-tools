import React, { useState, useEffect, useRef } from "react";
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
import { ContentCopy, Refresh, Info, FileUpload } from "@mui/icons-material";
import AdSense from "../components/AdSense";

const Base64EncoderDecoder: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0); // 0 for encode, 1 for decode
  const [urlSafe, setUrlSafe] = useState<boolean>(false);
  const [showLineBreaks, setShowLineBreaks] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        let result = btoa(unescape(encodeURIComponent(inputText)));

        // Apply URL-safe encoding if selected
        if (urlSafe) {
          result = result
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=/g, "");
        }

        // Add line breaks every 76 characters if selected
        if (showLineBreaks) {
          result = result.replace(/.{76}/g, "$&\n");
        }

        setOutputText(result);
      } else {
        // Decode
        let preparedInput = inputText;

        // Handle URL-safe Base64
        preparedInput = preparedInput.replace(/-/g, "+").replace(/_/g, "/");

        // Add padding if needed
        while (preparedInput.length % 4) {
          preparedInput += "=";
        }

        // Remove whitespace and line breaks
        preparedInput = preparedInput.replace(/\s/g, "");

        const result = decodeURIComponent(escape(atob(preparedInput)));
        setOutputText(result);
      }
      setError("");
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unknown error occurred. Make sure the input is valid.");
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

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        if (activeTab === 0) {
          // For encoding, just set the file content as input
          setInputText(content);
        } else {
          // For decoding, check if it's a valid base64 string
          try {
            // Simple validation - check if it looks like base64
            if (/^[A-Za-z0-9+/=\s-_]*$/.test(content)) {
              setInputText(content);
            } else {
              setError("The file does not contain valid Base64 data.");
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            setError("Could not process the file as Base64.");
          }
        }
      }
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
    };

    if (activeTab === 0) {
      reader.readAsText(file);
    } else {
      reader.readAsText(file);
    }

    // Reset the file input
    event.target.value = "";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Base64 Encoder & Decoder
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Easily encode text to Base64 or decode Base64 strings back to plain
          text.
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
            <Tab label="Encode to Base64" />
            <Tab label="Decode from Base64" />
          </Tabs>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={activeTab === 0 ? "Text to Encode" : "Base64 to Decode"}
                value={inputText}
                onChange={handleInputChange}
                placeholder={
                  activeTab === 0
                    ? "Enter text to encode..."
                    : "Enter Base64 to decode..."
                }
                variant="outlined"
              />
            </Grid>

            {activeTab === 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={urlSafe}
                        onChange={(e) => setUrlSafe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="URL-Safe Base64"
                  />
                  <Tooltip title="Replaces '+' with '-', '/' with '_', and removes padding '=' characters for use in URLs">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={showLineBreaks}
                        onChange={(e) => setShowLineBreaks(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Add Line Breaks"
                  />
                  <Tooltip title="Adds line breaks every 76 characters for better readability">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  onClick={processText}
                  disabled={!inputText.trim()}
                >
                  {activeTab === 0 ? "Encode" : "Decode"}
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleFileUpload}
                  startIcon={<FileUpload />}
                >
                  Upload File
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept={activeTab === 0 ? "text/*" : ".txt,.b64"}
                />
                <Button
                  variant="outlined"
                  color="error"
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
                  <Typography
                    fontFamily="monospace"
                    sx={{ pr: 5 }} // Add right padding to make room for the button
                  >
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
            Base64 Encoding Examples
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500}>
                Plain Text
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">Hello</Typography>
                <Typography fontFamily="monospace">SGVsbG8=</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">Web Tools</Typography>
                <Typography fontFamily="monospace">V2ViIFRvb2xz</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">Base64</Typography>
                <Typography fontFamily="monospace">QmFzZTY0</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={500}>
                URL-Safe Encoding
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">Hello+World/</Typography>
                <Typography fontFamily="monospace">SGVsbG8rV29ybGQv</Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography fontFamily="monospace">(URL-Safe)</Typography>
                <Typography fontFamily="monospace">SGVsbG8tV29ybGRf</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <AdSense adSlot="6613251015" />

        {/* Information Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            What is Base64 Encoding?
          </Typography>
          <Typography paragraph>
            Base64 is a binary-to-text encoding scheme that represents binary
            data in an ASCII string format by translating it into a radix-64
            representation. It's commonly used when there's a need to encode
            binary data that needs to be stored and transferred over media that
            are designed to deal with text.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            Common Uses for Base64 Encoding
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Embedding binary data in JSON or XML</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Encoding images for embedding in HTML or CSS
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Email attachments (MIME format)</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Storing binary data in databases</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Basic authentication headers in HTTP</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Data URIs for small file embedding</Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 2 }}>
            Base64 Variants
          </Typography>
          <Typography paragraph>
            <strong>Standard Base64:</strong> Uses A-Z, a-z, 0-9, +, / and = for
            padding. This is the most common variant used for general purposes.
          </Typography>
          <Typography paragraph>
            <strong>URL-Safe Base64:</strong> Uses A-Z, a-z, 0-9, -, _ and
            typically omits the padding character. This variant is safe to use
            in URLs and filenames.
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Tip: Base64 encoding increases the size of the data by approximately
            33% compared to the original binary data.
          </Typography>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Base64EncoderDecoder;
