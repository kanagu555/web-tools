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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Languages,
  ArrowLeftRight,
  Copy,
  Check,
  Volume2,
  AlertCircle,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "nl", name: "Dutch" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
];

const TextTranslator = () => {
  const theme = useTheme();
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [copied, setCopied] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-translate when source text changes (with debounce)
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (
        sourceText &&
        sourceText.trim().length > 0 &&
        sourceLang !== targetLang
      ) {
        handleTranslate(true);
      }
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [sourceText, sourceLang, targetLang]);

  const handleTranslate = async (isAutoTranslate = false) => {
    if (!sourceText.trim()) return;
    if (sourceLang === targetLang) {
      setTranslatedText(sourceText);
      return;
    }

    if (!isAutoTranslate) {
      setIsTranslating(true);
    }
    setError(null);

    try {
      // Using LibreTranslate API (you can replace with any translation API)
      const response = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        body: JSON.stringify({
          q: sourceText,
          source: sourceLang,
          target: targetLang,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Translation failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (data.translatedText) {
        setTranslatedText(data.translatedText);
      } else {
        // Fallback for demo purposes if API fails
        setTranslatedText(
          `[Translation from ${sourceLang} to ${targetLang}]: ${sourceText}`
        );

        // Only show error for manual translation
        if (!isAutoTranslate) {
          setError(
            "Translation service is currently unavailable. Using fallback translation."
          );
          setOpenSnackbar(true);
        }
      }
    } catch (err) {
      console.error("Translation error:", err);

      // Fallback for demo purposes
      setTranslatedText(
        `[Translation from ${sourceLang} to ${targetLang}]: ${sourceText}`
      );

      // Only show error for manual translation
      if (!isAutoTranslate) {
        setError(
          "Translation service is currently unavailable. Using fallback translation."
        );
        setOpenSnackbar(true);
      }
    } finally {
      if (!isAutoTranslate) {
        setIsTranslating(false);
      }
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Start new speech
    window.speechSynthesis.speak(utterance);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const detectLanguage = async () => {
    if (!sourceText.trim()) return;

    try {
      // Using LibreTranslate API for language detection
      const response = await fetch("https://libretranslate.de/detect", {
        method: "POST",
        body: JSON.stringify({
          q: sourceText,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(
          `Language detection failed with status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data && data.length > 0 && data[0].language) {
        setSourceLang(data[0].language);
      }
    } catch (err) {
      console.error("Language detection error:", err);
      setError(
        "Language detection failed. Please select the language manually."
      );
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Online Text Translator - Multilingual Translation Tool</title>
        <meta
          name="description"
          content="Translate text between multiple languages instantly with our free online translator. Supports major world languages with accurate translations powered by modern translation APIs."
        />
        <meta
          name="keywords"
          content="text translator, language translation, multilingual tool, online translator, language converter, Online text translator free, React language translator tool, Translate text between languages, Free translation web app with React, Multilingual text translator online, Translate text instantly with React, React-based translation tool, Real-time text translator, Translate text without API key, Browser-based translation tool, Translate text offline with React, Open source text translator, React text translator GitHub, React language converter app, Translate text to Spanish French German Italian online, Best online text translator, Translate paragraphs sentences with React, Translate and format text with React, Language translator with dropdown selection, Translate text with copy paste feature, Translate text to 100 languages, AI-powered text translator React app, Machine translation tool with React, React translator with Google Translate alternative, React NLP text translator, Cross-language text converter, Text translator for students writers developers, online translator, free text translator, translate text online, language translator, real-time translation, multilingual translator, text translation tool, web-based translator, english to spanish translator, document translator, translate words online, quick text translator, secure text translator, browser translator, react translator app, javascript translation tool, open source translator, translate large text, translate clipboard text, instant translation tool, no signup translator, translation api demo, translator github, text translator with pronunciation, free translator that works without login"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Text Translator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Translate text between multiple languages instantly.
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>From</InputLabel>
                  <Select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    label="From"
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  onClick={handleSwapLanguages}
                  sx={{ minWidth: "auto", p: 1 }}
                >
                  <ArrowLeftRight size={20} />
                </Button>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>To</InputLabel>
                  <Select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    label="To"
                  >
                    {languages.map((lang) => (
                      <MenuItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  onClick={detectLanguage}
                  disabled={!sourceText.trim()}
                >
                  Detect Language
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  multiline
                  fullWidth
                  rows={8}
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Enter text to translate..."
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.default,
                    },
                  }}
                />
                <IconButton
                  onClick={() => handleSpeak(sourceText, sourceLang)}
                  disabled={!sourceText}
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <Volume2 size={20} />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative" }}>
                <TextField
                  multiline
                  fullWidth
                  rows={8}
                  value={translatedText}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    endAdornment: isTranslating && (
                      <CircularProgress
                        size={20}
                        sx={{ position: "absolute", right: 40, bottom: 20 }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.default,
                    },
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    right: 8,
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <IconButton
                    onClick={() => handleSpeak(translatedText, targetLang)}
                    disabled={!translatedText}
                    sx={{ backgroundColor: theme.palette.background.paper }}
                  >
                    <Volume2 size={20} />
                  </IconButton>
                  <IconButton
                    onClick={handleCopy}
                    disabled={!translatedText}
                    sx={{ backgroundColor: theme.palette.background.paper }}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </IconButton>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                startIcon={
                  isTranslating ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Languages />
                  )
                }
                onClick={() => handleTranslate()}
                disabled={
                  isTranslating || !sourceText || sourceLang === targetLang
                }
              >
                {isTranslating ? "Translating..." : "Translate"}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="warning"
            sx={{ width: "100%" }}
            icon={<AlertCircle size={24} />}
          >
            {error}
          </Alert>
        </Snackbar>
      </motion.div>
      <AdSense adSlot="6613251015" />
    </Container>
  );
};

export default TextTranslator;
