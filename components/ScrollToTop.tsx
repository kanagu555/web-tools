"use client";

import React, { useState, useEffect } from "react";
import { Fab, useTheme, Zoom } from "@mui/material";
import { ArrowUp } from "lucide-react";

const ScrollToTop: React.FC = () => {
  const theme = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly with fallback
  const scrollToTop = () => {
    // First try smooth scrolling
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    // Fallback: Ensure we reach the top after smooth scroll completes
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        // If we're still not at the top, force scroll to top
        window.scrollTo(0, 0);
      }

      // Focus on the main content after scrolling
      const mainContent = document.querySelector("main");
      if (mainContent) {
        mainContent.setAttribute("tabindex", "-1");
        mainContent.focus();
      }
    }, 800); // Wait for smooth scroll animation to complete
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", toggleVisibility);
      return () => {
        window.removeEventListener("scroll", toggleVisibility);
      };
    }
  }, []);

  // Prevent hydration mismatch
  if (typeof window === "undefined") return null;

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={scrollToTop}
        color="primary"
        size="medium"
        aria-label="Scroll to top of page"
        role="button"
        tabIndex={isVisible ? 0 : -1}
        sx={{
          position: "fixed",
          bottom: { xs: 20, sm: 30 },
          right: { xs: 20, sm: 30 },
          zIndex: 1000,
          boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: `0 12px 24px ${theme.palette.primary.main}60`,
          },
          "&:active": {
            transform: "translateY(0px)",
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.secondary.main}`,
            outlineOffset: "2px",
          },
        }}
        // Additional ARIA attributes for better screen reader experience
        aria-hidden={!isVisible}
        aria-live="polite"
      >
        <ArrowUp
          size={24}
          aria-hidden="true" // Hide from screen readers since button has label
        />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTop;
