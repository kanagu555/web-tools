"use client"

import { useState, useEffect } from "react"
import { Paper, Box, Typography, Button, Tabs, Tab, Grid, Slider, TextField, IconButton, useTheme } from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import LockIcon from "@mui/icons-material/Lock"
import LockOpenIcon from "@mui/icons-material/LockOpen"
import { useColorPaletteStyles } from "@/styles/styles"
import AdSense from "./AdSense"

type ColorMode = "random" | "analogous" | "monochromatic" | "triadic" | "complementary"

interface ColorInfo {
  hex: string
  rgb: { r: number; g: number; b: number }
  locked: boolean
}

export function ColorPalette() {
  const [colors, setColors] = useState<ColorInfo[]>(
    Array(5)
      .fill(null)
      .map(() => ({
        hex: generateRandomHex(),
        rgb: hexToRgb(generateRandomHex()),
        locked: false,
      })),
  )
  const [colorMode, setColorMode] = useState<ColorMode>("random")
  const [selectedColor, setSelectedColor] = useState<ColorInfo | null>(null)
  const theme = useTheme()
  const classes = useColorPaletteStyles()

  useEffect(() => {
    // Generate initial palette
    generatePalette()
  }, [colorMode])

  function generateRandomHex() {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`
  }

  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  function rgbToHex(r: number, g: number, b: number) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
  }

  function generatePalette() {
    // Keep locked colors
    const newColors = [...colors]

    // Find a base color (either the first unlocked color or generate a new one)
    let baseColorIndex = newColors.findIndex((c) => !c.locked)
    if (baseColorIndex === -1) baseColorIndex = 0

    if (!newColors[baseColorIndex].locked) {
      newColors[baseColorIndex] = {
        hex: generateRandomHex(),
        rgb: hexToRgb(generateRandomHex()),
        locked: false,
      }
    }

    const baseColor = newColors[baseColorIndex]
    const baseHsl = rgbToHsl(baseColor.rgb.r, baseColor.rgb.g, baseColor.rgb.b)

    // Generate other colors based on the mode
    for (let i = 0; i < newColors.length; i++) {
      if (i !== baseColorIndex && !newColors[i].locked) {
        const newHsl = { ...baseHsl }

        switch (colorMode) {
          case "analogous":
            newHsl.h = (baseHsl.h + (i - baseColorIndex) * 30) % 360
            break
          case "monochromatic":
            newHsl.s = Math.min(Math.max(baseHsl.s + (i - baseColorIndex) * 0.1, 0), 1)
            newHsl.l = Math.min(Math.max(baseHsl.l + (i - baseColorIndex) * 0.1, 0), 1)
            break
          case "triadic":
            newHsl.h = (baseHsl.h + (i - baseColorIndex) * 120) % 360
            break
          case "complementary":
            newHsl.h = (baseHsl.h + (i % 2 === 0 ? 0 : 180)) % 360
            newHsl.s = Math.min(Math.max(baseHsl.s + (i - baseColorIndex) * 0.05, 0), 1)
            newHsl.l = Math.min(Math.max(baseHsl.l + (i - baseColorIndex) * 0.1, 0), 1)
            break
          case "random":
          default:
            newColors[i] = {
              hex: generateRandomHex(),
              rgb: hexToRgb(generateRandomHex()),
              locked: false,
            }
            continue
        }

        const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
        newColors[i] = {
          hex: rgbToHex(rgb.r, rgb.g, rgb.b),
          rgb,
          locked: false,
        }
      }
    }

    setColors(newColors)
  }

  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return { h: h * 360, s, l }
  }

  function hslToRgb(h: number, s: number, l: number) {
    h /= 360
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  function toggleLock(index: number) {
    const newColors = [...colors]
    newColors[index].locked = !newColors[index].locked
    setColors(newColors)
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
  }

  function handleColorChange(index: number, hex: string) {
    const newColors = [...colors]
    newColors[index] = {
      ...newColors[index],
      hex,
      rgb: hexToRgb(hex),
    }
    setColors(newColors)
  }

  return (
    <Paper className={classes.paper}>
      <Box className={classes.controlsSection}>
        <Button variant="contained" startIcon={<RefreshIcon />} onClick={generatePalette}>
          Generate New Palette
        </Button>

        <Tabs
          value={colorMode}
          onChange={(_, v) => setColorMode(v as ColorMode)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flexGrow: 1 }}
        >
          <Tab label="Random" value="random" />
          <Tab label="Analogous" value="analogous" />
          <Tab label="Monochromatic" value="monochromatic" />
          <Tab label="Triadic" value="triadic" />
          <Tab label="Complementary" value="complementary" />
        </Tabs>
      </Box>

      <Box className={classes.colorGrid}>
        {colors.map((color, index) => (
          <Paper key={index} elevation={4} className={classes.colorCard} onClick={() => setSelectedColor(color)}>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundColor: color.hex,
              }}
            />
            <Box className={classes.colorInfo}>
              <Typography variant="body2" fontFamily="monospace">
                {color.hex}
              </Typography>
              <Box className={classes.colorActions}>
                <IconButton
                  size="small"
                  sx={{ color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(color.hex)
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{ color: "white" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLock(index)
                  }}
                >
                  {color.locked ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                </IconButton>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      <AdSense adSlot="1234567890" adFormat="auto" />

      {selectedColor && (
        <Paper className={classes.editorPaper}>
          <Typography variant="h6" gutterBottom>
            Edit Color
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Hex Value"
                value={selectedColor.hex}
                onChange={(e) =>
                  setSelectedColor({
                    ...selectedColor,
                    hex: e.target.value,
                    rgb: hexToRgb(e.target.value),
                  })
                }
                fullWidth
                margin="normal"
                variant="outlined"
                InputProps={{
                  sx: { fontFamily: "monospace" },
                }}
              />

              <Box sx={{ mt: 3 }}>
                <Box className={classes.colorPreview} sx={{ backgroundColor: selectedColor.hex }} />
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    const index = colors.findIndex((c) => c.hex === selectedColor.hex)
                    if (index !== -1) {
                      handleColorChange(index, selectedColor.hex)
                    }
                  }}
                >
                  Apply Changes
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Red ({selectedColor.rgb.r})</Typography>
                <Slider
                  value={selectedColor.rgb.r}
                  min={0}
                  max={255}
                  step={1}
                  onChange={(_, value) =>
                    setSelectedColor({
                      ...selectedColor,
                      rgb: { ...selectedColor.rgb, r: value as number },
                      hex: rgbToHex(value as number, selectedColor.rgb.g, selectedColor.rgb.b),
                    })
                  }
                  sx={{
                    color: "#f44336", // Red color for the slider
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography gutterBottom>Green ({selectedColor.rgb.g})</Typography>
                <Slider
                  value={selectedColor.rgb.g}
                  min={0}
                  max={255}
                  step={1}
                  onChange={(_, value) =>
                    setSelectedColor({
                      ...selectedColor,
                      rgb: { ...selectedColor.rgb, g: value as number },
                      hex: rgbToHex(selectedColor.rgb.r, value as number, selectedColor.rgb.b),
                    })
                  }
                  sx={{
                    color: "#4caf50", // Green color for the slider
                  }}
                />
              </Box>

              <Box>
                <Typography gutterBottom>Blue ({selectedColor.rgb.b})</Typography>
                <Slider
                  value={selectedColor.rgb.b}
                  min={0}
                  max={255}
                  step={1}
                  onChange={(_, value) =>
                    setSelectedColor({
                      ...selectedColor,
                      rgb: { ...selectedColor.rgb, b: value as number },
                      hex: rgbToHex(selectedColor.rgb.r, selectedColor.rgb.g, value as number),
                    })
                  }
                  sx={{
                    color: "#2196f3", // Blue color for the slider
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Export Options
        </Typography>
        <Box className={classes.exportOptions}>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => copyToClipboard(colors.map((c) => c.hex).join(", "))}
          >
            Copy Hex Values
          </Button>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => copyToClipboard(colors.map((c) => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`).join(", "))}
          >
            Copy RGB Values
          </Button>
          <Button
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={() => {
              const css = colors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join("\n")
              copyToClipboard(css)
            }}
          >
            Copy as CSS Variables
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

