"use client";

import { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Link,
} from "@mui/material";
import {
  Security,
  Shield,
  Lock,
  Visibility,
  VerifiedUser,
  Code,
  CloudOff,
  CheckCircle,
  Email,
  Language,
  Update,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";

export default function PrivacyPolicy() {
  const theme = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Key privacy principles
  const privacyPrinciples = [
    {
      title: "Zero Data Collection",
      description: "All processing happens locally in your browser",
      icon: <CloudOff />,
      color: "primary",
    },
    {
      title: "No Personal Information",
      description: "We don't collect or store any personal data",
      icon: <Shield />,
      color: "success",
    },
    {
      title: "No Tracking",
      description: "We don't use cookies or tracking technologies",
      icon: <Visibility />,
      color: "info",
    },
    {
      title: "Client-Side Processing",
      description: "Your files never leave your device",
      icon: <Lock />,
      color: "warning",
    },
    {
      title: "Open Source",
      description: "Our code is transparent and available for review",
      icon: <Code />,
      color: "secondary",
    },
  ];

  // Third-party services data
  const thirdPartyServices = [
    {
      service: "Vercel",
      purpose: "Website hosting",
      dataCollected: "IP address, browser info",
      privacyPolicy: "https://vercel.com/legal/privacy-policy",
    },
    {
      service: "Google Fonts",
      purpose: "Typography",
      dataCollected: "IP address",
      privacyPolicy: "https://policies.google.com/privacy",
    },
    {
      service: "Cloudflare",
      purpose: "CDN",
      dataCollected: "IP address, browser info",
      privacyPolicy: "https://www.cloudflare.com/privacypolicy/",
    },
  ];

  // User rights under privacy regulations
  const userRights = [
    { right: "Access", description: "Request copies of your personal data" },
    {
      right: "Rectification",
      description: "Request correction of inaccurate data",
    },
    { right: "Erasure", description: "Request deletion of your data" },
    { right: "Restriction", description: "Request limitation of processing" },
    { right: "Objection", description: "Object to processing of your data" },
    { right: "Portability", description: "Request transfer of your data" },
    {
      right: "Withdraw Consent",
      description: "Revoke previously given consent",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      aria-label="KodeKit Privacy Policy"
    >
      <Navigation />

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
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                component="h1"
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Privacy Policy
              </Typography>
            </motion.div>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 2, fontWeight: 400 }}
            >
              Your privacy is our priority
            </Typography>

            <Chip
              icon={<Update />}
              label="Last updated: January 20, 2025"
              variant="outlined"
              color="primary"
            />
          </Box>

          {/* Privacy Alert */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Alert
              severity="success"
              icon={<Security />}
              sx={{ mb: 6, fontSize: "1.1rem" }}
            >
              <Typography variant="h6" gutterBottom>
                Privacy-First Design
              </Typography>
              All file processing happens directly in your browser. Your data
              never leaves your device, ensuring complete privacy and security
              for all your documents and information.
            </Alert>
          </motion.div>

          <AdSense adSlot="6613251015" />

          {/* Key Privacy Principles */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
              >
                Our Privacy Principles
              </Typography>

              <Grid container spacing={3}>
                {privacyPrinciples.map((principle, index) => (
                  <Grid item xs={12} md={6} lg={4} key={principle.title}>
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                    >
                      <Card
                        elevation={3}
                        sx={{
                          height: "100%",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: theme.shadows[8],
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, textAlign: "center" }}>
                          <Box
                            sx={{
                              mb: 2,
                              color: (theme.palette as any)[principle.color]
                                .main,
                            }}
                          >
                            {principle.icon}
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                          >
                            {principle.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {principle.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          <Divider sx={{ my: 6 }} />

          {/* What We Don't Collect */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4 }}
              >
                Information We Don't Collect
              </Typography>

              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem", mb: 4 }}
              >
                KodeKit is designed with privacy as a core principle. We
                specifically do not:
              </Typography>

              <Grid container spacing={2}>
                {[
                  "Collect or store any personal information",
                  "Track your usage or behavior",
                  "Use cookies for tracking purposes",
                  "Store any files you process using our tools",
                  "Maintain user accounts or profiles",
                  "Process payment information",
                  "Share data with third parties for marketing purposes",
                  "Collect analytics beyond anonymous usage statistics",
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CheckCircle
                        color="success"
                        sx={{ mr: 2, fontSize: 20 }}
                      />
                      <Typography variant="body1">{item}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* How Our Tools Work */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4 }}
              >
                How Our Tools Work
              </Typography>

              <Card
                elevation={2}
                sx={{
                  p: 4,
                  mb: 4,
                  background: `linear-gradient(135deg, ${theme.palette.info.main}08, ${theme.palette.info.main}03)`,
                }}
              >
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", mb: 3 }}
                >
                  All file processing and conversions happen directly in your
                  browser:
                </Typography>

                <List>
                  {[
                    "Files are processed locally using browser-based technologies (JavaScript)",
                    "No data is transmitted to our servers",
                    "Your files never leave your device",
                    "All operations are performed client-side",
                    "No data persistence between sessions",
                  ].map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <VerifiedUser color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={item} />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Box>
          </motion.div>

          {/* Third-Party Services */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4 }}
              >
                Third-Party Services
              </Typography>

              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem", mb: 4 }}
              >
                Our website may use certain third-party services for enhanced
                functionality:
              </Typography>

              <TableContainer component={Paper} elevation={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Service</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Purpose</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Data Collected</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Privacy Policy</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {thirdPartyServices.map((service) => (
                      <TableRow key={service.service}>
                        <TableCell>{service.service}</TableCell>
                        <TableCell>{service.purpose}</TableCell>
                        <TableCell>{service.dataCollected}</TableCell>
                        <TableCell>
                          <Link
                            href={service.privacyPolicy}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="primary"
                          >
                            View Policy
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </motion.div>

          {/* User Rights */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h3"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4 }}
              >
                Your Rights
              </Typography>

              <Typography
                variant="body1"
                paragraph
                sx={{ fontSize: "1.1rem", mb: 4 }}
              >
                Under various privacy regulations (GDPR, CCPA, etc.), you have
                the right to:
              </Typography>

              <Grid container spacing={3}>
                {userRights.map((right) => (
                  <Grid item xs={12} sm={6} md={4} key={right.right}>
                    <Card elevation={2} sx={{ height: "100%" }}>
                      <CardContent>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          gutterBottom
                          color="primary"
                        >
                          {right.right}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {right.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Alert severity="info" sx={{ mt: 4 }}>
                <Typography variant="body2">
                  Since we don't collect personal data, these rights primarily
                  apply to information that might be collected by third-party
                  services. To exercise these rights regarding third-party
                  services, please contact them directly.
                </Typography>
              </Alert>
            </Box>
          </motion.div>

          {/* Additional Sections */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {/* Children's Privacy */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: "100%", p: 3 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Children's Privacy
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Our service is not intended for use by children under 13. We
                    do not knowingly collect information from children under 13.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    If you are a parent or guardian and believe your child has
                    provided us with personal information, please contact us
                    immediately.
                  </Typography>
                </Card>
              </Grid>

              {/* Data Security */}
              <Grid item xs={12} md={6}>
                <Card elevation={2} sx={{ height: "100%", p: 3 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Data Security
                  </Typography>
                  <Typography variant="body1" paragraph>
                    We prioritize the security of your data through client-side
                    processing, HTTPS encryption, and regular security audits.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All tools operate entirely in your browser with no
                    server-side storage or data persistence between sessions.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          {/* Open Source Commitment */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            <Card
              elevation={3}
              sx={{
                p: 4,
                mb: 6,
                background: `linear-gradient(135deg, ${theme.palette.success.main}08, ${theme.palette.success.main}03)`,
                border: `1px solid ${theme.palette.success.main}20`,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Code
                  sx={{
                    fontSize: 48,
                    color: theme.palette.success.main,
                    mb: 2,
                  }}
                />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Open Source Commitment
                </Typography>
                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                  As an open-source project, our code is available for review.
                  This transparency ensures that our privacy claims can be
                  verified by examining our codebase.
                </Typography>
              </Box>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <Box sx={{ textAlign: "center", p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Questions About This Policy?
            </Typography>
            <Typography variant="body1" paragraph>
              If you have any questions about this Privacy Policy, please
              contact us:
            </Typography>
            <Stack
              direction="row"
              spacing={3}
              justifyContent="center"
              flexWrap="wrap"
              gap={2}
            >
              <Chip
                icon={<Email />}
                label="kanagarajwhb@gmail.com"
                variant="outlined"
                color="primary"
                clickable
                component="a"
                href="mailto:kanagarajwhb@gmail.com"
              />
              <Chip
                icon={<Language />}
                label="Contact Page"
                variant="outlined"
                color="secondary"
                clickable
                component="a"
                href="/contact"
              />
            </Stack>
          </Box>

          <AdSense adSlot="6613251015" />
        </Paper>
      </motion.div>
    </Container>
  );
}
