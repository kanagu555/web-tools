"use client"

import { useState, useRef } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Alert,
  Grid,
  IconButton,
  Stack,
  Divider,
} from "@mui/material"
import CloudUploadIcon from "@mui/icons-material/CloudUpload"
import DeleteIcon from "@mui/icons-material/Delete"
import GetAppIcon from "@mui/icons-material/GetApp"
import ImageIcon from "@mui/icons-material/Image"
import { jsPDF } from "jspdf"

interface ImageFile {
  file: File
  preview: string
}

export function ImageToPdfConverter() {
  const [images, setImages] = useState<ImageFile[]>([])
  const [converting, setConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setError(null)
      
      const newImages: ImageFile[] = []
      const fileArray = Array.from(e.target.files)
      
      fileArray.forEach(file => {
        if (!file.type.match('image.*')) {
          setError("Only image files are supported")
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newImages.push({
              file,
              preview: e.target.result as string
            })
            
            if (newImages.length === fileArray.length) {
              setImages(prev => [...prev, ...newImages])
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleConvert = async () => {
    if (images.length === 0) return
    
    setConverting(true)
    setProgress(0)
    setError(null)
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const margin = 10 // margin in mm
      
      for (let i = 0; i < images.length; i++) {
        // Add a new page for each image except the first one
        if (i > 0) {
          pdf.addPage()
        }
        
        // Create an image element to get dimensions
        const img = new Image()
        img.src = images[i].preview
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            // Calculate image dimensions to fit within page margins
            const imgWidth = pageWidth - (2 * margin)
            const imgHeight = (img.height * imgWidth) / img.width
            
            // Add image to PDF
            pdf.addImage(
              images[i].preview,
              'JPEG',
              margin,
              margin,
              imgWidth,
              imgHeight
            )
            
            // Update progress
            setProgress(Math.round(((i + 1) / images.length) * 100))
            resolve()
          }
        })
      }
      
      // Save the PDF
      pdf.save('converted-images.pdf')
      
    } catch (err) {
      console.error("Error converting images to PDF:", err)
      setError("Failed to convert images to PDF. Please try again.")
    } finally {
      setConverting(false)
    }
  }

  const handleReset = () => {
    setImages([])
    setConverting(false)
    setProgress(0)
    setError(null)
  }

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
          Drag and drop image files here, or click to select files
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<ImageIcon />}
        >
          Select Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Button>
      </Box>

      {images.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Selected Images ({images.length})
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {images.map((image, index) => (
              <Grid xs={6} sm={4} md={3} key={index}>
                <Box
                  sx={{
                    position: "relative",
                    height: 120,
                    borderRadius: 1,
                    overflow: "hidden",
                    boxShadow: 1,
                  }}
                >
                  <Box
                    component="img"
                    src={image.preview}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    alt={`Image ${index + 1}`}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      bgcolor: "rgba(255,255,255,0.7)",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>

          {converting && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Converting... {progress}%
              </Typography>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<GetAppIcon />}
              disabled={converting || images.length === 0}
              onClick={handleConvert}
              fullWidth
            >
              Convert to PDF
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleReset}
            >
              Reset
            </Button>
          </Stack>
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Image to PDF Converter Features
      </Typography>
      <Typography variant="body2" paragraph>
        • Convert multiple image files (JPG, PNG, GIF, etc.) to a single PDF document
      </Typography>
      <Typography variant="body2" paragraph>
        • Maintain image quality and aspect ratio in the converted PDF
      </Typography>
      <Typography variant="body2" paragraph>
        • Arrange images in the order you want them to appear in the PDF
      </Typography>
      <Typography variant="body2" paragraph>
        • Fast processing with client-side technology (your files never leave your computer)
      </Typography>
      <Typography variant="body2" paragraph>
        • Support for all common image formats including JPEG, PNG, GIF, BMP, and WEBP
      </Typography>
    </Paper>
  )
}


