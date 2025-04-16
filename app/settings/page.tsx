"use client"

import { Container, Typography } from "@mui/material"
import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Customize the application's appearance and behavior.
      </Typography>
      <SettingsForm />
    </Container>
  )
}

