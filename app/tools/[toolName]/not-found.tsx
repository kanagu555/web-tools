import React from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
} from "@mui/material";
import {
  Build as BuildIcon,
  Category as CategoryIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { toolsData } from "@/lib/data/toolsData";
import { getToolIcon } from "@/lib/utils/toolIcons";

export default function ToolNotFound() {
  // Get some popular tools to suggest
  const popularTools = toolsData.filter((tool) => tool.popular).slice(0, 6);

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={6}>
        <BuildIcon color="primary" sx={{ fontSize: 80, mb: 3, opacity: 0.7 }} />

        <Typography variant="h3" component="h1" gutterBottom>
          Tool Not Found
        </Typography>

        <Typography variant="h6" color="text.secondary" paragraph>
          The tool you're looking for doesn't exist or may have been moved.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4, mb: 6 }}
        >
          <Button
            variant="contained"
            startIcon={<BuildIcon />}
            component={Link}
            href="/"
            size="large"
          >
            Browse All Tools
          </Button>

          <Button
            variant="outlined"
            startIcon={<CategoryIcon />}
            component={Link}
            href="/categories"
            size="large"
          >
            View Categories
          </Button>

          <Button
            variant="outlined"
            startIcon={<HomeIcon />}
            component={Link}
            href="/"
            size="large"
          >
            Go Home
          </Button>
        </Stack>
      </Box>

      {/* Popular Tools */}
      {popularTools.length > 0 && (
        <Box mb={6}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Popular Tools
          </Typography>

          <Grid container spacing={3}>
            {popularTools
              .filter((tool) => tool.route)
              .map((tool) => (
                <Grid item xs={12} sm={6} md={4} key={tool.id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardContent
                      component={Link}
                      href={tool.route!}
                      sx={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "block",
                        height: "100%",
                        p: 3,
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        mb={2}
                      >
                        {getToolIcon(tool.icon)}
                        <Typography variant="h6" component="h3">
                          {tool.title}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {tool.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}
