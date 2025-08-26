"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  TextField,
  Slider,
  Stack,
  Alert,
  LinearProgress,
  Chip,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Upload,
  FileText,
  Trash2,
  Scissors,
  Download,
  FilePlus,
  Settings,
  RefreshCcw,
  Eye,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import SocialShare from "../SocialShare";
import AdSense from "../AdSense";
import Navigation from "@/components/Navigation";

const PdfSplitter = () => {
  const theme = useTheme();
  const { trackTool, trackFile, trackCustomEvent } = useAnalytics();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitMethod, setSplitMethod] = useState<
    "range" | "pages" | "individual"
  >("range");
  const [pageRange, setPageRange] = useState<[number, number]>([1, 1]);
  const [customPages, setCustomPages] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [splitProgress, setSplitProgress] = useState(0);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [splitPdfUrls, setSplitPdfUrls] = useState<
    { url: string; name: string }[]
  >([]);
  const [error, setError] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [outputFormat, setOutputFormat] = useState<"single" | "multiple">(
    "single"
  );
  const [fileMetadata, setFileMetadata] = useState<{
    size: string;
    created: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      trackTool("pdf-splitter", "view");
    }
  }, [trackTool]);

  const validatePdfFile = (file: File): boolean => {
    const maxSize = 100 * 1024 * 1024; // 100MB

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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];

        if (!validatePdfFile(file)) return;

        setSelectedFile(file);
        setSplitPdfUrl(null);
        setSplitPdfUrls([]);
        setError("");

        // Set file metadata
        setFileMetadata({
          size: formatFileSize(file.size),
          created: new Date(file.lastModified).toLocaleDateString(),
        });

        try {
          const { PDFDocument } = await import("pdf-lib");
          const arrayBuffer = await readFileAsArrayBuffer(file);
          const pdf = await PDFDocument.load(arrayBuffer);
          const pageCount = pdf.getPageCount();
          setTotalPages(pageCount);
          setPageRange([1, Math.min(pageCount, 1)]);

          setSnackbarMessage(`PDF loaded successfully: ${pageCount} pages`);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          // Track file selection
          trackTool("pdf-splitter", "add_file");
          trackFile("upload", "pdf", true);
        } catch (err) {
          console.error("Error reading PDF:", err);
          setError(
            "Failed to read PDF file. The file might be corrupted or password-protected."
          );
          setSelectedFile(null);
          setFileMetadata(null);
          setSnackbarMessage("Failed to load PDF file");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);

          // Track error
          trackFile("upload", "pdf", false);
          trackCustomEvent("error", "pdf", "file_load_failed");
        }
      }
    },
    [trackTool, trackFile, trackCustomEvent]
  );

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

      if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        const file = event.dataTransfer.files[0];

        if (!validatePdfFile(file)) return;

        setSelectedFile(file);
        setSplitPdfUrl(null);
        setSplitPdfUrls([]);
        setError("");

        setFileMetadata({
          size: formatFileSize(file.size),
          created: new Date(file.lastModified).toLocaleDateString(),
        });

        try {
          const { PDFDocument } = await import("pdf-lib");
          const arrayBuffer = await readFileAsArrayBuffer(file);
          const pdf = await PDFDocument.load(arrayBuffer);
          const pageCount = pdf.getPageCount();
          setTotalPages(pageCount);
          setPageRange([1, Math.min(pageCount, 1)]);

          setSnackbarMessage(`PDF loaded successfully: ${pageCount} pages`);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);

          // Track drag and drop
          trackTool("pdf-splitter", "drop_file");
          trackFile("upload", "pdf", true);
        } catch (err) {
          console.error("Error reading PDF:", err);
          setError(
            "Failed to read PDF file. The file might be corrupted or password-protected."
          );
          setSelectedFile(null);
          setFileMetadata(null);
          setSnackbarMessage("Failed to load PDF file");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);

          // Track error
          trackFile("upload", "pdf", false);
          trackCustomEvent("error", "pdf", "file_load_failed");
        }
      }
    },
    [trackTool, trackFile, trackCustomEvent]
  );

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPageRange([1, 1]);
    setCustomPages("");
    setTotalPages(0);
    setSplitPdfUrl(null);
    setSplitPdfUrls([]);
    setError("");
    setFileMetadata(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSnackbarMessage("File removed");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    // Track file removal
    trackTool("pdf-splitter", "remove_file");
  };

  const handleRangeChange = (_event: Event, newValue: number | number[]) => {
    setPageRange(newValue as [number, number]);
    setSplitPdfUrl(null);
  };

  const handleCustomPagesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomPages(event.target.value);
    setSplitPdfUrl(null);
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const parseCustomPages = (input: string): number[] => {
    if (!input.trim()) return [];
    const pages: number[] = [];
    const parts = input.split(",");
    for (const part of parts) {
      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages && !pages.includes(i)) {
              pages.push(i);
            }
          }
        }
      } else {
        const pageNum = Number(part);
        if (
          !isNaN(pageNum) &&
          pageNum > 0 &&
          pageNum <= totalPages &&
          !pages.includes(pageNum)
        ) {
          pages.push(pageNum);
        }
      }
    }
    return pages.sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setSplitPdfUrl(null);
    setSplitPdfUrls([]);
    setError("");
    setSplitProgress(0);

    // Track split operation
    trackTool("pdf-splitter", "split");
    trackCustomEvent(
      "conversion",
      "pdf",
      `split_pdf_${splitMethod}`,
      totalPages
    );

    try {
      const { PDFDocument } = await import("pdf-lib");
      const fileBuffer = await readFileAsArrayBuffer(selectedFile);
      const pdfDoc = await PDFDocument.load(fileBuffer);
      setSplitProgress(10);

      let pagesToExtract: number[] = [];

      if (splitMethod === "range") {
        for (let i = pageRange[0]; i <= pageRange[1]; i++) {
          pagesToExtract.push(i - 1);
        }
      } else if (splitMethod === "pages") {
        pagesToExtract = parseCustomPages(customPages).map((p) => p - 1);
      } else if (splitMethod === "individual") {
        // Split into individual pages
        pagesToExtract = Array.from({ length: totalPages }, (_, i) => i);
      }

      if (pagesToExtract.length === 0) {
        throw new Error("No valid pages selected for extraction");
      }

      setSplitProgress(25);

      if (outputFormat === "multiple" || splitMethod === "individual") {
        // Create multiple PDF files
        const urls: { url: string; name: string }[] = [];

        for (let i = 0; i < pagesToExtract.length; i++) {
          const pageIndex = pagesToExtract[i];
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [pageIndex]);
          newPdf.addPage(copiedPage);

          const newPdfBytes = await newPdf.save();
          const blob = new Blob([newPdfBytes.buffer as ArrayBuffer], {
            type: "application/pdf",
          });
          const url = URL.createObjectURL(blob);

          const fileName = `${selectedFile.name.replace(".pdf", "")}_page_${
            pageIndex + 1
          }.pdf`;
          urls.push({ url, name: fileName });

          setSplitProgress(25 + ((i + 1) / pagesToExtract.length) * 65);
        }

        setSplitPdfUrls(urls);
        setSnackbarMessage(
          `Successfully split into ${urls.length} separate PDF files`
        );
        // Track successful split
        trackCustomEvent(
          "success",
          "pdf",
          "split_complete_multiple",
          splitPdfUrls.length
        );
      } else {
        // Create single PDF file
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
        copiedPages.forEach((page) => newPdf.addPage(page));

        setSplitProgress(75);

        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes.buffer as ArrayBuffer], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        setSplitPdfUrl(url);

        setSnackbarMessage(
          `Successfully extracted ${pagesToExtract.length} pages`
        );
        // Track successful split
        trackCustomEvent(
          "success",
          "pdf",
          "split_complete_single",
          pagesToExtract.length
        );
      }

      setSplitProgress(100);
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error splitting PDF:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to split PDF. Please try again.";
      setError(errorMessage);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      // Track error
      trackCustomEvent("error", "pdf", "split_failed");
    } finally {
      setIsLoading(false);
      setTimeout(() => setSplitProgress(0), 2000);
    }
  };

  const handleClearAll = () => {
    setSelectedFile(null);
    setSplitPdfUrl(null);
    setSplitPdfUrls([]);
    setError("");
    setFileMetadata(null);
    setPageRange([1, 1]);
    setCustomPages("");
    setTotalPages(0);
    setSplitProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSnackbarMessage("All data cleared");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const downloadAllFiles = async () => {
    if (splitPdfUrls.length === 0) return;

    try {
      setSnackbarMessage("Creating ZIP file...");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Dynamic import for JSZip
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add all PDF files to the ZIP
      for (let i = 0; i < splitPdfUrls.length; i++) {
        const { url, name } = splitPdfUrls[i];
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          zip.file(name, blob);
        } catch (error) {
          console.error(`Error adding ${name} to ZIP:`, error);
          // Continue with other files even if one fails
        }
      }

      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });

      // Create download link
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `${
        selectedFile?.name.replace(".pdf", "") || "split_pages"
      }_${new Date().toISOString().split("T")[0]}.zip`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(zipUrl), 100);

      setSnackbarMessage(
        `Successfully downloaded ${splitPdfUrls.length} files as ZIP`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      setSnackbarMessage(
        "Failed to create ZIP file. Try downloading files individually."
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const getSelectedPagesPreview = (): string => {
    if (splitMethod === "range") {
      return `Pages ${pageRange[0]}-${pageRange[1]} (${
        pageRange[1] - pageRange[0] + 1
      } pages)`;
    } else if (splitMethod === "pages") {
      const pages = parseCustomPages(customPages);
      return pages.length > 0
        ? `${pages.length} pages: ${pages.join(", ")}`
        : "No valid pages";
    } else {
      return `All ${totalPages} pages (individual files)`;
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
            Split PDF Files Online
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
            Extract PDF pages with our free online PDF splitter tool. Split PDFs
            by page ranges, custom pages, or individual files. Secure
            client-side processing with no file uploads required.
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            aria-live="polite"
            role="alert"
            onClose={() => setError("")}
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {/* Upload Section */}
        <section aria-labelledby="upload-section-title">
          <Paper
            role="button"
            tabIndex={0}
            aria-label="Upload PDF area - drag and drop or click to select file"
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
              {isDragOver ? "Drop your PDF file here" : "Upload PDF to Split"}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Drag and drop your PDF file here, or click to select
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 3, display: "block" }}
            >
              Supports PDF files up to 100MB • Secure client-side processing
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              aria-label="Select PDF file to split"
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
              disabled={isLoading}
              aria-label="Select PDF file button"
            >
              Select PDF File
            </Button>
          </Paper>
        </section>

        {/* Selected File Info */}
        {selectedFile && (
          <section aria-labelledby="selected-file-title">
            <Box sx={{ mt: 4 }} role="region">
              <Typography id="selected-file-title" variant="h6" gutterBottom>
                Selected PDF File
              </Typography>

              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <FileText
                        size={32}
                        color={theme.palette.primary.main}
                        aria-hidden="true"
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {selectedFile.name}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                          <Chip
                            label={
                              fileMetadata?.size ||
                              formatFileSize(selectedFile.size)
                            }
                            size="small"
                            variant="outlined"
                          />
                          <Chip
                            label={`${totalPages} pages`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {fileMetadata?.created && (
                            <Chip
                              label={`Created: ${fileMetadata.created}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Box>
                    </Box>
                    <Tooltip title="Remove file">
                      <IconButton
                        color="error"
                        onClick={handleRemoveFile}
                        aria-label={`Remove file: ${selectedFile.name}`}
                        disabled={isLoading}
                      >
                        <Trash2 size={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  {/* Preview of selected pages */}
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Selection Preview:</strong>{" "}
                      {getSelectedPagesPreview()}
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>

              {/* Settings Section */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
                role="region"
                aria-labelledby="split-settings-title"
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Settings size={20} aria-hidden="true" />
                  <Typography
                    variant="h6"
                    sx={{ ml: 1 }}
                    id="split-settings-title"
                  >
                    Split Settings
                  </Typography>
                </Box>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight={500}
                    >
                      Split Method
                    </Typography>
                    <Stack direction="column" spacing={1}>
                      <Button
                        variant={
                          splitMethod === "range" ? "contained" : "outlined"
                        }
                        onClick={() => {
                          setSplitMethod("range");
                          setSplitPdfUrl(null);
                          setSplitPdfUrls([]);
                        }}
                        aria-label="Select page range method"
                        disabled={isLoading}
                        fullWidth
                        startIcon={<Scissors size={16} />}
                      >
                        Page Range
                      </Button>
                      <Button
                        variant={
                          splitMethod === "pages" ? "contained" : "outlined"
                        }
                        onClick={() => {
                          setSplitMethod("pages");
                          setSplitPdfUrl(null);
                          setSplitPdfUrls([]);
                        }}
                        aria-label="Select custom pages method"
                        disabled={isLoading}
                        fullWidth
                        startIcon={<Eye size={16} />}
                      >
                        Custom Pages
                      </Button>
                      <Button
                        variant={
                          splitMethod === "individual"
                            ? "contained"
                            : "outlined"
                        }
                        onClick={() => {
                          setSplitMethod("individual");
                          setSplitPdfUrl(null);
                          setSplitPdfUrls([]);
                          setOutputFormat("multiple");
                        }}
                        aria-label="Split into individual pages"
                        disabled={isLoading}
                        fullWidth
                        startIcon={<FilePlus size={16} />}
                      >
                        Individual Pages
                      </Button>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    {splitMethod === "range" && (
                      <Box>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight={500}
                        >
                          Page Range
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Select pages {pageRange[0]} to {pageRange[1]}
                        </Typography>
                        <Slider
                          value={pageRange}
                          onChange={handleRangeChange}
                          valueLabelDisplay="auto"
                          min={1}
                          max={totalPages}
                          disabled={isLoading}
                          sx={{ mt: 2 }}
                        />
                      </Box>
                    )}

                    {splitMethod === "pages" && (
                      <Box>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight={500}
                        >
                          Custom Pages
                        </Typography>
                        <TextField
                          fullWidth
                          value={customPages}
                          onChange={handleCustomPagesChange}
                          placeholder="e.g., 1,3,5-8,10"
                          helperText="Enter page numbers separated by commas. Use hyphens for ranges."
                          disabled={isLoading}
                        />
                      </Box>
                    )}

                    {splitMethod === "individual" && (
                      <Box>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          fontWeight={500}
                        >
                          Individual Pages
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Each page will be saved as a separate PDF file.
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>

                {splitMethod !== "individual" && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="output-format-label">
                          Output Format
                        </InputLabel>
                        <Select
                          labelId="output-format-label"
                          value={outputFormat}
                          onChange={(e) =>
                            setOutputFormat(
                              e.target.value as "single" | "multiple"
                            )
                          }
                          label="Output Format"
                          disabled={isLoading}
                        >
                          <MenuItem value="single">Single PDF File</MenuItem>
                          <MenuItem value="multiple">
                            Multiple PDF Files
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        Choose whether to create one file or separate files for
                        each page
                      </Typography>
                    </Grid>
                  </Grid>
                )}
              </Paper>

              {/* Progress Bar */}
              {isLoading && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Splitting PDF... {Math.round(splitProgress)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={splitProgress}
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
                  onClick={handleSplit}
                  disabled={!selectedFile || isLoading}
                  startIcon={
                    isLoading ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      <Scissors />
                    )
                  }
                  sx={{ minWidth: 200 }}
                >
                  {isLoading ? "Splitting..." : "Split PDF"}
                </Button>

                {splitPdfUrl && (
                  <Button
                    variant="outlined"
                    size="large"
                    component="a"
                    href={splitPdfUrl}
                    download={`split_${selectedFile?.name || "document"}`}
                    startIcon={<Download />}
                    sx={{ minWidth: 200 }}
                  >
                    Download PDF
                  </Button>
                )}

                {splitPdfUrls.length > 0 && (
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={downloadAllFiles}
                    startIcon={<Download />}
                    sx={{ minWidth: 200 }}
                  >
                    Download All as ZIP
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

              {/* Individual File Downloads */}
              {splitPdfUrls.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Individual Files ({splitPdfUrls.length})
                  </Typography>
                  <Paper sx={{ p: 2, borderRadius: 2 }}>
                    <Grid container spacing={2}>
                      {splitPdfUrls.map((file, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card variant="outlined" sx={{ height: "100%" }}>
                            <CardContent
                              sx={{ p: 2, "&:last-child": { pb: 2 } }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mb: 1,
                                }}
                              >
                                <FileText
                                  size={16}
                                  color={theme.palette.primary.main}
                                />
                                <Typography
                                  variant="body2"
                                  fontWeight={500}
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    flex: 1,
                                  }}
                                  title={file.name}
                                >
                                  {file.name}
                                </Typography>
                              </Box>
                              <Button
                                variant="outlined"
                                size="small"
                                component="a"
                                href={file.url}
                                download={file.name}
                                startIcon={<Download size={14} />}
                                fullWidth
                              >
                                Download
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                </Box>
              )}
            </Box>
          </section>
        )}
      </motion.div>

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
          Why Choose Our Free PDF Splitter?
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
                <Scissors size={24} color="white" />
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Multiple Split Methods
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Extract page ranges, select custom pages, or split into
                individual files. Flexible splitting options for any PDF
                document structure.
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
                Works directly in your web browser on any device. No downloads,
                installations, or account registration needed. Completely free
                to use.
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
          How to Split PDF Files Online
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
                Upload PDF File
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drag and drop your PDF file or click to select from your device.
                Files up to 100MB are supported.
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
                Choose Split Method
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select page ranges, custom pages, or individual files. Preview
                your selection before splitting.
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
                Split PDF
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click "Split PDF" to extract your selected pages. Processing
                happens securely in your browser.
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
                Download Files
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Download individual files or get all split PDFs in a single ZIP
                archive.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Informational Content */}
      <Box sx={{ mt: 4 }}>
        {/* What is PDF Splitting Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            What is PDF Splitting?
          </Typography>
          <Typography variant="body1" paragraph>
            PDF splitting is the process of extracting specific pages or
            sections from a PDF document to create new, smaller PDF files. This
            powerful document management technique allows you to break down
            large documents into manageable pieces, extract relevant sections,
            or create focused documents from comprehensive sources.
          </Typography>
          <Typography variant="body1" paragraph>
            Our online PDF splitter offers multiple splitting methods: extract
            page ranges, select custom pages, or split every page into
            individual files. All processing happens securely in your browser
            without uploading files to external servers.
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
            Common Use Cases for PDF Splitting
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="document-extraction-content"
                id="document-extraction-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Document Section Extraction
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="document-extraction-content">
                <Typography variant="body1">
                  Extract specific chapters from books, individual forms from
                  document packages, or relevant sections from reports. Perfect
                  for sharing only the necessary parts of large documents while
                  keeping the original intact.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="email-sharing-content"
                id="email-sharing-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Email and File Sharing
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="email-sharing-content">
                <Typography variant="body1">
                  Split large PDF files to meet email attachment size limits or
                  cloud storage restrictions. Extract only the pages you need to
                  share, reducing file sizes and improving transfer speeds while
                  maintaining document quality.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="privacy-content"
                id="privacy-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Privacy and Confidentiality
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="privacy-content">
                <Typography variant="body1">
                  Remove sensitive pages from documents before sharing, extract
                  public sections from confidential reports, or create redacted
                  versions by selecting only non-sensitive pages. Maintain
                  document security while sharing necessary information.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="organization-content"
                id="organization-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Document Organization
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="organization-content">
                <Typography variant="body1">
                  Break down large manuals into individual sections, separate
                  invoices from bulk statements, or organize multi-topic
                  documents into focused files. Create better filing systems by
                  splitting comprehensive documents into logical components.
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
            How Our PDF Splitter Works
          </Typography>
          <Typography variant="body1" paragraph>
            Our PDF splitter uses advanced client-side processing with the
            PDF-lib library, ensuring your documents never leave your device.
            The splitting process involves reading your PDF file, identifying
            the pages you want to extract, and creating new PDF documents with
            only those pages while preserving all original formatting, fonts,
            and quality.
          </Typography>
          <Typography variant="body1" paragraph>
            You can choose from three splitting methods: page ranges for
            continuous sections, custom pages for specific selections, or
            individual pages to create separate files for each page. The tool
            supports multiple output formats, allowing you to create either a
            single combined PDF or multiple separate files.
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
                    Use our PDF splitter completely free without creating an
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
                    High Quality Output
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Maintains original PDF quality and formatting. No
                    compression or quality loss during splitting.
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
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Frequently Asked Questions
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              What splitting methods are available?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Our PDF splitter offers three methods: Page Range (extract
              continuous pages like 5-10), Custom Pages (select specific pages
              like 1,3,7-9), and Individual Pages (split every page into
              separate files). You can also choose between single or multiple
              output files.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              What file size limits do you have?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You can upload PDF files up to 100MB in size. Most documents will
              be much smaller than this limit.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Is my PDF data secure?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Yes, absolutely. All PDF processing happens entirely in your
              browser using client-side JavaScript. Your files are never
              uploaded to our servers.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Can I split password-protected PDFs?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Unfortunately, this tool cannot process password-protected or
              encrypted PDF files. You'll need to remove the password protection
              from your PDF before splitting.
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mt: 4 }}>
        <SocialShare
          title="Free PDF Splitter Online | Split PDF Pages & Extract Pages"
          url={
            typeof window !== "undefined"
              ? window.location.href
              : "https://www.kodekit.in/tools/pdf-splitter"
          }
          description="Split PDF documents into individual pages or custom ranges with our free online tool. Secure and easy to use."
          hashtags={["PDFSplitter", "SplitPDF", "ExtractPages", "OnlineTool"]}
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
    </Container>
  );
};

export default PdfSplitter;
