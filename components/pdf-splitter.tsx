"use client"

import { useState, useRef, useMemo } from "react"
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
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Tooltip,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import DeleteIcon from "@mui/icons-material/Delete"
import GetAppIcon from "@mui/icons-material/GetApp"
import ContentCutIcon from "@mui/icons-material/ContentCut"
import { PDFDocument } from "pdf-lib"
import { saveAs } from "file-saver"
import AdSense from "./AdSense"

interface PdfFile {
  file: File
  name: string
  size: string
  pages: number
}

export function PdfSplitter() {
  const [file, setFile] = useState<PdfFile | null>(null)
  const [pageRanges, setPageRanges] = useState<string>("")
  const [splitMethod, setSplitMethod] = useState<string>("range")
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [splitComplete, setSplitComplete] = useState(false)
  const [splitFiles, setSplitFiles] = useState<Blob[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setError(null)
      setSplitComplete(false)
      setSplitFiles([])

      const file = e.target.files[0]
      if (file.type !== "application/pdf") {
        setError("Only PDF files are supported")
        return
      }

      try {
        const arrayBuffer = await file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        const pageCount = pdfDoc.getPageCount()

        setFile({
          file,
          name: file.name,
          size: (file.size / 1024).toFixed(2) + " KB",
          pages: pageCount,
        })
      } catch (err) {
        console.error("Error reading PDF:", err)
        setError("Failed to read PDF file. The file might be corrupted or password protected.")
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSplitMethodChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setSplitMethod(e.target.value as string)
  }

  const validatePageRanges = (ranges: string, totalPages: number): boolean => {
    if (!ranges.trim()) return false

    const rangePattern = /^(\d+)(-\d+)?$/
    const parts = ranges.split(",").map(part => part.trim())

    for (const part of parts) {
      if (!rangePattern.test(part)) return false

      if (part.includes("-")) {
        const [start, end] = part.split("-").map(Number)
        if (start < 1 || end > totalPages || start > end) return false
      } else {
        const pageNum = Number(part)
        if (pageNum < 1 || pageNum > totalPages) return false
      }
    }

    return true
  }

  const handleSplit = async () => {
    if (!file) return

    if (splitMethod === "range" && !validatePageRanges(pageRanges, file.pages)) {
      setError(`Invalid page ranges. Please use format like "1-3,5,7-9" with values between 1 and ${file.pages}`)
      return
    }

    setProcessing(true)
    setProgress(0)
    setError(null)
    setSplitFiles([])

    try {
      const arrayBuffer = await file.file.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      const totalPages = pdfDoc.getPageCount()
      
      let outputPdfs: Blob[] = []

      if (splitMethod === "range") {
        // Split by custom ranges
        const ranges = pageRanges.split(",").map(range => range.trim())
        
        for (let i = 0; i < ranges.length; i++) {
          const range = ranges[i]
          const newPdf = await PDFDocument.create()
          
          let pageNumbers: number[] = []
          if (range.includes("-")) {
            const [start, end] = range.split("-").map(num => parseInt(num))
            pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1)
          } else {
            pageNumbers = [parseInt(range) - 1] // Convert to 0-based index
          }
          
          const pagesToCopy = await newPdf.copyPages(pdfDoc, pageNumbers)
          pagesToCopy.forEach(page => newPdf.addPage(page))
          
          const pdfBytes = await newPdf.save()
          const blob = new Blob([pdfBytes], { type: "application/pdf" })
          outputPdfs.push(blob)
          
          setProgress(Math.round(((i + 1) / ranges.length) * 100))
        }
      } else if (splitMethod === "single") {
        // Split into individual pages
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create()
          const [page] = await newPdf.copyPages(pdfDoc, [i])
          newPdf.addPage(page)
          
          const pdfBytes = await newPdf.save()
          const blob = new Blob([pdfBytes], { type: "application/pdf" })
          outputPdfs.push(blob)
          
          setProgress(Math.round(((i + 1) / totalPages) * 100))
        }
      } else if (splitMethod === "even") {
        // Extract even pages
        const evenPages = Array.from({ length: Math.floor(totalPages / 2) }, (_, i) => i * 2 + 1)
        const newPdf = await PDFDocument.create()
        const pagesToCopy = await newPdf.copyPages(pdfDoc, evenPages)
        pagesToCopy.forEach(page => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        outputPdfs.push(blob)
        setProgress(100)
      } else if (splitMethod === "odd") {
        // Extract odd pages
        const oddPages = Array.from({ length: Math.ceil(totalPages / 2) }, (_, i) => i * 2)
        const newPdf = await PDFDocument.create()
        const pagesToCopy = await newPdf.copyPages(pdfDoc, oddPages)
        pagesToCopy.forEach(page => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: "application/pdf" })
        outputPdfs.push(blob)
        setProgress(100)
      }

      setSplitFiles(outputPdfs)
      setSplitComplete(true)
    } catch (err) {
      console.error("Error splitting PDF:", err)
      setError("Failed to split PDF. Please try again with a different file.")
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = (index: number) => {
    if (splitFiles[index]) {
      const fileName = splitMethod === "range" 
        ? `${file?.name.replace(".pdf", "")}_pages_${pageRanges.split(",")[index]}.pdf`
        : splitMethod === "single"
          ? `${file?.name.replace(".pdf", "")}_page_${index + 1}.pdf`
          : `${file?.name.replace(".pdf", "")}_${splitMethod}_pages.pdf`
      
      saveAs(splitFiles[index], fileName)
    }
  }

  const handleReset = () => {
    setFile(null)
    setPageRanges("")
    setSplitMethod("range")
    setProcessing(false)
    setProgress(0)
    setSplitComplete(false)
    setSplitFiles([])
    setError(null)
  }

  const splitFileNames = useMemo(() => {
    return splitFiles.map((_, index) => {
      if (splitMethod === "range") {
        return `Pages ${pageRanges.split(",")[index]}`
      } else if (splitMethod === "single") {
        return `Page ${index + 1}`
      } else {
        return `${splitMethod.charAt(0).toUpperCase() + splitMethod.slice(1)} Pages`
      }
    })
  }, [splitFiles, splitMethod, pageRanges])

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          p: 3,
          border: "2px dashed #ccc",
          borderRadius: 1,
          textAlign: "center",
          mb: 3,
        }}
      >
        <CloudUploadIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Drag and drop a PDF file here, or click to select file
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<PictureAsPdfIcon />}
          aria-label="Select PDF file"
        >
          Select PDF File
          <input
            type="file"
            hidden
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Button>
      </Box>

      {file && (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Selected File
            </Typography>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PictureAsPdfIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Box>
                    <Typography variant="subtitle1">{file.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {file.size} • {file.pages} pages
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleReset} aria-label="Remove file">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Split Options
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="split-method-label">Split Method</InputLabel>
                  <Select
                    labelId="split-method-label"
                    value={splitMethod}
                    label="Split Method"
                    onChange={(event) => setSplitMethod(event.target.value)}
                  >
                    <MenuItem value="range">Custom Page Ranges</MenuItem>
                    <MenuItem value="single">Individual Pages</MenuItem>
                    <MenuItem value="even">Even Pages Only</MenuItem>
                    <MenuItem value="odd">Odd Pages Only</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {splitMethod === "range" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Page Ranges"
                    placeholder="e.g., 1-3,5,7-9"
                    value={pageRanges}
                    onChange={(e) => setPageRanges(e.target.value)}
                    helperText={`Enter page numbers or ranges (1-${file.pages})`}
                  />
                </Grid>
              )}
            </Grid>
          </Box>

          {processing && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Processing... {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ContentCutIcon />}
              disabled={processing || (splitMethod === "range" && !pageRanges)}
              onClick={handleSplit}
              fullWidth
              aria-label="Split PDF"
            >
              Split PDF
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
              aria-label="Reset"
            >
              Reset
            </Button>
          </Box>
        </>
      )}

      {splitComplete && splitFiles.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Split Results ({splitFiles.length} files)
          </Typography>
          <List>
            {splitFiles.map((_, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Tooltip title="Download">
                    <IconButton
                      edge="end"
                      onClick={() => handleDownload(index)}
                      aria-label={`Download split file ${index + 1}`}
                    >
                      <GetAppIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemIcon>
                  <PictureAsPdfIcon />
                </ListItemIcon>
                <ListItemText primary={splitFileNames[index]} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        PDF Splitter Features
      </Typography>
      <Typography variant="body2" paragraph>
        • Split PDF files by custom page ranges
      </Typography>
      <Typography variant="body2" paragraph>
        • Extract individual pages from a PDF
      </Typography>
      <Typography variant="body2" paragraph>
        • Separate odd and even pages
      </Typography>
      <Typography variant="body2" paragraph>
        • Fast processing with client-side technology (your files never leave your computer)
      </Typography>

      <AdSense adSlot="1234567890" adFormat="auto" />
    </Paper>
  )
}
