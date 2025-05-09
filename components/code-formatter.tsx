"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  SelectChangeEvent,
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import DeleteIcon from "@mui/icons-material/Delete";
import CodeIcon from "@mui/icons-material/Code";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { highlight, languages } from "prismjs";
// import "@types/prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/themes/prism.css";

// Supported languages
interface Language {
  id: string;
  name: string;
  formatter: (code: string) => string;
  prismLanguage: string;
}

// Language formatters
const formatJavaScript = (code: string): string => {
  try {
    // Basic JS formatting
    return JSON.stringify(
      Function(`"use strict"; return (${code})`)(),
      null,
      2
    );
  } catch (e) {
    try {
      // Try as a JS object with some fixes
      const fixedCode = code
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')
        .replace(/'/g, '"');
      return JSON.stringify(JSON.parse(`{${fixedCode}}`), null, 2);
    } catch (e2) {
      throw new Error("Invalid JavaScript code");
    }
  }
};

const formatJSON = (code: string): string => {
  try {
    return JSON.stringify(JSON.parse(code), null, 2);
  } catch (e) {
    throw new Error("Invalid JSON");
  }
};

const formatHTML = (code: string): string => {
  try {
    // Basic HTML formatting using a simple regex-based approach
    return code
      .replace(/>\s*</g, ">\n<") // Add newline between tags
      .replace(/(<[^\/].*?>)/g, "$1\n") // Add newline after opening tags
      .replace(/(<\/.*?>)/g, "\n$1") // Add newline before closing tags
      .replace(/\n\s*\n/g, "\n") // Remove multiple blank lines
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  } catch (e) {
    throw new Error("Invalid HTML");
  }
};

const formatCSS = (code: string): string => {
  try {
    // Basic CSS formatting
    return code
      .replace(/\s*{\s*/g, " {\n  ") // Format opening braces
      .replace(/\s*;\s*/g, ";\n  ") // Format semicolons
      .replace(/\s*}\s*/g, "\n}\n") // Format closing braces
      .replace(/\n\s*\n/g, "\n") // Remove multiple blank lines
      .trim();
  } catch (e) {
    throw new Error("Invalid CSS");
  }
};

const formatTypescript = (code: string): string => {
  try {
    // For TypeScript, we'll use a similar approach to JavaScript
    return formatJavaScript(code);
  } catch (e) {
    throw new Error("Invalid TypeScript code");
  }
};

const formatPython = (code: string): string => {
  try {
    // Basic Python formatting
    return code
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  } catch (e) {
    throw new Error("Invalid Python code");
  }
};

const LANGUAGES: Language[] = [
  {
    id: "javascript",
    name: "JavaScript",
    formatter: formatJavaScript,
    prismLanguage: "javascript",
  },
  { id: "json", name: "JSON", formatter: formatJSON, prismLanguage: "json" },
  { id: "html", name: "HTML", formatter: formatHTML, prismLanguage: "markup" },
  { id: "css", name: "CSS", formatter: formatCSS, prismLanguage: "css" },
  {
    id: "typescript",
    name: "TypeScript",
    formatter: formatTypescript,
    prismLanguage: "typescript",
  },
  {
    id: "python",
    name: "Python",
    formatter: formatPython,
    prismLanguage: "python",
  },
];

export function CodeFormatter() {
  const [sourceCode, setSourceCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [language, setLanguage] = useState("json");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const theme = useTheme();

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
    setError(null);
  };

  const handleSourceCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSourceCode(e.target.value);
    setError(null);
  };

  const handleFormat = () => {
    if (!sourceCode.trim()) {
      setFormattedCode("");
      return;
    }

    setLoading(true);

    // Use setTimeout to prevent UI freezing for large inputs
    setTimeout(() => {
      try {
        const selectedLanguage = LANGUAGES.find((lang) => lang.id === language);
        if (!selectedLanguage) {
          setError("Selected language not supported");
          setLoading(false);
          return;
        }

        const result = selectedLanguage.formatter(sourceCode);
        setFormattedCode(result);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
        setFormattedCode("");
        showSnackbar((err as Error).message, "error");
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const handleClear = () => {
    setSourceCode("");
    setFormattedCode("");
    setError(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formattedCode);
    setCopied(true);
    showSnackbar("Copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFormattedCode = () => {
    const element = document.createElement("a");
    const file = new Blob([formattedCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `formatted-code.${language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showSnackbar("File downloaded successfully!", "success");
  };

  const uploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSourceCode(content);

      // Try to detect language from file extension
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (extension) {
        const languageMap: Record<string, string> = {
          js: "javascript",
          json: "json",
          html: "html",
          css: "css",
          ts: "typescript",
          py: "python",
        };

        if (languageMap[extension]) {
          setLanguage(languageMap[extension]);
        }
      }
    };
    reader.readAsText(file);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Function to render code with syntax highlighting
  const renderHighlightedCode = (code: string, language: string) => {
    const selectedLanguage = LANGUAGES.find((lang) => lang.id === language);
    if (!selectedLanguage) return code;

    try {
      const highlighted = highlight(
        code,
        languages[selectedLanguage.prismLanguage],
        selectedLanguage.prismLanguage
      );
      return highlighted;
    } catch (e) {
      return code;
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        maxWidth: "100%",
        width: "100%",
        mx: "auto",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Code Formatter
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="language-label">Language</InputLabel>
                <Select
                  labelId="language-label"
                  id="language-select"
                  value={language}
                  label="Language"
                  onChange={handleLanguageChange}
                  sx={{ width: "100%" }}
                >
                  {LANGUAGES.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<FormatAlignLeftIcon />}
                  onClick={handleFormat}
                  disabled={!sourceCode.trim() || loading}
                >
                  {loading ? <CircularProgress size={24} /> : "Format Code"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={handleClear}
                  disabled={!sourceCode && !formattedCode}
                >
                  Clear
                </Button>
                <Tooltip title="Upload file">
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                  >
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={uploadFile}
                      accept=".js,.json,.html,.css,.ts,.py,.txt"
                    />
                  </Button>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={0} sx={{ width: "100%" }}>
          <Grid item xs={12} sx={{ width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                width: "100%",
              }}
            >
              <Box sx={{ mb: 3, width: "100%" }}>
                <Typography variant="subtitle1" gutterBottom>
                  Input Code
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={15}
                  value={sourceCode}
                  onChange={handleSourceCodeChange}
                  placeholder={`Paste your ${
                    LANGUAGES.find((lang) => lang.id === language)?.name || ""
                  } code here...`}
                  variant="outlined"
                  sx={{
                    fontFamily: "monospace",
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      width: "100%",
                    },
                    "& .MuiInputBase-input": {
                      width: "100%",
                    },
                    "& .MuiInputBase-root": {
                      width: "100%",
                    },
                  }}
                />
              </Box>

              {error && (
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={error}
                    color="error"
                    variant="outlined"
                    icon={<CodeIcon />}
                  />
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1">Formatted Code</Typography>
                  {formattedCode && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Copy to clipboard">
                        <IconButton
                          onClick={copyToClipboard}
                          color={copied ? "success" : "default"}
                          size="small"
                        >
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download formatted code">
                        <IconButton
                          onClick={downloadFormattedCode}
                          size="small"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>
                {formattedCode ? (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      height: "350px",
                      width: "100%",
                      overflow: "auto",
                      fontFamily: "monospace",
                      "& pre": {
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      },
                      "& code": {
                        fontFamily: "monospace",
                      },
                    }}
                  >
                    <pre>
                      <code
                        dangerouslySetInnerHTML={{
                          __html: renderHighlightedCode(
                            formattedCode,
                            language
                          ),
                        }}
                      />
                    </pre>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 1,
                      height: "350px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography color="text.secondary">
                      Formatted code will appear here
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <Divider sx={{ my: 3 }} />
      </Box>

      <Typography variant="h5" gutterBottom>
        Code Formatter Features
      </Typography>
      <Typography>
        • Format and beautify code in multiple programming languages
      </Typography>
      <Typography>
        • Support for JavaScript, JSON, HTML, CSS, TypeScript, and Python
      </Typography>
      <Typography>
        • Preserves code structure while improving readability
      </Typography>
      <Typography>
        • Fast processing with client-side technology (your code never leaves
        your computer)
      </Typography>
      <Typography>• Syntax highlighting for formatted code</Typography>
      <Typography>• Copy formatted code to clipboard with one click</Typography>
      <Typography>• Download formatted code as a file</Typography>
      <Typography>• Upload code files directly from your device</Typography>
    </Paper>
  );
}
