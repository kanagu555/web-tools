import React, { useState, useEffect } from "react";
import { Fab, useTheme, Zoom } from "@mui/material";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
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

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <Zoom in={isVisible}>
      <Fab
        onClick={scrollToTop}
        color="primary"
        size="medium"
        aria-label="scroll to top"
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
        }}
      >
        <ArrowUp size={24} />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTop;
