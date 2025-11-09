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
  FileCode,
  Download,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Upload,
  Zap,
} from "lucide-react";

export default function CssMinifierBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Minify CSS Online - Free Guide",
    description:
      "Learn how to minify and optimize CSS code to reduce file size and improve website performance. Step-by-step guide with tips for best results using our CSS Minifier tool.",
    image: "https://www.kodekit.in/social/css-minifier.png",
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
      "@id": "https://www.kodekit.in/blog/css-minifier",
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
        name: "CSS Minifier Guide",
        item: `${baseUrl}/blog/css-minifier`,
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
              How to Minify CSS Online - Free Guide
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
              Learn how to minify and optimize CSS code to reduce file size and
              improve website performance. Step-by-step guide with tips for best
              results using our CSS Minifier tool.
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
                label="Instant Minification"
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
                onClick={() => router.push("/tools/css-minifier")}
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
                  <FileCode size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Start Minifying CSS Now
                  </Typography>
                  <ArrowRight size={24} />
                </Box>
              </Paper>
            </motion.div>
          </Box>

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
                  Why Minify CSS?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  CSS minification is a crucial web performance optimization
                  technique that removes unnecessary characters from CSS files
                  without changing their functionality. This process
                  significantly reduces file sizes, leading to faster page load
                  times, improved user experience, and better SEO rankings.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Whether you're a web developer optimizing site performance, a
                  designer fine-tuning your website, or someone trying to
                  improve your Core Web Vitals scores, our free CSS minifier
                  makes the process simple and efficient while maintaining CSS
                  functionality.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Minify CSS - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Paste or Upload CSS",
                      description:
                        "Paste your CSS code directly into the editor or upload a CSS file. Supports all CSS syntax including media queries and keyframes.",
                      icon: <Upload size={24} />,
                    },
                    {
                      step: 2,
                      title: "Configure Options",
                      description:
                        "Choose minification options like removing comments, whitespace, and optimizing colors to suit your needs.",
                      icon: <Zap size={24} />,
                    },
                    {
                      step: 3,
                      title: "Minify & Download",
                      description:
                        "Click 'Minify CSS Code' and download your optimized CSS with reduced file size.",
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
                  Key Features of Our CSS Minifier
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Multiple Optimization Options",
                      description:
                        "Choose from various minification settings including comment removal, whitespace elimination, and color optimization.",
                      icon: <Zap size={24} />,
                    },
                    {
                      step: 2,
                      title: "Preset Configurations",
                      description:
                        "Quickly apply conservative, balanced, or aggressive minification presets based on your needs.",
                      icon: <FileCode size={24} />,
                    },
                    {
                      title: "Real-time Statistics",
                      description:
                        "View detailed compression statistics including file size reduction, character count, and line count.",
                      icon: <Star size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens in your browser - your CSS code never leaves your device.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "Instant Results",
                      description:
                        "Minify CSS code in real-time with immediate preview of results.",
                      icon: <Clock size={24} />,
                    },
                    {
                      title: "Free & Unlimited",
                      description:
                        "No limits on file size or number of minifications. Completely free forever.",
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
                  Common Use Cases for CSS Minification
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our CSS minifier serves various purposes across different
                  development scenarios and optimization needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Production Builds:</strong> Reduce CSS file sizes
                    for faster website loading and better user experience
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Mobile Optimization:</strong> Minimize bandwidth
                    usage for mobile users with slower connections
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Performance Boost:</strong> Improve Core Web Vitals
                    and SEO rankings with optimized CSS delivery
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Development Workflow:</strong> Integrate
                    minification into your build process for automated
                    optimization
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Legacy Code Optimization:</strong> Clean up and
                    optimize existing CSS files to improve maintainability
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Bandwidth Reduction:</strong> Lower hosting and CDN
                    costs by reducing data transfer
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
                  Tips for Best Minification Results
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    "Use the balanced preset for most projects to maintain a good balance between optimization and readability",
                    "Always test minified CSS in different browsers to ensure compatibility",
                    "Keep original CSS files for development and use minified versions only in production",
                    "Combine CSS minification with Gzip compression for maximum file size reduction",
                    "Use version control to track changes between original and minified CSS files",
                    "Consider using the aggressive preset for maximum compression when file size is critical",
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
                      onClick={() => router.push("/tools/css-minifier")}
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
                        Minify CSS Now
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
                      q: "Is the CSS minifier free to use?",
                      a: "Yes, completely free with no hidden costs or limitations.",
                    },
                    {
                      q: "Does minification affect CSS functionality?",
                      a: "No, minification only removes unnecessary characters and whitespace without changing functionality.",
                    },
                    {
                      q: "Are my CSS files secure?",
                      a: "Yes, all processing happens locally in your browser.",
                    },
                    {
                      q: "What CSS features are supported?",
                      a: "All CSS features including media queries, keyframes, and vendor prefixes.",
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
                      name: "CSS Formatter",
                      path: "/tools/css-formatter",
                    },
                    {
                      name: "JSON Formatter",
                      path: "/tools/json-formatter",
                    },
                    { name: "Regex Tester", path: "/tools/regex-tester" },
                    {
                      name: "Base64 Encoder",
                      path: "/tools/base64-encoder-decoder",
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
              title="How to Minify CSS Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/css-minifier`}
              description="Learn how to minify and optimize CSS code to reduce file size and improve website performance. Step-by-step guide with tips for best results using our CSS Minifier tool."
              hashtags={[
                "CSSMinifier",
                "WebOptimization",
                "Performance",
                "DeveloperTools",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
