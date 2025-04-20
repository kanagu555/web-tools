"use client"

import { SpellChecker } from "@/components/spellChecker"
import { Container, Typography } from "@mui/material"

export default function SpellCheckPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Spell Check
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Check spelling and grammar in your text with advanced suggestions.
      </Typography>
      <SpellChecker />
    </Container>
  )
}

