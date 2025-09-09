"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import {
  People as PeopleIcon,
  Description as FilesIcon,
  TrendingUp as UptimeIcon,
  Star as RatingIcon,
} from "@mui/icons-material";
import AdSense from "@/components/AdSense";

const statistics = [
  {
    icon: <PeopleIcon sx={{ fontSize: 32, color: "#6366f1" }} />,
    value: "50K+",
    label: "Active Users",
    description: "Developers trust our tools daily",
    color: "#6366f1",
  },
  {
    icon: <FilesIcon sx={{ fontSize: 32, color: "#06b6d4" }} />,
    value: "1M+",
    label: "Files Processed",
    description: "Documents handled securely",
    color: "#06b6d4",
  },
  {
    icon: <UptimeIcon sx={{ fontSize: 32, color: "#10b981" }} />,
    value: "99.9%",
    label: "Uptime",
    description: "Reliable service availability",
    color: "#10b981",
  },
  {
    icon: <RatingIcon sx={{ fontSize: 32, color: "#f59e0b" }} />,
    value: "4.8★",
    label: "User Rating",
    description: "Highly rated by our community",
    color: "#f59e0b",
  },
];

const TrustedByDevelopers: React.FC = () => {
  // const theme = useTheme(); // Unused for now

  return (
    <Box
      sx={{
        py: 8,
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.02"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.5,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 700,
              mb: 2,
              color: "white",
            }}
          >
            Trusted by Developers Worldwide
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 700,
              mx: "auto",
              color: "rgba(255, 255, 255, 0.8)",
              lineHeight: 1.6,
            }}
          >
            Join thousands of developers, designers, and content creators who
            rely on KodeKit for their daily workflow. Our tools are designed to
            save time, enhance productivity, and maintain the highest standards
            of security and privacy.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {statistics.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    background: "rgba(255, 255, 255, 0.08)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    p: 4,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: 64,
                      height: 64,
                      mx: "auto",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                      border: `1px solid ${stat.color}30`,
                    }}
                  >
                    {stat.icon}
                  </Box>

                  {/* Value */}
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: 800,
                      mb: 1,
                      background: `linear-gradient(135deg, ${stat.color}, ${stat.color}CC)`,
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: { xs: "2rem", md: "2.5rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>

                  {/* Label */}
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: "white",
                    }}
                  >
                    {stat.label}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      lineHeight: 1.4,
                    }}
                  >
                    {stat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* AdSense Ad */}
        <AdSense adSlot="7096815138" />
      </Container>
    </Box>
  );
};

export default TrustedByDevelopers;
