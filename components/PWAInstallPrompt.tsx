"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Snackbar,
  Alert,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if user has dismissed the prompt before
  const checkDismissed = useCallback(() => {
    if (typeof window !== "undefined") {
      const dismissedTime = localStorage.getItem("pwa-install-dismissed");
      if (dismissedTime) {
        const dismissedDate = new Date(dismissedTime);
        const now = new Date();
        const daysSinceDismissed =
          (now.getTime() - dismissedDate.getTime()) / (1000 * 3600 * 24);
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
    if (!mounted || typeof window === "undefined") return;

    // Add a small delay to ensure proper hydration
    const initTimer = setTimeout(() => {
      // Enhanced mobile detection
      const isMobileDevice =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
          navigator.userAgent
        ) ||
        window.innerWidth <= 768 ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0;

      setIsMobile(isMobileDevice);

      // Only proceed if it's a mobile device
      if (!isMobileDevice) {
        return;
      }

      // Enhanced standalone detection
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.matchMedia("(display-mode: minimal-ui)").matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes("android-app://");

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

      // Enhanced device detection
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream;

      const isAndroidDevice = /Android/.test(navigator.userAgent);

      setIsIOS(isIOSDevice);

      // For iOS, show install prompt after a delay since there's no beforeinstallprompt
      if (isIOSDevice) {
        const iosTimer = setTimeout(() => {
          setShowInstallPrompt(true);
        }, 5000); // Show after 5 seconds on iOS

        return () => clearTimeout(iosTimer);
      }

      // For Android devices, we need to handle both beforeinstallprompt and fallback
      let hasBeforeInstallPrompt = false;

      const handleBeforeInstallPrompt = (e: Event) => {
        console.log("PWA: beforeinstallprompt event fired");
        hasBeforeInstallPrompt = true;
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
        console.log("PWA: appinstalled event fired");
        // Hide the install button when the app is installed
        setShowInstallPrompt(false);
        setInstalled(true);
        // Clear dismissed flag
        if (typeof window !== "undefined") {
          localStorage.removeItem("pwa-install-dismissed");
        }
      };

      // Add event listeners
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      // Fallback for Android devices that don't fire beforeinstallprompt
      // This can happen if the PWA criteria aren't fully met or browser restrictions
      if (isAndroidDevice) {
        const fallbackTimer = setTimeout(() => {
          if (!hasBeforeInstallPrompt && !isStandaloneMode) {
            console.log("PWA: Using fallback prompt for Android");
            // Show manual install instructions for Android
            setShowInstallPrompt(true);
          }
        }, 8000); // Wait 8 seconds for beforeinstallprompt

        return () => {
          clearTimeout(fallbackTimer);
          window.removeEventListener(
            "beforeinstallprompt",
            handleBeforeInstallPrompt
          );
          window.removeEventListener("appinstalled", handleAppInstalled);
        };
      }

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }, 500); // Longer delay for hydration

    return () => clearTimeout(initTimer);
  }, [mounted, checkDismissed]);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, we can't programmatically install, so we show instructions
      alert(
        'To install this app on your iOS device:\n\n1. Tap the Share button (⬆️) in Safari\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" to confirm'
      );
      return;
    }

    // Check if we have the beforeinstallprompt event
    if (installPrompt) {
      try {
        console.log("PWA: Triggering install prompt");
        // Show the install prompt
        await installPrompt.prompt();

        // Wait for the user to respond to the prompt
        const choiceResult = await installPrompt.userChoice;
        console.log("PWA: User choice:", choiceResult.outcome);

        // Reset the install prompt variable
        setInstallPrompt(null);

        if (choiceResult.outcome === "accepted") {
          setShowInstallPrompt(false);
          setInstalled(true);
        } else {
          handleDismiss();
        }
      } catch (error) {
        console.error("Error during PWA installation:", error);
        // Fallback to manual instructions
        showManualInstallInstructions();
      }
    } else {
      // Fallback for Android devices without beforeinstallprompt
      showManualInstallInstructions();
    }
  };

  const showManualInstallInstructions = () => {
    const isAndroid = /Android/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isSamsung = /SamsungBrowser/.test(navigator.userAgent);

    let instructions = "";

    if (isAndroid) {
      if (isChrome || isSamsung) {
        instructions =
          'To install this app:\n\n1. Tap the menu (⋮) in your browser\n2. Tap "Add to Home screen" or "Install app"\n3. Tap "Add" or "Install" to confirm';
      } else if (isFirefox) {
        instructions =
          'To install this app:\n\n1. Tap the menu (⋮) in Firefox\n2. Tap "Install"\n3. Tap "Add to Home Screen"';
      } else {
        instructions =
          'To install this app:\n\n1. Look for "Add to Home Screen" or "Install" in your browser menu\n2. Follow the prompts to add the app to your home screen';
      }
    } else {
      instructions =
        'To install this app, look for "Add to Home Screen" or "Install" option in your browser menu.';
    }

    alert(instructions);
    handleDismiss();
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setDismissed(true);
    // Remember dismissal for 7 days
    if (typeof window !== "undefined") {
      localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
    }
  };

  // Don't show if not mounted, not mobile, installed, dismissed, or in standalone mode
  if (
    !mounted ||
    !isMobile ||
    !showInstallPrompt ||
    installed ||
    dismissed ||
    isStandalone
  )
    return null;

  // Prevent hydration mismatch by only rendering after mount
  if (typeof window === "undefined") return null;

  const getInstallIcon = () => {
    if (isIOS) return <Smartphone size={16} aria-hidden="true" />;
    return <Download size={16} aria-hidden="true" />;
  };

  const getInstallText = () => {
    if (isIOS) return "Add to Home Screen";
    if (installPrompt) return "Install App";
    return "Install Guide";
  };

  const getPromptText = () => {
    if (isIOS) return "Add KodeKit to your home screen for quick access";
    if (installPrompt)
      return "Install KodeKit for offline use and faster access";
    return "Get KodeKit on your home screen for quick access";
  };

  return (
    <Snackbar
      open={showInstallPrompt}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{
        bottom: { xs: 16, sm: 24 },
        left: { xs: 16, sm: "auto" },
        right: { xs: 16, sm: "auto" },
        width: { xs: "calc(100% - 32px)", sm: "auto" },
        maxWidth: { sm: 400 },
      }}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <Alert
        severity="info"
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          "& .MuiAlert-message": {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            flexWrap: "wrap",
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
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}
        >
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
              minWidth: "auto",
              px: 2,
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
