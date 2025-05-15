import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Container, 
  Button,
  useTheme
} from '@mui/material';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ToolCard from './ToolCard';
import { popularTools, toolCategories } from '../data/toolsData';

interface ToolGridProps {
  category?: string;
  limit?: number;
  title?: string;
}

const ToolGrid: React.FC<ToolGridProps> = ({ 
  category, 
  limit = 6,
  title = "Popular Tools" 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <Box
      sx={{
        py: 6,
        background: theme.palette.background.default,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          
          <Button 
            endIcon={<ArrowRight size={16} />}
            color="primary"
            sx={{ fontWeight: 500 }}
          >
            View All
          </Button>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={3}>
            {popularTools.slice(0, limit).map((tool) => (
              <Grid item xs={12} sm={6} md={4} key={tool.id}>
                <motion.div variants={itemVariants}>
                  <ToolCard tool={tool} />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {!category && (
          <Box sx={{ mt: 8 }}>
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 4,
              }}
            >
              Tool Categories
            </Typography>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Grid container spacing={3}>
                {toolCategories.map((category) => (
                  <Grid item xs={12} sm={6} md={3} key={category.id}>
                    <motion.div variants={itemVariants}>
                      <Box
                        onClick={() => handleCategoryClick(category.id)}
                        sx={{
                          p: 3,
                          height: '160px',
                          borderRadius: 3,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          backgroundColor: theme.palette.background.paper,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                            backgroundColor: `${theme.palette.primary.main}10`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                            mb: 2,
                          }}
                        >
                          {category.icon}
                        </Box>
                        <Typography variant="h6" component="h3" fontWeight={600}>
                          {category.title}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ToolGrid;