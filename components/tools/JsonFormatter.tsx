"use client";

import { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
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
  ClipboardPaste,
  RotateCw,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

const JsonFormatter = () => {
  const theme = useTheme();
  const { trackTool, trackFile, trackCustomEvent } = useAnalytics();
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
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      trackTool("json-formatter", "view");

      const params = new URLSearchParams(window.location.search);
      const jsonParam = params.get("json");

      if (jsonParam) {
        try {
          const decodedJson = decodeURIComponent(jsonParam);
          setInput(decodedJson);
          formatJson(decodedJson);
          trackCustomEvent("tool", "json-formatter", "url_parameter_load", 1);
        } catch (err) {
          console.error("Failed to parse JSON from URL", err);
        }
      }
    }
  }, [trackTool, trackCustomEvent]);

  const formatJson = (textToFormat = input) => {
    try {
      let parsed;
      if (textToFormat.trim() === "") {
        setOutput("");
        setError("");
        setJsonStats(null);
        return;
      }

      // Track format action
      trackTool("json-formatter", "format");
      trackCustomEvent("tool", "json-formatter", "format_json", 1);

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

      // Track minify action
      trackTool("json-formatter", "minify");
      trackCustomEvent("tool", "json-formatter", "minify_json", 1);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateJsonStats = (json: any) => {
    // Calculate size in KB
    const jsonString = JSON.stringify(json);
    const size =
      (new TextEncoder().encode(jsonString).length / 1024).toFixed(2) + " KB";

    // Count keys
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // Track JSON statistics for analytics
    trackCustomEvent("json", "stats", "json_complexity", keys);
    trackCustomEvent("json", "stats", "json_depth", depth);
  };

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      showSnackbar("Clipboard not available", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSnackbar("Copied to clipboard", "success");

      // Track copy action
      trackTool("json-formatter", "copy");
      trackCustomEvent("tool", "json-formatter", "copy_output", 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showSnackbar("Failed to copy to clipboard", "error");
    }
  };

  const handlePaste = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      showSnackbar("Clipboard not available. Please paste manually.", "error");
      return;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      setInput(clipboardText);
      showSnackbar("Pasted from clipboard", "success");

      // Track paste action
      trackTool("json-formatter", "paste");
      trackCustomEvent("tool", "json-formatter", "paste_input", 1);
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

    // Track clear action
    trackTool("json-formatter", "clear");
    trackCustomEvent("tool", "json-formatter", "clear_content", 1);
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

    // Track download action
    trackTool("json-formatter", "download");
    trackFile("download", "json", true);
    trackCustomEvent("tool", "json-formatter", "download_json", 1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Track file upload action
    trackTool("json-formatter", "upload");
    trackFile("upload", "json", true);
    trackCustomEvent("tool", "json-formatter", "upload_file", 1);

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

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
    setJsonStats(null);
    showSnackbar("Reset successful", "success");

    // Track reset action
    trackTool("json-formatter", "reset");
    trackCustomEvent("tool", "json-formatter", "reset_form", 1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

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

                <Tooltip title="Reset Form">
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RotateCw />}
                    onClick={handleReset}
                    disabled={!input}
                  >
                    Reset
                  </Button>
                </Tooltip>

                <Box sx={{ flexGrow: 1 }} />

                <Select
                  size="small"
                  value={indentSize}
                  onChange={(e) => {
                    const newIndentSize = Number(e.target.value);
                    setIndentSize(newIndentSize);

                    // Track indent size change
                    trackTool("json-formatter", "change_indent");
                    trackCustomEvent("tool", "json-formatter", "change_indent_size", newIndentSize);
                  }}
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
                  alignItems: "flex-start",
                  mb: 1,
                  minHeight: 32,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Input JSON
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                    minHeight: 32,
                  }}
                >
                  <Tooltip title="Paste from clipboard">
                    <IconButton
                      size="small"
                      onClick={handlePaste}
                      sx={{
                        height: 32,
                        width: 32,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <ClipboardPaste size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear input">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      disabled={!input}
                      sx={{
                        height: 32,
                        width: 32,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
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
                  height: "520px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                    height: "100%",
                  },
                  "& .MuiOutlinedInput-input": {
                    height: "100% !important",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 1,
                  minHeight: 32,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Formatted Output
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    minHeight: 32,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                      copied ? <Check size={16} /> : <Copy size={16} />
                    }
                    onClick={handleCopy}
                    disabled={!output}
                    sx={{ height: 32 }}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={20}
                value={output}
                InputProps={{ readOnly: true }}
                sx={{
                  fontFamily: "monospace",
                  height: "520px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                    height: "100%",
                  },
                  "& .MuiOutlinedInput-input": {
                    height: "100% !important",
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

        {/* AdSense Ad */}
        <AdSense adSlot="3174835314" />

        {/* SEO-friendly content section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About Our JSON Formatter
          </Typography>
          <Typography paragraph>
            Our free online JSON formatter provides a simple and convenient way
            to format, validate, and beautify your JSON data directly in your
            browser. Whether you need to make your JSON more readable, check for
            syntax errors, or minify it for production, this tool has you
            covered.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Features of Our JSON Formatter
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>
              Format JSON with customizable indentation (2, 4, or 8 spaces)
            </li>
            <li>Minify JSON to reduce file size</li>
            <li>Validate JSON syntax and structure</li>
            <li>View JSON statistics (size, total keys, depth)</li>
            <li>Upload and download JSON files</li>
            <li>Copy formatted JSON to clipboard</li>
            <li>Share JSON via URL</li>
            <li>Support for lenient JavaScript object notation</li>
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            How to Use the JSON Formatter
          </Typography>
          <Typography paragraph>
            Using our JSON formatter is straightforward. Simply paste your JSON
            data into the input field, then click the "Format" button to
            beautify it with your chosen indentation level. For minified output,
            click the "Minify" button instead. You can upload JSON files,
            download the formatted result, or share your JSON via a URL. The
            tool also provides helpful statistics about your JSON data.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            What is JSON?
          </Typography>
          <Typography paragraph>
            JSON (JavaScript Object Notation) is a lightweight data interchange
            format that is easy for humans to read and write and easy for
            machines to parse and generate. It is based on a subset of
            JavaScript language and is commonly used for transmitting data in
            web applications, serving as an alternative to XML. JSON is
            language-independent and uses conventions familiar to programmers of
            the C family of languages.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Why Format JSON?
          </Typography>
          <Typography paragraph>
            Formatting JSON makes it more readable and easier to understand,
            especially for complex data structures. Properly formatted JSON with
            consistent indentation helps developers identify the structure,
            hierarchy, and relationships within the data. It's particularly
            useful when debugging, documenting, or sharing JSON data with
            others. On the other hand, minifying JSON (removing all unnecessary
            whitespace) is beneficial for production environments as it reduces
            file size and improves transmission efficiency.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Common Uses for JSON Formatting
          </Typography>
          <Typography paragraph>
            Our JSON formatter tool is valuable for many scenarios, including:
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Debugging API responses and requests</li>
            <li>Examining configuration files</li>
            <li>Preparing data for documentation</li>
            <li>Validating JSON before using it in applications</li>
            <li>Teaching and learning JSON structure</li>
            <li>Sharing data in a readable format with team members</li>
            <li>Optimizing JSON for production by minifying it</li>
          </Typography>
        </Paper>

        {/* AdSense Ad */}
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
