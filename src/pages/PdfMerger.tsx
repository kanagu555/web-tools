import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import {
  Upload,
  FileText,
  Trash2,
  MoveUp,
  MoveDown,
  Download,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import SocialShare from "../components/SocialShare";

const PdfMerger = () => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const shareLink = window.location.href;
  const isProductionEnv = import.meta.env.PROD;

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
      const mergedPdf = await PDFDocument.create();

      for (const file of selectedFiles) {
        const fileBuffer = await readFileAsArrayBuffer(file);
        const pdfDoc = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
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

  const handleClearAll = () => {
    setSelectedFiles([]);
    setMergedPdfUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>PDF Merger - Combine PDF Files Online</title>
        <meta
          name="description"
          content="Merge multiple PDF documents into one file with our free online tool. Preserve quality and order while combining PDFs securely without watermarks."
        />
        <meta
          name="keywords"
          content="PDF merger, combine PDFs, merge PDF files, online PDF tool, document management"
        />
        <link rel="canonical" href="https://www.kodekit.in/tools/pdf-merger " />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="PDF Merger - Combine PDF Files Online"
        />
        <meta
          property="og:description"
          content="Merge multiple PDF documents into one file with our free online tool."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/pdf-merger "
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org ",
              "@type": "SoftwareApplication",
              "name": "PDF Merger Tool",
              "description": "Combine multiple PDF documents into a single file using our free online tool.",
              "url": "https://www.kodekit.in/tools/pdf-merger ",
              "category": "Utility Tool",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
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
          order you want.
        </Typography>

        {/* Upload Section */}
        <section aria-labelledby="upload-section-title">
          <Paper
            role="region"
            aria-label="PDF upload area"
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
            <Typography
              id="upload-section-title"
              variant="h5"
              gutterBottom
              fontWeight={600}
            >
              Upload PDF Files to Merge
            </Typography>
            <input
              type="file"
              id="file-upload"
              multiple
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              aria-label="Select PDF files to merge"
              style={{ display: "none" }}
            />
            <label htmlFor="file-upload" aria-hidden="true">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
                sx={{ mb: 2 }}
                aria-label="Upload PDF files button"
              >
                Select PDF Files
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary">
              Drag and drop your PDF files here, or click to select files
            </Typography>
          </Paper>
        </section>

        {/* Selected Files Section */}
        {selectedFiles.length > 0 && (
          <Box
            sx={{ mt: 4 }}
            role="region"
            aria-labelledby="selected-files-title"
          >
            <Typography id="selected-files-title" variant="h6" gutterBottom>
              Selected Files ({selectedFiles.length})
            </Typography>
            <Paper sx={{ p: 2, borderRadius: 2 }}>
              {selectedFiles.map((file, index) => (
                <Box
                  key={index}
                  role="listitem"
                  aria-label={`PDF file: ${file.name}`}
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
                    <FileText size={20} aria-hidden="true" />
                    <Typography
                      variant="body1"
                      aria-label={`File name: ${file.name}`}
                    >
                      {file.name}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveFile(index, "up")}
                      disabled={index === 0}
                      aria-label="Move file up"
                    >
                      <MoveUp size={16} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleMoveFile(index, "down")}
                      disabled={index === selectedFiles.length - 1}
                      aria-label="Move file down"
                    >
                      <MoveDown size={16} />
                    </IconButton>
                    <Button
                      startIcon={<Trash2 size={16} />}
                      color="error"
                      onClick={() => handleRemoveFile(index)}
                      aria-label={`Remove file: ${file.name}`}
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
                aria-label="Merge selected PDF files"
              >
                {isLoading ? "Merging..." : "Merge PDFs"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                color="error"
                onClick={handleClearAll}
                disabled={selectedFiles.length === 0 || isLoading}
                aria-label="Clear all selected files"
              >
                Clear All
              </Button>
              {mergedPdfUrl && (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<Download size={20} />}
                  href={mergedPdfUrl}
                  download="merged-document.pdf"
                  aria-label="Download merged PDF file"
                >
                  Download PDF
                </Button>
              )}
            </Box>
          </Box>
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
            What is a PDF Merger?
          </Typography>
          <Typography variant="body1" paragraph>
            A PDF merger combines multiple PDF documents into a single file.
            This helps streamline document management, reduce clutter, and
            improve sharing capabilities.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
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
                    Yes, our PDF merger is completely free to use. No
                    registration or payment is required. All merging happens
                    directly in your browser without uploading files to a
                    server.
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
                    password-protected PDFs. Please remove passwords or
                    encryption from your files before uploading them.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Box>
          </motion.div>
        </motion.div>
      </Box>

      <SocialShare
        url={shareLink}
        title="Merge PDF files easily!"
        description="Use our tool to merge your PDF files effortlessly."
        hashtags={["PDF", "Merge", "Tool"]}
      />
    </Container>
  );
};

export default PdfMerger;
