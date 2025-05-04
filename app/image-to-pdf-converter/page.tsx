"use client"

import { Container, Typography } from "@mui/material"
import { ImageToPdfConverter } from "@/components/image-to-pdf-converter"

export default function PdfConverterPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Image to PDF Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Convert your image files (JPG, PNG, GIF) to PDF documents with ease.
      </Typography>
      <ImageToPdfConverter />
    </Container>
  )
}



