"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import StructuredData from "@/components/StructuredData";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";

// Blog post data
const blogPosts = [
  {
    id: "youtube-thumbnail-downloader",
    title: "How to Download YouTube Thumbnails Online - Free Guide",
    excerpt:
      "Learn how to download YouTube video thumbnails in HD, SD, and custom resolutions instantly for free. Step-by-step guide with tips for best results.",
    date: "2025-10-15",
    readTime: "6 min read",
    image: "/social/free-youtube-thumbnail-downloader-kodekit.png",
    category: "Developer Tools",
  },
  {
    id: "space-to-newline-converter",
    title: "How to Convert Spaces to Newlines Online - Free Guide",
    excerpt:
      "Learn how to convert spaces to newlines in your text using our free online space to newline converter tool. Step-by-step guide with tips for data processing and formatting.",
    date: "2025-10-12",
    readTime: "6 min read",
    image: "/social/space-to-newline-converter-free-kodekit.png",
    category: "Text Tools",
  },
  {
    id: "text-compare",
    title: "How to Compare Texts Side by Side Online - Free Guide",
    excerpt:
      "Learn how to compare two texts side by side and highlight differences using our free online text compare tool. Step-by-step guide with tips for document comparison.",
    date: "2025-10-11",
    readTime: "6 min read",
    image: "/social/text-compare-tool-free-kodekit.png",
    category: "Text Tools",
  },
  {
    id: "word-count",
    title: "How to Count Words and Analyze Text Online - Free Guide",
    excerpt:
      "Learn how to count words, characters, and analyze text using our free online word count tool. Step-by-step guide with tips for writers, students, and content creators.",
    date: "2025-10-10",
    readTime: "6 min read",
    image: "/social/word-count-tool-kodekit.png",
    category: "Text Tools",
  },
  {
    id: "lorem-ipsum-generator",
    title: "How to Generate Lorem Ipsum Text Online - Free Guide",
    excerpt:
      "Learn how to generate customizable Lorem Ipsum placeholder text for your designs and mockups using our free online Lorem Ipsum generator. Step-by-step guide with examples.",
    date: "2025-10-09",
    readTime: "6 min read",
    image: "/social/lorem-ipsum-generator-free-kodekit.png",
    category: "Text Tools",
  },
  {
    id: "text-case-converter",
    title: "How to Convert Text Cases Online - Free Guide",
    excerpt:
      "Learn how to convert text between different cases (camelCase, snake_case, Title Case, etc.) using our free online text case converter. Step-by-step guide with examples.",
    date: "2025-10-08",
    readTime: "6 min read",
    image: "/social/text-case-converter-kodekit.png",
    category: "Text Tools",
  },
  {
    id: "pdf-page-rotator",
    title: "How to Rotate PDF Pages Online - Free Guide",
    excerpt:
      "Learn how to rotate PDF pages 90°, 180°, or 270° clockwise online for free. Step-by-step guide with tips for best results.",
    date: "2025-10-03",
    readTime: "6 min read",
    image: "/social/pdf-page-rotator-kodekit.png",
    category: "PDF Tools",
  },
  {
    id: "pdf-metadata-editor",
    title: "How to Edit PDF Metadata Online - Free Guide",
    excerpt:
      "Learn how to edit PDF metadata properties including title, author, subject, and keywords online for free. Step-by-step guide with tips for best results.",
    date: "2025-10-01",
    readTime: "6 min read",
    image: "/social/free-pdf-metadata-editor-kodekit.png",
    category: "PDF Tools",
  },
  {
    id: "pdf-splitter",
    title: "How to Split PDF Files Online - Free Guide",
    excerpt:
      "Learn how to extract pages from PDF documents online for free. Step-by-step guide with tips for best results.",
    date: "2025-09-29",
    readTime: "6 min read",
    image: "/social/split-pdf-online-kodekit.png",
    category: "PDF Tools",
  },
  {
    id: "pdf-merger",
    title: "How to Merge PDF Files Online - Free Guide",
    excerpt:
      "Learn how to combine multiple PDF files into one document online for free. Step-by-step guide with tips for best results.",
    date: "2025-09-28",
    readTime: "6 min read",
    image: "/social/merge-pdf-files-kodekit.png",
    category: "PDF Tools",
  },
  {
    id: "image-to-pdf-converter",
    title: "How to Convert Images to PDF Online - Free Guide",
    excerpt:
      "Learn how to convert JPG, PNG, and other images to PDF format online for free. Step-by-step guide with tips for best results.",
    date: "2025-09-26",
    readTime: "5 min read",
    image: "/social/image-to-pdf-converter-kodekit.png",
    category: "PDF Tools",
  },
  // Add more blog posts here as they are created
];

export default function BlogClient() {
  const theme = useTheme();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "KodeKit Blog",
    description:
      "Learn about developer tools, online utilities, and productivity tips. Explore guides and tutorials for PDF conversion, text processing, design tools, and more.",
    url: "https://www.kodekit.in/blog",
    publisher: {
      "@type": "Organization",
      name: "KodeKit",
      logo: {
        "@type": "ImageObject",
        url: "https://www.kodekit.in/logo.png",
      },
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
    ],
  };

  return (
    <>
      <StructuredData data={[blogSchema, breadcrumbSchema]} />
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
              KodeKit Blog
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
              Learn about developer tools, online utilities, and productivity
              tips. Explore guides and tutorials for PDF conversion, text
              processing, design tools, and more.
            </Typography>
          </Box>

          {/* Blog Posts Grid */}
          <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
            {blogPosts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="150"
                      image={post.image}
                      alt={post.title}
                      sx={{ bgcolor: theme.palette.grey[200] }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        height: 200,
                        overflow: "hidden",
                      }}
                    >
                      <Box sx={{ mb: 1.5 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="caption" color="primary">
                            {post.category}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {post.readTime}
                          </Typography>
                        </Box>
                        <Typography
                          gutterBottom
                          variant="subtitle1"
                          component="h2"
                          fontWeight={600}
                          sx={{
                            fontSize: "1rem",
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            height: "2.6em",
                          }}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 0.5,
                            fontSize: "0.8rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {post.excerpt}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: "auto" }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </Typography>
                          <a
                            href={`/blog/${post.id}`}
                            style={{
                              color: theme.palette.primary.main,
                              textDecoration: "none",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                            }}
                          >
                            Read More →
                          </a>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* AdSense */}
          <Box sx={{ mt: 6 }}>
            <AdSense adSlot="5147823156" />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
