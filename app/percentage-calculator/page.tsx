"use client";

import { Container, Typography } from "@mui/material";
import { PercentageCalculator } from "@/components/mathTools/percentageCalculator";

export default function PercentageCalculatorPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Percentage Calculator
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Calculate percentages, increases, decreases, and discounts easily.
      </Typography>
      <PercentageCalculator />
    </Container>
  );
}
