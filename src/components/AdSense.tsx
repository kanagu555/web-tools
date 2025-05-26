import React, { useEffect } from "react";
import { Box } from "@mui/material";

interface AdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = "auto",
  style = { display: "block" },
}) => {
  useEffect(() => {
    try {
      // This is the key part - it tells AdSense to fill this slot
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <Box className="adsbygoogle-container" sx={{ my: 2, textAlign: "center" }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-3393138141509318"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </Box>
  );
};

export default AdSense;
