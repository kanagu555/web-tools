"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
} from "@mui/material";
import { Coffee } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero: React.FC = () => {
  const theme = useTheme();

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

  const handleBuyMeACoffeeClick = () => {
    window.open("http://buymeacoffee.com/kanagarajwn", "_blank");
  };

  return (
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
      {/* Grid pattern background */}
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

      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}20 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}20 0%, transparent 50%)`,
          zIndex: 0,
        }}
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
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      "&:hover": {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        transform: "translateY(-2px)",
                        boxShadow: 4,
                      },
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    Explore Tools
                  </Button>
                  
                  <Button
                    component={Link}
                    href="/category/pdf"
                    variant="outlined"
                    color="primary"
                    size="large"
                    aria-label="View popular PDF tools"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      minWidth: { xs: "100%", sm: "auto" },
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                        transform: "translateY(-2px)",
                        boxShadow: 2,
                      },
                      transition: "all 0.3s ease-in-out",
                    }}
                  >
                    Popular PDF Tools
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleBuyMeACoffeeClick}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      minWidth: { xs: "100%", sm: "auto" },
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 1,
                      backgroundColor: "#FFDD00",
                      color: "#000000",
                      borderRadius: 2,
                      fontSize: "0.875rem",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(255, 221, 0, 0.3)",
                      "&:hover": {
                        backgroundColor: "#FFD700",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(255, 221, 0, 0.4)",
                      },
                    }}
                    aria-label="Support KodeKit on Buy Me a Coffee"
                    startIcon={<Coffee size={20} />}
                  >
                    Support Us
                  </Button>
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
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                      }}
                      aria-hidden="true"
                    >
                      <Typography variant="body2" color="text.secondary">
                        🔧 Developer Tools
                      </Typography>
                    </Box>
                    {[
                      { icon: "📄", text: "PDF Converter" },
                      { icon: "🎨", text: "Image Editor" },
                      { icon: "💻", text: "Code Formatter" },
                    ].map((item, i) => (
                      <Box
                        key={i}
                        sx={{
                          height: "60px",
                          background: `${theme.palette.background.default}90`,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          px: 2,
                          gap: 2,
                        }}
                        aria-hidden="true"
                      >
                        <Typography variant="h6">{item.icon}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Hero;
