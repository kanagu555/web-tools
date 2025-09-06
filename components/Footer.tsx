"use client";

import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Category,
  Mail,
  LinkedIn,
  Map,
  PrivacyTip,
  Info,
  ContactMail,
  Help,
  X,
} from "@mui/icons-material";
import { Code, Coffee } from "lucide-react";
import NextLink from "next/link";
import AdSense from "./AdSense";

export default function Footer() {
  const theme = useTheme();

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
                aria-label="LinkedIn"
                href="https://linkedin.com/company/kodekit"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedIn fontSize="small" />
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
                aria-label="Visit our X profile (formerly Twitter)"
                href="https://x.com/kodekit_in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <X fontSize="small" />
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
                aria-label="Email"
                href="mailto:contact@kodekit.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail fontSize="small" />
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
                <Category fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  Categories
                </Typography>
              </Link>

              <Link
                component={NextLink}
                href="/sitemap"
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
                <Map fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
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
                <PrivacyTip fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
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
                <Info fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
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
                <ContactMail fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
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
                <Help fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                >
                  FAQ
                </Typography>
              </Link>
            </Box>
          </Grid>

          {/* AdSense Ad */}
          <Grid item xs={12} md={4.5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
              }}
            >
              {process.env.NODE_ENV === "development" ? (
                // Development placeholder
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: "600px",
                    height: "250px",
                    border: `2px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.palette.action.hover,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                  >
                    AdSense Placeholder
                    <br />
                    (Slot: 9397748290)
                    <br />
                    <em>Ads appear in production</em>
                  </Typography>
                </Box>
              ) : (
                <AdSense
                  adSlot="9397748290"
                  adFormat="auto"
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "600px",
                    height: "250px",
                  }}
                />
              )}
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
          <Typography variant="body2">Made with ❤️ by KK</Typography>
        </Box>
      </Container>
    </Box>
  );
}
