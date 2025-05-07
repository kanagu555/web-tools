"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";

// English dictionary - common words
const dictionary = new Set([
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with",
  "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
  "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him",
  "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than",
  "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two",
  "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give",
  "day", "most", "us", "is", "am", "are", "was", "were", "been", "has", "had", "did", "done", "does",
  "doing", "said", "says", "saying", "went", "gone", "going", "made", "making", "took", "taken", "taking",
  "saw", "seen", "seeing", "came", "come", "coming", "got", "gotten", "getting", "put", "putting", "found",
  "finding", "gave", "given", "giving", "left", "leaving", "told", "telling", "felt", "feeling", "thought",
  "thinking", "ran", "running", "called", "calling", "tried", "trying", "asked", "asking", "seemed", "seeming",
  "showed", "showing", "continued", "continuing", "began", "begun", "beginning", "started", "starting", "needed",
  "needing", "appeared", "appearing", "meant", "meaning", "kept", "keeping", "let", "letting", "heard", "hearing",
  "met", "meeting", "set", "setting", "followed", "following", "stopped", "stopping", "created", "creating",
  "opened", "opening", "walked", "walking", "offered", "offering", "remembered", "remembering", "considered",
  "considering", "appeared", "appearing", "bought", "buying", "served", "serving", "died", "dying", "sent",
  "sending", "built", "building", "understood", "understanding", "cut", "cutting", "read", "reading",
  // Add more common words as needed
]);

// Add programming and tech terms
const techTerms = [
  "javascript", "typescript", "react", "angular", "vue", "node", "express", "mongodb", "mysql",
  "postgresql", "html", "css", "api", "rest", "json", "xml", "http", "https", "web", "app",
  "frontend", "backend", "fullstack", "database", "server", "client", "cloud", "aws", "azure",
  "google", "function", "variable", "class", "object", "method", "interface", "component", "props",
  "state", "hook", "effect", "context", "redux", "store", "action", "reducer", "middleware",
  "async", "await", "promise", "callback", "event", "listener", "handler", "dom", "virtual",
  "compiler", "transpiler", "webpack", "babel", "eslint", "prettier", "jest", "testing", "library",
  "framework", "module", "package", "npm", "yarn", "git", "github", "gitlab", "bitbucket", "ci",
  "cd", "devops", "docker", "kubernetes", "container", "microservice", "architecture", "design",
  "pattern", "algorithm", "data", "structure", "performance", "optimization", "security", "authentication",
  "authorization", "token", "jwt", "oauth", "responsive", "mobile", "desktop", "pwa", "spa", "ssr",
  "ssg", "jamstack", "headless", "cms", "api", "graphql", "rest", "websocket", "protocol", "cache",
  "cookie", "session", "storage", "local", "memory", "buffer", "stream", "file", "system", "network",
  "request", "response", "header", "body", "parameter", "query", "path", "route", "middleware", "plugin",
  "extension", "browser", "chrome", "firefox", "safari", "edge", "ie", "compatibility", "polyfill",
  "shim", "feature", "flag", "environment", "development", "production", "staging", "testing", "debug",
  "log", "error", "warning", "info", "verbose", "trace", "monitor", "analytics", "metric", "telemetry"
];

// Add tech terms to dictionary
techTerms.forEach(term => dictionary.add(term));

export function SpellChecker() {
  const [text, setText] = useState("");
  const [misspelledWords, setMisspelledWords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [stats, setStats] = useState({ 
    total: 0, 
    misspelled: 0, 
    correct: 0,
    characters: 0,
    sentences: 0
  });

  // Update character count when text changes
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      characters: text.length
    }));
  }, [text]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    // Reset spell check results when text changes
    setMisspelledWords([]);
    setSuggestions({});
    setStats(prev => ({ 
      ...prev, 
      total: 0, 
      misspelled: 0, 
      correct: 0,
      characters: e.target.value.length,
      sentences: countSentences(e.target.value)
    }));
  };

  const countSentences = (text: string): number => {
    if (!text.trim()) return 0;
    // Count sentences by looking for periods, question marks, and exclamation points
    // followed by a space or end of string
    const sentenceEndings = text.match(/[.!?]+(\s|$)/g);
    return sentenceEndings ? sentenceEndings.length : 0;
  };

  const checkSpelling = () => {
    if (!text.trim()) return;

    setIsChecking(true);

    // Simulate processing delay for better UX
    setTimeout(() => {
      // Extract words using regex, ignoring numbers and special characters
      const words = text.match(/[a-zA-Z']+/g) || [];
      const uniqueWords = [...new Set(words.map(word => word.toLowerCase()))];
      
      // Find misspelled words (not in dictionary)
      const misspelled = uniqueWords.filter(word => !dictionary.has(word));

      // Count sentences
      const sentenceCount = countSentences(text);

      setMisspelledWords(misspelled);
      setStats({
        total: uniqueWords.length,
        misspelled: misspelled.length,
        correct: uniqueWords.length - misspelled.length,
        characters: text.length,
        sentences: sentenceCount
      });

      // Generate suggestions for misspelled words
      const newSuggestions: Record<string, string[]> = {};

      misspelled.forEach(word => {
        // Find similar words using Levenshtein distance
        const possibleSuggestions = Array.from(dictionary)
          .filter(dictWord => {
            // Start with same letter and similar length for efficiency
            return dictWord[0] === word[0] && 
                   Math.abs(dictWord.length - word.length) <= 2 &&
                   calculateLevenshteinDistance(word, dictWord) <= 2;
          })
          .sort((a, b) => {
            // Sort by Levenshtein distance (closest matches first)
            const distA = calculateLevenshteinDistance(word, a);
            const distB = calculateLevenshteinDistance(word, b);
            return distA - distB;
          })
          .slice(0, 3); // Take top 3 suggestions

        newSuggestions[word] = possibleSuggestions;
      });

      setSuggestions(newSuggestions);
      setIsChecking(false);
    }, 800);
  };

  // Calculate Levenshtein distance between two strings
  const calculateLevenshteinDistance = (a: string, b: string): number => {
    const matrix: number[][] = [];

    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[b.length][a.length];
  };

  const handleClear = () => {
    setText("");
    setMisspelledWords([]);
    setSuggestions({});
    setStats({ total: 0, misspelled: 0, correct: 0, characters: 0, sentences: 0 });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const replaceWord = (oldWord: string, newWord: string) => {
    // Replace all occurrences of the word with case sensitivity preserved
    const regex = new RegExp(`\\b${oldWord}\\b`, "gi");
    const newText = text.replace(regex, newWord);
    setText(newText);

    // Remove from misspelled words
    setMisspelledWords(misspelledWords.filter(word => word !== oldWord));

    // Update stats
    setStats(prev => ({
      ...prev,
      misspelled: prev.misspelled - 1,
      correct: prev.correct + 1
    }));
  };

  const highlightMisspelledWords = () => {
    if (misspelledWords.length === 0) return text;

    let highlightedText = text;
    misspelledWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span style="color: red; text-decoration: underline wavy red;">${word}</span>`
      );
    });

    return highlightedText;
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          English Spell Checker
        </Typography>
        <Box sx={{ 
          position: "relative",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden"
        }}>
          <TextField
            fullWidth
            multiline
            minRows={8}
            maxRows={15}
            placeholder="Type or paste your text here to check spelling..."
            value={text}
            onChange={handleTextChange}
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
              onClick={handleCopy}
              disabled={!text}
              title="Copy to clipboard"
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleClear}
              disabled={!text}
              title="Clear text"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={checkSpelling}
          disabled={!text.trim() || isChecking}
          startIcon={
            isChecking ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SpellcheckIcon />
            )
          }
        >
          {isChecking ? "Checking..." : "Check Spelling"}
        </Button>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={`Words: ${stats.total}`}
            color="default"
            variant="outlined"
          />
          <Chip
            label={`Characters: ${stats.characters}`}
            color="default"
            variant="outlined"
          />
          <Chip
            label={`Sentences: ${stats.sentences}`}
            color="default"
            variant="outlined"
          />
          {stats.misspelled > 0 && (
            <Chip
              label={`Misspelled: ${stats.misspelled}`}
              color="error"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {misspelledWords.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Spelling Issues Found
          </Typography>
          <List
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              maxHeight: "300px",
              overflow: "auto"
            }}
          >
            {misspelledWords.map((word, index) => (
              <Box key={`${word}-${index}`}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemText
                    primary={`"${word}" might be misspelled`}
                    secondary={
                      suggestions[word]?.length > 0
                        ? "Suggestions:"
                        : "No suggestions available"
                    }
                  />
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {suggestions[word]?.map((suggestion) => (
                      <Chip
                        key={suggestion}
                        label={suggestion}
                        onClick={() => replaceWord(word, suggestion)}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{ cursor: "pointer" }}
                      />
                    ))}
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        </Box>
      ) : stats.total > 0 && stats.misspelled === 0 ? (
        <Alert severity="success" sx={{ mb: 4 }}>
          No spelling issues found in your text!
        </Alert>
      ) : null}

      {misspelledWords.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Text Preview with Highlights
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              maxHeight: "200px",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: highlightMisspelledWords() }}
            />
          </Paper>
        </Box>
      )}

    </Paper>
  );
}
