"use client"

import { Container, Typography } from "@mui/material"
import { PdfMerger } from "@/components/pdfTools/pdf-merger"

export default function PdfMergerPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        PDF Merger
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Combine multiple PDF files into a single document with custom ordering.
      </Typography>
      <PdfMerger />
    </Container>
  )
}


