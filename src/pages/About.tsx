import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const About = () => {
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // JSON-LD structured data for Organization
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KodeKit",
    url: "https://kodekit.in",
    logo: "https://kodekit.in/og-image.jpg",
    sameAs: ["https://twitter.com/kodekit", "https://github.com/kodekit"],
    description:
      "KodeKit is an all-in-one toolkit for developers, designers, and content creators. Discover our mission, team, and technology.",
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://kodekit.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: "https://kodekit.in/about",
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>About KodeKit - All-in-One Developer Toolkit</title>
        <meta
          name="description"
          content="Learn more about KodeKit, the all-in-one toolkit for developers, designers, and content creators. Discover our mission, team, and technology."
        />
        <meta
          name="keywords"
          content="About KodeKit, developer tools, online tools, team, mission, technology, web tools, productivity, React, TypeScript, Material-UI"
        />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="About KodeKit - All-in-One Developer Toolkit"
        />
        <meta
          property="og:description"
          content="Learn more about KodeKit, the all-in-one toolkit for developers, designers, and content creators. Discover our mission, team, and technology."
        />
        <meta property="og:url" content="https://kodekit.in/about" />
        <meta property="og:image" content="https://kodekit.in/og-image.jpg" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About KodeKit - All-in-One Developer Toolkit"
        />
        <meta
          name="twitter:description"
          content="Learn more about KodeKit, the all-in-one toolkit for developers, designers, and content creators. Discover our mission, team, and technology."
        />
        <meta name="twitter:image" content="https://kodekit.in/og-image.jpg" />
        <link rel="canonical" href="https://kodekit.in/about" />
        <meta name="robots" content="index, follow" />
        {/* Alternate language example */}
        <link rel="alternate" href="https://kodekit.in/about" hrefLang="en" />
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              component="h1"
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              About KodeKit
            </Typography>
            <Divider
              sx={{ width: "60px", mx: "auto", mb: 3, borderWidth: 2 }}
            />
            <Typography variant="subtitle1" color="text.secondary">
              Your all-in-one toolkit for developers, designers, and content
              creators
            </Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              KodeKit was created with a simple mission: to provide developers
              and creators with a comprehensive set of tools that streamline
              workflows and boost productivity. We believe that the right tools
              can make all the difference in the creative process.
            </Typography>
            <Typography variant="body1" paragraph>
              Our platform brings together a diverse collection of utilities for
              PDF manipulation, text processing, design work, and development
              tasks—all in one convenient location, accessible from any device
              with a web browser.
            </Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              The Team
            </Typography>
            <Typography variant="body1" paragraph>
              KodeKit is developed and maintained by a passionate team of
              developers who understand the challenges of modern software
              development and content creation. We're constantly working to
              improve existing tools and add new ones based on user feedback.
            </Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Our Technology
            </Typography>
            <Typography variant="body1" paragraph>
              KodeKit is built using modern web technologies including React,
              TypeScript, and Material-UI. We prioritize performance,
              accessibility, and user experience in everything we build.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Get in Touch
            </Typography>
            <Typography variant="body1" paragraph>
              Have questions, suggestions, or feedback? We'd love to hear from
              you! Visit our Contact page or connect with us on social media.
            </Typography>
          </Box>
          <AdSense adSlot="6613251015" />
        </Paper>
      </motion.div>
    </Container>
  );
};

export default About;
