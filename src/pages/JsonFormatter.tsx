import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Code,
  Copy,
  Check,
  FileJson,
  Download,
  Upload,
  Trash2,
  FileUp,
  ClipboardPaste,
} from "lucide-react";
import AdSense from "../components/AdSense";

const JsonFormatter = () => {
  const theme = useTheme();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [jsonStats, setJsonStats] = useState<{
    size: string;
    keys: number;
    depth: number;
  } | null>(null);

  // Format JSON when component mounts if there's input in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jsonParam = params.get("json");

    if (jsonParam) {
      try {
        const decodedJson = decodeURIComponent(jsonParam);
        setInput(decodedJson);
        formatJson(decodedJson);
      } catch (err) {
        console.error("Failed to parse JSON from URL", err);
      }
    }
  }, []);

  const formatJson = (textToFormat = input) => {
    try {
      let parsed;
      if (textToFormat.trim() === "") {
        setOutput("");
        setError("");
        setJsonStats(null);
        return;
      }

      // Try to parse the input as JSON
      try {
        parsed = JSON.parse(textToFormat);
      } catch {
        // If parsing fails, try to evaluate as JavaScript object
        // This allows for more lenient input (e.g., unquoted properties)
        try {
          parsed = eval("(" + textToFormat + ")");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (evalError) {
          throw new Error(
            "Invalid JSON format: Could not parse as JSON or JavaScript object"
          );
        }
      }

      const formatted = JSON.stringify(parsed, null, indentSize);
      setOutput(formatted);
      setError("");

      // Calculate JSON stats
      calculateJsonStats(parsed);

      // Show success message
      showSnackbar("JSON formatted successfully", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
      setOutput("");
      setJsonStats(null);
    }
  };

  const minifyJson = () => {
    try {
      let parsed;
      if (input.trim() === "") {
        setOutput("");
        setError("");
        setJsonStats(null);
        return;
      }

      try {
        parsed = JSON.parse(input);
      } catch {
        try {
          parsed = eval("(" + input + ")");
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (evalError) {
          throw new Error(
            "Invalid JSON format: Could not parse as JSON or JavaScript object"
          );
        }
      }

      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");

      // Calculate JSON stats
      calculateJsonStats(parsed);

      // Show success message
      showSnackbar("JSON minified successfully", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON format");
      setOutput("");
      setJsonStats(null);
    }
  };

  const calculateJsonStats = (json: any) => {
    // Calculate size in KB
    const jsonString = JSON.stringify(json);
    const size =
      (new TextEncoder().encode(jsonString).length / 1024).toFixed(2) + " KB";

    // Count keys
    const countKeys = (obj: any): number => {
      if (typeof obj !== "object" || obj === null) return 0;

      let count = 0;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          count += countKeys(item);
        }
      } else {
        count += Object.keys(obj).length;
        for (const key in obj) {
          count += countKeys(obj[key]);
        }
      }
      return count;
    };

    // Calculate depth
    const calculateDepth = (obj: any, currentDepth = 1): number => {
      if (typeof obj !== "object" || obj === null) return 0;

      let maxDepth = currentDepth;
      if (Array.isArray(obj)) {
        for (const item of obj) {
          const depth = calculateDepth(item, currentDepth + 1);
          maxDepth = Math.max(maxDepth, depth);
        }
      } else {
        for (const key in obj) {
          const depth = calculateDepth(obj[key], currentDepth + 1);
          maxDepth = Math.max(maxDepth, depth);
        }
      }
      return maxDepth;
    };

    const keys = countKeys(json);
    const depth = calculateDepth(json);

    setJsonStats({ size, keys, depth });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSnackbar("Copied to clipboard", "success");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showSnackbar("Failed to copy to clipboard", "error");
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInput(clipboardText);
      showSnackbar("Pasted from clipboard", "success");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showSnackbar("Failed to read from clipboard", "error");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setJsonStats(null);
    showSnackbar("Cleared all content", "info");
  };

  const handleDownload = () => {
    if (!output) {
      showSnackbar("No formatted JSON to download", "warning");
      return;
    }

    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted-json.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSnackbar("JSON file downloaded", "success");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      showSnackbar(`File "${file.name}" loaded successfully`, "success");
    };
    reader.onerror = () => {
      showSnackbar("Error reading file", "error");
    };
    reader.readAsText(file);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleShareUrl = () => {
    if (!input) {
      showSnackbar("No JSON to share", "warning");
      return;
    }

    try {
      const encodedJson = encodeURIComponent(input);
      const url = `${window.location.origin}${window.location.pathname}?json=${encodedJson}`;

      navigator.clipboard.writeText(url);
      showSnackbar("Shareable URL copied to clipboard", "success");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showSnackbar("Failed to generate shareable URL", "error");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          JSON Formatter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Format, validate, and beautify your JSON data with ease.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Code />}
                  onClick={() => formatJson()}
                >
                  Format
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileJson />}
                  onClick={minifyJson}
                >
                  Minify
                </Button>

                <Tooltip title="Upload JSON file">
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload />}
                  >
                    Upload
                    <input
                      type="file"
                      accept=".json,.txt"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Tooltip>

                <Tooltip title="Download formatted JSON">
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownload}
                    disabled={!output}
                  >
                    Download
                  </Button>
                </Tooltip>

                <Tooltip title="Share as URL">
                  <Button
                    variant="outlined"
                    startIcon={<FileUp />}
                    onClick={handleShareUrl}
                    disabled={!input}
                  >
                    Share URL
                  </Button>
                </Tooltip>

                <Box sx={{ flexGrow: 1 }} />

                <Select
                  size="small"
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  sx={{ width: 120 }}
                >
                  <MenuItem value={2}>2 spaces</MenuItem>
                  <MenuItem value={4}>4 spaces</MenuItem>
                  <MenuItem value={8}>8 spaces</MenuItem>
                </Select>
              </Box>
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
                <Typography variant="subtitle1" fontWeight={600}>
                  Input JSON
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Paste from clipboard">
                    <IconButton size="small" onClick={handlePaste}>
                      <ClipboardPaste size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear input">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      disabled={!input}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={20}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                error={!!error}
                helperText={error}
                placeholder="Paste your JSON here..."
                sx={{
                  fontFamily: "monospace",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              />
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
                <Typography variant="subtitle1" fontWeight={600}>
                  Formatted Output
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                  onClick={handleCopy}
                  disabled={!output}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={20}
                value={output}
                InputProps={{ readOnly: true }}
                sx={{
                  fontFamily: "monospace",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              />
            </Grid>

            {jsonStats && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {jsonStats.size}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Keys
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {jsonStats.keys}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Depth
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {jsonStats.depth}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
        <AdSense adSlot="6613251015" />
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
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

export default JsonFormatter;
