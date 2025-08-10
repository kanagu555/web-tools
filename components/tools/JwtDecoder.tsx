"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  Tooltip,
  IconButton,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Key,
  Clock,
  User,
  Shield,
  Copy,
  Trash2,
  ClipboardPaste,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileJson,
  Download,
  Upload,
  PlayCircle,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface JwtPayload {
  [key: string]: any;
}

const JwtDecoder: React.FC = () => {
  const { trackTool } = useAnalytics();
  const [token, setToken] = useState("");
  const [decodedHeader, setDecodedHeader] = useState<JwtPayload | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<JwtPayload | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [verificationStatus, setVerificationStatus] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  const decodeJwt = (tokenToDecode: string) => {
    try {
      const parts = tokenToDecode.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      // Base64 URL decode
      const decodeBase64Url = (str: string) => {
        // Convert Base64URL to Base64
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        // Add padding if needed
        const paddedBase64 = base64.padEnd(
          base64.length + ((4 - (base64.length % 4)) % 4),
          "="
        );
        // Decode
        return atob(paddedBase64);
      };

      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));

      setDecodedHeader(header);
      setDecodedPayload(payload);
      setError("");

      // Verify token
      verifyToken(tokenToDecode, payload);
      trackTool("jwt-decoder", "decode");
    } catch (err) {
      setError("Invalid JWT token");
      setDecodedHeader(null);
      setDecodedPayload(null);
      setVerificationStatus(null);
    }
  };

  const verifyToken = (token: string, payload: JwtPayload) => {
    // Check if token is expired
    const isTokenExpired = isExpired(payload.exp);

    // Check token structure
    const hasValidStructure = token.split(".").length === 3;

    // Check for required claims
    const hasRequiredClaims = payload.iat !== undefined;

    if (isTokenExpired) {
      setVerificationStatus({
        isValid: false,
        message: "Token has expired",
      });
    } else if (!hasValidStructure) {
      setVerificationStatus({
        isValid: false,
        message: "Invalid token structure",
      });
    } else if (!hasRequiredClaims) {
      setVerificationStatus({
        isValid: false,
        message: "Missing required claims (iat)",
      });
    } else {
      setVerificationStatus({
        isValid: true,
        message: "Token structure is valid",
      });
    }
  };

  const isExpired = (exp?: number) => {
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showSnackbar("Copied to clipboard", "success");
      trackTool("jwt-decoder", "copy");
    } catch (err) {
      showSnackbar("Failed to copy to clipboard", "error");
    }
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setToken(clipboardText);
      decodeJwt(clipboardText);
      showSnackbar("Pasted from clipboard", "success");
      trackTool("jwt-decoder", "paste");
    } catch (err) {
      showSnackbar("Failed to read from clipboard", "error");
    }
  };

  const handleClear = () => {
    setToken("");
    setDecodedHeader(null);
    setDecodedPayload(null);
    setError("");
    setVerificationStatus(null);
    showSnackbar("Cleared all content", "info");
    trackTool("jwt-decoder", "clear");
  };

  const handleDownload = (type: "header" | "payload" | "full") => {
    let content: string;
    let filename: string;

    if (type === "header" && decodedHeader) {
      content = JSON.stringify(decodedHeader, null, 2);
      filename = "jwt-header.json";
    } else if (type === "payload" && decodedPayload) {
      content = JSON.stringify(decodedPayload, null, 2);
      filename = "jwt-payload.json";
    } else if (type === "full" && decodedHeader && decodedPayload) {
      content = JSON.stringify(
        {
          header: decodedHeader,
          payload: decodedPayload,
          token,
        },
        null,
        2
      );
      filename = "jwt-token.json";
    } else {
      showSnackbar("Nothing to download", "warning");
      return;
    }

    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSnackbar(`${filename} downloaded`, "success");
    trackTool("jwt-decoder", "download");
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content);

        // Check if the file contains a token directly or in a property
        let tokenFromFile = "";

        if (typeof jsonData === "string") {
          tokenFromFile = jsonData;
        } else if (jsonData.token && typeof jsonData.token === "string") {
          tokenFromFile = jsonData.token;
        } else if (
          jsonData.access_token &&
          typeof jsonData.access_token === "string"
        ) {
          tokenFromFile = jsonData.access_token;
        } else if (jsonData.id_token && typeof jsonData.id_token === "string") {
          tokenFromFile = jsonData.id_token;
        }

        if (tokenFromFile) {
          setToken(tokenFromFile);
          decodeJwt(tokenFromFile);
          showSnackbar(`Token loaded from file "${file.name}"`, "success");
          trackTool("jwt-decoder", "file_upload");
        } else {
          showSnackbar("No valid JWT token found in file", "error");
        }
      } catch (err) {
        showSnackbar("Error reading file: Invalid JSON format", "error");
      }
    };
    reader.onerror = () => {
      showSnackbar("Error reading file", "error");
    };
    reader.readAsText(file);

    // Reset the input value to allow uploading the same file again
    event.target.value = "";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Navigation />

        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          JWT Decoder
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            Decode and verify JSON Web Tokens (JWT) to inspect headers,
            payloads, and signatures.
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Shield size={18} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    Security
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Decode JWT tokens to inspect claims, expiration times, and
                  verify token structure for security analysis.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <User size={18} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    User Claims
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Extract user information, roles, permissions, and custom
                  claims from JWT payload data.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Clock size={18} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    Token Validation
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Check token expiration, issued time, and validity to ensure
                  tokens are still active and properly formatted.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  JWT Token
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Paste from clipboard">
                    <IconButton size="small" onClick={handlePaste}>
                      <ClipboardPaste size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear input">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      disabled={!token}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Upload token file">
                    <IconButton component="label" size="small">
                      <Upload size={18} />
                      <input
                        type="file"
                        accept=".json,.txt"
                        hidden
                        onChange={handleFileUpload}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={4}
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  if (e.target.value) {
                    decodeJwt(e.target.value);
                  } else {
                    setDecodedHeader(null);
                    setDecodedPayload(null);
                    setError("");
                    setVerificationStatus(null);
                  }
                }}
                error={!!error}
                helperText={error}
                placeholder="Paste your JWT token here..."
                sx={{
                  fontFamily: "monospace",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "background.default",
                  },
                }}
              />
            </Grid>

            {verificationStatus && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: verificationStatus.isValid
                      ? "rgba(46, 125, 50, 0.1)"
                      : "rgba(211, 47, 47, 0.1)",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {verificationStatus.isValid ? (
                    <CheckCircle size={20} color="#2e7d32" />
                  ) : (
                    <XCircle size={20} color="#d32f2f" />
                  )}
                  <Typography
                    variant="body2"
                    color={
                      verificationStatus.isValid ? "success.main" : "error.main"
                    }
                  >
                    {verificationStatus.message}
                  </Typography>
                </Paper>
              </Grid>
            )}

            {(decodedHeader || decodedPayload) && (
              <Grid item xs={12}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  sx={{ mb: 2, borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab
                    label="Decoded"
                    icon={<Key size={16} />}
                    iconPosition="start"
                  />
                  <Tab
                    label="JSON"
                    icon={<FileJson size={16} />}
                    iconPosition="start"
                  />
                </Tabs>
              </Grid>
            )}

            {activeTab === 0 && (
              <>
                {decodedHeader && (
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        backgroundColor: "background.default",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Shield size={20} />
                          <Typography variant="h6">Header</Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Copy header">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCopy(
                                  JSON.stringify(decodedHeader, null, 2)
                                )
                              }
                            >
                              <Copy size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download header">
                            <IconButton
                              size="small"
                              onClick={() => handleDownload("header")}
                            >
                              <Download size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        {Object.entries(decodedHeader).map(([key, value]) => (
                          <Grid item xs={12} key={key}>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {key}
                              </Typography>
                              <Typography
                                variant="body2"
                                fontFamily="monospace"
                              >
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                )}

                {decodedPayload && (
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        backgroundColor: "background.default",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <User size={20} />
                          <Typography variant="h6">Payload</Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Copy payload">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCopy(
                                  JSON.stringify(decodedPayload, null, 2)
                                )
                              }
                            >
                              <Copy size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download payload">
                            <IconButton
                              size="small"
                              onClick={() => handleDownload("payload")}
                            >
                              <Download size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        {Object.entries(decodedPayload).map(([key, value]) => (
                          <Grid item xs={12} key={key}>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {key}
                              </Typography>
                              {key === "exp" ||
                              key === "iat" ||
                              key === "nbf" ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    fontFamily="monospace"
                                  >
                                    {typeof value === "number"
                                      ? formatDate(value)
                                      : String(value)}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    icon={<Clock size={14} />}
                                    label={
                                      typeof value === "number"
                                        ? value
                                        : String(value)
                                    }
                                    variant="outlined"
                                  />
                                  {key === "exp" &&
                                    typeof value === "number" && (
                                      <Chip
                                        size="small"
                                        icon={
                                          isExpired(value) ? (
                                            <AlertTriangle size={14} />
                                          ) : (
                                            <CheckCircle size={14} />
                                          )
                                        }
                                        label={
                                          isExpired(value) ? "Expired" : "Valid"
                                        }
                                        color={
                                          isExpired(value) ? "error" : "success"
                                        }
                                        variant="outlined"
                                      />
                                    )}
                                </Box>
                              ) : (
                                <Typography
                                  variant="body2"
                                  fontFamily="monospace"
                                >
                                  {typeof value === "object"
                                    ? JSON.stringify(value)
                                    : String(value)}
                                </Typography>
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </>
            )}

            {activeTab === 1 && (
              <>
                {(decodedHeader || decodedPayload) && (
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        backgroundColor: "background.default",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">Full Token Data</Typography>
                        <Box>
                          <Tooltip title="Copy full token data">
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleCopy(
                                  JSON.stringify(
                                    {
                                      header: decodedHeader,
                                      payload: decodedPayload,
                                      token,
                                    },
                                    null,
                                    2
                                  )
                                )
                              }
                            >
                              <Copy size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download full token data">
                            <IconButton
                              size="small"
                              onClick={() => handleDownload("full")}
                            >
                              <Download size={16} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TextField
                        multiline
                        fullWidth
                        rows={15}
                        value={JSON.stringify(
                          {
                            header: decodedHeader,
                            payload: decodedPayload,
                            token,
                          },
                          null,
                          2
                        )}
                        InputProps={{ readOnly: true }}
                        sx={{
                          fontFamily: "monospace",
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "background.paper",
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </Paper>

        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About JWT Tokens
          </Typography>
          <Typography variant="body1" paragraph>
            JSON Web Tokens (JWT) are a compact, URL-safe means of representing
            claims to be transferred between two parties. They consist of three
            parts separated by dots: header, payload, and signature.
          </Typography>

          {/* Examples Section - SEO Friendly */}
          <Box sx={{ mt: 6, mb: 4 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
            >
              JWT Examples
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Authentication Token Example
                  </Typography>
                  <Typography variant="body2" paragraph>
                    A typical JWT used for user authentication after login:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      wordBreak: "break-all",
                      position: "relative",
                      mb: 2,
                    }}
                  >
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={() => {
                        setToken(
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                        );
                        decodeJwt(
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                        );
                      }}
                    >
                      <Tooltip title="Try this example">
                        <PlayCircle size={16} />
                      </Tooltip>
                    </IconButton>
                  </Box>
                  <Typography variant="body2">
                    This token contains user identification information and an
                    expiration timestamp.
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    API Authorization Token Example
                  </Typography>
                  <Typography variant="body2" paragraph>
                    A JWT with role-based permissions for API access:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      border: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      wordBreak: "break-all",
                      position: "relative",
                      mb: 2,
                    }}
                  >
                    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjIsInJvbGVzIjpbImFkbWluIiwiZWRpdG9yIl0sInBlcm1pc3Npb25zIjpbInJlYWQ6YWxsIiwid3JpdGU6YWxsIl19.7hLdpeOyZIBXEFoH3n_reKBbhxReCbO9X-y-pJ1Bl8M
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={() => {
                        setToken(
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjIsInJvbGVzIjpbImFkbWluIiwiZWRpdG9yIl0sInBlcm1pc3Npb25zIjpbInJlYWQ6YWxsIiwid3JpdGU6YWxsIl19.7hLdpeOyZIBXEFoH3n_reKBbhxReCbO9X-y-pJ1Bl8M"
                        );
                        decodeJwt(
                          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE2MTYyMzkwMjIsInJvbGVzIjpbImFkbWluIiwiZWRpdG9yIl0sInBlcm1pc3Npb25zIjpbInJlYWQ6YWxsIiwid3JpdGU6YWxsIl19.7hLdpeOyZIBXEFoH3n_reKBbhxReCbO9X-y-pJ1Bl8M"
                        );
                      }}
                    >
                      <Tooltip title="Try this example">
                        <PlayCircle size={16} />
                      </Tooltip>
                    </IconButton>
                  </Box>
                  <Typography variant="body2">
                    This token includes role-based access control information
                    with specific permissions.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <AdSense adSlot="6613251015" />

          {/* Information Section - SEO Friendly */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              fontWeight={700}
            >
              Understanding JSON Web Tokens (JWT)
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600}>
                What is a JWT?
              </Typography>
              <Typography variant="body1" paragraph>
                JSON Web Token (JWT) is an open standard (RFC 7519) that defines
                a compact and self-contained way for securely transmitting
                information between parties as a JSON object. JWTs are commonly
                used for authentication and information exchange in web
                development.
              </Typography>
              <Typography variant="body1" paragraph>
                JWTs are digitally signed using a secret key (with HMAC
                algorithm) or a public/private key pair (using RSA or ECDSA),
                ensuring that the information contained within cannot be altered
                after the token is issued without detection.
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600}>
                JWT Structure
              </Typography>
              <Typography variant="body1" paragraph>
                A JWT consists of three parts separated by dots (.):
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Box component="li">
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Header
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Contains the token type ("JWT") and the signing algorithm
                    being used (e.g., HMAC SHA256 or RSA).
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Payload
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Contains the claims or assertions about an entity (typically
                    the user) and additional metadata. Common claims include
                    subject (sub), issued at time (iat), expiration time (exp),
                    and issuer (iss).
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Signature
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Created by signing the encoded header, encoded payload, and
                    a secret key using the algorithm specified in the header.
                    The signature verifies that the message wasn't changed and,
                    in the case of tokens signed with a private key, it also
                    verifies the sender of the JWT.
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                mb: 3,
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Common JWT Use Cases
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Authentication:</strong> After a user logs in, each
                    subsequent request will include the JWT, allowing the user
                    to access routes, services, and resources permitted with
                    that token.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Information Exchange:</strong> JWTs can securely
                    transmit information between parties, as the signature
                    ensures the sender is who they claim to be and the
                    information hasn't been tampered with.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Authorization:</strong> Once a user is logged in, an
                    application can allow or deny access to specific features
                    based on the user's role or permissions included in the JWT
                    payload.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Federated Identity:</strong> JWTs are used in single
                    sign-on (SSO) scenarios where a service provider can verify
                    a user's identity based on a token issued by an identity
                    provider.
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600}>
                JWT Security Best Practices
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Set appropriate expiration times:</strong>{" "}
                    Short-lived tokens reduce the window of opportunity for
                    attackers if a token is compromised.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Use HTTPS:</strong> Always transmit JWTs over HTTPS
                    to prevent token interception.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Don't store sensitive data:</strong> Avoid storing
                    sensitive information in the payload as it can be decoded
                    easily.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Use strong signing keys:</strong> Ensure your
                    signing keys are sufficiently complex and kept secure.
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <strong>Implement token revocation:</strong> Have a strategy
                    for invalidating tokens before their expiration time if
                    needed.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </motion.div>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JwtDecoder;
