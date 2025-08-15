"use client";

import { useEffect } from "react";
import { Box } from "@mui/material";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  adLayout?: string;
  adLayoutKey?: string;
  adTest?: "on" | "off";
  className?: string;
}

// Declare global adsbygoogle
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Google AdSense client ID from environment variables
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

const AdSense = ({
  adSlot,
  adFormat = "auto",
  style = { display: "block" },
  width,
  height,
  adLayout,
  adLayoutKey,
  adTest,
  className = "",
}: AdSenseProps) => {
  // Generate unique ID for this ad instance
  const adId = `adsense-${adSlot}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  useEffect(() => {
    // Skip AdSense initialization in development to prevent errors
    if (process.env.NODE_ENV === "development") {
      console.log(`AdSense disabled in development mode for slot: ${adSlot}`);
      return;
    }

    // Generate unique ID for this ad instance
    const adId = `adsense-${adSlot}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Add a delay to ensure DOM is ready and prevent conflicts
      const initTimeout = setTimeout(() => {
        const adElement = document.querySelector(
          `ins[data-ad-slot="${adSlot}"][data-ad-id="${adId}"]`
        ) as HTMLElement;
        
        if (!adElement) {
          console.warn(`AdSense element not found for slot: ${adSlot}`);
          return;
        }

        // Check if this specific element is already initialized
        const isAlreadyLoaded = 
          adElement.getAttribute("data-adsbygoogle-status") === "done" ||
          adElement.hasAttribute("data-ad-status") ||
          adElement.innerHTML.trim() !== "";

        if (isAlreadyLoaded) {
          console.log(`AdSense slot ${adSlot} already initialized, skipping`);
          return;
        }

        // Mark as being processed
        adElement.setAttribute("data-ad-status", "loading");

        try {
          // Initialize adsbygoogle array and push
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          console.log(`AdSense initialized for slot: ${adSlot}`);
        } catch (pushError) {
          console.error(`AdSense push error for slot ${adSlot}:`, pushError);
          adElement.setAttribute("data-ad-status", "error");
        }
      }, Math.random() * 200 + 100); // Random delay between 100-300ms

      return () => {
        clearTimeout(initTimeout);
      };
    } catch (error) {
      console.error(`AdSense error for slot ${adSlot}:`, error);
    }
  }, [adSlot]);

  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  return (
    <Box
      component="aside"
      className={`adsbygoogle-container ${className}`}
      sx={{
        my: 2,
        textAlign: "center",
        position: "relative",
      }}
      role="complementary"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={mergedStyle}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-id={adId}
        data-full-width-responsive="true"
        {...(adLayout ? { "data-ad-layout": adLayout } : {})}
        {...(adLayoutKey ? { "data-ad-layout-key": adLayoutKey } : {})}
        {...(adTest ? { "data-adtest": adTest } : {})}
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.1)",
            border: "1px dashed #ccc",
            fontSize: "12px",
            color: "#666",
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          {/* AdSense Slot: {adSlot} */}
        </Box>
      )}
    </Box>
  );
};

export default AdSense;
