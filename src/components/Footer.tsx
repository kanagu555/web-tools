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
          href: "/privacy-policy",
          ariaLabel: "Privacy Policy",
        },
        { name: "Sitemap", href: "/sitemap", ariaLabel: "Website Sitemap" },
      ],
    },
  ];

  // Enhanced JSON-LD structured data for Organization
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KodeKit",
    alternateName: "KodeKit Developer Tools",
    url: "https://kodekit.in",
    logo: {
      "@type": "ImageObject",
      url: "https://kodekit.in/logo.png",
      width: "200",
      height: "200",
    },
    sameAs: [
      "https://github.com/kanagu555",
      "https://x.com/kodekit_in",
      "https://www.linkedin.com/company/kodekit",
    ],
    description:
      "All-in-one toolkit for developers, designers, and content creators. Secure, fast, and privacy-focused web tools for file processing and development workflows.",
    foundingDate: "2023",
    founder: {
      "@type": "Person",
      name: "Kanagaraj K",
      jobTitle: "Software Developer",
      sameAs: [
        "https://github.com/kanagu555",
        "https://www.linkedin.com/in/kanagaraj-k",
      ],
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "kanagarajwhb@gmail.com",
      contactType: "Customer Service",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    keywords:
      "developer tools, file processing, web tools, productivity, secure tools, privacy-focused",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
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

              <Typography
                variant="body2"
                color="text.secondary"
                paragraph
                component="p"
                sx={{ lineHeight: 1.6 }}
              >
                All-in-one toolkit for developers, designers, and content
                creators. Transform, edit, and optimize your files with ease.
                Secure, fast, and privacy-focused web tools for your development
                workflow.
              </Typography>

              {/* Buy Me a Coffee Button */}
              <Box
                sx={{ mb: 3 }}
                component="section"
                aria-labelledby="support-heading"
              >
                <Typography
                  id="support-heading"
                  variant="srOnly"
                  component="h3"
                  sx={{ position: "absolute", left: "-10000px" }}
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

              <Box
                sx={{ mt: 2 }}
                component="nav"
                role="navigation"
                aria-labelledby="social-links-heading"
              >
                <Typography
                  id="social-links-heading"
                  variant="srOnly"
                  component="h3"
                  sx={{ position: "absolute", left: "-10000px" }}
                >
                  Follow KodeKit on Social Media
                </Typography>
                <Box
                  component="ul"
                  sx={{ display: "flex", listStyle: "none", p: 0, m: 0 }}
                >
                  <Box component="li" sx={{ mr: 1 }}>
                    <Link
                      href="https://github.com/kanagu555"
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label="Visit KodeKit GitHub profile (opens in new tab)"
                    >
                      <IconButton
                        size="small"
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover, &:focus": {
                            color: theme.palette.primary.main,
                            backgroundColor: `${theme.palette.primary.main}10`,
                          },
                        }}
                      >
                        <Github size={20} aria-hidden="true" />
                      </IconButton>
                    </Link>
                  </Box>
                  <Box component="li" sx={{ mr: 1 }}>
                    <Link
                      href="https://www.linkedin.com/company/kodekit"
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label="Visit KodeKit LinkedIn company page (opens in new tab)"
                    >
                      <IconButton
                        size="small"
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover, &:focus": {
                            color: "#0077B5",
                            backgroundColor: "#0077B510",
                          },
                        }}
                      >
                        <Linkedin size={20} aria-hidden="true" />
                      </IconButton>
                    </Link>
                  </Box>
                  <Box component="li" sx={{ mr: 1 }}>
                    <Link
                      href="https://x.com/kodekit_in"
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label="Follow KodeKit on X (formerly Twitter) (opens in new tab)"
                    >
                      <IconButton
                        size="small"
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover, &:focus": {
                            color: "#1DA1F2",
                            backgroundColor: "#1DA1F210",
                          },
                        }}
                      >
                        <X fontSize="small" aria-hidden="true" />
                      </IconButton>
                    </Link>
                  </Box>
                  <Box component="li">
                    <Link
                      href="mailto:kanagarajwhb@gmail.com"
                      rel="noopener noreferrer"
                      aria-label="Send email to KodeKit support"
                    >
                      <IconButton
                        size="small"
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover, &:focus": {
                            color: "#EA4335",
                            backgroundColor: "#EA433510",
                          },
                        }}
                      >
                        <Mail size={20} aria-hidden="true" />
                      </IconButton>
                    </Link>
                  </Box>
                </Box>
              </Box>
            </Grid>

            {footerLinks.map((section) => (
              <Grid item xs={6} sm={4} md={2} key={section.title}>
                <Typography
                  variant="h4"
                  fontWeight={600}
                  gutterBottom
                  component="h3"
                  sx={{ fontSize: "1.125rem" }}
                  id={`${section.title.toLowerCase()}-links`}
                >
                  {section.title}
                </Typography>
                <Box
                  component="nav"
                  role="navigation"
                  aria-labelledby={`${section.title.toLowerCase()}-links`}
                >
                  <Box
                    component="ul"
                    sx={{
                      listStyle: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    {section.links.map((link) => (
                      <Box
                        component="li"
                        key={link.name}
                        sx={{ marginBottom: "8px" }}
                      >
                        <Link
                          href={link.href}
                          variant="body2"
                          color="text.secondary"
                          underline="hover"
                          sx={{
                            transition: "color 0.2s",
                            "&:hover, &:focus": {
                              color: theme.palette.primary.main,
                            },
                          }}
                          aria-label={link.ariaLabel}
                        >
                          {link.name}
                        </Link>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 4 }} aria-hidden="true" />

          <Box
            component="section"
            role="contentinfo"
            aria-label="Copyright and attribution"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" color="text.secondary" component="p">
              © {new Date().getFullYear()} KodeKit. All rights reserved.
            </Typography>
            <Box
              sx={{
                display: "flex",
                mt: { xs: 2, sm: 0 },
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                component="p"
                sx={{ mr: 1 }}
              >
                Made with{" "}
                <span aria-label="love" role="img">
                  ❤️
                </span>{" "}
                by{" "}
                <Link
                  href="https://github.com/kanagu555"
                  target="_blank"
                  rel="noopener noreferrer author"
                  color="inherit"
                  underline="hover"
                  aria-label="Visit Kanagaraj K's GitHub profile (opens in new tab)"
                  sx={{
                    "&:hover, &:focus": {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Kanagaraj K
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer;
