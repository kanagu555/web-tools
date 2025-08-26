"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  Alert,
  Grid,
  Card,
  CardContent,
  Snackbar,
  CircularProgress,
  TextField,
  Divider,
} from "@mui/material";
import {
  Upload,
  Download,
  FileText,
  Edit,
  RefreshCcw,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";
import { useAnalytics } from "@/hooks/useAnalytics";

interface PdfMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date | null;
  modificationDate?: Date | null;
}

const PdfMetadataEditor = () => {
  const theme = useTheme();
  const { trackTool, trackFile, trackCustomEvent, trackError } = useAnalytics();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [metadata, setMetadata] = useState<PdfMetadata>({});
  const [originalMetadata, setOriginalMetadata] = useState<PdfMetadata>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const metadataEditorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // Track tool view on mount
  useEffect(() => {
    trackTool("pdf-metadata-editor", "view");
  }, [trackTool]);

  const validatePdfFile = (file: File): boolean => {
    const maxSize = 100 * 1024 * 1024; // 100MB

    if (file.type !== "application/pdf") {
      setError(`${file.name} is not a PDF file. Please select only PDF files.`);
      trackFile("upload", "pdf", false);
      trackTool("pdf-metadata-editor", "invalid_file_type");
      return false;
    }

    if (file.size > maxSize) {
      setError(`${file.name} is too large. Maximum file size is 100MB.`);
      trackFile("upload", "pdf", false);
      trackTool("pdf-metadata-editor", "file_too_large");
      return false;
    }

    return true;
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const extractMetadata = (pdf: PDFDocument): PdfMetadata => {
    const keywords = pdf.getKeywords();
    return {
      title: pdf.getTitle() || "",
      author: pdf.getAuthor() || "",
      subject: pdf.getSubject() || "",
      keywords: Array.isArray(keywords) ? keywords.join(", ") : "",
      creator: pdf.getCreator() || "",
      producer: pdf.getProducer() || "",
      creationDate: pdf.getCreationDate() || null,
      modificationDate: pdf.getModificationDate() || null,
    };
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return "Not set";
    return date.toLocaleString();
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        if (!validatePdfFile(file)) return;

        setSelectedFile(file);
        setError("");
        setIsLoading(true);
        trackTool("pdf-metadata-editor", "select_file");

        try {
          const fileBuffer = await readFileAsArrayBuffer(file);
          const pdf = await PDFDocument.load(fileBuffer);
          setPdfDoc(pdf);

          const extractedMetadata = extractMetadata(pdf);
          setMetadata(extractedMetadata);
          setOriginalMetadata(extractedMetadata);

          setSnackbarMessage("PDF loaded successfully. Metadata extracted.");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          trackTool("pdf-metadata-editor", "upload_success");
          trackFile("upload", "pdf", true);

          // Scroll to metadata editor after successful upload
          setTimeout(() => {
            scrollToMetadataEditor();
          }, 500);
        } catch (err) {
          // Clear previous file state on error
          setSelectedFile(null);
          setPdfDoc(null);
          setMetadata({});
          setOriginalMetadata({});

          setError(
            "Failed to load PDF. Please ensure the file is not password-protected."
          );
          console.error("PDF loading error:", err);
          trackTool("pdf-metadata-editor", "upload_error");
          trackFile("upload", "pdf", false);
          trackError("pdf_load_failed", false);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [trackTool, trackFile, trackError]
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

      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0];
        if (!validatePdfFile(file)) return;

        setSelectedFile(file);
        setError("");
        setIsLoading(true);
        trackTool("pdf-metadata-editor", "drop_files");

        try {
          const fileBuffer = await readFileAsArrayBuffer(file);
          const pdf = await PDFDocument.load(fileBuffer);
          setPdfDoc(pdf);

          const extractedMetadata = extractMetadata(pdf);
          setMetadata(extractedMetadata);
          setOriginalMetadata(extractedMetadata);

          setSnackbarMessage("PDF loaded successfully. Metadata extracted.");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          trackTool("pdf-metadata-editor", "upload_success");
          trackFile("upload", "pdf", true);

          // Scroll to metadata editor after successful upload
          setTimeout(() => {
            scrollToMetadataEditor();
          }, 500);
        } catch (err) {
          // Clear previous file state on error
          setSelectedFile(null);
          setPdfDoc(null);
          setMetadata({});
          setOriginalMetadata({});

          setError(
            "Failed to load PDF. Please ensure the file is not password-protected."
          );
          console.error("PDF loading error:", err);
          trackTool("pdf-metadata-editor", "upload_error");
          trackFile("upload", "pdf", false);
          trackError("pdf_load_failed", false);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [trackTool, trackFile, trackError]
  );

  const handleMetadataChange = (field: keyof PdfMetadata, value: string) => {
    setMetadata((prev) => ({ ...prev, [field]: value }));
    trackCustomEvent("edit", "metadata", field, 1);
  };

  const resetMetadata = () => {
    setMetadata(originalMetadata);
    setSnackbarMessage("Metadata reset to original values");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
    trackTool("pdf-metadata-editor", "reset_metadata");
  };

  const downloadUpdatedPdf = async () => {
    if (!pdfDoc || !selectedFile) return;

    setIsLoading(true);
    setError("");

    try {
      // Update metadata in the PDF
      if (metadata.title !== undefined) {
        pdfDoc.setTitle(metadata.title);
      }
      if (metadata.author !== undefined) {
        pdfDoc.setAuthor(metadata.author);
      }
      if (metadata.subject !== undefined) {
        pdfDoc.setSubject(metadata.subject);
      }
      if (metadata.keywords !== undefined) {
        const keywordsArray = metadata.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
        pdfDoc.setKeywords(keywordsArray);
      }
      if (metadata.creator !== undefined) {
        pdfDoc.setCreator(metadata.creator);
      }

      // Always update modification date
      pdfDoc.setModificationDate(new Date());

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();

      // Create download link
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileNameWithoutExt = selectedFile.name.replace(/\.pdf$/i, "");
      link.download = `${fileNameWithoutExt}_metadata_edited.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbarMessage("PDF downloaded successfully with updated metadata");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      trackTool("pdf-metadata-editor", "download");
      trackFile("download", "pdf", true);
    } catch (err) {
      setError("Failed to update PDF metadata. Please try again.");
      console.error("Metadata update error:", err);
      trackTool("pdf-metadata-editor", "download_error");
      trackError("pdf_metadata_update_failed", false);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToMetadataEditor = () => {
    if (metadataEditorRef.current) {
      metadataEditorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleFileInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearFile();
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPdfDoc(null);
    setMetadata({});
    setOriginalMetadata({});
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    trackTool("pdf-metadata-editor", "clear_file");
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
            PDF Metadata Editor
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
            Edit PDF metadata properties including title, author, subject, and
            keywords. Update document information without changing the content.
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* File Upload Area */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `2px dashed ${
              isDragOver ? theme.palette.primary.main : theme.palette.divider
            }`,
            textAlign: "center",
            mb: 4,
            transition: "border-color 0.2s ease",
            cursor: "pointer",
            "&:hover": {
              borderColor: theme.palette.primary.main,
            },
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf"
            style={{ display: "none" }}
          />

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                backgroundColor: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Upload size={36} color="white" />
            </Box>

            <Typography variant="h5" fontWeight={600} gutterBottom>
              {selectedFile ? selectedFile.name : "Upload PDF File"}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {selectedFile
                ? "File loaded successfully. You can upload a different file or edit the metadata below."
                : "Drag and drop your PDF file here, or click to browse"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                startIcon={<Upload size={20} />}
                onClick={handleFileInputClick}
              >
                Choose File
              </Button>
              {selectedFile && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RefreshCcw size={20} />}
                  onClick={handleClearFile}
                >
                  Clear File
                </Button>
              )}
            </Box>

            <Typography variant="body2" color="text.secondary">
              Maximum file size: 100MB
            </Typography>
          </Box>
        </Paper>

        {/* Loading */}
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
            <Typography variant="body1" sx={{ ml: 2 }}>
              Processing PDF...
            </Typography>
          </Box>
        )}

        {/* Metadata Editor */}
        {selectedFile && pdfDoc && !isLoading && (
          <Card ref={metadataEditorRef} sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Edit size={24} color={theme.palette.primary.main} />
                  <Typography variant="h5" fontWeight={600}>
                    Edit Metadata
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RefreshCcw size={20} />}
                    onClick={resetMetadata}
                  >
                    Reset
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Download size={20} />}
                    onClick={downloadUpdatedPdf}
                    disabled={isLoading}
                  >
                    Save & Download PDF
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={metadata.title || ""}
                    onChange={(e) =>
                      handleMetadataChange("title", e.target.value)
                    }
                    placeholder="Enter PDF title"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Author"
                    value={metadata.author || ""}
                    onChange={(e) =>
                      handleMetadataChange("author", e.target.value)
                    }
                    placeholder="Enter author name"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={metadata.subject || ""}
                    onChange={(e) =>
                      handleMetadataChange("subject", e.target.value)
                    }
                    placeholder="Enter document subject"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Keywords"
                    value={metadata.keywords || ""}
                    onChange={(e) =>
                      handleMetadataChange("keywords", e.target.value)
                    }
                    placeholder="Enter keywords separated by commas"
                    variant="outlined"
                    helperText="Separate multiple keywords with commas"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Creator"
                    value={metadata.creator || ""}
                    onChange={(e) =>
                      handleMetadataChange("creator", e.target.value)
                    }
                    placeholder="Enter creator application"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Producer"
                    value={metadata.producer || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="outlined"
                    helperText="Producer is read-only"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Date Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Creation Date
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(originalMetadata.creationDate || null)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Last Modified
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(originalMetadata.modificationDate || null)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Will be updated to current time when saved
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* AdSense Ad */}
        <AdSense adSlot="3561331200" />

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
            Why Use Our PDF Metadata Editor?
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
                  <Edit size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Easy Metadata Editing
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quickly edit PDF metadata including title, author, subject,
                  and keywords with an intuitive interface.
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
                  <FileText size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Preserve Content
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Only metadata is modified. Your PDF content, formatting, and
                  quality remain completely unchanged.
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
                  Better Organization
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Proper metadata helps organize documents, improves
                  searchability, and provides valuable document information.
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
            How to Edit PDF Metadata
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
                  Upload PDF
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your PDF file by clicking "Choose File" or dragging and
                  dropping it into the upload area.
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
                  View Metadata
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The tool extracts and displays current metadata. You can see
                  all existing information about your PDF.
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
                  Edit Fields
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Modify any metadata fields such as title, author, subject, and
                  keywords as needed for your document.
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
                  Download
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Download your PDF with the updated metadata. The content and
                  formatting remain unchanged.
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
                    Use our PDF metadata editor completely free without creating
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
                    Preserve Document Quality
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Only metadata is modified. Original PDF content, formatting,
                    and quality remain completely unchanged.
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
                What is PDF metadata?
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
                  PDF metadata includes document properties like title, author,
                  subject, keywords, creation date, and other information about
                  the document. This data helps organize and identify documents.
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
                Is my PDF data secure?
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
                  Yes, absolutely. All PDF processing happens entirely in your
                  browser using client-side JavaScript. Your files are never
                  uploaded to our servers.
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              What file size limits do you have?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You can upload PDF files up to 100MB in size. Most documents will
              be much smaller than this limit.
            </Typography>

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Does this change the PDF content?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              No, only the metadata is modified. The actual content, formatting,
              images, and text of your PDF remain completely unchanged.
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
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

export default PdfMetadataEditor;
