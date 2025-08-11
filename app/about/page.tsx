"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Grid,
  Card,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import { Code, Palette, Speed, Security, GpsFixed } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";
import { debug, logEnvironmentInfo } from "@/lib/utils/debug";

export default function About() {
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Comprehensive environment logging for production debugging
    console.group("🔧 Environment Variables & System Info");

    // Log all environment variables that start with NEXT_PUBLIC_
    console.info("📊 Public Environment Variables:");
    Object.keys(process.env)
      .filter((key) => key.startsWith("NEXT_PUBLIC_"))
      .forEach((key) => {
        console.info(`  ${key}:`, process.env[key]);
      });

    // Log Node environment
    console.info("🌍 Node Environment:", process.env.NODE_ENV);

    // Log build info
    console.info("🏗️ Build Info:", {
      nextVersion: process.env.NEXT_RUNTIME || "unknown",
      vercelEnv: process.env.VERCEL_ENV || "local",
      vercelUrl: process.env.VERCEL_URL || "localhost",
    });

    // Log browser info
    console.info("🌐 Browser Info:", {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
    });

    // Log current URL and referrer
    console.info("🔗 Page Info:", {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
    });

    // Log performance info if available
    if (performance && performance.timing) {
      const timing = performance.timing;
      console.info("⚡ Performance Timing:", {
        domContentLoaded:
          timing.domContentLoadedEventEnd - timing.navigationStart,
        pageLoad: timing.loadEventEnd - timing.navigationStart,
        dnsLookup: timing.domainLookupEnd - timing.domainLookupStart,
      });
    }

    console.groupEnd();

    // Alternative using debug utility
    debug.info("About page loaded");
    logEnvironmentInfo();
  }, []);

  // FAQ data
  const faqs = [
    {
      id: "what-is-kodekit",
      question: "What is KodeKit?",
      answer:
        "KodeKit is an all-in-one toolkit for developers, designers, and content creators that provides a comprehensive set of tools to streamline workflows and boost productivity. All tools work directly in your browser without requiring downloads or installations.",
    },
    {
      id: "is-it-free",
      question: "Is KodeKit free to use?",
      answer:
        "Yes! KodeKit is completely free to use. We believe in making powerful tools accessible to everyone in the developer community.",
    },
    {
      id: "data-privacy",
      question: "How do you handle my data?",
      answer:
        "Your privacy is our priority. All processing happens locally in your browser - we don't store or transmit your files to our servers. Your data stays with you.",
    },
    {
      id: "browser-support",
      question: "Which browsers are supported?",
      answer:
        "KodeKit works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for the best experience.",
    },
    {
      id: "feature-requests",
      question: "Can I request new features?",
      answer:
        "Absolutely! We love hearing from our community. You can submit feature requests through our contact page or GitHub repository.",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      aria-label="About KodeKit - Developer Toolkit Information"
    >
      <Navigation />

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
          {/* Hero Section */}
          <Box
            sx={{ textAlign: "center", mb: 8 }}
            aria-labelledby="about-heading about-subtitle"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.primary.dark})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
                id="about-heading"
              >
                About KodeKit
              </Typography>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                id="about-subtitle"
                sx={{ mb: 4, fontWeight: 400 }}
              >
                Empowering developers, designers, and creators with powerful
                tools
              </Typography>
            </motion.div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                flexWrap="wrap"
                gap={2}
              >
                <Chip
                  icon={<Code fontSize="small" />}
                  label="Developer Tools"
                  variant="outlined"
                  color="primary"
                />
                <Chip
                  icon={<Palette fontSize="small" />}
                  label="Design Utilities"
                  variant="outlined"
                  color="secondary"
                />
                <Chip
                  icon={<Speed fontSize="small" />}
                  label="Fast & Efficient"
                  variant="outlined"
                  color="success"
                />
                <Chip
                  icon={<Security fontSize="small" />}
                  label="Privacy First"
                  variant="outlined"
                  color="info"
                />
              </Stack>
            </motion.div>
          </Box>

          {/* Statistics Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Grid container spacing={4} sx={{ mb: 8 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={2}
                  sx={{
                    textAlign: "center",
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
                    border: `1px solid ${theme.palette.primary.main}20`,
                  }}
                >
                  <Typography variant="h3" color="primary" fontWeight="bold">
                    50+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tools Available
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={2}
                  sx={{
                    textAlign: "center",
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main}15, ${theme.palette.secondary.main}05)`,
                    border: `1px solid ${theme.palette.secondary.main}20`,
                  }}
                >
                  <Typography variant="h3" color="secondary" fontWeight="bold">
                    100K+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Users
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={2}
                  sx={{
                    textAlign: "center",
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.success.main}15, ${theme.palette.success.main}05)`,
                    border: `1px solid ${theme.palette.success.main}20`,
                  }}
                >
                  <Typography
                    variant="h3"
                    color="success.main"
                    fontWeight="bold"
                  >
                    99.9%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uptime
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={2}
                  sx={{
                    textAlign: "center",
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.warning.main}15, ${theme.palette.warning.main}05)`,
                    border: `1px solid ${theme.palette.warning.main}20`,
                  }}
                >
                  <Typography
                    variant="h3"
                    color="warning.main"
                    fontWeight="bold"
                  >
                    24/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          <AdSense adSlot="6613251015" />

          {/* Mission Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Box
              sx={{ mb: 8 }}
              aria-labelledby="mission-heading"
              role="region"
              itemScope
              itemType="https://schema.org/AboutPage"
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 3 }}
                    id="mission-heading"
                  >
                    Our Mission
                  </Typography>
                  <Typography
                    variant="h6"
                    paragraph
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Empowering creativity through accessible, powerful tools
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    itemProp="description"
                    sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                  >
                    KodeKit was born from a simple belief: the right tools can
                    transform how we create, develop, and innovate. We're
                    building a comprehensive ecosystem where developers,
                    designers, and content creators can find everything they
                    need to bring their ideas to life.
                  </Typography>
                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                  >
                    Our platform eliminates the friction between having an idea
                    and executing it, providing instant access to
                    professional-grade tools that work seamlessly across all
                    devices and platforms.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: "center" }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: "auto",
                        mb: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        fontSize: "3rem",
                      }}
                    >
                      <GpsFixed sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      Vision 2025
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Leading the future of web-based development tools
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {/* Key Features Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Box
              sx={{ mb: 8 }}
              aria-labelledby="features-heading"
              role="region"
            >
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: "2.2rem",
                  textAlign: "center",
                  mb: 4,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                id="features-heading"
              >
                Why Choose KodeKit?
              </Typography>

              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: theme.palette.primary.main,
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <Security sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Typography variant="h5" fontWeight="600" gutterBottom>
                        Privacy First
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      textAlign="center"
                    >
                      All processing happens in your browser. Your files never
                      leave your device, ensuring complete privacy and security.
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: theme.palette.secondary.main,
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <Zap size={32} />
                      </Avatar>
                      <Typography variant="h5" fontWeight="600" gutterBottom>
                        Lightning Fast
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Optimized for speed with modern web technologies. Get your
                      work done quickly without waiting for uploads or
                      downloads.
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: theme.palette.success.main,
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <GpsFixed sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Typography variant="h5" fontWeight="600" gutterBottom>
                        Always Free
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Core tools are completely free to use. No hidden fees, no
                      subscriptions, no limits on basic functionality.
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Box
              sx={{ mb: 6 }}
              aria-labelledby="team-heading"
              role="region"
              itemScope
              itemType="https://schema.org/Organization"
            >
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 3 }}
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
              <Typography variant="body1" paragraph>
                Our team combines years of experience in web development, user
                experience design, and software engineering to create tools that
                are not only powerful but also intuitive and accessible to
                everyone.
              </Typography>
            </Box>
          </motion.div>

          {/* Technology Stack Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <Box
              sx={{ mb: 8 }}
              aria-labelledby="technology-heading"
              role="region"
            >
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  fontSize: "2.2rem",
                  textAlign: "center",
                  mb: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                id="technology-heading"
              >
                Our Technology Stack
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 5 }}
              >
                Built with modern, cutting-edge technologies for optimal
                performance
              </Typography>

              <Grid container spacing={3}>
                {/* Frontend Technologies */}
                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      textAlign: "center",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        ⚛️
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        React
                      </Typography>
                      <Chip
                        label="Frontend"
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Modern JavaScript library for building interactive user
                      interfaces with component-based architecture
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      textAlign: "center",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        📘
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        TypeScript
                      </Typography>
                      <Chip
                        label="Language"
                        size="small"
                        color="secondary"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Strongly typed programming language that builds on
                      JavaScript for better development experience
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      textAlign: "center",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        🎨
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Material-UI
                      </Typography>
                      <Chip
                        label="UI Library"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      React component library implementing Google's Material
                      Design for consistent and accessible UI components
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      textAlign: "center",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        ⚡
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Next.js
                      </Typography>
                      <Chip
                        label="Framework"
                        size="small"
                        color="info"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Full-stack React framework with server-side rendering,
                      routing, and optimization features
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      textAlign: "center",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        📄
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        PDF-lib
                      </Typography>
                      <Chip
                        label="Library"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Powerful JavaScript library for creating and modifying PDF
                      documents in web browsers
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 4,
                      height: "100%",
                      textAlign: "center",
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h2" sx={{ mb: 2 }}>
                        🎭
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Framer Motion
                      </Typography>
                      <Chip
                        label="Animation"
                        size="small"
                        color="error"
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Production-ready motion library for React with smooth
                      animations and gestures
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <Box sx={{ mb: 8 }} aria-labelledby="faq-heading" role="region">
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4 }}
                id="faq-heading"
              >
                Frequently Asked Questions
              </Typography>

              <Grid container spacing={3}>
                {faqs.map((faq) => (
                  <Grid item xs={12} key={faq.id}>
                    <Card
                      elevation={1}
                      sx={{
                        p: 3,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          boxShadow: theme.shadows[4],
                        },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="600"
                        gutterBottom
                        color="primary"
                      >
                        {faq.question}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {faq.answer}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        </Paper>
      </motion.div>
    </Container>
  );
}
