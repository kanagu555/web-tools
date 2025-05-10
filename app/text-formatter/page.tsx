"use client"

import { TextFormatter } from "@/components/textTools/textFormatter"
import { Container, Typography } from "@mui/material"

export default function TextFormatterPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Text Formatter
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Format and beautify your text with various styling options.
      </Typography>
     <TextFormatter />
    </Container>
  )
}

