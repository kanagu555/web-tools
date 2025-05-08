"use client"

import { useState, useEffect } from "react"
import {
  Paper,
  Box,
  Grid,
  Typography,
  TextField,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  useTheme,
  SelectChangeEvent,
  Alert,
  Snackbar,
  Divider,
} from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import DeleteIcon from "@mui/icons-material/Delete"
import SwapHorizIcon from "@mui/icons-material/SwapHoriz"
import TranslateIcon from "@mui/icons-material/Translate"
import SecurityIcon from "@mui/icons-material/Security"
import DevicesIcon from "@mui/icons-material/Devices"

// Language options
interface Language {
  code: string
  name: string
}

// Common languages for MyMemory API
const LANGUAGES: Language[] = [
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
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "cs", name: "Czech" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
]

export function TextTranslator() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [languages, setLanguages] = useState<Language[]>(LANGUAGES)
  const [isLoading, setIsLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const theme = useTheme()

  const handleSourceLanguageChange = (event: SelectChangeEvent) => {
    setSourceLanguage(event.target.value)
  }

  const handleTargetLanguageChange = (event: SelectChangeEvent) => {
    setTargetLanguage(event.target.value)
  }

  const handleSourceTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSourceText(e.target.value)
  }

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  const handleTranslate = async () => {
    if (!sourceText.trim()) return

    setIsTranslating(true)
    setError(null)

    try {
      // Using MyMemory Translation API (free tier)
      // Docs: https://mymemory.translated.net/doc/spec.php
      const encodedText = encodeURIComponent(sourceText)
      const langPair = `${sourceLanguage}|${targetLanguage}`
      
      const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${langPair}&de=your@email.com`
      
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Translation service error")
      }

      const data = await response.json()
      
      if (data.responseStatus === 200) {
        setTranslatedText(data.responseData.translatedText)
      } else {
        throw new Error(data.responseDetails || "Translation failed")
      }
    } catch (err: any) {
      console.error("Translation error:", err)
      setError(err.message || "Translation failed. Please try again later.")
    } finally {
      setIsTranslating(false)
    }
  }

  const handleClear = () => {
    setSourceText("")
    setTranslatedText("")
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setSnackbarOpen(true)
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="source-language-label">Source Language</InputLabel>
              <Select
                labelId="source-language-label"
                id="source-language"
                value={sourceLanguage}
                label="Source Language"
                onChange={handleSourceLanguageChange}
                sx={{ width: '100%' }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2} sx={{ textAlign: "center" }}>
            <IconButton 
              onClick={handleSwapLanguages} 
              aria-label="Swap languages"
              sx={{ 
                bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                "&:hover": {
                  bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                }
              }}
            >
              <SwapHorizIcon />
            </IconButton>
          </Grid>

          <Grid item xs={12} sm={5}>
            <FormControl fullWidth size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="target-language-label">Target Language</InputLabel>
              <Select
                labelId="target-language-label"
                id="target-language"
                value={targetLanguage}
                label="Target Language"
                onChange={handleTargetLanguageChange}
                sx={{ width: '100%' }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ 
        display: "flex", 
        gap: 2,
        flexDirection: { xs: "column", md: "row" }
      }}>
        <Box sx={{ 
          position: "relative", 
          flex: 1,
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
          borderRadius: 1,
          overflow: "hidden"
        }}>
          <TextField
            fullWidth
            multiline
            minRows={10}
            maxRows={20}
            placeholder="Type or paste text to translate..."
            value={sourceText}
            onChange={handleSourceTextChange}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiInputBase-root': {
                borderRadius: 0,
              }
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
              size="small"
              onClick={() => handleCopy(sourceText)}
              disabled={!sourceText}
              title="Copy to clipboard"
              aria-label="Copy source text to clipboard"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleClear}
              disabled={!sourceText && !translatedText}
              title="Clear text"
              aria-label="Clear all text"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ 
          position: "relative", 
          flex: 1,
          border: "1px solid",
          borderColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 0, 0.23)",
          borderRadius: 1,
          overflow: "hidden"
        }}>
          <TextField
            fullWidth
            multiline
            minRows={10}
            maxRows={20}
            placeholder="Translation will appear here..."
            value={translatedText}
            variant="outlined"
            InputProps={{ readOnly: true }}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& .MuiInputBase-root': {
                borderRadius: 0,
              }
            }}
          />
          <Box sx={{ position: "absolute", bottom: 8, right: 8 }}>
            <IconButton
              size="small"
              onClick={() => handleCopy(translatedText)}
              disabled={!translatedText}
              title="Copy to clipboard"
              aria-label="Copy translated text to clipboard"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={isTranslating ? <CircularProgress size={20} color="inherit" /> : <TranslateIcon />}
          onClick={handleTranslate}
          disabled={!sourceText || isTranslating}
          sx={{ minWidth: 150 }}
        >
          {isTranslating ? "Translating..." : "Translate"}
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Text Translator Features
      </Typography>
      
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
            <TranslateIcon color="primary" sx={{ mr: 1, mt: 0.3 }} fontSize="small" />
            <Typography variant="body2">
              Translate between 25+ languages instantly
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
            <SwapHorizIcon color="primary" sx={{ mr: 1, mt: 0.3 }} fontSize="small" />
            <Typography variant="body2">
              Easily swap between source and target languages
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
            <ContentCopyIcon color="primary" sx={{ mr: 1, mt: 0.3 }} fontSize="small" />
            <Typography variant="body2">
              Copy translated text with a single click
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
            <DeleteIcon color="primary" sx={{ mr: 1, mt: 0.3 }} fontSize="small" />
            <Typography variant="body2">
              Clear text fields with one button
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
            <SecurityIcon color="primary" sx={{ mr: 1, mt: 0.3 }} fontSize="small" />
            <Typography variant="body2">
              Secure translation using industry-standard APIs
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
            <DevicesIcon color="primary" sx={{ mr: 1, mt: 0.3 }} fontSize="small" />
            <Typography variant="body2">
              Responsive design works on all devices
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message="Copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Paper>
  )
}



