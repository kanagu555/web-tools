/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useCallback, useMemo, useReducer } from "react";
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
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Code,
  Copy,
  Check,
  Trash2,
  ClipboardPaste,
  ArrowLeftRight,
  AlertCircle,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

// Types
interface DiffResult {
  type: "added" | "removed" | "modified" | "unchanged";
  path: string;
  left: any;
  right: any;
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

interface JsonCompareState {
  leftInput: string;
  rightInput: string;
  diffResults: DiffResult[];
  error: string | null;
  isLoading: boolean;
  copied: boolean;
  snackbar: SnackbarState;
  viewMode: "visual" | "text";
  indentSize: number;
}

type JsonCompareAction =
  | { type: "SET_LEFT_INPUT"; payload: string }
  | { type: "SET_RIGHT_INPUT"; payload: string }
  | { type: "SET_DIFF_RESULTS"; payload: DiffResult[] }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_COPIED"; payload: boolean }
  | { type: "SHOW_SNACKBAR"; payload: Omit<SnackbarState, "open"> }
  | { type: "HIDE_SNACKBAR" }
  | { type: "SET_VIEW_MODE"; payload: "visual" | "text" }
  | { type: "SET_INDENT_SIZE"; payload: number }
  | { type: "SWAP_INPUTS" }
  | { type: "CLEAR"; payload: "left" | "right" | "both" };

const initialState: JsonCompareState = {
  leftInput: "",
  rightInput: "",
  diffResults: [],
  error: null,
  isLoading: false,
  copied: false,
  snackbar: {
    open: false,
    message: "",
    severity: "success",
  },
  viewMode: "visual",
  indentSize: 2,
};

const jsonCompareReducer = (
  state: JsonCompareState,
  action: JsonCompareAction
): JsonCompareState => {
  switch (action.type) {
    case "SET_LEFT_INPUT":
      return { ...state, leftInput: action.payload };
    case "SET_RIGHT_INPUT":
      return { ...state, rightInput: action.payload };
    case "SET_DIFF_RESULTS":
      return { ...state, diffResults: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_COPIED":
      return { ...state, copied: action.payload };
    case "SHOW_SNACKBAR":
      return {
        ...state,
        snackbar: {
          open: true,
          message: action.payload.message,
          severity: action.payload.severity,
        },
      };
    case "HIDE_SNACKBAR":
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: false,
        },
      };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_INDENT_SIZE":
      return { ...state, indentSize: action.payload };
    case "SWAP_INPUTS":
      return {
        ...state,
        leftInput: state.rightInput,
        rightInput: state.leftInput,
      };
    case "CLEAR":
      return {
        ...state,
        leftInput:
          action.payload === "left" || action.payload === "both"
            ? ""
            : state.leftInput,
        rightInput:
          action.payload === "right" || action.payload === "both"
            ? ""
            : state.rightInput,
        diffResults: action.payload === "both" ? [] : state.diffResults,
        error: action.payload === "both" ? null : state.error,
      };
    default:
      return state;
  }
};

const JsonCompare: React.FC = () => {
  const theme = useTheme();
  const [state, dispatch] = useReducer(jsonCompareReducer, initialState);

  const {
    leftInput,
    rightInput,
    diffResults,
    error,
    isLoading,
    copied,
    snackbar,
    viewMode,
    indentSize,
  } = state;

  // Helper functions
  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      dispatch({ type: "SHOW_SNACKBAR", payload: { message, severity } });
    },
    []
  );

  const handleSnackbarClose = useCallback(() => {
    dispatch({ type: "HIDE_SNACKBAR" });
  }, []);

  // Parse JSON safely
  const parseJson = useCallback((input: string) => {
    if (input.trim() === "") return null;

    try {
      return JSON.parse(input);
    } catch (e) {
      // Try to evaluate as JavaScript object notation (safer than eval)
      try {
        // Using Function constructor instead of eval for better security
        return new Function(`"use strict"; return (${input})`)();
      } catch (evalError) {
        throw new Error(
          "Invalid JSON format: Could not parse as JSON or JavaScript object"
        );
      }
    }
  }, []);

  // Fetch JSON from URL
  const fetchJsonFromUrl = useCallback(
    async (url: string, side: "left" | "right") => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text();

        if (side === "left") {
          dispatch({ type: "SET_LEFT_INPUT", payload: data });
        } else {
          dispatch({ type: "SET_RIGHT_INPUT", payload: data });
        }

        showSnackbar(`Successfully loaded JSON from ${url}`, "success");
      } catch (err) {
        showSnackbar(
          `Failed to load JSON from URL: ${
            err instanceof Error ? err.message : String(err)
          }`,
          "error"
        );
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [showSnackbar]
  );

  // Find differences between two JSON objects
  const findDifferences = useCallback(
    (left: any, right: any, path = ""): DiffResult[] => {
      const differences: DiffResult[] = [];

      // If types are different, mark as modified
      if (typeof left !== typeof right) {
        differences.push({
          type: "modified",
          path: path,
          left: left,
          right: right,
        });
        return differences;
      }

      // If both are null or undefined, they're equal
      if (left === null && right === null) return differences;
      if (left === undefined && right === undefined) return differences;

      // If one is null/undefined but the other isn't, mark as modified
      if (
        left === null ||
        right === null ||
        left === undefined ||
        right === undefined
      ) {
        differences.push({
          type: "modified",
          path: path,
          left: left,
          right: right,
        });
        return differences;
      }

      // If primitive values are different, mark as modified
      if (typeof left !== "object" && left !== right) {
        differences.push({
          type: "modified",
          path: path,
          left: left,
          right: right,
        });
        return differences;
      }

      // If both are arrays
      if (Array.isArray(left) && Array.isArray(right)) {
        // Check for added or removed items
        const maxLength = Math.max(left.length, right.length);
        for (let i = 0; i < maxLength; i++) {
          const currentPath = path ? `${path}[${i}]` : `[${i}]`;

          if (i >= left.length) {
            // Item exists in right but not in left (added)
            differences.push({
              type: "added",
              path: currentPath,
              left: undefined,
              right: right[i],
            });
          } else if (i >= right.length) {
            // Item exists in left but not in right (removed)
            differences.push({
              type: "removed",
              path: currentPath,
              left: left[i],
              right: undefined,
            });
          } else {
            // Item exists in both, recursively compare
            differences.push(
              ...findDifferences(left[i], right[i], currentPath)
            );
          }
        }
        return differences;
      }

      // If both are objects (but not arrays)
      if (typeof left === "object" && typeof right === "object") {
        // Get all keys from both objects
        const allKeys = new Set([...Object.keys(left), ...Object.keys(right)]);

        // Check each key
        for (const key of allKeys) {
          const currentPath = path ? `${path}.${key}` : key;

          if (!(key in left)) {
            // Key exists in right but not in left (added)
            differences.push({
              type: "added",
              path: currentPath,
              left: undefined,
              right: right[key],
            });
          } else if (!(key in right)) {
            // Key exists in left but not in right (removed)
            differences.push({
              type: "removed",
              path: currentPath,
              left: left[key],
              right: undefined,
            });
          } else {
            // Key exists in both, recursively compare values
            differences.push(
              ...findDifferences(left[key], right[key], currentPath)
            );
          }
        }
        return differences;
      }

      // If we get here, the values are equal
      return differences;
    },
    []
  );

  // Compare JSON objects
  const compareJson = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      // Parse both inputs
      const leftObj = parseJson(leftInput);
      const rightObj = parseJson(rightInput);

      if (leftObj === null && rightObj === null) {
        dispatch({ type: "SET_DIFF_RESULTS", payload: [] });
        showSnackbar("Both inputs are empty", "info");
        return;
      }

      if (leftObj === null) {
        dispatch({ type: "SET_ERROR", payload: "Left input is empty" });
        return;
      }

      if (rightObj === null) {
        dispatch({ type: "SET_ERROR", payload: "Right input is empty" });
        return;
      }

      // Format the JSON inputs for better readability
      if (leftObj) {
        const formattedLeftJson = JSON.stringify(leftObj, null, indentSize);
        dispatch({ type: "SET_LEFT_INPUT", payload: formattedLeftJson });
      }

      if (rightObj) {
        const formattedRightJson = JSON.stringify(rightObj, null, indentSize);
        dispatch({ type: "SET_RIGHT_INPUT", payload: formattedRightJson });
      }

      // Find differences
      const differences = findDifferences(leftObj, rightObj);
      dispatch({ type: "SET_DIFF_RESULTS", payload: differences });

      if (differences.length === 0) {
        showSnackbar("The JSON documents are identical", "success");
      } else {
        showSnackbar(`Found ${differences.length} differences`, "info");
      }
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Error comparing JSON",
      });
      dispatch({ type: "SET_DIFF_RESULTS", payload: [] });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [
    leftInput,
    rightInput,
    parseJson,
    findDifferences,
    showSnackbar,
    indentSize,
  ]);

  // Handle clear action
  const handleClear = useCallback((side: "left" | "right" | "both") => {
    dispatch({ type: "CLEAR", payload: side });
  }, []);

  // Handle paste action
  const handlePaste = useCallback(
    async (side: "left" | "right") => {
      try {
        const text = await navigator.clipboard.readText();
        if (side === "left") {
          dispatch({ type: "SET_LEFT_INPUT", payload: text });
        } else {
          dispatch({ type: "SET_RIGHT_INPUT", payload: text });
        }
        showSnackbar("Text pasted from clipboard", "success");
      } catch (err) {
        showSnackbar(
          "Failed to read from clipboard. Make sure you've granted permission.",
          "error"
        );
      }
    },
    [showSnackbar]
  );

  // Handle swap action
  const handleSwap = useCallback(() => {
    dispatch({ type: "SWAP_INPUTS" });
    showSnackbar("Swapped left and right inputs", "info");
  }, [showSnackbar]);

  // Handle copy action
  const handleCopy = useCallback(() => {
    const diffText = diffResults
      .map((diff) => {
        const typeSymbol =
          diff.type === "added"
            ? "+"
            : diff.type === "removed"
            ? "-"
            : diff.type === "modified"
            ? "~"
            : " ";

        return `${typeSymbol} ${diff.path}: ${JSON.stringify(
          diff.left
        )} → ${JSON.stringify(diff.right)}`;
      })
      .join("\n");

    navigator.clipboard.writeText(diffText);
    dispatch({ type: "SET_COPIED", payload: true });
    setTimeout(() => dispatch({ type: "SET_COPIED", payload: false }), 2000);
    showSnackbar("Diff results copied to clipboard", "success");
  }, [diffResults, showSnackbar]);

  // Style helpers
  const getColorForDiffType = useCallback(
    (type: string) => {
      switch (type) {
        case "added":
          return theme.palette.mode === "dark" ? "#2e7d32" : "#e8f5e9";
        case "removed":
          return theme.palette.mode === "dark" ? "#c62828" : "#ffebee";
        case "modified":
          return theme.palette.mode === "dark" ? "#1565c0" : "#e3f2fd";
        default:
          return "transparent";
      }
    },
    [theme.palette.mode]
  );

  const getTextColorForDiffType = useCallback(
    (type: string) => {
      if (theme.palette.mode === "dark") return "#ffffff";

      switch (type) {
        case "added":
          return "#2e7d32";
        case "removed":
          return "#c62828";
        case "modified":
          return "#1565c0";
        default:
          return theme.palette.text.primary;
      }
    },
    [theme.palette.mode, theme.palette.text.primary]
  );

  const getDiffTypeIcon = useCallback((type: string) => {
    switch (type) {
      case "added":
        return "+";
      case "removed":
        return "-";
      case "modified":
        return "~";
      default:
        return " ";
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Process URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const leftParam = params.get("left");
    const rightParam = params.get("right");

    if (leftParam) {
      try {
        // Check if it's a URL or base64 data
        if (leftParam.startsWith("http")) {
          fetchJsonFromUrl(leftParam, "left");
        } else if (leftParam.startsWith("data:base64,")) {
          const base64Data = leftParam.replace("data:base64,", "");
          try {
            const decodedData = atob(base64Data);
            dispatch({ type: "SET_LEFT_INPUT", payload: decodedData });
          } catch (e) {
            showSnackbar(
              "Failed to decode base64 data for left input",
              "error"
            );
          }
        } else {
          try {
            const decodedJson = decodeURIComponent(leftParam);
            dispatch({ type: "SET_LEFT_INPUT", payload: decodedJson });
          } catch (e) {
            showSnackbar(
              "Failed to decode URL parameter for left input",
              "error"
            );
          }
        }
      } catch (err) {
        console.error("Failed to parse left JSON from URL", err);
        showSnackbar("Failed to parse left JSON from URL parameter", "error");
      }
    }

    if (rightParam) {
      try {
        // Check if it's a URL or base64 data
        if (rightParam.startsWith("http")) {
          fetchJsonFromUrl(rightParam, "right");
        } else if (rightParam.startsWith("data:base64,")) {
          const base64Data = rightParam.replace("data:base64,", "");
          try {
            const decodedData = atob(base64Data);
            dispatch({ type: "SET_RIGHT_INPUT", payload: decodedData });
          } catch (e) {
            showSnackbar(
              "Failed to decode base64 data for right input",
              "error"
            );
          }
        } else {
          try {
            const decodedJson = decodeURIComponent(rightParam);
            dispatch({ type: "SET_RIGHT_INPUT", payload: decodedJson });
          } catch (e) {
            showSnackbar(
              "Failed to decode URL parameter for right input",
              "error"
            );
          }
        }
      } catch (err) {
        console.error("Failed to parse right JSON from URL", err);
        showSnackbar("Failed to parse right JSON from URL parameter", "error");
      }
    }

    // If both parameters are present, compare automatically after a short delay
    if (leftParam && rightParam) {
      const timer = setTimeout(() => compareJson(), 800);
      return () => clearTimeout(timer);
    }
  }, [fetchJsonFromUrl, showSnackbar, compareJson]);

  // Memoized text diff output
  const textDiffOutput = useMemo(() => {
    return diffResults
      .map((diff) => {
        const typeSymbol =
          diff.type === "added"
            ? "+"
            : diff.type === "removed"
            ? "-"
            : diff.type === "modified"
            ? "~"
            : " ";

        return `${typeSymbol} ${diff.path || "(root)"}: ${JSON.stringify(
          diff.left
        )} → ${JSON.stringify(diff.right)}`;
      })
      .join("\n");
  }, [diffResults]);

  // Render JSON input field
  const renderJsonInput = useCallback(
    (side: "left" | "right") => {
      const value = side === "left" ? leftInput : rightInput;
      const setValue =
        side === "left"
          ? (val: string) => dispatch({ type: "SET_LEFT_INPUT", payload: val })
          : (val: string) =>
              dispatch({ type: "SET_RIGHT_INPUT", payload: val });
      const hasError =
        !!error && error.includes(side === "left" ? "Left" : "Right");
      const errorText = hasError ? error : "";

      return (
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {side === "left" ? "Left JSON" : "Right JSON"}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Paste from clipboard">
                <IconButton size="small" onClick={() => handlePaste(side)}>
                  <ClipboardPaste size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear input">
                <IconButton
                  size="small"
                  onClick={() => handleClear(side)}
                  disabled={!value}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <TextField
            multiline
            fullWidth
            rows={15}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={hasError}
            helperText={errorText}
            placeholder={`Paste your ${
              side === "left" ? "first" : "second"
            } JSON document here...`}
            sx={{
              fontFamily: "monospace",
              "& .MuiOutlinedInput-root": {
                backgroundColor: theme.palette.background.default,
              },
            }}
          />
        </Grid>
      );
    },
    [
      leftInput,
      rightInput,
      error,
      theme.palette.background.default,
      handlePaste,
      handleClear,
    ]
  );

  // Render visual diff item
  const renderVisualDiffItem = useCallback(
    (diff: DiffResult, index: number) => {
      return (
        <Box
          key={index}
          sx={{
            p: 1.5,
            borderBottom:
              index < diffResults.length - 1
                ? `1px solid ${theme.palette.divider}`
                : "none",
            backgroundColor: getColorForDiffType(diff.type),
            color: getTextColorForDiffType(diff.type),
          }}
        >
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                mr: 1,
                fontFamily: "monospace",
                fontSize: "1.2rem",
                lineHeight: 1,
              }}
            >
              {getDiffTypeIcon(diff.type)}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                {diff.path || "(root)"}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {diff.left !== undefined
                      ? typeof diff.left === "object"
                        ? JSON.stringify(diff.left, null, indentSize)
                        : String(diff.left)
                      : "(undefined)"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {diff.right !== undefined
                      ? typeof diff.right === "object"
                        ? JSON.stringify(diff.right, null, indentSize)
                        : String(diff.right)
                      : "(undefined)"}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      );
    },
    [
      diffResults.length,
      theme.palette.divider,
      getColorForDiffType,
      getTextColorForDiffType,
      getDiffTypeIcon,
      indentSize,
    ]
  );

  return (
    <Container maxWidth="xl">
      <Helmet>
        <title>JSON Compare Tool | KodeKit</title>
        <meta
          name="description"
          content="Compare two JSON documents and see the semantic differences between them. Identify added, removed, and modified properties."
        />
        <meta
          name="keywords"
          content="json compare, json diff, json comparison tool, semantic json diff, json difference, compare json objects, json validator, json compare, json diff tool, compare json files, json comparison online, online json diff, json validator compare, json difference checker, json deep compare, compare two json objects, json diff viewer, json comparison tool free, visual json diff, side by side json compare, json data comparator, api response compare, react json tool, json structure comparison, json diff algorithm, browser json compare, json diff online free, json format compare, json diff github, open source json diff, json compare and merge, json patch generator, visual diff for large json files"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            JSON Compare Tool
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            paragraph
          >
            Compare two JSON documents and see the semantic differences between
            them. Identify added, removed, and modified properties.
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              position: "relative",
            }}
          >
            {isLoading && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  zIndex: 1,
                  borderRadius: 2,
                }}
              >
                <CircularProgress />
              </Box>
            )}

            <Grid container spacing={3}>
              {renderJsonInput("left")}
              {renderJsonInput("right")}

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    mt: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Code />}
                    onClick={compareJson}
                    disabled={(!leftInput && !rightInput) || isLoading}
                  >
                    Compare JSON
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowLeftRight />}
                    onClick={handleSwap}
                    disabled={(!leftInput && !rightInput) || isLoading}
                  >
                    Swap Inputs
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Trash2 />}
                    onClick={() => handleClear("both")}
                    disabled={(!leftInput && !rightInput) || isLoading}
                  >
                    Clear All
                  </Button>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Indent Size:
                    </Typography>
                    <Select
                      value={indentSize}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_INDENT_SIZE",
                          payload: Number(e.target.value),
                        })
                      }
                      size="small"
                      sx={{ minWidth: 60 }}
                      disabled={isLoading}
                    >
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={8}>8</MenuItem>
                    </Select>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {error && (
            <Paper
              elevation={3}
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.error.light,
                color: theme.palette.error.contrastText,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AlertCircle size={20} />
                <Typography variant="body1">{error}</Typography>
              </Box>
            </Paper>
          )}

          {diffResults.length > 0 && (
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 4,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
              }}
              id="diff-results"
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Comparison Results</Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={
                      copied ? <Check size={16} /> : <Copy size={16} />
                    }
                    onClick={handleCopy}
                    disabled={isLoading}
                  >
                    {copied ? "Copied!" : "Copy Results"}
                  </Button>
                </Box>
              </Box>

              <Tabs
                value={viewMode}
                onChange={(_, newValue) =>
                  dispatch({
                    type: "SET_VIEW_MODE",
                    payload: newValue,
                  })
                }
                sx={{ mb: 2 }}
              >
                <Tab value="visual" label="Visual Diff" />
                <Tab value="text" label="Text Diff" />
              </Tabs>

              {viewMode === "visual" ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Found {diffResults.length} differences
                  </Typography>
                  <Box
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      maxHeight: "400px",
                      overflow: "auto",
                    }}
                  >
                    {diffResults.map(renderVisualDiffItem)}
                  </Box>
                </Box>
              ) : (
                <TextField
                  multiline
                  fullWidth
                  rows={15}
                  value={textDiffOutput}
                  InputProps={{ readOnly: true }}
                  sx={{
                    fontFamily: "monospace",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.default,
                    },
                  }}
                />
              )}

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Legend:
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: getColorForDiffType("added"),
                        borderRadius: 0.5,
                        mr: 0.5,
                      }}
                    />
                    <Typography variant="body2">Added</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: getColorForDiffType("removed"),
                        borderRadius: 0.5,
                        mr: 0.5,
                      }}
                    />
                    <Typography variant="body2">Removed</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        backgroundColor: getColorForDiffType("modified"),
                        borderRadius: 0.5,
                        mr: 0.5,
                      }}
                    />
                    <Typography variant="body2">Modified</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}

          <AdSense adSlot="6613251015" />

          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom>
              About JSON Compare Tool
            </Typography>
            <Typography variant="body1" paragraph>
              The JSON Compare Tool allows you to compare two JSON documents and
              identify the semantic differences between them. Unlike text-based
              comparison tools, this tool understands the structure of JSON and
              can identify added, removed, and modified properties regardless of
              formatting or property order.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Key Features:</strong>
            </Typography>
            <ul>
              <li>
                <Typography variant="body1">
                  <strong>Semantic Comparison:</strong> Compares the actual data
                  structure rather than just text differences.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Visual Diff:</strong> Clearly highlights added,
                  removed, and modified properties with color coding.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Path Tracking:</strong> Shows the exact path to each
                  difference in the JSON structure.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>Export Options:</strong> Copy results to clipboard or
                  download as an image.
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  <strong>URL Parameter Support:</strong> Load JSON data
                  directly via URL parameters for easy sharing.
                </Typography>
              </li>
            </ul>
            <Typography variant="body1" paragraph>
              This tool is ideal for developers working with APIs, debugging
              JSON data, or comparing configuration files to identify changes.
            </Typography>
          </Paper>
        </Box>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JsonCompare;
