"use client";

import React, { useState, useCallback, useEffect } from "react";
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
import { Copy, Check, RefreshCw, Trash2, Download, Upload } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import AdSense from "../AdSense";
import Navigation from "@/components/Navigation";

interface LoremIpsumGeneratorProps {
  onGenerate?: (text: string) => void;
}

const LoremIpsumGenerator: React.FC<LoremIpsumGeneratorProps> = ({
  onGenerate,
}) => {
  const theme = useTheme();
  const { trackTool, trackFile } = useAnalytics();

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    "at",
    "vero",
    "eos",
    "accusamus",
    "accusantium",
    "doloremque",
    "laudantium",
    "totam",
    "rem",
    "aperiam",
    "eaque",
    "ipsa",
    "quae",
    "ab",
    "illo",
    "inventore",
    "veritatis",
    "et",
    "quasi",
    "architecto",
    "beatae",
    "vitae",
    "dicta",
    "sunt",
    "explicabo",
    "nemo",
    "ipsam",
    "voluptatem",
    "quia",
    "voluptas",
    "aspernatur",
    "aut",
    "odit",
    "fugit",
    "sed",
    "quia",
    "consequuntur",
    "magni",
    "dolores",
    "ratione",
    "sequi",
    "nesciunt",
    "neque",
    "porro",
    "quisquam",
    "dolorem",
    "adipisci",
    "numquam",
    "eius",
    "modi",
    "tempora",
    "incidunt",
    "magnam",
    "quaerat",
    "voluptatem",
    "aliquam",
    "quaerat",
    "enim",
    "minima",
    "veniam",
  ];

  const getWordPool = useCallback(() => {
    if (useOnlyCustomWords) {
      if (customWords.length === 0) {
        return [];
      }
      return customWords;
    }

    if (customWords.length === 0) {
      return standardWords;
    }

    const weightedCustomWords = Array(customWordWeight)
      .fill(null)
      .flatMap(() => customWords);

    return [...standardWords, ...weightedCustomWords];
  }, [useOnlyCustomWords, customWords, customWordWeight]);

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  const generateSentence = useCallback(() => {
    const wordPool = getWordPool();
    if (wordPool.length === 0) return "";

    const length = Math.floor(Math.random() * 10) + 8; // 8-17 words
    const sentence = Array(length)
      .fill(null)
      .map(() => wordPool[Math.floor(Math.random() * wordPool.length)])
      .join(" ");

    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  }, [getWordPool]);

  const generateParagraph = useCallback(() => {
    const length = Math.floor(Math.random() * 4) + 3; // 3-6 sentences
    return Array(length)
      .fill(null)
      .map(() => generateSentence())
      .join(" ");
  }, [generateSentence]);

  const generateText = useCallback(() => {
    const wordPool = getWordPool();

    if (wordPool.length === 0) {
      showSnackbar(
        "No words available for generation. Please add custom words or enable standard words.",
        "error"
      );
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

    if (
      includeStartWithLorem &&
      (type === "paragraphs" || type === "sentences") &&
      result.length > 10 &&
      !useOnlyCustomWords
    ) {
      result =
        "Lorem ipsum " + result.charAt(11).toLowerCase() + result.slice(12);
    }

    setOutput(result);
    showSnackbar(`Generated ${count} ${type} successfully`);

    // Track analytics
    trackTool("lorem-ipsum-generator", "generate");

    // Call onGenerate callback if provided
    if (onGenerate) {
      onGenerate(result);
    }
  }, [
    type,
    count,
    includeStartWithLorem,
    useOnlyCustomWords,
    getWordPool,
    generateSentence,
    generateParagraph,
    showSnackbar,
    trackTool,
    onGenerate,
  ]);

  const handleCopy = useCallback(async () => {
    if (!output) {
      showSnackbar("No text to copy", "info");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSnackbar("Text copied to clipboard");
      trackTool("lorem-ipsum-generator", "copy");
    } catch (err) {
      showSnackbar(
        "Failed to copy text. Please select and copy manually.",
        "error"
      );
    }
  }, [output, showSnackbar, trackTool]);

  const handleClear = useCallback(() => {
    setOutput("");
    showSnackbar("Output cleared", "info");
    trackTool("lorem-ipsum-generator", "clear");
  }, [showSnackbar, trackTool]);

  const handleAddCustomWord = useCallback(() => {
    if (!customWordInput.trim()) {
      showSnackbar("Please enter a word", "info");
      return;
    }

    const word = customWordInput.trim().toLowerCase();
    if (word.length < 2) {
      showSnackbar("Word must be at least 2 characters long", "info");
      return;
    }

    if (!/^[a-zA-Z]+$/.test(word)) {
      showSnackbar("Word must contain only letters", "info");
      return;
    }

    if (customWords.includes(word)) {
      showSnackbar("Word already exists in the list", "info");
      return;
    }

    setCustomWords((prev) => [...prev, word]);
    setCustomWordInput("");
    showSnackbar(`Added custom word: ${word}`);
    trackTool("lorem-ipsum-generator", "add_custom_word");
  }, [customWordInput, customWords, showSnackbar, trackTool]);

  const handleRemoveCustomWord = useCallback(
    (wordToRemove: string) => {
      setCustomWords((prev) => prev.filter((word) => word !== wordToRemove));
      showSnackbar(`Removed custom word: ${wordToRemove}`, "info");
      trackTool("lorem-ipsum-generator", "remove_custom_word");
    },
    [showSnackbar, trackTool]
  );

  const handleDownload = useCallback(() => {
    if (!output) {
      showSnackbar("No text to download", "info");
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

    showSnackbar("Text downloaded successfully");
    trackFile("download", "txt", true);
  }, [output, type, count, showSnackbar, trackFile]);

  const handleClearCustomWords = useCallback(() => {
    setCustomWords([]);
    setUseOnlyCustomWords(false);
    showSnackbar("All custom words removed", "info");
    trackTool("lorem-ipsum-generator", "clear_custom_words");
  }, [showSnackbar, trackTool]);

  const handleImportCustomWords = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        showSnackbar(
          "File size too large. Please select a file smaller than 1MB.",
          "error"
        );
        return;
      }

      // Check file type
      if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
        showSnackbar("Please select a text file (.txt)", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const words = text
          .toLowerCase()
          .split(/[\s,;.\n\r]+/)
          .filter((word) => word.trim().length >= 2)
          .filter((word) => /^[a-zA-Z]+$/.test(word)) // Only letters
          .filter((word) => !customWords.includes(word));

        if (words.length > 0) {
          const uniqueWords = [...new Set(words)]; // Remove duplicates
          setCustomWords((prev) => [...prev, ...uniqueWords]);
          showSnackbar(`Imported ${uniqueWords.length} custom words`);
          trackFile("import", "txt", true);
        } else {
          showSnackbar("No new valid words found to import", "info");
        }
      };
      reader.onerror = () => {
        showSnackbar("Failed to read file", "error");
        trackFile("import", "txt", false);
      };
      reader.readAsText(file);
      event.target.value = "";
    },
    [customWords, showSnackbar, trackFile]
  );

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
          Lorem Ipsum Generator
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Generate customizable Lorem Ipsum placeholder text for your designs,
          mockups, and layouts.
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
            {/* Generation Options */}
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
                  mb: 2,
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
                  startIcon={<RefreshCw size={20} />}
                  onClick={generateText}
                  sx={{ ml: "auto" }}
                >
                  Generate
                </Button>
              </Box>
            </Grid>

            {/* Custom Words Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Custom Words
              </Typography>

              <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                <TextField
                  label="Add custom word"
                  value={customWordInput}
                  onChange={(e) => setCustomWordInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddCustomWord();
                    }
                  }}
                  sx={{ flexGrow: 1, minWidth: 200 }}
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
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload size={16} />}
                    sx={{ height: "100%" }}
                  >
                    Import
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
                    No custom words added. Add words above or import from a
                    file.
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ width: 200 }}>
                  <Typography variant="body2" gutterBottom>
                    Custom Word Frequency: {customWordWeight}x
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
              </Box>
            </Grid>

            {/* Generated Text Output */}
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
                minRows={10}
                maxRows={20}
                value={output}
                variant="outlined"
                InputProps={{ readOnly: true }}
                placeholder="Generated text will appear here. Click 'Generate' to create placeholder text."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                    fontSize: "1rem",
                    lineHeight: 1.6,
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

        {/* AdSense Ad */}
        <AdSense adSlot="8427161992" />

        {/* Information Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            About Lorem Ipsum & Placeholder Text
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                What is Lorem Ipsum?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Lorem Ipsum is a placeholder text commonly used in the printing
                and typesetting industry. It has been the industry's standard
                dummy text since the 1500s, when an unknown printer took a
                galley of type and scrambled it to make a type specimen book.
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The text is derived from sections 1.10.32 and 1.10.33 of "de
                Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by
                Cicero, written in 45 BC.
              </Typography>

              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, mt: 3, fontWeight: 600 }}
              >
                Why Use Placeholder Text?
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Focus on design without content distractions</li>
                <li>Test layouts with realistic text length</li>
                <li>Maintain client focus on visual elements</li>
                <li>Standard practice in web and print design</li>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                Generator Features
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Generate paragraphs, sentences, or individual words</li>
                <li>Customizable text length with easy sliders</li>
                <li>Add your own custom words to the generation pool</li>
                <li>Import word lists from text files</li>
                <li>Adjust frequency of custom words</li>
                <li>Option to start with classic "Lorem ipsum"</li>
                <li>Download generated text as files</li>
                <li>Copy to clipboard with one click</li>
              </Box>

              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, mt: 3, fontWeight: 600 }}
              >
                Use Cases
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Web design and development mockups</li>
                <li>Print design layouts and templates</li>
                <li>Content management system testing</li>
                <li>Typography and font testing</li>
                <li>User interface prototyping</li>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Snackbar for notifications */}
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
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoremIpsumGenerator;
