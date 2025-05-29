import React, { useEffect, useState } from "react";
import { Button, Snackbar, Alert, Typography } from "@mui/material";
import { Download } from "lucide-react";

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
    <Snackbar
      open={showInstallPrompt}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ bottom: { xs: 16, sm: 24 } }}
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
      >
        <Typography variant="body2" sx={{ mr: 2 }}>
          Install KodeKit for offline use
        </Typography>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={handleInstallClick}
          startIcon={<Download size={16} />}
        >
          Install
        </Button>
      </Alert>
    </Snackbar>
  );
};

export default PWAInstallPrompt;
