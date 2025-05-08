"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { StyledEngineProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { useState, useMemo, useEffect } from "react"
import Box from "@mui/material/Box"
import Header from "@/components/header"
import Footer from "@/components/footer"
import theme from "@/styles/theme"
import Script from "next/script"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light")

  // Check for user's preferred color scheme on initial load
  useEffect(() => {
    const savedMode = localStorage.getItem("theme-mode")
    if (savedMode && (savedMode === "light" || savedMode === "dark")) {
      setMode(savedMode)
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setMode("dark")
    }
  }, [])

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === "light" ? "dark" : "light"
          localStorage.setItem("theme-mode", newMode)
          return newMode
        })
      },
    }),
    [],
  )

  const customTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode,
          background: {
            default: mode === "dark" ? "#121212" : "#f5f5f5",
            paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#ffffff" : "rgba(0, 0, 0, 0.87)",
            secondary: mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.6)",
          },
        },
        components: {
          ...theme.components,
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarColor: mode === "dark" ? "#6b6b6b #2b2b2b" : "#959595 #f5f5f5",
                "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
                  backgroundColor: mode === "dark" ? "#2b2b2b" : "#f5f5f5",
                },
                "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
                  borderRadius: 8,
                  backgroundColor: mode === "dark" ? "#6b6b6b" : "#959595",
                  minHeight: 24,
                },
                "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus": {
                  backgroundColor: mode === "dark" ? "#959595" : "#6b6b6b",
                },
              },
            },
          },
        },
      }),
    [mode],
  )

  // Apply dark mode class to body for CSS variable-based styling
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [mode])

  return (
    <>
      <Script id="structured-data" type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "KodeKit",
            "url": "https://kodekit.vercel.app",
            "description": "KodeKit is a powerful development toolkit designed to streamline your workflow and boost productivity.",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "author": {
              "@type": "Person",
              "name": "Kanagaraj K"
            }
          }
        `}
      </Script>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={customTheme}>
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
            className={inter.className}
          >
            <Header colorMode={colorMode} mode={mode} />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                pt: 8,
              }}
            >
              {children}
            </Box>
            <Footer />
          </Box>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  )
}


