"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import { RefreshCcw, GitCompareArrows, Eye, Info } from "lucide-react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";
import { useAnalytics } from "@/hooks/useAnalytics";

interface DiffResult {
  added: number;
  removed: number;
  modified: number;
  unchanged: number;
  total: number;
}

interface DiffChar {
  type: "added" | "removed" | "unchanged";
  char: string;
}

interface DiffLine {
  type: "added" | "removed" | "unchanged" | "modified";
  content: DiffChar[];
  lineNumber?: number;
  originalContent?: string;
}

const TextCompare = () => {
  const theme = useTheme();
  const { trackTool, trackCustomEvent } = useAnalytics();

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [comparisonResult, setComparisonResult] = useState<DiffResult | null>(
    null
  );
  const [diff1, setDiff1] = useState<DiffLine[]>([]);
  const [diff2, setDiff2] = useState<DiffLine[]>([]);

  // Ref for scrolling to comparison results
  const comparisonResultsRef = useRef<HTMLDivElement>(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "info" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // Track tool view on mount
  useEffect(() => {
    trackTool("text-compare", "view");
  }, [trackTool]);

  // Snackbar helper functions
  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "warning" | "info" = "info"
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Improved character-level diff algorithm
  const computeDiff = useMemo(() => {
    if (!text1 && !text2) return null;

    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");

    const maxLines = Math.max(lines1.length, lines2.length);
    const result1: DiffLine[] = [];
    const result2: DiffLine[] = [];

    let totalAdded = 0;
    let totalRemoved = 0;
    let totalModified = 0;
    let totalUnchanged = 0;

    // Improved character-level diff function using LCS algorithm
    const getCharacterDiff = (
      str1: string,
      str2: string
    ): {
      chars1: DiffChar[];
      chars2: DiffChar[];
      stats: { added: number; removed: number; unchanged: number };
    } => {
      let addedCount = 0;
      let removedCount = 0;
      let unchangedCount = 0;

      // Simple LCS-based diff algorithm
      const matrix: number[][] = [];
      const m = str1.length;
      const n = str2.length;

      // Build LCS matrix
      for (let i = 0; i <= m; i++) {
        matrix[i] = [];
        for (let j = 0; j <= n; j++) {
          if (i === 0 || j === 0) {
            matrix[i][j] = 0;
          } else if (str1[i - 1] === str2[j - 1]) {
            matrix[i][j] = matrix[i - 1][j - 1] + 1;
          } else {
            matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
          }
        }
      }

      // Backtrack to find the diff
      let i = m,
        j = n;
      const diff1: DiffChar[] = [];
      const diff2: DiffChar[] = [];

      while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && str1[i - 1] === str2[j - 1]) {
          // Characters match
          diff1.unshift({ type: "unchanged", char: str1[i - 1] });
          diff2.unshift({ type: "unchanged", char: str2[j - 1] });
          unchangedCount++;
          i--;
          j--;
        } else if (i > 0 && (j === 0 || matrix[i - 1][j] >= matrix[i][j - 1])) {
          // Character deleted from str1
          diff1.unshift({ type: "removed", char: str1[i - 1] });
          removedCount++;
          i--;
        } else if (j > 0) {
          // Character added to str2
          diff2.unshift({ type: "added", char: str2[j - 1] });
          addedCount++;
          j--;
        }
      }

      // Balance the arrays to have the same visual structure
      const maxLength = Math.max(diff1.length, diff2.length);
      while (diff1.length < maxLength) {
        diff1.push({ type: "unchanged", char: "" });
      }
      while (diff2.length < maxLength) {
        diff2.push({ type: "unchanged", char: "" });
      }

      return {
        chars1: diff1,
        chars2: diff2,
        stats: {
          added: addedCount,
          removed: removedCount,
          unchanged: unchangedCount,
        },
      };
    };

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || "";
      const line2 = lines2[i] || "";

      if (line1 === line2) {
        // Lines are identical
        const chars1 = line1
          .split("")
          .map((char) => ({ type: "unchanged" as const, char }));
        const chars2 = line2
          .split("")
          .map((char) => ({ type: "unchanged" as const, char }));

        result1.push({
          type: "unchanged",
          content: chars1,
          lineNumber: i + 1,
          originalContent: line1,
        });
        result2.push({
          type: "unchanged",
          content: chars2,
          lineNumber: i + 1,
          originalContent: line2,
        });
        totalUnchanged += line1.length;
      } else if (!line1 && line2) {
        // Line added in text2
        const chars2 = line2
          .split("")
          .map((char) => ({ type: "added" as const, char }));
        result1.push({
          type: "removed",
          content: [],
          lineNumber: i + 1,
          originalContent: "",
        });
        result2.push({
          type: "added",
          content: chars2,
          lineNumber: i + 1,
          originalContent: line2,
        });
        totalAdded += line2.length;
      } else if (line1 && !line2) {
        // Line removed from text1
        const chars1 = line1
          .split("")
          .map((char) => ({ type: "removed" as const, char }));
        result1.push({
          type: "removed",
          content: chars1,
          lineNumber: i + 1,
          originalContent: line1,
        });
        result2.push({
          type: "added",
          content: [],
          lineNumber: i + 1,
          originalContent: "",
        });
        totalRemoved += line1.length;
      } else {
        // Lines are different - do character-level diff
        const { chars1, chars2, stats } = getCharacterDiff(line1, line2);
        result1.push({
          type: "modified",
          content: chars1,
          lineNumber: i + 1,
          originalContent: line1,
        });
        result2.push({
          type: "modified",
          content: chars2,
          lineNumber: i + 1,
          originalContent: line2,
        });
        totalAdded += stats.added;
        totalRemoved += stats.removed;
        totalUnchanged += stats.unchanged;
        if (stats.added > 0 || stats.removed > 0) {
          totalModified++;
        }
      }
    }

    return {
      diff1: result1,
      diff2: result2,
      stats: {
        added: totalAdded,
        removed: totalRemoved,
        modified: totalModified,
        unchanged: totalUnchanged,
        total: maxLines,
      },
    };
  }, [text1, text2]);

  useEffect(() => {
    if (computeDiff) {
      setDiff1(computeDiff.diff1);
      setDiff2(computeDiff.diff2);
      setComparisonResult(computeDiff.stats);

      // Show snackbar based on comparison results
      if (
        computeDiff.stats.added === 0 &&
        computeDiff.stats.removed === 0 &&
        computeDiff.stats.modified === 0 &&
        computeDiff.stats.unchanged > 0
      ) {
        showSnackbar("✅ Texts are identical!", "success");
      } else if (
        computeDiff.stats.added === 0 &&
        computeDiff.stats.removed === 0 &&
        computeDiff.stats.modified === 0 &&
        computeDiff.stats.unchanged === 0
      ) {
        showSnackbar("ℹ️ Both texts are empty", "info");
      } else {
        const changes =
          computeDiff.stats.added +
          computeDiff.stats.removed +
          computeDiff.stats.modified;
        showSnackbar(`Found ${changes} character differences`, "warning");
      }
    } else {
      setDiff1([]);
      setDiff2([]);
      setComparisonResult(null);
    }
  }, [computeDiff]);

  const handleCompare = () => {
    if (!text1 || !text2) {
      showSnackbar("Please enter text in both fields to compare", "warning");
      return;
    }

    trackCustomEvent("compare", "text", "button_click", 1);
    showSnackbar("Texts compared successfully!", "success");

    // Scroll to comparison results section after a short delay to ensure results are rendered
    setTimeout(() => {
      if (comparisonResultsRef.current) {
        comparisonResultsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
    }, 100);
  };

  const handleClear = () => {
    setText1("");
    setText2("");
    setComparisonResult(null);
    setDiff1([]);
    setDiff2([]);
    trackTool("text-compare", "clear");
    showSnackbar("All text fields cleared", "info");
  };

  const getLineStyle = (type: string) => {
    switch (type) {
      case "added":
        return {
          backgroundColor:
            theme.palette.mode === "dark" ? "#1b5e20" : "#e8f5e8",
          borderLeft: `4px solid ${theme.palette.success.main}`,
          color: "#2e7d32", // Always dark green
        };
      case "removed":
        return {
          backgroundColor:
            theme.palette.mode === "dark" ? "#b71c1c" : "#ffebee",
          borderLeft: `4px solid ${theme.palette.error.main}`,
          color: "#c62828", // Always dark red
        };
      case "modified":
        return {
          backgroundColor: "transparent",
          borderLeft: `4px solid ${theme.palette.warning.main}`,
          color: "#333333", // Always dark gray
        };
      default:
        return {
          backgroundColor: "transparent",
          borderLeft: "4px solid transparent",
          color: "#333333", // Always dark gray for maximum contrast
        };
    }
  };

  const getCharStyle = (type: string) => {
    switch (type) {
      case "added":
        return {
          backgroundColor: "#4caf50",
          color: "#ffffff",
          fontWeight: "bold",
          padding: "1px 2px",
          borderRadius: "2px",
          border: "1px solid #2e7d32",
          textDecoration: "underline",
          textDecorationColor: "#ffffff",
          textDecorationThickness: "2px",
        };
      case "removed":
        return {
          backgroundColor: "#f44336",
          color: "#ffffff",
          fontWeight: "bold",
          textDecoration: "line-through underline",
          textDecorationColor: "#ffffff",
          textDecorationThickness: "2px",
          padding: "1px 2px",
          borderRadius: "2px",
          border: "1px solid #c62828",
        };
      default:
        return {
          backgroundColor: "transparent",
          color: "#333333",
        };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
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
            Text Compare Tool
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
            Compare two texts side by side and highlight the differences.
            Perfect for comparing documents, code, articles, or any text
            content. Free online diff checker with character-level comparison
            and real-time analysis.
          </Typography>
        </Box>

        {/* Input Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <GitCompareArrows size={24} color={theme.palette.primary.main} />
              <Typography variant="h5" fontWeight={600}>
                Text Comparison
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Eye size={20} />}
                onClick={handleCompare}
                disabled={!text1 || !text2}
              >
                Compare
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<RefreshCcw size={20} />}
                onClick={handleClear}
                disabled={!text1 && !text2}
              >
                Clear All
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Original Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={12}
                value={text1}
                onChange={(e) => setText1(e.target.value)}
                placeholder="Paste your original text here..."
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": {
                    fontFamily: "monospace",
                    fontSize: "14px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Comparison Text
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={12}
                value={text2}
                onChange={(e) => setText2(e.target.value)}
                placeholder="Paste your comparison text here..."
                variant="outlined"
                sx={{
                  "& .MuiInputBase-root": {
                    fontFamily: "monospace",
                    fontSize: "14px",
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Comparison Results */}
        {comparisonResult && (
          <Card sx={{ mb: 4 }} ref={comparisonResultsRef}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  mb: 3,
                }}
              >
                <Typography variant="h5" fontWeight={600}>
                  Comparison Results
                </Typography>
              </Box>

              {/* Identical Text Alert */}
              {comparisonResult.added === 0 &&
                comparisonResult.removed === 0 &&
                comparisonResult.modified === 0 &&
                comparisonResult.unchanged > 0 && (
                  <Alert
                    severity="success"
                    icon={<Info />}
                    sx={{
                      mb: 3,
                      fontSize: "16px",
                      fontWeight: "bold",
                      "& .MuiAlert-message": {
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      },
                    }}
                  >
                    ✅ Texts are identical! No differences found.
                  </Alert>
                )}

              {/* Empty Text Alert */}
              {comparisonResult.added === 0 &&
                comparisonResult.removed === 0 &&
                comparisonResult.modified === 0 &&
                comparisonResult.unchanged === 0 && (
                  <Alert
                    severity="info"
                    icon={<Info />}
                    sx={{
                      mb: 3,
                      fontSize: "16px",
                      fontWeight: "bold",
                    }}
                  >
                    ℹ️ Both texts are empty.
                  </Alert>
                )}

              {/* Statistics */}
              <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                {/* Status Chip - Shows when texts are identical */}
                {comparisonResult.added === 0 &&
                  comparisonResult.removed === 0 &&
                  comparisonResult.modified === 0 &&
                  comparisonResult.unchanged > 0 && (
                    <Chip
                      label="✓ IDENTICAL"
                      sx={{
                        backgroundColor: "#4caf50",
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "14px",
                        "& .MuiChip-label": {
                          px: 2,
                        },
                      }}
                    />
                  )}

                {/* Different Status Chip */}
                {(comparisonResult.added > 0 ||
                  comparisonResult.removed > 0 ||
                  comparisonResult.modified > 0) && (
                    <Chip
                      label="⚠ DIFFERENT"
                      sx={{
                        backgroundColor: "#ff9800",
                        color: "#ffffff",
                        fontWeight: "bold",
                        fontSize: "14px",
                        "& .MuiChip-label": {
                          px: 2,
                        },
                      }}
                    />
                  )}

                <Chip
                  label={`Added: ${comparisonResult.added}`}
                  color={comparisonResult.added > 0 ? "success" : "default"}
                  variant={comparisonResult.added > 0 ? "filled" : "outlined"}
                />
                <Chip
                  label={`Removed: ${comparisonResult.removed}`}
                  color={comparisonResult.removed > 0 ? "error" : "default"}
                  variant={comparisonResult.removed > 0 ? "filled" : "outlined"}
                />
                <Chip
                  label={`Modified: ${comparisonResult.modified}`}
                  color={comparisonResult.modified > 0 ? "warning" : "default"}
                  variant={
                    comparisonResult.modified > 0 ? "filled" : "outlined"
                  }
                />
                <Chip
                  label={`Unchanged: ${comparisonResult.unchanged}`}
                  color={
                    comparisonResult.unchanged > 0 &&
                      comparisonResult.added === 0 &&
                      comparisonResult.removed === 0 &&
                      comparisonResult.modified === 0
                      ? "success"
                      : "default"
                  }
                  variant={
                    comparisonResult.unchanged > 0 &&
                      comparisonResult.added === 0 &&
                      comparisonResult.removed === 0 &&
                      comparisonResult.modified === 0
                      ? "filled"
                      : "outlined"
                  }
                />
                <Chip
                  label={`Total Lines: ${comparisonResult.total}`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Side by Side Comparison */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Original Text
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      maxHeight: 400,
                      overflow: "auto",
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    {diff1.map((line, index) => {
                      const lineStyle = getLineStyle(line.type);
                      return (
                        <Box
                          key={index}
                          sx={{
                            backgroundColor: lineStyle.backgroundColor,
                            borderLeft: lineStyle.borderLeft,
                            p: 0.5,
                            pl: 1,
                            fontFamily: "monospace",
                            fontSize: "14px",
                            minHeight: "20px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              minWidth: "40px",
                              color: "#666666 !important", // Explicit gray color for line numbers
                              fontSize: "12px",
                              mr: 1,
                              fontWeight: "bold",
                            }}
                          >
                            {line.lineNumber}
                          </Typography>
                          <Box
                            sx={{
                              fontFamily: "monospace",
                              fontSize: "14px",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {line.content.length > 0 ? (
                              line.content.map((char, charIndex) => {
                                const charStyle = getCharStyle(char.type);
                                return (
                                  <Typography
                                    key={charIndex}
                                    component="span"
                                    sx={{
                                      backgroundColor:
                                        charStyle.backgroundColor,
                                      color: `${charStyle.color} !important`,
                                      fontWeight: charStyle.fontWeight,
                                      textDecoration: charStyle.textDecoration,
                                      fontFamily: "monospace",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {char.char}
                                  </Typography>
                                );
                              })
                            ) : (
                              <Typography
                                component="span"
                                sx={{
                                  color: "#999999",
                                  fontStyle: "italic",
                                  fontSize: "12px",
                                }}
                              >
                                {line.type === "removed" &&
                                  line.originalContent === ""
                                  ? "(empty line)"
                                  : " "}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Comparison Text
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      maxHeight: 400,
                      overflow: "auto",
                      backgroundColor: theme.palette.grey[50],
                    }}
                  >
                    {diff2.map((line, index) => {
                      const lineStyle = getLineStyle(line.type);
                      return (
                        <Box
                          key={index}
                          sx={{
                            backgroundColor: lineStyle.backgroundColor,
                            borderLeft: lineStyle.borderLeft,
                            p: 0.5,
                            pl: 1,
                            fontFamily: "monospace",
                            fontSize: "14px",
                            minHeight: "20px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            component="span"
                            sx={{
                              minWidth: "40px",
                              color: "#666666 !important", // Explicit gray color for line numbers
                              fontSize: "12px",
                              mr: 1,
                              fontWeight: "bold",
                            }}
                          >
                            {line.lineNumber}
                          </Typography>
                          <Box
                            sx={{
                              fontFamily: "monospace",
                              fontSize: "14px",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {line.content.length > 0 ? (
                              line.content.map((char, charIndex) => {
                                const charStyle = getCharStyle(char.type);
                                return (
                                  <Typography
                                    key={charIndex}
                                    component="span"
                                    sx={{
                                      backgroundColor:
                                        charStyle.backgroundColor,
                                      color: `${charStyle.color} !important`,
                                      fontWeight: charStyle.fontWeight,
                                      textDecoration: charStyle.textDecoration,
                                      fontFamily: "monospace",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {char.char}
                                  </Typography>
                                );
                              })
                            ) : (
                              <Typography
                                component="span"
                                sx={{
                                  color: "#999999",
                                  fontStyle: "italic",
                                  fontSize: "12px",
                                }}
                              >
                                {line.type === "added" &&
                                  line.originalContent === ""
                                  ? "(empty line)"
                                  : " "}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Paper>
                </Grid>
              </Grid>

              {/* Legend */}
              <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: theme.palette.success.light,
                      border: `1px solid ${theme.palette.success.main}`,
                    }}
                  />
                  <Typography variant="caption">Added</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: theme.palette.error.light,
                      border: `1px solid ${theme.palette.error.main}`,
                    }}
                  />
                  <Typography variant="caption">Removed</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: theme.palette.warning.light,
                      border: `1px solid ${theme.palette.warning.main}`,
                    }}
                  />
                  <Typography variant="caption">Modified</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: "transparent",
                      border: `1px solid ${theme.palette.grey[400]}`,
                    }}
                  />
                  <Typography variant="caption">Unchanged</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* AdSense Ad */}
        <AdSense adSlot="8427161992" />

        {/* Features Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Why Use Our Text Compare Tool?
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <GitCompareArrows size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Side-by-Side Comparison
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Compare texts side by side with clear visual indicators for
                  added, removed, and modified content.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Eye size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Real-time Analysis
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Instant comparison results as you type. See differences
                  immediately without waiting for processing.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.warning.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Info size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Detailed Statistics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get comprehensive statistics about changes including added,
                  removed, and modified lines.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* How It Works Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            How to Compare Texts
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  1
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Paste Original Text
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paste your original text in the left panel. This will be your
                  baseline for comparison.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  2
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Add Comparison Text
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Paste the text you want to compare in the right panel. This
                  can be a revised version or different document.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  3
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  View Differences
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The tool automatically highlights differences with color
                  coding for easy identification.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ textAlign: "center", p: 2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  4
                </Typography>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Analyze Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Review the statistics and copy the comparison results for
                  documentation or reporting.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Benefits Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Key Benefits
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    100% Free & No Registration
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use our text compare tool completely free without creating
                    an account or providing personal information.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Privacy Protected
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All text comparison happens locally in your browser. Your
                    content never leaves your device.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Works on All Devices
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Compatible with Windows, Mac, Linux, iOS, and Android. Works
                    in any modern web browser.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.main,
                    mt: 1,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Professional Results
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Get detailed statistics and professional-grade comparison
                    results suitable for documentation.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* FAQ Section */}
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            fontWeight={600}
            itemProp="name"
          >
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Box
              itemProp="mainEntity"
              itemScope
              itemType="https://schema.org/Question"
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                itemProp="name"
              >
                How does the text comparison work?
              </Typography>
              <Box
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                  itemProp="text"
                >
                  Our tool compares texts line by line and highlights
                  differences using color coding. Green indicates added content,
                  red shows removed content, and yellow represents modified
                  lines.
                </Typography>
              </Box>
            </Box>

            <Box
              itemProp="mainEntity"
              itemScope
              itemType="https://schema.org/Question"
            >
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                itemProp="name"
              >
                Is my text data secure?
              </Typography>
              <Box
                itemProp="acceptedAnswer"
                itemScope
                itemType="https://schema.org/Answer"
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                  itemProp="text"
                >
                  Yes, absolutely. All text processing happens entirely in your
                  browser using client-side JavaScript. Your text never leaves
                  your device.
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Can I compare large texts?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Yes, the tool can handle large texts efficiently. However, very
              large documents may take a moment to process depending on your
              device's performance.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              What file formats are supported?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Currently, the tool works with plain text. You can copy and paste
              content from various file formats like Word documents, PDFs, or
              text files.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Is this a free text diff tool?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Yes, our text comparison tool is completely free to use with no
              registration required. Compare unlimited texts online without any
              restrictions or watermarks.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              How accurate is the character-level comparison?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Our tool uses advanced LCS (Longest Common Subsequence) algorithms
              for precise character-by-character comparison, ensuring accurate
              detection of even the smallest changes between texts.
            </Typography>
          </Box>
        </Paper>
        {/* AdSense Ad */}
        <AdSense adSlot="8876847424" />
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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

export default TextCompare;
