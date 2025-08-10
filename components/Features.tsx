"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Devices as DevicesIcon,
  CloudOff as CloudOffIcon,
  Update as UpdateIcon,
  Public as PublicIcon,
} from "@mui/icons-material";

const features = [
  {
    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    title: "Lightning Fast Performance",
    description:
      "Process your files in seconds with our optimized tools and algorithms",
    benefits: ["Instant processing", "No waiting time", "Optimized algorithms"],
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    title: "Secure & Private",
    description:
      "Your files never leave your device, ensuring complete privacy and security",
    benefits: ["Client-side processing", "No data storage", "GDPR compliant"],
  },
  {
    icon: <UpdateIcon sx={{ fontSize: 40 }} />,
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
    icon: <PublicIcon sx={{ fontSize: 40 }} />,
    title: "Works Everywhere",
    description:
      "Access our tools from any browser, no installation or downloads required",
    benefits: ["Cross-platform", "No installation", "Always updated"],
  },
  {
    icon: <DevicesIcon sx={{ fontSize: 40 }} />,
    title: "Mobile Responsive Design",
    description:
      "Use our tools seamlessly on desktop, tablet, and mobile devices",
    benefits: ["Responsive design", "Touch-friendly", "Mobile optimized"],
  },
  {
    icon: <CloudOffIcon sx={{ fontSize: 40 }} />,
    title: "Offline Capable",
    description:
      "Many tools work offline, ensuring you can be productive anywhere",
    benefits: [
      "Offline functionality",
      "No internet required",
      "Always available",
    ],
  },
];

const Features: React.FC = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: "background.default" }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              mb: 2,
            }}
          >
            Why Choose KodeKit?
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Built with developers in mind, our tools prioritize speed, security,
            and ease of use
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  p: 3,
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      color: "primary.main",
                    }}
                  >
                    {feature.icon}
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{ ml: 2, fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>

                  <Stack spacing={1}>
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <Box
                        key={benefitIndex}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "secondary.main",
                            mr: 2,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;
