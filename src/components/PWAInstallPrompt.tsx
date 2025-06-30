import { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Typography, Box } from "@mui/material";
import { Download } from "lucide-react";
import { Helmet } from "react-helmet";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show the install button
      setShowInstallPrompt(true);
    };

    const handleAppInstalled = () => {
      // Hide the install button when the app is installed
      setShowInstallPrompt(false);
      setInstalled(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;

    // Reset the install prompt variable
    setInstallPrompt(null);

    if (choiceResult.outcome === "accepted") {
      setShowInstallPrompt(false);
    }
  };

  if (!showInstallPrompt || installed) return null;

  return (
    <>
      <Helmet>
        {/* PWA meta tags for SEO */}
        <meta name="application-name" content="KodeKit" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KodeKit" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#1976d2" />

        {/* JSON-LD for WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "KodeKit",
            url: "https://kodekit.in",
            description:
              "All-in-one developer toolkit with offline capabilities",
            browserRequirements:
              "Requires JavaScript. Works offline when installed.",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          })}
        </script>
      </Helmet>

      <Snackbar
        open={showInstallPrompt}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: { xs: 16, sm: 24 } }}
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
            },
          }}
          role="alertdialog"
          aria-labelledby="pwa-install-heading"
          aria-describedby="pwa-install-description"
        >
          <Box id="pwa-install-heading">
            <Typography variant="body2" sx={{ mr: 2 }}>
              Install KodeKit for offline use
            </Typography>
          </Box>
          <Box id="pwa-install-description">
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleInstallClick}
              startIcon={<Download size={16} aria-hidden="true" />}
              aria-label="Install KodeKit as a Progressive Web App"
            >
              Install
            </Button>
          </Box>
        </Alert>
      </Snackbar>
    </>
  );
};

export default PWAInstallPrompt;
