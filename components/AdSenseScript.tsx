"use client";

import Script from 'next/script';

// Google AdSense client ID from environment variables
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID;

// Check if AdSense is enabled
const isAdSenseEnabled = !!ADSENSE_CLIENT_ID;

/**
 * Google AdSense script component
 * Loads the AdSense script once globally
 */
export default function AdSenseScript() {
  // Don't render anything if AdSense is not enabled
  if (!isAdSenseEnabled) {
    return null;
  }

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}