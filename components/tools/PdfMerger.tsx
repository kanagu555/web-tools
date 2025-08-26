"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  IconButton,
  Alert,
  LinearProgress,
  Chip,
  Stack,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Upload,
  FileText,
  Trash2,
  MoveUp,
  MoveDown,
  Download,
  FilePlus,
  Settings,
  Info,
  RefreshCcw,
  Merge,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import AdSense from "../AdSense";
import SocialShare from "../SocialShare";
import Navigation from "@/components/Navigation";

const PdfMerger = () => {
  const theme = useTheme();
  const { trackTool, trackFile, trackCustomEvent } = useAnalytics();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [mergeOrder, setMergeOrder] = useState<
    "original" | "alphabetical" | "size"
  >("original");
  const [fileMetadata, setFileMetadata] = useState<{
    [key: string]: { pages: number; size: string };
  }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      trackTool("pdf-merger", "view");
    }
  }, [trackTool]);

  const validatePdfFile = (file: File): boolean => {
    const maxSize = 100 * 1024 * 1024; // 100MB per file

    if (file.type !== "application/pdf") {
      setError(`${file.name} is not a PDF file. Please select only PDF files.`);
      return false;
    }

    if (file.size > maxSize) {
      setError(`${file.name} is too large. Maximum file size is 100MB.`);
      return false;
    }

    return true;
  };

  const extractPdfMetadata = async (
    file: File
  ): Promise<{ pages: number; size: string }> => {
    try {
      const { PDFDocument } = await import("pdf-lib");
      const fileBuffer = await readFileAsArrayBuffer(file);
      const pdfDoc = await PDFDocument.load(fileBuffer);
      const pages = pdfDoc.getPageCount();
      const size = formatFileSize(file.size);
      return { pages, size };
    } catch (error) {
      console.error(`Error reading PDF metadata for ${file.name}:`, error);
      return { pages: 0, size: formatFileSize(file.size) };
    }
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(validatePdfFile);

        if (validFiles.length > 0) {
          setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
          setMergedPdfUrl(null);
          setError("");

          // Extract metadata for new files
          const newMetadata: {
            [key: string]: { pages: number; size: string };
          } = {};
          for (const file of validFiles) {
            newMetadata[file.name] = await extractPdfMetadata(file);
          }
          setFileMetadata((prev) => ({ ...prev, ...newMetadata }));

          setSnackbarMessage(
            `${validFiles.length} PDF file(s) added successfully`
          );
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          // Track file selection
          trackTool("pdf-merger", "add_files");
          trackFile("upload", "pdf", true);
        }
      }
    },
    [trackTool, trackFile]
  );

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    trackTool("pdf-merger", "remove_file");
  };

  const handleMoveFile = (index: number, direction: "up" | "down") => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      if (direction === "up" && index > 0) {
        [newFiles[index], newFiles[index - 1]] = [
          newFiles[index - 1],
          newFiles[index],
        ];
      } else if (direction === "down" && index < newFiles.length - 1) {
        [newFiles[index], newFiles[index + 1]] = [
          newFiles[index + 1],
          newFiles[index],
        ];
      }
      return newFiles;
    });
    setMergedPdfUrl(null);
    trackTool("pdf-merger", `move_${direction}`);
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      if (event.dataTransfer.files) {
        const files = Array.from(event.dataTransfer.files);
        const validFiles = files.filter(validatePdfFile);

        if (validFiles.length > 0) {
          setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
          setMergedPdfUrl(null);
          setError("");

          // Extract metadata for new files
          const newMetadata: {
            [key: string]: { pages: number; size: string };
          } = {};
          for (const file of validFiles) {
            newMetadata[file.name] = await extractPdfMetadata(file);
          }
          setFileMetadata((prev) => ({ ...prev, ...newMetadata }));

          setSnackbarMessage(
            `${validFiles.length} PDF file(s) added successfully`
          );
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          // Track drag and drop
          trackTool("pdf-merger", "drop_files");
          trackFile("upload", "pdf", true);
        }
      }
    },
    [trackTool, trackFile]
  );

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const getOrderedFiles = (): File[] => {
    let orderedFiles = [...selectedFiles];

    switch (mergeOrder) {
      case "alphabetical":
        orderedFiles.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "size":
        orderedFiles.sort((a, b) => a.size - b.size);
        break;
      default:
        // Keep original order
        break;
    }

    return orderedFiles;
  };

  const handleDownload = () => {
    if (mergedPdfUrl) {
      const link = document.createElement("a");
      link.href = mergedPdfUrl;
      link.download = `merged_${new Date().getTime()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Track download
      trackTool("pdf-merger", "download");
      trackFile("download", "pdf", true);
    }
  };

  const handleOrderChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setMergeOrder(event.target.value as "original" | "alphabetical" | "size");
    setMergedPdfUrl(null);

    // Track order change
    trackTool("pdf-merger", "change_order");
    trackCustomEvent("settings", "pdf", `order_${event.target.value}`);
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) return;

    setIsLoading(true);
    setMergedPdfUrl(null);
    setMergeProgress(0);
    setError("");

    // Track merge operation
    trackTool("pdf-merger", "merge");
    trackCustomEvent(
      "conversion",
      "pdf",
      `merge_pdfs_${mergeOrder}`,
      selectedFiles.length
    );

    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();
      const orderedFiles = getOrderedFiles();

      for (let i = 0; i < orderedFiles.length; i++) {
        const file = orderedFiles[i];
        setMergeProgress(((i + 1) / orderedFiles.length) * 90);

        try {
          const fileBuffer = await readFileAsArrayBuffer(file);
          const pdfDoc = await PDFDocument.load(fileBuffer);
          const copiedPages = await mergedPdf.copyPages(
            pdfDoc,
            pdfDoc.getPageIndices()
          );
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        } catch (fileError) {
          console.error(`Error processing PDF ${file.name}:`, fileError);
          setError(
            `Failed to process PDF: ${file.name}. It may be corrupted or password-protected.`
          );
          throw fileError;
        }
      }

      setMergeProgress(95);
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      setMergeProgress(100);

      const totalPages = Object.values(fileMetadata).reduce(
        (sum, meta) => sum + meta.pages,
        0
      );
      setSnackbarMessage(
        `Successfully merged ${orderedFiles.length} PDFs with ${totalPages} total pages`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Track successful merge
      trackCustomEvent("success", "pdf", "merge_complete", totalPages);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      if (
        !(error instanceof Error) ||
        !error.message?.includes("Failed to process PDF")
      ) {
        setError(
          "Failed to merge PDF files. Please ensure all files are valid PDFs and try again."
        );
      }
      setSnackbarMessage("Merge failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      // Track error
      trackCustomEvent("error", "pdf", "merge_failed");
    } finally {
      setIsLoading(false);
      setTimeout(() => setMergeProgress(0), 2000);
    }
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setMergedPdfUrl(null);
    setFileMetadata({});
    setMergeProgress(0);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSnackbarMessage("All files cleared");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getTotalFileSize = (): string => {
    const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    return formatFileSize(totalBytes);
  };

  const getTotalPages = (): number => {
    return Object.values(fileMetadata).reduce(
      (sum, meta) => sum + meta.pages,
      0
    );
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
            Merge PDF Files Online
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
            Combine multiple PDF files into a single document for free. Secure
            online PDF merger with drag-and-drop functionality. Arrange PDFs in
            any order and download your merged file instantly - no software
            installation required.
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            role="alert"
            aria-live="polite"
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Upload Section */}
        <section aria-labelledby="upload-section-title">
          <Paper
            role="button"
            tabIndex={0}
            aria-label="Upload PDF area - drag and drop or click to select files"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 3,
              border: `2px dashed ${
                isDragOver ? theme.palette.primary.main : theme.palette.divider
              }`,
              backgroundColor: isDragOver
                ? theme.palette.action.hover
                : theme.palette.background.default,
              textAlign: "center",
              transition: "all 0.2s ease",
              cursor: "pointer",
              "&:focus": {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: "2px",
              },
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <motion.div
              animate={{ scale: isDragOver ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <FilePlus
                size={48}
                color={
                  isDragOver
                    ? theme.palette.primary.main
                    : theme.palette.text.secondary
                }
                aria-hidden="true"
              />
            </motion.div>

            <Typography
              id="upload-section-title"
              variant="h5"
              gutterBottom
              fontWeight={600}
              color={isDragOver ? "primary" : "textPrimary"}
              sx={{ mt: 2 }}
            >
              {isDragOver
                ? "Drop your PDF files here"
                : "Upload PDF Files to Merge"}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Drag and drop your PDF files here, or click to select files
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 3, display: "block" }}
            >
              Supports PDF files up to 100MB each • Minimum 2 files required
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              aria-label="Select PDF files to merge"
              style={{ display: "none" }}
            />

            <Button
              variant="contained"
              startIcon={<Upload />}
              size="large"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              aria-label="Select PDF files button"
            >
              Select PDF Files
            </Button>
          </Paper>
        </section>

        {/* Settings Section */}
        {selectedFiles.length > 0 && (
          <section aria-labelledby="settings-section-title">
            <Paper
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              role="region"
              aria-labelledby="settings-section-title"
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Settings size={20} aria-hidden="true" />
                <Typography
                  variant="h6"
                  sx={{ ml: 1 }}
                  id="settings-section-title"
                >
                  Merge Settings
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="merge-order-label">File Order</InputLabel>
                    <Select
                      labelId="merge-order-label"
                      value={mergeOrder}
                      onChange={(event) => {
                        handleOrderChange(event as any);
                      }}
                      label="File Order"
                      aria-describedby="merge-order-help"
                    >
                      <MenuItem value="original">Original Order</MenuItem>
                      <MenuItem value="alphabetical">
                        Alphabetical (A-Z)
                      </MenuItem>
                      <MenuItem value="size">
                        File Size (Small to Large)
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    id="merge-order-help"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    Choose how to order files in the merged PDF
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <Chip
                      icon={<Info size={14} />}
                      label={`${selectedFiles.length} files selected`}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      icon={<FileText size={14} />}
                      label={`${getTotalPages()} total pages`}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      icon={<Download size={14} />}
                      label={`Total size: ${getTotalFileSize()}`}
                      variant="outlined"
                      size="small"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </section>
        )}

        {/* Selected Files Section */}
        {selectedFiles.length > 0 && (
          <section aria-labelledby="selected-files-title">
            <Box sx={{ mt: 4 }} role="region">
              <Typography id="selected-files-title" variant="h6" gutterBottom>
                Selected PDF Files ({selectedFiles.length})
              </Typography>

              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box role="list" aria-label="List of selected PDF files">
                  {selectedFiles.map((file, index) => (
                    <Card
                      key={index}
                      variant="outlined"
                      sx={{
                        mb: index < selectedFiles.length - 1 ? 2 : 0,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          boxShadow: theme.shadows[2],
                        },
                      }}
                      role="listitem"
                    >
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                              flex: 1,
                            }}
                          >
                            <FileText
                              size={24}
                              color={theme.palette.primary.main}
                              aria-hidden="true"
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body1"
                                fontWeight={500}
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={file.name}
                              >
                                {file.name}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mt: 0.5 }}
                              >
                                <Chip
                                  label={
                                    fileMetadata[file.name]?.size ||
                                    formatFileSize(file.size)
                                  }
                                  size="small"
                                  variant="outlined"
                                />
                                {fileMetadata[file.name]?.pages > 0 && (
                                  <Chip
                                    label={`${
                                      fileMetadata[file.name].pages
                                    } pages`}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                )}
                                <Chip
                                  label={`Position ${index + 1}`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                />
                              </Stack>
                            </Box>
                          </Box>

                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Move up">
                              <IconButton
                                size="small"
                                onClick={() => handleMoveFile(index, "up")}
                                disabled={
                                  index === 0 || mergeOrder !== "original"
                                }
                                aria-label={`Move ${file.name} up in the list`}
                              >
                                <MoveUp size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Move down">
                              <IconButton
                                size="small"
                                onClick={() => handleMoveFile(index, "down")}
                                disabled={
                                  index === selectedFiles.length - 1 ||
                                  mergeOrder !== "original"
                                }
                                aria-label={`Move ${file.name} down in the list`}
                              >
                                <MoveDown size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove file">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemoveFile(index)}
                                aria-label={`Remove ${file.name} from the list`}
                              >
                                <Trash2 size={16} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Paper>

              {/* Progress Bar */}
              {isLoading && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Merging PDF files... {Math.round(mergeProgress)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={mergeProgress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}

              {/* Action Buttons */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleMerge}
                  disabled={selectedFiles.length < 2 || isLoading}
                  startIcon={
                    isLoading ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      <Merge />
                    )
                  }
                  sx={{ minWidth: 200 }}
                >
                  {isLoading ? "Merging..." : "Merge PDFs"}
                </Button>

                {mergedPdfUrl && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleDownload}
                    startIcon={<Download />}
                    sx={{ minWidth: 200 }}
                  >
                    Download Merged PDF
                  </Button>
                )}

                <Button
                  variant="text"
                  size="large"
                  onClick={handleClearAll}
                  disabled={isLoading}
                  color="error"
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          </section>
        )}

        {/* AdSense Ad */}
        <AdSense adSlot="3561331200" />

        {/* Features Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Why Choose Our Free PDF Merger?
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
                  <Merge size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Smart PDF Combining
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Merge unlimited PDF files with intelligent ordering options.
                  Arrange by upload order, alphabetically, or by file size for
                  perfect organization.
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
                  <Settings size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  100% Secure & Private
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All processing happens in your browser. Your PDF files never
                  leave your device, ensuring complete privacy and document
                  security.
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
                  <Download size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  No Software Required
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Works directly in your web browser on any device. No
                  downloads, installations, or account registration needed.
                  Completely free to use.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* How It Works Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            How to Merge PDF Files Online
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
                  Upload PDF Files
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Drag and drop multiple PDF files or click to select from your
                  device. Each file can be up to 100MB.
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
                  Arrange Order
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Organize your PDFs by upload order, alphabetically, or by file
                  size. Reorder manually using drag controls.
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
                  Merge PDFs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click "Merge PDFs" to combine all files into one document.
                  Processing happens securely in your browser.
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
                  Download Result
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download your merged PDF file instantly. Original files remain
                  unchanged on your device.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Informational Content */}
        <Box sx={{ mt: 4 }}>
          {/* What is PDF Merging Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              What is PDF Merging?
            </Typography>
            <Typography variant="body1" paragraph>
              PDF merging is the process of combining multiple PDF documents
              into a single, unified file. This powerful document management
              technique allows you to consolidate related documents, create
              comprehensive reports, or simply organize your files more
              efficiently. Our online PDF merger preserves the original quality
              and formatting of your documents while providing a seamless
              combination process.
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you need to combine invoices, merge chapters of a book, or
              consolidate multiple reports into one document, our free PDF
              merger handles the task securely in your browser without uploading
              files to external servers.
            </Typography>
          </motion.div>

          {/* Common Use Cases */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
              sx={{ mt: 4 }}
            >
              Common Use Cases for PDF Merging
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="business-docs-content"
                  id="business-docs-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Business Documentation
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="business-docs-content">
                  <Typography variant="body1">
                    Combine invoices, contracts, proposals, and reports into
                    comprehensive business packages. Merge quarterly reports,
                    financial statements, or project documentation for easier
                    sharing with clients, stakeholders, or team members.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="academic-content"
                  id="academic-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Academic and Research Papers
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="academic-content">
                  <Typography variant="body1">
                    Combine research papers, thesis chapters, academic articles,
                    or study materials into single documents. Perfect for
                    creating comprehensive literature reviews, dissertation
                    compilations, or course material packages for students and
                    researchers.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="legal-content"
                  id="legal-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Legal Document Assembly
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="legal-content">
                  <Typography variant="body1">
                    Merge legal documents, contracts, exhibits, and supporting
                    materials into complete case files. Combine court filings,
                    evidence documents, or contract packages while maintaining
                    the original formatting and legal integrity of each
                    document.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ChevronDown />}
                  aria-controls="personal-content"
                  id="personal-header"
                >
                  <Typography variant="h6" fontWeight={500}>
                    Personal Document Organization
                  </Typography>
                </AccordionSummary>
                <AccordionDetails id="personal-content">
                  <Typography variant="body1">
                    Organize personal documents like tax returns, insurance
                    papers, medical records, or travel documents into
                    consolidated files. Create digital filing systems by merging
                    related documents for easier storage and retrieval.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
              sx={{ mt: 4 }}
            >
              How Our PDF Merger Works
            </Typography>
            <Typography variant="body1" paragraph>
              Our PDF merger uses advanced client-side processing with the
              PDF-lib library, ensuring your documents never leave your device.
              The merging process involves reading each PDF file, extracting all
              pages, and combining them into a new document while preserving the
              original quality, fonts, and formatting.
            </Typography>
            <Typography variant="body1" paragraph>
              You can customize the merge order using our sorting options: keep
              the original upload order, sort alphabetically by filename, or
              arrange by file size. The tool supports unlimited file sizes and
              page counts, though very large documents may require more
              processing time.
            </Typography>
            <Typography variant="body1" paragraph>
              All processing happens locally in your browser using JavaScript,
              which means your sensitive documents remain completely private and
              secure. No data is transmitted to external servers, and all
              temporary files are automatically cleared when you close the
              browser.
            </Typography>
          </motion.div>

          {/* Benefits Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
              mt: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
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
                      Use our PDF merger completely free without creating an
                      account or providing personal information.
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
                      All processing happens locally in your browser. Your files
                      never leave your device.
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
                      Compatible with Windows, Mac, Linux, iOS, and Android.
                      Works in any modern web browser.
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
                      High Quality Output
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Maintains original PDF quality and formatting. No
                      compression or quality loss during merging.
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
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Frequently Asked Questions
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Is it safe to merge PDFs online?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Yes, our PDF merger is completely safe. All processing happens
                locally in your browser - your files never leave your device. No
                data is uploaded to our servers, ensuring complete privacy and
                security.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                What is the maximum file size for PDF merging?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Each PDF file can be up to 100MB in size. You can merge multiple
                files as long as each individual file stays within this limit.
                The tool processes files efficiently in your browser.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Can I change the order of PDFs before merging?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Yes, you can reorder PDFs in three ways: keep the original
                upload order, sort alphabetically by filename, or sort by file
                size. You can also manually drag files up or down in the list
                when using original order.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Can I merge password-protected PDFs?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Currently, our tool cannot merge password-protected or encrypted
                PDF files. You'll need to remove the password protection from
                your PDFs before merging them using our tool.
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <SocialShare
            url={
              typeof window !== "undefined"
                ? window.location.href
                : "https://www.kodekit.in/tools/pdf-merger"
            }
            title="Free PDF Merger Online | Combine Multiple PDF Files"
            description="Merge multiple PDF documents into one file with our free online tool. Secure, fast, and easy to use."
            hashtags={["PDFMerger", "CombinePDF", "DocumentTool", "OnlineTool"]}
          />
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
};

export default PdfMerger;
