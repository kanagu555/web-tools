import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import SearchBar from "./SearchBar";
import AdSense from "../components/AdSense";

const Hero = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  // const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isProductionEnv = import.meta.env.PROD;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const handleExploreClick = () => {
    const toolCategoriesSection = document.getElementById("tool-categories");
    if (toolCategoriesSection) {
      toolCategoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHowItWorksClick = () => {
    navigate("/how-it-works");
  };

  return (
    <>
      <Helmet>
        <title>
          KodeKit - All-in-One Developer Toolkit | Free Online Tools
        </title>
        <meta
          name="description"
          content="Free online developer tools for PDF conversion, text formatting, code processing, and more. No installation required. Boost your productivity with KodeKit."
        />
        <meta
          name="keywords"
          content="developer tools, online tools, PDF converter, text formatter, code beautifier, image processor, free tools, web utilities"
        />
        <meta name="author" content="KodeKit Team" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="KodeKit - All-in-One Developer Toolkit | Free Online Tools"
        />
        <meta
          property="og:description"
          content="Free online developer tools for PDF conversion, text formatting, code processing, and more. No installation required."
        />
        <meta property="og:url" content="https://kodekit.in" />
        <meta property="og:image" content="https://kodekit.in/og-image.jpg" />
        <meta property="og:site_name" content="KodeKit" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="KodeKit - All-in-One Developer Toolkit | Free Online Tools"
        />
        <meta
          name="twitter:description"
          content="Free online developer tools for PDF conversion, text formatting, code processing, and more. No installation required."
        />
        <meta name="twitter:image" content="https://kodekit.in/og-image.jpg" />
        <meta name="twitter:creator" content="@kodekit" />

        {/* Canonical and alternate links */}
        <link rel="canonical" href="https://kodekit.in" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Box
        component="section"
        role="banner"
        aria-label="Main hero section introducing KodeKit developer tools"
        sx={{
          position: "relative",
          backgroundImage: `radial-gradient(ellipse at top, ${theme.palette.primary.dark}15, transparent 70%)`,
          pt: { xs: 4, sm: 8, md: 12 },
          pb: { xs: 6, sm: 10, md: 14 },
          overflow: "hidden",
        }}
      >
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "KodeKit",
              description:
                "All-in-One Developer Toolkit with PDF tools, text formatters, design tools, and more. Free online tools for developers and designers.",
              url: "https://kodekit.in",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "KodeKit",
                url: "https://kodekit.in",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                reviewCount: "1250",
              },
              featureList: [
                "PDF Converter and Editor",
                "Text Formatting Tools",
                "Image Processing",
                "Code Formatters",
                "Unit Converters",
                "Color Palette Generator",
                "QR Code Generator",
                "Password Generator",
              ],
            }),
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1 }}>
          {isProductionEnv && (
            <AdSense
              adSlot="2209979291"
              width="100%"
              height={60}
              style={{
                maxWidth: 1140,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              aria-label="Advertisement"
            />
          )}
        </Box>

        {/* Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
            opacity: 0.05,
            backgroundSize: "20px 20px",
            backgroundImage: `linear-gradient(to right, ${theme.palette.primary.main} 1px, transparent 1px), 
                             linear-gradient(to bottom, ${theme.palette.primary.main} 1px, transparent 1px)`,
          }}
          aria-hidden="true"
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontWeight: 800,
                      mb: 2,
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      textAlign: { xs: "center", md: "left" },
                      fontSize: { xs: "2.5rem", sm: "3rem", md: "3.5rem" },
                      lineHeight: 1.2,
                    }}
                  >
                    All-in-One Toolkit for Developers
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h2"
                    component="h2"
                    color="textSecondary"
                    sx={{
                      mb: 4,
                      lineHeight: 1.6,
                      textAlign: { xs: "center", md: "left" },
                      fontSize: { xs: "1.25rem", md: "1.5rem" },
                      fontWeight: 400,
                    }}
                  >
                    Transform, convert, and optimize your files with our free
                    online tools. No installation or registration required.
                    Perfect for developers, designers, and content creators.
                  </Typography>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      mb: 4,
                      justifyContent: { xs: "center", md: "flex-start" },
                      gap: 2,
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={handleExploreClick}
                      aria-label="Explore developer tools and utilities"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
                        minWidth: { xs: "100%", sm: "auto" },
                      }}
                    >
                      Explore Tools
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      onClick={handleHowItWorksClick}
                      aria-label="Learn how KodeKit tools work"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        minWidth: { xs: "100%", sm: "auto" },
                      }}
                    >
                      How It Works
                    </Button>
                  </Box>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Box role="search" aria-label="Search for developer tools">
                    <SearchBar />
                  </Box>
                </motion.div>
              </Grid>

              <Grid
                item
                xs={12}
                md={5}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                    delay: 0.6,
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      height: "400px",
                      width: "100%",
                      background: theme.palette.background.paper,
                      borderRadius: 4,
                      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.2)`,
                      overflow: "hidden",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "40px",
                        background: theme.palette.background.default,
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: theme.palette.error.main,
                        boxShadow: `20px 0 0 ${theme.palette.warning.main}, 40px 0 0 ${theme.palette.success.main}`,
                      },
                    }}
                    role="img"
                    aria-label="KodeKit developer tools interface preview showing various utility options"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: "60px",
                        left: "20px",
                        right: "20px",
                        bottom: "20px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          height: "60px",
                          background: `linear-gradient(90deg, ${theme.palette.primary.main}40, ${theme.palette.secondary.main}40)`,
                          borderRadius: 2,
                        }}
                        aria-hidden="true"
                      />
                      {[1, 2, 3].map((i) => (
                        <Box
                          key={i}
                          sx={{
                            height: "60px",
                            background: `${theme.palette.background.default}90`,
                            borderRadius: 2,
                          }}
                          aria-hidden="true"
                        />
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>
    </>
  );
};

export default Hero;
