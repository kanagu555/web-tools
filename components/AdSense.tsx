"use client"

import { useEffect } from "react"
import { Box, Typography } from "@mui/material"
import { useAdStyles } from "@/styles/styles"

interface AdSenseProps {
  adSlot: string
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical"
  fullWidth?: boolean
}

export default function AdSense({ adSlot, adFormat = "auto", fullWidth = true }: AdSenseProps) {
  const classes = useAdStyles()

  useEffect(() => {
    // Load Google AdSense script if it hasn't been loaded yet
    const hasAdScript = document.querySelector('script[src*="pagead2.googlesyndication.com"]')

    if (!hasAdScript) {
      const script = document.createElement("script")
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1140870049892126"
      script.async = true
      script.crossOrigin = "anonymous"
      document.head.appendChild(script)
    }

    // Initialize ads
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (error) {
      console.error("AdSense error:", error)
    }
  }, [])

  let adStyle = {}

  switch (adFormat) {
    case "rectangle":
      adStyle = { display: "inline-block", width: "300px", height: "250px" }
      break
    case "horizontal":
      adStyle = { display: "inline-block", width: "728px", height: "90px" }
      break
    case "vertical":
      adStyle = { display: "inline-block", width: "160px", height: "600px" }
      break
    case "auto":
    default:
      adStyle = { display: "block" }
      break
  }

  return (
    <Box className={classes.adContainer} sx={{ width: fullWidth ? "100%" : "auto" }}>
      <Typography component="span" className={classes.adLabel}>
        Advertisement
      </Typography>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-1140870049892126" // Replace with your AdSense Publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat === "auto" ? "auto" : undefined}
        data-full-width-responsive={adFormat === "auto" ? "true" : undefined}
      />
    </Box>
  )
}