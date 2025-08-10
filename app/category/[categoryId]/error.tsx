'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Alert,
  Collapse,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { logPageError } from '@/lib/utils/errorLogging';
import { toolCategories } from '@/lib/data/toolsData';

interface CategoryErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CategoryError({ error, reset }: CategoryErrorProps) {
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const [showDetails, setShowDetails] = React.useState(false);

  useEffect(() => {
    // Log the error using our comprehensive error logging system
    logPageError(error, `category/${categoryId}`, { categoryId });
  }, [error, categoryId]);

  const currentCategory = toolCategories.find(cat => cat.id === categoryId);
  const otherCategories = toolCategories.filter(cat => cat.id !== categoryId).slice(0, 4);

  const handleRetry = () => {
    try {
      reset();
    } catch (resetError) {
      console.error('Error during reset:', resetError);
      // Fallback: reload the page
      window.location.reload();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Card 
        sx={{ 
          textAlign: 'center',
          p: 4,
          border: '1px solid',
          borderColor: 'error.light',
        }}
      >
        <CardContent>
          <ErrorIcon 
            color="error" 
            sx={{ fontSize: 64, mb: 3 }} 
          />
          
          <Typography variant="h4" component="h1" gutterBottom color="error.main">
            Category Loading Error
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            We encountered an error while loading the{' '}
            <strong>{currentCategory?.title || categoryId}</strong> category page. 
            This might be due to a temporary issue or network problem.
          </Typography>

          {/* Error Actions */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            sx={{ mt: 4, mb: 4 }}
          >
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRetry}
              color="primary"
            >
              Try Again
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<CategoryIcon />}
              component={Link}
              href="/categories"
            >
              Browse Categories
            </Button>
            
            <Button
              variant="text"
              startIcon={<HomeIcon />}
              component={Link}
              href="/"
            >
              Go Home
            </Button>
          </Stack>

          {/* Other Categories */}
          {otherCategories.length > 0 && (
            <Box sx={{ mt: 4, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Try Other Categories
              </Typography>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                flexWrap="wrap"
              >
                {otherCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant="outlined"
                    size="small"
                    component={Link}
                    href={`/category/${category.id}`}
                    startIcon={React.cloneElement(category.icon, { sx: { fontSize: '1rem' } })}
                  >
                    {category.title}
                  </Button>
                ))}
              </Stack>
            </Box>
          )}

          {/* Development Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => setShowDetails(!showDetails)}
                startIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                {showDetails ? 'Hide' : 'Show'} Error Details
              </Button>
              
              <Collapse in={showDetails}>
                <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Development Error Details:
                  </Typography>
                  <Box component="pre" sx={{ fontSize: '0.75rem', overflow: 'auto' }}>
                    {error.message}
                  </Box>
                  {error.digest && (
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Error ID: {error.digest}
                    </Typography>
                  )}
                  {error.stack && (
                    <Box>
                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                        Stack Trace:
                      </Typography>
                      <Box 
                        component="pre" 
                        sx={{ 
                          fontSize: '0.7rem', 
                          overflow: 'auto', 
                          maxHeight: '200px',
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          p: 1,
                          borderRadius: 1,
                        }}
                      >
                        {error.stack}
                      </Box>
                    </Box>
                  )}
                </Alert>
              </Collapse>
            </Box>
          )}

          <Box mt={4}>
            <Typography variant="body2" color="text.secondary">
              If this problem persists, please try refreshing the page or clearing your browser cache.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}