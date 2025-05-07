"use client";

import { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  FormControlLabel,
  Checkbox,
  Grid,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
  useTheme,
  Alert,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordHistory, setPasswordHistory] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const theme = useTheme();

  // Generate password on initial load and when parameters change
  useEffect(() => {
    generatePassword();
  }, []);

  // Calculate password strength whenever password changes
  useEffect(() => {
    calculatePasswordStrength();
  }, [password]);

  const generatePassword = () => {
    // Character sets
    const uppercaseChars = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijkmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    // Similar characters that can be excluded
    const similarChars = "il1Lo0O";
    const ambiguousChars = "{}[]()/\\'\"`~,;:.<>";

    // Build character set based on options
    let chars = "";
    if (includeUppercase) chars += uppercaseChars;
    if (includeLowercase) chars += lowercaseChars;
    if (includeNumbers) chars += numberChars;
    if (includeSymbols) chars += symbolChars;

    // Remove similar characters if option is selected
    if (excludeSimilar) {
      for (const char of similarChars) {
        chars = chars.replace(new RegExp(char, "g"), "");
      }
    }

    // Remove ambiguous characters if option is selected
    if (excludeAmbiguous) {
      for (const char of ambiguousChars) {
        chars = chars.replace(new RegExp("\\" + char, "g"), "");
      }
    }

    // Ensure we have at least one character set selected
    if (chars.length === 0) {
      chars = lowercaseChars + numberChars;
    }

    // Generate password
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      newPassword += chars[randomIndex];
    }

    setPassword(newPassword);

    // Add to history if it's a new password
    if (newPassword && !passwordHistory.includes(newPassword)) {
      setPasswordHistory((prev) => [newPassword, ...prev].slice(0, 5));
    }

    setCopied(false);
  };

  const calculatePasswordStrength = () => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    // Calculate password strength based on various factors
    let strength = 0;

    // Length factor (up to 40%)
    strength += Math.min(40, (password.length / 20) * 40);

    // Character variety (up to 60%)
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[^A-Za-z0-9]/.test(password);

    const charTypes = [
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSymbols,
    ].filter(Boolean).length;
    strength += (charTypes / 4) * 60;

    setPasswordStrength(Math.min(100, Math.round(strength)));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return theme.palette.error.main;
    if (passwordStrength < 60) return theme.palette.warning.main;
    if (passwordStrength < 80) return theme.palette.info.main;
    return theme.palette.success.main;
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 1000, mx: "auto" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="h6" gutterBottom>
            Password Generator
          </Typography>

          <Box sx={{ mb: 3, position: "relative" }}>
            <TextField
              fullWidth
              value={password}
              type={showPassword ? "text" : "password"}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Box sx={{ display: "flex" }}>
                    <Tooltip
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        onClick={copyToClipboard}
                        color={copied ? "success" : "default"}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Generate new password">
                      <IconButton onClick={generatePassword}>
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ),
              }}
              sx={{ fontFamily: "monospace", letterSpacing: "0.1em" }}
            />
            {copied && (
              <Chip
                label="Copied!"
                color="success"
                size="small"
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  zIndex: 1,
                }}
              />
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Password Strength</Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LinearProgress
                variant="determinate"
                value={passwordStrength}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  flexGrow: 1,
                  mr: 2,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: getStrengthColor(),
                  },
                }}
              />
              <Typography
                variant="body2"
                color={getStrengthColor()}
                sx={{ fontWeight: "bold", minWidth: 60 }}
              >
                {getStrengthLabel()}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Chip
                size="small"
                icon={
                  /[A-Z]/.test(password) ? <CheckCircleIcon /> : <CancelIcon />
                }
                label="A-Z"
                color={/[A-Z]/.test(password) ? "success" : "default"}
                variant="outlined"
              />
              <Chip
                size="small"
                icon={
                  /[a-z]/.test(password) ? <CheckCircleIcon /> : <CancelIcon />
                }
                label="a-z"
                color={/[a-z]/.test(password) ? "success" : "default"}
                variant="outlined"
              />
              <Chip
                size="small"
                icon={
                  /[0-9]/.test(password) ? <CheckCircleIcon /> : <CancelIcon />
                }
                label="0-9"
                color={/[0-9]/.test(password) ? "success" : "default"}
                variant="outlined"
              />
              <Chip
                size="small"
                icon={
                  /[^A-Za-z0-9]/.test(password) ? (
                    <CheckCircleIcon />
                  ) : (
                    <CancelIcon />
                  )
                }
                label="!@#$"
                color={/[^A-Za-z0-9]/.test(password) ? "success" : "default"}
                variant="outlined"
              />
              <Chip
                size="small"
                icon={
                  password.length >= 12 ? <CheckCircleIcon /> : <CancelIcon />
                }
                label="12+ chars"
                color={password.length >= 12 ? "success" : "default"}
                variant="outlined"
              />
            </Box>
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Password Options
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Length: {length} characters</Typography>
            <Slider
              value={length}
              min={8}
              max={32}
              step={1}
              onChange={(_, value) => setLength(value as number)}
              aria-labelledby="password-length-slider"
              marks={[
                { value: 8, label: "8" },
                { value: 16, label: "16" },
                { value: 24, label: "24" },
                { value: 32, label: "32" },
              ]}
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                  />
                }
                label="Include Uppercase (A-Z)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                  />
                }
                label="Include Lowercase (a-z)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                }
                label="Include Numbers (0-9)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                }
                label="Include Symbols (!@#$)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={excludeSimilar}
                    onChange={(e) => setExcludeSimilar(e.target.checked)}
                  />
                }
                label="Exclude Similar (i, l, 1, L, o, 0, O)"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={excludeAmbiguous}
                    onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  />
                }
                label="Exclude Ambiguous ({}, [], (), etc.)"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={generatePassword}
              fullWidth
            >
              Generate New Password
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Typography variant="h6" gutterBottom>
            Password History
          </Typography>
          {passwordHistory.length > 0 ? (
            <Box sx={{ mb: 3 }}>
              {passwordHistory.map((historyPassword, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.5,
                    mb: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      letterSpacing: "0.1em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {showPassword
                      ? historyPassword
                      : "•".repeat(historyPassword.length)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      navigator.clipboard.writeText(historyPassword)
                    }
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              No password history yet. Generate passwords to see them here.
            </Typography>
          )}

          <Typography variant="h6" gutterBottom>
            Password Tips
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Strong passwords should:</strong>
            </Typography>
            <ul style={{ marginTop: 8, paddingLeft: 20 }}>
              <li>Be at least 12 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include numbers and special characters</li>
              <li>Not contain dictionary words or personal information</li>
              <li>Be unique for each service you use</li>
            </ul>
          </Alert>
          <Alert severity="warning">
            <Typography variant="body2">
              <strong>Remember:</strong> Never share your passwords with anyone
              or store them in plain text. Consider using a password manager to
              securely store your passwords.
            </Typography>
          </Alert>
        </Grid>
      </Grid>

    </Paper>
  );
}
