/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCaseChange = (newCase: string) => {
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
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        break;
      case "sentence":
        formattedText = inputText
          .toLowerCase()
          .replace(/(^\w|\.\s+\w)/g, (letter) => letter.toUpperCase());
        break;
      case "camel":
        formattedText = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case "pascal":
        formattedText = inputText
          .toLowerCase()
          .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase());
        break;
      case "snake":
        formattedText = inputText.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "_");
        break;
      case "kebab":
        formattedText = inputText.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
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
    setSnackbarMessage(`Text converted to ${newCase} case`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setSnackbarMessage("Text copied to clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to copy text");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setSelectedCase("");
    setSnackbarMessage("Text cleared");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInputText(clipboardText);
      setSnackbarMessage("Text pasted from clipboard");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to read from clipboard");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSwap = () => {
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
  };

  const handleRandomCase = () => {
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
  };

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
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      <Helmet>
        <title>Text Case Converter - Web Tools</title>
        <meta
          name="description"
          content="Convert text between different cases including uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case and more. Free online text case converter tool."
        />
        <meta
          name="keywords"
          content="text case converter, uppercase, lowercase, title case, camel case, pascal case, snake case, kebab case, text formatter, online tools, Text case converter online free, Change text case tool, Convert lowercase to uppercase online, Online case converter with React, Capitalize text converter, Sentence case converter online, Title case converter tool, camelCase to snake_case converter, Snake case to camel case React tool, PascalCase converter online, Text formatting case converter, Bulk text case changer, Free case conversion tool, React-based case converter app, Case converter without download, Online text modifier with React, Convert text cases in browser, Open source text case converter, React text case converter GitHub, React case transformation tool, Real-time case converter web app, Text case changer for developers, Copy paste text case converter, Case converter with preview feature, Multi-case text converter tool, Text case converter NPM package, React case converter component, Best online text case changer, case converter, online text case converter, uppercase converter, lowercase converter, title case converter, camel case converter, snake case converter, kebab case converter, text formatter, convert text case, case changer online, free case converter, string case tool, text capitalization tool, react case converter, javascript text formatter, browser-based case tool, change text to uppercase, convert to camel case online, text case formatter, sentence case converter, toggle text case, open source case converter, caseconverter github, free tool to convert text to camel case, snake case generator for variables, convert csv headers to kebab case, text case converter for programming, change uppercase to sentence case online, React Text Case Tool,Case Converter Online,Text Formatter Tool,Change Text Case Online,Free Text Case Converter for Content Creators,React-based Text Case Converter Tool,Online Uppercase to Lowercase Converter,Convert Text Case for React Apps,SEO-Optimized Text Formatter Tool,Text Case Converter for bangalore Writers,React Text Formatter for coimbatore Developers,Online Case Converter for chennai Marketers,HTML Text Case Converter,React Text Formatter for Web Development,Text Case Converter for UI/UX Content,Sentence Case Converter for Developers,Title Case Formatter for React Apps,React SEO Text Case Converter,Server-Side Rendering Text Formatter,Next.js Text Case Converter,React Router Text Case Tool,SEO-Friendly Text Case Converter for React"
        />
        <meta property="og:title" content="Text Case Converter - Web Tools" />
        <meta
          property="og:description"
          content="Convert text between different cases including uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case and more. Free online text case converter tool."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/text-case-converter"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Text Case Converter - Web Tools" />
        <meta
          name="twitter:description"
          content="Convert text between different cases including uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case and more. Free online text case converter tool."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/text-case-converter"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          fontWeight={700}
          sx={{ fontSize: "2.5rem" }}
        >
          Text Case Converter
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          color="text.secondary"
          paragraph
          sx={{ fontSize: "1.25rem", fontWeight: 400 }}
        >
          Convert text between different cases: lowercase, UPPERCASE, Title
          Case, and more.
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
                <Typography variant="body2" color="text.secondary">
                  {inputText.length} characters
                </Typography>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here..."
                variant="outlined"
                aria-label="Input text to convert"
                inputProps={{
                  "aria-describedby": "input-text-description",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
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
                rows={10}
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
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        role="alert"
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          aria-live="assertive"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <AdSense adSlot="6613251015" />
    </Container>
  );
};

export default TextCaseConverter;
