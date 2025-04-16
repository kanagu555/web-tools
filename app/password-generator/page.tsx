"use client";

import { PasswordGenerator } from "@/components/password-generator";
import { Container, Typography } from "@mui/material";

export default function PasswordGeneratorPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Password Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create strong, secure passwords with customizable options.
      </Typography>
      <PasswordGenerator />
    </Container>
  );
}
