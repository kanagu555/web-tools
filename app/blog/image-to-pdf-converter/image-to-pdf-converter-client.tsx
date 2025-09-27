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
  Image,
  Download,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Upload,
} from "lucide-react";

export default function ImageToPdfConverterBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Convert Images to PDF Online - Free Guide",
    description:
      "Learn how to convert JPG, PNG, and other images to PDF format online for free. Step-by-step guide with tips for best results.",
    image: "https://www.kodekit.in/social/image-to-pdf-converter.png",
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
      "@id": "https://www.kodekit.in/blog/image-to-pdf-converter",
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
        name: "Image to PDF Converter Guide",
        item: `${baseUrl}/blog/image-to-pdf-converter`,
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
              How to Convert Images to PDF Online - Free Guide
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
              Learn how to convert JPG, PNG, and other images to PDF format
              online for free. Step-by-step guide with tips for best results
              using our Image to PDF converter tool.
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
                onClick={() => router.push("/tools/image-to-pdf-converter")}
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
                  <Image size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Start Converting Images to PDF Now
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
              src="/blog/image-to-pdf-converter-hero.png"
              alt="Image to PDF Converter Interface"
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
                  Why Convert Images to PDF?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Converting images to PDF format offers numerous advantages for
                  both personal and professional use. PDF documents are
                  universally compatible, maintain image quality, and provide a
                  professional appearance that's perfect for presentations,
                  reports, and document sharing.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Whether you're a student compiling research images, a business
                  professional creating presentations, or someone who needs to
                  combine multiple photos into a single document, our free image
                  to PDF converter makes the process simple and efficient.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Convert Images to PDF - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Upload Your Images",
                      description:
                        "Click 'Select Images' or simply drag and drop your image files. Supports JPG, PNG, GIF, BMP, and more.",
                      icon: <Upload size={24} />,
                    },
                    {
                      step: 2,
                      title: "Arrange Order",
                      description:
                        "Use the intuitive up/down arrows to arrange your images in the perfect order for your PDF.",
                      icon: <FileText size={24} />,
                    },
                    {
                      step: 3,
                      title: "Convert & Download",
                      description:
                        "Click 'Convert to PDF' and download your professionally formatted PDF document instantly.",
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
                  Key Features of Our Image to PDF Converter
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Multiple Format Support",
                      description:
                        "Convert JPG, PNG, GIF, BMP, TIFF, WebP, and other popular image formats to PDF.",
                      icon: <Image size={24} />,
                    },
                    {
                      title: "Batch Conversion",
                      description:
                        "Upload and convert multiple images at once, saving time and effort.",
                      icon: <FileText size={24} />,
                    },
                    {
                      title: "Drag & Drop Interface",
                      description:
                        "Intuitive drag-and-drop functionality makes uploading images effortless.",
                      icon: <Upload size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens in your browser - your images never leave your device.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "High Quality Output",
                      description:
                        "Maintains original image quality while creating professional PDF documents.",
                      icon: <Star size={24} />,
                    },
                    {
                      title: "Free & Unlimited",
                      description:
                        "No limits on file size or number of conversions. Completely free forever.",
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
                  Common Use Cases for Image to PDF Conversion
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our image to PDF converter serves various purposes across
                  different industries and personal needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Business Presentations:</strong> Combine product
                    images, charts, and graphics into professional PDF
                    presentations
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Academic Research:</strong> Compile research images,
                    diagrams, and visual data into organized PDF documents
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Portfolio Creation:</strong> Showcase artwork,
                    photography, or design work in a professional PDF portfolio
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Document Archiving:</strong> Convert scanned
                    documents and photos into searchable, organized PDF files
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Report Generation:</strong> Include visual evidence,
                    screenshots, and images in comprehensive reports
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>E-book Creation:</strong> Transform image-based
                    content into readable PDF e-books
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
                    "Use high-resolution images for better PDF quality",
                    "Ensure images are properly oriented before conversion",
                    "Consider image file sizes for faster processing",
                    "Arrange images in logical order before converting",
                    "Use consistent image dimensions for uniform appearance",
                    "Compress large images if file size is a concern",
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
                      onClick={() => router.push("/tools/image-to-pdf")}
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
                        Convert Images to PDF Now
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
                      q: "What's the maximum file size?",
                      a: "No strict limits, but larger files may take longer to process.",
                    },
                    {
                      q: "Are my images secure?",
                      a: "Yes, all processing happens locally in your browser.",
                    },
                    {
                      q: "Can I convert multiple images?",
                      a: "Yes, you can select and convert multiple images at once.",
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
                      name: "Image Compressor",
                      path: "/tools/image-compressor",
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
              title="How to Convert Images to PDF Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/image-to-pdf-converter`}
              description="Learn how to convert JPG, PNG, and other images to PDF format online for free. Step-by-step guide with tips for best results."
              hashtags={[
                "ImageToPDF",
                "PDFConverter",
                "OnlineTool",
                "DocumentConversion",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
