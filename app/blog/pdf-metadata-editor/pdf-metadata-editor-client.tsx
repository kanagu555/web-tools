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
  Edit,
} from "lucide-react";

export default function PdfMetadataEditorBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Edit PDF Metadata Online - Free Guide",
    description:
      "Learn how to edit PDF metadata properties including title, author, subject, and keywords online for free. Step-by-step guide with tips for best results.",
    image: "https://www.kodekit.in/social/pdf-metadata-editor.png",
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
      "@id": "https://www.kodekit.in/blog/pdf-metadata-editor",
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
        name: "PDF Metadata Editor Guide",
        item: `${baseUrl}/blog/pdf-metadata-editor`,
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
              How to Edit PDF Metadata Online - Free Guide
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
              Learn how to edit PDF metadata properties including title, author,
              subject, and keywords online for free. Step-by-step guide with
              tips for best results using our PDF metadata editor tool.
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
                label="Instant Editing"
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
                onClick={() => router.push("/tools/pdf-metadata-editor")}
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
                  <Edit size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Start Editing PDF Metadata Now
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
                  What is PDF Metadata?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  PDF metadata includes document properties like title, author,
                  subject, keywords, creation date, and other information about
                  the document. This data helps organize and identify documents,
                  making them easier to search, categorize, and manage in
                  document management systems.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Editing PDF metadata is essential for proper document
                  organization, especially when dealing with large collections
                  of files. Our free PDF metadata editor allows you to modify
                  these properties without changing the actual content of your
                  PDF documents.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Edit PDF Metadata - Step by Step
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
                      title: "View Metadata",
                      description:
                        "The tool extracts and displays current metadata. You can see all existing information about your PDF.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 3,
                      title: "Edit Properties",
                      description:
                        "Modify any metadata fields such as title, author, subject, and keywords as needed for your document.",
                      icon: <Edit size={24} />,
                    },
                    {
                      step: 4,
                      title: "Save & Download",
                      description:
                        "Download your PDF with the updated metadata. The content and formatting remain unchanged.",
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
                  Key Features of Our PDF Metadata Editor
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Edit All Metadata Properties",
                      description:
                        "Modify title, author, subject, keywords, creator, and other document properties.",
                      icon: <Edit size={24} />,
                    },
                    {
                      title: "Content Preservation",
                      description:
                        "Only metadata is modified. Your PDF content, formatting, and quality remain completely unchanged.",
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
                        "Maintains original PDF quality while updating document properties.",
                      icon: <Star size={24} />,
                    },
                    {
                      title: "Free & Unlimited",
                      description:
                        "No limits on file size or number of edits. Completely free forever.",
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
                  Common Use Cases for PDF Metadata Editing
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our PDF metadata editor serves various purposes across
                  different industries and personal needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Document Organization:</strong> Add proper titles,
                    authors, and subjects to make documents easier to search and
                    categorize in document management systems
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Professional Publishing:</strong> Ensure published
                    documents have complete and accurate metadata for better
                    discoverability
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Academic Research:</strong> Add relevant keywords
                    and subjects to research papers for improved indexing and
                    citation tracking
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Business Documentation:</strong> Standardize
                    metadata across company documents for consistent filing and
                    retrieval
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Legal Documents:</strong> Add proper metadata to
                    legal files for better organization and compliance
                    requirements
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Content Management:</strong> Improve SEO and
                    searchability of PDF documents on websites and digital
                    libraries
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
                  Tips for Effective Metadata Editing
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    "Use descriptive and specific titles that accurately reflect the document content",
                    "Include relevant keywords that users might search for when looking for your document",
                    "Maintain consistency in author names and formatting across related documents",
                    "Add subjects that categorize your document within your organization's taxonomy",
                    "Keep metadata up to date when document content changes significantly",
                    "Avoid special characters in metadata fields that might cause compatibility issues",
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
                      onClick={() => router.push("/tools/pdf-metadata-editor")}
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
                        Edit PDF Metadata Now
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
                      q: "Is the PDF metadata editor free to use?",
                      a: "Yes, completely free with no hidden costs or limitations.",
                    },
                    {
                      q: "What's the maximum file size?",
                      a: "PDF files can be up to 100MB. No limit on the number of edits.",
                    },
                    {
                      q: "Are my PDFs secure?",
                      a: "Yes, all processing happens locally in your browser. Files never leave your device.",
                    },
                    {
                      q: "Does editing metadata change the PDF content?",
                      a: "No, only the metadata is modified. The actual content, formatting, images, and text remain completely unchanged.",
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
                      name: "Image to PDF Converter",
                      path: "/tools/image-to-pdf-converter",
                    },
                    {
                      name: "PDF Page Rotator",
                      path: "/tools/pdf-page-rotator",
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
              title="How to Edit PDF Metadata Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/pdf-metadata-editor`}
              description="Learn how to edit PDF metadata properties including title, author, subject, and keywords online for free. Step-by-step guide with tips for best results."
              hashtags={[
                "PDFMetadata",
                "PDFEditor",
                "OnlineTool",
                "DocumentManagement",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
