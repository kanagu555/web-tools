/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  width?: number | string;
  height?: number | string;
  adLayout?: string;
  adLayoutKey?: string;
  adTest?: "on" | "off";
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = "auto",
  style = { display: "block" },
  width,
  height,
  adLayout,
  adLayoutKey,
  adTest,
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };

  // Generate JSON-LD for advertising disclosure
  const advertisingDisclosureJsonLd = {
    "@context": "https://schema.org",
    "@type": "WPAdBlock",
    name: "Advertisement",
    description: "This is an advertisement from Google AdSense",
    isAccessibleForFree: false,
    hasPart: {
      "@type": "WebPageElement",
      isAccessibleForFree: false,
      cssSelector: ".adsbygoogle",
    },
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(advertisingDisclosureJsonLd)}
        </script>
      </Helmet>

      <Box
        component="aside"
        className="adsbygoogle-container"
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
          data-ad-client="ca-pub-3393138141509318"
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive="true"
          {...(adLayout ? { "data-ad-layout": adLayout } : {})}
          {...(adLayoutKey ? { "data-ad-layout-key": adLayoutKey } : {})}
          {...(adTest ? { "data-adtest": adTest } : {})}
          aria-hidden="true"
          tabIndex={-1}
        />
      </Box>
    </>
  );
};

export default AdSense;
