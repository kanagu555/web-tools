"use client"

import { Container, Typography } from "@mui/material"
import { ColorPicker } from "@/components/color-Picker"

export default function ColorPickerPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Color Picker
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Pick colors from images or create your own custom color schemes.
      </Typography>
      <ColorPicker />
    </Container>
  )
}

