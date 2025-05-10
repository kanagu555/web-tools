"use client";

import { Calculator } from "@/components/mathTools/calculator";
import { Container, Typography } from "@mui/material";

export default function CalculatorPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Perform basic and advanced calculations with a powerful calculator.
      </Typography>
      <Calculator />
    </Container>
  );
}
