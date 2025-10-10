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
  Hash,
  Clock,
  Shield,
  Star,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function WordCountBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Count Words and Analyze Text Online - Free Guide",
    description:
      "Learn how to count words, characters, and analyze text using our free online word count tool. Step-by-step guide with tips for writers, students, and content creators.",
    image: "https://www.kodekit.in/social/word-count.png",
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
      "@id": "https://www.kodekit.in/blog/word-count",
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
        name: "Word Count Tool Guide",
        item: `${baseUrl}/blog/word-count`,
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
              How to Count Words and Analyze Text Online - Free Guide
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
              Learn how to count words, characters, and analyze text using our
              free online word count tool. Step-by-step guide with tips for
              writers, students, and content creators.
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
                label="Real-time Analysis"
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
                onClick={() => router.push("/tools/word-count")}
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
                    Start Counting Words Now
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
              src="/blog/word-count-hero.png"
              alt="Word Count Tool Interface"
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
                  Why Use a Word Count Tool?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  A word count tool is an essential utility for writers,
                  students, content creators, and professionals who need to
                  track and analyze their text. Whether you're working on an
                  academic paper with strict word limits, a blog post for your
                  website, or a social media caption with character
                  restrictions, our free word count tool makes the process
                  simple and efficient.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Beyond simple word counting, our tool provides comprehensive
                  text analysis including character counts, sentence analysis,
                  reading time estimates, and more. This makes it invaluable for
                  anyone who works with text regularly.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Count Words and Analyze Text - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Enter Your Text",
                      description:
                        "Type, paste, or upload your text content. Supports up to 100,000 characters and .txt files up to 1MB.",
                      icon: <Type size={24} />,
                    },
                    {
                      step: 2,
                      title: "View Statistics",
                      description:
                        "Watch as word count, character count, and other metrics update in real-time as you type.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 3,
                      title: "Analyze Details",
                      description:
                        "Review detailed statistics including reading time, longest word, and unique word count.",
                      icon: <Hash size={24} />,
                    },
                    {
                      step: 4,
                      title: "Copy or Save",
                      description:
                        "Copy your text or save the analysis results for future reference and documentation.",
                      icon: <Clock size={24} />,
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
                  Key Features of Our Word Count Tool
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Real-time Analysis",
                      description:
                        "Get instant word count, character count, and text statistics as you type with no waiting required.",
                      icon: <Type size={24} />,
                    },
                    {
                      title: "Comprehensive Statistics",
                      description:
                        "Count words, characters, sentences, paragraphs, and get reading time estimates with detailed analysis.",
                      icon: <FileText size={24} />,
                    },
                    {
                      title: "File Support",
                      description:
                        "Upload text files, copy from clipboard, and export results. Supports multiple input methods.",
                      icon: <Hash size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens in your browser - your text never leaves your device.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "Accurate Analysis",
                      description:
                        "Uses advanced algorithms for precise word counting and text analysis across multiple languages.",
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
                  Common Use Cases for Word Count Analysis
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our word count tool serves various purposes across different
                  industries and needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Academic Writing:</strong> Meet strict word limits
                    for essays, research papers, and dissertations with precise
                    word counting
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Content Creation:</strong> Optimize blog posts,
                    articles, and web content for SEO and readability with
                    character and word analysis
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Social Media:</strong> Craft perfect captions and
                    posts within platform character limits for Twitter,
                    Instagram, LinkedIn, and more
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Professional Writing:</strong> Track progress on
                    reports, proposals, and documentation with real-time
                    statistics
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Translation:</strong> Compare source and target text
                    lengths to ensure accurate translations
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Editing:</strong> Analyze text complexity and
                    readability with detailed statistics and metrics
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
                  Tips for Effective Text Analysis
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    "Use the file upload feature for analyzing large documents",
                    "Take advantage of the real-time analysis to track your progress",
                    "Check reading time estimates to plan content delivery",
                    "Use the character count (with and without spaces) for different requirements",
                    "Identify the longest word to improve text readability",
                    "Track unique words to enhance vocabulary diversity",
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
                      onClick={() => router.push("/tools/word-count")}
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
                        Count Words Now
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
                      q: "Is the word count tool free to use?",
                      a: "Yes, completely free with no hidden costs or limitations.",
                    },
                    {
                      q: "How accurate is the word counting?",
                      a: "Our tool uses advanced algorithms for precise word counting across multiple languages.",
                    },
                    {
                      q: "Is my text secure when using the tool?",
                      a: "Yes, all processing happens locally in your browser. Your text never leaves your device.",
                    },
                    {
                      q: "What file formats can I upload?",
                      a: "You can upload plain text files (.txt) up to 1MB in size.",
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
                    {
                      name: "Text Case Converter",
                      path: "/tools/text-case-converter",
                    },
                    {
                      name: "Lorem Ipsum Generator",
                      path: "/tools/lorem-ipsum-generator",
                    },
                    { name: "Text Compare", path: "/tools/text-compare" },
                    {
                      name: "Space to Newline",
                      path: "/tools/space-to-newline-converter",
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
              title="How to Count Words and Analyze Text Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/word-count`}
              description="Learn how to count words, characters, and analyze text using our free online word count tool. Step-by-step guide with tips for writers, students, and content creators."
              hashtags={[
                "WordCount",
                "TextAnalysis",
                "WritingTool",
                "ContentCreation",
                "OnlineTool",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
