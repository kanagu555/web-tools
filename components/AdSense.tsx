"use client";

// Extend the Window interface to include adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useAdStyles } from "@/styles/styles";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  fullWidth?: boolean;
  adClient?: string; // Make Publisher ID configurable
}

export default function AdSense({
  adSlot,
  adFormat = "auto",
  fullWidth = true,
  adClient = "ca-pub-3393138141509318", // Default Publisher ID
}: AdSenseProps) {
  const classes = useAdStyles();
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google AdSense script if it hasn't been loaded yet
    const scriptId = "adsbygoogle-script";
    let hasAdScript = document.getElementById(scriptId);

    if (!hasAdScript) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
      hasAdScript = script;
    }

    // Initialize ads after script is loaded
    const initializeAd = () => {
      // Improved error handling in AdSense component
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } else {
          console.warn("AdSense warning: adsbygoogle is not defined yet. Will retry.");
          // Set a retry mechanism
          setTimeout(initializeAd, 1000);
        }
      } catch (error) {
        console.error("AdSense initialization error:", error);
        // Potentially add fallback content or error reporting
      }
    };

    // Wait for script to load before initializing
    if (hasAdScript.hasAttribute("data-loaded")) {
      initializeAd();
    } else {
      hasAdScript.addEventListener("load", () => {
        hasAdScript?.setAttribute("data-loaded", "true");
        initializeAd();
      });
    }

    // No need to remove the script on unmount as it should be reused
    return () => {};
  }, [adClient]);

  let adStyle = {};

  // Improve responsive handling
  switch (adFormat) {
    case "rectangle":
      adStyle = { 
        display: "inline-block", 
        width: "300px", 
        height: "250px",
        maxWidth: "100%" // Add max-width for responsiveness
      };
      break;
    case "horizontal":
      adStyle = { display: "inline-block", width: "728px", height: "90px" };
      break;
    case "vertical":
      adStyle = { display: "inline-block", width: "160px", height: "600px" };
      break;
    case "auto":
    default:
      adStyle = { display: "block" };
      break;
  }

  return (
    <Box
      ref={adRef}
      className={classes.adContainer}
      sx={{ width: fullWidth ? "100%" : "auto" }}
    >
      <Typography component="span" className={classes.adLabel}>
        Advertisement
      </Typography>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat === "auto" ? "auto" : undefined}
        data-full-width-responsive={adFormat === "auto" ? "true" : undefined}
        aria-label="Google AdSense Advertisement"
      />
    </Box>
  );
}
