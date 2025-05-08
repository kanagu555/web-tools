"use client"

import { TextTranslator } from "@/components/text-translator"
import { Container, Typography } from "@mui/material"

export default function TextTranslatorPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Text Translator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Translate text between multiple languages quickly and accurately.
      </Typography>
      <TextTranslator />
    </Container>
  )
}


