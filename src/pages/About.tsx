import { useEffect } from "react";
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
  const isProductionEnv = import.meta.env.PROD;

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
    sameAs: [
      "https://twitter.com/kodekit",
      "https://github.com/kanagu555/kode-kit",
      "https://linkedin.com/company/kodekit",
    ],
    description:
      "KodeKit is an all-in-one toolkit for developers, designers, and content creators. Discover our mission, team, and technology.",
    foundingDate: "2023",
    founder: {
      "@type": "Person",
      name: "KodeKit Team",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "India",
    },
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

  // FAQ structured data
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is KodeKit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "KodeKit is an all-in-one toolkit for developers, designers, and content creators that provides a comprehensive set of tools to streamline workflows and boost productivity.",
        },
      },
      {
        "@type": "Question",
        name: "Who created KodeKit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "KodeKit is developed and maintained by a passionate team of developers who understand the challenges of modern software development and content creation.",
        },
      },
      {
        "@type": "Question",
        name: "What technologies does KodeKit use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "KodeKit is built using modern web technologies including React, TypeScript, and Material-UI with a focus on performance, accessibility, and user experience.",
        },
      },
    ],
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      aria-label="About KodeKit - Developer Toolkit Information"
    >
      <Helmet>
        <title>
          About KodeKit - All-in-One Developer Toolkit | Tools & Resources
        </title>
        <meta
          name="description"
          content="Learn more about KodeKit - the ultimate developer toolkit. Discover our mission, team expertise, technology stack, and how we help developers, designers, and content creators boost productivity."
        />
        <meta
          name="keywords"
          content="About KodeKit, developer tools, online coding tools, web development resources, PDF tools, text processing, design utilities, React tools, TypeScript resources, Material-UI components"
        />
        <meta name="author" content="KodeKit Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="About KodeKit - All-in-One Developer Toolkit | Tools & Resources"
        />
        <meta
          property="og:description"
          content="Learn more about KodeKit - the ultimate developer toolkit. Discover our mission, team expertise, and technology stack."
        />
        <meta property="og:url" content="https://kodekit.in/about" />
        <meta property="og:image" content="https://kodekit.in/og-image.jpg" />
        <meta property="og:site_name" content="KodeKit" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About KodeKit - All-in-One Developer Toolkit | Tools & Resources"
        />
        <meta
          name="twitter:description"
          content="Learn more about KodeKit - the ultimate developer toolkit. Discover our mission, team expertise, and technology stack."
        />
        <meta name="twitter:image" content="https://kodekit.in/og-image.jpg" />
        <meta name="twitter:creator" content="@kodekit" />

        {/* Canonical and alternate links */}
        <link rel="canonical" href="https://kodekit.in/about" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="alternate" href="https://kodekit.in/about" hrefLang="en" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-live="polite"
        aria-atomic="true"
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
          role="article"
          aria-label="Detailed information about KodeKit"
        >
          <Box
            sx={{ textAlign: "center", mb: 5 }}
            aria-labelledby="about-heading about-subtitle"
          >
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
              id="about-heading"
            >
              About KodeKit
            </Typography>
            <Divider
              sx={{ width: "60px", mx: "auto", mb: 3, borderWidth: 2 }}
              aria-hidden="true"
            />
            <Typography
              variant="subtitle1"
              color="text.secondary"
              id="about-subtitle"
            >
              Your all-in-one toolkit for developers, designers, and content
              creators
            </Typography>
          </Box>

          {isProductionEnv && (
            <AdSense
              adSlot="6613251015"
              aria-label="Advertisement"
              role="complementary"
            />
          )}

          <Box
            sx={{ mb: 6 }}
            aria-labelledby="mission-heading"
            role="region"
            itemScope
            itemType="https://schema.org/AboutPage"
          >
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, fontSize: "1.8rem" }}
              id="mission-heading"
            >
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph itemProp="description">
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

          <Box
            sx={{ mb: 6 }}
            aria-labelledby="team-heading"
            role="region"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, fontSize: "1.8rem" }}
              id="team-heading"
            >
              The Team
            </Typography>
            <Typography variant="body1" paragraph itemProp="employee">
              KodeKit is developed and maintained by a passionate team of
              developers who understand the challenges of modern software
              development and content creation. We're constantly working to
              improve existing tools and add new ones based on user feedback.
            </Typography>
          </Box>

          <Box
            sx={{ mb: 6 }}
            aria-labelledby="technology-heading"
            role="region"
          >
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, fontSize: "1.8rem" }}
              id="technology-heading"
            >
              Our Technology Stack
            </Typography>
            <Typography variant="body1" paragraph>
              KodeKit is built using modern web technologies including:
            </Typography>
            <Box component="ul" sx={{ pl: 3, mb: 2 }}>
              <Typography component="li" variant="body1" paragraph>
                <strong>React</strong> - For building interactive user
                interfaces
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>TypeScript</strong> - For type-safe JavaScript
                development
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Material-UI</strong> - For consistent and accessible UI
                components
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                <strong>Node.js</strong> - For server-side processing
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              We prioritize performance, accessibility, and user experience in
              everything we build.
            </Typography>
          </Box>

          <Box aria-labelledby="contact-heading" role="region">
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, fontSize: "1.8rem" }}
              id="contact-heading"
            >
              Get in Touch
            </Typography>
            <Typography variant="body1" paragraph>
              Have questions, suggestions, or feedback? We'd love to hear from
              you! Visit our{" "}
              <a href="/contact" aria-label="Contact page">
                Contact page
              </a>{" "}
              or connect with us on:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <Typography component="li" variant="body1">
                <a
                  href="https://twitter.com/kodekit"
                  aria-label="KodeKit Twitter profile"
                >
                  Twitter
                </a>
              </Typography>
              <Typography component="li" variant="body1">
                <a href="https://kodekit.in/contact" aria-label="Email KodeKit">
                  Contact
                </a>
              </Typography>
            </Box>
          </Box>

          {isProductionEnv && (
            <AdSense
              adSlot="6613251015"
              aria-label="Advertisement"
              role="complementary"
            />
          )}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default About;
