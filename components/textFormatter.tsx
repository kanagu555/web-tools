"use client";

import type React from "react";

import { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TextFormatIcon from "@mui/icons-material/TextFormat";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AdSense from "./AdSense";

export function TextFormatter() {
  const [text, setText] = useState("");
  const [formattedText, setFormattedText] = useState("");
  const [formatType, setFormatType] = useState<string | null>(null);
  const theme = useTheme();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (formatType) {
      applyFormat(e.target.value, formatType);
    }
  };

  const applyFormat = (inputText: string, type: string) => {
    setFormatType(type);
    let result = inputText;

    switch (type) {
      case "uppercase":
        result = inputText.toUpperCase();
        break;
      case "lowercase":
        result = inputText.toLowerCase();
        break;
      case "capitalize":
        result = inputText
          .split(" ")
          .map((word) =>
            word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
          )
          .join(" ");
        break;
      case "sentence":
        result = inputText
          .split(". ")
          .map((sentence) =>
            sentence
              ? sentence[0].toUpperCase() + sentence.slice(1).toLowerCase()
              : ""
          )
          .join(". ");
        break;
      case "alternating":
        result = inputText
          .split("")
          .map((char, i) =>
            i % 2 === 0 ? char.toUpperCase() : char.toLowerCase()
          )
          .join("");
        break;
      case "reverse":
        result = inputText.split("").reverse().join("");
        break;
      case "removeSpaces":
        result = inputText.replace(/\s+/g, "");
        break;
      case "addLineNumbers":
        result = inputText
          .split("\n")
          .map((line, i) => `${i + 1}. ${line}`)
          .join("\n");
        break;
      case "bulletPoints":
        result = inputText
          .split("\n")
          .map((line) => (line.trim() ? `• ${line}` : line))
          .join("\n");
        break;
      case "removeExtraSpaces":
        result = inputText.replace(/\s+/g, " ").trim();
        break;
      case "removeLineBreaks":
        result = inputText.replace(/\n+/g, " ").trim();
        break;
      case "camelCase":
        result = inputText
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[A-Z]/, (c) => c.toLowerCase());
        break;
      case "snakeCase":
        result = inputText
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");
        break;
      case "kebabCase":
        result = inputText
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-zA-Z0-9-]/g, "");
        break;
      default:
        break;
    }

    setFormattedText(result);
  };

  const handleClear = () => {
    setText("");
    setFormattedText("");
    setFormatType(null);
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const formatOptions = [
    { id: "uppercase", label: "UPPERCASE", icon: <TextFieldsIcon /> },
    { id: "lowercase", label: "lowercase", icon: <TextFieldsIcon /> },
    { id: "capitalize", label: "Title Case", icon: <TextFormatIcon /> },
    { id: "sentence", label: "Sentence case", icon: <TextFormatIcon /> },
    { id: "alternating", label: "AlTeRnAtInG", icon: <TextFormatIcon /> },
    { id: "reverse", label: "esreveR", icon: <FormatClearIcon /> },
    { id: "removeSpaces", label: "Remove Spaces", icon: <SpaceBarIcon /> },
    {
      id: "removeExtraSpaces",
      label: "Remove Extra Spaces",
      icon: <SpaceBarIcon />,
    },
    {
      id: "removeLineBreaks",
      label: "Remove Line Breaks",
      icon: <FormatClearIcon />,
    },
    {
      id: "addLineNumbers",
      label: "Add Line Numbers",
      icon: <FormatListNumberedIcon />,
    },
    {
      id: "bulletPoints",
      label: "Bullet Points",
      icon: <FormatListBulletedIcon />,
    },
    { id: "camelCase", label: "camelCase", icon: <TextFormatIcon /> },
    { id: "snakeCase", label: "snake_case", icon: <TextFormatIcon /> },
    { id: "kebabCase", label: "kebab-case", icon: <TextFormatIcon /> },
  ];

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Input Text
          </Typography>
          <Box sx={{ position: "relative" }}>
            <TextField
              fullWidth
              multiline
              minRows={10}
              maxRows={20}
              placeholder="Type or paste your text here..."
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
              <IconButton
                size="small"
                onClick={() => handleCopy(text)}
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
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Formatted Text
          </Typography>
          <Box sx={{ position: "relative" }}>
            <TextField
              fullWidth
              multiline
              minRows={10}
              maxRows={20}
              placeholder="Formatted text will appear here..."
              value={formattedText}
              variant="outlined"
              InputProps={{ readOnly: true }}
            />
            <Box sx={{ position: "absolute", bottom: 8, right: 8 }}>
              <IconButton
                size="small"
                onClick={() => handleCopy(formattedText)}
                disabled={!formattedText}
                title="Copy to clipboard"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Formatting Options
          </Typography>
          <Grid container spacing={2}>
            {formatOptions.map((option) => (
              <Grid item xs={6} sm={4} md={3} key={option.id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                    backgroundColor:
                      formatType === option.id
                        ? "primary.main"
                        : "background.paper",
                    color:
                      formatType === option.id
                        ? "primary.contrastText"
                        : "text.primary",
                  }}
                  onClick={() => applyFormat(text, option.id)}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      "&:last-child": { pb: 2 },
                      textAlign: "center",
                    }}
                  >
                    {option.icon}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {option.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <AdSense adSlot="1234567890" adFormat="auto" />
    </Paper>
  );
}
