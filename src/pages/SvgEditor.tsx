import React, { useState, useRef } from "react";
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
import {
  Square,
  Circle,
  Type,
  Link as Line,
  Download,
  Undo,
  Redo,
  Trash2,
} from "lucide-react";

interface Shape {
  id: string;
  type: "rect" | "circle" | "text" | "line";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fill: string;
  stroke: string;
  strokeWidth: number;
}

const SvgEditor = () => {
  const theme = useTheme();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<
    "rect" | "circle" | "text" | "line"
  >("rect");
  const [history, setHistory] = useState<Shape[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const addShape = (type: Shape["type"]) => {
    const newShape: Shape = {
      id: Date.now().toString(),
      type,
      x: 100,
      y: 100,
      width: type === "rect" ? 100 : undefined,
      height: type === "rect" ? 100 : undefined,
      radius: type === "circle" ? 50 : undefined,
      text: type === "text" ? "Text" : undefined,
      fill: type === "line" ? "none" : theme.palette.primary.main,
      stroke:
        type === "line"
          ? theme.palette.primary.main
          : theme.palette.text.primary,
      strokeWidth: 2,
    };

    const newShapes = [...shapes, newShape];
    setShapes(newShapes);
    addToHistory(newShapes);
    setSelectedShape(newShape.id);
  };

  const addToHistory = (newShapes: Shape[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newShapes);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setShapes(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setShapes(history[historyIndex + 1]);
    }
  };

  const updateShape = (id: string, updates: Partial<Shape>) => {
    const newShapes = shapes.map((shape) =>
      shape.id === id ? { ...shape, ...updates } : shape
    );
    setShapes(newShapes);
    addToHistory(newShapes);
  };

  const deleteShape = (id: string) => {
    const newShapes = shapes.filter((shape) => shape.id !== id);
    setShapes(newShapes);
    addToHistory(newShapes);
    setSelectedShape(null);
  };

  const downloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "drawing.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderShape = (shape: Shape) => {
    const isSelected = shape.id === selectedShape;
    const commonProps = {
      onClick: () => setSelectedShape(shape.id),
      style: { cursor: "pointer" },
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      fill: shape.fill,
    };

    switch (shape.type) {
      case "rect":
        return (
          <rect
            {...commonProps}
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            strokeDasharray={isSelected ? "5,5" : "none"}
          />
        );
      case "circle":
        return (
          <circle
            {...commonProps}
            cx={shape.x}
            cy={shape.y}
            r={shape.radius}
            strokeDasharray={isSelected ? "5,5" : "none"}
          />
        );
      case "text":
        return (
          <text
            {...commonProps}
            x={shape.x}
            y={shape.y}
            fontSize="24"
            fontFamily="Arial"
          >
            {shape.text}
          </text>
        );
      case "line":
        return (
          <line
            {...commonProps}
            x1={shape.x}
            y1={shape.y}
            x2={shape.x + (shape.width || 100)}
            y2={shape.y + (shape.height || 0)}
            strokeDasharray={isSelected ? "5,5" : "none"}
          />
        );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          SVG Editor
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Create and edit SVG graphics with an intuitive interface.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <svg
                ref={svgRef}
                width="100%"
                height="600"
                style={{ backgroundColor: theme.palette.background.default }}
              >
                {shapes.map((shape) => (
                  <g key={shape.id}>{renderShape(shape)}</g>
                ))}
              </svg>
            </Paper>
          </Grid>

          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Tools
              </Typography>

              <Grid container spacing={1} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={currentTool === "rect" ? "contained" : "outlined"}
                    onClick={() => {
                      setCurrentTool("rect");
                      addShape("rect");
                    }}
                    startIcon={<Square size={16} />}
                  >
                    Rectangle
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={
                      currentTool === "circle" ? "contained" : "outlined"
                    }
                    onClick={() => {
                      setCurrentTool("circle");
                      addShape("circle");
                    }}
                    startIcon={<Circle size={16} />}
                  >
                    Circle
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={currentTool === "text" ? "contained" : "outlined"}
                    onClick={() => {
                      setCurrentTool("text");
                      addShape("text");
                    }}
                    startIcon={<Type size={16} />}
                  >
                    Text
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={currentTool === "line" ? "contained" : "outlined"}
                    onClick={() => {
                      setCurrentTool("line");
                      addShape("line");
                    }}
                    startIcon={<Line size={16} />}
                  >
                    Line
                  </Button>
                </Grid>
              </Grid>

              {selectedShape && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Properties
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="X"
                        type="number"
                        size="small"
                        value={shapes.find((s) => s.id === selectedShape)?.x}
                        onChange={(e) =>
                          updateShape(selectedShape, {
                            x: Number(e.target.value),
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Y"
                        type="number"
                        size="small"
                        value={shapes.find((s) => s.id === selectedShape)?.y}
                        onChange={(e) =>
                          updateShape(selectedShape, {
                            y: Number(e.target.value),
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Fill Color"
                        type="color"
                        size="small"
                        fullWidth
                        value={shapes.find((s) => s.id === selectedShape)?.fill}
                        onChange={(e) =>
                          updateShape(selectedShape, { fill: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Stroke Color"
                        type="color"
                        size="small"
                        fullWidth
                        value={
                          shapes.find((s) => s.id === selectedShape)?.stroke
                        }
                        onChange={(e) =>
                          updateShape(selectedShape, { stroke: e.target.value })
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography gutterBottom>Stroke Width</Typography>
                      <Slider
                        value={
                          shapes.find((s) => s.id === selectedShape)
                            ?.strokeWidth
                        }
                        onChange={(_, value) =>
                          updateShape(selectedShape, {
                            strokeWidth: value as number,
                          })
                        }
                        min={0}
                        max={10}
                        step={1}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={undo}
                  disabled={historyIndex === 0}
                  startIcon={<Undo size={16} />}
                >
                  Undo
                </Button>
                <Button
                  variant="outlined"
                  onClick={redo}
                  disabled={historyIndex === history.length - 1}
                  startIcon={<Redo size={16} />}
                >
                  Redo
                </Button>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={downloadSvg}
                  startIcon={<Download size={16} />}
                  fullWidth
                >
                  Download SVG
                </Button>
                {selectedShape && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => deleteShape(selectedShape)}
                    startIcon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default SvgEditor;
