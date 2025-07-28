import React from "react";
import { Box, Container, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import SEOHelmet from "./SEOHelmet";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <SEOHelmet
        title="Page Not Found - KodeKit"
        description="The page you're looking for doesn't exist. Explore KodeKit's developer tools and utilities."
        noindex={true}
      />

      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            py: 8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              backgroundColor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            {/* 404 Number */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "4rem", md: "6rem" },
                fontWeight: 700,
                background: "linear-gradient(90deg, #3f51b5, #9c27b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
              }}
            >
              404
            </Typography>

            {/* Main Message */}
            <Typography
              variant="h2"
              component="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "2rem" },
                fontWeight: 600,
                mb: 2,
                color: "text.primary",
              }}
            >
              Page Not Found
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 4,
                fontSize: "1.1rem",
                lineHeight: 1.6,
              }}
            >
              The page you're looking for doesn't exist or has been moved. Let's
              get you back to exploring our developer tools.
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<Home size={20} />}
                onClick={handleGoHome}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Go to Homepage
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<ArrowLeft size={20} />}
                onClick={handleGoBack}
                sx={{
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Go Back
              </Button>
            </Box>

            {/* Popular Tools */}
            <Box
              sx={{
                mt: 4,
                pt: 4,
                borderTop: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h3"
                component="h3"
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  mb: 2,
                  color: "text.primary",
                }}
              >
                Popular Tools
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1,
                  justifyContent: "center",
                }}
              >
                {[
                  { name: "JSON Formatter", href: "/tools/json-formatter" },
                  { name: "Image Resizer", href: "/tools/image-resizer" },
                  { name: "Text Formatter", href: "/tools/text-formatter" },
                  { name: "Color Picker", href: "/tools/color-picker" },
                ].map((tool) => (
                  <Button
                    key={tool.name}
                    variant="text"
                    size="small"
                    onClick={() => navigate(tool.href)}
                    sx={{
                      textTransform: "none",
                      fontSize: "0.875rem",
                      color: "primary.main",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                      },
                    }}
                  >
                    {tool.name}
                  </Button>
                ))}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  );
};

export default NotFound;
