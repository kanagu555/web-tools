"use client"

import { Container, Typography } from "@mui/material"
import { PdfSplitter } from "@/components/pdf-splitter"

export default function PdfSplitterPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        PDF Splitter
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Split PDF files into multiple documents by pages or bookmarks.
      </Typography>
      <PdfSplitter />
    </Container>
  )
}


