"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
} from "@mui/material";
import Link from "next/link";
import { toolCategories, toolsData } from "@/lib/data/toolsData";

const ToolCategories: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            mb: 2,
          }}
        >
          Tool Categories
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: "auto" }}
        >
          Explore our comprehensive collection of tools organized by category
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {toolCategories.map((category) => {
          // Count tools in this category
          const toolCount = toolsData.filter(
            (tool) => tool.category === category.id
          ).length;
          const popularCount = toolsData.filter(
            (tool) => tool.category === category.id && tool.popular
          ).length;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <Card
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease-in-out",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                    background:
                      "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
                  },
                }}
              >
                <CardActionArea
                  component={Link}
                  href={`/category/${category.id}`}
                  sx={{ height: "100%", p: 0 }}
                >
                  <CardContent
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      p: 3,
                    }}
                  >
                    {/* Category Icon */}
                    <Box
                      sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%)",
                        border: "1px solid rgba(25, 118, 210, 0.2)",
                      }}
                    >
                      {React.cloneElement(category.icon, {
                        sx: { fontSize: 32, color: "primary.main" },
                      })}
                    </Box>

                    {/* Category Title */}
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {category.title}
                    </Typography>

                    {/* Category Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flexGrow: 1,
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.4,
                      }}
                    >
                      {category.description}
                    </Typography>

                    {/* Tool Count and Popular Badge */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Chip
                        label={`${toolCount} tools`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {popularCount > 0 && (
                        <Chip
                          label={`${popularCount} popular`}
                          size="small"
                          color="warning"
                          variant="filled"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      )}
                    </Stack>

                    {/* Explore Link */}
                    <Typography
                      variant="body2"
                      color="primary.main"
                      fontWeight={500}
                      sx={{ mt: 2 }}
                    >
                      Explore →
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ToolCategories;
