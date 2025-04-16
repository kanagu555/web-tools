"use client"

import type React from "react"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  Grid,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile"
import DeleteIcon from "@mui/icons-material/Delete"
import GetAppIcon from "@mui/icons-material/GetApp"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import DescriptionIcon from "@mui/icons-material/Description"
import { usePdfConverterStyles } from "@/styles/styles"
import AdSense from "./AdSense"
import mammoth from "mammoth";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export function PdfConverter() {
  // const [file, setFile] = useState<File | null>(null)
  // const [converting, setConverting] = useState(false)
  // const [progress, setProgress] = useState(0)
  // const [converted, setConverted] = useState(false)
  // const [error, setError] = useState<string | null>(null)
  // const [htmlContent, setHtmlContent] = useState("");
  // const theme = useTheme()
  // const classes = usePdfConverterStyles()

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setFile(e.target.files[0])
  //     setConverted(false)
  //     setError(null)
  //   }
  // }

  // const handleConvert = async () => {
  //   if (!file) return

  //   setConverting(true)
  //   setProgress(0)
  //   setError(null)

  //   // Simulate conversion process
  //   const interval = setInterval(() => {
  //     setProgress((prev) => {
  //       if (prev >= 100) {
  //         clearInterval(interval)
  //         setConverting(false)
  //         setConverted(true)
  //         return 100
  //       }
  //       return prev + 10
  //     })
  //   }, 300)
  //   const input = document.getElementById("content-to-pdf");

  //   html2canvas(input).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF instance
  //     const imgWidth = 210; // A4 width in mm
  //     const pageHeight = 297; // A4 height in mm
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     let heightLeft = imgHeight;

  //     let position = 0;

  //     // Add the first page
  //     pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;

  //     // Add additional pages if content exceeds one page
  //     while (heightLeft >= 0) {
  //       position = heightLeft - imgHeight;
  //       pdf.addPage();
  //       pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  //       heightLeft -= pageHeight;
  //     }

  //     // Save the PDF
  //     pdf.save("converted-document.pdf");
  //     setPdfGenerated(true); // Mark PDF as generated
  //   });
  // }

  // const handleReset = () => {
  //   setFile(null)
  //   setConverting(false)
  //   setProgress(0)
  //   setConverted(false)
  //   setError(null)
  // }

  // const handleDownload = () => {
  //   // In a real app, this would download the converted file
  //   alert("In a real application, this would download your converted PDF file.")
  // }

  // return (
  //   <Paper className={classes.paper}>
  //     {error && (
  //       <Alert severity="error" sx={{ mb: 3 }}>
  //         {error}
  //       </Alert>
  //     )}

  //     <Box className={classes.dropZone}>
  //       {!file ? (
  //         <>
  //           <CloudUploadIcon className={classes.uploadIcon} />
  //           <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
  //             Drag and drop a file here, or click to select a file
  //           </Typography>
  //           <Button variant="outlined" component="label" startIcon={<InsertDriveFileIcon />}>
  //             Select File
  //             <input type="file" hidden accept=".doc,.docx,.txt,.rtf,.odt" onChange={handleFileChange} />
  //           </Button>
  //         </>
  //       ) : (
  //         <Box sx={{ width: "100%" }}>
  //           <Box className={classes.fileInfo}>
  //             <Box className={classes.fileDetails}>
  //               <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
  //               <Box>
  //                 <Typography variant="subtitle1">{file.name}</Typography>
  //                 <Typography variant="body2" color="text.secondary">
  //                   {(file.size / 1024).toFixed(2)} KB
  //                 </Typography>
  //               </Box>
  //             </Box>
  //             <IconButton onClick={handleReset} size="small">
  //               <DeleteIcon />
  //             </IconButton>
  //           </Box>

  //           {converting && (
  //             <Box className={classes.progressSection}>
  //               <Typography variant="body2" sx={{ mb: 1 }}>
  //                 Converting... {progress}%
  //               </Typography>
  //               <LinearProgress variant="determinate" value={progress} />
  //             </Box>
  //           )}

  //           <Box className={classes.actionButtons}>
  //             {!converted ? (
  //               <Button variant="contained" color="primary" fullWidth disabled={converting} onClick={handleConvert}>
  //                 Convert to PDF
  //               </Button>
  //             ) : (
  //               <Button
  //                 variant="contained"
  //                 color="primary"
  //                 fullWidth
  //                 startIcon={<GetAppIcon />}
  //                 onClick={handleDownload}
  //               >
  //                 Download PDF
  //               </Button>
  //             )}
  //           </Box>
  //         </Box>
  //       )}
  //     </Box>

  //     <AdSense adSlot="1234567890" adFormat="auto" />

  //     <Box className={classes.supportedTypes}>
  //       <Typography variant="h6" gutterBottom>
  //         Supported File Types
  //       </Typography>
  //       <List dense>
  //         <Grid container spacing={2}>
  //           <Grid item xs={12} sm={6}>
  //             <ListItem>
  //               <ListItemIcon>
  //                 <DescriptionIcon color="primary" />
  //               </ListItemIcon>
  //               <ListItemText primary="Microsoft Word (.doc, .docx)" />
  //             </ListItem>
  //             <ListItem>
  //               <ListItemIcon>
  //                 <DescriptionIcon color="primary" />
  //               </ListItemIcon>
  //               <ListItemText primary="Text files (.txt)" />
  //             </ListItem>
  //           </Grid>
  //           <Grid item xs={12} sm={6}>
  //             <ListItem>
  //               <ListItemIcon>
  //                 <DescriptionIcon color="primary" />
  //               </ListItemIcon>
  //               <ListItemText primary="Rich Text Format (.rtf)" />
  //             </ListItem>
  //             <ListItem>
  //               <ListItemIcon>
  //                 <DescriptionIcon color="primary" />
  //               </ListItemIcon>
  //               <ListItemText primary="OpenDocument Text (.odt)" />
  //             </ListItem>
  //           </Grid>
  //         </Grid>
  //       </List>
  //     </Box>
  //   </Paper>
  // )


  const [file, setFile] = useState(null); // Stores the uploaded file
  const [htmlContent, setHtmlContent] = useState(""); // Stores the converted HTML content
  const [pdfGenerated, setPdfGenerated] = useState(false); // Tracks if PDF is generated

  // Step 1: Handle file selection
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setHtmlContent(""); // Reset HTML content when a new file is selected
      setPdfGenerated(false); // Reset PDF generation status
    }
  };

  // Step 2: Convert Word document to HTML
  const convertFileToHtml = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setHtmlContent(result.value); // Store the extracted HTML content
    } catch (error) {
      console.error("Error converting file:", error);
      alert("Failed to convert the file. Please try again.");
    }
  };

  // Step 3: Generate and download PDF
  const generatePdf = () => {
    if (!htmlContent) {
      alert("Please convert the file to HTML first!");
      return;
    }

    const input = document.getElementById("content-to-pdf");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4"); // Create a new PDF instance
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content exceeds one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save("converted-document.pdf");
      setPdfGenerated(true); // Mark PDF as generated
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>PDF Converter</h1>

      {/* Step 1: Select File */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="file-upload" style={{ display: "block", marginBottom: "10px" }}>
          1. Select File to Upload:
        </label>
        <input
          type="file"
          id="file-upload"
          accept=".docx"
          onChange={handleFileUpload}
          style={{ marginBottom: "20px" }}
        />
      </div>

      {/* Step 2: Convert File to HTML */}
      <button
        onClick={convertFileToHtml}
        disabled={!file}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: file ? "#007bff" : "#ccc",
          color: "#fff",
          border: "none",
          cursor: file ? "pointer" : "not-allowed",
        }}
      >
        2. Convert File to PDF
      </button>

      {/* Preview Content */}
      {htmlContent && (
        <div id="content-to-pdf" style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
          <h2>Preview</h2>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      )}

      {/* Step 3: Download PDF */}
      <button
        onClick={generatePdf}
        disabled={!htmlContent}
        style={{
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: htmlContent ? "#28a745" : "#ccc",
          color: "#fff",
          border: "none",
          cursor: htmlContent ? "pointer" : "not-allowed",
        }}
      >
        3. Download PDF
      </button>
    </div>
  );
}

