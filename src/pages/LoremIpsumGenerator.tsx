import React, { useState, useEffect, useCallback } from "react";
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
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  FileText,
  Settings,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import Breadcrumb from "../components/Breadcrumb";
import SEOHelmet from "../components/SEOHelmet";
import {
  generateToolSEO,
  generateWebAppData,
  generateHowToData,
  generateBreadcrumbData,
  generateFAQData,
} from "../Utils/seoUtils";

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
  const isProductionEnv = import.meta.env.PROD;

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Text Tools", url: "/category/text" },
    { name: "Lorem Ipsum Generator" },
  ];

  // Generate SEO data using seoUtils
  const seoData = generateToolSEO(
    "Lorem Ipsum Generator",
    "Generate customizable placeholder text for web design, mockups, and layouts. Create lorem ipsum text with custom words, adjustable length, and various formatting options",
    "text"
  );

  // Generate structured data
  const webAppData = generateWebAppData(
    "Lorem Ipsum Generator",
    "Generate customizable placeholder text for web design, mockups, and layouts. Create lorem ipsum text with custom words, adjustable length, and various formatting options",
    "text"
  );

  const howToSteps = [
    {
      name: "Choose Type",
      text: "Select whether you want to generate paragraphs, sentences, or individual words",
    },
    {
      name: "Set Count",
      text: "Use the slider to set how many paragraphs, sentences, or words you want to generate",
    },
    {
      name: "Add Custom Words",
      text: "Optionally add your own custom words to personalize the generated text",
    },
    {
      name: "Generate Text",
      text: "Click the Generate button to create your placeholder text and copy or download the result",
    },
  ];

  const howToData = generateHowToData("Lorem Ipsum Generator", howToSteps);

  // Generate breadcrumb structured data
  const breadcrumbData = generateBreadcrumbData([
    { name: "Home", url: "https://kodekit.in" },
    { name: "Text Tools", url: "https://kodekit.in/category/text" },
    {
      name: "Lorem Ipsum Generator",
      url: "https://kodekit.in/tools/lorem-ipsum-generator",
    },
  ]);

  // Generate FAQ structured data
  const faqData = generateFAQData([
    {
      question: "What is Lorem Ipsum text?",
      answer:
        "Lorem Ipsum is placeholder text commonly used in the printing and typesetting industry since the 1500s. It's derived from a work by Cicero and helps designers focus on layout without being distracted by readable content.",
    },
    {
      question: "Can I add my own custom words?",
      answer:
        "Yes! You can add custom words individually or import them from a text file. You can also adjust how frequently your custom words appear in the generated text and even use only custom words.",
    },
    {
      question:
        "What's the difference between paragraphs, sentences, and words?",
      answer:
        "Paragraphs generate full blocks of text with multiple sentences. Sentences create individual sentences with proper punctuation. Words generate a specified number of individual words separated by spaces.",
    },
    {
      question: "Can I download the generated text?",
      answer:
        "Absolutely! You can download the generated text as a .txt file with a descriptive filename that includes the type and count of text generated.",
    },
    {
      question: "How do I import custom words from a file?",
      answer:
        "Click the 'Import Words' button and select a .txt file containing your custom words. The words should be separated by spaces, commas, or line breaks. Only valid alphabetic words will be imported.",
    },
  ]);

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

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" = "success") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

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
  }, [
    type,
    count,
    includeStartWithLorem,
    useOnlyCustomWords,
    getWordPool,
    generateSentence,
    generateParagraph,
    showSnackbar,
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
    } catch (err) {
      showSnackbar(
        "Failed to copy text. Please select and copy manually.",
        "error"
      );
    }
  }, [output, showSnackbar]);

  const handleClear = useCallback(() => {
    setOutput("");
    showSnackbar("Output cleared", "info");
  }, [showSnackbar]);

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

    if (customWords.includes(word)) {
      showSnackbar("Word already exists in the list", "info");
      return;
    }

    setCustomWords((prev) => [...prev, word]);
    setCustomWordInput("");
    showSnackbar(`Added custom word: ${word}`);
  }, [customWordInput, customWords, showSnackbar]);

  const handleRemoveCustomWord = useCallback(
    (wordToRemove: string) => {
      setCustomWords((prev) => prev.filter((word) => word !== wordToRemove));
      showSnackbar(`Removed custom word: ${wordToRemove}`, "info");
    },
    [showSnackbar]
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
  }, [output, type, count, showSnackbar]);

  const handleClearCustomWords = useCallback(() => {
    setCustomWords([]);
    setUseOnlyCustomWords(false);
    showSnackbar("All custom words removed", "info");
  }, [showSnackbar]);

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
        } else {
          showSnackbar("No new valid words found to import", "info");
        }
      };
      reader.onerror = () => {
        showSnackbar("Failed to read file", "error");
      };
      reader.readAsText(file);
      event.target.value = "";
    },
    [customWords, showSnackbar]
  );

  const handleExportCustomWords = useCallback(() => {
    if (customWords.length === 0) {
      showSnackbar("No custom words to export", "info");
      return;
    }

    const blob = new Blob([customWords.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `custom-words-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSnackbar("Custom words exported successfully");
  }, [customWords, showSnackbar]);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      <SEOHelmet
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        type={seoData.type}
        canonical="https://kodekit.in/tools/lorem-ipsum-generator"
      />

      <Helmet>
        {/* Additional structured data */}
        <script type="application/ld+json">{JSON.stringify(webAppData)}</script>
        <script type="application/ld+json">{JSON.stringify(howToData)}</script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
        <script type="application/ld+json">{JSON.stringify(faqData)}</script>
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

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
          Lorem Ipsum Generator
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          color="text.secondary"
          paragraph
          sx={{ fontSize: "1.25rem", fontWeight: 400 }}
        >
          Generate customizable Lorem Ipsum placeholder text for your designs,
          mockups, and layouts. Perfect for web designers, developers, and
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
          aria-labelledby="generator-section"
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
                  <InputLabel id="type-select-label">Type</InputLabel>
                  <Select
                    value={type}
                    onChange={(e) => setType(e.target.value as typeof type)}
                    label="Type"
                    labelId="type-select-label"
                    aria-label="Select generation type"
                  >
                    <MenuItem value="paragraphs">Paragraphs</MenuItem>
                    <MenuItem value="sentences">Sentences</MenuItem>
                    <MenuItem value="words">Words</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ width: 200 }}>
                  <Typography gutterBottom id="count-slider-label">
                    Count: {count}
                  </Typography>
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
                    aria-labelledby="count-slider-label"
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={includeStartWithLorem}
                      onChange={(e) =>
                        setIncludeStartWithLorem(e.target.checked)
                      }
                      aria-label="Start with Lorem ipsum"
                    />
                  }
                  label="Start with 'Lorem ipsum'"
                />

                <Button
                  variant="contained"
                  startIcon={<RefreshCw aria-hidden="true" />}
                  onClick={generateText}
                  aria-label="Generate placeholder text"
                >
                  Generate
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} aria-hidden="true" />
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
                  aria-label="Add custom word input"
                />
                <Button
                  variant="outlined"
                  onClick={handleAddCustomWord}
                  disabled={!customWordInput.trim()}
                  aria-label="Add custom word"
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearCustomWords}
                  disabled={customWords.length === 0}
                  sx={{ ml: 1 }}
                  aria-label="Clear all custom words"
                >
                  Clear All
                </Button>
                <input
                  type="file"
                  accept=".txt"
                  id="import-words"
                  style={{ display: "none" }}
                  onChange={handleImportCustomWords}
                  aria-label="Import words from file"
                />
                <label htmlFor="import-words">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{ ml: 1 }}
                    aria-label="Import words from file"
                  >
                    Import Words
                  </Button>
                </label>
              </Box>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
                role="list"
                aria-label="Custom words list"
              >
                {customWords.length > 0 ? (
                  customWords.map((word, index) => (
                    <Chip
                      key={index}
                      label={word}
                      onDelete={() => handleRemoveCustomWord(word)}
                      color="primary"
                      variant="outlined"
                      aria-label={`Remove custom word ${word}`}
                      role="listitem"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No custom words added. Add words above or import from a file
                    to customize your generated text.
                  </Typography>
                )}
              </Box>
              <Box sx={{ width: 200, mt: 2 }}>
                <Typography
                  variant="body2"
                  gutterBottom
                  id="weight-slider-label"
                >
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
                  aria-labelledby="weight-slider-label"
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={useOnlyCustomWords}
                    onChange={(e) => setUseOnlyCustomWords(e.target.checked)}
                    disabled={customWords.length === 0}
                    aria-label="custom-only-description"
                  />
                }
                label="Use only custom words"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} aria-hidden="true" />
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
                        copied ? (
                          <Check size={16} aria-hidden="true" />
                        ) : (
                          <Copy size={16} aria-hidden="true" />
                        )
                      }
                      onClick={handleCopy}
                      disabled={!output}
                      aria-label={
                        copied ? "Text copied" : "Copy text to clipboard"
                      }
                    >
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Download as text file">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Download size={16} aria-hidden="true" />}
                      onClick={handleDownload}
                      disabled={!output}
                      aria-label="Download generated text"
                    >
                      Download
                    </Button>
                  </Tooltip>
                  <Tooltip title="Clear output">
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      startIcon={<Trash2 size={16} aria-hidden="true" />}
                      onClick={handleClear}
                      disabled={!output}
                      aria-label="Clear generated text"
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
                aria-label="Generated placeholder text output"
                inputProps={{
                  "aria-describedby": "output-description",
                }}
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
          {isProductionEnv && (
            <AdSense adSlot="6613251015" aria-label="Advertisement" />
          )}
        </Paper>

        {/* Lorem Ipsum Guide for SEO */}
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
          aria-labelledby="lorem-ipsum-guide"
        >
          <Typography
            id="lorem-ipsum-guide"
            variant="h2"
            component="h2"
            gutterBottom
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            About Lorem Ipsum & Placeholder Text
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 2, fontWeight: 600 }}
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
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 1, mt: 3, fontWeight: 600 }}
              >
                Why Use Placeholder Text?
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>Focus on design without content distractions</li>
                  <li>Test layouts with realistic text length</li>
                  <li>Maintain client focus on visual elements</li>
                  <li>Standard practice in web and print design</li>
                </ul>
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 2, fontWeight: 600 }}
              >
                Generator Features
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>Generate paragraphs, sentences, or individual words</li>
                  <li>Customizable text length with easy sliders</li>
                  <li>Add your own custom words to the generation pool</li>
                  <li>Import word lists from text files</li>
                  <li>Adjust frequency of custom words</li>
                  <li>Option to start with classic "Lorem ipsum"</li>
                  <li>Download generated text as files</li>
                  <li>Copy to clipboard with one click</li>
                </ul>
              </Typography>

              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 1, mt: 3, fontWeight: 600 }}
              >
                Perfect For
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="div"
              >
                <ul style={{ paddingLeft: "1.2rem", margin: 0 }}>
                  <li>Web designers creating mockups</li>
                  <li>Graphic designers laying out publications</li>
                  <li>Developers testing responsive designs</li>
                  <li>Content creators planning layouts</li>
                  <li>Students learning design principles</li>
                </ul>
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h3"
            component="h3"
            sx={{ fontSize: "1.1rem", mb: 2, fontWeight: 600 }}
          >
            Custom Words Feature
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Our generator allows you to add custom words to create more relevant
            placeholder text for your specific project. This is especially
            useful when working on industry-specific designs or when you want
            the placeholder text to reflect the actual content domain. You can
            control how frequently your custom words appear and even generate
            text using only your custom vocabulary.
          </Typography>
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
                  What is Lorem Ipsum text?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem Ipsum is placeholder text commonly used in the printing
                  and typesetting industry since the 1500s. It's derived from a
                  work by Cicero and helps designers focus on layout without
                  being distracted by readable content.
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  Can I add my own custom words?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes! You can add custom words individually or import them from
                  a text file. You can also adjust how frequently your custom
                  words appear in the generated text and even use only custom
                  words.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  What's the difference between paragraphs, sentences, and
                  words?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paragraphs generate full blocks of text with multiple
                  sentences. Sentences create individual sentences with proper
                  punctuation. Words generate a specified number of individual
                  words separated by spaces.
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
                  Can I download the generated text?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absolutely! You can download the generated text as a .txt file
                  with a descriptive filename that includes the type and count
                  of text generated.
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
                >
                  How do I import custom words from a file?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click the 'Import Words' button and select a .txt file
                  containing your custom words. The words should be separated by
                  spaces, commas, or line breaks. Only valid alphabetic words
                  will be imported.
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
    </Container>
  );
};

export default LoremIpsumGenerator;
