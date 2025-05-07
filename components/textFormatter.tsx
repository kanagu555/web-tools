"use client";

import type React from "react";
import { useState, useMemo } from "react";
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

  const formatOptions = useMemo(
    () => [
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
    ],
    []
  );

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Input Text
          </Typography>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Formatted Text
          </Typography>
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
            borderColor: "black",
            borderRadius: 1,
            overflow: "hidden"
          }}>
            <TextField
              fullWidth
              multiline
              minRows={10}
              maxRows={20}
              placeholder="Type or paste your text here..."
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
                onClick={() => handleCopy(text)}
                disabled={!text}
                title="Copy to clipboard"
                aria-label="Copy input text to clipboard"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleClear}
                disabled={!text}
                title="Clear text"
                aria-label="Clear input text"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ 
            position: "relative", 
            flex: 1,
            border: "1px solid",
            borderColor: "black",
            borderRadius: 1,
            overflow: "hidden"
          }}>
            <TextField
              fullWidth
              multiline
              minRows={10}
              maxRows={20}
              placeholder="Formatted text will appear here..."
              value={formattedText}
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
                onClick={() => handleCopy(formattedText)}
                disabled={!formattedText}
                title="Copy to clipboard"
                aria-label="Copy formatted text to clipboard"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Formatting Options
        </Typography>
        <Grid container spacing={2}>
          {formatOptions.map((option) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={option.id}>
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
                  height: 80,
                  display: "flex",
                }}
                onClick={() => applyFormat(text, option.id)}
              >
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center",
                  justifyContent: "center",
                  p: 2,
                  "&:last-child": { pb: 2 }
                }}>
                  {option.icon}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1, 
                      textAlign: "center",
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "100%"
                    }}
                  >
                    {option.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}
