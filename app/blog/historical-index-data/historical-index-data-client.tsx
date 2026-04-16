"use client";

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  useTheme,
  Chip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import StructuredData from "@/components/StructuredData";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";
import SocialShare from "@/components/SocialShare";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Download,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  BarChart,
} from "lucide-react";

export default function HistoricalIndexDataBlogClient() {
  const theme = useTheme();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Generate structured data for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Historical Index Data - View & Download Global Stock Indices",
    description:
      "Learn how to fetch, view, and download historical OHLCV data for major global stock indices like NIFTY 50, SENSEX, S&P 500, and NASDAQ for free.",
    image: "https://www.kodekit.in/social/historical-index-data.png",
    author: {
      "@type": "Organization",
      name: "KodeKit",
    },
    publisher: {
      "@type": "Organization",
      name: "KodeKit",
      logo: {
        "@type": "ImageObject",
        url: "https://www.kodekit.in/logo.png",
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://www.kodekit.in/blog/historical-index-data",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Historical Index Data Guide",
        item: `${baseUrl}/blog/historical-index-data`,
      },
    ],
  };

  return (
    <>
      <StructuredData data={[articleSchema, breadcrumbSchema]} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Navigation />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box component="header" sx={{ mb: 6, textAlign: "center" }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              fontWeight={700}
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              Analyze Historical Index Data for Free
            </Typography>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
                maxWidth: "800px",
                mx: "auto",
                mb: 4,
              }}
            >
              Learn how to fetch, view, and download historical OHLCV data for major global stock indices like NIFTY 50, SENSEX, S&P 500, and NASDAQ for free.
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
                mb: 4,
              }}
            >
              <Chip
                icon={<Shield size={16} />}
                label="100% Reliable"
                color="success"
              />
              <Chip
                icon={<Clock size={16} />}
                label="Real-time Fetching"
                color="primary"
              />
              <Chip
                icon={<Download size={16} />}
                label="CSV Export"
                color="secondary"
              />
              <Chip
                icon={<Star size={16} />}
                label="Worldwide Indices"
                color="warning"
              />
            </Box>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Paper
                onClick={() => router.push("/tools/historical-index-data")}
                sx={{
                  p: 3,
                  cursor: "pointer",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                  border: `2px solid ${theme.palette.primary.main}30`,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <LineChart size={24} />
                  <Typography variant="h6" fontWeight={600}>
                    Explore Historical Data Now
                  </Typography>
                  <ArrowRight size={24} />
                </Box>
              </Paper>
            </motion.div>
          </Box>

          {/* Main Content */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                {/* Introduction */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Why Track Historical Index Data?
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Analyzing the historical performance of stock market indices like the NIFTY 50, SENSEX, or S&P 500 provides crucial insights into broader market trends. Whether you are an algorithmic trader backtesting strategies, a financial analyst studying market cycles, or simply a student of finance, having access to reliable and structured data is essential.
                </Typography>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our tool simplifies the process. It eliminates the need for expensive software or complicated API subscriptions by offering an intuitive interface to instantly pull, visualize, and extract OHLCV (Open, High, Low, Close, Volume) data for any custom timeframe.
                </Typography>

                <Divider sx={{ my: 4 }} />

                {/* How It Works */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  How to Access the Data
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      step: 1,
                      title: "Select an Index",
                      description:
                        "Use the dropdown to choose from a list of major global indices. We support US, European, and Asian markets, including top Indian indices.",
                      icon: <LineChart size={24} />,
                    },
                    {
                      step: 2,
                      title: "Specify the Time Range",
                      description:
                        "Choose a pre-defined time filter such as 1W, 1M, or 1Y, or use the 'Custom' option to define your exact starting and ending dates.",
                      icon: <Clock size={24} />,
                    },
                    {
                      step: 3,
                      title: "View or Download",
                      description:
                        "Review the cleanly formatted OHLCV tabular data directly on the page, or hit 'Download (.csv)' to export it for advanced spreadsheet analysis.",
                      icon: <Download size={24} />,
                    },
                  ].map((item) => (
                    <Grid item xs={12} key={item.step}>
                      <Paper
                        sx={{
                          p: 3,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          border: `1px solid ${theme.palette.divider}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              backgroundColor: theme.palette.primary.main,
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: "1.25rem",
                              flexShrink: 0,
                            }}
                          >
                            {item.step}
                          </Box>
                          <Box>
                            <Typography
                              variant="h6"
                              gutterBottom
                              fontWeight={600}
                            >
                              {item.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Features */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Key Tool Capabilities
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    {
                      title: "Comprehensive OHLCV Data",
                      description:
                        "Every record includes Open, High, Low, Close, and Volume indicators ensuring you miss no critical data points.",
                      icon: <BarChart size={24} />,
                    },
                    {
                      title: "Global Indices List",
                      description:
                        "Ready access to data files of NIFTY 50, SENSEX, NIFTY BANK, DOW JONES, S&P 500, NASDAQ, FTSE 100, and NIKKEI 225.",
                      icon: <TrendingUp size={24} />,
                    },
                    {
                      title: "Instant CSV Export",
                      description:
                        "Download queried datasets effortlessly with proper column headers to import it natively into Excel or Python pandas.",
                      icon: <Download size={24} />,
                    },
                    {
                      title: "Visual Table Indicators",
                      description:
                        "Quickly spot bullish and bearish daily movements with intuitive green and red color-coding in the generated table.",
                      icon: <LineChart size={24} />,
                    },
                  ].map((feature, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            color: theme.palette.primary.main,
                            flexShrink: 0,
                            mt: 0.5,
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            gutterBottom
                            fontWeight={600}
                          >
                            {feature.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                {/* Tips */}
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  fontWeight={600}
                >
                  Tips for Market Data Analysis
                </Typography>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                  {[
                    "Export historical data as CSV to generate advanced moving averages or Bollinger bands in Excel.",
                    "Use long-term 1Y or 5Y queries to capture secular market trends without getting shaken out by short-term volatility.",
                    "Always cross-reference index performance against sector indices (e.g., NIFTY IT, NIFTY BANK).",
                    "Keep track of traded volume variations to confirm a trend's strength—low volume pullbacks often indicate buying opportunities.",
                  ].map((tip, index) => (
                    <Grid item xs={12} key={index}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CheckCircle
                          size={20}
                          color={theme.palette.success.main}
                        />
                        <Typography variant="body1">{tip}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: "sticky", top: 20 }}>
                {/* Quick Access */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Quick Access
                  </Typography>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Paper
                      onClick={() => router.push("/tools/historical-index-data")}
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        backgroundColor: theme.palette.primary.main,
                        color: "white",
                        textAlign: "center",
                        "&:hover": {
                          backgroundColor: theme.palette.primary.dark,
                        },
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        Fetch Index Data Now
                      </Typography>
                    </Paper>
                  </motion.div>
                </Paper>

                {/* FAQ */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Frequently Asked Questions
                  </Typography>

                  {[
                    {
                      q: "Is the historical data free to download?",
                      a: "Yes! There are no limits or registration required to download the datasets.",
                    },
                    {
                      q: "What format is the downloaded file?",
                      a: "The data will be exported as a standard CSV file format commonly used for spreadsheets.",
                    },
                    {
                      q: "How old of data can I query?",
                      a: "Depending on the index, you can query years of historical trading data accurately.",
                    },
                    {
                      q: "Can I query individual stocks?",
                      a: "This specific tool focuses extensively on major global and regional market indices only.",
                    },
                  ].map((faq, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        gutterBottom
                      >
                        {faq.q}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {faq.a}
                      </Typography>
                    </Box>
                  ))}
                </Paper>

                {/* Related Tools */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Related Financial Tools
                  </Typography>

                  {[
                    {
                      name: "SIP Calculator",
                      path: "/tools/sip-calculator",
                    },
                    {
                      name: "Lumpsum Calculator",
                      path: "/tools/lumpsum-calculator",
                    },
                    { name: "FD Calculator", path: "/tools/fd-calculator" },
                    {
                      name: "Mutual Fund Details",
                      path: "/tools/mutual-fund-details",
                    },
                  ].map((tool, index) => (
                    <Box
                      key={index}
                      onClick={() => router.push(tool.path)}
                      sx={{
                        p: 1.5,
                        mb: 1,
                        borderRadius: 2,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <Typography variant="body2" color="primary">
                        {tool.name}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Box>
            </Grid>
          </Grid>

          {/* AdSense Ad */}
          <AdSense adSlot="6862405013" />

          {/* Social Share */}
          <Box sx={{ mt: 4 }}>
            <SocialShare
              title="Historical Index Data - View & Download Global Stock Indices | KodeKit"
              url={`${baseUrl}/blog/historical-index-data`}
              description="Learn how to fetch, view, and download historical OHLCV data for major global stock indices like NIFTY 50, SENSEX, S&P 500, and NASDAQ for free."
              hashtags={[
                "HistoricalData",
                "StockMarket",
                "FinanceTools",
                "DataAnalysis",
                "Trading",
              ]}
            />
          </Box>
        </motion.div>
      </Container>
    </>
  );
}
