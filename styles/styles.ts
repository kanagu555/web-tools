import type { Theme } from "@mui/material/styles"
import { makeStyles } from "@mui/styles"

// Helper function to handle spacing
const getSpacing = (theme: Theme, value: number) => {
  if (typeof theme.spacing === "function") {
    return theme.spacing(value)
  }
  // Fallback: assume 8px per unit
  return `${value * 8}px`
}

// Helper function to handle breakpoints
const getBreakpoint = (theme: Theme, breakpoint: string, direction: "up" | "down") => {
  if (theme.breakpoints && typeof theme.breakpoints[direction] === "function") {
    return theme.breakpoints[direction](breakpoint)
  }

  // Fallback breakpoints
  const breakpoints = {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  }

  if (direction === "up") {
    return `@media (min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}px)`
  } else {
    return `@media (max-width: ${breakpoints[breakpoint as keyof typeof breakpoints] - 0.05}px)`
  }
}

// Helper function to handle palette colors
const getPaletteColor = (theme: Theme, type: string, variant?: string) => {
  if (!theme.palette) {
    // Fallback colors
    const fallbackColors = {
      primary: {
        main: "#3f51b5",
        light: "#757de8",
        dark: "#002984",
        contrastText: "#fff",
      },
      secondary: {
        main: "#f50057",
        light: "#ff4081",
        dark: "#c51162",
        contrastText: "#fff",
      },
      text: {
        primary: "rgba(0, 0, 0, 0.87)",
        secondary: "rgba(0, 0, 0, 0.54)",
        disabled: "rgba(0, 0, 0, 0.38)",
      },
      divider: "rgba(0, 0, 0, 0.12)",
      background: {
        paper: "#fff",
        default: "#fafafa",
      },
    }

    if (variant) {
      return (
        fallbackColors[type as keyof typeof fallbackColors]?.[
          variant as keyof (typeof fallbackColors)[keyof typeof fallbackColors]
        ] || "#000"
      )
    }
    return fallbackColors[type as keyof typeof fallbackColors] || "#000"
  }

  if (variant) {
    return theme.palette[type as keyof typeof theme.palette]?.[variant as string] || "#000"
  }
  return theme.palette[type as keyof typeof theme.palette] || "#000"
}

// Update the header styles to improve responsiveness
// Replace the useHeaderStyles with this improved version
export const useHeaderStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex?.appBar || 1200,
  },
  logo: {
    marginRight: getSpacing(theme, 2),
    display: "flex",
  },
  logoText: {
    fontWeight: 700,
    color: "inherit",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },
  menuButton: {
    marginRight: getSpacing(theme, 2),
    [getBreakpoint(theme, "md", "up")]: {
      display: "none",
    },
  },
  desktopMenu: {
    flexGrow: 1,
    display: "none",
    [getBreakpoint(theme, "md", "up")]: {
      display: "flex",
      alignItems: "center",
    },
  },
  mobileMenu: {
    display: "flex",
    [getBreakpoint(theme, "md", "up")]: {
      display: "none",
    },
  },
  navButton: {
    margin: getSpacing(theme, 1),
    color: "inherit",
    display: "flex",
    alignItems: "center",
    borderRadius: "4px",
    padding: `${getSpacing(theme, 1)} ${getSpacing(theme, 2)}`,
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
  },
  activeNavButton: {
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
  },
  categoryHeader: {
    padding: `${getSpacing(theme, 1)} ${getSpacing(theme, 2)}`,
    fontSize: "0.75rem",
    color: getPaletteColor(theme, "text", "secondary"),
    fontWeight: 600,
  },
}))

// Footer styles
export const useFooterStyles = makeStyles((theme: Theme) => ({
  footer: {
    padding: `${getSpacing(theme, 4)} 0`,
    marginTop: "auto",
    backgroundColor: getPaletteColor(theme, "primary", "main"),
    color: getPaletteColor(theme, "primary", "contrastText"),
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: "linear-gradient(90deg, #f50057, #3f51b5, #00bcd4)",
    },
  },
  footerContainer: {
    position: "relative",
    zIndex: 1,
  },
  footerTitle: {
    fontWeight: 600,
    marginBottom: getSpacing(theme, 2),
    color: getPaletteColor(theme, "primary", "contrastText"),
  },
  footerLink: {
    color: "rgba(255, 255, 255, 0.8)",
    textDecoration: "none",
    display: "block",
    marginBottom: getSpacing(theme, 1),
    "&:hover": {
      color: "white",
      textDecoration: "underline",
    },
  },
  socialIcon: {
    color: "rgba(255, 255, 255, 0.8)",
    "&:hover": {
      color: "white",
    },
  },
  copyright: {
    marginTop: getSpacing(theme, 4),
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.6)",
  },
  footerPattern: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.05,
    backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
}))

// Tool Grid styles
export const useToolGridStyles = makeStyles((theme: Theme) => ({
  categorySection: {
    marginBottom: getSpacing(theme, 6),
  },
  categoryTitle: {
    marginBottom: getSpacing(theme, 3),
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid ${getPaletteColor(theme, "divider")}`,
    paddingBottom: getSpacing(theme, 1),
    // Add !important to ensure styles are applied in production
    borderBottomWidth: "1px !important",
    borderBottomStyle: "solid !important",
    borderBottomColor: `${getPaletteColor(theme, "divider")} !important`,
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: theme.shadows?.[8] || "0 8px 16px rgba(0,0,0,0.2)",
    },
  },
  cardContent: {
    flexGrow: 1,
    padding: getSpacing(theme, 3),
    display: "flex",
    flexDirection: "column",
  },
  cardActions: {
    padding: getSpacing(theme, 2),
    marginTop: "auto", // Push to bottom of card
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: theme.shape?.borderRadius || 4,
    color: "white",
    marginBottom: getSpacing(theme, 2),
  },
}))

// Settings Form styles
export const useSettingsFormStyles = makeStyles((theme: Theme) => ({
  paper: {
    maxWidth: 800,
    margin: "0 auto",
    overflow: "hidden",
  },
  tabPanel: {
    padding: getSpacing(theme, 3),
  },
  formSection: {
    marginTop: getSpacing(theme, 2),
    width: "100%",
  },
  switchItem: {
    marginTop: getSpacing(theme, 3),
  },
  actionButtons: {
    display: "flex",
    justifyContent: "flex-end",
    padding: getSpacing(theme, 2),
    gap: getSpacing(theme, 2),
    [getBreakpoint(theme, "sm", "down")]: {
      flexDirection: "column",
    },
  },
  fullWidthOnMobile: {
    [getBreakpoint(theme, "sm", "down")]: {
      width: "100%",
    },
  },
}))

// PDF Converter styles
export const usePdfConverterStyles = makeStyles((theme: Theme) => ({
  paper: {
    maxWidth: 800,
    margin: "0 auto",
    padding: getSpacing(theme, 3),
  },
  dropZone: {
    padding: getSpacing(theme, 4),
    border: `2px dashed ${getPaletteColor(theme, "divider")}`,
    borderRadius: theme.shape?.borderRadius || 4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: getSpacing(theme, 4),
    backgroundColor: theme.palette?.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
  },
  uploadIcon: {
    fontSize: 60,
    color: getPaletteColor(theme, "text", "secondary"),
    marginBottom: getSpacing(theme, 2),
    [getBreakpoint(theme, "sm", "down")]: {
      fontSize: 40,
    },
  },
  fileInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: getSpacing(theme, 2),
    [getBreakpoint(theme, "sm", "down")]: {
      flexDirection: "column",
    },
  },
  fileDetails: {
    display: "flex",
    alignItems: "center",
    marginBottom: getSpacing(theme, 2),
    [getBreakpoint(theme, "sm", "down")]: {
      width: "100%",
    },
  },
  progressSection: {
    marginBottom: getSpacing(theme, 3),
  },
  actionButtons: {
    display: "flex",
    gap: getSpacing(theme, 2),
    [getBreakpoint(theme, "sm", "down")]: {
      flexDirection: "column",
    },
  },
  supportedTypes: {
    marginTop: getSpacing(theme, 3),
  },
}))

// Word Counter styles
export const useWordCounterStyles = makeStyles((theme: Theme) => ({
  paper: {
    maxWidth: 900,
    margin: "0 auto",
    padding: getSpacing(theme, 3),
  },
  statsGrid: {
    marginBottom: getSpacing(theme, 3),
  },
  statCard: {
    padding: getSpacing(theme, 2),
    textAlign: "center",
    backgroundColor: theme.palette?.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
  },
  statValue: {
    fontWeight: "bold",
  },
  textFieldContainer: {
    position: "relative",
  },
  actionButtons: {
    position: "absolute",
    bottom: 8,
    right: 8,
    display: "flex",
    gap: getSpacing(theme, 1),
    backgroundColor: theme.palette?.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.8)",
    borderRadius: (theme.shape?.borderRadius || 4) / 2,
    padding: "2px",
  },
}))

// Color Palette styles
export const useColorPaletteStyles = makeStyles((theme: Theme) => ({
  paper: {
    maxWidth: 1000,
    margin: "0 auto",
    padding: getSpacing(theme, 3),
  },
  controlsSection: {
    display: "flex",
    flexDirection: "row",
    gap: getSpacing(theme, 2),
    marginBottom: getSpacing(theme, 3),
    alignItems: "center",
    [getBreakpoint(theme, "sm", "down")]: {
      flexDirection: "column",
    },
  },
  colorGrid: {
    display: "flex",
    flexDirection: "row",
    gap: getSpacing(theme, 2),
    marginBottom: getSpacing(theme, 4),
    [getBreakpoint(theme, "md", "down")]: {
      flexDirection: "column",
    },
  },
  colorCard: {
    flex: 1,
    height: 150,
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.2s",
    "&:hover": {
      transform: "scale(1.02)",
    },
    [getBreakpoint(theme, "sm", "down")]: {
      height: 100,
    },
  },
  colorInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "white",
    padding: getSpacing(theme, 1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorActions: {
    display: "flex",
  },
  editorPaper: {
    padding: getSpacing(theme, 3),
    marginBottom: getSpacing(theme, 4),
  },
  colorPreview: {
    width: "100%",
    height: 80,
    borderRadius: theme.shape?.borderRadius || 4,
    marginBottom: getSpacing(theme, 2),
    [getBreakpoint(theme, "sm", "down")]: {
      height: 60,
    },
  },
  exportOptions: {
    display: "flex",
    flexWrap: "wrap",
    gap: getSpacing(theme, 2),
    [getBreakpoint(theme, "sm", "down")]: {
      flexDirection: "column",
    },
  },
}))

// Ad styles
export const useAdStyles = makeStyles((theme: Theme) => ({
  // This section will be deleted
}))





