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
  GitCompareArrows,
  FileText,
  Eye,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function TextCompareBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Compare Texts Side by Side Online - Free Guide",
    description:
      "Learn how to compare two texts side by side and highlight differences using our free online text compare tool. Step-by-step guide with tips for document comparison.",
    image: "https://www.kodekit.in/social/text-compare.png",
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
      "@id": "https://www.kodekit.in/blog/text-compare",
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
        name: "Text Compare Tool Guide",
        item: `${baseUrl}/blog/text-compare`,
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
              How to Compare Texts Side by Side Online - Free Guide
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
              Learn how to compare two texts side by side and highlight differences using our free online text compare tool. 
              Step-by-step guide with tips for document comparison.
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
                label="Real-time Comparison"
                color="primary"
              />
              <Chip
                icon={<Star size={16} />}
                label="Free Forever"
                color="secondary"
              />
              <Chip
                icon={<CheckCircle size={16} />}
                label="No Registration"
                color="warning"
              />
            </Box>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                onClick={() => router.push("/tools/text-compare")}
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
                  <GitCompareArrows size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Start Comparing Texts Now
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
              src="/blog/text-compare-hero.png"
              alt="Text Compare Tool Interface"
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
                  What is Text Comparison?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Text comparison is the process of analyzing two versions of text to identify similarities and differences between them. 
                  Our free online text compare tool helps you quickly identify what has been added, removed, or modified between two 
                  text documents. This is especially useful for writers, editors, developers, and anyone who needs to track changes 
                  in documents over time.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Whether you're comparing different versions of a document, checking for plagiarism, reviewing code changes, 
                  or simply verifying that two texts match, our tool makes the process simple and efficient with color-coded 
                  highlighting and detailed statistics.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Compare Texts Side by Side - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Paste Original Text",
                      description:
                        "Paste your original text in the left panel. This will be your baseline for comparison.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 2,
                      title: "Add Comparison Text",
                      description:
                        "Paste the text you want to compare in the right panel. This can be a revised version or different document.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 3,
                      title: "View Differences",
                      description:
                        "The tool automatically highlights differences with color coding for easy identification.",
                      icon: <Eye size={24} />,
                    },
                    {
                      step: 4,
                      title: "Analyze Results",
                      description:
                        "Review the statistics and copy the comparison results for documentation or reporting.",
                      icon: <GitCompareArrows size={24} />,
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
                  Key Features of Our Text Compare Tool
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Side-by-Side Comparison",
                      description:
                        "Compare texts side by side with clear visual indicators for added, removed, and modified content.",
                      icon: <GitCompareArrows size={24} />,
                    },
                    {
                      title: "Real-time Analysis",
                      description:
                        "Instant comparison results as you type. See differences immediately without waiting for processing.",
                      icon: <Eye size={24} />,
                    },
                    {
                      title: "Detailed Statistics",
                      description:
                        "Get comprehensive statistics about changes including added, removed, and modified lines.",
                      icon: <FileText size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens in your browser - your text never leaves your device.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "Character-level Comparison",
                      description:
                        "Advanced algorithms for precise character-by-character comparison, ensuring accurate detection of even the smallest changes.",
                      icon: <Star size={24} />,
                    },
                    {
                      title: "Free & Unlimited",
                      description:
                        "No limits on usage. Completely free forever with no registration required.",
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
                  Common Use Cases for Text Comparison
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our text compare tool serves various purposes across different industries and needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Document Review:</strong> Compare different versions of contracts, reports, or articles to track changes made by collaborators
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Code Comparison:</strong> Review code changes between different versions of source files or compare implementations
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Academic Work:</strong> Check for plagiarism, verify citations, or compare research drafts for consistency
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Legal Documents:</strong> Identify changes in contracts, agreements, or legal briefs between revisions
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Content Editing:</strong> Editors can quickly spot differences between original and revised content
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Translation Verification:</strong> Compare source and translated texts to ensure accuracy and completeness
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
                  Tips for Effective Text Comparison
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    "Use the side-by-side view to easily spot differences between texts",
                    "Pay attention to the color coding: green for additions, red for deletions, yellow for modifications",
                    "Check the detailed statistics to understand the scope of changes",
                    "Compare large documents in sections for better performance",
                    "Use the clear button to start fresh with new texts",
                    "Review line numbers to locate specific changes in long documents",
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
                      onClick={() => router.push("/tools/text-compare")}
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
                        Compare Texts Now
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
                      q: "Is the text compare tool free to use?",
                      a: "Yes, completely free with no hidden costs or limitations.",
                    },
                    {
                      q: "How does the text comparison work?",
                      a: "Our tool compares texts line by line and highlights differences using color coding with advanced LCS algorithms.",
                    },
                    {
                      q: "Is my text data secure?",
                      a: "Yes, all processing happens locally in your browser. Your text never leaves your device.",
                    },
                    {
                      q: "Can I compare large texts?",
                      a: "Yes, the tool can handle large texts efficiently, though very large documents may take a moment to process.",
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
                    { name: "Text Case Converter", path: "/tools/text-case-converter" },
                    { name: "Lorem Ipsum Generator", path: "/tools/lorem-ipsum-generator" },
                    { name: "Space to Newline", path: "/tools/space-to-newline-converter" },
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
              title="How to Compare Texts Side by Side Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/text-compare`}
              description="Learn how to compare two texts side by side and highlight differences using our free online text compare tool. Step-by-step guide with tips for document comparison."
              hashtags={[
                "TextCompare",
                "DocumentComparison",
                "DiffTool",
                "TextAnalysis",
                "OnlineTool",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}