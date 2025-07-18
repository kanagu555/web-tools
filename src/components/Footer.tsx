import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import { Code, Github, Linkedin, Mail, Coffee } from "lucide-react";
import { Helmet } from "react-helmet";
import { X } from "@mui/icons-material";

const Footer = () => {
  const theme = useTheme();

  const footerLinks = [
    {
      title: "Profile",
      links: [
        { name: "About", href: "/about", ariaLabel: "About KodeKit" },
        { name: "Contact", href: "/contact", ariaLabel: "Contact KodeKit" },
        { name: "FAQ", href: "/faq", ariaLabel: "Frequently Asked Questions" },
      ],
    },
    {
      title: "Legal",
      links: [
        {
          name: "Privacy Policy",
          href: "/privacy.md",
          ariaLabel: "Privacy Policy",
        },
        { name: "Sitemap", href: "/sitemap.xml", ariaLabel: "Website Sitemap" },
      ],
    },
  ];

  // JSON-LD structured data for Organization
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KodeKit",
    url: "https://kodekit.in",
    logo: "https://kodekit.in/logo.png",
    sameAs: [
      "https://github.com/kanagu555",
      "https://x.com/kodekit_in",
      "https://www.linkedin.com/company/kodekit",
    ],
    description:
      "All-in-one toolkit for developers, designers, and content creators",
    foundingDate: "2023",
    founder: {
      "@type": "Person",
      name: "Kanagaraj K",
    },
  };

  return (
    <>
      <Helmet>
        {/* Footer doesn't need its own meta tags, but we can add structured data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </script>
      </Helmet>

      <Box
        component="footer"
        role="contentinfo"
        aria-label="Website footer"
        sx={{
          py: 6,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Code
                  size={32}
                  color={theme.palette.primary.main}
                  aria-hidden="true"
                />
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    ml: 1,
                    fontWeight: 700,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  KodeKit
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                All-in-one toolkit for developers, designers, and content
                creators. Transform, edit, and optimize your files with ease.
              </Typography>

              {/* Buy Me a Coffee Button */}
              <Box sx={{ mb: 3 }}>
                <Link
                  href="http://buymeacoffee.com/kanagarajwn"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none" }}
                >
                  <Box
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
                      "&:hover": {
                        backgroundColor: "#FFD700",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(255, 221, 0, 0.4)",
                      },
                    }}
                  >
                    <Coffee size={18} />
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="inherit"
                    >
                      Buy me a coffee
                    </Typography>
                  </Box>
                </Link>
              </Box>

              <Box sx={{ mt: 2 }} role="group" aria-label="Social media links">
                <Link
                  href="https://github.com/kanagu555"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our GitHub profile (opens in new tab)"
                >
                  <IconButton
                    size="small"
                    aria-label="GitHub"
                    sx={{ mr: 1, color: theme.palette.text.secondary }}
                  >
                    <Github size={20} aria-hidden="true" />
                  </IconButton>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/kodekit"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our LinkedIn page (opens in new tab)"
                >
                  <IconButton
                    size="small"
                    aria-label="LinkedIn"
                    sx={{ mr: 1, color: theme.palette.text.secondary }}
                  >
                    <Linkedin size={20} aria-hidden="true" />
                  </IconButton>
                </Link>
                <Link
                  href="https://x.com/kodekit_in"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our X profile (formerly Twitter) (opens in new tab)"
                >
                  <IconButton
                    size="small"
                    aria-label="X"
                    sx={{ mr: 1, color: theme.palette.text.secondary }}
                  >
                    <X fontSize="small" aria-hidden="true" />
                  </IconButton>
                </Link>
                <Link
                  href="mailto:kanagarajwhb@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Send us an email (opens in new tab)"
                >
                  <IconButton
                    size="small"
                    aria-label="Email"
                    sx={{ color: theme.palette.text.secondary }}
                  >
                    <Mail size={20} aria-hidden="true" />
                  </IconButton>
                </Link>
              </Box>
            </Grid>

            {footerLinks.map((section) => (
              <Grid item xs={6} sm={4} md={2} key={section.title}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  component="h3"
                >
                  {section.title}
                </Typography>
                <Box component="nav" aria-label={`${section.title} links`}>
                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {section.links.map((link) => (
                      <li key={link.name} style={{ marginBottom: "8px" }}>
                        <Link
                          href={link.href}
                          variant="body2"
                          color="text.secondary"
                          underline="hover"
                          sx={{ transition: "color 0.2s" }}
                          aria-label={link.ariaLabel}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} aria-hidden="true" />

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} KodeKit. All rights reserved.
            </Typography>
            <Box
              sx={{
                display: "flex",
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                Made with <span aria-label="love">❤️</span> by Kanagaraj K
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
