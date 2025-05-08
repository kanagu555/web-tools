"use client";

import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
  IconButton,
  useTheme,
  Paper,
  Divider,
} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";

export default function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 4,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #f50057, #3f51b5, #00bcd4)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.05,
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "white" }}
            >
              Utility Tools
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 2 }}
            >
              A collection of useful tools to help with your daily tasks. Built
              with React and Material UI.
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <EmailIcon
                fontSize="small"
                sx={{ mr: 1, color: "rgba(255, 255, 255, 0.7)" }}
              />
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                kanagarajwhb@gmail.com
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "white" }}
            >
              Quick Links
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Link
                  href="/"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    display: "block",
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": { color: "white", textDecoration: "underline" },
                  }}
                  aria-label="Navigate to Home"
                >
                  Home
                </Link>
                <Link
                  href="/pdf-converter"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    display: "block",
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": { color: "white", textDecoration: "underline" },
                  }}
                  aria-label="Navigate to PDF Converter"
                >
                  PDF Converter
                </Link>
                <Link
                  href="/word-count"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    display: "block",
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": { color: "white", textDecoration: "underline" },
                  }}
                  aria-label="Navigate to Word Count"
                >
                  Word Count
                </Link>
              </Grid>
              <Grid item xs={6}>
                <Link
                  href="/color-palette"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    display: "block",
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": { color: "white", textDecoration: "underline" },
                  }}
                  aria-label="Navigate to Color Palette"
                >
                  Color Palette
                </Link>
                <Link
                  href="/settings"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    display: "block",
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": { color: "white", textDecoration: "underline" },
                  }}
                  aria-label="Navigate to Settings"
                >
                  Settings
                </Link>
                <Link
                  href="/privacy-policy
"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    display: "block",
                    mb: 1,
                    textDecoration: "none",
                    "&:hover": { color: "white", textDecoration: "underline" },
                  }}
                  aria-label="Navigate to Privacy Policy"
                >
                  Privacy Policy
                </Link>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "white" }}
            >
              Connect With Us
            </Typography>
            <Box sx={{ mb: 2 }}>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": { color: "white" },
                }}
                aria-label="Visit GitHub"
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": { color: "white" },
                }}
                aria-label="Visit LinkedIn"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": { color: "white" },
                }}
                aria-label="Visit Twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  "&:hover": { color: "white" },
                }}
                aria-label="Visit Facebook"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon />
              </IconButton>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" sx={{ color: "white", mb: 1 }}>
                Subscribe to our newsletter
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)", mb: 1 }}
              >
                Get the latest updates and news about our tools
              </Typography>
              <Link
                href="#"
                sx={{
                  color: theme.palette.secondary.main,
                  textDecoration: "none",
                  fontWeight: "bold",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                aria-label="Subscribe to our newsletter"
              >
                Subscribe Now
              </Link>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

        <Typography
          sx={{ textAlign: "center", color: "rgba(255, 255, 255, 0.6)" }}
        >
          {"Copyright © "}
          <Link
            color="inherit"
            href="/"
            sx={{ textDecoration: "none" }}
            aria-label="Navigate to Utility Tools Home"
          >
            Utility Tools
          </Link>{" "}
          {new Date().getFullYear()}
          {". All rights reserved."}
        </Typography>
      </Container>
    </Box>
  );
}
