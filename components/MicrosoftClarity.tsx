"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    clarity: any;
  }
}

const MicrosoftClarity: React.FC = () => {
  useEffect(() => {
    // Only load in production
    if (process.env.NODE_ENV !== "production") return;

    // Check if Clarity is already loaded
    if (window.clarity) return;

    // Check if we have a Clarity project ID
    if (!process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID) return;

    // Microsoft Clarity tracking code with proper TypeScript typing
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}?ref=bwt`;

    // Initialize Clarity function
    (window as any).clarity =
      (window as any).clarity ||
      function () {
        ((window as any).clarity.q = (window as any).clarity.q || []).push(
          arguments
        );
      };

    // Insert script into document
    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default MicrosoftClarity;
