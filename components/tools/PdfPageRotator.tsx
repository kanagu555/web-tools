"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  IconButton,
  Alert,
  Grid,
  Card,
  CardContent,
  Tooltip,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Upload,
  Download,
  RotateCcw,
  RotateCw,
  RefreshCcw,
  FilePlus,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument, degrees } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

// Configure PDF.js worker
if (typeof window !== "undefined") {
  // Use a more reliable worker configuration

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    process.env.NEXT_PUBLIC_PDFJS_WORKER_SRC || "";
}

interface PageInfo {
  pageNumber: number;
  rotation: number;
  thumbnail?: string;
}

const PdfPageRotator = () => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
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

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const generatePageThumbnail = async (
    pdfDoc: any,
    pageNumber: number
  ): Promise<string> => {
    try {
      console.log(`Generating thumbnail for page ${pageNumber}`);

      const page = await pdfDoc.getPage(pageNumber);
      const scale = 0.5; // Increase scale for better visibility
      const viewport = page.getViewport({ scale });

      console.log(
        `Page ${pageNumber} viewport:`,
        viewport.width,
        "x",
        viewport.height
      );

      // Create canvas
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        console.error("Could not get canvas context");
        return "";
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render page to canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      console.log(`Rendering page ${pageNumber}...`);
      await page.render(renderContext).promise;
      console.log(`Page ${pageNumber} rendered successfully`);

      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png");
      console.log(
        `Page ${pageNumber} thumbnail generated:`,
        dataUrl.substring(0, 50) + "..."
      );

      return dataUrl;
    } catch (error) {
      console.error(
        `Error generating thumbnail for page ${pageNumber}:`,
        error
      );
      return "";
    }
  };

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        if (!validatePdfFile(file)) return;

        setSelectedFile(file);
        setError("");
        setIsLoading(true);

        try {
          const fileBuffer = await readFileAsArrayBuffer(file);

          // Load with PDF-lib for manipulation
          const pdf = await PDFDocument.load(fileBuffer);
          setPdfDoc(pdf);

          const pageCount = pdf.getPageCount();
          const pageInfos: PageInfo[] = [];

          // Try to load with PDF.js for rendering (optional)
          try {
            console.log("Loading PDF with PDF.js...");
            const pdfJsDocument = await pdfjsLib.getDocument({
              data: fileBuffer,
            }).promise;
            console.log(
              "PDF.js document loaded successfully, pages:",
              pdfJsDocument.numPages
            );

            // Generate thumbnails for each page
            for (let i = 0; i < pageCount; i++) {
              console.log(`Processing page ${i + 1} of ${pageCount}`);
              const thumbnail = await generatePageThumbnail(
                pdfJsDocument,
                i + 1
              );
              pageInfos.push({
                pageNumber: i + 1,
                rotation: 0,
                thumbnail,
              });
            }
            console.log("All thumbnails generated successfully");
          } catch (pdfJsError) {
            console.warn(
              "PDF.js failed, falling back to generic icons:",
              pdfJsError
            );
            // Fallback: create pages without thumbnails
            for (let i = 0; i < pageCount; i++) {
              pageInfos.push({
                pageNumber: i + 1,
                rotation: 0,
                thumbnail: "", // Empty thumbnail will show generic icon
              });
            }
          }

          setPages(pageInfos);
          setSnackbarMessage(`PDF loaded successfully with ${pageCount} pages`);
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
        } catch (err) {
          setError(
            "Failed to load PDF. Please ensure the file is not corrupted."
          );
          console.error("PDF loading error:", err);
        } finally {
          setIsLoading(false);
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

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (!validatePdfFile(file)) return;

      setSelectedFile(file);
      setError("");
      setIsLoading(true);

      try {
        const fileBuffer = await readFileAsArrayBuffer(file);

        // Load with PDF-lib for manipulation
        const pdf = await PDFDocument.load(fileBuffer);
        setPdfDoc(pdf);

        const pageCount = pdf.getPageCount();
        const pageInfos: PageInfo[] = [];

        // Try to load with PDF.js for rendering (optional)
        try {
          console.log("Loading PDF with PDF.js (drag & drop)...");
          const pdfJsDocument = await pdfjsLib.getDocument({ data: fileBuffer })
            .promise;
          console.log(
            "PDF.js document loaded successfully, pages:",
            pdfJsDocument.numPages
          );

          // Generate thumbnails for each page
          for (let i = 0; i < pageCount; i++) {
            console.log(`Processing page ${i + 1} of ${pageCount}`);
            const thumbnail = await generatePageThumbnail(pdfJsDocument, i + 1);
            pageInfos.push({
              pageNumber: i + 1,
              rotation: 0,
              thumbnail,
            });
          }
          console.log("All thumbnails generated successfully");
        } catch (pdfJsError) {
          console.warn(
            "PDF.js failed, falling back to generic icons:",
            pdfJsError
          );
          // Fallback: create pages without thumbnails
          for (let i = 0; i < pageCount; i++) {
            pageInfos.push({
              pageNumber: i + 1,
              rotation: 0,
              thumbnail: "", // Empty thumbnail will show generic icon
            });
          }
        }

        setPages(pageInfos);
        setSnackbarMessage(`PDF loaded successfully with ${pageCount} pages`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (err) {
        setError(
          "Failed to load PDF. Please ensure the file is not corrupted."
        );
        console.error("PDF loading error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const rotatePage = (pageIndex: number, rotationDegrees: number) => {
    setPages((prev) =>
      prev.map((page, index) =>
        index === pageIndex
          ? { ...page, rotation: (page.rotation + rotationDegrees) % 360 }
          : page
      )
    );
  };

  const resetRotations = () => {
    setPages((prev) => prev.map((page) => ({ ...page, rotation: 0 })));
    setSnackbarMessage("All rotations reset");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const downloadRotatedPdf = async () => {
    if (!pdfDoc || !selectedFile) return;

    setIsLoading(true);
    setError("");

    try {
      // Create a new PDF document
      const newPdf = await PDFDocument.create();

      // Copy pages with rotations
      const pageIndices = Array.from(
        { length: pdfDoc.getPageCount() },
        (_, i) => i
      );
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);

      copiedPages.forEach((page, index) => {
        const rotation = pages[index]?.rotation || 0;
        if (rotation !== 0) {
          page.setRotation(degrees(rotation));
        }
        newPdf.addPage(page);
      });

      // Generate PDF bytes
      const pdfBytes = await newPdf.save();

      // Create download link
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rotated_${selectedFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const rotatedPages = pages.filter((p) => p.rotation !== 0).length;
      setSnackbarMessage(
        `Successfully rotated ${rotatedPages} pages and downloaded PDF`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setError("Failed to process PDF. Please try again.");
      setSnackbarMessage("Rotation failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("PDF processing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = () => {
    setSelectedFile(null);
    setPages([]);
    setPdfDoc(null);

    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSnackbarMessage("File cleared");
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Rotate PDF Pages Online
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Rotate individual PDF pages 90°, 180°, or 270° clockwise. Arrange them
          in any orientation you want with our free, secure online PDF rotator.
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
              {isDragOver
                ? "Drop your PDF file here"
                : "Upload PDF File to Rotate"}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Drag and drop your PDF file here, or click to select file
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 3, display: "block" }}
            >
              Supports PDF files up to 100MB each • Minimum 1 file required
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              aria-label="Select PDF file to rotate"
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
              aria-label="Select PDF file button"
            >
              Select PDF File
            </Button>
          </Paper>
        </section>

        {/* File Info and Actions */}
        {selectedFile && (
          <section aria-labelledby="file-info-section-title">
            <Paper
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              role="region"
              aria-labelledby="file-info-section-title"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <FileText size={32} color={theme.palette.error.main} />
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pages.length} pages • {formatFileSize(selectedFile.size)}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={resetRotations}
                    disabled={isLoading}
                    startIcon={<RefreshCcw />}
                  >
                    Reset all rotations
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClearAll}
                    disabled={isLoading}
                    startIcon={<RefreshCcw />}
                  >
                    Clear File
                  </Button>

                  <Button
                    variant="contained"
                    startIcon={
                      isLoading ? <CircularProgress size={20} /> : <Download />
                    }
                    onClick={downloadRotatedPdf}
                    disabled={isLoading || pages.every((p) => p.rotation === 0)}
                  >
                    {isLoading ? "Processing..." : "Download Rotated PDF"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </section>
        )}

        {/* Pages Grid */}
        {pages.length > 0 && (
          <section aria-labelledby="pages-section-title">
            <Paper
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              role="region"
              aria-labelledby="pages-section-title"
            >
              <Typography variant="h6" sx={{ mb: 3 }} id="pages-section-title">
                PDF Pages ({pages.length})
              </Typography>

              {isLoading && pages.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <CircularProgress />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Loading PDF pages...
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {pages.map((page, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Card
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: theme.shadows[4],
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", p: 3 }}>
                          {/* Page Preview */}
                          <Box
                            sx={{
                              width: "100%",
                              height: 140,
                              backgroundColor: theme.palette.grey[100],
                              border: `1px solid ${theme.palette.divider}`,
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 2,
                              transform: `rotate(${page.rotation}deg)`,
                              transition: "transform 0.3s ease",
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            {page.thumbnail ? (
                              <img
                                src={page.thumbnail}
                                alt={`Page ${page.pageNumber} preview`}
                                style={{
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <FileText
                                size={48}
                                color={theme.palette.error.main}
                              />
                            )}
                            {page.rotation !== 0 && (
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  backgroundColor: theme.palette.primary.main,
                                  color: "white",
                                  borderRadius: "50%",
                                  width: 24,
                                  height: 24,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                }}
                              >
                                {page.rotation}°
                              </Box>
                            )}
                          </Box>

                          {/* Page Info */}
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            sx={{ mb: 1 }}
                          >
                            Page {page.pageNumber}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", mb: 2 }}
                          >
                            Current rotation: {page.rotation}°
                          </Typography>

                          {/* Rotation Controls */}
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <Tooltip title="Rotate 90° left">
                              <IconButton
                                size="small"
                                onClick={() => rotatePage(index, -90)}
                                disabled={isLoading}
                                color="primary"
                              >
                                <RotateCcw size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Rotate 90° right">
                              <IconButton
                                size="small"
                                onClick={() => rotatePage(index, 90)}
                                disabled={isLoading}
                                color="primary"
                              >
                                <RotateCw size={16} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </section>
        )}
      </motion.div>

      {/* AdSense Ad */}
      <AdSense adSlot="3561331200" />

      {/* Informational Content */}
      <Box sx={{ mt: 4 }}>
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
            Why Use Our PDF Page Rotator?
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
                  <RotateCw size={24} color="white" />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Individual Page Control
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rotate each page independently with 90° precision. Perfect for
                  fixing scanned documents with mixed orientations.
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
                  Live Preview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  See exactly how your pages will look with real-time preview.
                  No guesswork - what you see is what you get.
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
                  Instant Download
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Process and download your rotated PDF instantly. All
                  processing happens in your browser - no server uploads.
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
            How to Rotate PDF Pages
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
                  Drag and drop your PDF file or click to select. Files up to
                  100MB supported.
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
                  Preview Pages
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View all pages with live thumbnails. See exactly which pages
                  need rotation.
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
                  Rotate Pages
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Click rotation buttons to rotate individual pages left or
                  right by 90°.
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
                  Download your rotated PDF with all changes applied
                  permanently.
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
                    Use our PDF page rotator completely free without creating an
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
                    compression or quality loss during rotation.
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
              Can I rotate multiple pages at once?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Currently, you can rotate pages individually for precise control.
              Use the "Reset All" button to quickly remove all rotations if
              needed.
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
              Can I undo rotations?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Yes, you can rotate pages back to their original position or use
              the "Reset All" button to remove all rotations at once.
            </Typography>
          </Box>
        </Paper>
      </Box>

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

export default PdfPageRotator;
