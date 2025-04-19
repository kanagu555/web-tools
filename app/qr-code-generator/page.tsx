"use client";

import { QrCodeGenerator } from "@/components/qrCodeGenerator";
import { Container, Typography } from "@mui/material";

export default function QrCodeGeneratorPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        QR Code Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Create custom QR codes for any URL or text with customizable designs.
      </Typography>
      <QrCodeGenerator />
    </Container>
  );
}
