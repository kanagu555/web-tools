import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Upload,
  FileText,
  Trash2,
  MoveUp,
  MoveDown,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";

const PdfMerger = () => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).filter(
        (file) => file.type === "application/pdf"
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      setMergedPdfUrl(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setMergedPdfUrl(null);
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

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove("drag-over");

    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files).filter(
        (file) => file.type === "application/pdf"
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      setMergedPdfUrl(null);
    }
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleMerge = async () => {
    if (selectedFiles.length < 2) return;

    setIsLoading(true);
    setMergedPdfUrl(null);

    try {
      // Create a new PDF document
      const mergedPdf = await PDFDocument.create();

      // Process each PDF file
      for (const file of selectedFiles) {
        // Read the file as ArrayBuffer
        const fileBuffer = await readFileAsArrayBuffer(file);

        // Load the PDF document
        const pdfDoc = await PDFDocument.load(fileBuffer);

        // Copy all pages from the current PDF to the merged PDF
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      // Save the merged PDF as bytes
      const mergedPdfBytes = await mergedPdf.save();

      // Convert to Blob and create URL
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setMergedPdfUrl(url);
    } catch (error) {
      console.error("Error merging PDFs:", error);
      alert("Failed to merge PDF files. Please try again.");
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
          PDF Merger
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Combine multiple PDF files into a single document. Arrange them in any
          order you want.
        </Typography>

        <Paper
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 3,
            border: `2px dashed ${theme.palette.primary.main}40`,
            backgroundColor: `${theme.palette.primary.main}08`,
            textAlign: "center",
            transition: "all 0.2s ease",
            "&.drag-over": {
              backgroundColor: `${theme.palette.primary.main}15`,
              borderColor: theme.palette.primary.main,
            },
          }}
        >
          <input
            type="file"
            id="file-upload"
            multiple
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
            >
              Select PDF Files
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary">
            Drag and drop your PDF files here, or click to select files
          </Typography>
        </Paper>

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Selected Files ({selectedFiles.length})
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              {selectedFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom:
                      index < selectedFiles.length - 1
                        ? `1px solid ${theme.palette.divider}`
                        : "none",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FileText size={20} />
                    <Typography>{file.name}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveFile(index, "up")}
                      disabled={index === 0}
                    >
                      <MoveUp size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveFile(index, "down")}
                      disabled={index === selectedFiles.length - 1}
                    >
                      <MoveDown size={16} />
                    </IconButton>
                    <Button
                      startIcon={<Trash2 size={16} />}
                      color="error"
                      onClick={() => handleRemoveFile(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              ))}
            </Paper>

            <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleMerge}
                disabled={selectedFiles.length < 2 || isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isLoading ? "Merging..." : "Merge PDFs"}
              </Button>

              {mergedPdfUrl && (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<Download size={20} />}
                  href={mergedPdfUrl}
                  download="merged-document.pdf"
                >
                  Download PDF
                </Button>
              )}
            </Box>
          </Box>
        )}
      </motion.div>
    </Container>
  );
};

export default PdfMerger;
