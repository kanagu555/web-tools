"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import AdSense from "./AdSense";

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastOperation, setLastOperation] = useState("");
  const theme = useTheme();

  const handleNumberInput = (num: string) => {
    if (display === "0" || display === "Error") {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
    setExpression(expression + num);
  };

  const handleOperatorInput = (operator: string) => {
    // Replace operator if the last character is already an operator
    if (["+", "-", "*", "/"].includes(expression.slice(-1))) {
      setExpression(expression.slice(0, -1) + operator);
    } else {
      setExpression(expression + operator);
    }
    setDisplay("0");
  };

  const handleDecimalInput = () => {
    // Check if the current number already has a decimal point
    const currentNumber = display.split(/[+\-*/]/).pop() || "";
    if (!currentNumber.includes(".")) {
      setDisplay(display + ".");
      setExpression(expression + ".");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setLastOperation("");
  };

  const handleBackspace = () => {
    if (display === "Error" || display.length === 1) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }

    if (expression.length > 0) {
      setExpression(expression.slice(0, -1));
    }
  };

  const handleCalculate = () => {
    if (!expression) return;

    try {
      // Use Function constructor to safely evaluate the expression
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${expression}`)();

      // Format the result
      const formattedResult = Number.isInteger(result)
        ? result.toString()
        : result.toFixed(8).replace(/\.?0+$/, "");

      // Add to history
      const historyItem: HistoryItem = {
        expression: expression,
        result: formattedResult,
        timestamp: new Date(),
      };
      setHistory([historyItem, ...history.slice(0, 9)]);

      // Update display and expression
      setDisplay(formattedResult);
      setExpression(formattedResult);
      setLastOperation(expression);
    } catch (error) {
      setDisplay("Error");
      setExpression("");
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleNumberInput(e.key);
      } else if (
        e.key === "+" ||
        e.key === "-" ||
        e.key === "*" ||
        e.key === "/"
      ) {
        handleOperatorInput(e.key);
      } else if (e.key === ".") {
        handleDecimalInput();
      } else if (e.key === "Enter" || e.key === "=") {
        handleCalculate();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);  // Empty dependency array, using function closures instead

  const handlePercentage = () => {
    try {
      const value = Number.parseFloat(display) / 100;
      setDisplay(value.toString());
      setExpression(value.toString());
    } catch (error) {
      setDisplay("Error");
    }
  };

  const handleSquareRoot = () => {
    try {
      const value = Math.sqrt(Number.parseFloat(display));
      if (isNaN(value)) {
        setDisplay("Error");
      } else {
        const formattedResult = value.toFixed(8).replace(/\.?0+$/, "");
        setDisplay(formattedResult);
        setExpression(formattedResult);
      }
    } catch (error) {
      setDisplay("Error");
    }
  };

  const handleSquare = () => {
    try {
      const value = Math.pow(Number.parseFloat(display), 2);
      const formattedResult = value.toFixed(8).replace(/\.?0+$/, "");
      setDisplay(formattedResult);
      setExpression(formattedResult);
    } catch (error) {
      setDisplay("Error");
    }
  };

  const handleToggleSign = () => {
    if (display !== "0" && display !== "Error") {
      const value = Number.parseFloat(display) * -1;
      setDisplay(value.toString());

      // Update the expression by replacing the last number
      const regex = /(-?\d*\.?\d+)$/;
      const match = expression.match(regex);
      if (match) {
        const lastNumber = match[0];
        const index = expression.lastIndexOf(lastNumber);
        setExpression(expression.substring(0, index) + value.toString());
      } else {
        setExpression(value.toString());
      }
    }
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    setDisplay(item.result);
    setExpression(item.result);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const renderButton = (
    label: string | JSX.Element,
    onClick: () => void,
    variant: "contained" | "outlined" = "outlined",
    color:
      | "primary"
      | "secondary"
      | "error"
      | "info"
      | "success"
      | "warning"
      | "inherit" = "primary",
    size = 1
  ) => (
    <Grid item xs={3 * size}>
      <Button
        fullWidth
        variant={variant}
        color={color}
        onClick={onClick}
        sx={{
          height: 64,
          fontSize: typeof label === "string" ? "1.25rem" : undefined,
          fontWeight: "bold",
        }}
      >
        {label}
      </Button>
    </Grid>
  );

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={showHistory ? 8 : 12}>
          <Typography variant="h6" gutterBottom>
            Calculator
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              value={display}
              InputProps={{
                readOnly: true,
                sx: {
                  fontSize: "2rem",
                  fontWeight: "bold",
                  textAlign: "right",
                  fontFamily: "monospace",
                },
              }}
              sx={{ mb: 1 }}
            />
            <Typography
              variant="body2"
              sx={{
                textAlign: "right",
                color: "text.secondary",
                fontFamily: "monospace",
                minHeight: "1.5rem",
              }}
            >
              {expression || "\u00A0"}
            </Typography>
          </Box>

          <Grid container spacing={1}>
            {/* First row */}
            {renderButton("C", handleClear, "contained", "error")}
            {renderButton(
              <BackspaceIcon />,
              handleBackspace,
              "outlined",
              "error"
            )}
            {renderButton("%", handlePercentage, "outlined", "info")}
            {renderButton(
              "÷",
              () => handleOperatorInput("/"),
              "outlined",
              "info"
            )}

            {/* Second row */}
            {renderButton("7", () => handleNumberInput("7"))}
            {renderButton("8", () => handleNumberInput("8"))}
            {renderButton("9", () => handleNumberInput("9"))}
            {renderButton(
              "×",
              () => handleOperatorInput("*"),
              "outlined",
              "info"
            )}

            {/* Third row */}
            {renderButton("4", () => handleNumberInput("4"))}
            {renderButton("5", () => handleNumberInput("5"))}
            {renderButton("6", () => handleNumberInput("6"))}
            {renderButton(
              "-",
              () => handleOperatorInput("-"),
              "outlined",
              "info"
            )}

            {/* Fourth row */}
            {renderButton("1", () => handleNumberInput("1"))}
            {renderButton("2", () => handleNumberInput("2"))}
            {renderButton("3", () => handleNumberInput("3"))}
            {renderButton(
              "+",
              () => handleOperatorInput("+"),
              "outlined",
              "info"
            )}

            {/* Fifth row */}
            {renderButton("±", handleToggleSign)}
            {renderButton("0", () => handleNumberInput("0"))}
            {renderButton(".", handleDecimalInput)}
            {renderButton("=", handleCalculate, "contained", "primary")}

            {/* Sixth row - Additional operations */}
            {renderButton("x²", handleSquare, "outlined", "secondary")}
            {renderButton("√x", handleSquareRoot, "outlined", "secondary")}
            {renderButton(
              <HistoryIcon />,
              () => setShowHistory(!showHistory),
              "outlined",
              showHistory ? "primary" : "inherit"
            )}
          </Grid>
        </Grid>

        {showHistory && (
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">History</Typography>
              <IconButton
                onClick={handleClearHistory}
                disabled={history.length === 0}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            {history.length > 0 ? (
              <List
                sx={{
                  maxHeight: 400,
                  overflow: "auto",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                {history.map((item, index) => (
                  <Box key={index}>
                    {index > 0 && <Divider />}
                    <ListItem
                      button
                      onClick={() => handleHistoryItemClick(item)}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: "monospace" }}
                          >
                            {item.expression} = <strong>{item.result}</strong>
                          </Typography>
                        }
                        secondary={item.timestamp.toLocaleTimeString()}
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            ) : (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No calculation history yet
              </Typography>
            )}
          </Grid>
        )}
      </Grid>

      <AdSense adSlot="1234567890" adFormat="auto" />
    </Paper>
  );
}
