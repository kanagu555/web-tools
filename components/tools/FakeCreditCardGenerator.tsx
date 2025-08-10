"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  useTheme,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  CircularProgress,
  Tooltip,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  CreditCard,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  User,
  Calendar,
  Lock,
  Trash2,
  Download,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface TestCreditCard {
  type: string;
  numbers: string[];
  cvvLength: number;
  prefixes?: string[];
  lengths?: number[];
  luhnCheck?: boolean;
  color?: string;
  description?: string;
}

interface GeneratedCard {
  type: string;
  number: string;
  expiration: string;
  owner: string;
  cvv: string;
  id: string;
}

interface FakeCreditCardGeneratorProps {
  onGenerate?: (cards: GeneratedCard[]) => void;
}

// Luhn algorithm for credit card validation
const luhnCheck = (cardNumber: string): boolean => {
  const digits = cardNumber.replace(/\D/g, "");
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const FakeCreditCardGenerator: React.FC<FakeCreditCardGeneratorProps> = ({
  onGenerate,
}) => {
  const theme = useTheme();
  const { trackTool, trackFile } = useAnalytics();

  const [selectedCardType, setSelectedCardType] = useState("");
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showValidOnly] = useState(true);

  // Test credit card data
  const testCards: TestCreditCard[] = [
    {
      type: "Visa",
      numbers: [
        "4003830171874018",
        "4111111111111111",
        "4012888888881881",
        "4000000000000002",
      ],
      cvvLength: 3,
      prefixes: ["4"],
      lengths: [16],
      luhnCheck: true,
      color: "#1a1f71",
      description:
        "Widely accepted globally, Visa cards typically start with 4 and have 16 digits.",
    },
    {
      type: "Mastercard",
      numbers: [
        "5496198584584769",
        "2223000048400011",
        "2223520043560014",
        "5555555555554444",
      ],
      cvvLength: 3,
      prefixes: [
        "51",
        "52",
        "53",
        "54",
        "55",
        "222",
        "223",
        "224",
        "225",
        "226",
      ],
      lengths: [16],
      luhnCheck: true,
      color: "#eb001b",
      description:
        "Mastercard numbers start with 51-55 or 2221-2720 and have 16 digits.",
    },
    {
      type: "American Express",
      numbers: ["378282246310005", "371449635398431", "378734493671000"],
      cvvLength: 4,
      prefixes: ["34", "37"],
      lengths: [15],
      luhnCheck: true,
      color: "#006fcf",
      description:
        "American Express cards start with 34 or 37 and have 15 digits. They use a 4-digit CVV.",
    },
    {
      type: "Discover",
      numbers: ["6011111111111117", "6011000990139424", "6011601160116611"],
      cvvLength: 3,
      prefixes: ["6011", "644", "645", "646", "647", "648", "649", "65"],
      lengths: [16],
      luhnCheck: true,
      color: "#ff6000",
      description:
        "Discover cards start with 6011, 644-649, or 65 and have 16 digits.",
    },
    {
      type: "JCB",
      numbers: ["3530111333300000", "3566002020360505", "3566111111111113"],
      cvvLength: 3,
      prefixes: ["35"],
      lengths: [16],
      luhnCheck: true,
      color: "#0e4c96",
      description: "JCB cards start with 35 and typically have 16 digits.",
    },
    {
      type: "Diners Club",
      numbers: ["30569309025904", "38520000023237", "36700102000000"],
      cvvLength: 3,
      prefixes: ["300", "301", "302", "303", "304", "305", "36", "38"],
      lengths: [14, 16],
      luhnCheck: true,
      color: "#0079be",
      description:
        "Diners Club cards start with 300-305, 36, or 38 and have 14 or 16 digits.",
    },
  ];

  // Sample names for card owners
  const sampleNames = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Jessica Miller",
    "Christopher Jones",
    "Amanda Garcia",
    "Matthew Rodriguez",
    "Ashley Martinez",
    "Daniel Anderson",
    "Jennifer Taylor",
    "James Thomas",
    "Lisa Jackson",
    "Robert White",
    "Maria Garcia",
    "William Johnson",
    "Elizabeth Brown",
    "Thomas Davis",
    "Patricia Miller",
    "Charles Wilson",
    "Linda Moore",
    "Richard Taylor",
    "Barbara Anderson",
    "Joseph Thomas",
  ];

  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  // Generate cards based on the selected type
  const generateCards = useCallback(() => {
    if (!selectedCardType) return;

    setIsLoading(true);

    setTimeout(() => {
      try {
        const selectedCard = testCards.find(
          (card) => card.type === selectedCardType
        );
        if (!selectedCard) {
          showSnackbar("Card type not found", "error");
          setIsLoading(false);
          return;
        }

        const cards: GeneratedCard[] = [];

        // Generate cards for all available numbers of the selected type
        selectedCard.numbers.forEach((cardNumber, index) => {
          // Generate random expiration date (future date)
          const currentYear = new Date().getFullYear();
          const futureYear = currentYear + Math.floor(Math.random() * 5) + 1;
          const month = Math.floor(Math.random() * 12) + 1;
          const expiration = `${month.toString().padStart(2, "0")}/${futureYear
            .toString()
            .slice(-2)}`;

          // Generate random CVV based on card type
          const cvvLength = selectedCard.cvvLength;
          const cvv = Math.floor(Math.random() * Math.pow(10, cvvLength))
            .toString()
            .padStart(cvvLength, "0");

          // Get random owner name
          const owner =
            sampleNames[Math.floor(Math.random() * sampleNames.length)];

          cards.push({
            type: selectedCard.type,
            number: cardNumber,
            expiration,
            owner,
            cvv,
            id: `${selectedCard.type}-${Date.now()}-${index}`,
          });
        });

        setGeneratedCards(cards);
        showSnackbar(
          `Generated ${cards.length} test cards successfully`,
          "success"
        );

        // Track analytics
        trackTool("fake-credit-card-generator", "generate");

        // Call onGenerate callback if provided
        if (onGenerate) {
          onGenerate(cards);
        }
      } catch (error) {
        console.error("Error generating cards:", error);
        showSnackbar("Failed to generate cards", "error");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  }, [selectedCardType, showSnackbar, trackTool, onGenerate]);

  // Auto-generate cards when card type is selected
  useEffect(() => {
    if (selectedCardType) {
      generateCards();
    } else {
      setGeneratedCards([]);
    }
  }, [selectedCardType, generateCards]);

  // Handle copying text to clipboard
  const handleCopy = async (text: string, type: string, cardIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`${type}-${cardIndex}-${text}`);
      setTimeout(() => setCopied(null), 2000);
      showSnackbar("Copied to clipboard", "success");
      trackTool("fake-credit-card-generator", "copy");
    } catch (error) {
      console.error("Failed to copy:", error);
      showSnackbar("Failed to copy to clipboard", "error");
    }
  };

  // Handle copying all card details
  const handleCopyAll = async (card: GeneratedCard, cardIndex: number) => {
    try {
      const allDetails = `Card Type: ${card.type}
Card Number: ${formatCardNumber(card.number)}
Expiry Date: ${card.expiration}
CVV: ${card.cvv}
Cardholder Name: ${card.owner.toUpperCase()}`;

      await navigator.clipboard.writeText(allDetails);
      setCopied(`all-${cardIndex}-${card.id}`);
      setTimeout(() => setCopied(null), 2000);
      showSnackbar("All card details copied to clipboard", "success");
      trackTool("fake-credit-card-generator", "copy_all");
    } catch (error) {
      console.error("Failed to copy all details:", error);
      showSnackbar("Failed to copy all details to clipboard", "error");
    }
  };

  // Clear all generated cards
  const clearGeneratedCards = () => {
    setGeneratedCards([]);
    showSnackbar("All generated cards cleared", "info");
    trackTool("fake-credit-card-generator", "clear");
  };

  // Export all cards as JSON
  const exportCards = () => {
    try {
      if (generatedCards.length === 0) {
        showSnackbar("No cards to export", "warning");
        return;
      }

      const dataStr = JSON.stringify(generatedCards, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
        dataStr
      )}`;
      const exportFileName = `test-credit-cards-${
        new Date().toISOString().split("T")[0]
      }.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileName);
      linkElement.click();

      showSnackbar("Cards exported successfully", "success");
      trackFile("export", "json", true);
    } catch (error) {
      console.error("Error exporting cards:", error);
      showSnackbar("Failed to export cards", "error");
      trackFile("export", "json", false);
    }
  };

  // Check if a card number is valid using the Luhn algorithm
  const isCardValid = (cardNumber: string): boolean => {
    return luhnCheck(cardNumber.replace(/\s/g, ""));
  };

  const getCardTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "visa":
        return "#1a1f71";
      case "mastercard":
        return "#eb001b";
      case "american express":
        return "#006fcf";
      case "discover":
        return "#ff6000";
      case "jcb":
        return "#0e4c96";
      case "diners club":
        return "#0079be";
      default:
        return theme.palette.primary.main;
    }
  };

  const getCardIcon = (type: string) => {
    const iconStyle = {
      width: "40px",
      height: "24px",
      borderRadius: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      fontWeight: "bold",
      color: "white",
      backgroundColor: getCardTypeColor(type),
    };

    switch (type.toLowerCase()) {
      case "visa":
        return <Box sx={iconStyle}>VISA</Box>;
      case "mastercard":
        return (
          <Box
            sx={{
              ...iconStyle,
              background: "linear-gradient(90deg, #eb001b 50%, #ff5f00 50%)",
            }}
          >
            MC
          </Box>
        );
      case "american express":
        return <Box sx={iconStyle}>AMEX</Box>;
      case "discover":
        return <Box sx={iconStyle}>DISC</Box>;
      case "jcb":
        return <Box sx={iconStyle}>JCB</Box>;
      case "diners club":
        return <Box sx={iconStyle}>DC</Box>;
      default:
        return (
          <Box sx={iconStyle}>
            <CreditCard size={16} />
          </Box>
        );
    }
  };

  const formatCardNumber = (number: string) => {
    return number.replace(/(.{4})/g, "$1 ").trim();
  };

  const getCardGradient = (type: string) => {
    const baseColor = getCardTypeColor(type);
    return `linear-gradient(135deg, ${baseColor}20, ${baseColor}10)`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          Fake Credit Card Generator
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Generate fake credit card numbers for testing purposes. Perfect for
          development and testing payment systems.
        </Typography>

        <Alert severity="warning" icon={<AlertTriangle />} sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>For Testing Only:</strong> These are fake credit card
            numbers generated for development and testing purposes only. Do not
            use for any real transactions or fraudulent activities.
          </Typography>
        </Alert>

        {/* Generator Controls */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mb: 4,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Card Type</InputLabel>
                <Select
                  value={selectedCardType}
                  onChange={(e) => setSelectedCardType(e.target.value)}
                  label="Card Type"
                >
                  {testCards.map((card) => (
                    <MenuItem key={card.type} value={card.type}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {getCardIcon(card.type)}
                        <Typography>{card.type}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({card.numbers.length} cards)
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ width: "100%" }}>
                <Typography gutterBottom>
                  Custom Cards: {customCardCount}
                </Typography>
                <Slider
                  value={customCardCount}
                  onChange={(_, newValue) =>
                    setCustomCardCount(newValue as number)
                  }
                  min={1}
                  max={10}
                  marks
                  step={1}
                  valueLabelDisplay="auto"
                />
              </Box>
            </Grid> */}

            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={generateCards}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={18} />
                    ) : (
                      <RefreshCw size={18} />
                    )
                  }
                  disabled={!selectedCardType || isLoading}
                  sx={{ flex: 1 }}
                >
                  {isLoading ? "Generating..." : "Generate Cards"}
                </Button>
              </Box>
            </Grid>
          </Grid>

          {generatedCards.length > 0 && (
            <Box
              sx={{
                mt: 3,
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ alignSelf: "center" }}
              >
                Generated {generatedCards.length} test cards
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Download size={16} />}
                  onClick={exportCards}
                >
                  Export JSON
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  startIcon={<Trash2 size={16} />}
                  onClick={clearGeneratedCards}
                >
                  Clear All
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Generated Cards Display */}
        {generatedCards.length > 0 && (
          <Grid container spacing={3}>
            {generatedCards
              .filter((card) => !showValidOnly || isCardValid(card.number))
              .map((card, index) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  key={card.id || `${card.number}-${index}`}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 0,
                        borderRadius: 3,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        position: "relative",
                        overflow: "hidden",
                        background: getCardGradient(card.type),
                      }}
                    >
                      {/* Card Header */}
                      <Box
                        sx={{
                          p: 3,
                          background: `linear-gradient(135deg, ${getCardTypeColor(
                            card.type
                          )}15, ${getCardTypeColor(card.type)}05)`,
                          borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            {getCardIcon(card.type)}
                            <Typography variant="h6" fontWeight={600}>
                              {card.type}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Chip
                              label={
                                isCardValid(card.number) ? "Valid" : "Invalid"
                              }
                              color={
                                isCardValid(card.number) ? "success" : "error"
                              }
                              size="small"
                            />
                            <Chip
                              label="TEST"
                              size="small"
                              sx={{
                                backgroundColor: theme.palette.warning.main,
                                color: theme.palette.warning.contrastText,
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      {/* Card Details */}
                      <Box sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                          {/* Card Number */}
                          <Grid item xs={12}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1, fontWeight: 500 }}
                            >
                              Card Number
                            </Typography>
                            <Box
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                p: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: theme.palette.primary.main,
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <CreditCard
                                size={16}
                                color={theme.palette.text.secondary}
                              />
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                                sx={{ flex: 1, fontWeight: 500 }}
                              >
                                {formatCardNumber(card.number)}
                              </Typography>
                              <Tooltip title="Copy card number">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleCopy(card.number, "number", index)
                                  }
                                  sx={{
                                    color:
                                      copied ===
                                      `number-${index}-${card.number}`
                                        ? "success.main"
                                        : "primary.main",
                                  }}
                                >
                                  {copied ===
                                  `number-${index}-${card.number}` ? (
                                    <Check size={16} />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>

                          {/* Expiration Date */}
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1, fontWeight: 500 }}
                            >
                              Expiration Date
                            </Typography>
                            <Box
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                p: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: theme.palette.primary.main,
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <Calendar
                                size={16}
                                color={theme.palette.text.secondary}
                              />
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                                sx={{ flex: 1, fontWeight: 500 }}
                              >
                                {card.expiration}
                              </Typography>
                              <Tooltip title="Copy expiry date">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleCopy(card.expiration, "expiry", index)
                                  }
                                  sx={{
                                    color:
                                      copied ===
                                      `expiry-${index}-${card.expiration}`
                                        ? "success.main"
                                        : "primary.main",
                                  }}
                                >
                                  {copied ===
                                  `expiry-${index}-${card.expiration}` ? (
                                    <Check size={16} />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>

                          {/* CVV */}
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1, fontWeight: 500 }}
                            >
                              CVV Code
                            </Typography>
                            <Box
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                p: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: theme.palette.primary.main,
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <Lock
                                size={16}
                                color={theme.palette.text.secondary}
                              />
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                                sx={{ flex: 1, fontWeight: 500 }}
                              >
                                {card.cvv}
                              </Typography>
                              <Tooltip title="Copy CVV">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleCopy(card.cvv, "cvv", index)
                                  }
                                  sx={{
                                    color:
                                      copied === `cvv-${index}-${card.cvv}`
                                        ? "success.main"
                                        : "primary.main",
                                  }}
                                >
                                  {copied === `cvv-${index}-${card.cvv}` ? (
                                    <Check size={16} />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>

                          {/* Cardholder Name */}
                          <Grid item xs={12}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1, fontWeight: 500 }}
                            >
                              Cardholder Name
                            </Typography>
                            <Box
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                p: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: theme.palette.primary.main,
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                            >
                              <User
                                size={16}
                                color={theme.palette.text.secondary}
                              />
                              <Typography
                                variant="body1"
                                sx={{
                                  flex: 1,
                                  textTransform: "uppercase",
                                  fontWeight: 500,
                                }}
                              >
                                {card.owner}
                              </Typography>
                              <Tooltip title="Copy cardholder name">
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleCopy(card.owner, "owner", index)
                                  }
                                  sx={{
                                    color:
                                      copied === `owner-${index}-${card.owner}`
                                        ? "success.main"
                                        : "primary.main",
                                  }}
                                >
                                  {copied === `owner-${index}-${card.owner}` ? (
                                    <Check size={16} />
                                  ) : (
                                    <Copy size={16} />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Grid>

                          {/* Copy All Button */}
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                mt: 1,
                                pt: 2,
                              }}
                            >
                              <Button
                                variant="outlined"
                                fullWidth
                                startIcon={
                                  copied === `all-${index}-${card.id}` ? (
                                    <Check size={16} />
                                  ) : (
                                    <Copy size={16} />
                                  )
                                }
                                onClick={() => handleCopyAll(card, index)}
                                sx={{
                                  color:
                                    copied === `all-${index}-${card.id}`
                                      ? "success.main"
                                      : "primary.main",
                                  borderColor:
                                    copied === `all-${index}-${card.id}`
                                      ? "success.main"
                                      : "primary.main",
                                }}
                              >
                                {copied === `all-${index}-${card.id}`
                                  ? "All Details Copied!"
                                  : "Copy All Details"}
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
        )}

        {/* AdSense Ad */}
        <AdSense adSlot="6613251015" />

        {/* Information Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            About Test Credit Cards
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                What are Test Credit Cards?
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Test credit cards are fake credit card numbers that follow the
                same format as real credit cards but are specifically designed
                for testing payment systems. They pass basic validation checks
                like the Luhn algorithm but cannot be used for actual
                transactions.
              </Typography>

              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, mt: 3, fontWeight: 600 }}
              >
                Luhn Algorithm Validation
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The Luhn algorithm is a checksum formula used to validate credit
                card numbers. Our generator creates numbers that pass this
                validation, making them suitable for testing form validation and
                payment processing logic.
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                Supported Card Types
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Visa (16 digits, starts with 4)</li>
                <li>Mastercard (16 digits, starts with 51-55 or 2221-2720)</li>
                <li>American Express (15 digits, starts with 34 or 37)</li>
                <li>Discover (16 digits, starts with 6011, 644-649, or 65)</li>
                <li>JCB (16 digits, starts with 35)</li>
                <li>
                  Diners Club (14-16 digits, starts with 300-305, 36, or 38)
                </li>
              </Box>

              <Typography
                variant="h6"
                component="h3"
                sx={{ mb: 2, mt: 3, fontWeight: 600 }}
              >
                Use Cases
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <li>Payment form validation testing</li>
                <li>E-commerce checkout flow testing</li>
                <li>Payment gateway integration testing</li>
                <li>User interface mockups and demos</li>
                <li>Educational purposes and training</li>
              </Box>
            </Grid>
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> These test cards are for development
              and testing purposes only. They will not work for real purchases
              and should never be used for fraudulent activities. Always use
              official test cards provided by payment processors in production
              testing environments.
            </Typography>
          </Alert>
        </Paper>

        {/* Test Card Numbers Reference */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Available Test Card Numbers
          </Typography>
          <Grid container spacing={2}>
            {testCards.map((cardType) => (
              <Grid item xs={12} md={6} key={cardType.type}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {getCardIcon(cardType.type)}
                    <Typography variant="subtitle1" fontWeight={600}>
                      {cardType.type}
                    </Typography>
                    <Chip
                      label={`CVV: ${cardType.cvvLength} digits`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  {cardType.numbers.map((number, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      fontFamily="monospace"
                      sx={{
                        color: "text.secondary",
                        fontSize: "0.875rem",
                        mb: 0.5,
                      }}
                    >
                      {formatCardNumber(number)}
                    </Typography>
                  ))}
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <Typography variant="h6" gutterBottom itemProp="name">
            Usage Guidelines
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                ✅ Appropriate Uses:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {[
                  "Testing payment forms",
                  "Development environments",
                  "UI/UX design mockups",
                  "Educational purposes",
                  "API testing and validation",
                ].map((use, index) => (
                  <li
                    key={index}
                    itemProp="acceptedAnswer"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <Typography variant="body2" itemProp="text">
                      {use}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                ❌ Inappropriate Uses:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {[
                  "Real transactions",
                  "Fraudulent activities",
                  "Identity theft",
                  "Illegal purposes",
                  "Production environments",
                ].map((use, index) => (
                  <li
                    key={index}
                    itemProp="acceptedAnswer"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <Typography variant="body2" itemProp="text">
                      {use}
                    </Typography>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="6613251015" />
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FakeCreditCardGenerator;
