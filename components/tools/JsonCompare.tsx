"use client";

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
  Divider,
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
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

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
  isIdentical: boolean;
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
  | { type: "SET_IDENTICAL"; payload: boolean }
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
  isIdentical: false,
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
    case "SET_IDENTICAL":
      return { ...state, isIdentical: action.payload };
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
        isIdentical: action.payload === "both" ? false : state.isIdentical,
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
    isIdentical,
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
    dispatch({ type: "SET_IDENTICAL", payload: false });
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
        // Scroll to error section
        setTimeout(() => {
          const errorElement = document.querySelector('[role="alert"]');
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }, 100);
        return;
      }

      if (rightObj === null) {
        dispatch({ type: "SET_ERROR", payload: "Right input is empty" });
        // Scroll to error section
        setTimeout(() => {
          const errorElement = document.querySelector('[role="alert"]');
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }, 100);
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
        dispatch({ type: "SET_IDENTICAL", payload: true });
        showSnackbar("The JSON documents are identical", "success");
        // For identical documents, scroll to show the success message area
        setTimeout(() => {
          const successElement = document.getElementById("success-results");
          if (successElement) {
            successElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        }, 100);
      } else {
        dispatch({ type: "SET_IDENTICAL", payload: false });
        showSnackbar(`Found ${differences.length} differences`, "info");
        // Smooth scroll to results section after comparison
        setTimeout(() => {
          const resultsElement = document.getElementById("diff-results");
          if (resultsElement) {
            resultsElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
              inline: "nearest",
            });
          }
        }, 100); // Small delay to ensure DOM is updated
      }
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err instanceof Error ? err.message : "Error comparing JSON",
      });
      dispatch({ type: "SET_DIFF_RESULTS", payload: [] });

      // Scroll to error section
      setTimeout(() => {
        const errorElement = document.querySelector('[role="alert"]');
        if (errorElement) {
          errorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 100);
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

  // Handle indent size change
  const handleIndentSizeChange = useCallback(
    (newIndentSize: number) => {
      dispatch({ type: "SET_INDENT_SIZE", payload: newIndentSize });

      // Reformat existing JSON inputs with new indent size
      try {
        if (leftInput.trim()) {
          const leftObj = parseJson(leftInput);
          if (leftObj !== null) {
            const formattedLeftJson = JSON.stringify(
              leftObj,
              null,
              newIndentSize
            );
            dispatch({ type: "SET_LEFT_INPUT", payload: formattedLeftJson });
          }
        }
      } catch (err) {
        // If left input is invalid JSON, don't reformat
      }

      try {
        if (rightInput.trim()) {
          const rightObj = parseJson(rightInput);
          if (rightObj !== null) {
            const formattedRightJson = JSON.stringify(
              rightObj,
              null,
              newIndentSize
            );
            dispatch({ type: "SET_RIGHT_INPUT", payload: formattedRightJson });
          }
        }
      } catch (err) {
        // If right input is invalid JSON, don't reformat
      }
    },
    [leftInput, rightInput, parseJson]
  );

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
            <Typography
              variant="h3"
              component="h3"
              fontWeight={600}
              sx={{ fontSize: "1.1rem" }}
              id={`${side}-json-label`}
            >
              {side === "left" ? "First JSON Document" : "Second JSON Document"}
            </Typography>
            <Box
              sx={{ display: "flex", gap: 1 }}
              role="group"
              aria-label={`${side} JSON actions`}
            >
              <Tooltip title="Paste from clipboard">
                <IconButton
                  size="small"
                  onClick={() => handlePaste(side)}
                  aria-label={`Paste JSON into ${side} input`}
                >
                  <ClipboardPaste size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Clear input">
                <IconButton
                  size="small"
                  onClick={() => handleClear(side)}
                  disabled={!value}
                  aria-label={`Clear ${side} JSON input`}
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
            inputProps={{
              "aria-labelledby": `${side}-json-label`,
              "aria-describedby": hasError
                ? `${side}-json-error`
                : `${side}-json-help`,
              "aria-invalid": hasError,
            }}
            FormHelperTextProps={{
              id: hasError ? `${side}-json-error` : `${side}-json-help`,
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
      const diffTypeLabel =
        diff.type === "added"
          ? "Added"
          : diff.type === "removed"
          ? "Removed"
          : "Modified";

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
          role="listitem"
          aria-label={`${diffTypeLabel} property at path ${
            diff.path || "root"
          }`}
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
              aria-label={`${diffTypeLabel} indicator`}
            >
              {getDiffTypeIcon(diff.type)}
            </Typography>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: "bold", mb: 0.5 }}
                component="h5"
              >
                {diff.path || "(root)"}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace" }}
                    component="div"
                    aria-label="Original value"
                  >
                    {diff.left !== undefined
                      ? typeof diff.left === "object"
                        ? JSON.stringify(diff.left, null, indentSize)
                        : String(diff.left)
                      : "(undefined)"}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "monospace" }}
                    component="div"
                    aria-label="New value"
                  >
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* <Box sx={{ my: 4 }} id="main-content"> */}
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          Free JSON Compare Tool
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Compare two JSON documents and see the semantic differences between
          them. Identify added, removed, and modified properties with visual
          diff viewer. Perfect for API response validation, configuration file
          comparison, and data structure analysis.
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
          component="section"
          aria-labelledby="json-input-section"
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
                role="group"
                aria-label="JSON comparison actions"
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Code />}
                  onClick={compareJson}
                  disabled={(!leftInput && !rightInput) || isLoading}
                  aria-describedby="compare-help"
                >
                  Compare JSON Documents
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowLeftRight />}
                  onClick={handleSwap}
                  disabled={(!leftInput && !rightInput) || isLoading}
                  aria-label="Swap left and right JSON inputs"
                >
                  Swap Inputs
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Trash2 />}
                  onClick={() => handleClear("both")}
                  disabled={(!leftInput && !rightInput) || isLoading}
                  aria-label="Clear both JSON inputs"
                >
                  Clear All
                </Button>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body2"
                    sx={{ mr: 1 }}
                    component="label"
                    htmlFor="indent-size-select"
                  >
                    Indent Size:
                  </Typography>
                  <Select
                    id="indent-size-select"
                    value={indentSize}
                    onChange={(e) =>
                      handleIndentSizeChange(Number(e.target.value))
                    }
                    size="small"
                    sx={{ minWidth: 60 }}
                    disabled={isLoading}
                    aria-label="Select JSON indentation size"
                  >
                    <MenuItem value={2}>2 spaces</MenuItem>
                    <MenuItem value={4}>4 spaces</MenuItem>
                    <MenuItem value={8}>8 spaces</MenuItem>
                  </Select>
                </Box>
              </Box>
              <Typography
                id="compare-help"
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1, textAlign: "center" }}
              >
                Enter JSON documents in both fields above and click compare to
                see differences
              </Typography>
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
            role="alert"
            aria-live="polite"
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AlertCircle size={20} aria-hidden="true" />
              <Typography variant="body1">{error}</Typography>
            </Box>
          </Paper>
        )}

        {isIdentical && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mt: 4,
              borderRadius: 2,
              backgroundColor: theme.palette.success.light,
              color: theme.palette.success.contrastText,
              border: `2px solid ${theme.palette.success.main}`,
            }}
            id="success-results"
            role="status"
            aria-live="polite"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Check size={32} color={theme.palette.background.paper} />
              <Box>
                <Typography
                  variant="h2"
                  component="h2"
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: theme.palette.background.paper,
                  }}
                >
                  JSON Documents Are Identical
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    mt: 1,
                    color: theme.palette.background.paper,
                  }}
                >
                  Both JSON documents contain exactly the same data structure
                  and values.
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1,
                p: 2,
                mt: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.primary,
                  fontWeight: 500,
                  mb: 1,
                }}
              >
                What this means:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ mb: 0.5, color: theme.palette.text.primary }}
                >
                  All properties and values match exactly
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ mb: 0.5, color: theme.palette.text.primary }}
                >
                  Object structure is identical
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ mb: 0.5, color: theme.palette.text.primary }}
                >
                  No differences found in nested objects or arrays
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ color: theme.palette.text.primary }}
                >
                  Data types and formatting are consistent
                </Typography>
              </Box>
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
              <Typography
                variant="h2"
                component="h2"
                sx={{ fontSize: "1.5rem" }}
                id="comparison-results-heading"
              >
                Comparison Results
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                  onClick={handleCopy}
                  disabled={isLoading}
                  aria-label={
                    copied
                      ? "Results copied to clipboard"
                      : "Copy comparison results to clipboard"
                  }
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
              aria-label="Comparison view mode"
            >
              <Tab
                value="visual"
                label="Visual Diff"
                id="visual-tab"
                aria-controls="visual-panel"
              />
              <Tab
                value="text"
                label="Text Diff"
                id="text-tab"
                aria-controls="text-panel"
              />
            </Tabs>

            {viewMode === "visual" ? (
              <Box
                sx={{ mt: 2 }}
                role="tabpanel"
                id="visual-panel"
                aria-labelledby="visual-tab"
              >
                <Typography
                  variant="h3"
                  component="h3"
                  sx={{ mb: 1, fontSize: "1.1rem" }}
                  aria-live="polite"
                >
                  Found {diffResults.length} differences
                </Typography>
                <Box
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    maxHeight: "400px",
                    overflow: "auto",
                  }}
                  role="region"
                  aria-label="Visual differences between JSON documents"
                  tabIndex={0}
                >
                  {diffResults.map(renderVisualDiffItem)}
                </Box>
              </Box>
            ) : (
              <Box role="tabpanel" id="text-panel" aria-labelledby="text-tab">
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
                  inputProps={{
                    "aria-label":
                      "Text format differences between JSON documents",
                    "aria-describedby": "text-diff-description",
                  }}
                />
                <Typography
                  id="text-diff-description"
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Text format showing differences with symbols: + (added), -
                  (removed), ~ (modified)
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2 }} role="region" aria-labelledby="legend-heading">
              <Typography
                variant="h4"
                component="h4"
                sx={{ mb: 0.5, fontSize: "1rem" }}
                id="legend-heading"
              >
                Color Legend:
              </Typography>
              <Box
                sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}
                role="list"
              >
                <Box
                  sx={{ display: "flex", alignItems: "center" }}
                  role="listitem"
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: getColorForDiffType("added"),
                      borderRadius: 0.5,
                      mr: 0.5,
                    }}
                    aria-hidden="true"
                  />
                  <Typography variant="body2">Added properties</Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center" }}
                  role="listitem"
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: getColorForDiffType("removed"),
                      borderRadius: 0.5,
                      mr: 0.5,
                    }}
                    aria-hidden="true"
                  />
                  <Typography variant="body2">Removed properties</Typography>
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center" }}
                  role="listitem"
                >
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: getColorForDiffType("modified"),
                      borderRadius: 0.5,
                      mr: 0.5,
                    }}
                    aria-hidden="true"
                  />
                  <Typography variant="body2">Modified properties</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {/* Examples Section */}
        <Paper
          elevation={3}
          sx={{ p: 3, mt: 4, borderRadius: 2 }}
          component="section"
          aria-labelledby="examples-heading"
        >
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            fontWeight={600}
            id="examples-heading"
            sx={{ fontSize: "1.5rem" }}
          >
            JSON Comparison Examples
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                fontWeight={500}
                sx={{ fontSize: "1.1rem", mb: 2 }}
              >
                Example 1: API Response Changes
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Before (Left JSON):
                </Typography>
                <Paper sx={{ p: 1, backgroundColor: "background.default" }}>
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                      margin: 0,
                    }}
                  >
                    {`{
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "status": "active"
}`}
                  </Typography>
                </Paper>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  After (Right JSON):
                </Typography>
                <Paper sx={{ p: 1, backgroundColor: "background.default" }}>
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                      margin: 0,
                    }}
                  >
                    {`{
  "user": {
    "id": 123,
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567890"
  },
  "status": "active",
  "lastLogin": "2024-01-15"
}`}
                  </Typography>
                </Paper>
              </Box>
              <Typography variant="body2" color="success.main">
                ✓ Detects: name change, phone addition, lastLogin addition
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                fontWeight={500}
                sx={{ fontSize: "1.1rem", mb: 2 }}
              >
                Example 2: Configuration Changes
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Original Config:
                </Typography>
                <Paper sx={{ p: 1, backgroundColor: "background.default" }}>
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                      margin: 0,
                    }}
                  >
                    {`{
  "database": {
    "host": "localhost",
    "port": 5432,
    "ssl": false
  },
  "cache": {
    "enabled": true,
    "ttl": 3600
  }
}`}
                  </Typography>
                </Paper>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Updated Config:
                </Typography>
                <Paper sx={{ p: 1, backgroundColor: "background.default" }}>
                  <Typography
                    component="pre"
                    sx={{
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                      margin: 0,
                    }}
                  >
                    {`{
  "database": {
    "host": "prod-db.example.com",
    "port": 5432,
    "ssl": true,
    "pool_size": 20
  },
  "cache": {
    "enabled": true,
    "ttl": 7200
  }
}`}
                  </Typography>
                </Paper>
              </Box>
              <Typography variant="body2" color="success.main">
                ✓ Detects: host change, ssl enabled, pool_size added, ttl
                updated
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ fontSize: "1.25rem" }}
          >
            Common Use Cases
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "primary.light",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="h4"
                  fontWeight={500}
                  sx={{ fontSize: "1rem", mb: 1, color: "#000" }}
                >
                  🔧 API Development
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#000" }}>
                  Compare API responses before and after changes to ensure
                  backward compatibility
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "secondary.light",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="h4"
                  fontWeight={500}
                  sx={{ fontSize: "1rem", mb: 1, color: "#000" }}
                >
                  ⚙️ Configuration Management
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#000" }}>
                  Track changes in configuration files and settings across
                  environments
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "info.light",
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="h4"
                  fontWeight={500}
                  sx={{ fontSize: "1rem", mb: 1, color: "#000" }}
                >
                  🧪 Testing & QA
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#000" }}>
                  Validate test results and compare expected vs actual JSON
                  outputs
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="3174835314" />

        {/* Features and Usage Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            How to Use the JSON Diff Tool
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="h3" gutterBottom>
                Features
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Visual Diff Highlighting:</strong> See changes with
                  color-coded additions, deletions, and modifications
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Deep Object Comparison:</strong> Compares nested
                  objects and arrays recursively
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Multiple Input Methods:</strong> Paste JSON, load from
                  URLs, or use clipboard
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Export Results:</strong> Copy diff results for
                  documentation or sharing
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>No Registration Required:</strong> Free online tool
                  that works entirely in your browser
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" component="h3" gutterBottom>
                Common Use Cases
              </Typography>
              <Box component="ul" sx={{ pl: 2 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>API Response Validation:</strong> Compare API
                  responses before and after changes
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Configuration Management:</strong> Verify
                  configuration file changes
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Data Migration:</strong> Ensure data integrity during
                  migrations
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Testing & QA:</strong> Validate test data and expected
                  results
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Code Review:</strong> Compare JSON schemas and data
                  structures
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
          component="section"
          aria-labelledby="about-heading"
        >
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            id="about-heading"
            sx={{ fontSize: "1.5rem" }}
          >
            About JSON Compare Tool - Complete Guide
          </Typography>
          <Typography variant="body1" paragraph>
            The JSON Compare Tool is a powerful online utility that allows you
            to compare two JSON documents and identify semantic differences
            between them. Unlike simple text-based comparison tools, this
            advanced tool understands JSON structure and can identify added,
            removed, and modified properties regardless of formatting,
            whitespace, or property order.
          </Typography>

          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3, fontSize: "1.25rem" }}
          >
            Key Features & Benefits
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1.1rem" }}
              >
                Core Features:
              </Typography>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Semantic Comparison:</strong> Understands JSON
                    structure, not just text
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Visual Diff Viewer:</strong> Color-coded differences
                    with clear highlighting
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Path Tracking:</strong> Shows exact location of each
                    difference
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    <strong>Multiple View Modes:</strong> Visual and text-based
                    difference views
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h4"
                fontWeight={500}
                sx={{ mb: 1, fontSize: "1.1rem" }}
              >
                Advanced Capabilities:
              </Typography>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Export Options:</strong> Copy results to clipboard
                    for sharing
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>URL Parameter Support:</strong> Load JSON via URLs
                    for automation
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Flexible Input:</strong> Supports both JSON and
                    JavaScript object notation
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    <strong>Customizable Formatting:</strong> Adjustable
                    indentation for readability
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="h4"
            component="h4"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3, fontSize: "1.1rem" }}
          >
            Perfect For:
          </Typography>
          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>API Development:</strong> Compare request/response
                payloads during development
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Configuration Management:</strong> Track changes in
                config files across environments
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Testing & QA:</strong> Validate expected vs actual JSON
                outputs in tests
              </Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>
                <strong>Data Migration:</strong> Verify data transformations and
                migrations
              </Typography>
            </Box>
            <Box component="li">
              <Typography>
                <strong>Debugging:</strong> Identify unexpected changes in JSON
                data structures
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "action.hover",
              borderRadius: 1,
              fontStyle: "italic",
            }}
          >
            <strong>Pro Tip:</strong> This tool processes all data locally in
            your browser for maximum security and privacy. No JSON data is sent
            to external servers, ensuring your sensitive information remains
            protected.
          </Typography>
        </Paper>
        {/* </Box> */}
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
