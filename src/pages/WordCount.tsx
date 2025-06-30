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
} from "@mui/material";
import { motion } from "framer-motion";
import { FileText, Type, Hash, Clock, Copy, Trash2, Check } from "lucide-react";
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

  const calculateStats = (text: string): TextStats => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;

    // Split by whitespace and filter out empty strings
    const wordArray = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    const words = wordArray.length;

    // Count unique words (case insensitive)
    const uniqueWordsSet = new Set(wordArray.map((word) => word.toLowerCase()));
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

    const lines = text ? text.split(/\n/).length : 0;

    // Average reading speed of 200 words per minute
    const readingTime = Math.max(1, Math.ceil(words / 200));

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
  };

  useEffect(() => {
    const newStats = calculateStats(text);
    setStats(newStats);
  }, [text]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText((prevText) => prevText + clipboardText);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

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
          content="word counter, character count, text analysis, online tool, writing statistics, Word count tool online free, React word counter app, Online word counter with React, Character count tool with React, Free word counter web app, How many words in text calculator, React-based word counter, Text analyzer with React, Online word count tool, Live word count website, Word counter for writers, Sentence counter online, Paragraph count tool, Reading time calculator React app, Word counter with stats React, Best online word counter, Word count without spaces, Word counter for essays, Word counter for SEO content, Word count Chrome extension with React, Open source React word counter, React word count GitHub, React word counter NPM package, Real-time word count React tool, Word count tracker for bloggers, Word count API with React, Word count web app development in React, word counter, character counter, online word counter, free word counter, word count tool, text analysis tool, character count online, sentence counter, paragraph counter, reading time calculator, keyword density analyzer, text statistics tool, word frequency counter, count words and characters online, check word count free, essay word counter, seo word counter, real-time word counter, document word count, writing tool word count, react word counter, javascript text analysis, browser-based word count, open source word counter, wordcount tool github"
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
          Word Count Tool
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          color="text.secondary"
          paragraph
          sx={{ fontSize: "1.25rem", fontWeight: 400 }}
        >
          Count words, characters, and analyze your text in real-time.
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
                }}
              >
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
                rows={12}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                variant="outlined"
                aria-label="Text input for word counting"
                inputProps={{
                  "aria-describedby": "text-input-description",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}
              />
              <Typography
                id="text-input-description"
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Your text will be analyzed in real-time as you type
              </Typography>
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
                <Grid item xs={6} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      height: "100%",
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                      },
                    }}
                    aria-label={stat.ariaLabel}
                  >
                    <Box sx={{ color: theme.palette.primary.main, mb: 1 }}>
                      {stat.icon}
                    </Box>
                    <Typography variant="h4" component="div" fontWeight={700}>
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
      </motion.div>
      {isProductionEnv && <AdSense adSlot="6613251015" />}
    </Container>
  );
};

export default WordCount;
