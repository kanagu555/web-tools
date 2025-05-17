import React, { useState, useEffect } from "react";
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    { value: "lower", label: "lowercase", icon: <CaseLower size={18} /> },
    { value: "upper", label: "UPPERCASE", icon: <CaseUpper size={18} /> },
    { value: "title", label: "Title Case", icon: <Type size={18} /> },
    { value: "sentence", label: "Sentence case", icon: <Type size={18} /> },
    { value: "camel", label: "camelCase", icon: <Type size={18} /> },
    { value: "pascal", label: "PascalCase", icon: <Type size={18} /> },
    { value: "snake", label: "snake_case", icon: <Type size={18} /> },
    { value: "kebab", label: "kebab-case", icon: <Type size={18} /> },
    { value: "alternating", label: "aLtErNaTiNg", icon: <Type size={18} /> },
    { value: "inverse", label: "InVeRsE cAsE", icon: <Type size={18} /> },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Text Case Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert text between different cases: lowercase, UPPERCASE, Title
          Case, and more.
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
                      startIcon={<ClipboardPaste size={16} />}
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
                      startIcon={<Trash2 size={16} />}
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
                      startIcon={<ArrowLeftRight size={16} />}
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
                      startIcon={<RefreshCw size={16} />}
                    >
                      Random Case
                    </Button>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

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
                    <Typography variant="subtitle1" fontWeight={600}>
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
                    sx={{
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
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.default,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TextCaseConverter;
