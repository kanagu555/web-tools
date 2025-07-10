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

interface CreditCardData {
  type: string;
  number: string;
  expiration: string;
  owner: string;
  cvv?: string; // Add CVV to the interface
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

  // Generate stable CVV for each card using useMemo
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
        // Generate CVV for each card immediately
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Fake Credit Card Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
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
                inputProps={{ min: 1, max: 10 }}
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
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>

        {cardsWithCVV.length > 0 && (
          <Grid container spacing={3}>
            {cardsWithCVV.map((card, index) => (
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

        {/* Supported Card Types */}
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
        >
          <Typography variant="h6" gutterBottom>
            Usage Guidelines
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                ✅ Appropriate Uses:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li>
                  <Typography variant="body2">Testing payment forms</Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Development environments
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">UI/UX design mockups</Typography>
                </li>
                <li>
                  <Typography variant="body2">Educational purposes</Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    API testing and validation
                  </Typography>
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                ❌ Inappropriate Uses:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                <li>
                  <Typography variant="body2">Real transactions</Typography>
                </li>
                <li>
                  <Typography variant="body2">Fraudulent activities</Typography>
                </li>
                <li>
                  <Typography variant="body2">Identity theft</Typography>
                </li>
                <li>
                  <Typography variant="body2">Illegal purposes</Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Production environments
                  </Typography>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default FakeCreditCardGenerator;
