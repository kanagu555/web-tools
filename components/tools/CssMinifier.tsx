"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Download,
  Upload,
  Trash2,
  ClipboardPaste,
  RotateCw,
  Settings,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

const CssMinifier: React.FC = () => {
  const { trackTool } = useAnalytics();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [cssStats, setCssStats] = useState<{
    originalSize: string;
    minifiedSize: string;
    compressionRatio: string;
    originalLines: number;
    minifiedLines: number;
    originalChars: number;
    minifiedChars: number;
  } | null>(null);
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    removeLineBreaks: true,
    removeLastSemicolon: true,
    removeEmptyRules: true,
    optimizeColors: true,
    optimizeZeros: true,
    mergeDuplicateRules: false,
  });
  const [autoMinify, setAutoMinify] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Auto-minify when input changes
  useEffect(() => {
    if (autoMinify && input.trim()) {
      const timeoutId = setTimeout(() => {
        minifyCss();
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [input, autoMinify, options]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to minify
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        if (input.trim()) {
          minifyCss();
        }
      }
      // Ctrl/Cmd + K to clear
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        handleClear();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions({
      ...options,
      [option]: !options[option],
    });
  };

  const presetConfigs = {
    conservative: {
      removeComments: true,
      removeWhitespace: true,
      removeLineBreaks: false,
      removeLastSemicolon: false,
      removeEmptyRules: true,
      optimizeColors: false,
      optimizeZeros: false,
      mergeDuplicateRules: false,
    },
    balanced: {
      removeComments: true,
      removeWhitespace: true,
      removeLineBreaks: true,
      removeLastSemicolon: true,
      removeEmptyRules: true,
      optimizeColors: true,
      optimizeZeros: true,
      mergeDuplicateRules: false,
    },
    aggressive: {
      removeComments: true,
      removeWhitespace: true,
      removeLineBreaks: true,
      removeLastSemicolon: true,
      removeEmptyRules: true,
      optimizeColors: true,
      optimizeZeros: true,
      mergeDuplicateRules: true,
    },
  };

  const applyPreset = (preset: keyof typeof presetConfigs) => {
    setOptions(presetConfigs[preset]);
    setSnackbarMessage(`Applied ${preset} preset configuration`);
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
    trackTool("css-minifier", `preset_${preset}`);
  };

  const minifyCss = (textToMinify = input) => {
    try {
      if (textToMinify.trim() === "") {
        setOutput("");
        setError("");
        setCssStats(null);
        return;
      }

      let minified = textToMinify;
      const originalSize = new Blob([textToMinify]).size;

      // Remove comments (but preserve important comments like /*! */)
      if (options.removeComments) {
        minified = minified.replace(/\/\*(?!\!)[\s\S]*?\*\//g, "");
      }

      // Optimize colors
      if (options.optimizeColors) {
        // Convert hex colors to shorter format when possible
        minified = minified.replace(
          /#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g,
          "#$1$2$3"
        );
        // Convert rgb to hex when shorter
        minified = minified.replace(
          /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
          (match, r, g, b) => {
            const toHex = (n: string) =>
              parseInt(n).toString(16).padStart(2, "0");
            const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            return hex.length <= match.length ? hex : match;
          }
        );
        // Replace color names with shorter hex equivalents
        const colorMap: { [key: string]: string } = {
          white: "#fff",
          black: "#000",
          red: "#f00",
          green: "#008000",
          blue: "#00f",
          yellow: "#ff0",
          cyan: "#0ff",
          magenta: "#f0f",
        };
        Object.entries(colorMap).forEach(([name, hex]) => {
          const regex = new RegExp(`\\b${name}\\b`, "gi");
          minified = minified.replace(regex, hex);
        });
      }

      // Optimize zeros
      if (options.optimizeZeros) {
        // Remove leading zeros
        minified = minified.replace(/(\s|:)0+(\d)/g, "$1$2");
        // Remove trailing zeros in decimals
        minified = minified.replace(/(\d)\.0+([\s;}])/g, "$1$2");
        // Simplify zero values
        minified = minified.replace(
          /(\s|:)0(px|em|rem|%|pt|pc|in|mm|cm|ex|ch|vw|vh|vmin|vmax)/g,
          "$10"
        );
        // Replace 0 0 0 0 with 0
        minified = minified.replace(/(\s|:)0\s+0\s+0\s+0(?=\s*[;}])/g, "$10");
        // Replace 0 0 0 with 0
        minified = minified.replace(/(\s|:)0\s+0\s+0(?=\s*[;}])/g, "$10");
        // Replace 0 0 with 0
        minified = minified.replace(/(\s|:)0\s+0(?=\s*[;}])/g, "$10");
      }

      // Merge duplicate rules (experimental)
      if (options.mergeDuplicateRules) {
        const ruleMap = new Map<string, string[]>();
        minified = minified.replace(
          /([^{}]+)\{([^{}]*)\}/g,
          (match, selector, properties) => {
            const cleanSelector = selector.trim();
            const cleanProperties = properties.trim();

            if (ruleMap.has(cleanProperties)) {
              ruleMap.get(cleanProperties)!.push(cleanSelector);
              return "";
            } else {
              ruleMap.set(cleanProperties, [cleanSelector]);
              return match;
            }
          }
        );

        // Rebuild CSS with merged selectors
        let rebuiltCss = "";
        ruleMap.forEach((selectors, properties) => {
          if (properties) {
            rebuiltCss += `${selectors.join(",")}{${properties}}`;
          }
        });

        if (rebuiltCss) {
          minified = rebuiltCss;
        }
      }

      // Remove whitespace
      if (options.removeWhitespace) {
        // Remove whitespace around specific characters
        minified = minified.replace(/\s*([{}:;,>+~])\s*/g, "$1");
        // Collapse multiple spaces into single space
        minified = minified.replace(/\s+/g, " ");
        // Remove leading/trailing whitespace
        minified = minified.trim();
        // Remove space after opening and before closing braces
        minified = minified.replace(/\{\s+/g, "{");
        minified = minified.replace(/\s+\}/g, "}");
      }

      // Remove line breaks
      if (options.removeLineBreaks) {
        minified = minified.replace(/\r?\n/g, "");
      }

      // Remove last semicolon in each rule
      if (options.removeLastSemicolon) {
        minified = minified.replace(/;(\s*})/g, "$1");
      }

      // Remove empty rules
      if (options.removeEmptyRules) {
        minified = minified.replace(/[^{}]*\{\s*\}/g, "");
      }

      // Additional optimizations
      // Remove trailing semicolons before closing braces
      minified = minified.replace(/;+\}/g, "}");
      // Remove duplicate semicolons
      minified = minified.replace(/;+/g, ";");

      setOutput(minified);
      setError("");

      // Calculate CSS stats
      const minifiedSize = new Blob([minified]).size;
      const compressionRatio =
        originalSize > 0
          ? ((1 - minifiedSize / originalSize) * 100).toFixed(1)
          : "0";

      const originalLines = textToMinify.split("\n").length;
      const minifiedLines = minified.split("\n").length;

      setCssStats({
        originalSize: formatBytes(originalSize),
        minifiedSize: formatBytes(minifiedSize),
        compressionRatio: `${compressionRatio}%`,
        originalLines,
        minifiedLines,
        originalChars: textToMinify.length,
        minifiedChars: minified.length,
      });

      // Show success message
      setSnackbarMessage(
        `CSS minified successfully! Saved ${compressionRatio}% space.`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      trackTool("css-minifier", "minify");
    } catch (err) {
      console.error("Error minifying CSS:", err);
      setError("Error minifying CSS. Please check your CSS syntax.");
      setSnackbarMessage("Error minifying CSS. Please check your CSS syntax.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatCssForPreview = (css: string) => {
    if (!css) return "";

    let formatted = css;
    // Add line breaks after braces and semicolons
    formatted = formatted.replace(/\{/g, " {\n  ");
    formatted = formatted.replace(/\}/g, "\n}\n");
    formatted = formatted.replace(/;/g, ";\n  ");

    // Clean up extra spaces and line breaks
    formatted = formatted.replace(/\n\s*\n/g, "\n");
    formatted = formatted.replace(/\n  \}/g, "\n}");
    formatted = formatted.replace(/^\s+/gm, (match) => {
      const depth = match.includes("}") ? 0 : 2;
      return " ".repeat(depth);
    });

    return formatted.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setSnackbarMessage("CSS copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    trackTool("css-minifier", "copy");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setSnackbarMessage("CSS pasted from clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      trackTool("css-minifier", "paste");
    } catch (err) {
      console.error("Failed to read clipboard contents:", err);
      setSnackbarMessage("Failed to read from clipboard");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setCssStats(null);
    trackTool("css-minifier", "clear");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbarMessage("File size must be less than 5MB");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    // Validate file type
    const allowedTypes = ["text/css", "text/plain"];
    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(css|txt)$/i)
    ) {
      setSnackbarMessage("Please upload a valid CSS file (.css or .txt)");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      setSnackbarMessage(
        `File "${file.name}" loaded successfully (${formatBytes(file.size)})`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      trackTool("css-minifier", "file_upload");
    };
    reader.onerror = () => {
      setSnackbarMessage("Error reading file. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "minified.css";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbarMessage("CSS downloaded successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    trackTool("css-minifier", "download");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          CSS Minifier Tool
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Compress and optimize your CSS code by removing unnecessary
          characters, whitespace, and comments to reduce file size and improve
          website performance.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="h3" fontWeight={600}>
                  Input CSS Code
                </Typography>
                <Box>
                  <Tooltip title="Paste CSS from clipboard">
                    <IconButton
                      onClick={handlePaste}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <ClipboardPaste size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear CSS input">
                    <IconButton
                      onClick={handleClear}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <Trash2 size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Upload CSS file">
                    <IconButton component="label" size="small">
                      <Upload size={20} />
                      <input
                        type="file"
                        hidden
                        accept=".css,text/css"
                        onChange={handleFileUpload}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                minRows={15}
                maxRows={15}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your CSS code here... (e.g., body { margin: 0; padding: 0; })"
                variant="outlined"
                sx={{
                  fontFamily: "monospace",
                  mb: 2,
                  flexGrow: 1,
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                  "& .MuiInputBase-input": {
                    height: "100%",
                    overflow: "auto",
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Enter your CSS code above. Supports all CSS syntax including
                media queries, keyframes, and vendor prefixes.
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => minifyCss()}
                  startIcon={<RotateCw size={18} />}
                  disabled={!input || autoMinify}
                >
                  {autoMinify ? "Auto-Minifying..." : "Minify CSS Code"}
                </Button>
                <Tooltip
                  title={
                    autoMinify ? "Disable auto-minify" : "Enable auto-minify"
                  }
                >
                  <IconButton
                    onClick={() => setAutoMinify(!autoMinify)}
                    color={autoMinify ? "primary" : "default"}
                  >
                    <Zap size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center" }}
              >
                {autoMinify
                  ? "Auto-minifying as you type"
                  : "Click to compress your CSS and reduce file size"}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="h3" fontWeight={600}>
                  Minified CSS Result
                </Typography>
                <Box>
                  <Tooltip
                    title={
                      showPreview
                        ? "Hide formatted preview"
                        : "Show formatted preview"
                    }
                  >
                    <IconButton
                      onClick={() => setShowPreview(!showPreview)}
                      size="small"
                      disabled={!output}
                      sx={{ mr: 1 }}
                      color={showPreview ? "primary" : "default"}
                    >
                      {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={
                      copied
                        ? "Copied to clipboard!"
                        : "Copy minified CSS to clipboard"
                    }
                  >
                    <IconButton
                      onClick={handleCopy}
                      size="small"
                      disabled={!output}
                      sx={{ mr: 1 }}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download minified CSS file">
                    <IconButton
                      onClick={handleDownload}
                      size="small"
                      disabled={!output}
                    >
                      <Download size={20} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                minRows={15}
                maxRows={15}
                value={showPreview ? formatCssForPreview(output) : output}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                placeholder="Minified CSS will appear here after processing..."
                sx={{
                  fontFamily: "monospace",
                  mb: 2,
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                  "& .MuiInputBase-input": {
                    height: "100%",
                    overflow: "auto",
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Optimized CSS code with reduced file size for better web
                performance {showPreview && "(formatted preview)"}
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {cssStats && (
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        File Size
                      </Typography>
                      <Typography variant="body2">
                        {cssStats.originalSize} → {cssStats.minifiedSize}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Characters
                      </Typography>
                      <Typography variant="body2">
                        {cssStats.originalChars.toLocaleString()} →{" "}
                        {cssStats.minifiedChars.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Lines
                      </Typography>
                      <Typography variant="body2">
                        {cssStats.originalLines} → {cssStats.minifiedLines}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        Compression
                      </Typography>
                      <Typography
                        variant="body2"
                        color="success.main"
                        fontWeight={600}
                      >
                        {cssStats.compressionRatio} saved
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" component="h3" fontWeight={600}>
                  Minification Options
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => applyPreset("conservative")}
                    startIcon={<Settings size={16} />}
                  >
                    Conservative
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => applyPreset("balanced")}
                    startIcon={<Settings size={16} />}
                  >
                    Balanced
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => applyPreset("aggressive")}
                    startIcon={<Settings size={16} />}
                  >
                    Aggressive
                  </Button>
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <FormGroup>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.removeComments}
                          onChange={() => handleOptionChange("removeComments")}
                          color="primary"
                        />
                      }
                      label="Remove comments"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Removes all comments from CSS (/* comment */)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.removeWhitespace}
                          onChange={() =>
                            handleOptionChange("removeWhitespace")
                          }
                          color="primary"
                        />
                      }
                      label="Remove whitespace"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Removes unnecessary spaces around selectors and properties
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.removeLineBreaks}
                          onChange={() =>
                            handleOptionChange("removeLineBreaks")
                          }
                          color="primary"
                        />
                      }
                      label="Remove line breaks"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Removes all line breaks to create a single-line CSS file
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.removeLastSemicolon}
                          onChange={() =>
                            handleOptionChange("removeLastSemicolon")
                          }
                          color="primary"
                        />
                      }
                      label="Remove last semicolon"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Removes the last semicolon in each CSS rule
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.removeEmptyRules}
                          onChange={() =>
                            handleOptionChange("removeEmptyRules")
                          }
                          color="primary"
                        />
                      }
                      label="Remove empty rules"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Removes CSS rules that have no properties
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.optimizeColors}
                          onChange={() => handleOptionChange("optimizeColors")}
                          color="primary"
                        />
                      }
                      label="Optimize colors"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Converts colors to shorter formats (e.g., #ffffff → #fff)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.optimizeZeros}
                          onChange={() => handleOptionChange("optimizeZeros")}
                          color="primary"
                        />
                      }
                      label="Optimize zeros"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Optimizes zero values (e.g., 0px → 0, 0.5 → .5)
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={options.mergeDuplicateRules}
                          onChange={() =>
                            handleOptionChange("mergeDuplicateRules")
                          }
                          color="primary"
                        />
                      }
                      label="Merge duplicate rules (Beta)"
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Combines selectors with identical properties
                    </Typography>
                  </Grid>
                </Grid>
              </FormGroup>
            </Paper>
          </Grid>
        </Grid>

        {/* AdSense Ad */}
        <AdSense adSlot="3174835314" />

        {/* Examples Section */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              fontWeight={600}
            >
              CSS Minification Examples
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
                  Before Minification
                </Typography>
                <Paper
                  sx={{ p: 2, backgroundColor: "background.default", mb: 2 }}
                >
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {`/* Main styles */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
}

.header {
  background: #333333;
  color: white;
  padding: 20px;
}

.button {
  background-color: #007bff;
  border: none;
  padding: 10px 20px;
  color: white;
  cursor: pointer;
}`}
                  </Typography>
                </Paper>
                <Typography variant="body2" color="text.secondary">
                  Original size: ~380 bytes
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 2 }}>
                  After Minification
                </Typography>
                <Paper
                  sx={{ p: 2, backgroundColor: "background.default", mb: 2 }}
                >
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.85rem",
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {`body{margin:0;padding:0;font-family:Arial,sans-serif;background-color:#fff}.header{background:#333;color:#fff;padding:20px}. button{background-color:#007bff;border:none;padding:10px 20px;color:#fff;cursor:pointer}`}
                  </Typography>
                </Paper>
                <Typography variant="body2" color="success.main">
                  Minified size: ~240 bytes (37% reduction)
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              component="h4"
              gutterBottom
              fontWeight={600}
            >
              Common Use Cases
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "primary.light",
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{ mb: 1, color: "#000" }}
                  >
                    🚀 Production Builds
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: "#000" }}>
                    Reduce CSS file sizes for faster website loading and better
                    user experience
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "secondary.light",
                    borderRadius: 1,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{ mb: 1, color: "#000" }}
                  >
                    📱 Mobile Optimization
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: "#000" }}>
                    Minimize bandwidth usage for mobile users with slower
                    connections
                  </Typography>
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
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{ mb: 1, color: "#000" }}
                  >
                    ⚡ Performance Boost
                  </Typography>
                  <Typography sx={{ fontSize: "0.9rem", color: "#000" }}>
                    Improve Core Web Vitals and SEO rankings with optimized CSS
                    delivery
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 4,
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              fontWeight={600}
            >
              About CSS Minification
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" paragraph>
              CSS minification is a crucial web performance optimization
              technique that removes unnecessary characters from CSS files
              without changing their functionality. This process significantly
              reduces file sizes, leading to faster page load times, improved
              user experience, and better SEO rankings.
            </Typography>

            <Typography
              variant="h6"
              component="h4"
              gutterBottom
              fontWeight={600}
              sx={{ mt: 3 }}
            >
              Key Benefits & Features
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                  Optimization Features:
                </Typography>
                <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>Comment Removal:</strong> Strips all CSS comments
                      (/* comment */)
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>Whitespace Elimination:</strong> Removes
                      unnecessary spaces and tabs
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>Line Break Removal:</strong> Creates single-line
                      CSS for maximum compression
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      <strong>Semicolon Optimization:</strong> Removes redundant
                      semicolons
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight={500} sx={{ mb: 1 }}>
                  Performance Benefits:
                </Typography>
                <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>Faster Loading:</strong> Reduced file sizes mean
                      quicker downloads
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>Bandwidth Savings:</strong> Lower data usage,
                      especially important for mobile
                    </Typography>
                  </Box>
                  <Box component="li" sx={{ mb: 1 }}>
                    <Typography>
                      <strong>SEO Improvement:</strong> Better Core Web Vitals
                      scores
                    </Typography>
                  </Box>
                  <Box component="li">
                    <Typography>
                      <strong>Cost Reduction:</strong> Lower hosting and CDN
                      costs
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Typography
              variant="h6"
              component="h4"
              gutterBottom
              fontWeight={600}
              sx={{ mt: 3 }}
            >
              Best Practices & Tips
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>
                  <strong>Production Only:</strong> Use minified CSS in
                  production, keep readable versions for development
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>
                  <strong>Build Process Integration:</strong> Automate
                  minification in your build pipeline
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>
                  <strong>Combine with Gzip:</strong> Use alongside server
                  compression for maximum efficiency
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Typography>
                  <strong>Test Thoroughly:</strong> Always verify that minified
                  CSS works correctly
                </Typography>
              </Box>
              <Box component="li">
                <Typography>
                  <strong>Version Control:</strong> Keep both original and
                  minified versions in your repository
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* AdSense Ad */}
        <AdSense adSlot="6613251015" />
        {/* </Grid> */}
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CssMinifier;
