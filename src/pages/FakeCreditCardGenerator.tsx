/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from "react";
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

interface CreditCardData {
  type: string;
  number: string;
  expiration: string;
  owner: string;
  cvv?: string;
}

interface ApiResponse {
  status: string;
  code: number;
  locale: string;
  seed: null;
  total: number;
  data: CreditCardData[];
}

const FakeCreditCardGenerator = () => {
  const theme = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [creditCards, setCreditCards] = useState<CreditCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const isProductionEnv = import.meta.env.PROD;

  const cardsWithCVV = useMemo(() => {
    return creditCards.map((card) => ({
      ...card,
      cvv: card.cvv || (Math.floor(Math.random() * 900) + 100).toString(),
    }));
  }, [creditCards]);

  const generateCards = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://fakerapi.it/api/v2/creditCards?_quantity=${quantity}`
      );
      const data: ApiResponse = await response.json();

      if (data.status === "OK") {
        const cardsWithCVV = data.data.map((card) => ({
          ...card,
          cvv: (Math.floor(Math.random() * 900) + 100).toString(),
        }));
        setCreditCards(cardsWithCVV);
      } else {
        setError("Failed to generate credit cards");
      }
    } catch (err) {
      setError("Error connecting to the API. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      case "unionpay":
        return "#e21836";
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
      case "amex":
        return <Box sx={iconStyle}>AMEX</Box>;
      case "discover":
        return <Box sx={iconStyle}>DISC</Box>;
      case "jcb":
        return <Box sx={iconStyle}>JCB</Box>;
      case "diners club":
        return <Box sx={iconStyle}>DC</Box>;
      case "unionpay":
        return <Box sx={iconStyle}>UP</Box>;
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
          role="region"
          aria-label="Credit card generator controls"
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                  )
                }
                inputProps={{
                  min: 1,
                  max: 10,
                  "aria-label": "Number of credit cards to generate",
                }}
                helperText="Maximum 10 cards"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                fullWidth
                onClick={generateCards}
                disabled={loading}
                startIcon={
                  loading ? (
                    <RefreshCw className="animate-spin" />
                  ) : (
                    <CreditCard />
                  )
                }
                size="large"
                aria-label={
                  loading ? "Generating credit cards" : "Generate credit cards"
                }
              >
                {loading ? "Generating..." : "Generate Cards"}
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Shield size={20} color={theme.palette.success.main} />
                <Typography variant="body2" color="text.secondary">
                  Safe for testing & development
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }} role="alert">
              {error}
            </Alert>
          )}
        </Paper>

        {cardsWithCVV.length > 0 && (
          <Grid
            container
            spacing={3}
            role="list"
            aria-label="Generated credit cards"
          >
            {cardsWithCVV.map((card, index) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={`${card.number}-${index}`}
                role="listitem"
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
                          aria-label="Test card indicator"
                        />
                      </Box>
                    </Box>

                    <Box sx={{ p: 3 }}>
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
                              onClick={() =>
                                handleCopy(card.cvv!, "cvv", index)
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

        {cardsWithCVV.length === 0 && !loading && (
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
            Supported Card Types
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              "Visa",
              "Mastercard",
              "American Express",
              "Discover",
              "JCB",
              "Diners Club",
              "UnionPay",
            ].map((cardType) => (
              <Grid item key={cardType}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  {getCardIcon(cardType)}
                  <Typography variant="body2">{cardType}</Typography>
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
