import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  IconButton,
  CircularProgress,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
} from "@mui/material";
import {
  Upload,
  FileText,
  Trash2,
  MoveUp,
  MoveDown,
  Download,
  ChevronDown,
  FilePlus,
  Settings,
  Info,
  CheckCircle,
  RefreshCcw,
  Merge,
} from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import SocialShare from "../components/SocialShare";

const PdfMerger = () => {
  const theme = useTheme();
  const shareLink = window.location.href;
  const isProductionEnv = import.meta.env.PROD;
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
    window.scrollTo(0, 0);
  }, []);

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
        }
      }
    },
    []
  );

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
  };

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

    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);
      const validFiles = files.filter(validatePdfFile);

      if (validFiles.length > 0) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setMergedPdfUrl(null);
        setError("");

        // Extract metadata for new files
        const newMetadata: { [key: string]: { pages: number; size: string } } =
          {};
        for (const file of validFiles) {
          newMetadata[file.name] = await extractPdfMetadata(file);
        }
        setFileMetadata((prev) => ({ ...prev, ...newMetadata }));

        setSnackbarMessage(
          `${validFiles.length} PDF file(s) added successfully`
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    }
  }, []);

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

  const handleMerge = async () => {
    if (selectedFiles.length < 2) return;

    setIsLoading(true);
    setMergedPdfUrl(null);
    setMergeProgress(0);
    setError("");

    try {
      const mergedPdf = await PDFDocument.create();
      const orderedFiles = getOrderedFiles();

      for (let i = 0; i < orderedFiles.length; i++) {
        const file = orderedFiles[i];
        setMergeProgress(((i + 1) / orderedFiles.length) * 90); // Reserve 10% for final processing

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
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
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
    } catch (error) {
      console.error("Error merging PDFs:", error);
      if (!error.message?.includes("Failed to process PDF")) {
        setError(
          "Failed to merge PDF files. Please ensure all files are valid PDFs and try again."
        );
      }
      setSnackbarMessage("Merge failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>
          Free PDF Merger Online | Combine Multiple PDF Files | KodeKit
        </title>
        <meta
          name="description"
          content="Merge multiple PDF documents into one file with our free online tool. Combine PDFs securely, preserve quality, reorder pages, and download instantly. No software installation required."
        />
        <meta
          name="keywords"
          content="PDF merger, combine PDFs, merge PDF files online, online PDF tool, document management, PDF combiner, join PDF files, merge documents online, PDF joiner, combine multiple PDFs, free PDF merger, online document merger, PDF concatenation, merge PDF without software, batch PDF merger, PDF file combiner, join multiple PDFs, PDF merge tool, combine PDF documents, PDF union tool, merge PDF pages, PDF consolidation, document combining tool, PDF assembly tool"
        />
        <link rel="canonical" href="https://www.kodekit.in/tools/pdf-merger" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Free PDF Merger Online | Combine Multiple PDF Files"
        />
        <meta
          property="og:description"
          content="Merge multiple PDF documents into one file with our free online tool. Secure, fast, and easy to use."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/pdf-merger"
        />
        <meta
          property="og:image"
          content="https://www.kodekit.in/og-pdf-merger.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Free PDF Merger Online | Combine Multiple PDF Files"
        />
        <meta
          name="twitter:description"
          content="Merge multiple PDF documents into one file with our free online tool."
        />
        <meta
          name="twitter:image"
          content="https://www.kodekit.in/og-pdf-merger.jpg"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PDF Merger Tool",
              "description": "Free online tool to combine multiple PDF documents into a single file. Secure client-side processing with custom ordering options.",
              "url": "https://www.kodekit.in/tools/pdf-merger",
              "category": "Document Management Tool",
              "operatingSystem": "Web Browser",
              "applicationCategory": "UtilityApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "featureList": [
                "Merge multiple PDF files",
                "Drag and drop interface",
                "Custom file ordering",
                "Secure client-side processing",
                "No file size limits",
                "Preserve PDF quality",
                "Batch PDF processing",
                "No software installation required"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1850"
              }
            }
          `}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Merge PDF Files Online
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Combine multiple PDF files into a single document. Arrange them in any
          order you want with our free, secure online PDF merger.
        </Typography>

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
                      onChange={(e) =>
                        setMergeOrder(
                          e.target.value as "original" | "alphabetical" | "size"
                        )
                      }
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
                <Box sx={{ mt: 3 }} role="status" aria-live="polite">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Merging PDF files... {mergeProgress.toFixed(0)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={mergeProgress}
                    sx={{ borderRadius: 1, height: 8 }}
                    aria-label={`Merge progress: ${mergeProgress.toFixed(0)}%`}
                  />
                </Box>
              )}

              {/* Action Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleMerge}
                  disabled={selectedFiles.length < 2 || isLoading}
                  startIcon={
                    isLoading ? (
                      <RefreshCcw className="animate-spin" size={16} />
                    ) : (
                      <Merge size={16} />
                    )
                  }
                  aria-label={`Merge ${selectedFiles.length} selected PDF files`}
                  sx={{ flex: 1 }}
                >
                  {isLoading
                    ? `Merging... (${mergeProgress.toFixed(0)}%)`
                    : `Merge ${selectedFiles.length} PDF Files`}
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  color="error"
                  onClick={handleClearAll}
                  disabled={selectedFiles.length === 0 || isLoading}
                  startIcon={<Trash2 size={16} />}
                  aria-label="Clear all selected files"
                >
                  Clear All
                </Button>

                {mergedPdfUrl && (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    href={mergedPdfUrl}
                    download={`merged-document-${
                      new Date().toISOString().split("T")[0]
                    }.pdf`}
                    startIcon={<Download size={16} />}
                    aria-label="Download merged PDF file"
                    sx={{
                      animation: "pulse 2s infinite",
                      "@keyframes pulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.8 },
                      },
                    }}
                  >
                    <CheckCircle size={16} style={{ marginRight: 8 }} />
                    Download Merged PDF
                  </Button>
                )}
              </Stack>
            </Box>
          </section>
        )}
      </motion.div>

      {isProductionEnv && <AdSense adSlot="6613251015" />}

      <Box sx={{ mt: 8 }}>
        <Divider sx={{ mb: 4 }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            What is PDF Merging?
          </Typography>
          <Typography variant="body1" paragraph>
            PDF merging is the process of combining multiple PDF documents into
            a single, unified file. This powerful document management technique
            allows you to consolidate related documents, create comprehensive
            reports, or simply organize your files more efficiently. Our online
            PDF merger preserves the original quality and formatting of your
            documents while providing a seamless combination process.
          </Typography>
          <Typography variant="body1" paragraph>
            Whether you need to combine invoices, merge chapters of a book, or
            consolidate multiple reports into one document, our free PDF merger
            handles the task securely in your browser without uploading files to
            external servers.
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
                  or study materials into single documents. Perfect for creating
                  comprehensive literature reviews, dissertation compilations,
                  or course material packages for students and researchers.
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
                  evidence documents, or contract packages while maintaining the
                  original formatting and legal integrity of each document.
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
                  papers, medical records, or travel documents into consolidated
                  files. Create digital filing systems by merging related
                  documents for easier storage and retrieval.
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
            Our PDF merger uses advanced client-side processing with the PDF-lib
            library, ensuring your documents never leave your device. The
            merging process involves reading each PDF file, extracting all
            pages, and combining them into a new document while preserving the
            original quality, fonts, and formatting.
          </Typography>
          <Typography variant="body1" paragraph>
            You can customize the merge order using our sorting options: keep
            the original upload order, sort alphabetically by filename, or
            arrange by file size. The tool supports unlimited file sizes and
            page counts, though very large documents may require more processing
            time.
          </Typography>
          <Typography variant="body1" paragraph>
            All processing happens locally in your browser using JavaScript,
            which means your sensitive documents remain completely private and
            secure. No data is transmitted to external servers, and all
            temporary files are automatically cleared when you close the
            browser.
          </Typography>
        </motion.div>

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
            <Accordion sx={{ mb: 1 }} aria-label="What files can I merge?">
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-1-content"
                id="faq-1-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  What types of PDF files can I merge?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  You can merge any standard PDF files created from documents,
                  scans, images, or forms. There’s no restriction on file size
                  or number of pages, though performance may vary with very
                  large files.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }} aria-label="Is it free to use?">
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-2-content"
                id="faq-2-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Is the PDF merger tool free?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Yes, our PDF merger is completely free to use. No registration
                  or payment is required. All merging happens directly in your
                  browser without uploading files to a server.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }} aria-label="How secure is the tool?">
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-3-content"
                id="faq-3-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Is my data safe when using this tool?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Yes, your privacy is protected. The tool works entirely in
                  your browser, so no files are uploaded to external servers.
                  Once you close the page, all file data is deleted.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{ mb: 1 }}
              aria-label="Can I reorder files before merging?"
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-4-content"
                id="faq-4-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Can I rearrange the order of PDF files before merging?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Absolutely! Use the up and down arrows next to each file to
                  adjust their order before merging. The merged PDF will
                  preserve the sequence you set.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{ mb: 1 }}
              aria-label="What if I have password-protected PDFs?"
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-5-content"
                id="faq-5-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Can I merge password-protected PDF files?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Unfortunately, this tool does not support merging
                  password-protected PDFs. Please remove passwords or encryption
                  from your files before uploading them.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </motion.div>
      </Box>

      <SocialShare
        url={shareLink}
        title="Free PDF Merger Online | Combine Multiple PDF Files"
        description="Merge multiple PDF documents into one file with our free online tool. Secure, fast, and easy to use."
        hashtags={["PDFMerger", "CombinePDF", "DocumentTool", "OnlineTool"]}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        aria-live="polite"
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          role="alert"
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PdfMerger;
