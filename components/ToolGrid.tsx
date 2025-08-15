'use client';

import React from 'react';
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
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import Link from 'next/link';
import { toolsData, toolCategories } from '@/lib/data/toolsData';
import { getToolIcon } from '@/lib/utils/toolIcons';

interface ToolGridProps {
  category?: string;
  limit?: number;
  title?: string;
}

const ToolGrid: React.FC<ToolGridProps> = ({
  category,
  limit = 6,
  title = 'Popular Tools',
}) => {
  // Filter tools by category if provided, otherwise show popular tools
  const filteredTools = category
    ? toolsData.filter((tool) => tool.category === category).slice(0, limit)
    : toolsData.filter((tool) => tool.popular).slice(0, limit);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontWeight: 700,
            mb: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Discover our most popular and frequently used developer tools
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {filteredTools.map((tool) => {
          const toolCategory = toolCategories.find(cat => cat.id === tool.category);
          
          return (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <Card
                className="tool-card"
                sx={{
                  height: '100%',
                  position: 'relative',
                  '&:hover': {
                    boxShadow: 6,
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
                  href={tool.route || '#'}
                  sx={{ height: '100%', p: 0 }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
                    {/* Tool Icon and Title */}
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      {getToolIcon(tool.icon) || (toolCategory && React.cloneElement(toolCategory.icon, { 
                        sx: { fontSize: 28, color: 'primary.main' } 
                      }))}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="h3" noWrap>
                          {tool.title}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flexGrow: 1,
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.5,
                      }}
                    >
                      {tool.description}
                    </Typography>

                    {/* Category Badge */}
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip
                        label={toolCategory?.title || tool.category}
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

      {/* View All Button */}
      {category && (
        <Box textAlign="center" mt={6}>
          <Card
            component={Link}
            href={`/category/${category}`}
            sx={{
              p: 3,
              textDecoration: 'none',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
            }}
          >
            <Typography variant="h6" color="primary.main" gutterBottom>
              View All {toolCategories.find(cat => cat.id === category)?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explore more tools in this category
            </Typography>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default ToolGrid;