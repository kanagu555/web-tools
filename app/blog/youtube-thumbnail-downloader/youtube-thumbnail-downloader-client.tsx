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
  Image,
  Download,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Youtube,
} from "lucide-react";

export default function YoutubeThumbnailDownloaderBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Download YouTube Thumbnails Online - Free Guide",
    description:
      "Learn how to download YouTube video thumbnails in HD, SD, and custom resolutions instantly for free. Step-by-step guide with tips for best results.",
    image: "https://www.kodekit.in/social/youtube-thumbnail-downloader.png",
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
      "@id": "https://www.kodekit.in/blog/youtube-thumbnail-downloader",
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
        name: "YouTube Thumbnail Downloader Guide",
        item: `${baseUrl}/blog/youtube-thumbnail-downloader`,
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
              How to Download YouTube Thumbnails Online - Free Guide
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
              Learn how to download YouTube video thumbnails in HD, SD, and
              custom resolutions instantly for free. Step-by-step guide with
              tips for best results using our YouTube Thumbnail Downloader tool.
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
                label="Instant Download"
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
                onClick={() =>
                  router.push("/tools/youtube-thumbnail-downloader")
                }
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
                  <Youtube size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Start Downloading YouTube Thumbnails Now
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
                  Why Download YouTube Thumbnails?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  YouTube thumbnails are the small images that represent videos
                  in search results and on channel pages. They play a crucial
                  role in attracting viewers to click on your content. Whether
                  you're a content creator looking to analyze successful
                  thumbnails, designer seeking inspiration, or researcher
                  collecting visual data, our free YouTube Thumbnail Downloader
                  makes the process simple and efficient.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our tool allows you to download thumbnails in multiple
                  resolutions, from high-definition to standard quality, giving
                  you the flexibility to choose the perfect size for your needs.
                  All processing happens locally in your browser, ensuring your
                  privacy and security.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Download YouTube Thumbnails - Step by Step
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Copy Video URL",
                      description:
                        "Copy the URL of the YouTube video whose thumbnail you want to download.",
                      icon: <Youtube size={24} />,
                    },
                    {
                      step: 2,
                      title: "Paste URL",
                      description:
                        "Paste the URL into our tool's input field and click the 'Extract' button.",
                      icon: <Image size={24} />,
                    },
                    {
                      step: 3,
                      title: "Select Resolution",
                      description:
                        "Choose from available thumbnail resolutions that best fit your needs.",
                      icon: <Star size={24} />,
                    },
                    {
                      step: 4,
                      title: "Download",
                      description:
                        "Click the download button to save the thumbnail to your device instantly.",
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
                  Key Features of Our YouTube Thumbnail Downloader
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Multiple Resolutions",
                      description:
                        "Download thumbnails in various resolutions from HD to SD quality to suit your specific needs.",
                      icon: <Image size={24} />,
                    },
                    {
                      title: "Instant Processing",
                      description:
                        "Get high-quality YouTube thumbnails instantly with one click. No waiting required.",
                      icon: <Clock size={24} />,
                    },
                    {
                      title: "Privacy Protected",
                      description:
                        "All processing happens locally in your browser. Your video URLs are never stored or transmitted.",
                      icon: <Shield size={24} />,
                    },
                    {
                      title: "Completely Free",
                      description:
                        "Our tool is 100% free to use with no hidden fees or registration requirements.",
                      icon: <Star size={24} />,
                    },
                    {
                      title: "No Installation Required",
                      description:
                        "Works directly in your browser on any device - Windows, Mac, Linux, iOS, and Android.",
                      icon: <CheckCircle size={24} />,
                    },
                    {
                      title: "High Quality Output",
                      description:
                        "Download thumbnails in the highest available quality without any compression or quality loss.",
                      icon: <Download size={24} />,
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
                  Common Use Cases for YouTube Thumbnail Downloading
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our YouTube Thumbnail Downloader serves various purposes
                  across different industries and personal needs:
                </Typography>

                <Box component="ul" sx={{ pl: 3, mb: 3 }}>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Content Creators:</strong> Analyze successful
                    thumbnails from competitors or your own channel to improve
                    your content strategy
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Designers:</strong> Gather inspiration from popular
                    thumbnail designs and color schemes
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Researchers:</strong> Collect visual data for
                    academic studies or market research projects
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Marketers:</strong> Monitor brand mentions and
                    analyze how your content is being represented
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Educators:</strong> Download educational video
                    thumbnails for presentations or classroom materials
                  </Typography>
                  <Typography component="li" variant="body1" paragraph>
                    <strong>Personal Use:</strong> Save favorite thumbnails as
                    wallpaper or for personal reference
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
                    "Always check the thumbnail quality before downloading to ensure it meets your needs",
                    "Use HD thumbnails for professional presentations or print materials",
                    "Consider file size when choosing resolution for web use",
                    "Download multiple resolutions to have options for different use cases",
                    "Use thumbnails ethically and respect copyright when using them for commercial purposes",
                    "Keep downloaded thumbnails organized in folders by category or date",
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
                        router.push("/tools/youtube-thumbnail-downloader")
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
                        Download YouTube Thumbnails Now
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
                      q: "Is it legal to download YouTube thumbnails?",
                      a: "Yes, downloading YouTube thumbnails for personal use is generally legal as they are publicly accessible. However, be aware of copyright restrictions when using thumbnails for commercial purposes.",
                    },
                    {
                      q: "What thumbnail resolutions are available?",
                      a: "We provide thumbnails in multiple resolutions including Maximum Resolution (1280x720), High Quality (480x360), Medium Quality (320x180), and Standard Definition (640x480).",
                    },
                    {
                      q: "Is my YouTube video data secure?",
                      a: "Yes, absolutely. Our tool works entirely in your browser and never sends your video URLs or any personal data to our servers. Your privacy is protected.",
                    },
                    {
                      q: "Can I download thumbnails from private videos?",
                      a: "No, our tool can only download thumbnails from publicly accessible videos. Thumbnails from private or unlisted videos cannot be accessed.",
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
                      name: "Image to PDF Converter",
                      path: "/tools/image-to-pdf-converter",
                    },
                    {
                      name: "Image Compressor",
                      path: "/tools/image-compressor",
                    },
                    { name: "Image Resizer", path: "/tools/image-resizer" },
                    { name: "URL Shortener", path: "/tools/url-shortener" },
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
              title="How to Download YouTube Thumbnails Online - Free Guide | KodeKit"
              url={`${baseUrl}/blog/youtube-thumbnail-downloader`}
              description="Learn how to download YouTube video thumbnails in HD, SD, and custom resolutions instantly for free. Step-by-step guide with tips for best results."
              hashtags={[
                "YouTubeThumbnails",
                "ThumbnailDownloader",
                "OnlineTool",
                "VideoTools",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
