"use client";

import { UnitConverter } from "@/components/mathTools/unitConverter";
import { Container, Typography } from "@mui/material";

export default function UnitConverterPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Unit Converter
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Convert between different units of measurement with precision.
      </Typography>
      <UnitConverter />
    </Container>
  );
}
