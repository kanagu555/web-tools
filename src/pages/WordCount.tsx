import { useState, useEffect, useCallback } from "react";
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
  Alert,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  FileText,
  Type,
  Hash,
  Clock,
  Copy,
  Trash2,
  Check,
  Upload,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

interface TextStats {
  characters: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  charactersNoSpaces: number;
  lines: number;
  longestWord: string;
  uniqueWords: number;
}

const WordCount = () => {
  const theme = useTheme();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    charactersNoSpaces: 0,
    lines: 0,
    longestWord: "",
    uniqueWords: 0,
  });
  const isProductionEnv = import.meta.env.PROD;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculateStats = useCallback((text: string): TextStats => {
    if (!text) {
      return {
        characters: 0,
        words: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        charactersNoSpaces: 0,
        lines: 0,
        longestWord: "",
        uniqueWords: 0,
      };
    }

    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    // Split by whitespace and filter out empty strings
    const wordArray = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const words = wordArray.length;

    // Count unique words (case insensitive)
    const uniqueWordsSet = new Set(
      wordArray.map((word) => word.toLowerCase().replace(/[^\w]/g, ""))
    );
    const uniqueWords = uniqueWordsSet.size;

    // Find longest word
    let longestWord = "";
    wordArray.forEach((word) => {
      // Remove punctuation for word length comparison
      const cleanWord = word.replace(/[^\w\s]/gi, "");
      if (cleanWord.length > longestWord.length) {
        longestWord = word;
      }
    });

    const sentences = text
      .split(/[.!?]+/)
      .filter((sentence) => sentence.trim().length > 0).length;

    const paragraphs = text
      .split(/\n\n+/)
      .filter((para) => para.trim().length > 0).length;

    const lines = text.split(/\n/).length;

    // Average reading speed of 200 words per minute
    const readingTime = words > 0 ? Math.max(1, Math.ceil(words / 200)) : 0;

    return {
      characters,
      words,
      sentences,
      paragraphs,
      readingTime,
      charactersNoSpaces,
      lines,
      longestWord,
      uniqueWords,
    };
  }, []);

  useEffect(() => {
    const newStats = calculateStats(text);
    setStats(newStats);
  }, [text]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError("Failed to copy text to clipboard");
      console.error("Failed to copy text:", err);
    }
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
    setError(null);
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText((prevText) => prevText + clipboardText);
      setError(null);
    } catch (err) {
      setError("Failed to read from clipboard. Please paste manually.");
      console.error("Failed to read clipboard:", err);
    }
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        setError("File size too large. Please select a file smaller than 1MB.");
        return;
      }

      // Check file type
      if (!file.type.startsWith("text/") && !file.name.endsWith(".txt")) {
        setError("Please select a text file (.txt)");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
        setError(null);
      };
      reader.onerror = () => {
        setError("Failed to read file");
      };
      reader.readAsText(file);
    },
    []
  );

  const statCards = [
    {
      icon: <Type size={24} aria-hidden="true" />,
      label: "Words",
      value: stats.words,
      ariaLabel: `Total words: ${stats.words}`,
    },
    {
      icon: <FileText size={24} aria-hidden="true" />,
      label: "Characters",
      value: stats.characters,
      ariaLabel: `Total characters including spaces: ${stats.characters}`,
    },
    {
      icon: <Hash size={24} aria-hidden="true" />,
      label: "Sentences",
      value: stats.sentences,
      ariaLabel: `Total sentences: ${stats.sentences}`,
    },
    {
      icon: <Clock size={24} aria-hidden="true" />,
      label: "Reading Time",
      value: `${stats.readingTime} min`,
      ariaLabel: `Estimated reading time: ${stats.readingTime} minutes`,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      <Helmet>
        <title>Word & Character Counter - Online Text Analysis Tool</title>
        <meta
          name="description"
          content="Analyze text instantly with our free word and character counter. Get detailed statistics including sentence count, paragraph count, and reading time estimation."
        />
        <meta
          name="keywords"
          content="word counter, character counter, text analysis, online word count tool, free word counter, sentence counter, paragraph counter, reading time calculator, writing statistics, essay word counter, SEO content analyzer, real-time text analysis, document word count, text statistics tool"
        />
        <meta
          property="og:title"
          content="Word & Character Counter - Online Text Analysis Tool"
        />
        <meta
          property="og:description"
          content="Analyze text instantly with our free word and character counter. Get detailed statistics including sentence count, paragraph count, and reading time estimation."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/word-count"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Word & Character Counter - Online Text Analysis Tool"
        />
        <meta
          name="twitter:description"
          content="Analyze text instantly with our free word and character counter. Get detailed statistics including sentence count, paragraph count, and reading time estimation."
        />
        <link rel="canonical" href="https://www.kodekit.in/tools/word-count" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Word & Character Counter",
            description:
              "Free online tool to count words, characters, sentences, and paragraphs in your text with real-time analysis and reading time estimation.",
            url: "https://www.kodekit.in/tools/word-count",
            applicationCategory: "UtilityApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            featureList: [
              "Real-time word counting",
              "Character counting with and without spaces",
              "Sentence and paragraph counting",
              "Reading time estimation",
              "Text statistics analysis",
              "Copy and paste functionality",
            ],
          })}
        </script>
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
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Word Count Tool
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
          Count words, characters, and analyze your text in real-time. Perfect
          for writers, students, and content creators.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="text-input-section"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 2,
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
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
                    size="small"
                    startIcon={<FileText size={16} aria-hidden="true" />}
                    onClick={handlePaste}
                    aria-label="Paste text from clipboard"
                  >
                    Paste
                  </Button>
                </Tooltip>
                <Tooltip title="Copy text">
                  <Button
                    size="small"
                    startIcon={
                      copied ? (
                        <Check size={16} aria-hidden="true" />
                      ) : (
                        <Copy size={16} aria-hidden="true" />
                      )
                    }
                    onClick={handleCopy}
                    disabled={!text}
                    aria-label={
                      copied
                        ? "Text copied to clipboard"
                        : "Copy text to clipboard"
                    }
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </Tooltip>
                <Tooltip title="Clear text">
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Trash2 size={16} aria-hidden="true" />}
                    onClick={handleClear}
                    disabled={!text}
                    aria-label="Clear text input"
                  >
                    Clear
                  </Button>
                </Tooltip>
              </Box>

              <TextField
                multiline
                fullWidth
                minRows={8}
                maxRows={20}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type, paste, or upload your text here to get instant word count and text analysis..."
                variant="outlined"
                aria-label="Text input for word counting and analysis"
                inputProps={{
                  "aria-describedby": "text-input-description",
                  maxLength: 100000, // Reasonable limit
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
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Typography
                  id="text-input-description"
                  variant="caption"
                  color="text.secondary"
                >
                  Real-time analysis • Max 100,000 characters
                </Typography>
                <Typography
                  variant="caption"
                  color={text.length > 90000 ? "error" : "text.secondary"}
                >
                  {text.length.toLocaleString()} / 100,000
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Grid
              container
              spacing={2}
              component="section"
              aria-labelledby="quick-stats-section"
            >
              {statCards.map((stat, index) => (
                <Grid item xs={6} key={stat.label}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: theme.shadows[4],
                      },
                      "&:focus-within": {
                        outline: `2px solid ${theme.palette.primary.main}`,
                        outlineOffset: "2px",
                      },
                    }}
                    tabIndex={0}
                    role="region"
                    aria-label={stat.ariaLabel}
                  >
                    <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography
                      variant="h4"
                      component="div"
                      fontWeight={700}
                      sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                mt: 2,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="detailed-stats-section"
            >
              <Typography
                id="detailed-stats-section"
                variant="h3"
                component="h3"
                gutterBottom
                sx={{ fontSize: "1.25rem" }}
              >
                Additional Statistics
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                aria-label={`Paragraphs: ${stats.paragraphs}`}
              >
                <Typography variant="body2" color="text.secondary">
                  Paragraphs
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {stats.paragraphs}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                aria-label={`Characters without spaces: ${stats.charactersNoSpaces}`}
              >
                <Typography variant="body2" color="text.secondary">
                  Characters (no spaces)
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {stats.charactersNoSpaces}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                aria-label={`Characters with spaces: ${stats.characters}`}
              >
                <Typography variant="body2" color="text.secondary">
                  Characters (with spaces)
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {stats.characters}
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} aria-hidden="true" />

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                aria-label={`Lines: ${stats.lines}`}
              >
                <Typography variant="body2" color="text.secondary">
                  Lines
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {stats.lines}
                </Typography>
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                aria-label={`Unique words: ${stats.uniqueWords}`}
              >
                <Typography variant="body2" color="text.secondary">
                  Unique Words
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {stats.uniqueWords}
                </Typography>
              </Box>

              {stats.longestWord && (
                <Box
                  sx={{ display: "flex", justifyContent: "space-between" }}
                  aria-label={`Longest word: ${stats.longestWord}`}
                >
                  <Typography variant="body2" color="text.secondary">
                    Longest Word
                  </Typography>
                  <Tooltip title={stats.longestWord}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {stats.longestWord}
                    </Typography>
                  </Tooltip>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* How to use section for SEO */}
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
          aria-labelledby="how-to-use"
        >
          <Typography
            id="how-to-use"
            variant="h2"
            component="h2"
            gutterBottom
            sx={{ fontSize: "1.5rem", mb: 3 }}
          >
            How to Use the Word Counter Tool
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 1, fontWeight: 600 }}
              >
                Getting Started
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Simply type or paste your text into the text area above. The
                word count and other statistics will update automatically as you
                type.
              </Typography>

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
                  <li>Real-time word and character counting</li>
                  <li>Sentence and paragraph analysis</li>
                  <li>Reading time estimation</li>
                  <li>Text file upload support</li>
                  <li>Copy and paste functionality</li>
                </ul>
              </Typography>
            </Grid>

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
                  <li>Students writing essays and assignments</li>
                  <li>Content creators and bloggers</li>
                  <li>Social media managers</li>
                  <li>SEO professionals</li>
                  <li>Writers and editors</li>
                </ul>
              </Typography>

              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.1rem", mb: 1, mt: 2, fontWeight: 600 }}
              >
                Privacy & Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your text is processed entirely in your browser. Nothing is sent
                to our servers, ensuring complete privacy and security of your
                content.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Error handling */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      {isProductionEnv && <AdSense adSlot="6613251015" />}
    </Container>
  );
};

export default WordCount;
