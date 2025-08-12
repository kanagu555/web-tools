"use client";

import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  CloudOff as CloudOffIcon,
  Star as StarIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { toolsData, toolCategories } from "@/lib/data/toolsData";
import { getToolIcon } from "@/lib/utils/toolIcons";

export default function QuickStartClient() {
  // Get popular tools for recommendations
  const popularTools = toolsData.filter((tool) => tool.popular).slice(0, 6);
  
  // Get one tool from each category for showcase
  const categoryShowcase = toolCategories.map((category) => {
    const categoryTool = toolsData.find((tool) => tool.category === category.id);
    return { category, tool: categoryTool };
  }).filter((item) => item.tool);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: 800,
                mb: 2,
                background: "linear-gradient(90deg, #1976d2, #9c27b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Quick Start Guide
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
            >
              Get up and running with KodeKit's powerful tools in minutes. 
              No installation, no registration, just instant productivity.
            </Typography>
            
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Chip
                icon={<SpeedIcon />}
                label="Instant Access"
                color="primary"
                variant="filled"
              />
              <Chip
                icon={<SecurityIcon />}
                label="Privacy First"
                color="success"
                variant="filled"
              />
              <Chip
                icon={<CloudOffIcon />}
                label="No Registration"
                color="info"
                variant="filled"
              />
            </Stack>
          </Box>
        </motion.div>

        {/* How It Works Section */}
        <motion.div variants={itemVariants}>
          <Box mb={8}>
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              sx={{ mb: 6, fontSize: { xs: "2rem", md: "2.5rem" } }}
            >
              How It Works
            </Typography>
            
            <Grid container spacing={4}>
              {[
                {
                  step: "1",
                  title: "Choose Your Tool",
                  description: "Browse our categories or use the search to find the perfect tool for your task.",
                  icon: <PlayArrowIcon sx={{ fontSize: 40 }} />,
                },
                {
                  step: "2", 
                  title: "Upload or Input Data",
                  description: "Add your files, text, or data directly in your browser. Everything stays private.",
                  icon: <CloudOffIcon sx={{ fontSize: 40 }} />,
                },
                {
                  step: "3",
                  title: "Get Instant Results",
                  description: "Process your data instantly and download results. No waiting, no limits.",
                  icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
                },
              ].map((step, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      p: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Step {step.step}: {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        <Divider sx={{ my: 8 }} />

        {/* Popular Tools Section */}
        <motion.div variants={itemVariants}>
          <Box mb={8}>
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              sx={{ mb: 2, fontSize: { xs: "2rem", md: "2.5rem" } }}
            >
              Start with Popular Tools
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6 }}
            >
              Try these most-loved tools to get familiar with KodeKit
            </Typography>

            <Grid container spacing={3}>
              {popularTools.map((tool) => {
                const category = toolCategories.find((cat) => cat.id === tool.category);
                return (
                  <Grid item xs={12} sm={6} md={4} key={tool.id}>
                    <Card
                      sx={{
                        height: "100%",
                        position: "relative",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      {/* Popular Star Badge */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 2,
                          backgroundColor: "#FFD700",
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
                        }}
                      >
                        <StarIcon sx={{ fontSize: 16, color: "#000" }} />
                      </Box>

                      <CardActionArea
                        component={Link}
                        href={tool.route || "#"}
                        sx={{ height: "100%", p: 0 }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                            {getToolIcon(tool.icon)}
                            <Typography variant="h6" component="h3">
                              {tool.title}
                            </Typography>
                          </Stack>
                          
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, minHeight: 40 }}
                          >
                            {tool.description}
                          </Typography>
                          
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Chip
                              label={category?.title}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Typography
                              variant="body2"
                              color="primary.main"
                              fontWeight={500}
                            >
                              Try Now →
                            </Typography>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </motion.div>

        <Divider sx={{ my: 8 }} />

        {/* Categories Overview */}
        <motion.div variants={itemVariants}>
          <Box mb={8}>
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              sx={{ mb: 2, fontSize: { xs: "2rem", md: "2.5rem" } }}
            >
              Explore by Category
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              textAlign="center"
              sx={{ mb: 6 }}
            >
              Discover tools organized by your workflow needs
            </Typography>

            <Grid container spacing={3}>
              {categoryShowcase.slice(0, 6).map(({ category, tool }) => (
                <Grid item xs={12} sm={6} md={4} key={category.id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/category/${category.id}`}
                      sx={{ height: "100%", p: 0 }}
                    >
                      <CardContent sx={{ p: 3, textAlign: "center" }}>
                        <Box sx={{ mb: 2 }}>
                          {React.cloneElement(category.icon, {
                            sx: { fontSize: 48, color: "primary.main" },
                          })}
                        </Box>
                        
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                          {category.title}
                        </Typography>
                        
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2, minHeight: 40 }}
                        >
                          {category.description}
                        </Typography>
                        
                        {tool && (
                          <Typography
                            variant="body2"
                            color="primary.main"
                            fontWeight={500}
                          >
                            Try {tool.title} →
                          </Typography>
                        )}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        <Divider sx={{ my: 8 }} />

        {/* Tips Section */}
        <motion.div variants={itemVariants}>
          <Box mb={8}>
            <Typography
              variant="h2"
              component="h2"
              textAlign="center"
              sx={{ mb: 6, fontSize: { xs: "2rem", md: "2.5rem" } }}
            >
              Pro Tips
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, height: "100%" }}>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    🚀 Maximize Your Productivity
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Bookmark frequently used tools for quick access" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Use keyboard shortcuts when available" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary="Process multiple files in batch when supported" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 4, height: "100%" }}>
                  <Typography variant="h5" gutterBottom fontWeight={600}>
                    🔒 Privacy & Security
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="All processing happens in your browser" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Files are never uploaded to our servers" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Your data stays completely private" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants}>
          <Box textAlign="center" sx={{ py: 6 }}>
            <Typography variant="h4" gutterBottom fontWeight={600}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Choose your first tool and experience the power of KodeKit
            </Typography>
            
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                component={Link}
                href="/categories"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ px: 4, py: 1.5 }}
              >
                Browse All Tools
              </Button>
              <Button
                component={Link}
                href="/"
                variant="outlined"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Back to Home
              </Button>
            </Stack>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
}