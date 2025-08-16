"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
    }
  }, []);

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
        }
      }
    },
    []
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (event: React.DragEvent) => {
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
      }
    }
  }, []);

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
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          PDF Splitter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Split your PDF files into multiple documents. Extract specific pages,
          page ranges, or create individual files from each page with our free,
          secure online tool.
        </Typography>

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

      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
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

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 4 }}
          >
            Frequently Asked Questions
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-1-content"
                id="faq-1-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  What splitting methods are available?
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="faq-1-content">
                <Typography variant="body1">
                  Our PDF splitter offers three methods: Page Range (extract
                  continuous pages like 5-10), Custom Pages (select specific
                  pages like 1,3,7-9), and Individual Pages (split every page
                  into separate files). You can also choose between single or
                  multiple output files.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-2-content"
                id="faq-2-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Is this tool completely secure and private?
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="faq-2-content">
                <Typography variant="body1">
                  Yes! All PDF processing happens entirely in your browser using
                  client-side JavaScript. No files are uploaded to our servers
                  or any third-party services. Your documents remain completely
                  private, and all data is automatically cleared when you close
                  the browser tab.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-3-content"
                id="faq-3-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  What file size limits apply?
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="faq-3-content">
                <Typography variant="body1">
                  The tool supports PDF files up to 100MB in size with no limit
                  on the number of pages. Processing time may vary depending on
                  file size and complexity. For very large files, consider
                  splitting them into smaller sections first.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-4-content"
                id="faq-4-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Can I split password-protected PDFs?
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="faq-4-content">
                <Typography variant="body1">
                  Unfortunately, this tool cannot process password-protected or
                  encrypted PDF files. You'll need to remove the password
                  protection from your PDF before splitting. Most PDF viewers
                  and editors provide options to remove passwords if you have
                  the original password.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-5-content"
                id="faq-5-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Will the split PDFs maintain original quality?
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="faq-5-content">
                <Typography variant="body1">
                  Yes, the splitting process preserves the original quality,
                  fonts, images, and formatting of all extracted pages. No
                  compression or quality reduction occurs during the split
                  process, ensuring your final documents maintain professional
                  standards.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-6-content"
                id="faq-6-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  How do I download multiple split files?
                </Typography>
              </AccordionSummary>
              <AccordionDetails id="faq-6-content">
                <Typography variant="body1">
                  When splitting into multiple files, you can download
                  individual files one by one, or use the "Download All as ZIP"
                  button to get all split files in a single compressed archive.
                  The ZIP file will contain all your split PDFs with descriptive
                  filenames.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </motion.div>
      </Box>

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
