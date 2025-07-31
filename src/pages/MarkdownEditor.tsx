/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Divider,
  Tooltip,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Table,
  CheckSquare,
  Eye,
  FileText,
  Copy,
  Check,
  Download,
  Upload,
  Trash2,
  ClipboardPaste,
  Settings,
  HelpCircle,
  Undo,
  Redo,
  Maximize,
  Minimize,
} from "lucide-react";
import { Helmet } from "react-helmet";

// Import syntax highlighting libraries
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";

// Import markdown parser
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import AdSense from "../components/AdSense";
import Breadcrumb from "../components/Breadcrumb";

interface MarkdownHistory {
  content: string;
  timestamp: number;
  title: string;
}

interface EditorSettings {
  autoSave: boolean;
  syncScroll: boolean;
  darkPreview: boolean;
  lineNumbers: boolean;
  spellCheck: boolean;
  wordWrap: boolean;
  tabSize: number;
}

const MarkdownEditor = () => {
  const theme = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // State for editor content
  const [markdown, setMarkdown] = useState<string>(
    `# Welcome to Markdown Editor

This is a **powerful** editor with _many_ features.

## Features

- Live preview
- Syntax highlighting
- File import/export
- Keyboard shortcuts

\`\`\`javascript
console.log('Hello, world!')
\`\`\`

> Markdown is a lightweight markup language.

| Feature | Status |
|---------|--------|
| Preview | ✅ |
| Export  | ✅ |
| Themes  | ✅ |
`
  );
  const [documentTitle, setDocumentTitle] =
    useState<string>("Untitled Document");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(
    "split"
  );
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  // State for UI feedback
  const [copied, setCopied] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // State for history and settings
  const [history, setHistory] = useState<MarkdownHistory[]>([]);
  const [historyAnchorEl, setHistoryAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<EditorSettings>({
    autoSave: true,
    syncScroll: true,
    darkPreview: theme.palette.mode === "dark",
    lineNumbers: true,
    spellCheck: true,
    wordWrap: true,
    tabSize: 2,
  });

  // State for undo/redo functionality
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Text Tools", url: "/category/text" },
    { name: "Word Count Tool" },
  ];

  // Load content from localStorage on initial render
  useEffect(() => {
    window.scrollTo(0, 0);

    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const mdParam = params.get("markdown");

    if (mdParam) {
      try {
        const decodedMarkdown = decodeURIComponent(mdParam);
        setMarkdown(decodedMarkdown);
      } catch (err) {
        console.error("Failed to parse markdown from URL", err);
      }
    } else {
      // Load from localStorage if available
      const savedMarkdown = localStorage.getItem("markdownEditorContent");
      const savedTitle = localStorage.getItem("markdownEditorTitle");

      if (savedMarkdown) {
        setMarkdown(savedMarkdown);
      }

      if (savedTitle) {
        setDocumentTitle(savedTitle);
      }
    }

    // Load history
    const savedHistory = localStorage.getItem("markdownEditorHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Failed to parse history", err);
      }
    }

    // Load settings
    const savedSettings = localStorage.getItem("markdownEditorSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (err) {
        console.error("Failed to parse settings", err);
      }
    }

    // Add event listener for keyboard shortcuts
    document.addEventListener("keydown", handleKeyboardShortcuts);

    return () => {
      document.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, []);

  // Auto-save content to localStorage
  useEffect(() => {
    if (settings.autoSave && markdown) {
      localStorage.setItem("markdownEditorContent", markdown);
      localStorage.setItem("markdownEditorTitle", documentTitle);
    }
  }, [markdown, documentTitle, settings.autoSave]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("markdownEditorSettings", JSON.stringify(settings));
  }, [settings]);

  // Sync scrolling between editor and preview
  useEffect(() => {
    const handleEditorScroll = () => {
      if (
        !settings.syncScroll ||
        viewMode !== "split" ||
        !editorRef.current ||
        !previewRef.current
      ) {
        return;
      }

      const editorElement = editorRef.current;
      const previewElement = previewRef.current;

      const editorScrollPercentage =
        editorElement.scrollTop /
        (editorElement.scrollHeight - editorElement.clientHeight);
      previewElement.scrollTop =
        editorScrollPercentage *
        (previewElement.scrollHeight - previewElement.clientHeight);
    };

    const editorElement = editorRef.current;
    if (editorElement && settings.syncScroll) {
      editorElement.addEventListener("scroll", handleEditorScroll);
    }

    return () => {
      if (editorElement && settings.syncScroll) {
        editorElement.removeEventListener("scroll", handleEditorScroll);
      }
    };
  }, [settings.syncScroll, viewMode]);

  // Handle keyboard shortcuts
  const handleKeyboardShortcuts = (e: KeyboardEvent) => {
    // Check if Ctrl/Cmd key is pressed
    const ctrlOrCmd = e.ctrlKey || e.metaKey;

    if (ctrlOrCmd) {
      switch (e.key.toLowerCase()) {
        case "s":
          e.preventDefault();
          break;
        case "b":
          e.preventDefault();
          insertMarkdown("**bold text**", 2, 10);
          break;
        case "i":
          e.preventDefault();
          insertMarkdown("*italic text*", 1, 11);
          break;
        case "z":
          if (e.shiftKey) {
            e.preventDefault();
            handleRedo();
          } else {
            e.preventDefault();
            handleUndo();
          }
          break;
        case "1":
          if (e.shiftKey) {
            e.preventDefault();
            insertMarkdown("# Heading 1\n", 2, 9);
          }
          break;
        case "2":
          if (e.shiftKey) {
            e.preventDefault();
            insertMarkdown("## Heading 2\n", 3, 9);
          }
          break;
        case "3":
          if (e.shiftKey) {
            e.preventDefault();
            insertMarkdown("### Heading 3\n", 4, 9);
          }
          break;
      }
    }
  };

  // Handle markdown changes with undo/redo support
  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    // Add current state to undo stack before updating
    setUndoStack((prev) => [...prev, markdown]);
    setRedoStack([]);

    setMarkdown(newValue);
  };

  // Undo/Redo functions
  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prevState = undoStack[undoStack.length - 1];
      const newUndoStack = undoStack.slice(0, -1);

      setRedoStack((prev) => [...prev, markdown]);
      setMarkdown(prevState);
      setUndoStack(newUndoStack);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      const newRedoStack = redoStack.slice(0, -1);

      setUndoStack((prev) => [...prev, markdown]);
      setMarkdown(nextState);
      setRedoStack(newRedoStack);
    }
  };

  // Insert markdown at cursor position
  const insertMarkdown = (
    text: string,
    selectionStart: number,
    selectionLength: number
  ) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let newText;
    let newCursorPos;

    if (selectedText) {
      // If text is selected, wrap it with markdown
      newText =
        textarea.value.substring(0, start) +
        text.replace(
          text.substring(selectionStart, selectionStart + selectionLength),
          selectedText
        ) +
        textarea.value.substring(end);
      newCursorPos =
        start + text.length - selectionLength + selectedText.length;
    } else {
      // If no text is selected, just insert the markdown
      newText =
        textarea.value.substring(0, start) +
        text +
        textarea.value.substring(end);
      newCursorPos = start + selectionStart;
    }

    // Add to undo stack
    setUndoStack((prev) => [...prev, markdown]);
    setRedoStack([]);

    setMarkdown(newText);

    // Set focus back to textarea and position cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos + selectionLength);
    }, 0);
  };

  // Toolbar button handlers
  const handleBold = () => insertMarkdown("**bold text**", 2, 10);
  const handleItalic = () => insertMarkdown("*italic text*", 1, 11);
  const handleHeading1 = () => insertMarkdown("# Heading 1\n", 2, 9);
  const handleHeading2 = () => insertMarkdown("## Heading 2\n", 3, 9);
  const handleHeading3 = () => insertMarkdown("### Heading 3\n", 4, 9);
  const handleLink = () =>
    insertMarkdown("[link text](https://example.com)", 1, 9);
  const handleImage = () => insertMarkdown("![alt text](image-url.jpg)", 2, 8);
  const handleCode = () => insertMarkdown("```\ncode block\n```", 4, 10);
  const handleBlockquote = () => insertMarkdown("> blockquote\n", 2, 10);
  const handleUnorderedList = () => insertMarkdown("- list item\n", 2, 9);
  const handleOrderedList = () => insertMarkdown("1. list item\n", 3, 9);
  const handleCheckbox = () => insertMarkdown("- [ ] task\n", 6, 4);
  const handleHorizontalRule = () => insertMarkdown("\n---\n", 4, 0);
  const handleTable = () =>
    insertMarkdown(
      "| Header 1 | Header 2 |\n|----------|------------|\n| Cell 1   | Cell 2    |\n",
      2,
      8
    );

  // File operations
  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    showSnackbar("Markdown copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Add to undo stack
      setUndoStack((prev) => [...prev, markdown]);
      setRedoStack([]);
      setMarkdown((prev) => prev + text);
      showSnackbar("Content pasted from clipboard", "success");
    } catch (err) {
      showSnackbar("Failed to paste from clipboard", "error");
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the editor?")) {
      // Add to undo stack
      setUndoStack((prev) => [...prev, markdown]);
      setRedoStack([]);
      setMarkdown("");
      showSnackbar("Editor cleared", "info");
    }
  };

  const handleExport = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentTitle.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSnackbar("Markdown file downloaded", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      // Add to undo stack
      setUndoStack((prev) => [...prev, markdown]);
      setRedoStack([]);
      setMarkdown(content);
      setDocumentTitle(file.name.replace(/\.md$/, ""));
      showSnackbar(`Imported ${file.name}`, "success");
    };
    reader.readAsText(file);

    // Reset the input value so the same file can be imported again
    e.target.value = "";
  };

  const loadFromHistory = (item: MarkdownHistory) => {
    // Add current state to undo stack
    setUndoStack((prev) => [...prev, markdown]);
    setRedoStack([]);

    setMarkdown(item.content);
    setDocumentTitle(item.title);
    setHistoryAnchorEl(null);
    showSnackbar(`Loaded: ${item.title}`, "info");
  };

  // Helper functions
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Calculate statistics
  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      <Helmet>
        <title>Markdown Editor | KodeKit</title>
        <meta
          name="description"
          content="A powerful Markdown editor with live preview, syntax highlighting, and file operations."
        />
        <meta
          name="keywords"
          content="markdown editor, markdown, editor, text editor, code editor, live preview, syntax highlighting, document editor, web tools, Online Markdown editor free, Markdown editor with live preview, Free Markdown writing tool, Markdown code editor online, Markdown editor for developers, Markdown editor for GitHub README, Markdown editor with syntax highlighting, Markdown editor with export options, Markdown editor for bloggers, Markdown editor for documentation, Markdown editor with HTML conversion, Markdown editor for technical writing, Markdown editor with dark mode, Markdown editor for Windows Mac Linux, Markdown editor without download, Markdown editor with autosave feature, Markdown editor for note taking, Markdown editor with clipboard support, Markdown editor with real-time rendering, Markdown editor for team collaboration, Markdown editor with file upload, Markdown editor GitHub integration, Markdown editor NPM package, Markdown editor React app, Markdown editor open source, Markdown editor for documentation sites"
        />
        <meta property="og:title" content="Markdown Editor | KodeKit" />
        <meta
          property="og:description"
          content="A powerful Markdown editor with live preview, syntax highlighting, and file operations."
        />
        <meta name="twitter:title" content="Markdown Editor | KodeKit" />
        <meta
          name="twitter:description"
          content="A powerful Markdown editor with live preview, syntax highlighting, and file operations."
        />
        <link rel="canonical" href="https://kodekit.in/tools/markdown-editor" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

      <Box
        sx={{
          py: fullscreen ? 0 : 4,
          minHeight: fullscreen ? "100vh" : "auto",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Container
          maxWidth={fullscreen ? false : "lg"}
          sx={{ px: fullscreen ? 0 : 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: "100%" }} // Ensure full width
          >
            {!fullscreen && (
              <>
                <Typography
                  variant="h3"
                  component="h1"
                  gutterBottom
                  fontWeight={700}
                >
                  Markdown Editor
                </Typography>
                <Typography variant="h6" color="text.secondary" paragraph>
                  Create and edit Markdown documents with live preview
                </Typography>
              </>
            )}

            <Paper
              elevation={fullscreen ? 0 : 2}
              sx={{
                p: fullscreen ? 0 : { xs: 1, sm: 2 },
                borderRadius: fullscreen ? 0 : 2,
                overflow: "hidden",
                height: fullscreen ? "100vh" : "auto",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {/* Document Title */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  px: fullscreen ? 2 : 0,
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  pb: 1,
                }}
              >
                <TextField
                  variant="standard"
                  placeholder="Document Title"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  sx={{
                    flexGrow: 1,
                    "& .MuiInputBase-input": {
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      padding: "4px 0",
                    },
                    "& .MuiInput-underline:before": {
                      borderBottomColor: "transparent",
                    },
                  }}
                />

                <Tooltip title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                  <IconButton onClick={toggleFullscreen} size="small">
                    {fullscreen ? <Minimize /> : <Maximize />}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Toolbar */}
              <Paper
                elevation={0}
                sx={{
                  mb: 2,
                  p: 1,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.03)",
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`,
                  overflowX: "auto",
                  display: "flex",
                  flexWrap: "nowrap",
                  px: fullscreen ? 2 : 1,
                  justifyContent: "space-between", // Better spacing
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Tooltip title="Bold (Ctrl+B)">
                    <IconButton onClick={handleBold} size="small">
                      <Bold size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Italic (Ctrl+I)">
                    <IconButton onClick={handleItalic} size="small">
                      <Italic size={18} />
                    </IconButton>
                  </Tooltip>

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                  <Tooltip title="Heading 1 (Ctrl+Shift+1)">
                    <IconButton onClick={handleHeading1} size="small">
                      <Heading1 size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Heading 2 (Ctrl+Shift+2)">
                    <IconButton onClick={handleHeading2} size="small">
                      <Heading2 size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Heading 3 (Ctrl+Shift+3)">
                    <IconButton onClick={handleHeading3} size="small">
                      <Heading3 size={18} />
                    </IconButton>
                  </Tooltip>

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                  <Tooltip title="Bulleted List">
                    <IconButton onClick={handleUnorderedList} size="small">
                      <List size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Numbered List">
                    <IconButton onClick={handleOrderedList} size="small">
                      <ListOrdered size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Task List">
                    <IconButton onClick={handleCheckbox} size="small">
                      <CheckSquare size={18} />
                    </IconButton>
                  </Tooltip>

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                  <Tooltip title="Link">
                    <IconButton onClick={handleLink} size="small">
                      <LinkIcon size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Image">
                    <IconButton onClick={handleImage} size="small">
                      <Image size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Code Block">
                    <IconButton onClick={handleCode} size="small">
                      <Code size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Blockquote">
                    <IconButton onClick={handleBlockquote} size="small">
                      <Quote size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Horizontal Rule">
                    <IconButton onClick={handleHorizontalRule} size="small">
                      <Minus size={18} />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Table">
                    <IconButton onClick={handleTable} size="small">
                      <Table size={18} />
                    </IconButton>
                  </Tooltip>

                  <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

                  <Tooltip title="Undo (Ctrl+Z)">
                    <span>
                      <IconButton
                        onClick={handleUndo}
                        size="small"
                        disabled={undoStack.length === 0}
                      >
                        <Undo size={18} />
                      </IconButton>
                    </span>
                  </Tooltip>

                  <Tooltip title="Redo (Ctrl+Shift+Z)">
                    <span>
                      <IconButton
                        onClick={handleRedo}
                        size="small"
                        disabled={redoStack.length === 0}
                      >
                        <Redo size={18} />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, newMode) => newMode && setViewMode(newMode)}
                    size="small"
                    aria-label="view mode"
                  >
                    <ToggleButton value="edit" aria-label="edit mode">
                      <Code size={16} />
                    </ToggleButton>
                    <ToggleButton value="split" aria-label="split mode">
                      <FileText size={16} />
                    </ToggleButton>
                    <ToggleButton value="preview" aria-label="preview mode">
                      <Eye size={16} />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Paper>

              {/* Editor and Preview */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  overflow: "hidden",
                  px: fullscreen ? 2 : 0,
                  mt: 2, // Add margin top for better spacing
                }}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{
                    flexGrow: 1,
                    height: fullscreen ? "calc(100vh - 220px)" : 500, // Set consistent height at container level
                  }}
                >
                  {/* Editor */}
                  {(viewMode === "edit" || viewMode === "split") && (
                    <Grid
                      item
                      xs={12}
                      md={viewMode === "split" ? 6 : 12}
                      sx={{
                        height: "100%",
                        display: "flex", // Add flex display
                      }}
                    >
                      <Box
                        ref={editorRef}
                        sx={{
                          flexGrow: 1, // Fill available space
                          display: "flex",
                          flexDirection: "column",
                          overflow: "auto",
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                        }}
                      >
                        <TextField
                          multiline
                          fullWidth
                          variant="outlined"
                          value={markdown}
                          onChange={handleMarkdownChange}
                          placeholder="Write your markdown here..."
                          InputProps={{
                            sx: {
                              fontFamily: '"Roboto Mono", monospace',
                              fontSize: "0.9rem",
                              height: "100%",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "transparent",
                                },
                            },
                          }}
                          sx={{
                            flexGrow: 1,
                            "& .MuiInputBase-root": {
                              height: "100%",
                            },
                            "& .MuiInputBase-inputMultiline": {
                              height: "100% !important",
                              overflow: "auto !important",
                              whiteSpace: settings.wordWrap
                                ? "pre-wrap"
                                : "pre",
                            },
                          }}
                          spellCheck={settings.spellCheck}
                          inputProps={{
                            style: {
                              tabSize: settings.tabSize,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  )}

                  {/* Preview */}
                  {(viewMode === "preview" || viewMode === "split") && (
                    <Grid
                      item
                      xs={12}
                      md={viewMode === "split" ? 6 : 12}
                      sx={{
                        height: "100%",
                        display: "flex", // Add flex display
                      }}
                    >
                      <Box
                        ref={previewRef}
                        sx={{
                          flexGrow: 1, // Fill available space
                          overflow: "auto",
                          p: 2,
                          backgroundColor: settings.darkPreview
                            ? theme.palette.mode === "dark"
                              ? "rgba(0,0,0,0.3)"
                              : "rgba(0,0,0,0.05)"
                            : theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(255,255,255,0.8)",
                          borderRadius: 1,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Box
                          className="markdown-preview"
                          sx={{
                            "& h1, & h2, & h3, & h4, & h5, & h6": {
                              borderBottom: `1px solid ${theme.palette.divider}`,
                              paddingBottom: 1,
                              marginBottom: 2,
                            },
                            "& a": {
                              color: theme.palette.primary.main,
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            },
                            "& img": {
                              maxWidth: "100%",
                              height: "auto",
                            },
                            "& blockquote": {
                              borderLeft: `4px solid ${theme.palette.primary.main}`,
                              paddingLeft: 2,
                              margin: 0,
                              marginBottom: 2,
                              color: theme.palette.text.secondary,
                            },
                            "& pre": {
                              padding: 2,
                              borderRadius: 1,
                              overflow: "auto",
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(0,0,0,0.3)"
                                  : "rgba(0,0,0,0.05)",
                            },
                            "& code": {
                              fontFamily: '"Roboto Mono", monospace',
                              fontSize: "0.85em",
                              padding: "0.2em 0.4em",
                              borderRadius: 1,
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.05)",
                            },
                            "& table": {
                              borderCollapse: "collapse",
                              width: "100%",
                              marginBottom: 2,
                            },
                            "& th, & td": {
                              border: `1px solid ${theme.palette.divider}`,
                              padding: 1,
                            },
                            "& th": {
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.05)",
                            },
                            "& ul, & ol": {
                              paddingLeft: 3,
                            },
                            "& hr": {
                              border: "none",
                              height: "1px",
                              backgroundColor: theme.palette.divider,
                              margin: "1.5em 0",
                            },
                            "& .task-list-item": {
                              listStyle: "none",
                            },
                            "& .task-list-item-checkbox": {
                              marginRight: 1,
                            },
                          }}
                        >
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={
                                      theme.palette.mode === "dark"
                                        ? vscDarkPlus
                                        : vs
                                    }
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {markdown}
                          </ReactMarkdown>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {/* Bottom Toolbar */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    p: 1,
                    borderTop: `1px solid ${theme.palette.divider}`,
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.02)",
                    borderRadius: 1,
                  }}
                >
                  {/* Statistics */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: "medium" }}
                  >
                    {wordCount} words | {charCount} characters
                  </Typography>

                  {/* Actions */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Tooltip title="Copy to Clipboard">
                      <IconButton onClick={handleCopy} size="small">
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Paste from Clipboard">
                      <IconButton onClick={handlePaste} size="small">
                        <ClipboardPaste size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Clear Editor">
                      <IconButton onClick={handleClear} size="small">
                        <Trash2 size={18} />
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={historyAnchorEl}
                      open={Boolean(historyAnchorEl)}
                      onClose={() => setHistoryAnchorEl(null)}
                    >
                      {history.length === 0 ? (
                        <MenuItem disabled>No saved documents</MenuItem>
                      ) : (
                        history.map((item, index) => (
                          <MenuItem
                            key={index}
                            onClick={() => loadFromHistory(item)}
                          >
                            <Typography variant="body2" noWrap>
                              {item.title || "Untitled"} -{" "}
                              {new Date(item.timestamp).toLocaleString()}
                            </Typography>
                          </MenuItem>
                        ))
                      )}
                    </Menu>

                    <Tooltip title="Download Markdown">
                      <IconButton onClick={handleExport} size="small">
                        <Download size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Import Markdown">
                      <IconButton component="label" size="small">
                        <Upload size={18} />
                        <input
                          type="file"
                          hidden
                          accept=".md,.markdown,.txt"
                          onChange={handleImport}
                        />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Settings">
                      <IconButton
                        onClick={() => setSettingsOpen(true)}
                        size="small"
                      >
                        <Settings size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Help">
                      <IconButton
                        onClick={() =>
                          window.open(
                            "https://www.markdownguide.org/basic-syntax/",
                            "_blank"
                          )
                        }
                        size="small"
                      >
                        <HelpCircle size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* Settings Dialog */}
              <Dialog
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
              >
                <DialogTitle>Editor Settings</DialogTitle>
                <DialogContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      pt: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.autoSave}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              autoSave: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Auto-save content"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.syncScroll}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              syncScroll: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Sync scrolling"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.darkPreview}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              darkPreview: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Dark preview background"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.spellCheck}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              spellCheck: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Spell check"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.wordWrap}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              wordWrap: e.target.checked,
                            })
                          }
                        />
                      }
                      label="Word wrap"
                    />

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography>Tab Size:</Typography>
                      <ToggleButtonGroup
                        value={settings.tabSize.toString()}
                        exclusive
                        onChange={(_, value) =>
                          value &&
                          setSettings({ ...settings, tabSize: parseInt(value) })
                        }
                        size="small"
                      >
                        <ToggleButton value="2">2</ToggleButton>
                        <ToggleButton value="4">4</ToggleButton>
                        <ToggleButton value="8">8</ToggleButton>
                      </ToggleButtonGroup>
                    </Box>
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSettingsOpen(false)}>Close</Button>
                </DialogActions>
              </Dialog>

              {/* Snackbar for notifications */}
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Paper>
            <AdSense adSlot="6613251015" />
            {/* Added usage and benefits information */}
            <Box sx={{ mb: 3, mt: 1 }}>
              <Typography variant="body1" paragraph>
                Our Markdown Editor is a powerful tool for content creators,
                developers, and writers who need to create well-formatted
                documents quickly. Markdown is a lightweight markup language
                that allows you to write using an easy-to-read, easy-to-write
                plain text format that converts to structurally valid HTML.
              </Typography>

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Key Features & Benefits:
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      height: "100%",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      For Content Creation:
                    </Typography>
                    <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                      <li>
                        Live preview to see your formatted content in real-time
                      </li>
                      <li>Support for tables, lists, code blocks, and more</li>
                      <li>
                        Easy text formatting with intuitive toolbar buttons
                      </li>
                      <li>
                        Document statistics to track your writing progress
                      </li>
                    </ul>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      height: "100%",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(0,0,0,0.02)",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      For Developers:
                    </Typography>
                    <ul style={{ paddingLeft: "1.5rem", marginTop: "0.5rem" }}>
                      <li>Syntax highlighting for code blocks</li>
                      <li>Support for mathematical equations with KaTeX</li>
                      <li>Export to markdown files for use in documentation</li>
                      <li>Keyboard shortcuts for efficient editing</li>
                    </ul>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Get started by typing in the editor below or importing an
                existing markdown file. Your work is automatically saved in your
                browser.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Container>
  );
};

export default MarkdownEditor;
