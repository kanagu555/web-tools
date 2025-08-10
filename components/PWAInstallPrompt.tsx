'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Button, Snackbar, Alert, Typography, Box, IconButton } from '@mui/material';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if user has dismissed the prompt before
  const checkDismissed = useCallback(() => {
    if (typeof window !== 'undefined') {
      const dismissedTime = localStorage.getItem('pwa-install-dismissed');
      if (dismissedTime) {
        const dismissedDate = new Date(dismissedTime);
        const now = new Date();
        const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 3600 * 24);
        // Show again after 7 days
        return daysSinceDismissed < 7;
      }
    }
    return false;
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run after component is mounted
    if (!mounted || typeof window === 'undefined') return;

    // Add a small delay to ensure proper hydration
    const initTimer = setTimeout(() => {
      // Check if app is already installed or running in standalone mode
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone === true;
      
      setIsStandalone(isStandaloneMode);
      
      if (isStandaloneMode) {
        setInstalled(true);
        return;
      }

      // Check if user has dismissed recently
      if (checkDismissed()) {
        setDismissed(true);
        return;
      }

      // Detect iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(isIOSDevice);

      // For iOS, show install prompt after a delay since there's no beforeinstallprompt
      if (isIOSDevice) {
        const iosTimer = setTimeout(() => {
          setShowInstallPrompt(true);
        }, 5000); // Show after 5 seconds on iOS
        
        return () => clearTimeout(iosTimer);
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Store the event for later use
        setInstallPrompt(e as BeforeInstallPromptEvent);
        // Show the install button after a short delay
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
      };

      const handleAppInstalled = () => {
        // Hide the install button when the app is installed
        setShowInstallPrompt(false);
        setInstalled(true);
        // Clear dismissed flag
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pwa-install-dismissed');
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }, 500); // Longer delay for hydration

    return () => clearTimeout(initTimer);
  }, [mounted, checkDismissed]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, we can't programmatically install, so we show instructions
      alert('To install this app on your iOS device, tap the Share button and then "Add to Home Screen".');
      return;
    }

    if (!installPrompt) return;

    try {
      // Show the install prompt
      await installPrompt.prompt();

      // Wait for the user to respond to the prompt
      const choiceResult = await installPrompt.userChoice;

      // Reset the install prompt variable
      setInstallPrompt(null);

      if (choiceResult.outcome === 'accepted') {
        setShowInstallPrompt(false);
        setInstalled(true);
      } else {
        handleDismiss();
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      handleDismiss();
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // Remember dismissal for 7 days
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    }
  };

  // Don't show if not mounted, installed, dismissed, or in standalone mode
  if (!mounted || !showInstallPrompt || installed || dismissed || isStandalone) return null;

  const getInstallIcon = () => {
    if (isIOS) return <Smartphone size={16} aria-hidden="true" />;
    return <Download size={16} aria-hidden="true" />;
  };

  const getInstallText = () => {
    if (isIOS) return 'Add to Home Screen';
    return 'Install App';
  };

  const getPromptText = () => {
    if (isIOS) return 'Add KodeKit to your home screen for quick access';
    return 'Install KodeKit for offline use and faster access';
  };

  return (
    <Snackbar
      open={showInstallPrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ 
        bottom: { xs: 16, sm: 24 },
        left: { xs: 16, sm: 'auto' },
        right: { xs: 16, sm: 'auto' },
        width: { xs: 'calc(100% - 32px)', sm: 'auto' },
        maxWidth: { sm: 400 }
      }}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <Alert
        severity="info"
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          '& .MuiAlert-message': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            flexWrap: 'wrap',
            gap: 1,
          },
        }}
        role="alertdialog"
        aria-labelledby="pwa-install-heading"
        aria-describedby="pwa-install-description"
        action={
          <IconButton
            size="small"
            onClick={handleDismiss}
            aria-label="Dismiss install prompt"
            sx={{ ml: 1 }}
          >
            <X size={16} />
          </IconButton>
        }
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="body2" 
              id="pwa-install-heading"
              sx={{ fontWeight: 500, mb: 0.5 }}
            >
              {getPromptText()}
            </Typography>
            <Typography 
              variant="caption" 
              color="text.secondary"
              id="pwa-install-description"
            >
              Works offline • Faster loading • Native experience
            </Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleInstallClick}
            startIcon={getInstallIcon()}
            aria-label={`${getInstallText()} - Install KodeKit as a Progressive Web App`}
            sx={{ 
              flexShrink: 0,
              minWidth: 'auto',
              px: 2
            }}
          >
            {getInstallText()}
          </Button>
        </Box>
      </Alert>
    </Snackbar>
  );
};

export default PWAInstallPrompt;