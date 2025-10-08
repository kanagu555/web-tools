"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
  Chip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import StructuredData from "@/components/StructuredData";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";
import SocialShare from "@/components/SocialShare";
import { useRouter } from "next/navigation";
import {
  Type,
  FileText,
  Download,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Upload,
} from "lucide-react";

export default function TextCaseConverterBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Convert Text Cases Online - Free Guide",
    description:
      "Learn how to convert text between different cases (camelCase, snake_case, Title Case, etc.) using our free online text case converter. Step-by-step guide with examples.",
    image: "https://www.kodekit.in/social/text-case-converter.png",
    author: {
      "@type": "Organization",
      name: "KodeKit",
    },
    publisher: {
      "@type": "Organization",
      name: "KodeKit",
      logo: {
        "@type": "ImageObject",
        url: "https://www.kodekit.in/logo.png",
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.kodekit.in/blog/text-case-converter",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Text Case Converter Guide",
        item: `${baseUrl}/blog/text-case-converter`,
      },
    ],
  };

  return (
    <>
      <StructuredData data={[articleSchema, breadcrumbSchema]} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Navigation />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box component="header" sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              fontWeight={700}
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              How to Convert Text Cases Online - Free Guide
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
                maxWidth: "800px",
                mx: "auto",
                mb: 4,
              }}
            >
              Learn how to convert text between different cases (camelCase,
              snake_case, Title Case, etc.) using our free online text case
              converter. Step-by-step guide with examples for developers and
              content creators.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
                mb: 4,
              }}
            >
              <Chip
                icon={<Shield size={16} />}
                label="100% Secure"
                color="success"
              />
              <Chip
                icon={<Clock size={16} />}
                label="Instant Conversion"
                color="primary"
              />
              <Chip
                icon={<Download size={16} />}
                label="Free Forever"
                color="secondary"
              />
              <Chip
                icon={<Star size={16} />}
                label="No Registration"
                color="warning"
              />
            </Box>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                onClick={() => router.push("/tools/text-case-converter")}
                sx={{
                  p: 3,
                  cursor: "pointer",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  border: `2px solid ${theme.palette.primary.main}30`,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <Type size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Start Converting Text Cases Now
                  </Typography>
                  <ArrowRight size={24} />
                </Box>
              </Paper>
            </motion.div>
          </Box>

          {/* Featured Image */}
          {/* <Box
            sx={{
              textAlign: "center",
              mb: 6,
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: 3,
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <Box
              component="img"
              src="/blog/text-case-converter-hero.png"
              alt="Text Case Converter Interface"
              sx={{
                width: "100%",
                maxWidth: "800px",
                height: { xs: "200px", sm: "300px", md: "400px" },
                objectFit: "cover",
                borderRadius: 3,
                bgcolor: theme.palette.grey[200],
              }}
            />
          </Box> */}

          {/* Main Content */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* Introduction */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  What is Text Case Conversion?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Text case conversion is the process of changing the
                  capitalization style of text to match specific formatting
                  conventions. Different programming languages, coding
                  standards, and writing styles require different case formats.
                  Our free text case converter helps you quickly transform text
                  between various formats without manual editing.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Whether you're a developer needing to convert variable names
                  between camelCase and snake_case, a content creator formatting
                  titles in Title Case, or anyone working with text that needs
                  consistent formatting, our tool makes the process simple and
                  efficient.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Convert Text Cases - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Enter Your Text",
                      description:
                        "Type, paste, or upload your text content. Supports up to 50,000 characters and .txt files up to 1MB.",
                      icon: <Type size={24} />,
                    },
                    {
                      step: 2,
                      title: "Select Case Format",
                      description:
                        "Choose from 10+ case formats including camelCase, snake_case, Title Case, UPPERCASE, and more.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 3,
                      title: "Convert & Download",
                      description:
                        "Instantly see your converted text and download it as a file or copy to clipboard.",
                      icon: <Download size={24} />,
                    },
                  ].map((item) => (
                    <Grid item xs={12} key={item.step}>
                      <Paper
                        sx={{
                          p: 3,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              backgroundColor: theme.palette.primary.main,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "1.25rem",
                              flexShrink: 0,
                            }}
                          >
                            {item.step}
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              gutterBottom
                              fontWeight={600}
                            >
                              {item.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Features */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Key Features of Our Text Case Converter
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Multiple Case Formats",
                      description:
                        "Support for 10+ case types including camelCase, PascalCase, snake_case, kebab-case, and more.",
                      icon: <Type size={24} />,
                    },
                    {
                      title: "Batch Conversion",
                      description:
                        "Convert large amounts of text at once with support for up to 50,000 characters.",
                      icon: <FileText size={24} />,
                    },
                    {
                      title: "File Support",
                      description:
                        "Upload text files (.txt) up to 1MB, convert content, and download results.",
                      icon: <Upload size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens in your browser - your text never leaves your device.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "Real-time Preview",
                      description:
                        "See instant results as you type or select different case formats.",
                      icon: <Star size={24} />,
                    },
                    {
                      title: "Free & Unlimited",
                      description:
                        "No limits on conversions. Completely free forever with no registration required.",
                      icon: <CheckCircle size={24} />,
                    },
                  ].map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            flexShrink: 0,
                            mt: 0.5,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontWeight={600}
                          >
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Use Cases */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Common Use Cases for Text Case Conversion
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our text case converter serves various purposes across
                  different industries and needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Programming & Development:</strong> Convert variable
                    names between camelCase, snake_case, and PascalCase to match
                    coding standards
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Content Creation:</strong> Format titles and
                    headings in Title Case or Sentence case for blogs, articles,
                    and marketing materials
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Data Processing:</strong> Standardize text data
                    formats for databases, APIs, and data analysis workflows
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Academic Writing:</strong> Format references,
                    citations, and headings according to style guides
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>File Naming:</strong> Convert file and folder names
                    to consistent formats for better organization
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>UI/UX Design:</strong> Format labels, buttons, and
                    interface elements consistently across applications
                  </Typography>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Tips */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Tips for Best Results
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    "Use the random case feature to quickly test different formats",
                    "Take advantage of the swap function to convert output back to input",
                    "Upload text files for processing large amounts of content",
                    "Use the clear button to start fresh with new text",
                    "Copy converted text directly to clipboard with one click",
                    "Download results as a text file for later use",
                  ].map((tip, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CheckCircle
                          size={20}
                          color={theme.palette.success.main}
                        />
                        <Typography variant="body1">{tip}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: "sticky", top: 20 }}>
                {/* Quick Access */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Quick Access
                  </Typography>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Paper
                      onClick={() => router.push("/tools/text-case-converter")}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        textAlign: "center",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        Convert Text Cases Now
                      </Typography>
                    </Paper>
                  </motion.div>
                </Paper>

                {/* FAQ */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Frequently Asked Questions
                  </Typography>

                  {[
                    {
                      q: "Is the converter free to use?",
                      a: "Yes, completely free with no hidden costs or limitations.",
                    },
                    {
                      q: "What case formats are supported?",
                      a: "We support 10+ formats: lowercase, UPPERCASE, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, alternating case, and inverse case.",
                    },
                    {
                      q: "Are my texts secure?",
                      a: "Yes, all processing happens locally in your browser.",
                    },
                    {
                      q: "Can I convert large texts?",
                      a: "Yes, supports up to 50,000 characters and 1MB text files.",
                    },
                  ].map((faq, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        {faq.q}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {faq.a}
                      </Typography>
                    </Box>
                  ))}
                </Paper>

                {/* Related Tools */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Related Tools
                  </Typography>

                  {[
                    { name: "Word Count", path: "/tools/word-count" },
                    { name: "Text Compare", path: "/tools/text-compare" },
                    {
                      name: "Space to Newline",
                      path: "/tools/space-to-newline-converter",
                    },
                    {
                      name: "Lorem Ipsum Generator",
                      path: "/tools/lorem-ipsum-generator",
                    },
                  ].map((tool, index) => (
                    <Box
                      key={index}
                      onClick={() => router.push(tool.path)}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <Typography variant="body2" color="primary">
                        {tool.name}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {/* AdSense Ad */}
          <AdSense adSlot="6862405013" />

          {/* Social Share */}
          <Box sx={{ mt: 4 }}>
            <SocialShare
              title="How to Convert Text Cases Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/text-case-converter`}
              description="Learn how to convert text between different cases (camelCase, snake_case, Title Case, etc.) using our free online text case converter. Step-by-step guide with examples."
              hashtags={[
                "TextCaseConverter",
                "CaseConversion",
                "DeveloperTools",
                "TextFormatting",
                "OnlineTool",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
