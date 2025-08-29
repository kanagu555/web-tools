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
  CaseLower,
  CaseUpper,
  Type,
  Copy,
  Check,
  Trash2,
  ArrowLeftRight,
  RefreshCw,
  ClipboardPaste,
  Upload,
  Download,
} from "lucide-react";
import AdSense from "../AdSense";
import Navigation from "@/components/Navigation";

const TextCaseConverter = () => {
  const theme = useTheme();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");

  const handleCaseChange = useCallback(
    (newCase: string) => {
      if (!inputText.trim()) {
        setSnackbarMessage("Please enter some text first");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
        return;
      }

      setSelectedCase(newCase);
      let formattedText = inputText;

      switch (newCase) {
        case "lower":
          formattedText = inputText.toLowerCase();
          break;
        case "upper":
          formattedText = inputText.toUpperCase();
          break;
        case "title":
          formattedText = inputText
            .toLowerCase()
            .replace(
              /\w\S*/g,
              (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
            );
          break;
        case "sentence":
          formattedText = inputText
            .toLowerCase()
            .replace(/(^\w|[.!?]\s*\w)/g, (letter) => letter.toUpperCase());
          break;
        case "camel":
          formattedText = inputText
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
            .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
          break;
        case "pascal":
          formattedText = inputText
            .toLowerCase()
            .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, "");
          break;
        case "snake":
          formattedText = inputText
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
          break;
        case "kebab":
          formattedText = inputText
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
          break;
        case "alternating":
          formattedText = inputText
            .split("")
            .map((char, index) =>
              index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
            )
            .join("");
          break;
        case "inverse":
          formattedText = inputText
            .split("")
            .map((char) => {
              if (char === char.toUpperCase()) return char.toLowerCase();
              return char.toUpperCase();
            })
            .join("");
          break;
        default:
          break;
      }

      setOutputText(formattedText);
      setSnackbarMessage(`Text converted to ${getCaseDisplayName(newCase)}`);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    },
    [inputText]
  );

  const getCaseDisplayName = (caseType: string): string => {
    const caseNames: Record<string, string> = {
      lower: "lowercase",
      upper: "UPPERCASE",
      title: "Title Case",
      sentence: "Sentence case",
      camel: "camelCase",
      pascal: "PascalCase",
      snake: "snake_case",
      kebab: "kebab-case",
      alternating: "aLtErNaTiNg case",
      inverse: "InVeRsE case",
    };
    return caseNames[caseType] || caseType;
  };

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
    setSelectedCase("");
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
    setSelectedCase("");
    setSnackbarMessage("Output text moved to input");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }, [outputText]);

  const handleRandomCase = useCallback(() => {
    if (!inputText.trim()) {
      setSnackbarMessage("Please enter some text first");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const caseTypes = [
      "lower",
      "upper",
      "title",
      "sentence",
      "camel",
      "pascal",
      "snake",
      "kebab",
      "alternating",
      "inverse",
    ];
    const randomCase = caseTypes[Math.floor(Math.random() * caseTypes.length)];
    handleCaseChange(randomCase);
  }, [inputText, handleCaseChange]);

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
    a.download = `converted-text-${selectedCase || "output"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbarMessage("Text downloaded successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }, [outputText, selectedCase]);

  const caseTypes = [
    {
      value: "lower",
      label: "lowercase",
      icon: <CaseLower size={18} aria-hidden="true" />,
    },
    {
      value: "upper",
      label: "UPPERCASE",
      icon: <CaseUpper size={18} aria-hidden="true" />,
    },
    {
      value: "title",
      label: "Title Case",
      icon: <Type size={18} aria-hidden="true" />,
    },
    {
      value: "sentence",
      label: "Sentence case",
      icon: <Type size={18} aria-hidden="true" />,
    },
    {
      value: "camel",
      label: "camelCase",
      icon: <Type size={18} aria-hidden="true" />,
    },
    {
      value: "pascal",
      label: "PascalCase",
      icon: <Type size={18} aria-hidden="true" />,
    },
    {
      value: "snake",
      label: "snake_case",
      icon: <Type size={18} aria-hidden="true" />,
    },
    {
      value: "kebab",
      label: "kebab-case",
      icon: <Type size={18} aria-hidden="true" />,
    },
    {
      value: "alternating",
      label: "aLtErNaTiNg",
      icon: <Type size={18} aria-hidden="true" />,
    },
    {
      value: "inverse",
      label: "InVeRsE cAsE",
      icon: <Type size={18} aria-hidden="true" />,
    },
  ];

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
          Text Case Converter
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
          Convert text between different cases: lowercase, UPPERCASE, Title
          Case, camelCase, snake_case, and more. Perfect for developers and
          content creators.
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
          aria-labelledby="case-converter-section"
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom fontWeight={600}>
              Select Case Type
            </Typography>
            <Grid container spacing={2}>
              {caseTypes.map((type) => (
                <Grid item xs={12} sm={6} md={3} key={type.value}>
                  <Paper
                    onClick={() => handleCaseChange(type.value)}
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      transition: "all 0.2s",
                      border:
                        selectedCase === type.value
                          ? `2px solid ${theme.palette.primary.main}`
                          : "none",
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}15`,
                      },
                    }}
                    role="button"
                    aria-label={`Convert to ${type.label}`}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleCaseChange(type.value);
                      }
                    }}
                  >
                    {type.icon}
                    <Typography>{type.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
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
              <Tooltip title="Apply random case">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleRandomCase}
                  disabled={!inputText}
                  startIcon={<RefreshCw size={16} aria-hidden="true" />}
                  aria-label="Apply random case conversion"
                >
                  Random Case
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
                placeholder="Type, paste, or upload your text here to convert between different cases..."
                variant="outlined"
                aria-label="Input text to convert between different cases"
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
                Enter the text you want to convert to different cases
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
                Result of your case conversion will appear here
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
              Why Use Our Text Case Converter?
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
                    <Type size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Multiple Case Formats
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Support for 10+ case types including camelCase, PascalCase,
                    snake_case, kebab-case, and more formatting options.
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
                    <RefreshCw size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Real-time Conversion
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instant text conversion as you type or select formats. No
                    waiting - see results immediately.
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
                    File Support
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload text files, convert content, and download results.
                    Supports clipboard operations and batch processing.
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
              How to Convert Text Cases
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
                    Select Format
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose from 10+ case formats including programming and
                    content creation styles.
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
                    Get Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Watch as your text is instantly converted to the selected
                    case format with real-time preview.
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
                      Use our text case converter completely free without
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
                What case formats are supported?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Our tool supports 10+ case formats: lowercase, UPPERCASE, Title
                Case, Sentence case, camelCase, PascalCase, snake_case,
                kebab-case, alternating case, and inverse case.
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
                What's the difference between camelCase and PascalCase?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                camelCase starts with a lowercase letter (e.g., 'helloWorld'),
                while PascalCase starts with an uppercase letter (e.g.,
                'HelloWorld'). Both remove spaces and capitalize subsequent
                words.
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

export default TextCaseConverter;
