import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
} from '@mui/material';
import {
  SearchOff as SearchOffIcon,
  Category as CategoryIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { toolCategories } from '@/lib/data/toolsData';

export default function CategoryNotFound() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <SearchOffIcon 
          color="primary" 
          sx={{ fontSize: 80, mb: 3, opacity: 0.7 }} 
        />
        
        <Typography variant="h3" component="h1" gutterBottom>
          Category Not Found
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph>
          The category you're looking for doesn't exist or may have been moved.
        </Typography>

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: 4, mb: 6 }}
        >
          <Button
            variant="contained"
            startIcon={<CategoryIcon />}
            component={Link}
            href="/categories"
            size="large"
          >
            Browse All Categories
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ExploreIcon />}
            component={Link}
            href="/"
            size="large"
          >
            Explore Tools
          </Button>
          
          <Button
            variant="text"
            startIcon={<HomeIcon />}
            component={Link}
            href="/"
            size="large"
          >
            Go Home
          </Button>
        </Stack>
      </Box>

      {/* Available Categories */}
      <Box>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          Available Categories
        </Typography>
        
        <Grid container spacing={3}>
          {toolCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent 
                  component={Link}
                  href={`/category/${category.id}`}
                  sx={{ 
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    height: '100%',
                    p: 3,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    {React.cloneElement(category.icon, { 
                      sx: { fontSize: 32, color: 'primary.main' } 
                    })}
                    <Typography variant="h6" component="h3" className="gradient-text">
                      {category.title}
                    </Typography>
                  </Stack>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}