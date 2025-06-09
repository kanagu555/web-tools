import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { Search, Code, Settings, Download, Upload, Share } from "lucide-react";
import AdSense from "../components/AdSense";

const HowItWorks = () => {
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      icon: <Search size={40} />,
      title: "Find Your Tool",
      description:
        "Browse our categories or use the search bar to find the tool you need.",
    },
    {
      icon: <Upload size={40} />,
      title: "Upload or Input",
      description:
        "Upload your files or input your data directly in the browser.",
    },
    {
      icon: <Settings size={40} />,
      title: "Configure Options",
      description:
        "Adjust the settings to customize the output according to your needs.",
    },
    {
      icon: <Code size={40} />,
      title: "Process Instantly",
      description:
        "Your data is processed instantly in your browser - no server uploads required.",
    },
    {
      icon: <Download size={40} />,
      title: "Download Results",
      description:
        "Download your processed files or copy the results to your clipboard.",
    },
    {
      icon: <Share size={40} />,
      title: "Share & Reuse",
      description: "Share your results or bookmark the tool for future use.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              component="h1"
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              How KodeKit Works
            </Typography>
            <Divider
              sx={{ width: "60px", mx: "auto", mb: 3, borderWidth: 2 }}
            />
            <Typography variant="subtitle1" color="text.secondary">
              Simple, secure, and efficient tools for developers and creators
            </Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Our Approach
            </Typography>
            <Typography variant="body1" paragraph>
              KodeKit is designed with simplicity and efficiency in mind. All
              our tools run directly in your browser, which means your data
              never leaves your device. This approach ensures maximum privacy
              and security while providing instant results without waiting for
              server processing.
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you're a developer, designer, or content creator, our
              toolkit streamlines your workflow with specialized tools for
              various tasks - from PDF manipulation to code formatting, text
              processing, and more.
            </Typography>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 600, mb: 4 }}
            >
              How to Use Our Tools
            </Typography>

            <Grid container spacing={3}>
              {steps.map((step, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 2,
                      boxShadow: `0 6px 12px ${
                        theme.palette.mode === "dark"
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(0,0,0,0.1)"
                      }`,
                      "&:hover": {
                        transform: "translateY(-5px)",
                        transition: "transform 0.3s ease-in-out",
                        boxShadow: `0 12px 20px ${
                          theme.palette.mode === "dark"
                            ? "rgba(0,0,0,0.3)"
                            : "rgba(0,0,0,0.15)"
                        }`,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                      <Box
                        sx={{
                          mb: 2,
                          color: theme.palette.primary.main,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {step.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Privacy & Security
            </Typography>
            <Typography variant="body1" paragraph>
              We take your privacy seriously. Since all processing happens
              locally in your browser:
            </Typography>
            <ul>
              <Typography component="li" variant="body1" paragraph>
                Your files and data never leave your device
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                No server uploads or storage of your information
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                No account creation or login required
              </Typography>
              <Typography component="li" variant="body1" paragraph>
                Use our tools as much as you want, with no usage limits
              </Typography>
            </ul>
          </Box>

          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Get Started
            </Typography>
            <Typography variant="body1">
              Ready to boost your productivity? Browse our collection of tools
              and start using them right away - no installation, registration,
              or payment required.
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      <Box sx={{ mt: 4 }}>
        <AdSense adSlot="6613251015" />
      </Box>
    </Container>
  );
};

export default HowItWorks;
