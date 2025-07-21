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
  Breadcrumbs,
  Link,
  CircularProgress,
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
  Home,
  Calculator,
  Trash2,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import { Link as RouterLink } from "react-router-dom";

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
  id: string; // Unique identifier for each card
}

// Luhn algorithm for credit card validation
const luhnCheck = (cardNumber: string): boolean => {
  // Remove any non-digit characters
  const digits = cardNumber.replace(/\D/g, "");

  let sum = 0;
  let shouldDouble = false;

  // Loop through digits in reverse order
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

const FakeCreditCardGenerator = () => {
  const theme = useTheme();
  const [selectedCardType, setSelectedCardType] = useState("");
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [isLoading, setIsLoading] = useState(false);
  const [showValidOnly, setShowValidOnly] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [customCardCount, setCustomCardCount] = useState(1);
  const [customPrefix, setCustomPrefix] = useState("");
  const [savedCards, setSavedCards] = useState<GeneratedCard[]>([]);
  const isProductionEnv = import.meta.env.PROD;

  // Test credit card data with enhanced information
  const testCards: TestCreditCard[] = [
    {
      type: "Visa",
      numbers: ["4003830171874018", "4111111111111111", "4012888888881881"],
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
        "227",
        "228",
        "229",
        "23",
        "24",
        "25",
        "26",
        "270",
        "271",
        "2720",
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
    {
      type: "UnionPay",
      numbers: ["6212345678901232", "6250941006528599", "6250941006528599"],
      cvvLength: 3,
      prefixes: ["62"],
      lengths: [16, 17, 18, 19],
      luhnCheck: false, // Some UnionPay cards don't use Luhn algorithm
      color: "#00447c",
      description:
        "UnionPay cards start with 62 and can have 16-19 digits. Not all follow the Luhn algorithm.",
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

  // Show a snackbar message
  const showSnackbar = useCallback(
    (message: string, severity: "success" | "error" | "info" | "warning") => {
      setSnackbarMessage(message);
      setSnackbarSeverity(severity);
      setSnackbarOpen(true);
    },
    []
  );

  // Generate a random card number that passes Luhn check
  const generateRandomCardNumber = (
    prefixes: string[] = ["4"],
    length: number = 16
  ): string => {
    // Select a random prefix
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

    // Generate random digits for the remaining length
    let cardNumber = prefix;
    const remainingLength = length - prefix.length - 1; // -1 for the check digit

    for (let i = 0; i < remainingLength; i++) {
      cardNumber += Math.floor(Math.random() * 10).toString();
    }

    // Calculate the check digit using Luhn algorithm
    let sum = 0;
    let shouldDouble = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i));

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return cardNumber + checkDigit;
  };

  // Generate a random valid card number for a specific card type
  const generateCardNumberForType = (cardType: TestCreditCard): string => {
    if (!cardType.prefixes || !cardType.lengths) {
      // If no prefixes or lengths defined, return a random number from the predefined list
      return cardType.numbers[
        Math.floor(Math.random() * cardType.numbers.length)
      ];
    }

    // Select a random length from the available lengths
    const length =
      cardType.lengths[Math.floor(Math.random() * cardType.lengths.length)];

    // Generate a random card number with the correct prefix and length
    let cardNumber = generateRandomCardNumber(cardType.prefixes, length);

    // If luhnCheck is required, ensure the number passes
    if (cardType.luhnCheck !== false) {
      while (!luhnCheck(cardNumber)) {
        cardNumber = generateRandomCardNumber(cardType.prefixes, length);
      }
    }

    return cardNumber;
  };

  // Generate cards based on the selected type
  const generateCards = () => {
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
          const futureYear = currentYear + Math.floor(Math.random() * 5) + 1; // 1-5 years in future
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
      } catch (error) {
        console.error("Error generating cards:", error);
        showSnackbar("Failed to generate cards", "error");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Generate custom cards with random valid numbers
  const generateCustomCards = () => {
    if (!selectedCardType) {
      showSnackbar("Please select a card type first", "warning");
      return;
    }

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
        const count = Math.min(Math.max(1, customCardCount), 10); // Limit between 1-10 cards

        for (let i = 0; i < count; i++) {
          // Generate a valid card number
          let cardNumber;

          if (customPrefix && customPrefix.length > 0) {
            // Use custom prefix if provided
            const prefixDigits = customPrefix.replace(/\D/g, "");
            if (prefixDigits.length > 0) {
              const selectedLength = selectedCard.lengths
                ? selectedCard.lengths[0]
                : 16;

              if (prefixDigits.length >= selectedLength) {
                cardNumber = prefixDigits.substring(0, selectedLength);
              } else {
                cardNumber = generateRandomCardNumber(
                  [prefixDigits],
                  selectedLength
                );
              }
            } else {
              cardNumber = generateCardNumberForType(selectedCard);
            }
          } else {
            cardNumber = generateCardNumberForType(selectedCard);
          }

          // Generate random expiration date (future date)
          const currentYear = new Date().getFullYear();
          const futureYear = currentYear + Math.floor(Math.random() * 5) + 1;
          const month = Math.floor(Math.random() * 12) + 1;
          const expiration = `${month.toString().padStart(2, "0")}/${futureYear
            .toString()
            .slice(-2)}`;

          // Generate random CVV
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
            id: `custom-${selectedCard.type}-${Date.now()}-${i}`,
          });
        }

        setGeneratedCards(cards);
        showSnackbar(`Generated ${cards.length} custom test cards`, "success");
      } catch (error) {
        console.error("Error generating custom cards:", error);
        showSnackbar("Failed to generate custom cards", "error");
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Auto-generate cards when card type is selected
  useEffect(() => {
    if (selectedCardType) {
      generateCards();
    } else {
      setGeneratedCards([]);
    }
  }, [selectedCardType]);

  // Handle copying text to clipboard
  const handleCopy = async (text: string, type: string, cardIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`${type}-${cardIndex}-${text}`);
      setTimeout(() => setCopied(null), 2000);
      showSnackbar("Copied to clipboard", "success");
    } catch (error) {
      console.error("Failed to copy:", error);
      showSnackbar("Failed to copy to clipboard", "error");
    }
  };

  // Save a card to the saved cards list
  const saveCard = (card: GeneratedCard) => {
    // Check if card is already saved
    if (savedCards.some((savedCard) => savedCard.id === card.id)) {
      showSnackbar("Card already saved", "info");
      return;
    }

    setSavedCards((prev) => [...prev, card]);
    showSnackbar("Card saved to your collection", "success");
  };

  // Remove a card from the saved cards list
  const removeCard = (cardId: string) => {
    setSavedCards((prev) => prev.filter((card) => card.id !== cardId));
    showSnackbar("Card removed from your collection", "info");
  };

  // Clear all generated cards
  const clearGeneratedCards = () => {
    setGeneratedCards([]);
    showSnackbar("All generated cards cleared", "info");
  };

  // Clear all saved cards
  const clearSavedCards = () => {
    setSavedCards([]);
    showSnackbar("All saved cards cleared", "info");
  };

  // Export all cards as JSON
  const exportCards = () => {
    try {
      const cardsToExport = currentTab === 0 ? generatedCards : savedCards;
      if (cardsToExport.length === 0) {
        showSnackbar("No cards to export", "warning");
        return;
      }

      const dataStr = JSON.stringify(cardsToExport, null, 2);
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
    } catch (error) {
      console.error("Error exporting cards:", error);
      showSnackbar("Failed to export cards", "error");
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
      case "amex":
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
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: "8px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#eb001b",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: "8px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: "#ff5f00",
              }}
            />
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
    <Container maxWidth="lg" sx={{ py: 8 }} component="main">
      {/* Skip link for keyboard navigation */}
      <Box
        component="a"
        href="#main-heading"
        sx={{
          position: "absolute",
          top: "-40px",
          left: 0,
          p: 2,
          bgcolor: "background.paper",
          zIndex: 1500,
          transition: "top 0.2s",
          "&:focus": {
            top: 0,
            outline: `2px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        Skip to main content
      </Box>

      <Helmet>
        <title>
          Fake Credit Card Generator | Test Credit Card Numbers for Developers
        </title>
        <meta
          name="description"
          content="Generate fake credit card numbers for testing and development. Get valid test credit card numbers with CVV and expiration dates for Visa, Mastercard, Amex and more."
        />
        <meta
          name="keywords"
          content="fake credit card, test credit card, credit card generator, dummy credit card, test payment, developer tools, visa test card, mastercard test number, amex test card, discover test card, jcb test card, payment testing, ecommerce testing"
        />
        <meta
          property="og:title"
          content="Fake Credit Card Generator | Test Credit Card Numbers for Developers"
        />
        <meta
          property="og:description"
          content="Generate fake credit card numbers for testing and development. Get valid test credit card numbers with CVV and expiration dates."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.kodekit.in/tools/fake-credit-card-generator"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Fake Credit Card Generator | Test Credit Card Numbers for Developers"
        />
        <meta
          name="twitter:description"
          content="Generate fake credit card numbers for testing and development. Get valid test credit card numbers with CVV and expiration dates."
        />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/fake-credit-card-generator"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Fake Credit Card Generator",
            description:
              "Tool for generating test credit card numbers for development and testing purposes",
            url: "https://www.kodekit.in/tools/fake-credit-card-generator",
            applicationCategory: "DeveloperTool",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "KodeKit",
            },
          })}
        </script>
      </Helmet>

      {/* Breadcrumbs for better navigation and SEO */}
      <Breadcrumbs aria-label="breadcrumb navigation" sx={{ mb: 3 }}>
        <Link
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          underline="hover"
        >
          <Home size={16} style={{ marginRight: 4 }} />
          Home
        </Link>
        <Link
          component={RouterLink}
          to="/tools"
          color="inherit"
          sx={{ display: "flex", alignItems: "center" }}
          underline="hover"
        >
          <Calculator size={16} style={{ marginRight: 4 }} />
          Tools
        </Link>
        <Typography color="text.primary" aria-current="page">
          Fake Credit Card Generator
        </Typography>
      </Breadcrumbs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-labelledby="main-heading"
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          fontWeight={700}
          id="main-heading"
        >
          Fake Credit Card Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Generate fake credit card numbers for testing purposes. Perfect for
          development and testing payment systems.
        </Typography>

        <Alert
          severity="warning"
          icon={<AlertTriangle />}
          sx={{ mb: 4 }}
          role="alert"
        >
          <Typography variant="body2">
            <strong>For Testing Only:</strong> These are fake credit card
            numbers generated for development and testing purposes only. Do not
            use for any real transactions or fraudulent activities.
          </Typography>
        </Alert>

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
          {/* Tab 1: Standard Generator */}
          <Box
            role="tabpanel"
            hidden={currentTab !== 0}
            id="tabpanel-0"
            aria-labelledby="tab-0"
          >
            {currentTab === 0 && (
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
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
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
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={showValidOnly}
                          onChange={(e) => setShowValidOnly(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Show valid cards only"
                    />
                    <Tooltip title="When enabled, only shows cards that pass the Luhn check algorithm">
                      <IconButton size="small">
                        <Info size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid> */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ display: "flex", gap: 2 }}>
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
                    {generatedCards.length > 0 && (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={clearGeneratedCards}
                        startIcon={<Trash2 size={18} />}
                        disabled={isLoading}
                      >
                        Clear
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        </Paper>

        {/* Display cards based on current tab */}
        {generatedCards.length > 0 ? (
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
                      aria-label={`${card.type} test credit card`}
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
                            {isCardValid(card.number) ? (
                              <Chip
                                label="VALID"
                                size="small"
                                color="success"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                }}
                              />
                            ) : (
                              <Chip
                                label="INVALID"
                                size="small"
                                color="error"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: "0.75rem",
                                }}
                              />
                            )}
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

                      {/* Card Body */}
                      <Box sx={{ p: 3 }}>
                        {/* Card Number */}
                        <Box sx={{ mb: 3 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Card Number
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              p: 2,
                              backgroundColor: theme.palette.background.default,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                            aria-label={`Card number: ${formatCardNumber(
                              card.number
                            )}`}
                          >
                            <Typography
                              variant="h6"
                              fontFamily="monospace"
                              sx={{
                                letterSpacing: "0.1em",
                                flex: 1,
                                fontSize: "1rem",
                              }}
                            >
                              {formatCardNumber(card.number)}
                            </Typography>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() =>
                                handleCopy(card.number, "number", index)
                              }
                              sx={{ minWidth: "auto", p: 0 }}
                              startIcon={
                                copied === `number-${index}-${card.number}` ? (
                                  <Check size={16} />
                                ) : (
                                  <Copy size={16} />
                                )
                              }
                              aria-label={`Copy card number ${formatCardNumber(
                                card.number
                              )}`}
                            />
                          </Box>
                        </Box>

                        {/* Expiration and CVV */}
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Expiration Date
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                              aria-label={`Expiration date: ${card.expiration}`}
                            >
                              <Calendar
                                size={16}
                                color={theme.palette.text.secondary}
                              />
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                                sx={{ flex: 1 }}
                              >
                                {card.expiration}
                              </Typography>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() =>
                                  handleCopy(
                                    card.expiration,
                                    "expiration",
                                    index
                                  )
                                }
                                sx={{ minWidth: "auto", p: 0.5 }}
                                aria-label={`Copy expiration date ${card.expiration}`}
                              >
                                {copied ===
                                `expiration-${index}-${card.expiration}` ? (
                                  <Check size={14} />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </Button>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              CVV Code
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 2,
                                backgroundColor:
                                  theme.palette.background.default,
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                              aria-label={`CVV code: ${card.cvv}`}
                            >
                              <Lock
                                size={16}
                                color={theme.palette.text.secondary}
                              />
                              <Typography
                                variant="body1"
                                fontFamily="monospace"
                                sx={{ flex: 1 }}
                              >
                                {card.cvv}
                              </Typography>
                              <Button
                                size="small"
                                variant="text"
                                onClick={() =>
                                  handleCopy(card.cvv, "cvv", index)
                                }
                                sx={{ minWidth: "auto", p: 0.5 }}
                                aria-label={`Copy CVV code ${card.cvv}`}
                              >
                                {copied === `cvv-${index}-${card.cvv}` ? (
                                  <Check size={14} />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>

                        {/* Cardholder Name */}
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            Cardholder Name
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              p: 2,
                              backgroundColor: theme.palette.background.default,
                              borderRadius: 2,
                              border: `1px solid ${theme.palette.divider}`,
                            }}
                            aria-label={`Cardholder name: ${card.owner}`}
                          >
                            <User
                              size={16}
                              color={theme.palette.text.secondary}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                textTransform: "uppercase",
                                flex: 1,
                                fontWeight: 500,
                              }}
                            >
                              {card.owner}
                            </Typography>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() =>
                                handleCopy(card.owner, "owner", index)
                              }
                              sx={{ minWidth: "auto", p: 0.5 }}
                              aria-label={`Copy cardholder name ${card.owner}`}
                            >
                              {copied === `owner-${index}-${card.owner}` ? (
                                <Check size={14} />
                              ) : (
                                <Copy size={14} />
                              )}
                            </Button>
                          </Box>
                        </Box>

                        {/* Copy All Button */}
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 3 }}
                          onClick={() => {
                            const allData = `Card Number: ${card.number}\nExpiration: ${card.expiration}\nCVV: ${card.cvv}\nCardholder: ${card.owner}`;
                            handleCopy(allData, "all", index);
                          }}
                          startIcon={
                            copied ===
                            `all-${index}-${card.number}${card.expiration}${card.cvv}${card.owner}` ? (
                              <Check />
                            ) : (
                              <Copy />
                            )
                          }
                          aria-label="Copy all card details"
                        >
                          {copied ===
                          `all-${index}-${card.number}${card.expiration}${card.cvv}${card.owner}`
                            ? "Copied!"
                            : "Copy All"}
                        </Button>
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
          </Grid>
        ) : (
          currentTab !== 2 && (
            <Paper
              elevation={0}
              sx={{
                p: 6,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                textAlign: "center",
              }}
              aria-label="No credit cards generated yet"
            >
              <CreditCard size={64} color={theme.palette.text.secondary} />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Generate Test Credit Cards
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select a card type and click the generate button to create fake
                credit card numbers for testing
              </Typography>
            </Paper>
          )
        )}

        {isProductionEnv && <AdSense adSlot="6613251015" />}

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

        {/* About Credit Card Validation */}
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
            About Credit Card Validation
          </Typography>
          <Typography paragraph>
            Credit card numbers are not random. They follow specific patterns
            and validation rules, including the Luhn algorithm (also known as
            the "modulus 10" algorithm). This tool generates both valid and
            invalid test card numbers.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                The Luhn Algorithm
              </Typography>
              <Typography variant="body2" paragraph>
                The Luhn algorithm is a checksum formula used to validate
                identification numbers, including credit card numbers. It works
                by:
              </Typography>
              <ol>
                <li>
                  <Typography variant="body2">
                    Starting from the rightmost digit (check digit), double the
                    value of every second digit
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    If doubling results in a two-digit number, add those digits
                    together
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Sum all the digits in the resulting sequence
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    If the sum is divisible by 10, the number is valid
                  </Typography>
                </li>
              </ol>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Card Number Structure
              </Typography>
              <Typography variant="body2" paragraph>
                Credit card numbers typically consist of:
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    <strong>Issuer Identification Number (IIN)</strong> - First
                    6 digits that identify the card issuer
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Account Number</strong> - Middle digits that
                    identify the cardholder's account
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Check Digit</strong> - Last digit used for
                    validation via the Luhn algorithm
                  </Typography>
                </li>
              </ul>
              <Typography variant="body2" sx={{ mt: 2 }}>
                Different card types have specific prefixes and lengths. For
                example, Visa cards start with 4 and have 16 digits, while
                American Express cards start with 34 or 37 and have 15 digits.
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FakeCreditCardGenerator;
