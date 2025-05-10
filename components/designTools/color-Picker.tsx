"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Paper,
  Box,
  Typography,
  Slider,
  TextField,
  Grid,
  Button,
  Tabs,
  Tab,
  IconButton,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"

interface RGB {
  r: number
  g: number
  b: number
}

interface HSL {
  h: number
  s: number
  l: number
}

interface SavedColor {
  id: string
  hex: string
  name: string
}

export function ColorPicker() {
  const [color, setColor] = useState<string>("#3f51b5")
  const [rgb, setRgb] = useState<RGB>({ r: 63, g: 81, b: 181 })
  const [hsl, setHsl] = useState<HSL>({ h: 231, s: 48, l: 48 })
  const [tabValue, setTabValue] = useState(0)
  const [savedColors, setSavedColors] = useState<SavedColor[]>([])
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
  const [colorName, setColorName] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const theme = useTheme()

  // Initialize canvas for color picker
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create color gradient
    const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradientH.addColorStop(0, "#FF0000")
    gradientH.addColorStop(1 / 6, "#FFFF00")
    gradientH.addColorStop(2 / 6, "#00FF00")
    gradientH.addColorStop(3 / 6, "#00FFFF")
    gradientH.addColorStop(4 / 6, "#0000FF")
    gradientH.addColorStop(5 / 6, "#FF00FF")
    gradientH.addColorStop(1, "#FF0000")
    ctx.fillStyle = gradientH
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create white to transparent gradient
    const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradientV.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradientV.addColorStop(1, "rgba(255, 255, 255, 0)")
    ctx.fillStyle = gradientV
    ctx.globalCompositeOperation = "multiply"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Create black to transparent gradient
    ctx.globalCompositeOperation = "source-over"
    const gradientB = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradientB.addColorStop(0, "rgba(0, 0, 0, 0)")
    gradientB.addColorStop(1, "rgba(0, 0, 0, 1)")
    ctx.fillStyle = gradientB
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  // Handle canvas click to pick color
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const imageData = ctx.getImageData(x, y, 1, 1).data
    const r = imageData[0]
    const g = imageData[1]
    const b = imageData[2]

    setRgb({ r, g, b })
    const hex = rgbToHex(r, g, b)
    setColor(hex)
    setHsl(rgbToHsl(r, g, b))
  }

  // Convert RGB to Hex
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
  }

  // Convert Hex to RGB
  const hexToRgb = (hex: string): RGB => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 }
  }

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): HSL => {
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

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360
    s /= 100
    l /= 100
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

  // Handle hex input change
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value
    if (/^#?([a-f\d]{0,6})$/i.test(newHex)) {
      const formattedHex = newHex.startsWith("#") ? newHex : `#${newHex}`
      setColor(formattedHex)

      if (/^#[a-f\d]{6}$/i.test(formattedHex)) {
        const newRgb = hexToRgb(formattedHex)
        setRgb(newRgb)
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
      }
    }
  }

  // Handle RGB input changes
  const handleRgbChange = (channel: keyof RGB, value: number) => {
    const newRgb = { ...rgb, [channel]: value }
    setRgb(newRgb)
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  // Handle HSL input changes
  const handleHslChange = (channel: keyof HSL, value: number) => {
    const newHsl = { ...hsl, [channel]: value }
    setHsl(newHsl)
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(newRgb)
    setColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
  }

  // Copy color to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSnackbar({
      open: true,
      message: `Copied ${text} to clipboard!`,
      severity: "success",
    })
  }

  // Save current color
  const saveColor = () => {
    const name = colorName.trim() || `Color ${savedColors.length + 1}`
    const newColor = {
      id: Date.now().toString(),
      hex: color,
      name,
    }
    setSavedColors([...savedColors, newColor])
    setColorName("")
    setSnackbar({
      open: true,
      message: `Color "${name}" saved!`,
      severity: "success",
    })
  }

  // Delete saved color
  const deleteColor = (id: string) => {
    setSavedColors(savedColors.filter((c) => c.id !== id))
  }

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Color Picker
          </Typography>
          <Box
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
              mb: 3,
            }}
          >
            <canvas
              ref={canvasRef}
              width={400}
              height={200}
              onClick={handleCanvasClick}
              style={{ width: "100%", height: "auto", cursor: "crosshair" }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: "100%",
                height: 80,
                bgcolor: color,
                borderRadius: 1,
                mb: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Hex Color"
                  value={color}
                  onChange={handleHexChange}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(color)}
                >
                  Copy
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={9}>
                <TextField
                  fullWidth
                  label="Save as"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  placeholder="Enter color name"
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={3}>
                <Button fullWidth variant="contained" startIcon={<AddIcon />} onClick={saveColor}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="color format tabs">
              <Tab label="RGB" />
              <Tab label="HSL" />
              <Tab label="Saved Colors" />
            </Tabs>
          </Box>

          <Box hidden={tabValue !== 0} sx={{ p: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              RGB Values
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom>Red ({rgb.r})</Typography>
                <Slider
                  value={rgb.r}
                  min={0}
                  max={255}
                  step={1}
                  onChange={(_, value) => handleRgbChange("r", value as number)}
                  sx={{ color: "#f44336" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Green ({rgb.g})</Typography>
                <Slider
                  value={rgb.g}
                  min={0}
                  max={255}
                  step={1}
                  onChange={(_, value) => handleRgbChange("g", value as number)}
                  sx={{ color: "#4caf50" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Blue ({rgb.b})</Typography>
                <Slider
                  value={rgb.b}
                  min={0}
                  max={255}
                  step={1}
                  onChange={(_, value) => handleRgbChange("b", value as number)}
                  sx={{ color: "#2196f3" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                >
                  Copy RGB Value
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box hidden={tabValue !== 1} sx={{ p: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              HSL Values
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom>Hue ({hsl.h}°)</Typography>
                <Slider
                  value={hsl.h}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(_, value) => handleHslChange("h", value as number)}
                  sx={{
                    background:
                      "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Saturation ({hsl.s}%)</Typography>
                <Slider
                  value={hsl.s}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(_, value) => handleHslChange("s", value as number)}
                  sx={{
                    background: `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Lightness ({hsl.l}%)</Typography>
                <Slider
                  value={hsl.l}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(_, value) => handleHslChange("l", value as number)}
                  sx={{
                    background: `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                >
                  Copy HSL Value
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box hidden={tabValue !== 2} sx={{ p: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Saved Colors
            </Typography>
            {savedColors.length === 0 ? (
              <Typography color="text.secondary">No colors saved yet. Save colors to see them here.</Typography>
            ) : (
              <Grid container spacing={1}>
                {savedColors.map((savedColor) => (
                  <Grid item xs={6} sm={4} key={savedColor.id}>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1,
                        overflow: "hidden",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: savedColor.hex,
                          height: 60,
                          display: "flex",
                          justifyContent: "flex-end",
                          p: 0.5,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => deleteColor(savedColor.id)}
                          sx={{
                            bgcolor: "rgba(255, 255, 255, 0.5)",
                            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.7)" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="body2" noWrap>
                          {savedColor.name}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography variant="caption" color="text.secondary">
                            {savedColor.hex}
                          </Typography>
                          <IconButton size="small" onClick={() => copyToClipboard(savedColor.hex)} sx={{ p: 0.5 }}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Grid>
      </Grid>


      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  )
}
