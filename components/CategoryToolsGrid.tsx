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
  Divider,
} from "@mui/material";
import { Star as StarIcon } from "@mui/icons-material";
import Link from "next/link";
import { ToolItem, toolCategories, toolsData } from "@/lib/data/toolsData";
import { getToolIcon } from "@/lib/utils/toolIcons";

interface CategoryToolsGridProps {
  categoryId: string;
  category: (typeof toolCategories)[0];
  sortedTools: ToolItem[];
  popularTools: ToolItem[];
}

export default function CategoryToolsGrid({
  categoryId,
  category,
  sortedTools,
  popularTools,
}: CategoryToolsGridProps) {
  return (
    <>
      {/* All Tools Section */}
      <Box>
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 3 }}>
          {popularTools.length > 0 ? `All ${category.title}` : category.title}
        </Typography>
        <Grid container spacing={3}>
          {sortedTools.map((tool) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <ToolCard tool={tool} category={category} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ mt: 4 }} />

      {/* Related Categories */}
      <Box mt={8}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
          Explore Other Categories
        </Typography>
        <Grid container spacing={2}>
          {toolCategories
            .filter((cat) => cat.id !== categoryId)
            .slice(0, 4)
            .map((relatedCategory) => {
              const relatedToolCount = toolsData.filter(
                (tool) => tool.category === relatedCategory.id
              ).length;
              return (
                <Grid item xs={12} sm={6} md={3} key={relatedCategory.id}>
                  <Card
                    sx={{
                      transition: "all 0.2s ease-in-out",
                      border: "2px solid transparent",
                      "&:hover": {
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/category/${relatedCategory.id}`}
                    >
                      <CardContent sx={{ textAlign: "center", py: 2 }}>
                        <Box
                          sx={{
                            mb: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {React.cloneElement(relatedCategory.icon, {
                            sx: {
                              fontSize: 24,
                              color: "primary.main",
                            },
                          })}
                        </Box>
                        <Typography
                          variant="subtitle2"
                          component="h3"
                          gutterBottom
                          sx={{ mb: 1 }}
                        >
                          {relatedCategory.title}
                        </Typography>
                        <Chip
                          label={`${relatedToolCount} tools`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </Box>
    </>
  );
}

// Tool Card Component
interface ToolCardProps {
  tool: ToolItem;
  category: (typeof toolCategories)[0];
  isPopular?: boolean;
}

function ToolCard({ tool, category, isPopular = false }: ToolCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        transition: "all 0.3s ease-in-out",
        borderColor: isPopular ? "warning.main" : "divider",
        border: "2px solid transparent",
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      {/* Popular Star Badge - Top Right Corner */}
      {tool.popular && (
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
          <StarIcon
            sx={{
              fontSize: 16,
              color: "#000",
            }}
          />
        </Box>
      )}

      <CardActionArea
        component={Link}
        href={tool.route || "#"}
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
          {/* Tool Icon and Title */}
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            {getToolIcon(tool.icon)}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: 600,
                }}
              >
                {tool.title}
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="body2"
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
            {tool.description}
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              label={category.title}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Typography variant="body2" color="primary.main" fontWeight={500}>
              Try Now →
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
