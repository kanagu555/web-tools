"use client"

import { Container, Typography } from "@mui/material"
import { Box } from "@mui/material"

export default function CodeFormatterPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Code Formatter
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Format and beautify code in various programming languages.
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

