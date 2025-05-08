"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Grid,
  Typography,
  TextField,
  IconButton,
  useTheme,
  Stack,
  Snackbar,
  Alert,
  Divider,
  Tooltip,
  LinearProgress,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimerIcon from "@mui/icons-material/Timer";
import { useWordCounterStyles } from "@/styles/styles";

export function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });
  const [history, setHistory] = useState<{ text: string; timestamp: Date }[]>(
    []
  );
  const [showHistory, setShowHistory] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const theme = useTheme();
  const classes = useWordCounterStyles();

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n+/).filter(Boolean).length;
    // Average reading speed: 200-250 words per minute
    const readingTime = Math.ceil(words / 225);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
    });
  }, [text]);

  const handleClear = () => {
    if (text.trim()) {
      // Save to history before clearing
      saveToHistory();
    }
    setText("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setSnackbarOpen(true);
  };

  const saveToHistory = () => {
    const newHistoryItem = {
      text,
      timestamp: new Date(),
    };
    setHistory((prev) => [newHistoryItem, ...prev.slice(0, 4)]);
  };

  const restoreFromHistory = (historyText: string) => {
    setText(historyText);
  };

  const getWordDensity = () => {
    if (!text.trim()) return [];

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount: Record<string, number> = {};

    words.forEach((word) => {
      if (word.length > 2) {
        // Ignore very short words
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });

    return Object.entries(wordCount)
      .filter(([_, count]) => count > 1) // Only words that appear more than once
      .sort((a, b) => b[1] - a[1]) // Sort by frequency
      .slice(0, 5); // Top 5 words
  };

  const wordDensity = getWordDensity();
  const textProgress = Math.min(100, (stats.words / 500) * 100); // Progress toward 500 words

  return (
    <Paper className={classes.paper} elevation={3} sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Grid container spacing={2} alignItems="stretch">
          <StatCard label="Words" value={stats.words} xs={6} sm={4} md={2} />
          <StatCard
            label="Characters"
            value={stats.characters}
            xs={6}
            sm={4}
            md={2}
          />
          <StatCard
            label="No Spaces"
            value={stats.charactersNoSpaces}
            xs={6}
            sm={4}
            md={2}
          />
          <StatCard
            label="Sentences"
            value={stats.sentences}
            xs={6}
            sm={4}
            md={2}
          />
          <StatCard
            label="Paragraphs"
            value={stats.paragraphs}
            xs={6}
            sm={4}
            md={2}
          />
          <StatCard
            label="Reading Time"
            value={stats.readingTime}
            unit="min"
            icon={<TimerIcon fontSize="small" />}
            xs={6}
            sm={4}
            md={2}
          />
        </Grid>

        {stats.words > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progress (500 words)
            </Typography>
            <LinearProgress
              variant="determinate"
              value={textProgress}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
        )}

        <Box position="relative">
          <TextField
            fullWidth
            multiline
            minRows={12}
            maxRows={20}
            placeholder="Type or paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
          />
          <Box
            position="absolute"
            bottom={8}
            right={8}
            display="flex"
            gap={1}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
              padding: 0.5,
              boxShadow: 1,
            }}
          >
            <Tooltip title="Copy to clipboard">
              <IconButton
                size="small"
                onClick={handleCopy}
                disabled={!text}
                color="primary"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="View history">
              <IconButton
                size="small"
                onClick={() => setShowHistory(!showHistory)}
                color={showHistory ? "primary" : "default"}
              >
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear text">
              <IconButton
                size="small"
                onClick={handleClear}
                disabled={!text}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {wordDensity.length > 0 && (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
            >
              <BarChartIcon fontSize="small" />
              Word Frequency
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {wordDensity.map(([word, count]) => (
                <Chip
                  key={word}
                  label={`${word} (${count})`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {showHistory && history.length > 0 && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Recent Texts
            </Typography>
            <Stack spacing={1}>
              {history.map((item, index) => (
                <Paper
                  key={index}
                  elevation={1}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                  onClick={() => restoreFromHistory(item.text)}
                >
                  <Typography variant="body2" noWrap>
                    {item.text.substring(0, 100)}
                    {item.text.length > 100 ? "..." : ""}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.timestamp.toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Word Counter Features
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography component="div" sx={{ mb: 1 }}>
          • Count words, characters, sentences and paragraphs in real-time
        </Typography>

        <Typography component="div" sx={{ mb: 1 }}>
          • Estimate reading time based on average reading speed
        </Typography>

        <Typography component="div" sx={{ mb: 1 }}>
          • Analyze word frequency and identify commonly used words
        </Typography>

        <Typography component="div" sx={{ mb: 1 }}>
          • Save and restore text from history with one click
        </Typography>

        <Typography component="div" sx={{ mb: 1 }}>
          • Process text locally - your content never leaves your device
        </Typography>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Text copied to clipboard
        </Alert>
      </Snackbar>
    </Paper>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  icon?: React.ReactNode;
  xs?: number | boolean;
  sm?: number | boolean;
  md?: number | boolean;
}

function StatCard({
  label,
  value,
  unit = "",
  icon,
  xs = 6,
  sm = 4,
  md = 2,
}: StatCardProps) {
  const classes = useWordCounterStyles();
  const theme = useTheme();

  return (
    <Grid item xs={xs} sm={sm} md={md}>
      <Paper
        elevation={2}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: theme.spacing(2),
          textAlign: "center",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {unit && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {unit}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {icon}
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}

