"use client"

import { Container, Typography, Button, Box } from "@mui/material"
import { useRouter } from "next/navigation"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import HomeIcon from "@mui/icons-material/Home"

export default function NotFound() {
  const router = useRouter()

  return (
    <Container maxWidth="md" sx={{ py: 12, textAlign: "center" }}>
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "text.secondary", mb: 4 }} />
      <Typography variant="h3" component="h1" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: "auto" }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
        Try checking the URL for errors, then hit the refresh button on your browser.
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={() => router.push("/")}
          size="large"
        >
          Back to Home
        </Button>
      </Box>
      <Box sx={{ mt: 8 }}>
        <Typography variant="h6" gutterBottom>
          Looking for our tools?
        </Typography>
        <Typography variant="body2" paragraph>
          Try one of our popular tools:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={() => router.push("/text-translator")}>
            Text Translator
          </Button>
          <Button variant="outlined" onClick={() => router.push("/pdf-merger")}>
            PDF Merger
          </Button>
          <Button variant="outlined" onClick={() => router.push("/qr-code-generator")}>
            QR Code Generator
          </Button>
          <Button variant="outlined" onClick={() => router.push("/word-count")}>
            Word Counter
          </Button>
        </Box>
      </Box>
    </Container>
  )
}