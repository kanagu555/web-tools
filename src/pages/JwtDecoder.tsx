import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  useTheme,
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
} from "lucide-react";

interface JwtPayload {
  [key: string]: any;
}

const JwtDecoder = () => {
  const theme = useTheme();
  const [token, setToken] = useState("");
  const [decodedHeader, setDecodedHeader] = useState<JwtPayload | null>(null);
  const [decodedPayload, setDecodedPayload] = useState<JwtPayload | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
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

  // Check for token in URL params on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");

    if (tokenParam) {
      try {
        const decodedToken = decodeURIComponent(tokenParam);
        setToken(decodedToken);
        decodeJwt(decodedToken);
      } catch (err) {
        console.error("Failed to parse JWT from URL", err);
      }
    }
  }, []);

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
      verifyToken(tokenToDecode, header, payload);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Invalid JWT token");
      setDecodedHeader(null);
      setDecodedPayload(null);
      setVerificationStatus(null);
    }
  };

  const verifyToken = (
    token: string,
    header: JwtPayload,
    payload: JwtPayload
  ) => {
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSnackbar("Copied to clipboard", "success");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        } else {
          showSnackbar("No valid JWT token found in file", "error");
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
            JWT Decoder
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Decode and verify JSON Web Tokens (JWT).
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
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
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      fontWeight={600}
                    >
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
                        backgroundColor: theme.palette.background.default,
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
                          ? theme.palette.mode === "dark"
                            ? "rgba(46, 125, 50, 0.1)"
                            : "rgba(46, 125, 50, 0.1)"
                          : theme.palette.mode === "dark"
                          ? "rgba(211, 47, 47, 0.1)"
                          : "rgba(211, 47, 47, 0.1)",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {verificationStatus.isValid ? (
                        <CheckCircle
                          size={20}
                          color={theme.palette.success.main}
                        />
                      ) : (
                        <XCircle size={20} color={theme.palette.error.main} />
                      )}
                      <Typography
                        variant="body2"
                        color={verificationStatus.isValid ? "success" : "error"}
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
                            backgroundColor: theme.palette.background.default,
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
                            {Object.entries(decodedHeader).map(
                              ([key, value]) => (
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
                              )
                            )}
                          </Grid>
                        </Paper>
                      </Grid>
                    )}

                    {decodedPayload && (
                      <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 3,
                            backgroundColor: theme.palette.background.default,
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
                            {Object.entries(decodedPayload).map(
                              ([key, value]) => (
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
                                                isExpired(value)
                                                  ? "Expired"
                                                  : "Valid"
                                              }
                                              color={
                                                isExpired(value)
                                                  ? "error"
                                                  : "success"
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
                              )
                            )}
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
                            backgroundColor: theme.palette.background.default,
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
                            <Typography variant="h6">
                              Full Token Data
                            </Typography>
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
                            rows={20}
                            value={JSON.stringify(
                              {
                                header: decodedHeader,
                                payload: decodedPayload,
                                token,
                              },
                              null,
                              2
                            )}
                            InputProps={{
                              readOnly: true,
                              sx: { fontFamily: "monospace" },
                            }}
                          />
                        </Paper>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default JwtDecoder;
