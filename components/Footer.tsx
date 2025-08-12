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
import MapIcon from "@mui/icons-material/Map";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import HelpIcon from "@mui/icons-material/Help";
import SendIcon from "@mui/icons-material/Send";
import { Code, Coffee } from "lucide-react";
import NextLink from "next/link";

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
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.light})`,
        }}
      />

      <Container maxWidth="lg">
        {/* Main footer content */}
        <Grid container spacing={4} sx={{ py: 6 }}>
          {/* Logo and description */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Code
                size={32}
                color={theme.palette.primary.main}
                aria-label="KodeKit logo"
                role="img"
              />
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  ml: 1,
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                KodeKit
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
              A collection of powerful utility tools designed to simplify your
              daily tasks. Built with modern web technologies for speed and
              reliability.
            </Typography>

            {/* Buy Me a Coffee Button */}
            <Box
              sx={{ mb: 2 }}
              component="section"
              aria-labelledby="support-heading"
            >
              <Typography
                id="support-heading"
                component="h3"
                sx={{
                  position: "absolute",
                  left: "-10000px",
                  width: "1px",
                  height: "1px",
                  overflow: "hidden",
                  clip: "rect(0, 0, 0, 0)",
                }}
              >
                Support KodeKit
              </Typography>
              <Link
                href="https://buymeacoffee.com/kanagarajwn"
                target="_blank"
                rel="noopener noreferrer sponsored"
                sx={{ textDecoration: "none" }}
                aria-label="Support KodeKit by buying me a coffee (opens in new tab)"
              >
                <Box
                  component="button"
                  role="button"
                  tabIndex={0}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    px: 3,
                    py: 1.5,
                    backgroundColor: "#FFDD00",
                    color: "#000000",
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(255, 221, 0, 0.3)",
                    border: "none",
                    cursor: "pointer",
                    "&:hover, &:focus": {
                      backgroundColor: "#FFD700",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(255, 221, 0, 0.4)",
                      outline: "2px solid #FFD700",
                      outlineOffset: "2px",
                    },
                  }}
                >
                  <Coffee size={18} aria-hidden="true" />
                  <Typography variant="body2" fontWeight={600} color="inherit">
                    Buy me a coffee
                  </Typography>
                </Box>
              </Link>
            </Box>

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
          <Grid item xs={6} sm={6} md={2.25}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: theme.palette.mode === "dark" ? "white" : "black",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Navigation
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Link
                component={NextLink}
                href="/categories"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.5 },
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <MapIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  Categories
                </Typography>
              </Link>

              <Link
                component={NextLink}
                href="/sitemap-page"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.5 },
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <MapIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  Sitemap
                </Typography>
              </Link>

              <Link
                href="/privacy-policy"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.5 },
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <PrivacyTipIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  Privacy Policy
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Company links */}
          <Grid item xs={6} sm={6} md={2.25}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 3,
                color: theme.palette.mode === "dark" ? "white" : "black",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Company
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Link
                component={NextLink}
                href="/about"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.5 },
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <InfoIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  About
                </Typography>
              </Link>

              <Link
                component={NextLink}
                href="/contact"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.5 },
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <ContactMailIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  Contact
                </Typography>
              </Link>

              <Link
                component={NextLink}
                href="/faq"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1, sm: 1.5 },
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": {
                    color: theme.palette.primary.main,
                  },
                }}
              >
                <HelpIcon fontSize="small" />
                <Typography variant="body2" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}>
                  FAQ
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* Newsletter and Support */}
          <Grid item xs={12} md={4.5}>
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
                mb: 4,
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
