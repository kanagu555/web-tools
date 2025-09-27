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
    id: "image-to-pdf-converter",
    title: "How to Convert Images to PDF Online - Free Guide",
    excerpt:
      "Learn how to convert JPG, PNG, and other images to PDF format online for free. Step-by-step guide with tips for best results.",
    date: "2025-09-26",
    readTime: "5 min read",
    image: "/blog/image-to-pdf-converter-hero.png",
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
          <Grid container spacing={4}>
            {blogPosts.map((post, index) => (
              <Grid item xs={12} md={6} key={post.id}>
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
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={post.image}
                      alt={post.title}
                      sx={{ bgcolor: theme.palette.grey[200] }}
                    />
                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
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
                          variant="h5"
                          component="h2"
                          fontWeight={600}
                        >
                          {post.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
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
                              month: "long",
                              day: "numeric",
                            })}
                          </Typography>
                          <a
                            href={`/blog/${post.id}`}
                            style={{
                              color: theme.palette.primary.main,
                              textDecoration: "none",
                              fontWeight: 600,
                              fontSize: "0.875rem",
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
