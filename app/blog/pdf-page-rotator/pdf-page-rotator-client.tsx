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
  FileText,
  Upload,
  Download,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  RotateCw,
} from "lucide-react";

export default function PdfPageRotatorBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Rotate PDF Pages Online - Free Guide",
    description:
      "Learn how to rotate PDF pages 90°, 180°, or 270° clockwise online for free. Step-by-step guide with tips for best results.",
    image: "https://www.kodekit.in/social/pdf-page-rotator.png",
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
      "@id": "https://www.kodekit.in/blog/pdf-page-rotator",
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
        name: "PDF Page Rotator Guide",
        item: `${baseUrl}/blog/pdf-page-rotator`,
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
              How to Rotate PDF Pages Online - Free Guide
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
              Learn how to rotate PDF pages 90°, 180°, or 270° clockwise online
              for free. Step-by-step guide with tips for best results using our
              PDF page rotator tool.
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
                label="Instant Rotation"
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
                onClick={() => router.push("/tools/pdf-page-rotator")}
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
                  <RotateCw size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Start Rotating PDF Pages Now
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
                  Why Rotate PDF Pages?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  PDF page rotation is a common need when dealing with scanned
                  documents, mixed orientation pages, or documents that were
                  created with incorrect page orientation. Whether you're
                  working with a document that has pages rotated sideways,
                  upside down, or a mix of orientations, our free PDF page
                  rotator makes it simple to correct them.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Rotating PDF pages is essential for creating
                  professional-looking documents that are easy to read and
                  print. Our online tool allows you to rotate individual pages
                  with precision, giving you complete control over your
                  document's appearance.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Rotate PDF Pages - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Upload Your PDF",
                      description:
                        "Click 'Select PDF File' or simply drag and drop your PDF file. Supports PDF files up to 100MB.",
                      icon: <Upload size={24} />,
                    },
                    {
                      step: 2,
                      title: "Preview Pages",
                      description:
                        "View all pages with live thumbnails. See exactly which pages need rotation.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 3,
                      title: "Rotate Pages",
                      description:
                        "Click rotation buttons to rotate individual pages left or right by 90° increments.",
                      icon: <RotateCw size={24} />,
                    },
                    {
                      step: 4,
                      title: "Download Result",
                      description:
                        "Download your rotated PDF with all changes applied permanently.",
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
                  Key Features of Our PDF Page Rotator
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Individual Page Control",
                      description:
                        "Rotate each page independently with 90° precision. Perfect for fixing scanned documents with mixed orientations.",
                      icon: <RotateCw size={24} />,
                    },
                    {
                      title: "Live Preview",
                      description:
                        "See exactly how your pages will look with real-time preview. No guesswork - what you see is what you get.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 3,
                      title: "Drag & Drop Interface",
                      description:
                        "Intuitive drag-and-drop functionality makes uploading PDFs effortless.",
                      icon: <Upload size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens in your browser - your PDFs never leave your device.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "High Quality Output",
                      description:
                        "Maintains original PDF quality while rotating pages to any orientation.",
                      icon: <Star size={24} />,
                    },
                    {
                      title: "Free & Unlimited",
                      description:
                        "No limits on file size or number of rotations. Completely free forever.",
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
                  Common Use Cases for PDF Page Rotation
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our PDF page rotator serves various purposes across different
                  industries and personal needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Scanned Documents:</strong> Fix pages that were
                    scanned sideways or upside down, creating properly oriented
                    documents
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Business Reports:</strong> Correct page orientation
                    in financial reports, presentations, or business documents
                    with mixed layouts
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Academic Papers:</strong> Adjust page orientation in
                    research papers, theses, or academic documents for better
                    readability
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Legal Documents:</strong> Ensure all pages in
                    contracts, agreements, or legal filings are properly
                    oriented for filing
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Image-Based PDFs:</strong> Rotate pages containing
                    images or graphics that need to be viewed in the correct
                    orientation
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Multi-Orientation Documents:</strong> Fix documents
                    that contain a mix of portrait and landscape pages
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
                    "Preview all pages before rotating to identify which ones need adjustment",
                    "Rotate pages in 90° increments for the best results and document consistency",
                    "Use the reset button if you need to start over with a clean slate",
                    "Check the final document to ensure all pages are properly oriented",
                    "Consider the document's intended use when deciding on page orientation",
                    "Save a backup copy of your original document before making rotations",
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
                      onClick={() => router.push("/tools/pdf-page-rotator")}
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
                        Rotate PDF Pages Now
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
                      q: "Is the PDF page rotator free to use?",
                      a: "Yes, completely free with no hidden costs or limitations.",
                    },
                    {
                      q: "What's the maximum file size?",
                      a: "PDF files can be up to 100MB. No limit on the number of rotations.",
                    },
                    {
                      q: "Are my PDFs secure?",
                      a: "Yes, all processing happens locally in your browser. Files never leave your device.",
                    },
                    {
                      q: "Can I rotate multiple pages at once?",
                      a: "Currently, you can rotate pages individually for precise control. Use the reset button to quickly remove all rotations if needed.",
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
                    { name: "PDF Merger", path: "/tools/pdf-merger" },
                    { name: "PDF Splitter", path: "/tools/pdf-splitter" },
                    {
                      name: "PDF Metadata Editor",
                      path: "/tools/pdf-metadata-editor",
                    },
                    {
                      name: "Image to PDF Converter",
                      path: "/tools/image-to-pdf-converter",
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
              title="How to Rotate PDF Pages Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/pdf-page-rotator`}
              description="Learn how to rotate PDF pages 90°, 180°, or 270° clockwise online for free. Step-by-step guide with tips for best results."
              hashtags={[
                "PDFRotator",
                "PDFPages",
                "OnlineTool",
                "DocumentEditing",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
