"use client";

import type React from "react";

import { useState } from "react";
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
  useTheme,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AdSense from "./AdSense";

// Common English words dictionary (simplified version)
const dictionary = new Set([
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "I",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
  "so",
  "up",
  "out",
  "if",
  "about",
  "who",
  "get",
  "which",
  "go",
  "me",
  "when",
  "make",
  "can",
  "like",
  "time",
  "no",
  "just",
  "him",
  "know",
  "take",
  "people",
  "into",
  "year",
  "your",
  "good",
  "some",
  "could",
  "them",
  "see",
  "other",
  "than",
  "then",
  "now",
  "look",
  "only",
  "come",
  "its",
  "over",
  "think",
  "also",
  "back",
  "after",
  "use",
  "two",
  "how",
  "our",
  "work",
  "first",
  "well",
  "way",
  "even",
  "new",
  "want",
  "because",
  "any",
  "these",
  "give",
  "day",
  "most",
  "us",
  "is",
  "am",
  "are",
  "was",
  "were",
  "been",
  "has",
  "had",
  "did",
  "done",
  "does",
  "doing",
  "said",
  "says",
  "saying",
  "went",
  "gone",
  "going",
  "made",
  "making",
  "took",
  "taken",
  "taking",
  "saw",
  "seen",
  "seeing",
  "came",
  "come",
  "coming",
  "got",
  "gotten",
  "getting",
  "put",
  "putting",
  "found",
  "finding",
  "gave",
  "given",
  "giving",
  "left",
  "leaving",
  "told",
  "telling",
  "felt",
  "feeling",
  "thought",
  "thinking",
  "ran",
  "running",
  "called",
  "calling",
  "tried",
  "trying",
  "asked",
  "asking",
  "seemed",
  "seeming",
  "showed",
  "showing",
  "continued",
  "continuing",
  "began",
  "begun",
  "beginning",
  "started",
  "starting",
  "needed",
  "needing",
  "appeared",
  "appearing",
  "meant",
  "meaning",
  "kept",
  "keeping",
  "let",
  "letting",
  "heard",
  "hearing",
  "meant",
  "meaning",
  "met",
  "meeting",
  "set",
  "setting",
  "followed",
  "following",
  "stopped",
  "stopping",
  "created",
  "creating",
  "opened",
  "opening",
  "walked",
  "walking",
  "offered",
  "offering",
  "remembered",
  "remembering",
  "considered",
  "considering",
  "appeared",
  "appearing",
  "bought",
  "buying",
  "served",
  "serving",
  "died",
  "dying",
  "sent",
  "sending",
  "built",
  "building",
  "understood",
  "understanding",
  "cut",
  "cutting",
  "read",
  "reading",
]);

// Add more common words
[
  "hello",
  "world",
  "computer",
  "programming",
  "software",
  "hardware",
  "internet",
  "website",
  "email",
  "online",
  "download",
  "upload",
  "file",
  "folder",
  "document",
  "image",
  "video",
  "audio",
  "music",
  "game",
  "play",
  "user",
  "password",
  "login",
  "logout",
  "register",
  "account",
  "profile",
  "settings",
  "help",
  "support",
  "contact",
  "about",
  "home",
  "search",
  "find",
  "create",
  "edit",
  "delete",
  "save",
  "cancel",
  "submit",
  "form",
  "input",
  "output",
  "error",
  "warning",
  "success",
  "fail",
  "try",
  "catch",
  "debug",
  "code",
  "program",
  "function",
  "variable",
  "constant",
  "class",
  "object",
  "method",
  "property",
  "value",
  "type",
  "string",
  "number",
  "boolean",
  "array",
  "object",
  "null",
  "undefined",
  "true",
  "false",
  "if",
  "else",
  "switch",
  "case",
  "for",
  "while",
  "do",
  "break",
  "continue",
  "return",
  "import",
  "export",
  "default",
  "public",
  "private",
  "protected",
  "static",
  "final",
  "interface",
  "abstract",
  "implements",
  "extends",
  "super",
  "this",
  "new",
  "delete",
  "typeof",
  "instanceof",
  "void",
  "throw",
  "try",
  "catch",
  "finally",
  "async",
  "await",
  "promise",
  "resolve",
  "reject",
  "then",
  "catch",
  "finally",
  "map",
  "filter",
  "reduce",
  "forEach",
  "some",
  "every",
  "find",
  "includes",
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "slice",
  "concat",
  "join",
  "split",
  "reverse",
  "sort",
  "toString",
  "valueOf",
  "length",
  "name",
  "key",
  "value",
  "index",
  "item",
  "element",
  "node",
  "parent",
  "child",
  "sibling",
  "root",
  "leaf",
  "tree",
  "graph",
  "stack",
  "queue",
  "list",
  "linked",
  "hash",
  "map",
  "set",
  "algorithm",
  "data",
  "structure",
  "pattern",
  "design",
  "model",
  "view",
  "controller",
  "api",
  "rest",
  "soap",
  "xml",
  "json",
  "html",
  "css",
  "javascript",
  "typescript",
  "react",
  "angular",
  "vue",
  "node",
  "express",
  "mongodb",
  "mysql",
  "postgresql",
  "sqlite",
  "redis",
  "aws",
  "azure",
  "google",
  "cloud",
  "server",
  "client",
  "frontend",
  "backend",
  "fullstack",
  "mobile",
  "desktop",
  "web",
  "app",
  "application",
  "development",
  "production",
  "testing",
  "deployment",
  "ci",
  "cd",
  "devops",
  "agile",
  "scrum",
  "kanban",
  "waterfall",
  "sprint",
  "backlog",
  "story",
  "task",
  "bug",
  "feature",
  "release",
  "version",
  "update",
  "patch",
  "fix",
  "issue",
  "problem",
  "solution",
  "question",
  "answer",
  "documentation",
  "comment",
  "review",
  "feedback",
  "rating",
  "score",
  "point",
  "level",
  "rank",
  "status",
  "state",
  "condition",
  "mode",
  "option",
  "setting",
  "configuration",
  "preference",
  "default",
  "custom",
  "template",
  "theme",
  "style",
  "layout",
  "design",
  "color",
  "font",
  "size",
  "width",
  "height",
  "margin",
  "padding",
  "border",
  "background",
  "foreground",
  "content",
  "header",
  "footer",
  "sidebar",
  "main",
  "section",
  "article",
  "nav",
  "menu",
  "button",
  "link",
  "image",
  "video",
  "audio",
  "media",
  "file",
  "upload",
  "download",
  "share",
  "like",
  "comment",
  "post",
  "message",
  "chat",
  "notification",
  "alert",
  "warning",
  "error",
  "success",
  "info",
  "help",
  "support",
  "contact",
  "about",
  "terms",
  "privacy",
  "policy",
  "copyright",
  "license",
  "free",
  "paid",
  "premium",
  "subscription",
  "trial",
  "demo",
  "example",
  "sample",
  "test",
  "prototype",
  "beta",
  "alpha",
  "stable",
  "release",
  "version",
  "update",
  "upgrade",
  "install",
  "uninstall",
  "setup",
  "configure",
  "customize",
  "personalize",
  "optimize",
  "improve",
  "enhance",
  "boost",
  "increase",
  "decrease",
  "reduce",
  "expand",
  "shrink",
  "zoom",
  "scale",
  "resize",
  "rotate",
  "flip",
  "crop",
  "edit",
  "modify",
  "change",
  "update",
  "delete",
  "remove",
  "add",
  "create",
  "insert",
  "append",
  "prepend",
  "replace",
  "substitute",
  "swap",
  "exchange",
  "move",
  "copy",
  "paste",
  "cut",
  "undo",
  "redo",
  "revert",
  "reset",
  "clear",
  "empty",
  "fill",
  "populate",
  "generate",
  "calculate",
  "compute",
  "process",
  "analyze",
  "evaluate",
  "validate",
  "verify",
  "check",
  "test",
  "debug",
  "trace",
  "log",
  "monitor",
  "track",
  "record",
  "capture",
  "store",
  "save",
  "load",
  "open",
  "close",
  "start",
  "stop",
  "pause",
  "resume",
  "continue",
  "skip",
  "next",
  "previous",
  "first",
  "last",
  "top",
  "bottom",
  "left",
  "right",
  "center",
  "middle",
  "front",
  "back",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "above",
  "below",
  "before",
  "after",
  "during",
  "while",
  "when",
  "if",
  "else",
  "unless",
  "until",
  "since",
  "because",
  "therefore",
  "however",
  "although",
  "despite",
  "nevertheless",
  "regardless",
  "notwithstanding",
].forEach((word) => dictionary.add(word));

export function SpellChecker() {
  const [text, setText] = useState("");
  const [misspelledWords, setMisspelledWords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [stats, setStats] = useState({ total: 0, misspelled: 0, correct: 0 });
  const theme = useTheme();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    // Reset spell check results when text changes
    setMisspelledWords([]);
    setSuggestions({});
  };

  const checkSpelling = () => {
    if (!text.trim()) return;

    setIsChecking(true);

    // Simulate processing delay for better UX
    setTimeout(() => {
      const words = text.toLowerCase().match(/[a-z']+/g) || [];
      const uniqueWords = [...new Set(words)];
      const misspelled = uniqueWords.filter((word) => !dictionary.has(word));

      setMisspelledWords(misspelled);
      setStats({
        total: uniqueWords.length,
        misspelled: misspelled.length,
        correct: uniqueWords.length - misspelled.length,
      });

      // Generate simple suggestions for misspelled words
      const newSuggestions: Record<string, string[]> = {};

      misspelled.forEach((word) => {
        // Simple suggestion algorithm - find words that start with the same letter
        // and have similar length (not a real spell checker but good for demo)
        const possibleSuggestions = Array.from(dictionary)
          .filter(
            (dictWord) =>
              dictWord[0] === word[0] &&
              Math.abs(dictWord.length - word.length) <= 2
          )
          .slice(0, 3);

        newSuggestions[word] = possibleSuggestions;
      });

      setSuggestions(newSuggestions);
      setIsChecking(false);
    }, 800);
  };

  const handleClear = () => {
    setText("");
    setMisspelledWords([]);
    setSuggestions({});
    setStats({ total: 0, misspelled: 0, correct: 0 });
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
    setMisspelledWords(misspelledWords.filter((word) => word !== oldWord));

    // Update stats
    setStats((prev) => ({
      ...prev,
      misspelled: prev.misspelled - 1,
      correct: prev.correct + 1,
    }));
  };

  const highlightMisspelledWords = () => {
    if (misspelledWords.length === 0) return text;

    let highlightedText = text;
    misspelledWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span style="color: red; text-decoration: underline;">${word}</span>`
      );
    });

    return highlightedText;
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Text Input
        </Typography>
        <Box sx={{ position: "relative" }}>
          <TextField
            fullWidth
            multiline
            minRows={8}
            maxRows={15}
            placeholder="Type or paste your text here to check spelling..."
            value={text}
            onChange={handleTextChange}
            variant="outlined"
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
            <Button
              size="small"
              onClick={handleCopy}
              disabled={!text}
              startIcon={<ContentCopyIcon fontSize="small" />}
              sx={{ minWidth: "auto", p: "4px 8px" }}
            >
              Copy
            </Button>
            <Button
              size="small"
              onClick={handleClear}
              disabled={!text}
              startIcon={<DeleteIcon fontSize="small" />}
              sx={{ minWidth: "auto", p: "4px 8px" }}
            >
              Clear
            </Button>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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

        {stats.total > 0 && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Chip
              label={`Total Words: ${stats.total}`}
              color="default"
              variant="outlined"
            />
            <Chip
              label={`Misspelled: ${stats.misspelled}`}
              color={stats.misspelled > 0 ? "error" : "success"}
              variant="outlined"
            />
            <Chip
              label={`Correct: ${stats.correct}`}
              color="success"
              variant="outlined"
            />
          </Box>
        )}
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

      <AdSense adSlot="1234567890" adFormat="auto" />
    </Paper>
  );
}
