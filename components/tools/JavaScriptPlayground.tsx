"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  useTheme,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Play,
  RotateCcw,
  Copy,
  Download,
  Trash2,
  CheckCircle,
  Code,
  Terminal,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface ConsoleLog {
  type: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: number;
}

const JavaScriptPlayground = () => {
  const theme = useTheme();
  const [code, setCode] = useState(`// Welcome to JavaScript Playground!
// Write your JavaScript code here and click Run

console.log("Hello, World!");

// Try some examples:
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Calculate factorial
function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}
console.log("Factorial of 5:", factorial(5));
`);
  const [output, setOutput] = useState<ConsoleLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const captureConsole = () => {
    const logs: ConsoleLog[] = [];
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
    };

    // Override console methods
    console.log = (...args: any[]) => {
      logs.push({
        type: "log",
        message: args.map((arg) => formatValue(arg)).join(" "),
        timestamp: Date.now(),
      });
      originalConsole.log(...args);
    };

    console.error = (...args: any[]) => {
      logs.push({
        type: "error",
        message: args.map((arg) => formatValue(arg)).join(" "),
        timestamp: Date.now(),
      });
      originalConsole.error(...args);
    };

    console.warn = (...args: any[]) => {
      logs.push({
        type: "warn",
        message: args.map((arg) => formatValue(arg)).join(" "),
        timestamp: Date.now(),
      });
      originalConsole.warn(...args);
    };

    console.info = (...args: any[]) => {
      logs.push({
        type: "info",
        message: args.map((arg) => formatValue(arg)).join(" "),
        timestamp: Date.now(),
      });
      originalConsole.info(...args);
    };

    return { logs, originalConsole };
  };

  const formatValue = (value: any): string => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {
        return String(value);
      }
    }
    return String(value);
  };

  const runCode = () => {
    setIsRunning(true);
    const { logs, originalConsole } = captureConsole();

    try {
      // Create a new function to execute the code in isolation
      const executeCode = new Function(code);
      const result = executeCode();

      // If there's a return value and no console output, show the result
      if (result !== undefined) {
        logs.push({
          type: "log",
          message: formatValue(result),
          timestamp: Date.now(),
        });
      }

      // Add success message if no output at all
      if (logs.length === 0) {
        logs.push({
          type: "info",
          message: "Code executed successfully (no output)",
          timestamp: Date.now(),
        });
      }
    } catch (error: any) {
      logs.push({
        type: "error",
        message: `Error: ${error.message}`,
        timestamp: Date.now(),
      });
    } finally {
      // Restore original console methods
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;

      setOutput(logs);
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(`// Write your JavaScript code here
console.log("Hello, World!");
`);
    setOutput([]);
  };

  const handleClear = () => {
    setOutput([]);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "script.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }

    // Ctrl/Cmd + / to toggle comment
    if ((e.ctrlKey || e.metaKey) && e.key === "/") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Get the lines that are selected
      const beforeSelection = code.substring(0, start);
      const afterSelection = code.substring(end);

      // Find the start of the first line in selection
      const lineStart = beforeSelection.lastIndexOf("\n") + 1;
      const lineEnd = end + afterSelection.indexOf("\n");
      const fullLineEnd = lineEnd === end - 1 ? code.length : lineEnd;

      // Get all lines in the selection
      const selectedText = code.substring(lineStart, fullLineEnd);
      const lines = selectedText.split("\n");

      // Check if all non-empty lines are commented
      const allCommented = lines
        .filter((line) => line.trim().length > 0)
        .every((line) => line.trim().startsWith("//"));

      let newLines: string[];
      if (allCommented) {
        // Uncomment: remove // from the start of each line
        newLines = lines.map((line) => {
          const trimmed = line.trimStart();
          if (trimmed.startsWith("//")) {
            const spaces = line.length - trimmed.length;
            const withoutComment = trimmed.substring(2).trimStart();
            return " ".repeat(spaces) + withoutComment;
          }
          return line;
        });
      } else {
        // Comment: add // to the start of each line
        newLines = lines.map((line) => {
          if (line.trim().length === 0) return line;
          const spaces = line.length - line.trimStart().length;
          return " ".repeat(spaces) + "// " + line.trimStart();
        });
      }

      const newSelectedText = newLines.join("\n");
      const newCode =
        code.substring(0, lineStart) +
        newSelectedText +
        code.substring(fullLineEnd);

      setCode(newCode);

      // Restore selection
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = lineStart;
          textareaRef.current.selectionEnd = lineStart + newSelectedText.length;
          textareaRef.current.focus();
        }
      }, 0);
    }

    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runCode();
    }
  };

  const getLogColor = (type: ConsoleLog["type"]) => {
    switch (type) {
      case "error":
        return "#ef4444"; // Red
      case "warn":
        return "#f59e0b"; // Orange
      case "info":
        return "#3b82f6"; // Blue
      default:
        return theme.palette.mode === "dark" ? "#10b981" : "#059669"; // Green
    }
  };

  const getLogBackground = (type: ConsoleLog["type"]) => {
    switch (type) {
      case "error":
        return theme.palette.mode === "dark"
          ? "rgba(239, 68, 68, 0.1)"
          : "rgba(239, 68, 68, 0.05)";
      case "warn":
        return theme.palette.mode === "dark"
          ? "rgba(245, 158, 11, 0.1)"
          : "rgba(245, 158, 11, 0.05)";
      case "info":
        return theme.palette.mode === "dark"
          ? "rgba(59, 130, 246, 0.1)"
          : "rgba(59, 130, 246, 0.05)";
      default:
        return "transparent";
    }
  };

  const getLogIcon = (type: ConsoleLog["type"]) => {
    switch (type) {
      case "error":
        return "❌";
      case "warn":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "▶";
    }
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 8 }} id="main-content">
        <Navigation />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box component="header" sx={{ mb: 4 }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              fontWeight={700}
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.2,
              }}
            >
              JavaScript Playground - Run JS Code Online Free
            </Typography>
            <Typography
              variant="h2"
              component="h2"
              color="text.secondary"
              paragraph
              sx={{
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
                fontWeight: 400,
                mt: 2,
              }}
            >
              Test JavaScript code instantly in your browser. Write, run, and
              debug JS with real-time console output. Perfect for learning,
              testing snippets, and quick prototyping.
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<Play size={18} />}
              onClick={runCode}
              disabled={isRunning}
              sx={{
                backgroundColor: "#10b981",
                "&:hover": { backgroundColor: "#059669" },
              }}
            >
              Run Code
            </Button>
            <Button
              variant="outlined"
              startIcon={<RotateCcw size={18} />}
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              startIcon={<Copy size={18} />}
              onClick={handleCopyCode}
            >
              Copy
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download size={18} />}
              onClick={handleDownload}
            >
              Download
            </Button>
            <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
              <Chip
                label="Ctrl/Cmd + Enter to Run"
                size="small"
                variant="outlined"
              />
              <Chip
                label="Ctrl/Cmd + / to Comment"
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Code Editor */}
            <Grid item xs={12} lg={6}>
              <Paper
                elevation={0}
                sx={{
                  p: 0,
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    backgroundColor: theme.palette.background.default,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Code size={18} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      JavaScript Editor
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {code.split("\n").length} lines
                  </Typography>
                </Box>
                <Box
                  component="textarea"
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck={false}
                  sx={{
                    width: "100%",
                    minHeight: "500px",
                    p: 2,
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
                    color:
                      theme.palette.mode === "dark" ? "#d4d4d4" : "#24292e",
                    "&::placeholder": {
                      color: theme.palette.text.disabled,
                    },
                    "&::selection": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#264f78" : "#add6ff",
                    },
                  }}
                  placeholder="// Write your JavaScript code here..."
                />
              </Paper>
            </Grid>

            {/* Console Output */}
            <Grid item xs={12} lg={6}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    backgroundColor: theme.palette.background.default,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Terminal size={18} />
                    <Typography variant="subtitle2" fontWeight={600}>
                      Console Output
                    </Typography>
                  </Box>
                  <Tooltip title="Clear console">
                    <IconButton size="small" onClick={handleClear}>
                      <Trash2 size={16} />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    minHeight: "500px",
                    maxHeight: "500px",
                    overflowY: "auto",
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    fontSize: "13px",
                  }}
                >
                  {output.length === 0 ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic" }}
                    >
                      Console output will appear here...
                    </Typography>
                  ) : (
                    output.map((log, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 1,
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: getLogBackground(log.type),
                          border: `1px solid ${
                            log.type === "log"
                              ? "transparent"
                              : getLogColor(log.type) + "40"
                          }`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "16px",
                              lineHeight: 1,
                              mt: 0.25,
                            }}
                          >
                            {getLogIcon(log.type)}
                          </Typography>
                          <Typography
                            component="pre"
                            sx={{
                              flex: 1,
                              m: 0,
                              color: getLogColor(log.type),
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              fontFamily: "inherit",
                              fontSize: "inherit",
                              fontWeight: log.type === "error" ? 500 : 400,
                            }}
                          >
                            {log.message}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <AdSense adSlot="3146398237" />

          {/* Features Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mt: 4,
            }}
          >
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.75rem", mb: 3 }}
            >
              Features
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Play size={40} color={theme.palette.primary.main} />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Instant Execution
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Run JavaScript code instantly in your browser with no
                      setup required.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Terminal size={40} color={theme.palette.success.main} />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Console Output
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      See console.log, errors, warnings, and info messages in
                      real-time.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Code size={40} color={theme.palette.warning.main} />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      Syntax Highlighting
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Clean monospace font with proper indentation support.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <CheckCircle size={40} color={theme.palette.info.main} />
                    <Typography
                      variant="h6"
                      sx={{ mt: 2, mb: 1, fontWeight: 600 }}
                    >
                      No Installation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Works entirely in your browser. No downloads or setup
                      needed.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>

          {/* Examples Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mt: 4,
            }}
          >
            <Typography
              variant="h3"
              component="h3"
              gutterBottom
              fontWeight={600}
              sx={{ fontSize: "1.75rem", mb: 3 }}
            >
              Example Code Snippets
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Array Methods
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
                    borderRadius: 1,
                    overflow: "auto",
                    fontSize: "13px",
                    fontFamily: "'Fira Code', monospace",
                    color:
                      theme.palette.mode === "dark" ? "#d4d4d4" : "#24292e",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {`const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((a, b) => a + b, 0);

console.log("Doubled:", doubled);
console.log("Evens:", evens);
console.log("Sum:", sum);`}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Async/Await
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
                    borderRadius: 1,
                    overflow: "auto",
                    fontSize: "13px",
                    fontFamily: "'Fira Code', monospace",
                    color:
                      theme.palette.mode === "dark" ? "#d4d4d4" : "#24292e",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {`async function fetchData() {
  console.log("Fetching data...");
  
  // Simulate API call
  await new Promise(resolve => 
    setTimeout(resolve, 1000)
  );
  
  console.log("Data fetched!");
  return { id: 1, name: "John" };
}

fetchData().then(data => 
  console.log("Result:", data)
);`}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Object Manipulation
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
                    borderRadius: 1,
                    overflow: "auto",
                    fontSize: "13px",
                    fontFamily: "'Fira Code', monospace",
                    color:
                      theme.palette.mode === "dark" ? "#d4d4d4" : "#24292e",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {`const user = {
  name: "Alice",
  age: 30,
  city: "New York"
};

// Destructuring
const { name, age } = user;
console.log(name, age);

// Spread operator
const updated = { ...user, age: 31 };
console.log("Updated:", updated);`}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Classes & Inheritance
                </Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 2,
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#1e1e1e" : "#f8f9fa",
                    borderRadius: 1,
                    overflow: "auto",
                    fontSize: "13px",
                    fontFamily: "'Fira Code', monospace",
                    color:
                      theme.palette.mode === "dark" ? "#d4d4d4" : "#24292e",
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  {`class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(\`\${this.name} makes a sound\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} barks\`);
  }
}

const dog = new Dog("Rex");
dog.speak();`}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Tips Section */}
          <Alert severity="info" sx={{ mt: 4 }}>
            <Typography variant="body2" gutterBottom fontWeight={600}>
              💡 Pro Tips:
            </Typography>
            <Typography variant="body2" component="div">
              • Press <strong>Ctrl/Cmd + Enter</strong> to run code quickly
              <br />• Press <strong>Ctrl/Cmd + /</strong> to comment/uncomment
              lines
              <br />• Use <strong>Tab</strong> for indentation
              <br />
              • All modern JavaScript features (ES6+) are supported
              <br />
              • Code runs in an isolated environment for safety
              <br />
              • Use console.log(), console.error(), console.warn() for output
              <br />• Last expression result is automatically displayed (e.g.,{" "}
              <code>2 + 2</code> shows <code>4</code>)
            </Typography>
          </Alert>

          <AdSense adSlot="4201858400" />
        </motion.div>
      </Container>
    </>
  );
};

export default JavaScriptPlayground;
