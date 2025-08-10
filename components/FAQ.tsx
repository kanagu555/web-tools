"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Divider,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { motion } from "framer-motion";

const FAQ = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // FAQ data adapted for your web tools project
  const faqs = [
    {
      question: "What is this web tools collection?",
      answer:
        "This is a comprehensive collection of web-based utility tools designed to help developers, designers, and content creators with their daily tasks. All tools run directly in your browser for maximum privacy and convenience.",
      category: "general",
    },
    {
      question: "Are these tools free to use?",
      answer:
        "Yes, all tools are completely free to use. We believe in providing high-quality utilities accessible to everyone without any cost barriers or registration requirements.",
      category: "general",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No account creation is required. You can start using any tool immediately without any registration process. Simply visit the tool page and start working.",
      category: "general",
    },
    {
      question: "How do the PDF tools work?",
      answer:
        "Our PDF tools (merger, splitter, compressor, converter) process files directly in your browser using JavaScript libraries. Your files never leave your computer, ensuring complete privacy and security.",
      category: "tools",
    },
    {
      question: "Are my files secure when using these tools?",
      answer:
        "Yes, all file processing happens locally in your browser. We don't upload, store, or transmit your files to any server. Your data remains completely private and secure on your device.",
      category: "privacy",
    },
    {
      question: "What types of tools are available?",
      answer:
        "We offer tools across multiple categories: PDF tools (merge, split, compress), Text tools (word count, case converter), Design tools (color picker, image resizer), Developer tools (JSON formatter, Base64 encoder), Math tools (calculators), Finance tools (loan calculator, SIP calculator), Healthcare tools (BMI calculator), and Time tools (converters, timers).",
      category: "tools",
    },
    {
      question: "Are there any file size limits?",
      answer:
        "While there are no strict file size limits, we recommend keeping files reasonably sized for optimal performance since all processing happens in your browser. Very large files may slow down processing or cause memory issues.",
      category: "tools",
    },
    {
      question: "Can I use these tools offline?",
      answer:
        "Most tools work offline once the page is loaded, as they run entirely in your browser. However, you'll need an internet connection to initially access the website and load the tool pages.",
      category: "tools",
    },
    {
      question: "How can I report bugs or request features?",
      answer:
        "You can contact us through the contact page or reach out via email. We welcome bug reports, feature requests, and suggestions for new tools to add to our collection.",
      category: "support",
    },
    {
      question: "Are these tools mobile-friendly?",
      answer:
        "Yes, all tools are designed to be responsive and work well on mobile devices, tablets, and desktops. The interface adapts to different screen sizes for optimal usability.",
      category: "general",
    },
    {
      question: "Can I contribute to this project?",
      answer:
        "We welcome contributions! If you're a developer interested in adding new tools or improving existing ones, please reach out through our contact page. We're always looking for ways to expand and improve our tool collection.",
      category: "development",
    },
    {
      question: "How often are new tools added?",
      answer:
        "We regularly add new tools based on user feedback and demand. Follow our updates or check back periodically to discover new utilities that can help streamline your workflow.",
      category: "development",
    },
  ];

  // Define categories for filtering
  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General" },
    { id: "tools", label: "Tools" },
    { id: "privacy", label: "Privacy & Security" },
    { id: "support", label: "Support" },
    { id: "development", label: "Development" },
  ];

  // Filter FAQs based on search term and active category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm) ||
      faq.answer.toLowerCase().includes(searchTerm);
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        py: 6,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(0,0,0,0.2)"
            : "rgba(0,0,0,0.02)",
        minHeight: "calc(100vh - 64px)",
      }}
      role="main"
      aria-label="Frequently Asked Questions"
    >
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
            textAlign: "center",
          }}
          aria-labelledby="faq-heading faq-subtitle"
        >
          <QuestionAnswerIcon
            sx={{
              fontSize: 60,
              color: "primary.main",
              mb: 2,
            }}
            aria-hidden="true"
          />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ mb: 2 }}
            id="faq-heading"
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 600, mb: 4 }}
            id="faq-subtitle"
          >
            Find answers to common questions about our web tools and services.
          </Typography>

          {/* Search box */}
          <Paper
            elevation={1}
            sx={{
              p: 0.5,
              display: "flex",
              width: "100%",
              maxWidth: 500,
              mb: 4,
              borderRadius: 2,
            }}
            role="search"
          >
            <TextField
              fullWidth
              placeholder="Search questions..."
              variant="standard"
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search FAQ questions"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" aria-hidden="true" />
                  </InputAdornment>
                ),
                sx: { px: 1, py: 0.5 },
              }}
            />
          </Paper>

          {/* Category filters */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mb: 4,
              width: "100%",
            }}
            role="tablist"
            aria-label="FAQ categories"
          >
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.label}
                onClick={() => handleCategoryChange(category.id)}
                color={activeCategory === category.id ? "primary" : "default"}
                variant={
                  activeCategory === category.id ? "filled" : "outlined"
                }
                sx={{
                  fontWeight: activeCategory === category.id ? 600 : 400,
                  px: 1,
                }}
                role="tab"
                aria-selected={activeCategory === category.id}
                aria-controls={`${category.id}-tabpanel`}
                id={`${category.id}-tab`}
              />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} aria-hidden="true" />

        {filteredFaqs.length === 0 ? (
          <Box
            sx={{ textAlign: "center", py: 4 }}
            aria-live="polite"
            aria-atomic="true"
          >
            <Typography variant="h6" color="text.secondary">
              No matching questions found. Try a different search term or
              category.
            </Typography>
          </Box>
        ) : (
          <Box role="region" aria-label="FAQ questions and answers">
            {filteredFaqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  overflow: "hidden",
                  "&:before": { display: "none" },
                  boxShadow: theme.palette.mode === "dark" ? 1 : 2,
                }}
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon aria-hidden="false" />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.02)",
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={500}
                      sx={{ mr: 1 }}
                    >
                      {faq.question}
                    </Typography>
                    <Chip
                      label={
                        faq.category.charAt(0).toUpperCase() +
                        faq.category.slice(1)
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        display: { xs: "none", sm: "flex" },
                        height: 24,
                        fontSize: "0.7rem",
                      }}
                      aria-label={`Category: ${faq.category}`}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ p: 3 }}
                  id={`panel${index}-content`}
                  aria-labelledby={`panel${index}-header`}
                >
                  <Typography variant="body1">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FAQ;