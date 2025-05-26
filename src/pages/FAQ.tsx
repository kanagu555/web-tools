import React, { useState, useEffect } from "react";
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
import AdSense from "../components/AdSense";

const FAQ = () => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<string | false>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Expanded FAQ data with categories
  const faqs = [
    {
      question: "What is KodeKit?",
      answer:
        "KodeKit is an all-in-one toolkit for developers, designers, and content creators. It provides a collection of useful tools to streamline your workflow and increase productivity.",
      category: "general",
    },
    {
      question: "Is KodeKit free to use?",
      answer:
        "Yes, KodeKit is completely free to use. We believe in providing high-quality tools accessible to everyone without any cost barriers.",
      category: "general",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can contact us via email at kanagarajwhb@gmail.com. We typically respond within 24-48 hours during business days.",
      category: "support",
    },
    {
      question: "Can I contribute to KodeKit?",
      answer:
        "Yes, KodeKit is open source. You can contribute by visiting our GitHub repository. We welcome code contributions, bug reports, feature requests, and documentation improvements.",
      category: "development",
    },
    {
      question: "How do the PDF tools work?",
      answer:
        "Our PDF tools process files directly in your browser using JavaScript. Your files never leave your computer, ensuring complete privacy and security.",
      category: "tools",
    },
    {
      question: "Are there any usage limits?",
      answer:
        "There are no strict usage limits, but we recommend keeping file sizes reasonable to ensure optimal performance since processing happens in your browser.",
      category: "tools",
    },
    {
      question: "Is my data secure when using KodeKit?",
      answer:
        "Yes, all processing happens locally in your browser. We don't store or transmit your files to any server, ensuring complete privacy and security.",
      category: "privacy",
    },
    {
      question: "Do I need to create an account to use KodeKit?",
      answer:
        "No, KodeKit doesn't require any account creation or login. You can start using all tools immediately without any registration process.",
      category: "general",
    },
  ];

  // Define categories for filtering
  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General" },
    { id: "tools", label: "Tools" },
    { id: "privacy", label: "Privacy" },
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
    <>
      {/* Add SEO component if you have one */}
      {/* <SEO title="Frequently Asked Questions" description="Find answers to common questions about KodeKit tools and services." /> */}

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
          >
            <QuestionAnswerIcon
              sx={{
                fontSize: 60,
                color: "primary.main",
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              paragraph
              sx={{ maxWidth: 600, mb: 4 }}
            >
              Find answers to common questions about KodeKit tools and services.
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
            >
              <TextField
                fullWidth
                placeholder="Search questions..."
                variant="standard"
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
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
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {filteredFaqs.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No matching questions found. Try a different search term or
                category.
              </Typography>
            </Box>
          ) : (
            filteredFaqs.map((faq, index) => (
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
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`faq-${index}-content`}
                  id={`faq-${index}-header`}
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
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Typography variant="body1">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))
          )}
          <AdSense adSlot="6613251015" />
        </Container>
      </Box>
    </>
  );
};

export default FAQ;
