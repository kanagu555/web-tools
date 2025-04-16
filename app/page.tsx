"use client"

import { Container, Typography } from "@mui/material"
import { ToolGrid } from "@/components/tool-grid"
import AdSense from "@/components/AdSense"

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Utility Tools Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select a tool from the dashboard below or use the navigation menu.
      </Typography>

      <AdSense adSlot="1234567890" adFormat="auto" />

      <ToolGrid />
    </Container>
  )
}

