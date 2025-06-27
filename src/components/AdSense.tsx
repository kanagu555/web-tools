/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Box } from "@mui/material";

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
  layout?: string;
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = "auto",
  style = { display: "block" },
  width,
  height,
  layout,
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

  return (
    <Box className="adsbygoogle-container" sx={{ my: 2, textAlign: "center" }}>
      <ins
        className="adsbygoogle"
        style={mergedStyle}
        data-ad-client="ca-pub-3393138141509318"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        {...(layout ? { "data-ad-layout": layout } : {})}
      />
    </Box>
  );
};

export default AdSense;
