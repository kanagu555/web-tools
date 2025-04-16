"use client"

import { Container, Typography } from "@mui/material"
import { ColorPalette } from "@/components/color-palette"

export default function ColorPalettePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Color Palette Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Generate and customize color palettes for your projects.
      </Typography>
      <ColorPalette />
    </Container>
  )
}

