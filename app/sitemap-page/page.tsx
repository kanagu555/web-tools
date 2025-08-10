"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import {
  Home,
  Info,
  Category,
  Build,
  TextFields,
  Palette,
  Code,
  PictureAsPdf,
  Description,
  Launch,
  Calculate,
  Image,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";
import { toolsData, toolCategories } from "@/lib/data/toolsData";

export default function SitemapPage() {
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Main pages data
  const mainPages = [
    {
      title: "Home",
      path: "/",
      icon: <Home />,
      description: "Main landing page with all tools and features",
      priority: "1.0",
      changefreq: "daily",
    },
    {
      title: "Categories",
      path: "/categories",
      icon: <Category />,
      description: "Browse tools organized by categories",
      priority: "0.9",
      changefreq: "weekly",
    },
    {
      title: "About",
      path: "/about",
      icon: <Info />,
      description: "Learn about KodeKit's mission and technology",
      priority: "0.8",
      changefreq: "monthly",
    },
    {
      title: "Sitemap",
      path: "/sitemap-page",
      icon: <Description />,
      description: "Complete site structure and navigation",
      priority: "0.6",
      changefreq: "weekly",
    },
  ];

  // Get category icons
  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case "pdf":
        return <PictureAsPdf />;
      case "text":
        return <TextFields />;
      case "design":
        return <Palette />;
      case "developer":
        return <Code />;
      case "calculator":
        return <Calculate />;
      case "image":
        return <Image />;
      default:
        return <Build />;
    }
  };

  // Get category colors
  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case "pdf":
        return "error";
      case "text":
        return "primary";
      case "design":
        return "secondary";
      case "developer":
        return "success";
      case "calculator":
        return "info";
      case "image":
        return "warning";
      default:
        return "primary";
    }
  };

  // Get popular tools (first 6 tools marked as popular)
  const popularTools = toolsData
    .filter((tool) => tool.popular)
    .slice(0, 6)
    .map((tool) => ({
      title: tool.title,
      path: tool.route || `/tools/${tool.id}`,
      category: toolCategories.find((cat) => cat.id === tool.category)?.title || "Tools",
    }));

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      aria-label="KodeKit Sitemap - Complete Site Navigation"
    >
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Site Map
              </Typography>
            </motion.div>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, fontWeight: 400 }}
            >
              Complete navigation guide to all KodeKit tools and pages
            </Typography>
          </Box>

          <AdSense adSlot="6613251015" />

          {/* Main Pages Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
              >
                Main Pages
              </Typography>

              <Grid container spacing={3}>
                {mainPages.map((page, index) => (
                  <Grid item xs={12} sm={6} md={3} key={page.path}>
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    >
                      <Card
                        elevation={3}
                        sx={{
                          height: "100%",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, textAlign: "center" }}>
                          <Box
                            sx={{ mb: 2, color: theme.palette.primary.main }}
                          >
                            {page.icon}
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {page.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            {page.description}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                            sx={{ mb: 2 }}
                          >
                            <Chip
                              label={`Priority: ${page.priority}`}
                              size="small"
                              color="primary"
                            />
                            <Chip
                              label={page.changefreq}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                          <Button
                            component={Link}
                            href={page.path}
                            variant="outlined"
                            size="small"
                            endIcon={<Launch />}
                            sx={{ textTransform: "none" }}
                          >
                            Visit Page
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          <Divider sx={{ my: 6 }} />

          {/* Tool Categories Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
              >
                Tool Categories
              </Typography>

              <Grid container spacing={4}>
                {toolCategories.map((category, index) => {
                  const categoryTools = toolsData
                    .filter((tool) => tool.category === category.id)
                    .slice(0, 4)
                    .map((tool) => tool.title);

                  const colorKey = getCategoryColor(category.id);
                  const paletteColor = theme.palette[colorKey as keyof typeof theme.palette] as any;

                  return (
                    <Grid item xs={12} md={6} key={category.id}>
                      <motion.div
                        initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1.0 + index * 0.2 }}
                      >
                        <Card
                          elevation={3}
                          sx={{
                            height: "100%",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-5px)",
                              boxShadow: theme.shadows[8],
                            },
                            background: `linear-gradient(135deg, ${paletteColor.main}08, ${paletteColor.main}03)`,
                            border: `1px solid ${paletteColor.main}20`,
                          }}
                        >
                          <CardContent sx={{ p: 4 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 3,
                              }}
                            >
                              <Box
                                sx={{
                                  mr: 2,
                                  color: paletteColor.main,
                                }}
                              >
                                {getCategoryIcon(category.id)}
                              </Box>
                              <Typography variant="h5" fontWeight="bold">
                                {category.title}
                              </Typography>
                            </Box>

                            <Typography
                              variant="body1"
                              color="text.secondary"
                              sx={{ mb: 3 }}
                            >
                              {category.description}
                            </Typography>

                            <Typography
                              variant="subtitle2"
                              fontWeight="bold"
                              sx={{ mb: 2 }}
                            >
                              Available Tools:
                            </Typography>

                            <Stack
                              direction="row"
                              spacing={1}
                              flexWrap="wrap"
                              gap={1}
                              sx={{ mb: 3 }}
                            >
                              {categoryTools.map((tool) => (
                                <Chip
                                  key={tool}
                                  label={tool}
                                  size="small"
                                  variant="outlined"
                                  color={colorKey as any}
                                />
                              ))}
                              {toolsData.filter((tool) => tool.category === category.id).length > 4 && (
                                <Chip
                                  label={`+${toolsData.filter((tool) => tool.category === category.id).length - 4} more`}
                                  size="small"
                                  variant="outlined"
                                  color="default"
                                />
                              )}
                            </Stack>

                            <Button
                              component={Link}
                              href={`/category/${category.id}`}
                              variant="contained"
                              color={colorKey as any}
                              endIcon={<Launch />}
                              sx={{ textTransform: "none" }}
                            >
                              Explore {category.title}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </motion.div>

          <Divider sx={{ my: 6 }} />

          {/* Popular Tools Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
              >
                Popular Tools
              </Typography>

              <Grid container spacing={2}>
                {popularTools.map((tool, index) => (
                  <Grid item xs={12} sm={6} md={4} key={tool.path}>
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.6 + index * 0.1 }}
                    >
                      <Card
                        elevation={2}
                        sx={{
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: theme.shadows[6],
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, textAlign: "center" }}>
                          <Typography
                            variant="h6"
                            fontWeight="600"
                            gutterBottom
                          >
                            {tool.title}
                          </Typography>
                          <Chip
                            label={tool.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mb: 2 }}
                          />
                          <br />
                          <Button
                            component={Link}
                            href={tool.path}
                            variant="text"
                            size="small"
                            endIcon={<Launch />}
                            sx={{ textTransform: "none" }}
                          >
                            Use Tool
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* All Tools Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
              >
                All Tools ({toolsData.length})
              </Typography>

              <Grid container spacing={1}>
                {toolsData.map((tool, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={tool.id}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 2.0 + index * 0.02 }}
                    >
                      <Card
                        elevation={1}
                        sx={{
                          transition: "all 0.2s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: theme.shadows[4],
                          },
                        }}
                      >
                        <CardContent sx={{ p: 2, textAlign: "center" }}>
                          <Typography
                            variant="body2"
                            fontWeight="600"
                            gutterBottom
                            sx={{ fontSize: "0.875rem" }}
                          >
                            {tool.title}
                          </Typography>
                          <Button
                            component={Link}
                            href={tool.route || `/tools/${tool.id}`}
                            variant="text"
                            size="small"
                            sx={{ 
                              textTransform: "none",
                              fontSize: "0.75rem",
                              minWidth: "auto",
                              p: 0.5
                            }}
                          >
                            Use Tool
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Footer Note */}
          <Box
            sx={{
              textAlign: "center",
              mt: 6,
              p: 3,
              bgcolor: theme.palette.action.hover,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              This sitemap is automatically updated to reflect the latest tools
              and pages available on KodeKit. For technical sitemap information,
              visit{" "}
              <Link href="/sitemap.xml" target="_blank" rel="noopener noreferrer">
                sitemap.xml
              </Link>
            </Typography>
          </Box>

          <AdSense adSlot="6613251015" />
        </Paper>
      </motion.div>
    </Container>
  );
}