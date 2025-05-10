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
  Tooltip,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf"
import DeleteIcon from "@mui/icons-material/Delete"
import GetAppIcon from "@mui/icons-material/GetApp"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import MergeIcon from "@mui/icons-material/Merge"
import { PDFDocument } from "pdf-lib"
import { saveAs } from "file-saver"
interface PdfFile {
  file: File
  name: string
  size: string
  pages?: number
}

export function PdfMerger() {
  const [files, setFiles] = useState<PdfFile[]>([])
  const [merging, setMerging] = useState(false)
  const [progress, setProgress] = useState(0)
  const [merged, setMerged] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mergedPdfBlobRef = useRef<Blob | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setError(null)
      setMerged(false)

      const newFiles: PdfFile[] = []
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i]
        if (file.type !== "application/pdf") {
          setError("Only PDF files are supported")
          return
        }

        try {
          const arrayBuffer = await file.arrayBuffer()
          const pdfDoc = await PDFDocument.load(arrayBuffer)
          const pageCount = pdfDoc.getPageCount()

          newFiles.push({
            file,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            pages: pageCount,
          })
        } catch (err) {
          console.error("Error reading PDF:", err)
          newFiles.push({
            file,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + " KB",
            pages: undefined,
          })
        }
      }

      setFiles((prev) => [...prev, ...newFiles])
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setMerged(false)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return

    setFiles((prev) => {
      const newFiles = [...prev]
      const temp = newFiles[index]
      newFiles[index] = newFiles[index - 1]
      newFiles[index - 1] = temp
      return newFiles
    })

    setMerged(false)
  }

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return

    setFiles((prev) => {
      const newFiles = [...prev]
      const temp = newFiles[index]
      newFiles[index] = newFiles[index + 1]
      newFiles[index + 1] = temp
      return newFiles
    })

    setMerged(false)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please upload at least two PDF files to merge")
      return
    }

    setMerging(true)
    setProgress(0)
    setError(null)

    try {
      const mergedPdf = await PDFDocument.create()

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const arrayBuffer = await file.file.arrayBuffer()
        const pdfDoc = await PDFDocument.load(arrayBuffer)

        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices())
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page)
        })

        setProgress(Math.round(((i + 1) / files.length) * 100))
      }

      const mergedPdfBytes = await mergedPdf.save()
      mergedPdfBlobRef.current = new Blob([mergedPdfBytes], { type: "application/pdf" })

      setMerged(true)
      setMerging(false)
    } catch (err) {
      console.error("Error merging PDFs:", err)
      setError("Failed to merge PDFs. Please check if all files are valid PDFs.")
      setMerging(false)
    }
  }

  const handleDownload = () => {
    if (mergedPdfBlobRef.current) {
      saveAs(mergedPdfBlobRef.current, "merged-document.pdf")
    }
  }

  const handleReset = () => {
    setFiles([])
    setMerging(false)
    setProgress(0)
    setMerged(false)
    setError(null)
    mergedPdfBlobRef.current = null
  }

  const totalPages = useMemo(
    () => files.reduce((sum, file) => sum + (file.pages || 0), 0),
    [files]
  )

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
          Drag and drop PDF files here, or click to select files
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<PictureAsPdfIcon />}
          aria-label="Select PDF files"
        >
          Select PDF Files
          <input
            type="file"
            hidden
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Button>
      </Box>

      {files.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Selected Files ({files.length} files, {totalPages} pages total)
          </Typography>

          <List sx={{ mb: 3 }}>
            {files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <Box>
                    <Tooltip title="Move up">
                      <IconButton
                        edge="end"
                        disabled={index === 0}
                        onClick={() => handleMoveUp(index)}
                        aria-label={`Move ${file.name} up`}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Move down">
                      <IconButton
                        edge="end"
                        disabled={index === files.length - 1}
                        onClick={() => handleMoveDown(index)}
                        aria-label={`Move ${file.name} down`}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove">
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveFile(index)}
                        aria-label={`Remove ${file.name}`}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemIcon>
                  <PictureAsPdfIcon />
                </ListItemIcon>
                <ListItemText
                  primary={`${index + 1}. ${file.name}`}
                  secondary={`${file.size}${file.pages ? ` • ${file.pages} pages` : ""}`}
                />
              </ListItem>
            ))}
          </List>

          {merging && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Merging... {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {!merged ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<MergeIcon />}
                disabled={merging || files.length < 2}
                onClick={handleMerge}
                fullWidth
                aria-label="Merge PDFs"
              >
                Merge PDFs
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<GetAppIcon />}
                onClick={handleDownload}
                fullWidth
                aria-label="Download merged PDF"
              >
                Download Merged PDF
              </Button>
            )}
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

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        PDF Merger Features
      </Typography>
      <Typography variant="body2" paragraph>
        • Merge multiple PDF files into a single document
      </Typography>
      <Typography variant="body2" paragraph>
        • Reorder files before merging
      </Typography>
      <Typography variant="body2" paragraph>
        • Preserves all content and formatting from original PDFs
      </Typography>
      <Typography variant="body2" paragraph>
        • Fast processing with client-side technology (your files never leave your computer)
      </Typography>
    </Paper>
  )
}



