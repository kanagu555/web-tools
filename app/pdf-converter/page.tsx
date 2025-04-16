"use client"

import { Container, Typography } from "@mui/material"
import { PdfConverter } from "@/components/pdf-converter"

export default function PdfConverterPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        PDF Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload a document to convert it to PDF format.
      </Typography>
      <PdfConverter />
    </Container>
  )
}

