/* eslint-disable react-hooks/exhaustive-deps */
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
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Tooltip,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  AlignLeft,
  CaseLower,
  CaseUpper,
  Type,
  Copy,
  Check,
  Trash2,
  FileText,
  Indent,
  RemoveFormatting,
  Undo,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const TextFormatter = () => {
  const theme = useTheme();
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [textCase, setTextCase] = useState<
    "lower" | "upper" | "title" | "sentence"
  >("sentence");

  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Apply formatting when input text or formatting options change
  useEffect(() => {
    if (inputText) {
      formatText();
    } else {
      setOutputText("");
    }
  }, [inputText, textCase]);

  // Add to history when output text changes
  useEffect(() => {
    if (
      outputText &&
      (history.length === 0 || history[history.length - 1] !== outputText)
    ) {
      setHistory((prev) => [...prev, outputText]);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [outputText]);

  const formatText = () => {
    let formattedText = inputText;

    // Apply case formatting
    switch (textCase) {
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
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (letter) => letter.toUpperCase());
        break;
    }

    setOutputText(formattedText);
  };

  const handleCaseChange = (
    newCase: "lower" | "upper" | "title" | "sentence"
  ) => {
    setTextCase(newCase);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setHistory([]);
    setHistoryIndex(-1);
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setInputText(clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setOutputText(history[historyIndex - 1]);
    }
  };

  const handleRemoveExtraSpaces = () => {
    const text = inputText.replace(/\s+/g, " ").trim();
    setInputText(text);
  };

  const handleRemoveEmptyLines = () => {
    const text = inputText
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");
    setInputText(text);
  };

  const handleAddLineNumbers = () => {
    const text = inputText
      .split("\n")
      .map((line, index) => `${index + 1}. ${line}`)
      .join("\n");
    setInputText(text);
  };

  const handleSortLines = () => {
    const text = inputText.split("\n").sort().join("\n");
    setInputText(text);
  };

  const handleReverseText = () => {
    const text = inputText.split("").reverse().join("");
    setInputText(text);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      <Helmet>
        <title>Text Formatter - Online Text Formatting Tools</title>
        <meta
          name="description"
          content="Format and transform text instantly with our comprehensive text formatting tools. Includes case conversion, whitespace cleaning, and advanced text manipulation features."
        />
        <meta
          name="keywords"
          content="text formatter, case converter, text manipulation, online text tools, whitespace cleaner, Text formatter online free, React text formatting tool, Online text cleaner, Capitalize text converter, Convert text to lowercase, Text case converter with React, Remove extra spaces from text, Clean text tool online, Format text with React app, Free online text editor, Paste text and format with React, Text formatter for writers, Remove line breaks online, Trim whitespace tool, Convert camelCase to snake_case React, Developer text formatting tool, Batch text formatting with React, Online string formatter, Text manipulation tool in React, Open source text formatter, React text formatter GitHub, React-based text utility, Text formatter NPM package, Real-time text formatter web app, Text cleanup tool online, Format JSON text online, URL encode decode tool with React, React text processor, Text transformation web app, text formatter, online text formatter, free text formatter, text formatting tool, text cleaner, text converter, format text online, case converter, text minifier, text prettifier, json formatter, sql formatter, text case changer, text manipulation tool, clean text online, code formatter, text reformatter, text optimization tool, paragraph formatter, remove extra whitespace, text capitalization tool, react text formatter, browser-based text tool, open source text formatter, textformatter github, free tool to format messy text, text cleaner for essays"
        />
        <meta
          property="og:title"
          content="Text Formatter - Online Text Formatting Tools"
        />
        <meta
          property="og:description"
          content="Format and transform text instantly with our comprehensive text formatting tools. Includes case conversion, whitespace cleaning, and advanced text manipulation features."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/text-formatter"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Text Formatter - Online Text Formatting Tools"
        />
        <meta
          name="twitter:description"
          content="Format and transform text instantly with our comprehensive text formatting tools. Includes case conversion, whitespace cleaning, and advanced text manipulation features."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/text-formatter"
        />
      </Helmet>

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
          sx={{ fontSize: "2.5rem" }}
        >
          Text Formatter
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          color="text.secondary"
          paragraph
          sx={{ fontSize: "1.25rem", fontWeight: 400 }}
        >
          Format and style your text with various options. Change case,
          alignment, and more.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="text-formatting-section"
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Text Case
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={textCase}
                  onChange={(_, value) => value && handleCaseChange(value)}
                  aria-label="text case options"
                >
                  <ToggleButton
                    value="lower"
                    aria-label="convert text to lowercase"
                  >
                    <CaseLower size={18} aria-hidden="true" />
                    <Typography sx={{ ml: 1 }}>lowercase</Typography>
                  </ToggleButton>
                  <ToggleButton
                    value="upper"
                    aria-label="convert text to uppercase"
                  >
                    <CaseUpper size={18} aria-hidden="true" />
                    <Typography sx={{ ml: 1 }}>UPPERCASE</Typography>
                  </ToggleButton>
                  <ToggleButton
                    value="title"
                    aria-label="convert text to title case"
                  >
                    <Type size={18} aria-hidden="true" />
                    <Typography sx={{ ml: 1 }}>Title Case</Typography>
                  </ToggleButton>
                  <ToggleButton
                    value="sentence"
                    aria-label="convert text to sentence case"
                  >
                    <Type size={18} aria-hidden="true" />
                    <Typography sx={{ ml: 1 }}>Sentence case</Typography>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Text Operations
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Tooltip title="Remove extra spaces">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleRemoveExtraSpaces}
                      disabled={!inputText}
                      startIcon={
                        <RemoveFormatting size={16} aria-hidden="true" />
                      }
                      aria-label="Remove extra spaces from text"
                    >
                      Remove Spaces
                    </Button>
                  </Tooltip>
                  <Tooltip title="Remove empty lines">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleRemoveEmptyLines}
                      disabled={!inputText}
                      startIcon={<Indent size={16} aria-hidden="true" />}
                      aria-label="Remove empty lines from text"
                    >
                      Remove Empty Lines
                    </Button>
                  </Tooltip>
                  <Tooltip title="Add line numbers">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddLineNumbers}
                      disabled={!inputText}
                      startIcon={<FileText size={16} aria-hidden="true" />}
                      aria-label="Add line numbers to text"
                    >
                      Add Line Numbers
                    </Button>
                  </Tooltip>
                  <Tooltip title="Sort lines alphabetically">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleSortLines}
                      disabled={!inputText}
                      startIcon={<AlignLeft size={16} aria-hidden="true" />}
                      aria-label="Sort lines alphabetically"
                    >
                      Sort Lines
                    </Button>
                  </Tooltip>
                  <Tooltip title="Reverse text">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleReverseText}
                      disabled={!inputText}
                      startIcon={<Undo size={16} aria-hidden="true" />}
                      aria-label="Reverse text order"
                    >
                      Reverse Text
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
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="h4"
                    >
                      Input Text
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Paste from clipboard">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<FileText size={16} aria-hidden="true" />}
                          onClick={handlePaste}
                          aria-label="Paste text from clipboard"
                        >
                          Paste
                        </Button>
                      </Tooltip>
                      <Tooltip title="Clear text">
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Trash2 size={16} aria-hidden="true" />}
                          onClick={handleClear}
                          disabled={!inputText}
                          aria-label="Clear input text"
                        >
                          Clear
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                  <TextField
                    multiline
                    fullWidth
                    rows={10}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                    }}
                    placeholder="Type or paste your text here..."
                    variant="outlined"
                    aria-label="Input text area for formatting"
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
                    Enter or paste the text you want to format
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
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="h4"
                    >
                      Formatted Text
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Undo last change">
                        <span>
                          <IconButton
                            size="small"
                            onClick={handleUndo}
                            disabled={historyIndex <= 0}
                            aria-label="Undo last formatting change"
                          >
                            <Undo size={16} aria-hidden="true" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={
                          copied ? (
                            <Check size={16} aria-hidden="true" />
                          ) : (
                            <Copy size={16} aria-hidden="true" />
                          )
                        }
                        onClick={handleCopy}
                        disabled={!outputText}
                        aria-label={
                          copied
                            ? "Text copied to clipboard"
                            : "Copy formatted text to clipboard"
                        }
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </Box>
                  </Box>
                  <TextField
                    multiline
                    fullWidth
                    rows={10}
                    value={outputText}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                    aria-label="Formatted text output"
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
                    Result of your text formatting
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
      <AdSense adSlot="6613251015" />
    </Container>
  );
};

export default TextFormatter;
