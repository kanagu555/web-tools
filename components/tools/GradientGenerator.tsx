"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Select,
  MenuItem,
  Slider,
  useTheme,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw } from "lucide-react";
import AdSense from "../AdSense";
import Navigation from "@/components/Navigation";

interface GradientStop {
  color: string;
  position: number;
}

const GradientGenerator = () => {
  const theme = useTheme();
  const [gradientType, setGradientType] = useState<"linear" | "radial">(
    "linear"
  );
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<GradientStop[]>([
    { color: "#6366f1", position: 0 },
    { color: "#10b981", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const generateGradient = () => {
    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${stops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(", ")})`;
    } else {
      return `radial-gradient(circle, ${stops
        .map((stop) => `${stop.color} ${stop.position}%`)
        .join(", ")})`;
    }
  };

  const handleCopy = async () => {
    const css = generateGradient();
    await navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addStop = () => {
    if (stops.length < 5) {
      const lastPosition = stops[stops.length - 1].position;
      const newPosition = Math.min(lastPosition + 20, 100);
      setStops([...stops, { color: "#ffffff", position: newPosition }]);
    }
  };

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      setStops(stops.filter((_, i) => i !== index));
    }
  };

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], ...updates };
    setStops(newStops);
  };

  const generateRandomGradient = () => {
    const randomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const newStops = stops.map((stop) => ({
      ...stop,
      color: randomColor(),
    }));
    setStops(newStops);
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} component="main">
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            textAlign: { xs: "center", md: "left" },
          }}
        >
          Gradient Generator Tool
        </Typography>
        <Typography
          variant="h2"
          component="p"
          color="text.secondary"
          paragraph
          sx={{
            fontSize: "1.25rem",
            fontWeight: 400,
            textAlign: { xs: "center", md: "left" },
            mb: 4,
          }}
        >
          Create beautiful CSS gradients for your web designs, backgrounds, and
          creative projects. Generate linear and radial gradients with ease.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="gradient-preview-section"
            >
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  borderRadius: 2,
                  background: generateGradient(),
                }}
                aria-label="Gradient preview"
                role="img"
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
              component="section"
              aria-labelledby="gradient-controls-section"
            >
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  id="gradient-type-label"
                >
                  Gradient Type
                </Typography>
                <Select
                  fullWidth
                  value={gradientType}
                  onChange={(e) =>
                    setGradientType(e.target.value as "linear" | "radial")
                  }
                  aria-labelledby="gradient-type-label"
                >
                  <MenuItem value="linear">Linear</MenuItem>
                  <MenuItem value="radial">Radial</MenuItem>
                </Select>
              </Box>

              {gradientType === "linear" && (
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    id="angle-slider-label"
                  >
                    Angle: {angle}°
                  </Typography>
                  <Slider
                    value={angle}
                    onChange={(_, value) => setAngle(value as number)}
                    min={0}
                    max={360}
                    step={1}
                    aria-labelledby="angle-slider-label"
                  />
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Color Stops
                </Typography>
                {stops.map((stop, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={5}>
                        <TextField
                          type="color"
                          value={stop.color}
                          onChange={(e) =>
                            updateStop(index, { color: e.target.value })
                          }
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <TextField
                          type="number"
                          value={stop.position}
                          onChange={(e) =>
                            updateStop(index, {
                              position: Number(e.target.value),
                            })
                          }
                          inputProps={{ min: 0, max: 100 }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        {stops.length > 2 && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeStop(index)}
                          >
                            ×
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                ))}
                {stops.length < 5 && (
                  <Button
                    variant="outlined"
                    onClick={addStop}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Add Color Stop
                  </Button>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleCopy}
                  startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                  fullWidth
                >
                  {copied ? "Copied!" : "Copy CSS"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={generateRandomGradient}
                  startIcon={<RefreshCw size={16} />}
                >
                  Random
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <AdSense adSlot="4552615729" />

        {/* Informational Content */}
        <Box sx={{ mt: 4 }}>
          {/* Features Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Why Use Our Gradient Generator?
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <RefreshCw size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Real-time Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    See your gradient changes instantly with live preview.
                    Adjust colors, angles, and positions in real-time.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <Copy size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    CSS Ready Code
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate production-ready CSS code instantly. Copy and paste
                    directly into your stylesheets and projects.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.warning.main,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <RefreshCw size={24} color="white" />
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Multiple Gradient Types
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Support for linear and radial gradients with unlimited color
                    stops. Create complex gradient effects with ease.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* How It Works Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              How to Create Custom Gradients
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    1
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Choose Type
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Select between linear or radial gradient type based on your
                    design needs.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    2
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Add Colors
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose colors for your gradient and adjust their positions.
                    Add up to 5 color stops.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    3
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Adjust Settings
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fine-tune angle for linear gradients and position color
                    stops to achieve your desired effect.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography
                    variant="h3"
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: "bold",
                      mb: 2,
                    }}
                  >
                    4
                  </Typography>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Copy CSS
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Copy the generated CSS code and use it in your projects.
                    Ready for production use.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Benefits Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Key Benefits
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      100% Free & No Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Use our gradient generator completely free without
                      creating an account or providing personal information.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Professional CSS Output
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generate clean, optimized CSS code that works across all
                      modern browsers and devices.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Unlimited Customization
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create unlimited gradient combinations with multiple color
                      stops and precise control over every parameter.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      mt: 1,
                      flexShrink: 0,
                    }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Cross-Browser Compatible
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generated CSS works perfectly across Chrome, Firefox,
                      Safari, Edge, and all modern web browsers.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* FAQ Section */}
          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={600}
            >
              Frequently Asked Questions
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                What types of gradients can I create?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You can create both linear and radial gradients with up to 5
                color stops. Linear gradients allow angle adjustment from 0° to
                360°, while radial gradients create circular color transitions.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Is the generated CSS compatible with all browsers?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Yes, our tool generates standard CSS3 gradient syntax that works
                in all modern browsers including Chrome, Firefox, Safari, and
                Edge.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                Can I save my gradient creations?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                While we don't store gradients on our servers, you can easily
                copy the CSS code and save it in your own files or bookmarks for
                future use.
              </Typography>

              <Typography variant="h6" fontWeight={600} gutterBottom>
                How do I use the generated CSS in my project?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Simply copy the generated CSS code and paste it into your
                stylesheet. You can use it as a background property for any HTML
                element in your web project.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* AdSense Ad */}
        <AdSense adSlot="4999412635" />
      </motion.div>
    </Container>
  );
};

export default GradientGenerator;
