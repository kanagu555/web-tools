import React from "react";
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

const features = [
  {
    icon: <Zap />,
    title: "Lightning Fast",
    description: "Process your files in seconds with our optimized tools",
  },
  {
    icon: <Lock />,
    title: "Secure & Private",
    description:
      "Your files never leave your device, ensuring complete privacy",
  },
  {
    icon: <Clock />,
    title: "Save Time",
    description:
      "Automate repetitive tasks and improve your workflow efficiency",
  },
  {
    icon: <Globe />,
    title: "Works Everywhere",
    description: "Access our tools from any browser, no installation required",
  },
  {
    icon: <Smartphone />,
    title: "Mobile Friendly",
    description: "Fully responsive design works seamlessly on all devices",
  },
  {
    icon: <Server />,
    title: "Offline Capable",
    description: "Many tools work offline, no internet connection needed",
  },
];

const Features = () => {
  const theme = useTheme();

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
      sx={{
        py: 8,
        background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Why Choose KodeKit
          </Typography>
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            Powerful tools designed with simplicity and efficiency in mind
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
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      fontWeight={600}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Features;
