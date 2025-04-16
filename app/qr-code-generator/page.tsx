"use client"

import { Container, Typography } from "@mui/material"
import { Box } from "@mui/material"

export default function QrCodeGeneratorPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        QR Code Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create custom QR codes for any URL or text with customizable designs.
      </Typography>
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Coming Soon
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          This tool is currently under development and will be available soon.
        </Typography>
      </Box>
    </Container>
  )
}

