import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Container,
  Tooltip,
  IconButton,
  FormControlLabel,
  Switch,
  Alert,
  Slider,
  Snackbar,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ContentCopy,
  Refresh,
  Download,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";

const PasswordGenerator: React.FC = () => {
  // State for password options
  const [password, setPassword] = useState<string>("");
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilarChars, setExcludeSimilarChars] =
    useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");

  // State for UI feedback
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");

  useEffect(() => {
    window.scrollTo(0, 0);
    generatePassword();
  }, []);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Calculate password strength whenever password changes
  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);

  const calculatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength("");
      return;
    }

    // Basic strength calculation based on length and character types
    let strength = 0;

    // Length contribution (up to 40%)
    strength += Math.min(40, (password.length / 20) * 40);

    // Character type contribution (up to 60%)
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (hasUpper) strength += 15;
    if (hasLower) strength += 15;
    if (hasNumber) strength += 15;
    if (hasSymbol) strength += 15;

    // Determine strength category
    if (strength < 40) {
      setPasswordStrength("Weak");
    } else if (strength < 70) {
      setPasswordStrength("Medium");
    } else {
      setPasswordStrength("Strong");
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "Weak":
        return "#f44336"; // Red
      case "Medium":
        return "#ff9800"; // Orange
      case "Strong":
        return "#4caf50"; // Green
      default:
        return "#9e9e9e"; // Grey
    }
  };

  const generatePassword = () => {
    if (
      !includeLowercase &&
      !includeUppercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      setError("Please select at least one character type");
      return;
    }

    setError("");

    let charset = "";
    const uppercaseChars = excludeSimilarChars
      ? "ABCDEFGHJKLMNPQRSTUVWXYZ"
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = excludeSimilarChars
      ? "abcdefghijkmnpqrstuvwxyz"
      : "abcdefghijklmnopqrstuvwxyz";
    const numberChars = excludeSimilarChars ? "23456789" : "0123456789";
    const symbolChars = excludeSimilarChars
      ? "!@#$%^&*()_+{}[]:;<>,.?/\\"
      : "!@#$%^&*()_+{}[]:;<>,.?/\\|~`";

    if (includeUppercase) charset += uppercaseChars;
    if (includeLowercase) charset += lowercaseChars;
    if (includeNumbers) charset += numberChars;
    if (includeSymbols) charset += symbolChars;

    let newPassword = "";
    let hasRequiredChars = false;

    // Keep generating until we have at least one of each selected character type
    while (!hasRequiredChars) {
      newPassword = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        newPassword += charset[randomIndex];
      }

      // Verify the password has at least one of each selected character type
      const hasUpper = !includeUppercase || /[A-Z]/.test(newPassword);
      const hasLower = !includeLowercase || /[a-z]/.test(newPassword);
      const hasNumber = !includeNumbers || /[0-9]/.test(newPassword);
      const hasSymbol = !includeSymbols || /[^A-Za-z0-9]/.test(newPassword);

      hasRequiredChars = hasUpper && hasLower && hasNumber && hasSymbol;
    }

    setPassword(newPassword);
    setSnackbarMessage("New password generated");
    setSnackbarOpen(true);
  };

  const resetForm = () => {
    setLength(16);
    setIncludeUppercase(true);
    setIncludeLowercase(true);
    setIncludeNumbers(true);
    setIncludeSymbols(true);
    setExcludeSimilarChars(false);
    setError("");
    generatePassword();
    setSnackbarMessage("Options reset");
    setSnackbarOpen(true);
  };

  const copyToClipboard = () => {
    if (!password) return;

    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopied(true);
        setSnackbarMessage("Copied to clipboard");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setError("Failed to copy to clipboard.");
      });
  };

  const downloadPassword = () => {
    if (!password) {
      setError("Please generate a password first.");
      return;
    }

    const element = document.createElement("a");
    const file = new Blob([password], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `password_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    setSnackbarMessage("Password downloaded");
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Password Generator - Create Secure Passwords</title>
        <meta
          name="description"
          content="Free online tool to generate secure, random passwords with customizable length and character types. Create strong passwords for your accounts."
        />
        <meta
          name="keywords"
          content="password generator, secure password, random password, strong password, password creator, password maker, online security tool, password strength, password strength online, random password generator, free password generator online"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Password Generator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Create secure, random passwords with customizable options for all your
          accounts.
        </Typography>

        {/* Main Tool Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            {/* Password Display */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Generated Password"
                value={password}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  type: showPassword ? "text" : "password",
                  endAdornment: (
                    <Box sx={{ display: "flex" }}>
                      <Tooltip
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        <IconButton onClick={togglePasswordVisibility}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
                        <IconButton
                          onClick={copyToClipboard}
                          color={copied ? "success" : "default"}
                          disabled={!password}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ),
                }}
              />
              {passwordStrength && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Strength:
                  </Typography>
                  <Box
                    sx={{
                      height: 8,
                      width: "100%",
                      bgcolor: "grey.300",
                      borderRadius: 5,
                      mr: 1,
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        width:
                          passwordStrength === "Weak"
                            ? "33%"
                            : passwordStrength === "Medium"
                            ? "66%"
                            : "100%",
                        bgcolor: getPasswordStrengthColor(),
                        borderRadius: 5,
                        transition: "width 0.3s ease-in-out",
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: getPasswordStrengthColor(),
                      fontWeight: "bold",
                    }}
                  >
                    {passwordStrength}
                  </Typography>
                </Box>
              )}
            </Grid>

            {/* Password Length */}
            <Grid item xs={12}>
              <Typography gutterBottom>Password Length: {length}</Typography>
              <Slider
                value={length}
                onChange={(_, newValue) => setLength(newValue as number)}
                min={8}
                max={64}
                step={1}
                valueLabelDisplay="auto"
                aria-labelledby="password-length-slider"
              />
            </Grid>

            {/* Character Types */}
            <Grid item xs={12}>
              <Typography gutterBottom>Character Types:</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeUppercase}
                        onChange={(e) => setIncludeUppercase(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Uppercase (A-Z)"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeLowercase}
                        onChange={(e) => setIncludeLowercase(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Lowercase (a-z)"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeNumbers}
                        onChange={(e) => setIncludeNumbers(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Numbers (0-9)"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={includeSymbols}
                        onChange={(e) => setIncludeSymbols(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Symbols (!@#$%)"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Additional Options */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={excludeSimilarChars}
                    onChange={(e) => setExcludeSimilarChars(e.target.checked)}
                    color="primary"
                  />
                }
                label="Exclude similar characters (i, l, 1, L, o, 0, O)"
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generatePassword}
                >
                  Generate Password
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={downloadPassword}
                  startIcon={<Download />}
                  disabled={!password}
                >
                  Download Password
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={resetForm}
                  startIcon={<Refresh />}
                >
                  Reset Options
                </Button>
              </Box>
            </Grid>

            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
          </Grid>
        </Paper>

        <AdSense adSlot="6613251015" />

        {/* Information Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            What Makes a Strong Password?
          </Typography>
          <Typography paragraph>
            A strong password is your first line of defense against unauthorized
            access to your accounts. The best passwords are long, random, and
            use a mix of different character types.
          </Typography>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            Password Security Tips
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>Use unique passwords</strong> for each of your
                  accounts
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>Longer is better</strong> - aim for at least 12-16
                  characters
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>Mix character types</strong> - include uppercase,
                  lowercase, numbers, and symbols
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>Avoid personal information</strong> like names,
                  birthdays, or common words
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>Use a password manager</strong> to store and generate
                  complex passwords
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  <strong>Enable two-factor authentication</strong> when
                  available
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 3 }}
          >
            Common Password Mistakes to Avoid
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Using the same password for multiple accounts
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Using common words or phrases</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Using personal information like birthdays or names
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Using simple patterns like "123456" or "qwerty"
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>
                  Writing passwords down on paper or in unsecured files
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Typography variant="body1" fontWeight={500} sx={{ mr: 1 }}>
                  •
                </Typography>
                <Typography>Not updating passwords regularly</Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Tip: This password generator creates passwords locally in your
            browser. Your generated passwords are never sent to our servers or
            stored anywhere.
          </Typography>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PasswordGenerator;
