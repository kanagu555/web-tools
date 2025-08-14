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
  useEffect(() => {
    // Skip AdSense initialization in development to prevent errors
    if (process.env.NODE_ENV === "development") {
      console.log(`AdSense disabled in development mode for slot: ${adSlot}`);
      return;
    }

    try {
      // More robust check for already initialized ads
      const adElement = document.querySelector(
        `ins[data-ad-slot="${adSlot}"]`
      ) as HTMLElement;
      if (adElement) {
        // Check multiple possible attributes that indicate ad is already loaded
        const isAlreadyLoaded =
          adElement.getAttribute("data-adsbygoogle-status") ||
          adElement.getAttribute("data-ad-status") ||
          adElement.hasAttribute("data-adsbygoogle-status") ||
          adElement.innerHTML.trim() !== "" ||
          adElement.style.display === "none";

        if (isAlreadyLoaded) {
          console.log(`AdSense slot ${adSlot} already initialized, skipping`);
          return;
        }
      }

      // Add a small delay to prevent race conditions
      setTimeout(() => {
        // Double-check before pushing
        const currentElement = document.querySelector(
          `ins[data-ad-slot="${adSlot}"]`
        ) as HTMLElement;
        if (
          currentElement &&
          currentElement.getAttribute("data-adsbygoogle-status")
        ) {
          return;
        }

        // Initialize adsbygoogle array and push
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }, 100);
    } catch (error) {
      console.error("AdSense error:", error);
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
          AdSense Slot: {adSlot}
        </Box>
      )}
    </Box>
  );
};

export default AdSense;
