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
  Chip,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  Home,
  Info,
  ContactMail,
  Category,
  Build,
  TextFields,
  Palette,
  Code,
  PictureAsPdf,
  Description,
  Launch,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import AdSense from "../components/AdSense";

const Sitemap = () => {
  const theme = useTheme();
  const isProductionEnv = import.meta.env.PROD;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Main pages data
  const mainPages = [
    {
      title: "Home",
      path: "/",
      icon: <Home />,
      description: "Main landing page with all tools and features",
      priority: "1.0",
      changefreq: "daily",
    },
    {
      title: "About",
      path: "/about",
      icon: <Info />,
      description: "Learn about KodeKit's mission and technology",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      title: "Contact",
      path: "/contact",
      icon: <ContactMail />,
      description: "Get in touch with the KodeKit team",
      priority: "0.7",
      changefreq: "monthly",
    },
    {
      title: "Sitemap",
      path: "/sitemap",
      icon: <Description />,
      description: "Complete site structure and navigation",
      priority: "0.6",
      changefreq: "weekly",
    },
  ];

  // Tool categories data
  const categories = [
    {
      title: "PDF Tools",
      path: "/category/pdf",
      icon: <PictureAsPdf />,
      description:
        "Tools for PDF manipulation, merging, splitting, and conversion",
      color: "error",
      tools: ["PDF Merger", "PDF Splitter", "PDF Converter", "PDF Compressor"],
    },
    {
      title: "Text Tools",
      path: "/category/text",
      icon: <TextFields />,
      description:
        "Tools for formatting, analyzing and transforming text content",
      color: "primary",
      tools: [
        "Text Formatter",
        "Word Counter",
        "Case Converter",
        "Text Analyzer",
      ],
    },
    {
      title: "Design Tools",
      path: "/category/design",
      icon: <Palette />,
      description: "Tools for creating and editing visual content",
      color: "secondary",
      tools: [
        "Color Picker",
        "Image Resizer",
        "Logo Generator",
        "Icon Creator",
      ],
    },
    {
      title: "Developer Tools",
      path: "/category/developer",
      icon: <Code />,
      description: "Essential tools for developers and programmers",
      color: "success",
      tools: [
        "Code Formatter",
        "JSON Validator",
        "Base64 Encoder",
        "Hash Generator",
      ],
    },
  ];

  // Popular tools data
  const popularTools = [
    { title: "PDF Merger", path: "/pdf-merger", category: "PDF" },
    { title: "PDF Splitter", path: "/pdf-splitter", category: "PDF" },
    { title: "Text Formatter", path: "/text-formatter", category: "Text" },
    { title: "Color Picker", path: "/color-picker", category: "Design" },
    { title: "JSON Validator", path: "/json-validator", category: "Developer" },
    { title: "Base64 Encoder", path: "/base64-encoder", category: "Developer" },
  ];

  // JSON-LD structured data for Sitemap
  const sitemapJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "KodeKit Sitemap - Complete Site Navigation",
    description:
      "Complete sitemap of KodeKit showing all available tools, categories, and pages for easy navigation.",
    url: "https://kodekit.in/sitemap",
    mainEntity: {
      "@type": "SiteNavigationElement",
      name: "KodeKit Navigation",
      url: "https://kodekit.in/sitemap",
    },
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      aria-label="KodeKit Sitemap - Complete Site Navigation"
    >
      <Helmet>
        <title>
          Sitemap - KodeKit | Complete Site Navigation & Tool Directory
        </title>
        <meta
          name="description"
          content="Complete sitemap of KodeKit showing all available developer tools, categories, and pages. Easy navigation to PDF tools, text processors, design utilities, and more."
        />
        <meta
          name="keywords"
          content="KodeKit sitemap, site navigation, developer tools directory, PDF tools, text tools, design tools, web tools index"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://kodekit.in/sitemap" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Sitemap - KodeKit | Complete Site Navigation"
        />
        <meta
          property="og:description"
          content="Complete sitemap of KodeKit showing all available tools and pages."
        />
        <meta property="og:url" content="https://kodekit.in/sitemap" />
        <meta property="og:image" content="https://kodekit.in/og-image.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Sitemap - KodeKit | Complete Site Navigation"
        />
        <meta
          name="twitter:description"
          content="Complete sitemap of KodeKit showing all available tools and pages."
        />
        <meta name="twitter:image" content="https://kodekit.in/og-image.jpg" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(sitemapJsonLd)}
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
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
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
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Site Map
              </Typography>
            </motion.div>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: 400 }}
            >
              Complete navigation guide to all KodeKit tools and pages
            </Typography>
          </Box>

          {isProductionEnv && <AdSense adSlot="6613251015" />}

          {/* Main Pages Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
              >
                Main Pages
              </Typography>

              <Grid container spacing={3}>
                {mainPages.map((page, index) => (
                  <Grid item xs={12} sm={6} md={3} key={page.path}>
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    >
                      <Card
                        elevation={3}
                        sx={{
                          height: "100%",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, textAlign: "center" }}>
                          <Box
                            sx={{ mb: 2, color: theme.palette.primary.main }}
                          >
                            {page.icon}
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {page.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {page.description}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            sx={{ mb: 2 }}
                          >
                            <Chip
                              label={`Priority: ${page.priority}`}
                              size="small"
                              color="primary"
                            />
                            <Chip
                              label={page.changefreq}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                          <Button
                            component={Link}
                            to={page.path}
                            variant="outlined"
                            size="small"
                            endIcon={<Launch />}
                            sx={{ textTransform: "none" }}
                          >
                            Visit Page
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          <Divider sx={{ my: 6 }} />

          {/* Tool Categories Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
              >
                Tool Categories
              </Typography>

              <Grid container spacing={4}>
                {categories.map((category, index) => (
                  <Grid item xs={12} md={6} key={category.path}>
                    <motion.div
                      initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 1.0 + index * 0.2 }}
                    >
                      <Card
                        elevation={3}
                        sx={{
                          height: "100%",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: theme.shadows[8],
                          },
                          background: `linear-gradient(135deg, ${
                            theme.palette[
                              category.color as keyof typeof theme.palette
                            ].main
                          }08, ${
                            theme.palette[
                              category.color as keyof typeof theme.palette
                            ].main
                          }03)`,
                          border: `1px solid ${
                            theme.palette[
                              category.color as keyof typeof theme.palette
                            ].main
                          }20`,
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 3,
                            }}
                          >
                            <Box
                              sx={{
                                mr: 2,
                                color:
                                  theme.palette[
                                    category.color as keyof typeof theme.palette
                                  ].main,
                              }}
                            >
                              {category.icon}
                            </Box>
                            <Typography variant="h5" fontWeight="bold">
                              {category.title}
                            </Typography>
                          </Box>

                          <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                          >
                            {category.description}
                          </Typography>

                          <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            sx={{ mb: 2 }}
                          >
                            Available Tools:
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                            gap={1}
                            sx={{ mb: 3 }}
                          >
                            {category.tools.map((tool) => (
                              <Chip
                                key={tool}
                                label={tool}
                                size="small"
                                variant="outlined"
                                color={category.color as any}
                              />
                            ))}
                          </Stack>

                          <Button
                            component={Link}
                            to={category.path}
                            variant="contained"
                            color={category.color as any}
                            endIcon={<Launch />}
                            sx={{ textTransform: "none" }}
                          >
                            Explore {category.title}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          <Divider sx={{ my: 6 }} />

          {/* Popular Tools Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
              >
                Popular Tools
              </Typography>

              <Grid container spacing={2}>
                {popularTools.map((tool, index) => (
                  <Grid item xs={12} sm={6} md={4} key={tool.path}>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                    >
                      <Card
                        elevation={2}
                        sx={{
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: theme.shadows[6],
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                          >
                            {tool.title}
                          </Typography>
                          <Chip
                            label={tool.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 2 }}
                          />
                          <br />
                          <Button
                            component={Link}
                            to={tool.path}
                            variant="text"
                            size="small"
                            endIcon={<Launch />}
                            sx={{ textTransform: "none" }}
                          >
                            Use Tool
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Footer Note */}
          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              p: 3,
              bgcolor: theme.palette.info,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              This sitemap is automatically updated to reflect the latest tools
              and pages available on KodeKit. For technical sitemap information,
              visit{" "}
              <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                sitemap.xml
              </a>
            </Typography>
          </Box>

          {isProductionEnv && <AdSense adSlot="6613251015" />}
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Sitemap;
