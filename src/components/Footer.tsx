import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, IconButton, useTheme } from '@mui/material';
import { Code, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const theme = useTheme();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#' },
        { name: 'Pricing', href: '#' },
        { name: 'API', href: '#' },
        { name: 'Integrations', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Tutorials', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Help Center', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#' },
        { name: 'Careers', href: '#' },
        { name: 'Contact', href: '#' },
        { name: 'Privacy Policy', href: '#' },
      ],
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Code size={32} color={theme.palette.primary.main} />
              <Typography
                variant="h5"
                component="div"
                sx={{ 
                  ml: 1, 
                  fontWeight: 700,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                KodeKit
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              All-in-one toolkit for developers, designers, and content creators. 
              Transform, edit, and optimize your files with ease.
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <IconButton 
                size="small" 
                aria-label="github"
                sx={{ mr: 1, color: theme.palette.text.secondary }}
              >
                <Github size={20} />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="twitter"
                sx={{ mr: 1, color: theme.palette.text.secondary }}
              >
                <Twitter size={20} />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="linkedin"
                sx={{ mr: 1, color: theme.palette.text.secondary }}
              >
                <Linkedin size={20} />
              </IconButton>
              <IconButton 
                size="small" 
                aria-label="email"
                sx={{ color: theme.palette.text.secondary }}
              >
                <Mail size={20} />
              </IconButton>
            </Box>
          </Grid>
          
          {footerLinks.map((section) => (
            <Grid item xs={6} sm={4} md={2} key={section.title}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {section.title}
              </Typography>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                {section.links.map((link) => (
                  <li key={link.name} style={{ marginBottom: '8px' }}>
                    <Link
                      href={link.href}
                      variant="body2"
                      color="text.secondary"
                      underline="hover"
                      sx={{ transition: 'color 0.2s' }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Grid>
          ))}
          
          <Grid item xs={12} sm={4} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Legal
            </Typography>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
              }}
            >
              {[
                { name: 'Terms of Service', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Cookie Policy', href: '#' },
                { name: 'GDPR', href: '#' },
              ].map((link) => (
                <li key={link.name} style={{ marginBottom: '8px' }}>
                  <Link
                    href={link.href}
                    variant="body2"
                    color="text.secondary"
                    underline="hover"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} KodeKit. All rights reserved.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Link
              href="#"
              variant="body2"
              color="text.secondary"
              sx={{ mx: 1 }}
              underline="hover"
            >
              Privacy
            </Link>
            <Link
              href="#"
              variant="body2"
              color="text.secondary"
              sx={{ mx: 1 }}
              underline="hover"
            >
              Terms
            </Link>
            <Link
              href="#"
              variant="body2"
              color="text.secondary"
              sx={{ mx: 1 }}
              underline="hover"
            >
              Cookies
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;