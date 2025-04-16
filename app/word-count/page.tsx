"use client"

import { Container, Typography } from "@mui/material"
import { WordCounter } from "@/components/word-counter"

export default function WordCountPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Word Count Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Type or paste text to get real-time word and character counts.
      </Typography>
      <WordCounter />
    </Container>
  )
}

