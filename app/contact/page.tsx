"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Send,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Clock,
  Users,
} from "lucide-react";
import { X } from "@mui/icons-material";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";

export default function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    message: false,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: false,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === "",
      email: !/^\S+@\S+\.\S+$/.test(formData.email),
      message: formData.message.trim() === "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Prepare form data for Web3Forms
        const formDataToSend = new FormData();
        formDataToSend.append("access_key", WEB3FORMS_KEY ?? "");
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append(
          "subject",
          formData.subject || "Contact Form Submission"
        );
        formDataToSend.append("message", formData.message);

        // Honeypot field for spam protection
        formDataToSend.append("botcheck", "");

        // Send form data to Web3Forms API
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formDataToSend,
        });

        const data = await response.json();

        if (data.success) {
          // Show success message
          setSnackbar({
            open: true,
            message: "Message sent successfully! We'll get back to you soon.",
            severity: "success",
          });

          // Reset form
          setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
          });
        } else {
          throw new Error(
            data.message || "Something went wrong. Please try again."
          );
        }
      } catch (error) {
        console.error("Form submission error:", error);
        setSnackbar({
          open: true,
          message:
            error instanceof Error
              ? error.message
              : "Failed to send message. Please try again later.",
          severity: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form.",
        severity: "error",
      });
    }
  };
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Contact methods data
  const contactMethods = [
    {
      title: "General Inquiries",
      description: "Questions about our tools or services",
      icon: <MessageCircle size={24} />,
      color: "primary",
    },
    {
      title: "Technical Support",
      description: "Help with using our developer tools",
      icon: <Users size={24} />,
      color: "secondary",
    },
    {
      title: "Quick Response",
      description: "We typically respond within 24-48 hours",
      icon: <Clock size={24} />,
      color: "success",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 8 }}
      component="main"
      aria-label="Contact KodeKit page"
    >
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-live="polite"
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          }}
          role="article"
          aria-label="Contact information and form"
        >
          {/* Header */}
          <Box
            sx={{ textAlign: "center", mb: 6 }}
            aria-labelledby="contact-heading contact-subtitle"
          >
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
                id="contact-heading"
              >
                Contact Us
              </Typography>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Typography
                variant="h5"
                color="text.secondary"
                id="contact-subtitle"
                sx={{ mb: 4, fontWeight: 400 }}
              >
                Have questions or feedback? We'd love to hear from you!
              </Typography>
            </motion.div>
          </Box>

          <AdSense adSlot="9931815357" />

          {/* Contact Methods */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Grid container spacing={3} sx={{ mb: 8 }}>
              {contactMethods.map((method, index) => (
                <Grid item xs={12} md={4} key={method.title}>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    <Card
                      elevation={2}
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
                            color: (theme.palette as any)[method.color].main,
                          }}
                        >
                          {method.icon}
                        </Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {method.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {method.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Main Content */}
          <Grid container spacing={6}>
            {/* Contact Form */}
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 4 }}
                >
                  Send us a Message
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Contact form"
                  role="form"
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={errors.name}
                        helperText={errors.name ? "Name is required" : ""}
                        required
                        disabled={isSubmitting}
                        aria-required="true"
                        aria-invalid={errors.name ? "true" : "false"}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        helperText={
                          errors.email ? "Valid email is required" : ""
                        }
                        required
                        disabled={isSubmitting}
                        aria-required="true"
                        aria-invalid={errors.email ? "true" : "false"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        aria-label="Message subject (optional)"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        multiline
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        error={errors.message}
                        helperText={errors.message ? "Message is required" : ""}
                        required
                        disabled={isSubmitting}
                        aria-required="true"
                        aria-invalid={errors.message ? "true" : "false"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={
                          isSubmitting ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : (
                            <Send size={18} />
                          )
                        }
                        disabled={isSubmitting}
                        aria-label={
                          isSubmitting ? "Sending message" : "Send message"
                        }
                        sx={{
                          px: 4,
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                        }}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12} md={5}>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <Typography
                  variant="h3"
                  component="h2"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 4 }}
                >
                  Get in Touch
                </Typography>

                <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                  We're here to help! Whether you have questions about our
                  tools, need assistance with a specific feature, or want to
                  provide feedback, don't hesitate to reach out.
                </Typography>

                {/* Social Links */}
                <Card
                  elevation={2}
                  sx={{
                    p: 3,
                    mb: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.primary.main}03)`,
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ mb: 3 }}
                  >
                    Connect With Us
                  </Typography>

                  <Box component="address" sx={{ fontStyle: "normal" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Github
                        size={20}
                        style={{ marginRight: 12 }}
                        aria-hidden="true"
                      />
                      <Typography variant="body1">
                        <a
                          href="https://github.com/kanagu555"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                          aria-label="Visit our GitHub profile (opens in new tab)"
                        >
                          github.com/kanagu555
                        </a>
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Linkedin
                        size={20}
                        style={{ marginRight: 12 }}
                        aria-hidden="true"
                      />
                      <Typography variant="body1">
                        <a
                          href="https://www.linkedin.com/in/kanagarajwhb"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                          aria-label="Visit our LinkedIn page (opens in new tab)"
                        >
                          linkedin.com/in/kanagarajwhb
                        </a>
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <X
                        fontSize="small"
                        style={{ marginRight: 12 }}
                        aria-hidden="true"
                      />
                      <Typography variant="body1">
                        <a
                          href="https://x.com/kodekit_in"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                          aria-label="Visit our X profile (formerly Twitter)"
                        >
                          x.com/kodekit_in
                        </a>
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Mail
                        size={20}
                        style={{ marginRight: 12 }}
                        aria-hidden="true"
                      />
                      <Typography variant="body1">
                        <a
                          href="mailto:contact@kodekit.in"
                          style={{
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                            fontWeight: 500,
                          }}
                          aria-label="Send us an email"
                        >
                          contact@kodekit.in
                        </a>
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                {/* Response Time */}
                <Card elevation={2} sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Response Time
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We typically respond to inquiries within 24-48 hours during
                    business days. For urgent technical issues, please include
                    "URGENT" in your subject line.
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          <AdSense adSlot="4647699080" />
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        aria-live="polite"
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          role="alert"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
