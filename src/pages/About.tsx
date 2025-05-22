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

const About = () => {
  const theme = useTheme();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
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
        </Paper>
      </motion.div>
    </Container>
  );
};

export default About;
