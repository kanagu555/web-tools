"use client";

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";

interface AdSenseProps {
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// Google AdSense client ID from environment variables
const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID || "ca-pub-3393138141509318";

// Check if AdSense is enabled
const isAdSenseEnabled = !!ADSENSE_CLIENT_ID;

// Declare global adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdSense = ({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style = {},
  className = "",
}: AdSenseProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAdSenseEnabled || !adRef.current) {
      return;
    }

    try {
      // Initialize adsbygoogle array if it doesn't exist
      if (typeof window !== "undefined") {
        window.adsbygoogle = window.adsbygoogle || [];

        // Push the ad configuration
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  // If AdSense is not configured, show placeholder in development
  if (!isAdSenseEnabled) {
    if (process.env.NODE_ENV === "development") {
      return (
        <Box
          sx={{
            width: "100%",
            height: 90,
            backgroundColor: "background.default",
            border: "1px dashed",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            my: 3,
            borderRadius: 1,
            ...style,
          }}
          className={className}
        >
          <span style={{ opacity: 0.5, fontSize: "12px" }}>
            AdSense Ad Slot: {adSlot} (Development Mode)
          </span>
        </Box>
      );
    }
    return null;
  }

  return (
    <Box
      ref={adRef}
      sx={{
        width: "100%",
        my: 3,
        textAlign: "center",
        ...style,
      }}
      className={className}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          width: "100%",
          height: "auto",
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      />
    </Box>
  );
};

export default AdSense;
