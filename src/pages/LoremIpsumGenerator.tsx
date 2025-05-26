import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  Snackbar,
  Alert,
  Divider,
  Tooltip,
  Slider,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw, Trash2, Download } from "lucide-react";
import AdSense from "../components/AdSense";

const LoremIpsumGenerator = () => {
  const theme = useTheme();
  const [type, setType] = useState<"paragraphs" | "words" | "sentences">(
    "paragraphs"
  );
  const [count, setCount] = useState<number>(3);
  const [output, setOutput] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [includeStartWithLorem, setIncludeStartWithLorem] = useState(true);
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [customWordInput, setCustomWordInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [customWordWeight, setCustomWordWeight] = useState<number>(3);
  const [useOnlyCustomWords, setUseOnlyCustomWords] = useState<boolean>(false);

  // Standard lorem ipsum words
  const standardWords = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "duis",
    "aute",
    "irure",
    "in",
    "reprehenderit",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "dolore",
    "eu",
    "fugiat",
    "nulla",
    "pariatur",
    "excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum",
  ];

  // Combined words (standard + custom)
  // Instead of just concatenating arrays, let's give custom words more weight
  const getWordPool = () => {
    if (useOnlyCustomWords) {
      // If using only custom words but none exist, show error
      if (customWords.length === 0) {
        return [];
      }
      return customWords;
    }

    // If no custom words, just use standard words
    if (customWords.length === 0) {
      return standardWords;
    }

    // Create an array with custom words repeated based on weight
    const weightedCustomWords = Array(customWordWeight)
      .fill(null)
      .flatMap(() => customWords);

    return [...standardWords, ...weightedCustomWords];
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generateSentence = () => {
    const wordPool = getWordPool();
    const length = Math.floor(Math.random() * 10) + 10; // 10-20 words
    const sentence = Array(length)
      .fill(null)
      .map(() => wordPool[Math.floor(Math.random() * wordPool.length)])
      .join(" ");

    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  };

  const generateParagraph = () => {
    const length = Math.floor(Math.random() * 3) + 3; // 3-5 sentences
    return Array(length)
      .fill(null)
      .map(() => generateSentence())
      .join(" ");
  };

  const generateText = () => {
    const wordPool = getWordPool();

    if (wordPool.length === 0) {
      setSnackbarMessage("No words available for generation");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    let result = "";

    switch (type) {
      case "words":
        result = Array(count)
          .fill(null)
          .map(() => wordPool[Math.floor(Math.random() * wordPool.length)])
          .join(" ");
        break;
      case "sentences":
        result = Array(count)
          .fill(null)
          .map(() => generateSentence())
          .join(" ");
        break;
      case "paragraphs":
        result = Array(count)
          .fill(null)
          .map(() => generateParagraph())
          .join("\n\n");
        break;
    }

    // If includeStartWithLorem is true and we're generating paragraphs or sentences,
    // make sure the text starts with "Lorem ipsum"
    if (
      includeStartWithLorem &&
      (type === "paragraphs" || type === "sentences") &&
      result.length > 10
    ) {
      result =
        "Lorem ipsum " + result.charAt(11).toLowerCase() + result.slice(12);
    }

    setOutput(result);
    setSnackbarMessage(`Generated ${count} ${type}`);
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
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
    setOutput("");
    setSnackbarMessage("Output cleared");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleAddCustomWord = () => {
    if (customWordInput.trim()) {
      const word = customWordInput.trim().toLowerCase();
      if (!customWords.includes(word)) {
        setCustomWords([...customWords, word]);
        setCustomWordInput("");
        setSnackbarMessage(`Added custom word: ${word}`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("Word already exists in the list");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    }
  };

  const handleRemoveCustomWord = (wordToRemove: string) => {
    setCustomWords(customWords.filter((word) => word !== wordToRemove));
    setSnackbarMessage(`Removed custom word: ${wordToRemove}`);
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleDownload = () => {
    if (!output) {
      setSnackbarMessage("No text to download");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      return;
    }

    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lorem-ipsum-${type}-${count}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSnackbarMessage("Text downloaded as file");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleClearCustomWords = () => {
    setCustomWords([]);
    setUseOnlyCustomWords(false);
    setSnackbarMessage("All custom words removed");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleImportCustomWords = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const words = text
        .toLowerCase()
        .split(/[\s,;.]+/)
        .filter((word) => word.trim().length > 0)
        .filter((word) => !customWords.includes(word));

      if (words.length > 0) {
        setCustomWords((prev) => [...prev, ...words]);
        setSnackbarMessage(`Imported ${words.length} custom words`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage("No new words found to import");
        setSnackbarSeverity("info");
        setSnackbarOpen(true);
      }
    };
    reader.readAsText(file);

    // Reset the input value so the same file can be selected again
    event.target.value = "";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Lorem Ipsum Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Generate Lorem Ipsum placeholder text for your designs and layouts.
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
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Generation Options
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value as typeof type)}
                    label="Type"
                  >
                    <MenuItem value="paragraphs">Paragraphs</MenuItem>
                    <MenuItem value="sentences">Sentences</MenuItem>
                    <MenuItem value="words">Words</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ width: 200 }}>
                  <Typography gutterBottom>Count: {count}</Typography>
                  <Slider
                    value={count}
                    onChange={(_, newValue) => setCount(newValue as number)}
                    min={1}
                    max={
                      type === "paragraphs"
                        ? 10
                        : type === "sentences"
                        ? 20
                        : 100
                    }
                    valueLabelDisplay="auto"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={includeStartWithLorem}
                      onChange={(e) =>
                        setIncludeStartWithLorem(e.target.checked)
                      }
                    />
                  }
                  label="Start with 'Lorem ipsum'"
                />

                <Button
                  variant="contained"
                  startIcon={<RefreshCw />}
                  onClick={generateText}
                >
                  Generate
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Custom Words
              </Typography>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  label="Add custom word"
                  value={customWordInput}
                  onChange={(e) => setCustomWordInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddCustomWord();
                    }
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddCustomWord}
                  disabled={!customWordInput.trim()}
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearCustomWords}
                  disabled={customWords.length === 0}
                  sx={{ ml: 1 }}
                >
                  Clear All
                </Button>
                <input
                  type="file"
                  accept=".txt"
                  id="import-words"
                  style={{ display: "none" }}
                  onChange={handleImportCustomWords}
                />
                <label htmlFor="import-words">
                  <Button variant="outlined" component="span" sx={{ ml: 1 }}>
                    Import Words
                  </Button>
                </label>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {customWords.length > 0 ? (
                  customWords.map((word, index) => (
                    <Chip
                      key={index}
                      label={word}
                      onDelete={() => handleRemoveCustomWord(word)}
                      color="primary"
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No custom words added. Default Lorem Ipsum words will be
                    used.
                  </Typography>
                )}
              </Box>
              <Box sx={{ width: 200, mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Custom Word Weight: {customWordWeight}x
                </Typography>
                <Slider
                  value={customWordWeight}
                  onChange={(_, newValue) =>
                    setCustomWordWeight(newValue as number)
                  }
                  min={1}
                  max={10}
                  marks
                  step={1}
                  valueLabelDisplay="auto"
                  aria-label="Custom word weight"
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={useOnlyCustomWords}
                    onChange={(e) => setUseOnlyCustomWords(e.target.checked)}
                    disabled={customWords.length === 0}
                  />
                }
                label="Use only custom words"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Generated Text
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Copy to clipboard">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={
                        copied ? <Check size={16} /> : <Copy size={16} />
                      }
                      onClick={handleCopy}
                      disabled={!output}
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Download as text file">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download size={16} />}
                      onClick={handleDownload}
                      disabled={!output}
                    >
                      Download
                    </Button>
                  </Tooltip>
                  <Tooltip title="Clear output">
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<Trash2 size={16} />}
                      onClick={handleClear}
                      disabled={!output}
                    >
                      Clear
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={12}
                value={output}
                variant="outlined"
                InputProps={{ readOnly: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              />
              <Box
                sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}
              >
                <Typography variant="body2" color="text.secondary">
                  {output
                    ? `${output.length} characters, ${
                        output.split(/\s+/).length
                      } words`
                    : "No text generated yet"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <AdSense adSlot="6613251015" />
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

export default LoremIpsumGenerator;
