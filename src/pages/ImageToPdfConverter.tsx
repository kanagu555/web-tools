import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import {
  Upload,
  FileUp,
  Trash2,
  MoveUp,
  MoveDown,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const ImageToPdfConverter = () => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
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
      const files = Array.from(event.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    }
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return;

    setIsConverting(true);
    setDownloadLink(null);

    try {
      // Create a new jsPDF instance
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Process each image sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Convert the file to a data URL
        const dataUrl = await readFileAsDataURL(file);

        // Add a new page for each image after the first one
        if (i > 0) {
          doc.addPage();
        }

        // Add the image to the PDF
        doc.addImage(dataUrl, "JPEG", 10, 10, 190, 277);
      }

      // Generate the PDF blob
      const pdfBlob = doc.output("blob");

      // Create a download link
      const url = URL.createObjectURL(pdfBlob);
      setDownloadLink(url);
    } catch (error) {
      console.error("Error converting images to PDF:", error);
      alert("Failed to convert images to PDF. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  // Helper function to read a file as data URL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Image to PDF Converter - Online Conversion Tool | KodeKit</title>
        <meta
          name="description"
          content="Convert images to PDF files instantly with our free online tool. Support for JPG, PNG, and other image formats. Preserve quality and adjust layout settings."
        />
        <meta
          name="keywords"
          content="image to PDF, convert JPG to PDF, PNG to PDF converter, online PDF tool, document conversion,
          image to PDF converter, image to PDF online, image to PDF tool, free image to PDF converter,
          image to PDF conversion tool, image to PDF converter, free image to PDF, free jpg to pdf converter, Image to PDF converter online free, Convert JPG PNG to PDF online, Free image to PDF tool, Combine images into PDF file, Image to PDF converter without software, Convert multiple images to PDF, Online image to PDF creator, Batch image to PDF converter, Image to PDF tool with download option, Create PDF from photos online, Join image files into PDF document, Convert screenshots to PDF, Image to PDF converter with quality retention, Drag and drop image to PDF converter, Image to PDF converter for Windows Mac, Image to PDF converter with no watermark, Image to PDF converter with page size options, Image to PDF converter for documents, Image to PDF converter for students professionals, JPG to PDF converter online free, PNG to PDF converter tool, TIFF GIF to PDF converter online, Best online image to PDF converter, Secure image to PDF conversion online, Convert images to PDF on mobile desktop, Image to PDF converter app online"
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/image-to-pdf"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Image to PDF Converter - Online Conversion Tool"
        />
        <meta
          property="og:description"
          content="Convert images to PDF files instantly with our free online tool. Support for JPG, PNG, and other image formats. Preserve quality and adjust layout settings."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/image-to-pdf"
        />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Image to PDF Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert your images to PDF format quickly and easily. Supports JPG,
          PNG, and other common image formats.
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
            accept="image/*"
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
              Select Images
            </Button>
          </label>
          <Typography variant="body2" color="text.secondary">
            Drag and drop your images here, or click to select files
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
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1,
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body1">{file.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </Typography>
                    </Box>
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

            <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleConvert}
                disabled={selectedFiles.length === 0 || isConverting}
                startIcon={isConverting ? null : <FileUp size={16} />}
              >
                {isConverting ? "Converting..." : "Convert to PDF"}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => setSelectedFiles([])}
                disabled={selectedFiles.length === 0 || isConverting}
              >
                Clear All
              </Button>
              {downloadLink && (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  href={downloadLink}
                  download="converted-images.pdf"
                >
                  Download PDF
                </Button>
              )}
            </Box>
          </Box>
        )}
      </motion.div>
      <AdSense adSlot="6613251015" />
      <Box sx={{ mt: 8 }}>
        <Divider sx={{ mb: 4 }} />

        {/* What is Image to PDF Conversion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight={600}>
            What is Image to PDF Conversion?
          </Typography>
          <Typography variant="body1" paragraph>
            Image to PDF conversion is the process of transforming image files
            (such as JPG, PNG, GIF, or BMP) into PDF (Portable Document Format)
            documents. This conversion preserves the visual content of your
            images while providing the benefits of the PDF format, including
            consistent display across devices, smaller file sizes through
            compression, and enhanced document security options.
          </Typography>
          <Typography variant="body1" paragraph>
            Our free online Image to PDF converter tool allows you to combine
            multiple images into a single PDF document, arrange them in your
            preferred order, and download the result instantly without
            installing any software or creating an account.
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
            Common Use Cases for Image to PDF Conversion
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography variant="h6" fontWeight={500}>
                  Document Scanning and Digitization
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Convert scanned documents, receipts, invoices, and handwritten
                  notes into PDF format for digital archiving and easier
                  sharing. This helps create a paperless workflow while
                  preserving important information.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography variant="h6" fontWeight={500}>
                  Photo Albums and Portfolios
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Create digital photo albums, photography portfolios, or art
                  collections by converting and combining multiple image files
                  into a single, organized PDF document that can be easily
                  shared with clients or family members.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography variant="h6" fontWeight={500}>
                  Business Documentation
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Convert product images, diagrams, charts, and visual data into
                  PDF format for inclusion in business reports, presentations,
                  proposals, and marketing materials, ensuring consistent
                  appearance across all devices.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ChevronDown />}>
                <Typography variant="h6" fontWeight={500}>
                  Educational Materials
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1">
                  Teachers and students can convert educational images,
                  diagrams, worksheets, and visual learning materials into PDF
                  format for easier distribution, printing, and inclusion in
                  digital learning platforms.
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
            How Our Image to PDF Converter Works
          </Typography>
          <Typography variant="body1" paragraph>
            Our Image to PDF converter uses client-side processing, which means
            your files never leave your device. The conversion happens directly
            in your browser using JavaScript libraries like jsPDF. This ensures
            complete privacy and security for your images.
          </Typography>
          <Typography variant="body1" paragraph>
            The process involves reading your image files, rendering them onto
            PDF pages while maintaining their quality and aspect ratio, and then
            generating a downloadable PDF document. You can rearrange the order
            of images before conversion to customize the final PDF layout.
          </Typography>
          <Typography variant="body1" paragraph>
            The tool supports most common image formats including JPG/JPEG, PNG,
            GIF, BMP, and WEBP. There's no limit on the number of images you can
            convert, though very large numbers of high-resolution images may
            require more processing time.
          </Typography>
        </motion.div>

        {/* Tips for Best Results */}
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
            Tips for Best Results
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1" paragraph>
              <strong>Image Quality:</strong> For the best output quality, use
              high-resolution images. However, be aware that very large images
              may increase the final PDF file size.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Image Order:</strong> Arrange your images in the desired
              order before conversion using the up and down arrows next to each
              image in the file list.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>File Names:</strong> Consider renaming your image files in
              a sequential order before uploading if you want them to appear in
              a specific sequence initially.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Orientation:</strong> For best results, ensure all your
              images have the same orientation (portrait or landscape) before
              conversion.
            </Typography>
            <Typography component="li" variant="body1" paragraph>
              <strong>Browser Compatibility:</strong> This tool works best in
              modern browsers like Chrome, Firefox, Safari, and Edge. If you
              encounter issues, try updating your browser to the latest version.
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Container>
  );
};

export default ImageToPdfConverter;
