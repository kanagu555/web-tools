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

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
        },
        // Ensure zIndex is properly defined
        zIndex: {
          ...theme.zIndex,
          appBar: 1200,
          drawer: 1100,
        },
      }),
    [mode],
  )

  return (
    <html lang="en">
      <head>
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3393138141509318"
     crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={customTheme}>
            <CssBaseline />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
              }}
            >
              <Header colorMode={colorMode} mode={mode} />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  pt: 8, // Add padding top to account for fixed header
                }}
              >
                {children}
              </Box>
              <Footer />
            </Box>
          </ThemeProvider>
        </StyledEngineProvider>
      </body>
    </html>
  )
}

