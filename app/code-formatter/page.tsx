"use client";

import { Container, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { CodeFormatter } from "@/components/developerTools/code-formatter";

export default function CodeFormatterPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Code Formatter
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Format and beautify code in various programming languages.
      </Typography>
      <CodeFormatter />
    </Container>
  );
}
