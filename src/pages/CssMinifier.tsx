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
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const CssMinifier = () => {
  const theme = useTheme();
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
  } | null>(null);
  const [options, setOptions] = useState({
    removeComments: true,
    removeWhitespace: true,
    removeLineBreaks: true,
    removeLastSemicolon: true,
  });

  // Check for CSS in URL params when component mounts
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cssParam = params.get("css");

    if (cssParam) {
      try {
        const decodedCss = decodeURIComponent(cssParam);
        setInput(decodedCss);
        minifyCss(decodedCss);
      } catch (err) {
        console.error("Failed to parse CSS from URL", err);
      }
    }
  }, []);

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions({
      ...options,
      [option]: !options[option],
    });
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

      // Remove comments
      if (options.removeComments) {
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, "");
      }

      // Remove whitespace
      if (options.removeWhitespace) {
        minified = minified.replace(/\s*(\{|\}|:|;|,)\s*/g, "$1");
        minified = minified.replace(/\s+/g, " ");
        minified = minified.trim();
      }

      // Remove line breaks
      if (options.removeLineBreaks) {
        minified = minified.replace(/\n/g, "");
      }

      // Remove last semicolon in each rule
      if (options.removeLastSemicolon) {
        minified = minified.replace(/;}\s*/g, "}");
      }

      setOutput(minified);
      setError("");

      // Calculate CSS stats
      const minifiedSize = new Blob([minified]).size;
      const compressionRatio = (
        (1 - minifiedSize / originalSize) *
        100
      ).toFixed(2);

      setCssStats({
        originalSize: formatBytes(originalSize),
        minifiedSize: formatBytes(minifiedSize),
        compressionRatio: `${compressionRatio}%`,
      });

      // Update URL with the minified CSS
      const url = new URL(window.location.href);
      url.searchParams.set("css", encodeURIComponent(minified));
      window.history.replaceState({}, "", url);
    } catch (err) {
      console.error("Error minifying CSS:", err);
      setError("Error minifying CSS. Please check your input.");
      setSnackbarMessage("Error minifying CSS");
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

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setSnackbarMessage("CSS copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      setSnackbarMessage("CSS pasted from clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
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
    // Clear URL params
    const url = new URL(window.location.href);
    url.searchParams.delete("css");
    window.history.replaceState({}, "", url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      setSnackbarMessage(`File "${file.name}" loaded successfully`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    };
    reader.onerror = () => {
      setSnackbarMessage("Error reading file");
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
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>CSS Minifier - Optimize and Compress CSS Code</title>
        <meta
          name="description"
          content="Minify and optimize your CSS code by removing unnecessary characters, whitespace, and comments to reduce file size and improve load times."
        />
        <meta
          name="keywords"
          content="css minifier, css compressor, css optimizer, minify css, compress css, reduce css size, css tool, web development tool, CSS minifier online free, Free CSS compressor tool, Online CSS minification tool, Minify CSS code instantly, CSS minifier with source map, Best online CSS minifier, CSS optimizer for websites, Compress CSS files online, CSS minifier without download, Minify CSS for faster loading, CSS minifier tool for developers, Online CSS minifier with editor, CSS minifier for production build, Minify inline CSS online, CSS minifier with Gzip compression, CSS minifier React app, CSS minifier JavaScript tool, Open source CSS minifier, CSS minifier GitHub repository, CSS minifier NPM package, Web-based CSS minifier tool, Fast CSS compression online, CSS minifier for frontend developers, Minify CSS for WordPress Bootstrap projects, Online code minifier tool for CSS"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          CSS Minifier
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Optimize your CSS by removing unnecessary characters and whitespace
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
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
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Input CSS
                </Typography>
                <Box>
                  <Tooltip title="Paste from clipboard">
                    <IconButton
                      onClick={handlePaste}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <ClipboardPaste size={20} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear">
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
                placeholder="Paste your CSS code here..."
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => minifyCss()}
                startIcon={<RotateCw size={18} />}
                disabled={!input}
                sx={{ mt: 1 }}
              >
                Minify CSS
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
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
                <Typography variant="h6" component="h2" fontWeight={600}>
                  Minified CSS
                </Typography>
                <Box>
                  <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                    <IconButton
                      onClick={handleCopy}
                      size="small"
                      disabled={!output}
                      sx={{ mr: 1 }}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download minified CSS">
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
                value={output}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
                placeholder="Minified CSS will appear here..."
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
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {cssStats && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    bgcolor: theme.palette.background.paper,
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="body2">
                    Original: {cssStats.originalSize}
                  </Typography>
                  <Typography variant="body2">
                    Minified: {cssStats.minifiedSize}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Saved: {cssStats.compressionRatio}
                  </Typography>
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
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                fontWeight={600}
              >
                Minification Options
              </Typography>
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
                </Grid>
              </FormGroup>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <AdSense adSlot="6613251015" />
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                fontWeight={600}
              >
                About CSS Minification
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" paragraph>
                CSS minification is the process of removing unnecessary
                characters from CSS files to reduce their size, improving load
                times and saving bandwidth. This tool helps you optimize your
                CSS by:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" component="div">
                    <ul>
                      <li>Removing comments that aren't visible to users</li>
                      <li>
                        Eliminating unnecessary whitespace and line breaks
                      </li>
                      <li>
                        Removing redundant semicolons and other characters
                      </li>
                    </ul>
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" component="div">
                    <ul>
                      <li>Preserving the functionality of your CSS</li>
                      <li>
                        Providing options to customize the minification process
                      </li>
                      <li>Showing statistics on file size reduction</li>
                    </ul>
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                For best results in production environments, consider using this
                tool as part of your build process along with other optimization
                techniques like CSS concatenation and HTTP compression.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CssMinifier;
