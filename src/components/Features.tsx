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
import AdSense from "./AdSense";

const features = [
  {
    icon: <Zap />,
    title: "Lightning Fast Performance",
    description:
      "Process your files in seconds with our optimized tools and algorithms",
    benefits: ["Instant processing", "No waiting time", "Optimized algorithms"],
  },
  {
    icon: <Lock />,
    title: "Secure & Private",
    description:
      "Your files never leave your device, ensuring complete privacy and security",
    benefits: ["Client-side processing", "No data storage", "GDPR compliant"],
  },
  {
    icon: <Clock />,
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
    icon: <Globe />,
    title: "Works Everywhere",
    description:
      "Access our tools from any browser, no installation or downloads required",
    benefits: ["Cross-platform", "No installation", "Always updated"],
  },
  {
    icon: <Smartphone />,
    title: "Mobile Responsive Design",
    description:
      "Fully responsive design works seamlessly on all devices and screen sizes",
    benefits: ["Mobile optimized", "Touch friendly", "Responsive layout"],
  },
  {
    icon: <Server />,
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
    <Box
      component="section"
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
            })),
          }),
        }}
      />

      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            id="features-heading"
            variant="h2"
            component="h2"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Why Choose KodeKit for Your Development Needs
          </Typography>
          <Typography
            variant="h3"
            component="p"
            color="textSecondary"
            sx={{
              maxWidth: "700px",
              mx: "auto",
              fontSize: { xs: "1.125rem", md: "1.25rem" },
              fontWeight: 400,
            }}
          >
            Powerful tools designed with simplicity, security, and efficiency in
            mind. Perfect for developers, designers, and content creators
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
                    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: "none" }}>
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <Box
                          component="li"
                          key={benefitIndex}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mb: 0.5,
                            fontSize: "0.875rem",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: "50%",
                              backgroundColor: theme.palette.primary.main,
                              mr: 1,
                              flexShrink: 0,
                            }}
                          />
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

        {isProductionEnv && <AdSense adSlot="3487560078" />}

        {/* Additional SEO content */}
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            sx={{ fontSize: "1.5rem" }}
          >
            Trusted by Developers Worldwide
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto" }}
          >
            Join thousands of developers, designers, and content creators who
            rely on KodeKit for their daily workflow. Our tools are designed to
            save time, enhance productivity, and maintain the highest standards
            of security and privacy.
          </Typography>

          {/* Trust indicators for SEO */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight={700}>
                50K+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Users
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight={700}>
                1M+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Files Processed
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight={700}>
                99.9%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Uptime
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h4" color="primary" fontWeight={700}>
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
  );
};

export default Features;
