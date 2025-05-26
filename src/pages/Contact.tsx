import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Mail } from "lucide-react";
import AdSense from "../components/AdSense";

const Contact = () => {
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

  useEffect(() => {
    // Scroll to top when component mounts
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
        formDataToSend.append(
          "access_key",
          "c0a6cf3b-5a18-49ed-ac50-017b572eb070"
        );
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
              Contact Us
            </Typography>
            <Divider
              sx={{ width: "60px", mx: "auto", mb: 3, borderWidth: 2 }}
            />
            <Typography variant="subtitle1" color="text.secondary">
              Have questions or feedback? We'd love to hear from you!
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box component="form" onSubmit={handleSubmit} noValidate>
                {/* Hidden honeypot field for spam protection */}
                <input
                  type="checkbox"
                  name="botcheck"
                  style={{ display: "none" }}
                />

                {/* Hidden access key field */}
                <input
                  type="hidden"
                  name="access_key"
                  value="c0a6cf3b-5a18-49ed-ac50-017b572eb070"
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  helperText={errors.name ? "Name is required" : ""}
                  required
                  disabled={isSubmitting}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={errors.email ? "Valid email is required" : ""}
                  required
                  disabled={isSubmitting}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Message"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  helperText={errors.message ? "Message is required" : ""}
                  required
                  disabled={isSubmitting}
                />
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
                  sx={{ mt: 3 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Get in Touch
                </Typography>
                <Typography variant="body1" paragraph>
                  We're here to help! Whether you have questions about our
                  tools, need assistance with a specific feature, or want to
                  provide feedback, don't hesitate to reach out.
                </Typography>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Connect With Us
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Github size={20} style={{ marginRight: 12 }} />
                    <Typography variant="body2">
                      <a
                        href="https://github.com/kanagu555"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "none",
                        }}
                      >
                        github.com/kanagu555
                      </a>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Linkedin size={20} style={{ marginRight: 12 }} />
                    <Typography variant="body2">
                      <a
                        href="https://www.linkedin.com/in/kanagarajwhb"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "none",
                        }}
                      >
                        linkedin.com/in/kanagarajwhb
                      </a>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Mail size={20} style={{ marginRight: 12 }} />
                    <Typography variant="body2">
                      <a
                        href="mailto:kanagarajwhb@gmail.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: "none",
                        }}
                      >
                        kanagarajwhb@gmail.com
                      </a>
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Response Time
                </Typography>
                <Typography variant="body2">
                  We typically respond to inquiries within 24-48 hours during
                  business days.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <AdSense adSlot="6613251015" />
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
