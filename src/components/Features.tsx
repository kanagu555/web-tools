import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Zap, Lock, Clock, Globe, Smartphone, Server } from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "./AdSense";

const features = [
  {
    icon: <Zap aria-hidden="true" />,
    title: "Lightning Fast Performance",
    description:
      "Process your files in seconds with our optimized tools and algorithms",
    benefits: ["Instant processing", "No waiting time", "Optimized algorithms"],
  },
  {
    icon: <Lock aria-hidden="true" />,
    title: "Secure & Private",
    description:
      "Your files never leave your device, ensuring complete privacy and security",
    benefits: ["Client-side processing", "No data storage", "GDPR compliant"],
  },
  {
    icon: <Clock aria-hidden="true" />,
    title: "Boost Productivity",
    description:
      "Automate repetitive tasks and improve your workflow efficiency",
    benefits: [
      "Batch processing",
      "One-click operations",
      "Workflow automation",
    ],
  },
  {
    icon: <Globe aria-hidden="true" />,
    title: "Works Everywhere",
    description:
      "Access our tools from any browser, no installation or downloads required",
    benefits: ["Cross-platform", "No installation", "Always updated"],
  },
  {
    icon: <Smartphone aria-hidden="true" />,
    title: "Mobile Responsive Design",
    description:
      "Fully responsive design works seamlessly on all devices and screen sizes",
    benefits: ["Mobile optimized", "Touch friendly", "Responsive layout"],
  },
  {
    icon: <Server aria-hidden="true" />,
    title: "Offline Capable",
    description:
      "Many tools work offline, no internet connection needed after initial load",
    benefits: ["Offline functionality", "PWA support", "Local processing"],
  },
];

const Features = () => {
  const theme = useTheme();
  const isProductionEnv = import.meta.env.PROD;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>KodeKit Features | Powerful Developer Tools & Benefits</title>
        <meta
          name="description"
          content="Discover KodeKit's powerful features: lightning-fast performance, security, productivity tools, cross-platform access, and offline capabilities for developers."
        />
        <meta
          name="keywords"
          content="KodeKit features, developer tools benefits, secure file processing, productivity tools, offline web tools, responsive design, lightning fast performance, privacy focused tools, cross-platform development"
        />
        <link rel="canonical" href="https://kodekit.in" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="KodeKit" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="KodeKit Features | Powerful Developer Tools & Benefits"
        />
        <meta
          property="og:description"
          content="Discover KodeKit's powerful features: lightning-fast performance, security, productivity tools, cross-platform access, and offline capabilities for developers."
        />
        <meta property="og:url" content="https://kodekit.in/features" />
        <meta
          property="og:image"
          content="https://kodekit.in/og-features.jpg"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="KodeKit Features | Powerful Developer Tools & Benefits"
        />
        <meta
          name="twitter:description"
          content="Discover KodeKit's powerful features: lightning-fast performance, security, productivity tools, cross-platform access, and offline capabilities for developers."
        />
        <meta
          name="twitter:image"
          content="https://kodekit.in/og-features.jpg"
        />
      </Helmet>

      <Box
        component="main"
        role="main"
        aria-labelledby="features-heading"
        sx={{
          py: 8,
          background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        }}
      >
        {/* Structured Data for Features */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "KodeKit Features",
              description:
                "Key features and benefits of KodeKit developer toolkit",
              itemListElement: features.map((feature, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: feature.title,
                description: feature.description,
                item: {
                  "@type": "WebApplication",
                  name: feature.title,
                  description: feature.description,
                  applicationCategory: "DeveloperApplication",
                  operatingSystem: "Any",
                  featureList: feature.benefits,
                },
              })),
            }),
          }}
        />

        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              id="features-heading"
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              Why Choose KodeKit for Your Development Needs
            </Typography>
            <Typography
              variant="h2"
              component="p"
              color="textSecondary"
              sx={{
                maxWidth: "700px",
                mx: "auto",
                fontSize: { xs: "1.125rem", md: "1.25rem" },
                fontWeight: 400,
              }}
            >
              Powerful tools designed with simplicity, security, and efficiency
              in mind. Perfect for developers, designers, and content creators
              worldwide.
            </Typography>
          </Box>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={0}
                      component="article"
                      aria-labelledby={`feature-${index}-title`}
                      sx={{
                        p: 3,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: 3,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
                          "& .feature-icon": {
                            color: theme.palette.primary.main,
                            backgroundColor: `${theme.palette.primary.main}15`,
                          },
                        },
                      }}
                    >
                      <Box
                        className="feature-icon"
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: theme.palette.background.default,
                          color: theme.palette.text.primary,
                          mb: 2,
                          transition: "all 0.3s ease",
                        }}
                        role="img"
                        aria-label={`${feature.title} icon`}
                      >
                        {feature.icon}
                      </Box>

                      <Typography
                        id={`feature-${index}-title`}
                        variant="h4"
                        component="h3"
                        gutterBottom
                        fontWeight={600}
                        sx={{ fontSize: "1.25rem" }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 2, flexGrow: 1 }}
                      >
                        {feature.description}
                      </Typography>

                      {/* SEO-friendly benefits list */}
                      <Box
                        component="ul"
                        role="list"
                        aria-label={`Benefits of ${feature.title}`}
                        sx={{
                          pl: 0,
                          m: 0,
                          listStyle: "none",
                          "& li": {
                            position: "relative",
                            pl: "1rem",
                            mb: "0.5rem",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              top: "0.5rem",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: theme.palette.primary.main,
                            },
                          },
                        }}
                      >
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <Box
                            component="li"
                            key={benefitIndex}
                            role="listitem"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "0.875rem",
                              color: theme.palette.text.secondary,
                            }}
                          >
                            {benefit}
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {isProductionEnv && (
            <Box
              component="aside"
              role="complementary"
              aria-label="Advertisement"
            >
              <AdSense adSlot="3487560078" aria-label="Advertisement" />
            </Box>
          )}

          {/* Additional SEO content */}
          <Box
            sx={{
              mt: 8,
              textAlign: "center",
              "& h3": {
                fontSize: { xs: "1.5rem", md: "1.75rem" },
                mb: 3,
              },
            }}
          >
            <Typography variant="h2" component="h2" gutterBottom>
              Trusted by Developers Worldwide
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: "600px",
                mx: "auto",
                mb: 4,
                fontSize: { xs: "1rem", md: "1.125rem" },
              }}
            >
              Join thousands of developers, designers, and content creators who
              rely on KodeKit for their daily workflow. Our tools are designed
              to save time, enhance productivity, and maintain the highest
              standards of security and privacy.
            </Typography>

            {/* Trust indicators for SEO */}
            <Box
              component="section"
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" },
                gap: 3,
                maxWidth: "800px",
                mx: "auto",
                "& > div": {
                  textAlign: "center",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                },
              }}
              role="region"
              aria-labelledby="stats-heading"
            >
              <Typography
                id="stats-heading"
                component="h3"
                sx={{ position: "absolute", left: "-10000px" }}
              >
                KodeKit Usage Statistics
              </Typography>
              <Box role="group" aria-labelledby="active-users-stat">
                <Typography
                  id="active-users-stat"
                  variant="h4"
                  color="primary"
                  fontWeight={700}
                  aria-label="50,000 plus active users"
                >
                  50K+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </Box>
              <Box role="group" aria-labelledby="files-processed-stat">
                <Typography
                  id="files-processed-stat"
                  variant="h4"
                  color="primary"
                  fontWeight={700}
                  aria-label="1 million plus files processed"
                >
                  1M+
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Files Processed
                </Typography>
              </Box>
              <Box role="group" aria-labelledby="uptime-stat">
                <Typography
                  id="uptime-stat"
                  variant="h4"
                  color="primary"
                  fontWeight={700}
                  aria-label="99.9 percent uptime"
                >
                  99.9%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uptime
                </Typography>
              </Box>
              <Box role="group" aria-labelledby="rating-stat">
                <Typography
                  id="rating-stat"
                  variant="h4"
                  color="primary"
                  fontWeight={700}
                  aria-label="4.8 star user rating"
                >
                  4.8★
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  User Rating
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Features;
