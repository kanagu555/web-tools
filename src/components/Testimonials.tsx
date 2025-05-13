import React from 'react';
import { Box, Container, Typography, Grid, Paper, Avatar, Rating, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Product Designer',
    avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'KodeKit has revolutionized my workflow. The PDF tools save me hours every week, and the interface is incredibly intuitive.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Full-Stack Developer',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    quote: 'As a developer, I appreciate how comprehensive and reliable these tools are. The JSON formatter and code beautifier are my go-to resources now.',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Content Manager',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 4,
    quote: 'The text tools have been a game-changer for our team. We use the translator daily, and it has significantly improved our localization process.',
  },
];

const Testimonials = () => {
  const theme = useTheme();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <Box
      sx={{
        py: 8,
        background: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <Box
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-20%',
          width: '140%',
          height: '200%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}05 0%, transparent 60%)`,
          transform: 'rotate(-10deg)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            What Our Users Say
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ maxWidth: '700px', mx: 'auto' }}
          >
            Join thousands of satisfied users who trust KodeKit for their daily tasks
          </Typography>
        </Box>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid item xs={12} md={4} key={testimonial.id}>
                <motion.div variants={itemVariants}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Typography
                      variant="body1"
                      paragraph
                      sx={{ 
                        flex: 1,
                        fontStyle: 'italic',
                        color: theme.palette.text.secondary,
                        mb: 3,
                      }}
                    >
                      "{testimonial.quote}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        sx={{ width: 48, height: 48, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Testimonials;