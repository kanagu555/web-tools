import React, { useState } from "react";
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Gradient Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
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
            >
              <Box
                sx={{
                  width: "100%",
                  height: 400,
                  borderRadius: 2,
                  background: generateGradient(),
                }}
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
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Gradient Type
                </Typography>
                <Select
                  fullWidth
                  value={gradientType}
                  onChange={(e) =>
                    setGradientType(e.target.value as "linear" | "radial")
                  }
                >
                  <MenuItem value="linear">Linear</MenuItem>
                  <MenuItem value="radial">Radial</MenuItem>
                </Select>
              </Box>

              {gradientType === "linear" && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Angle: {angle}°
                  </Typography>
                  <Slider
                    value={angle}
                    onChange={(_, value) => setAngle(value as number)}
                    min={0}
                    max={360}
                    step={1}
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

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleCopy}
                  startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                  fullWidth
                >
                  {copied ? "Copied!" : "Copy CSS"}
                </Button>
                <Button
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
      </motion.div>
      <AdSense adSlot="6613251015" />
    </Container>
  );
};

export default GradientGenerator;
