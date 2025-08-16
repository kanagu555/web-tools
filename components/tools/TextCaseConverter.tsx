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

        {/* Case Conversion Guide for SEO */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          component="section"
          aria-labelledby="case-conversion-guide"
        >
          <Typography
            id="case-conversion-guide"
            variant="h2"
            component="h2"
            gutterBottom
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            Text Case Conversion Guide
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 2, fontWeight: 600 }}
              >
                Common Case Types
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  lowercase
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Converts all letters to lowercase. Example: "hello world"
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  UPPERCASE
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Converts all letters to uppercase. Example: "HELLO WORLD"
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Title Case
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capitalizes the first letter of each word. Example: "Hello
                  World"
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Sentence case
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capitalizes the first letter of each sentence. Example: "Hello
                  world. How are you?"
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 2, fontWeight: 600 }}
              >
                Programming Cases
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  camelCase
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  First word lowercase, subsequent words capitalized. Example:
                  "helloWorld"
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  PascalCase
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All words capitalized, no spaces. Example: "HelloWorld"
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  snake_case
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lowercase words separated by underscores. Example:
                  "hello_world"
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  kebab-case
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lowercase words separated by hyphens. Example: "hello-world"
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
              >
                Perfect For
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>Developers formatting variable names</li>
                  <li>Content creators standardizing text</li>
                  <li>Students formatting academic papers</li>
                  <li>SEO professionals optimizing content</li>
                  <li>Writers editing manuscripts</li>
                </ul>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
              >
                Features
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>10 different case conversion types</li>
                  <li>Real-time text conversion</li>
                  <li>File upload and download support</li>
                  <li>Copy and paste functionality</li>
                  <li>Character count with limits</li>
                  <li>Privacy-focused (client-side processing)</li>
                </ul>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* FAQ Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          component="section"
          aria-labelledby="faq-section"
        >
          <Typography
            id="faq-section"
            variant="h2"
            component="h2"
            gutterBottom
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            Frequently Asked Questions
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  What case formats are supported?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our tool supports 10+ case formats including lowercase,
                  UPPERCASE, Title Case, Sentence case, camelCase, PascalCase,
                  snake_case, kebab-case, alternating case, and inverse case.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  Can I upload files for case conversion?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes, you can upload text files (.txt) up to 1MB in size. The
                  tool will automatically convert the file content to your
                  selected case format.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  Is my text data secure?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absolutely! All text processing happens entirely in your
                  browser. No data is sent to our servers, ensuring complete
                  privacy and security.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  What's the difference between camelCase and PascalCase?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  camelCase starts with a lowercase letter (e.g., 'helloWorld'),
                  while PascalCase starts with an uppercase letter (e.g.,
                  'HelloWorld'). Both remove spaces and capitalize subsequent
                  words.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  Can I download the converted text?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes, you can download the converted text as a .txt file. Just
                  click the Download button after converting your text to save
                  it locally.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
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
