import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  CreditCard,
  Copy,
  Check,
  RefreshCw,
  Shield,
  AlertTriangle,
  User,
  Calendar,
  Lock,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

interface TestCreditCard {
  type: string;
  numbers: string[];
  cvvLength: number;
}

interface GeneratedCard {
  type: string;
  number: string;
  expiration: string;
  owner: string;
  cvv: string;
}

const FakeCreditCardGenerator = () => {
  const theme = useTheme();
  const [selectedCardType, setSelectedCardType] = useState("");
  const [generatedCards, setGeneratedCards] = useState<GeneratedCard[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const isProductionEnv = import.meta.env.PROD;

  // Test credit card data
  const testCards: TestCreditCard[] = [
    {
      type: "Visa",
      numbers: ["4003830171874018", "4111111111111111"],
      cvvLength: 3,
    },
    {
      type: "Mastercard",
      numbers: ["5496198584584769", "2223000048400011", "2223520043560014"],
      cvvLength: 3,
    },
    {
      type: "American Express",
      numbers: ["378282246310005", "371449635398431"],
      cvvLength: 4,
    },
    {
      type: "Discover",
      numbers: ["6011111111111117", "6011000990139424"],
      cvvLength: 3,
    },
    {
      type: "JCB",
      numbers: ["3530111333300000", "3566002020360505"],
      cvvLength: 3,
    },
    {
      type: "Diners Club",
      numbers: ["30569309025904", "38520000023237"],
      cvvLength: 3,
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
  ];

  const generateCards = () => {
    if (!selectedCardType) return;

    const selectedCard = testCards.find(
      (card) => card.type === selectedCardType
    );
    if (!selectedCard) return;

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
      const owner = sampleNames[Math.floor(Math.random() * sampleNames.length)];

      cards.push({
        type: selectedCard.type,
        number: cardNumber,
        expiration,
        owner,
        cvv,
      });
    });

    setGeneratedCards(cards);
  };

  // Auto-generate cards when card type is selected
  useEffect(() => {
    if (selectedCardType) {
      generateCards();
    } else {
      setGeneratedCards([]);
    }
  }, [selectedCardType]);

  const handleCopy = async (text: string, type: string, cardIndex: number) => {
    await navigator.clipboard.writeText(text);
    setCopied(`${type}-${cardIndex}-${text}`);
    setTimeout(() => setCopied(null), 2000);
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
              name: "Your Website Name",
            },
          })}
        </script>
      </Helmet>

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
            <Grid item xs={12} md={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Shield size={20} color={theme.palette.success.main} />
                <Typography variant="body2" color="text.secondary">
                  Test Cards
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {generatedCards.length > 0 && (
          <Grid container spacing={3}>
            {generatedCards.map((card, index) => (
              <Grid item xs={12} md={6} lg={4} key={`${card.number}-${index}`}>
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
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          {getCardIcon(card.type)}
                          <Typography variant="h6" fontWeight={600}>
                            {card.type}
                          </Typography>
                        </Box>
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
                              backgroundColor: theme.palette.background.default,
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
                                handleCopy(card.expiration, "expiration", index)
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
                              backgroundColor: theme.palette.background.default,
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
                              onClick={() => handleCopy(card.cvv, "cvv", index)}
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
                          ? "All Data Copied!"
                          : "Copy All Details"}
                      </Button>
                    </Box>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {generatedCards.length === 0 && (
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
              Click the generate button to create fake credit card numbers for
              testing
            </Typography>
          </Paper>
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
      </motion.div>
    </Container>
  );
};

export default FakeCreditCardGenerator;
