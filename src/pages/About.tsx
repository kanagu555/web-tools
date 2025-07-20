import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import {
  Code,
  Palette,
  Speed,
  Security,
  GitHub,
  Twitter,
  LinkedIn,
  Mail,
  GpsFixed,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import { Zap } from "lucide-react";

const About = () => {
  const theme = useTheme();
  const isProductionEnv = import.meta.env.PROD;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Team members data
  // const teamMembers = [
  //   {
  //     name: "Development Team",
  //     role: "Full-Stack Engineers",
  //     avatar: "👨‍💻",
  //     description: "Passionate developers building the future of web tools",
  //   },
  //   {
  //     name: "Design Team",
  //     role: "UI/UX Designers",
  //     avatar: "🎨",
  //     description: "Creating beautiful and intuitive user experiences",
  //   },
  //   {
  //     name: "Community Team",
  //     role: "Developer Relations",
  //     avatar: "🤝",
  //     description: "Connecting with users and gathering feedback",
  //   },
  // ];

  // Technology stack data
  // const technologies = [
  //   { name: "React", icon: "⚛️", description: "Interactive user interfaces" },
  //   { name: "TypeScript", icon: "📘", description: "Type-safe development" },
  //   {
  //     name: "Material-UI",
  //     icon: "🎨",
  //     description: "Consistent UI components",
  //   },
  //   { name: "Vite", icon: "⚡", description: "Fast build tooling" },
  //   { name: "PDF-lib", icon: "📄", description: "PDF manipulation" },
  //   { name: "Node.js", icon: "🟢", description: "Server-side processing" },
  // ];

  // Company milestones
  // const milestones = [
  //   {
  //     year: "2023",
  //     title: "KodeKit Founded",
  //     description: "Started with a vision to simplify developer workflows",
  //   },
  //   {
  //     year: "2024",
  //     title: "Tool Expansion",
  //     description: "Added PDF tools, text processors, and design utilities",
  //   },
  //   {
  //     year: "2024",
  //     title: "Community Growth",
  //     description: "Reached thousands of active users worldwide",
  //   },
  //   {
  //     year: "2025",
  //     title: "Future Vision",
  //     description: "Expanding with AI-powered tools and integrations",
  //   },
  // ];

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

  // JSON-LD structured data for Organization
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KodeKit",
    url: "https://kodekit.in",
    logo: "https://kodekit.in/og-image.jpg",
    sameAs: [
      "https://x.com/kodekit_in",
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
                  icon={<Code size={16} />}
                  label="Developer Tools"
                  variant="outlined"
                  color="primary"
                />
                <Chip
                  icon={<Palette size={16} />}
                  label="Design Utilities"
                  variant="outlined"
                  color="secondary"
                />
                <Chip
                  icon={<Speed size={16} />}
                  label="Fast & Efficient"
                  variant="outlined"
                  color="success"
                />
                <Chip
                  icon={<Security size={16} />}
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
                  sx={{ textAlign: "center", p: 2, height: "100%" }}
                >
                  <CardContent>
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      50+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Developer Tools
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={2}
                  sx={{ textAlign: "center", p: 2, height: "100%" }}
                >
                  <CardContent>
                    <Typography
                      variant="h3"
                      color="secondary"
                      fontWeight="bold"
                    >
                      10K+
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Users
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={2}
                  sx={{ textAlign: "center", p: 2, height: "100%" }}
                >
                  <CardContent>
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
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card
                  elevation={2}
                  sx={{ textAlign: "center", p: 2, height: "100%" }}
                >
                  <CardContent>
                    <Typography
                      variant="h3"
                      color="info.main"
                      fontWeight="bold"
                    >
                      24/7
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Available
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          {isProductionEnv && <AdSense adSlot="6613251015" />}

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
                        <Security size={32} />
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
                paragraph
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
                      p: 3,
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[8],
                      },
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.primary.main}03)`,
                      border: `1px solid ${theme.palette.primary.main}20`,
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
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
                      Modern JavaScript library for building interactive and
                      dynamic user interfaces with component-based architecture
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 3,
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[8],
                      },
                      background: `linear-gradient(135deg, ${theme.palette.info.main}08, ${theme.palette.info.main}03)`,
                      border: `1px solid ${theme.palette.info.main}20`,
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        📘
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        TypeScript
                      </Typography>
                      <Chip
                        label="Language"
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
                      Strongly typed programming language that builds on
                      JavaScript, providing better tooling and error detection
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 3,
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[8],
                      },
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}08, ${theme.palette.secondary.main}03)`,
                      border: `1px solid ${theme.palette.secondary.main}20`,
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        🎨
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Material-UI
                      </Typography>
                      <Chip
                        label="UI Framework"
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
                      React component library implementing Google's Material
                      Design for consistent and accessible UI components
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 3,
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[8],
                      },
                      background: `linear-gradient(135deg, ${theme.palette.warning.main}08, ${theme.palette.warning.main}03)`,
                      border: `1px solid ${theme.palette.warning.main}20`,
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        ⚡
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Vite
                      </Typography>
                      <Chip
                        label="Build Tool"
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
                      Next-generation frontend build tool providing
                      lightning-fast development server and optimized production
                      builds
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 3,
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[8],
                      },
                      background: `linear-gradient(135deg, ${theme.palette.error.main}08, ${theme.palette.error.main}03)`,
                      border: `1px solid ${theme.palette.error.main}20`,
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        📄
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        PDF-lib
                      </Typography>
                      <Chip
                        label="Library"
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
                      Powerful JavaScript library for creating, modifying, and
                      manipulating PDF documents directly in the browser
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Card
                    elevation={3}
                    sx={{
                      p: 3,
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: theme.shadows[8],
                      },
                      background: `linear-gradient(135deg, ${theme.palette.success.main}08, ${theme.palette.success.main}03)`,
                      border: `1px solid ${theme.palette.success.main}20`,
                    }}
                  >
                    <Box sx={{ textAlign: "center", mb: 2 }}>
                      <Typography variant="h2" sx={{ mb: 1 }}>
                        🟢
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Node.js
                      </Typography>
                      <Chip
                        label="Runtime"
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
                      JavaScript runtime environment enabling server-side
                      development and build processes for our applications
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ textAlign: "center", mt: 6 }}>
                <Typography variant="h6" gutterBottom fontWeight="600">
                  Our Development Principles
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="center"
                  flexWrap="wrap"
                  gap={2}
                  sx={{ mt: 3 }}
                >
                  <Chip
                    icon={<Speed />}
                    label="Performance First"
                    variant="filled"
                    color="primary"
                    sx={{ fontSize: "0.9rem", py: 2 }}
                  />
                  <Chip
                    icon={<Security />}
                    label="Privacy & Security"
                    variant="filled"
                    color="secondary"
                    sx={{ fontSize: "0.9rem", py: 2 }}
                  />
                  <Chip
                    icon={<Palette />}
                    label="User Experience"
                    variant="filled"
                    color="success"
                    sx={{ fontSize: "0.9rem", py: 2 }}
                  />
                  <Chip
                    icon={<Code />}
                    label="Clean Code"
                    variant="filled"
                    color="info"
                    sx={{ fontSize: "0.9rem", py: 2 }}
                  />
                </Stack>
              </Box>
            </Box>
          </motion.div>

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
            <Typography variant="body1" paragraph sx={{ mb: 4 }}>
              Have questions, suggestions, or feedback? We'd love to hear from
              you! Connect with us through any of these channels:
            </Typography>

            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
              gap={2}
            >
              <Button
                variant="outlined"
                startIcon={<Mail />}
                href="/contact"
                aria-label="Contact KodeKit"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Contact Us
              </Button>

              <Button
                variant="outlined"
                startIcon={<Twitter />}
                href="https://x.com/kodekit_in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow KodeKit on Twitter"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                Twitter
              </Button>

              <Button
                variant="outlined"
                startIcon={<GitHub />}
                href="https://github.com/kanagu555/kode-kit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View KodeKit on GitHub"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                GitHub
              </Button>

              <Button
                variant="outlined"
                startIcon={<LinkedIn />}
                href="https://linkedin.com/company/kodekit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with KodeKit on LinkedIn"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                LinkedIn
              </Button>
            </Stack>
          </Box>

          {isProductionEnv && <AdSense adSlot="6613251015" />}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default About;
