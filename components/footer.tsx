"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  useTheme,
  Divider,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SendIcon from "@mui/icons-material/Send";

export default function Footer() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the subscription here
    setEmail("");
    setOpenSnackbar(true);
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        backgroundColor:
          theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.87)" : "#f5f5f7",
        color:
          theme.palette.mode === "dark"
            ? "rgba(255, 255, 255, 0.7)"
            : "rgba(0, 0, 0, 0.7)",
        position: "relative",
        overflow: "hidden",
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      {/* Wave decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "5px",
          background: `linear-gradient(90deg, 
            ${theme.palette.primary.main}, 
            ${theme.palette.secondary.main}, 
            ${theme.palette.primary.light})`,
        }}
      />

      <Container maxWidth="lg">
        {/* Main footer content */}
        <Grid container spacing={4} sx={{ py: 6 }}>
          {/* Logo and description */}
          <Grid item xs={12} md={4}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                color: theme.palette.primary.main,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box 
                component="span" 
                sx={{ 
                  mr: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span>&#60; &#62;</span>
              </Box>
              <Box 
                component="span" 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: "1.8rem"
                }}
              >
                K
              </Box>
              ode<Box 
                component="span" 
                sx={{ 
                  color: theme.palette.primary.main,
                  fontSize: "1.8rem"
                }}
              >
                K
              </Box>it
            </Typography>

            <Typography variant="body2" sx={{ mb: 3 }}>
              A collection of powerful utility tools designed to simplify your
              daily tasks. Built with modern web technologies for speed and
              reliability.
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  },
                }}
                aria-label="GitHub"
                href="https://github.com/kanagu555"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  },
                }}
                aria-label="LinkedIn"
                href="https://linkedin.com/in/kanagarajwhb"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.05)",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                  },
                }}
                aria-label="Twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Navigation links */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: theme.palette.mode === "dark" ? "white" : "black",
              }}
            >
              Navigation
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Link
                href="/"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <HomeIcon fontSize="small" />
                <Typography variant="body2">Home</Typography>
              </Link>

              <Link
                href="/sitemap.xml"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <MapIcon fontSize="small" />
                <Typography variant="body2">Sitemap</Typography>
              </Link>

              <Link
                href="/privacy-policy"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <PrivacyTipIcon fontSize="small" />
                <Typography variant="body2">Privacy Policy</Typography>
              </Link>
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: theme.palette.mode === "dark" ? "white" : "black",
              }}
            >
              Stay Updated
            </Typography>

            <Typography variant="body2" sx={{ mb: 2 }}>
              Subscribe to our newsletter for the latest updates and new
              features.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
              }}
            >
              <TextField
                size="small"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(0, 0, 0, 0.03)",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                sx={{
                  whiteSpace: "nowrap",
                  px: 2,
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ backgroundColor: theme.palette.divider }} />

        {/* Copyright section */}
        <Box
          sx={{
            py: 3,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} KodeKit. All rights reserved.
          </Typography>

          <Typography variant="body2">Made with ❤️ by Kanagaraj K</Typography>
        </Box>
      </Container>

      {/* Subscription confirmation */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Thanks for subscribing!
        </Alert>
      </Snackbar>
    </Box>
  );
}

