"use client";

import { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  ButtonGroup,
  Divider,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import CodeIcon from "@mui/icons-material/Code";
import LinkOffIcon from "@mui/icons-material/LinkOff";

export function UrlDecoderEncoder() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEncode = () => {
    try {
      if (!inputText.trim()) {
        setOutputText("");
        return;
      }
      setOutputText(encodeURIComponent(inputText));
    } catch (error) {
      setOutputText(`Error: ${(error as Error).message}`);
    }
  };

  const handleDecode = () => {
    try {
      if (!inputText.trim()) {
        setOutputText("");
        return;
      }
      setOutputText(decodeURIComponent(inputText));
    } catch (error) {
      setOutputText(`Error: ${(error as Error).message}`);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    showSnackbar("Copied to clipboard!");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      showSnackbar("Pasted from clipboard!");
    } catch (error) {
      showSnackbar("Failed to paste from clipboard");
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h6" gutterBottom>
        URL Encoder & Decoder
      </Typography>

      <Box sx={{ width: "100%", mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Input Text
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to encode or decode"
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <ButtonGroup fullWidth variant="contained">
              <Button
                startIcon={<CodeIcon />}
                onClick={handleEncode}
                disabled={!inputText.trim()}
                color="primary"
              >
                Encode
              </Button>
              <Button
                startIcon={<LinkOffIcon />}
                onClick={handleDecode}
                disabled={!inputText.trim()}
                color="secondary"
              >
                Decode
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6}>
            <ButtonGroup fullWidth variant="outlined">
              <Button startIcon={<ContentPasteIcon />} onClick={handlePaste}>
                Paste
              </Button>
              <Button
                startIcon={<DeleteIcon />}
                onClick={handleClear}
                disabled={!inputText && !outputText}
              >
                Clear
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle1">Result</Typography>
          {outputText && (
            <Tooltip title="Copy to clipboard">
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <TextField
          fullWidth
          multiline
          rows={6}
          value={outputText}
          InputProps={{ readOnly: true }}
          variant="outlined"
          placeholder="Result will appear here"
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        URL Encoder & Decoder Features
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" paragraph>
            • Encode URLs for safe transmission over the internet
          </Typography>
          <Typography variant="body2" paragraph>
            • Decode URL-encoded strings back to readable text
          </Typography>
          <Typography variant="body2" paragraph>
            • Process query parameters and complex URLs
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body2" paragraph>
            • Copy results to clipboard with one click
          </Typography>
          <Typography variant="body2" paragraph>
            • Paste content directly from clipboard
          </Typography>
          <Typography variant="body2" paragraph>
            • Process data locally - your content never leaves your device
          </Typography>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}


