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
  Palette,
  Sliders,
  Code,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function GradientGeneratorBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "CSS Gradient Generator - Create Beautiful Gradients Online",
    description:
      "Learn how to create stunning CSS gradients with our free online gradient generator. Generate linear and radial gradients with multiple color stops.",
    image: "https://www.kodekit.in/social/gradient-generator.png",
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
      "@id": "https://www.kodekit.in/blog/gradient-generator",
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
        name: "Gradient Generator Guide",
        item: `${baseUrl}/blog/gradient-generator`,
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
              CSS Gradient Generator - Create Beautiful Gradients Online
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
              Learn how to create stunning CSS gradients with our free online
              gradient generator. Generate linear and radial gradients with
              multiple color stops for your web designs.
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
                icon={<Code size={16} />}
                label="CSS Ready Code"
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
                onClick={() => router.push("/tools/gradient-generator")}
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
                  <Palette size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Start Creating Gradients Now
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
                  Why Use CSS Gradients in Web Design?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  CSS gradients are a powerful design tool that allows you to
                  create smooth color transitions without using images. They
                  enhance visual appeal, reduce loading times, and provide
                  unlimited customization options for backgrounds, buttons, and
                  other UI elements.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Whether you're a web designer creating stunning backgrounds or
                  a developer looking to add visual interest to your interfaces,
                  our gradient generator makes it simple to create
                  professional-quality gradients with minimal effort.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Create Custom Gradients - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Select Gradient Type",
                      description:
                        "Choose between linear gradients (straight lines) or radial gradients (circular patterns).",
                      icon: <Sliders size={24} />,
                    },
                    {
                      step: 2,
                      title: "Add and Customize Colors",
                      description:
                        "Select colors using the color picker and adjust their positions to create your desired effect.",
                      icon: <Palette size={24} />,
                    },
                    {
                      step: 3,
                      title: "Fine-tune Settings",
                      description:
                        "Adjust angle for linear gradients or modify other parameters for perfect results.",
                      icon: <Sparkles size={24} />,
                    },
                    {
                      step: 4,
                      title: "Copy CSS Code",
                      description:
                        "Get production-ready CSS code instantly and implement it in your projects.",
                      icon: <Code size={24} />,
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
                  Key Features of Our Gradient Generator
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Multiple Gradient Types",
                      description:
                        "Create both linear and radial gradients with full control over parameters.",
                      icon: <Sliders size={24} />,
                    },
                    {
                      title: "Unlimited Color Stops",
                      description:
                        "Add up to 5 color stops for complex, multi-color gradient effects.",
                      icon: <Palette size={24} />,
                    },
                    {
                      title: "Real-time Preview",
                      description:
                        "See your gradient changes instantly with live preview functionality.",
                      icon: <Sparkles size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens in your browser - your designs never leave your device.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "CSS Ready Code",
                      description:
                        "Generate production-ready CSS code that works across all modern browsers.",
                      icon: <Code size={24} />,
                    },
                    {
                      title: "Free & Unlimited",
                      description:
                        "No limits on usage or features. Completely free forever with no registration.",
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
                  Common Use Cases for CSS Gradients
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our gradient generator serves various purposes across
                  different design and development needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Website Backgrounds:</strong> Create stunning
                    full-page or section backgrounds that enhance visual appeal
                    without increasing load times.
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Button Design:</strong> Add depth and visual
                    interest to buttons, making them more engaging and
                    clickable.
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Hero Sections:</strong> Design eye-catching hero
                    sections that immediately grab visitor attention.
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Progress Bars:</strong> Create visually appealing
                    progress indicators with smooth color transitions.
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Card Elements:</strong> Enhance card-based UI
                    components with subtle gradient backgrounds for better
                    visual hierarchy.
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Text Effects:</strong> Apply gradient overlays to
                    text for modern, eye-catching typography.
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
                  Tips for Creating Beautiful Gradients
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    "Use colors from the same palette for harmonious gradients",
                    "Limit color stops to 2-3 for cleaner, more professional results",
                    "Consider accessibility by ensuring sufficient contrast for text overlays",
                    "Test gradients on different devices and screen sizes",
                    "Use subtle gradients for backgrounds to maintain content readability",
                    "Experiment with different angles to create unique visual effects",
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
                      onClick={() => router.push("/tools/gradient-generator")}
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
                        Create Gradients Now
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
                      q: "Is the gradient generator free to use?",
                      a: "Yes, completely free with no hidden costs or limitations.",
                    },
                    {
                      q: "What CSS gradient types are supported?",
                      a: "Both linear and radial gradients with full customization options.",
                    },
                    {
                      q: "Are my designs secure?",
                      a: "Yes, all processing happens locally in your browser with no data transmission.",
                    },
                    {
                      q: "Can I use the generated CSS in production?",
                      a: "Absolutely, the generated code follows modern CSS standards and works in all browsers.",
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
                    { name: "Color Picker", path: "/tools/color-picker" },
                    { name: "SVG Editor", path: "/tools/svg-editor" },
                    {
                      name: "QR Code Generator",
                      path: "/tools/qr-code-generator",
                    },
                    { name: "Image Resizer", path: "/tools/image-resizer" },
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
              title="CSS Gradient Generator - Create Beautiful Gradients Online | KodeKit"
              url={`${baseUrl}/blog/gradient-generator`}
              description="Learn how to create stunning CSS gradients with our free online gradient generator. Generate linear and radial gradients with multiple color stops."
              hashtags={[
                "GradientGenerator",
                "CSSGradients",
                "WebDesign",
                "DesignTool",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
