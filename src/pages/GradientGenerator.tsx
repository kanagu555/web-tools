import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  Slider,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

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
  const isProductionEnv = import.meta.env.PROD;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      <Helmet>
        <title>
          CSS Gradient Generator - Create Beautiful Color Transitions
        </title>
        <meta
          name="description"
          content="Create beautiful CSS gradients with custom color stops and angles. Generate linear, radial, and conic gradients for your web designs with real-time preview."
        />
        <meta
          name="keywords"
          content="CSS gradient generator, linear gradient, radial gradient, conic gradient, color transitions, web design tools, gradient generator, css gradient generator, gradient maker, online gradient tool, free gradient generator, css gradient creator, color gradient tool, linear gradient generator, radial gradient generator, react gradient tool, gradient palette creator, background generator, gradient css code, ui gradient tool, modern gradient generator, gradient angle tool, gradient direction editor, custom gradient builder, gradient export css, gradient presets, web gradient generator, open source gradient tool, animated gradient generator, gradient code copy, gradient generator github, create linear gradient with angle control, copy css gradient code instantly, modern ui gradient presets, css gradient generator with export code, free gradient generator online"
        />
        <meta
          property="og:title"
          content="CSS Gradient Generator - Create Beautiful Color Transitions"
        />
        <meta
          property="og:description"
          content="Create beautiful CSS gradients with custom color stops and angles. Generate linear, radial, and conic gradients for your web designs with real-time preview."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/gradient-generator"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="CSS Gradient Generator - Create Beautiful Color Transitions"
        />
        <meta
          name="twitter:description"
          content="Create beautiful CSS gradients with custom color stops and angles. Generate linear, radial, and conic gradients for your web designs with real-time preview."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/gradient-generator"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          fontWeight={700}
          sx={{ fontSize: "2.5rem" }}
        >
          Gradient Generator
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          color="text.secondary"
          paragraph
          sx={{ fontSize: "1.25rem", fontWeight: 400 }}
        >
          Create beautiful color gradients for your designs.
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
                    aria-valuemin={0}
                    aria-valuemax={360}
                    aria-valuenow={angle}
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
                          inputProps={{
                            "aria-label": `Color stop ${
                              index + 1
                            } color picker`,
                          }}
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
                          inputProps={{
                            min: 0,
                            max: 100,
                            "aria-label": `Color stop ${index + 1} position`,
                          }}
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={2}>
                        {stops.length > 2 && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeStop(index)}
                            aria-label={`Remove color stop ${index + 1}`}
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
                    aria-label="Add new color stop"
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
                  startIcon={
                    copied ? (
                      <Check size={16} aria-hidden="true" />
                    ) : (
                      <Copy size={16} aria-hidden="true" />
                    )
                  }
                  fullWidth
                  aria-label={copied ? "CSS code copied" : "Copy CSS code"}
                >
                  {copied ? "Copied!" : "Copy CSS"}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={generateRandomGradient}
                  startIcon={<RefreshCw size={16} aria-hidden="true" />}
                  aria-label="Generate random gradient"
                >
                  Random
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        {isProductionEnv && <AdSense adSlot="6613251015" />}

        <Box sx={{ mt: 4 }} component="section" aria-labelledby="usage-section">
          <Box id="usage-section" component="h2" sx={{ visuallyHidden: true }}>
            How to Use
          </Box>

          <Typography variant="h3" component="h3" gutterBottom fontWeight={600}>
            How to Use the Gradient Generator
          </Typography>

          <Typography variant="body1" paragraph>
            1. <strong>Choose gradient type</strong> - Select between linear or
            radial gradients
          </Typography>
          <Typography variant="body1" paragraph>
            2. <strong>Adjust angle</strong> - For linear gradients, set the
            direction angle (0-360°)
          </Typography>
          <Typography variant="body1" paragraph>
            3. <strong>Add color stops</strong> - Click "Add Color Stop" to
            create multi-color gradients
          </Typography>
          <Typography variant="body1" paragraph>
            4. <strong>Customize colors</strong> - Click each color stop to
            choose your colors
          </Typography>
          <Typography variant="body1" paragraph>
            5. <strong>Copy CSS</strong> - Click the "Copy CSS" button to get
            the gradient code
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }} component="section" aria-labelledby="tips-section">
          <Box id="tips-section" component="h2" sx={{ visuallyHidden: true }}>
            Tips and Tricks
          </Box>

          <Typography variant="h3" component="h3" gutterBottom fontWeight={600}>
            Gradient Design Tips
          </Typography>

          <Typography variant="body1" paragraph>
            <strong>Use complementary colors</strong> - Colors opposite each
            other on the color wheel create vibrant gradients
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Try analogous colors</strong> - Colors next to each other
            create smooth, natural transitions
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Limit color stops</strong> - 2-3 colors usually work best
            for clean designs
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>Experiment with angles</strong> - Different angles can
            dramatically change the gradient effect
          </Typography>
        </Box>
      </motion.div>
      <AdSense adSlot="6613251015" />
    </Container>
  );
};

export default GradientGenerator;
