"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  useTheme,
  IconButton,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Upload,
  Trash2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Settings,
  Info,
  Download,
  RefreshCcw,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import AdSense from "../AdSense";
import SocialShare from "../SocialShare";
import Navigation from "@/components/Navigation";

const ImageToPdfConverter = () => {
  const theme = useTheme();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [pageSize, setPageSize] = useState<"A4" | "Letter" | "Legal">("A4");
  const [imageQuality, setImageQuality] = useState<"high" | "medium" | "low">(
    "high"
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  const validateImageFile = (file: File): boolean => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB per file

    if (!validTypes.includes(file.type.toLowerCase())) {
      setError(
        `${file.name} is not a supported image format. Please use JPG, PNG, GIF, BMP, or WebP.`
      );
      return false;
    }

    if (file.size > maxSize) {
      setError(`${file.name} is too large. Maximum file size is 50MB.`);
      return false;
    }

    return true;
  };

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(validateImageFile);

        if (validFiles.length > 0) {
          setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
          setError("");
          setSnackbarMessage(
            `${validFiles.length} image(s) added successfully`
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
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    if (event.dataTransfer.files) {
      const files = Array.from(event.dataTransfer.files);
      const validFiles = files.filter(validateImageFile);

      if (validFiles.length > 0) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setError("");
        setSnackbarMessage(`${validFiles.length} image(s) added successfully`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      }
    }
  }, []);

  const getPageDimensions = (size: string) => {
    switch (size) {
      case "A4":
        return { width: 210, height: 297 };
      case "Letter":
        return { width: 216, height: 279 };
      case "Legal":
        return { width: 216, height: 356 };
      default:
        return { width: 210, height: 297 };
    }
  };

  const handleConvert = async () => {
    if (selectedFiles.length === 0) return;

    setIsConverting(true);
    setDownloadLink(null);
    setConversionProgress(0);
    setError("");

    try {
      // Dynamic import for client-side only
      const { jsPDF } = await import("jspdf");
      const pageDimensions = getPageDimensions(pageSize);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pageDimensions.width, pageDimensions.height],
      });

      // Process each image sequentially
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setConversionProgress(((i + 1) / selectedFiles.length) * 90);

        try {
          const dataUrl = await readFileAsDataURL(file);
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = dataUrl;
          });

          if (i > 0) {
            doc.addPage();
          }

          // Calculate image dimensions to fit the page while maintaining aspect ratio
          const pageWidth = pageDimensions.width - 20;
          const pageHeight = pageDimensions.height - 20;
          const imgAspectRatio = img.width / img.height;
          const pageAspectRatio = pageWidth / pageHeight;

          let imgWidth, imgHeight;

          if (imgAspectRatio > pageAspectRatio) {
            imgWidth = pageWidth;
            imgHeight = pageWidth / imgAspectRatio;
          } else {
            imgHeight = pageHeight;
            imgWidth = pageHeight * imgAspectRatio;
          }

          const x = (pageDimensions.width - imgWidth) / 2;
          const y = (pageDimensions.height - imgHeight) / 2;

          doc.addImage(
            dataUrl,
            file.type.includes("png") ? "PNG" : "JPEG",
            x,
            y,
            imgWidth,
            imgHeight
          );
        } catch (imageError) {
          console.error(`Error processing image ${file.name}:`, imageError);
          setError(`Failed to process image: ${file.name}`);
        }
      }

      setConversionProgress(95);
      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setDownloadLink(url);
      setConversionProgress(100);

      setSnackbarMessage(
        `Successfully converted ${selectedFiles.length} images to PDF`
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error converting images to PDF:", error);
      setError("Failed to convert images to PDF. Please try again.");
      setSnackbarMessage("Conversion failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsConverting(false);
      setTimeout(() => setConversionProgress(0), 2000);
    }
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleClearAll = () => {
    setSelectedFiles([]);
    setDownloadLink(null);
    setIsConverting(false);
    setConversionProgress(0);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSnackbarMessage("All files cleared");
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

  const getTotalFileSize = (): string => {
    const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    return formatFileSize(totalBytes);
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
          Image to PDF Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert your images to PDF format quickly and easily. Supports JPG,
          PNG, and other common image formats.
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

        <section aria-labelledby="upload-section-title">
          <Paper
            role="button"
            tabIndex={0}
            aria-label="Upload image area - drag and drop or click to select files"
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
              <ImageIcon
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
                ? "Drop your images here"
                : "Upload Images to Convert"}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Drag and drop your images here, or click to select files
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 3, display: "block" }}
            >
              Supports JPG, PNG, GIF, BMP, WebP formats (max 50MB per file)
            </Typography>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              aria-label="Select image files for conversion"
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
              aria-label="Select image files button"
            >
              Select Images
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
                  Conversion Settings
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="page-size-label">Page Size</InputLabel>
                    <Select
                      labelId="page-size-label"
                      value={pageSize}
                      onChange={(e) =>
                        setPageSize(e.target.value as "A4" | "Letter" | "Legal")
                      }
                      label="Page Size"
                      aria-describedby="page-size-help"
                    >
                      <MenuItem value="A4">A4 (210 × 297 mm)</MenuItem>
                      <MenuItem value="Letter">Letter (8.5 × 11 in)</MenuItem>
                      <MenuItem value="Legal">Legal (8.5 × 14 in)</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    id="page-size-help"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    Choose the page size for your PDF document
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="image-quality-label">
                      Image Quality
                    </InputLabel>
                    <Select
                      labelId="image-quality-label"
                      value={imageQuality}
                      onChange={(e) =>
                        setImageQuality(
                          e.target.value as "high" | "medium" | "low"
                        )
                      }
                      label="Image Quality"
                      aria-describedby="image-quality-help"
                    >
                      <MenuItem value="high">
                        High (Best quality, larger file)
                      </MenuItem>
                      <MenuItem value="medium">Medium (Balanced)</MenuItem>
                      <MenuItem value="low">
                        Low (Smaller file, lower quality)
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    id="image-quality-help"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    Higher quality results in larger PDF file size
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </section>
        )}

        {/* Selected Files Section */}
        {selectedFiles.length > 0 && (
          <section aria-labelledby="selected-files-title">
            <Box sx={{ mt: 4 }} role="region">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6" id="selected-files-title">
                  Selected Files ({selectedFiles.length})
                </Typography>
                <Chip
                  icon={<Info size={14} />}
                  label={`Total size: ${getTotalFileSize()}`}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Box role="list" aria-label="List of selected image files">
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
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: 2,
                                overflow: "hidden",
                                flexShrink: 0,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                              role="img"
                              aria-label={`Preview of ${file.name}`}
                            >
                              <img
                                src={URL.createObjectURL(file)}
                                alt={`Preview of ${file.name}`}
                                loading="lazy"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </Box>
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
                                  label={formatFileSize(file.size)}
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  label={file.type.split("/")[1].toUpperCase()}
                                  size="small"
                                  color="primary"
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
                                disabled={index === 0}
                                aria-label={`Move ${file.name} up in the list`}
                              >
                                <MoveUp size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Move down">
                              <IconButton
                                size="small"
                                onClick={() => handleMoveFile(index, "down")}
                                disabled={index === selectedFiles.length - 1}
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
              {isConverting && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Converting images to PDF... {Math.round(conversionProgress)}
                    %
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={conversionProgress}
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
                  onClick={handleConvert}
                  disabled={selectedFiles.length === 0 || isConverting}
                  startIcon={
                    isConverting ? (
                      <RefreshCcw className="animate-spin" />
                    ) : (
                      <ImageIcon />
                    )
                  }
                  sx={{ minWidth: 200 }}
                >
                  {isConverting ? "Converting..." : "Convert to PDF"}
                </Button>

                {downloadLink && (
                  <Button
                    variant="outlined"
                    size="large"
                    component="a"
                    href={downloadLink}
                    download={`converted_images_${
                      new Date().toISOString().split("T")[0]
                    }.pdf`}
                    startIcon={<Download />}
                    sx={{ minWidth: 200 }}
                  >
                    Download PDF
                  </Button>
                )}

                <Button
                  variant="text"
                  size="large"
                  onClick={handleClearAll}
                  disabled={isConverting}
                  color="error"
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          </section>
        )}
      </motion.div>

      {/* AdSense Ad */}
      <AdSense adSlot="3561331200" />

      <Box sx={{ mt: 8 }}>
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

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Common questions about our Image to PDF converter and how to use
              it effectively.
            </Typography>

            <Box sx={{ mt: 4 }}>
              {[
                {
                  question: "What image formats can I convert to PDF?",
                  answer:
                    "Our converter supports all major image formats including JPG/JPEG, PNG, GIF, BMP, and WebP. You can upload multiple images in different formats and convert them all into a single PDF document.",
                },
                {
                  question:
                    "Is there a limit on file size or number of images?",
                  answer:
                    "Each image file can be up to 50MB in size. There's no strict limit on the number of images you can convert, but processing very large numbers of high-resolution images may take longer and use more browser memory.",
                },
                {
                  question: "Can I choose the page size for my PDF?",
                  answer:
                    "Yes! You can select from three standard page sizes: A4 (210×297mm), Letter (8.5×11 inches), and Legal (8.5×14 inches). The images will be automatically scaled to fit the selected page size while maintaining their aspect ratio.",
                },
                {
                  question: "How does the image quality setting affect my PDF?",
                  answer:
                    "The quality setting controls image compression in the PDF. 'High' preserves maximum quality but creates larger files, 'Medium' provides balanced quality and file size, while 'Low' creates smaller files with reduced image quality.",
                },
                {
                  question: "Are my images uploaded to your servers?",
                  answer:
                    "No, all processing happens locally in your browser. Your images never leave your device, ensuring complete privacy and security. The conversion is performed using client-side JavaScript libraries.",
                },
                {
                  question: "Can I rearrange the order of images in the PDF?",
                  answer:
                    "Absolutely! You can reorder images by using the up and down arrow buttons next to each image in the file list. The images will appear in the PDF in the same order as shown in the list.",
                },
              ].map((faq, index) => (
                <Accordion
                  key={index}
                  sx={{
                    mb: 1,
                    "&:before": { display: "none" },
                    boxShadow: "none",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: "8px !important",
                    "&.Mui-expanded": {
                      margin: "0 0 8px 0",
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ChevronDown />}
                    sx={{
                      borderRadius: "8px",
                      "&.Mui-expanded": {
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight={500}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Typography variant="body1" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Box>
        </motion.div>
      </Box>

      <Box sx={{ mt: 4 }}>
        <SocialShare
          title="Free Image to PDF Converter Online | Convert JPG PNG to PDF"
          url={
            typeof window !== "undefined"
              ? window.location.href
              : "https://www.kodekit.in/tools/image-to-pdf-converter"
          }
          description="Convert images to PDF files instantly with our free online tool. Support for multiple formats and batch conversion."
          hashtags={[
            "ImageToPDF",
            "PDFConverter",
            "OnlineTool",
            "DocumentConversion",
          ]}
        />
      </Box>

      {/* Snackbar for notifications */}

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

export default ImageToPdfConverter;
