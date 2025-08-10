'use client';

import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { WifiOff, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <WifiOff size={64} color="#666" />
        </Box>
        
        <Typography variant="h3" component="h1" gutterBottom>
          You're Offline
        </Typography>
        
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          It looks like you're not connected to the internet. Some features may not be available.
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 4 }}>
          Don't worry! Many of our tools work offline once they've been loaded. 
          You can still use cached tools and features.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Home size={20} />}
            component={Link}
            href="/"
            sx={{ minWidth: 140 }}
          >
            Go Home
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={20} />}
            onClick={() => window.location.reload()}
            sx={{ minWidth: 140 }}
          >
            Try Again
          </Button>
        </Box>
        
        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Tip:</strong> When you're back online, the app will automatically sync 
            and you'll have access to all features again.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}