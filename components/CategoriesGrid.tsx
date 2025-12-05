"use client";

import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { toolCategories, toolsData } from "@/lib/data/toolsData";

const CategoriesGrid: React.FC = () => {
  // Count tools per category
  const getCategoryToolCount = (categoryId: string) => {
    return toolsData.filter((tool) => tool.category === categoryId).length;
  };

  return (
    <Grid container spacing={4}>
      {toolCategories.map((category) => {
        const toolCount = getCategoryToolCount(category.id);

        return (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              sx={{
                height: "100%",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
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
                    p: 3,
                  }}
                >
                  {/* Category Icon and Title */}
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    mb={2}
                  >
                    {React.cloneElement(category.icon, {
                      sx: { fontSize: 32, color: "primary.main" },
                    })}
                    <Typography
                      variant="h5"
                      component="h2"
                      className="gradient-text"
                    >
                      {category.title}
                    </Typography>
                  </Stack>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      flexGrow: 1,
                      mb: 3,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {category.description}
                  </Typography>

                  {/* Tool Count */}
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Chip
                      label={`${toolCount} tools`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    <Typography
                      variant="body2"
                      color="primary.main"
                      fontWeight={500}
                    >
                      Explore →
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CategoriesGrid;
