"use client";

import { useEffect } from "react";
import { Container, Typography } from "@mui/material";
import { ToolGrid } from "@/components/dashboard/tool-grid";
import { CategoryToolCards } from "@/components/dashboard/category-tool-cards";

export default function Home() {
  useEffect(() => {
    // Scroll to the top of the page on load
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
        Utility Tools Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Select a tool from the dashboard below or use the navigation menu.
      </Typography>
      {/* <CategoryToolCards /> */}
      <ToolGrid />
    </Container>
  );
}
