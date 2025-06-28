import React, { useState, useEffect, useRef } from "react";
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
  Divider,
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
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import SocialShare from "../components/SocialShare";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const shareLink = window.location.href;
  const isProductionEnv = import.meta.env.PROD;

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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
    setError(null);
    try {
      const fileBuffer = await readFileAsArrayBuffer(selectedFile);
      const pdfDoc = await PDFDocument.load(fileBuffer);
      let pagesToExtract: number[] = [];
      if (splitMethod === "range") {
        for (let i = pageRange[0]; i <= pageRange[1]; i++) {
          pagesToExtract.push(i - 1);
        }
      } else {
        pagesToExtract = parseCustomPages(customPages).map((p) => p - 1);
      }
      if (pagesToExtract.length === 0) {
        throw new Error("No valid pages selected for extraction");
      }
      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
      copiedPages.forEach((page) => newPdf.addPage(page));
      const newPdfBytes = await newPdf.save();
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

  const handleClearAll = () => {
    setSelectedFile(null);
    setSplitPdfUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>PDF Splitter - Split PDF Pages Online</title>
        <meta
          name="description"
          content="Split PDF documents into individual pages or ranges with our free online tool. Extract specific pages quickly while maintaining original quality and security."
        />
        <meta
          name="keywords"
          content="PDF splitter, split PDF pages, online PDF tool, document splitting, extract PDF pages, PDF splitter online free, React PDF splitter tool, Split PDF files online, PDF cutter web app, React-based PDF splitter, Online PDF splitter with React, How to split PDF in browser, Client-side PDF splitter, Free online PDF page extractor, Split PDF without uploading, React PDF split and download, PDF splitter tool with React, Best online PDF splitter, Split PDF pages using React, PDF cutter React web app, No server PDF splitter, React frontend PDF splitter, Split PDF in React app, React PDF tool for splitting documents, PDF split web application using React, Secure PDF splitter online, Split PDF locally with React, TypeScript React PDF splitter, Open source React PDF splitter, React PDF splitter GitHub, React PDF splitter NPM package, pdf splitter, split pdf, online pdf splitter, free pdf splitter, split pdf online, react pdf tool, split pdf by pages, extract pdf pages, divide pdf file, web-based pdf splitter, secure pdf splitter, pdf splitter no watermark, how to split large pdf online, free online pdf split by page range, best tool to split pdf files, split pdf without adobe, open source pdf splitter react, split pdf into separate files free, react web app for splitting pdfs, split password-protected pdf online, react pdf library, pdf manipulation react, javascript split pdf tool, pdfsplitter github, customizable pdf splitter"
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/pdf-splitter "
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="PDF Splitter - Split PDF Pages Online"
        />
        <meta
          property="og:description"
          content="Split PDF documents into individual pages or ranges."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/pdf-splitter "
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org ",
              "@type": "SoftwareApplication",
              "name": "PDF Splitter Tool",
              "description": "Extract specific pages from PDF documents using our free online tool.",
              "url": "https://www.kodekit.in/tools/pdf-splitter ",
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
          PDF Splitter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Split your PDF files into multiple documents. Choose specific pages or
          page ranges.
        </Typography>

        {error && (
          <Alert severity="error" aria-live="polite">
            {error}
          </Alert>
        )}

        {/* Upload Section */}
        <section aria-labelledby="upload-section-title">
          <Paper
            role="region"
            aria-label="PDF upload area"
            sx={{
              mt: 4,
              p: 4,
              borderRadius: 3,
              border: `2px dashed ${theme.palette.primary.main}40`,
              backgroundColor: `${theme.palette.primary.main}08`,
              textAlign: "center",
              transition: "all 0.2s ease",
            }}
          >
            <Typography
              id="upload-section-title"
              variant="h5"
              gutterBottom
              fontWeight={600}
            >
              Upload PDF to Split
            </Typography>
            <input
              type="file"
              id="file-upload"
              accept=".pdf,application/pdf"
              onChange={handleFileSelect}
              aria-label="Select PDF file to split"
              style={{ display: "none" }}
              ref={fileInputRef}
            />
            <label htmlFor="file-upload" aria-hidden="true">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
                sx={{ mb: 2 }}
                aria-label="Upload PDF file button"
                disabled={isLoading}
              >
                Select PDF File
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary">
              Select a PDF file to split. Maximum file size: 50MB
            </Typography>
          </Paper>
        </section>

        {/* Selected File Info */}
        {selectedFile && (
          <Box
            sx={{ mt: 4 }}
            role="region"
            aria-labelledby="selected-file-title"
          >
            <Typography id="selected-file-title" variant="h6" gutterBottom>
              Selected File ({selectedFile.name})
            </Typography>
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
                  <FileText size={24} aria-hidden="true" />
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
                  aria-label={`Remove file: ${selectedFile.name}`}
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
                    aria-label="Select page range method"
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
                    aria-label="Select custom pages method"
                    disabled={isLoading}
                  >
                    Custom Pages
                  </Button>
                </Stack>
              </Box>

              {splitMethod === "range" ? (
                <Box sx={{ px: 2 }}>
                  <Typography gutterBottom id="slider-range-label">
                    Select page range: {pageRange[0]} - {pageRange[1]}
                  </Typography>
                  <Slider
                    value={pageRange}
                    onChange={handleRangeChange}
                    min={1}
                    max={totalPages}
                    valueLabelDisplay="auto"
                    aria-labelledby="slider-range-label"
                    sx={{ mt: 2 }}
                    disabled={isLoading}
                  />
                </Box>
              ) : (
                <Box>
                  <Typography gutterBottom id="custom-pages-label">
                    Enter page numbers (e.g., 1,3,5-7)
                  </Typography>
                  <TextField
                    fullWidth
                    value={customPages}
                    onChange={handleCustomPagesChange}
                    placeholder="1,3,5-7"
                    aria-labelledby="custom-pages-label"
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
                  aria-label="Split selected PDF file"
                  disabled={
                    isLoading ||
                    (splitMethod === "pages" && !customPages.trim())
                  }
                >
                  {isLoading ? "Splitting..." : "Split PDF"}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="error"
                  onClick={() => {
                    handleClearAll();
                  }}
                  aria-label="Clear all selected files"
                >
                  Clear All
                </Button>
                {splitPdfUrl && (
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    startIcon={<Download size={20} />}
                    href={splitPdfUrl}
                    download="split-document.pdf"
                    aria-label="Download split PDF file"
                  >
                    Download PDF
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
        )}
      </motion.div>

      {isProductionEnv && <AdSense adSlot="6613251015" />}

      {/* FAQ Section */}
      <Box sx={{ mt: 8 }}>
        <Divider sx={{ mb: 4 }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            Frequently Asked Questions
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Accordion
              sx={{ mb: 1 }}
              aria-label="What is the PDF Splitter tool?"
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-1-content"
                id="faq-1-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  What is the PDF Splitter tool?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Our PDF Splitter allows you to extract specific pages or
                  ranges from a PDF document. You can choose either a continuous
                  range or specify custom pages.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }} aria-label="Is it safe to use?">
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-2-content"
                id="faq-2-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Is this tool secure?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Yes! All processing happens directly in your browser. No files
                  are uploaded to any servers, ensuring your data stays private.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion
              sx={{ mb: 1 }}
              aria-label="Can I split password-protected PDFs?"
            >
              <AccordionSummary
                expandIcon={<ChevronDown />}
                aria-controls="faq-3-content"
                id="faq-3-header"
              >
                <Typography variant="h6" fontWeight={500}>
                  Can I split password-protected PDFs?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Unfortunately, this tool does not support splitting
                  password-protected PDFs. Please remove passwords before
                  uploading.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </motion.div>
      </Box>

      <SocialShare
        title="PDF Splitter - Online Tool"
        url={shareLink}
        description="Use our tool to split PDF files effortlessly."
        hashtags={["PDF", "Splitter", "OnlineTool"]}
      />
    </Container>
  );
};

export default PdfSplitter;
