import React, { useState, useEffect } from "react";
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
  CircularProgress,
  Alert,
} from "@mui/material";
import { Upload, FileText, Trash2, Scissors, Download } from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";

const PdfSplitter = () => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [splitMethod, setSplitMethod] = useState<"range" | "pages">("range");
  const [pageRange, setPageRange] = useState<[number, number]>([1, 1]);
  const [customPages, setCustomPages] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [splitPdfUrl, setSplitPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setSplitPdfUrl(null);
        setError(null);

        try {
          // Read the PDF and get the total pages
          const arrayBuffer = await readFileAsArrayBuffer(file);
          const pdf = await PDFDocument.load(arrayBuffer);
          const pageCount = pdf.getPageCount();

          setTotalPages(pageCount);
          setPageRange([1, pageCount]);
        } catch (err) {
          console.error("Error reading PDF:", err);
          setError(
            "Failed to read PDF file. The file might be corrupted or password-protected."
          );
          setSelectedFile(null);
        }
      } else {
        setError("Please select a valid PDF file.");
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPageRange([1, 1]);
    setCustomPages("");
    setTotalPages(0);
    setSplitPdfUrl(null);
    setError(null);
  };

  const handleRangeChange = (event: Event, newValue: number | number[]) => {
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

  // Parse custom pages input (e.g., "1,3,5-7")
  const parseCustomPages = (input: string): number[] => {
    if (!input.trim()) return [];

    const pages: number[] = [];
    const parts = input.split(",");

    for (const part of parts) {
      if (part.includes("-")) {
        // Handle ranges like "5-7"
        const [start, end] = part.split("-").map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (i > 0 && i <= totalPages && !pages.includes(i)) {
              pages.push(i);
            }
          }
        }
      } else {
        // Handle single pages
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
    setError(null);

    try {
      // Read the PDF file
      const fileBuffer = await readFileAsArrayBuffer(selectedFile);
      const pdfDoc = await PDFDocument.load(fileBuffer);

      // Determine which pages to extract
      let pagesToExtract: number[] = [];

      if (splitMethod === "range") {
        // Convert from 1-based to 0-based indexing
        for (let i = pageRange[0]; i <= pageRange[1]; i++) {
          pagesToExtract.push(i - 1);
        }
      } else {
        // Parse custom pages and convert to 0-based indexing
        pagesToExtract = parseCustomPages(customPages).map((p) => p - 1);
      }

      if (pagesToExtract.length === 0) {
        throw new Error("No valid pages selected for extraction");
      }

      // Create a new PDF with the selected pages
      const newPdf = await PDFDocument.create();

      // Copy the selected pages to the new PDF
      const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
      copiedPages.forEach((page) => newPdf.addPage(page));

      // Save the new PDF
      const newPdfBytes = await newPdf.save();

      // Create a download URL
      const blob = new Blob([newPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setSplitPdfUrl(url);
    } catch (err) {
      console.error("Error splitting PDF:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to split PDF. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          PDF Splitter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Split your PDF files into multiple documents. Choose specific pages or
          page ranges.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            border: `2px dashed ${theme.palette.primary.main}40`,
            backgroundColor: `${theme.palette.primary.main}08`,
            textAlign: "center",
          }}
        >
          <input
            type="file"
            id="file-upload"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            style={{ display: "none" }}
          />
          <label htmlFor="file-upload">
            <Button
              variant="contained"
              component="span"
              startIcon={<Upload />}
              sx={{ mb: 2 }}
              disabled={isLoading}
            >
              Select PDF File
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary">
            Select a PDF file to split. Maximum file size: 50MB
          </Typography>
        </Paper>

        {selectedFile && (
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <FileText size={24} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {selectedFile.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {totalPages} pages
                    </Typography>
                  </Box>
                </Box>
                <Button
                  startIcon={<Trash2 size={16} />}
                  color="error"
                  onClick={handleRemoveFile}
                  disabled={isLoading}
                >
                  Remove
                </Button>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Split Method
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant={splitMethod === "range" ? "contained" : "outlined"}
                    onClick={() => {
                      setSplitMethod("range");
                      setSplitPdfUrl(null);
                    }}
                    disabled={isLoading}
                  >
                    Page Range
                  </Button>
                  <Button
                    variant={splitMethod === "pages" ? "contained" : "outlined"}
                    onClick={() => {
                      setSplitMethod("pages");
                      setSplitPdfUrl(null);
                    }}
                    disabled={isLoading}
                  >
                    Custom Pages
                  </Button>
                </Stack>
              </Box>

              {splitMethod === "range" ? (
                <Box sx={{ px: 2 }}>
                  <Typography gutterBottom>
                    Select page range: {pageRange[0]} - {pageRange[1]}
                  </Typography>
                  <Slider
                    value={pageRange}
                    onChange={handleRangeChange}
                    valueLabelDisplay="auto"
                    min={1}
                    max={totalPages}
                    sx={{ mt: 2 }}
                    disabled={isLoading}
                  />
                </Box>
              ) : (
                <Box>
                  <Typography gutterBottom>
                    Enter page numbers (e.g., 1,3,5-7)
                  </Typography>
                  <TextField
                    fullWidth
                    value={customPages}
                    onChange={handleCustomPagesChange}
                    placeholder="1,3,5-7"
                    helperText={`Separate pages with commas, use hyphen for ranges. Max page: ${totalPages}`}
                    sx={{ mt: 1 }}
                    disabled={isLoading}
                  />
                </Box>
              )}

              <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <Scissors />
                    )
                  }
                  onClick={handleSplit}
                  disabled={
                    isLoading ||
                    (splitMethod === "pages" && !customPages.trim())
                  }
                >
                  {isLoading ? "Splitting..." : "Split PDF"}
                </Button>

                {splitPdfUrl && (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<Download size={20} />}
                    href={splitPdfUrl}
                    download="split-document.pdf"
                  >
                    Download PDF
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default PdfSplitter;
