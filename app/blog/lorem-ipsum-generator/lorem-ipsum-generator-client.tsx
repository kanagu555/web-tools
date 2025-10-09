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
  RefreshCw,
} from "lucide-react";

export default function LoremIpsumGeneratorBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Generate Lorem Ipsum Text Online - Free Guide",
    description:
      "Learn how to generate customizable Lorem Ipsum placeholder text for your designs and mockups using our free online Lorem Ipsum generator. Step-by-step guide with examples.",
    image: "https://www.kodekit.in/social/lorem-ipsum-generator.png",
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
      "@id": "https://www.kodekit.in/blog/lorem-ipsum-generator",
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
        name: "Lorem Ipsum Generator Guide",
        item: `${baseUrl}/blog/lorem-ipsum-generator`,
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
              How to Generate Lorem Ipsum Text Online - Free Guide
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
              Learn how to generate customizable Lorem Ipsum placeholder text
              for your designs and mockups using our free online Lorem Ipsum
              generator. Step-by-step guide with examples for designers and
              developers.
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
                label="Instant Generation"
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
                onClick={() => router.push("/tools/lorem-ipsum-generator")}
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
                    Start Generating Lorem Ipsum Now
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
              src="/blog/lorem-ipsum-generator-hero.png"
              alt="Lorem Ipsum Generator Interface"
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
                  What is Lorem Ipsum Text?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Lorem Ipsum is placeholder text commonly used in the graphic,
                  print, and publishing industries for previewing layouts and
                  visual mockups. It's derived from a scrambled section of
                  classical Latin literature that dates back to 45 BC, making it
                  over 2000 years old. Our free Lorem Ipsum generator helps you
                  create customizable placeholder text without manual effort.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Whether you're a designer creating website mockups, a
                  developer building application interfaces, or a content
                  creator working on layout designs, our tool makes it simple to
                  generate professional placeholder text that fits your specific
                  needs.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Generate Lorem Ipsum Text - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Choose Format Type",
                      description:
                        "Select whether you want to generate paragraphs, sentences, or individual words for your placeholder text.",
                      icon: <Type size={24} />,
                    },
                    {
                      step: 2,
                      title: "Set Quantity",
                      description:
                        "Use the slider to adjust how much text you want to generate, from 1 to 20 units depending on format.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 3,
                      title: "Generate & Customize",
                      description:
                        "Click generate and optionally add custom words to create branded placeholder content.",
                      icon: <RefreshCw size={24} />,
                    },
                    {
                      step: 4,
                      title: "Copy or Download",
                      description:
                        "Copy the generated text to clipboard or download it as a text file for your projects.",
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
                  Key Features of Our Lorem Ipsum Generator
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Multiple Formats",
                      description:
                        "Generate paragraphs, sentences, or individual words to fit any design requirement.",
                      icon: <Type size={24} />,
                    },
                    {
                      title: "Custom Words",
                      description:
                        "Add your own custom words or import word lists to create branded placeholder text.",
                      icon: <FileText size={24} />,
                    },
                    {
                      title: "Adjustable Quantity",
                      description:
                        "Generate exactly the amount of text you need with our intuitive slider controls.",
                      icon: <RefreshCw size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens in your browser - your text never leaves your device.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "Instant Results",
                      description:
                        "Generate placeholder text instantly with no waiting time or processing delays.",
                      icon: <Star size={24} />,
                    },
                    {
                      title: "Free & Unlimited",
                      description:
                        "No limits on generations. Completely free forever with no registration required.",
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
                  Common Use Cases for Lorem Ipsum Generation
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our Lorem Ipsum generator serves various purposes across
                  different industries and needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Web Design & Development:</strong> Create website
                    mockups and UI prototypes with realistic text layouts
                    without waiting for final content
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Print Design:</strong> Design brochures, magazines,
                    and advertisements with placeholder text that demonstrates
                    final layout appearance
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Mobile App Development:</strong> Build app
                    interfaces and test layouts with realistic placeholder
                    content
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Presentation Design:</strong> Create professional
                    presentations with placeholder content while final copy is
                    being developed
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Content Strategy:</strong> Plan content layouts and
                    information architecture before final copy is written
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Typography Testing:</strong> Test different fonts,
                    sizes, and spacing with realistic text content
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
                    "Use paragraphs for full-page layouts and content-heavy designs",
                    "Use sentences for headers, captions, and shorter text elements",
                    "Use words for buttons, labels, and minimal text components",
                    "Add custom words to match your brand's tone and terminology",
                    "Adjust the quantity to match your design's content requirements",
                    "Download generated text for offline use in design software",
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
                      onClick={() =>
                        router.push("/tools/lorem-ipsum-generator")
                      }
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
                        Generate Lorem Ipsum Now
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
                      q: "Is the generator free to use?",
                      a: "Yes, completely free with no hidden costs or limitations.",
                    },
                    {
                      q: "What output formats are available?",
                      a: "You can generate paragraphs, sentences, or individual words.",
                    },
                    {
                      q: "Are my generated texts secure?",
                      a: "Yes, all processing happens locally in your browser.",
                    },
                    {
                      q: "Can I add my own custom words?",
                      a: "Yes, you can add custom words manually or import them from files.",
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
                      name: "Text Case Converter",
                      path: "/tools/text-case-converter",
                    },
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
              title="How to Generate Lorem Ipsum Text Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/lorem-ipsum-generator`}
              description="Learn how to generate customizable Lorem Ipsum placeholder text for your designs and mockups using our free online Lorem Ipsum generator. Step-by-step guide with examples."
              hashtags={[
                "LoremIpsum",
                "PlaceholderText",
                "DesignTools",
                "WebDesign",
                "OnlineTool",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
