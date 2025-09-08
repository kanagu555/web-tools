"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Send,
  Plus,
  Trash2,
  Copy,
  RotateCcw,
  History,
  Code,
  Download,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "@/components/AdSense";

interface Header {
  key: string;
  value: string;
}

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  timestamp: number;
}

interface JsonViewerProps {
  data: any;
  level?: number;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0 }) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpanded = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderValue = (
    value: any,
    key?: string,
    currentLevel = level
  ): React.ReactNode => {
    if (value === null) {
      return <span style={{ color: "#ff6b6b" }}>null</span>;
    }

    if (typeof value === "boolean") {
      return <span style={{ color: "#ffd93d" }}>{value.toString()}</span>;
    }

    if (typeof value === "number") {
      return <span style={{ color: "#6bcf7f" }}>{value}</span>;
    }

    if (typeof value === "string") {
      return <span style={{ color: "#4ecdc4" }}>"{value}"</span>;
    }

    if (Array.isArray(value)) {
      const isExpanded = expanded[key || "root"];
      const itemCount = value.length;

      return (
        <div style={{ marginLeft: currentLevel * 20 }}>
          <span
            onClick={() => key && toggleExpanded(key)}
            style={{
              cursor: key ? "pointer" : "default",
              color: "#74b9ff",
              userSelect: "none",
            }}
          >
            {key && (isExpanded ? "▼" : "▶")} [{itemCount} items]
          </span>
          {(!key || isExpanded) && (
            <div style={{ marginLeft: 20, marginTop: 5 }}>
              {value.map((item, index) => (
                <div key={index} style={{ marginBottom: 2 }}>
                  <span style={{ color: "#a29bfe", marginRight: 8 }}>
                    {index}:
                  </span>
                  {renderValue(
                    item,
                    `${key || "root"}_${index}`,
                    currentLevel + 1
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const isExpanded = expanded[key || "root"];
      const keys = Object.keys(value);
      const keyCount = keys.length;

      return (
        <div style={{ marginLeft: currentLevel * 20 }}>
          <span
            onClick={() => key && toggleExpanded(key)}
            style={{
              cursor: key ? "pointer" : "default",
              color: "#fd79a8",
              userSelect: "none",
            }}
          >
            {key && (isExpanded ? "▼" : "▶")} {"{"} {keyCount} keys {"}"}
          </span>
          {(!key || isExpanded) && (
            <div style={{ marginLeft: 20, marginTop: 5 }}>
              {keys.map((objKey) => (
                <div key={objKey} style={{ marginBottom: 2 }}>
                  <span style={{ color: "#a29bfe", marginRight: 8 }}>
                    "{objKey}":
                  </span>
                  {renderValue(
                    value[objKey],
                    `${key || "root"}_${objKey}`,
                    currentLevel + 1
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return <span>{String(value)}</span>;
  };

  if (
    typeof data === "string" &&
    (data === "null" || data === '""' || data === "Empty response")
  ) {
    return <span style={{ color: "#636e72" }}>{data}</span>;
  }

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: "14px",
        lineHeight: "1.4",
        backgroundColor: "#212121",
        color: "#e2e8f0",
        padding: "16px",
        borderRadius: "8px",
        overflow: "auto",
        maxHeight: "450px",
      }}
    >
      {renderValue(data)}
    </div>
  );
};

const ApiTester: React.FC = () => {
  const { trackTool } = useAnalytics();

  // Request state
  const [url, setUrl] = useState<string>("");
  const [method, setMethod] = useState<string>("GET");
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [body, setBody] = useState<string>("");
  const [authType, setAuthType] = useState<string>("none");
  const [authValue, setAuthValue] = useState<string>("");

  // Response state
  const [response, setResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // UI state
  const [activeTab, setActiveTab] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  // History
  const [history, setHistory] = useState<RequestHistory[]>([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("api-tester-online-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const showSnackbar = (
    message: string,
    severity: "success" | "error" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    setError("");
    setLoading(true);
    setResponse(null);
    setResponseStatus(null);
    setResponseHeaders(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      setLoading(false);
      return;
    }

    try {
      const requestOptions: RequestInit = {
        method,
        headers: {},
      };

      // Add custom headers
      headers.forEach((header) => {
        if (header.key.trim() && header.value.trim()) {
          (requestOptions.headers as any)[header.key] = header.value;
        }
      });

      // Add authentication
      if (authType === "basic" && authValue) {
        const [username, password] = authValue.split(":");
        const credentials = btoa(`${username}:${password}`);
        (requestOptions.headers as any)[
          "Authorization"
        ] = `Basic ${credentials}`;
      } else if (authType === "bearer" && authValue) {
        (requestOptions.headers as any)[
          "Authorization"
        ] = `Bearer ${authValue}`;
      } else if (authType === "api-key" && authValue) {
        (requestOptions.headers as any)["X-API-Key"] = authValue;
      }

      // Add body for non-GET requests
      if (method !== "GET" && body.trim()) {
        requestOptions.body = body;
        if (!headers.some((h) => h.key.toLowerCase() === "content-type")) {
          (requestOptions.headers as any)["Content-Type"] = "application/json";
        }
      }

      const response = await fetch(url, requestOptions);

      setResponseStatus(response.status);

      // Get response headers
      const responseHeadersObj: any = {};
      response.headers.forEach((value, key) => {
        responseHeadersObj[key] = value;
      });
      setResponseHeaders(responseHeadersObj);

      // Get response body
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const jsonResponse = await response.json();
          setResponse(jsonResponse);
        } catch (error) {
          console.error("Error parsing JSON response:", error);
          const textResponse = await response.text();
          setResponse(textResponse || "Empty response");
        }
      } else {
        const textResponse = await response.text();
        setResponse(textResponse || "Empty response");
      }

      // Save to history
      const newHistoryItem: RequestHistory = {
        id: Date.now().toString(),
        method,
        url,
        timestamp: Date.now(),
      };
      const updatedHistory = [newHistoryItem, ...history.slice(0, 9)]; // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem(
        "api-tester-online-history",
        JSON.stringify(updatedHistory)
      );

      showSnackbar("Request sent successfully");
      trackTool("api-tester-online", "send-request");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      showSnackbar("Request failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadFromHistory = (item: RequestHistory) => {
    setUrl(item.url);
    setMethod(item.method);
    setActiveTab(0);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showSnackbar("Copied to clipboard");
  };

  const downloadAsText = (content: any, filename: string) => {
    const textContent =
      typeof content === "string" ? content : formatJson(content);
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showSnackbar(`Downloaded ${filename}`);
  };

  const downloadAsJson = (content: any, filename: string) => {
    try {
      const jsonContent = JSON.stringify(content, null, 2);
      const blob = new Blob([jsonContent], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSnackbar(`Downloaded ${filename}`);
    } catch (error) {
      showSnackbar("Failed to download JSON", "error");
    }
  };

  const resetForm = () => {
    setUrl("");
    setMethod("GET");
    setHeaders([{ key: "", value: "" }]);
    setBody("");
    setAuthType("none");
    setAuthValue("");
    setResponse(null);
    setResponseStatus(null);
    setResponseHeaders(null);
    setError("");
    setActiveTab(0);
    trackTool("api-tester-online", "reset");
  };

  const formatJson = (obj: any) => {
    try {
      if (obj === null || obj === undefined) {
        return "null";
      }
      if (typeof obj === "string" && obj.trim() === "") {
        return '""';
      }
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      console.error("Error formatting JSON:", error);
      return String(obj);
    }
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
          variant="h1"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          API Tester
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Test REST APIs with a user-friendly interface
        </Typography>

        {/* Request Configuration */}
        <Paper sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Request Configuration
          </Typography>

          <Grid container spacing={3}>
            {/* Method and URL */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Method</InputLabel>
                <Select
                  value={method}
                  label="Method"
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <MenuItem value="GET">GET</MenuItem>
                  <MenuItem value="POST">POST</MenuItem>
                  <MenuItem value="PUT">PUT</MenuItem>
                  <MenuItem value="DELETE">DELETE</MenuItem>
                  <MenuItem value="PATCH">PATCH</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label="URL"
                placeholder="https://api.example.com/endpoint"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                error={!!error}
                helperText={error}
              />
            </Grid>

            {/* Authentication */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Auth Type</InputLabel>
                <Select
                  value={authType}
                  label="Auth Type"
                  onChange={(e) => setAuthType(e.target.value)}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="bearer">Bearer Token</MenuItem>
                  <MenuItem value="api-key">API Key</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={9}>
              <TextField
                fullWidth
                label={
                  authType === "basic"
                    ? "Username:Password"
                    : authType === "bearer"
                    ? "Bearer Token"
                    : authType === "api-key"
                    ? "API Key"
                    : "Authentication"
                }
                value={authValue}
                onChange={(e) => setAuthValue(e.target.value)}
                disabled={authType === "none"}
                placeholder={
                  authType === "basic"
                    ? "user:pass"
                    : authType === "bearer"
                    ? "your-token-here"
                    : authType === "api-key"
                    ? "your-api-key"
                    : ""
                }
              />
            </Grid>
          </Grid>

          {/* Headers */}
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<Code />}>
              <Typography variant="h6">Headers</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {headers.map((header, index) => (
                <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Header Key"
                    value={header.key}
                    onChange={(e) => updateHeader(index, "key", e.target.value)}
                  />
                  <TextField
                    fullWidth
                    placeholder="Header Value"
                    value={header.value}
                    onChange={(e) =>
                      updateHeader(index, "value", e.target.value)
                    }
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeHeader(index)}
                    disabled={headers.length === 1}
                  >
                    <Trash2 />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<Plus />}
                onClick={addHeader}
                sx={{ mt: 1 }}
              >
                Add Header
              </Button>
            </AccordionDetails>
          </Accordion>

          {/* Body */}
          {(method === "POST" || method === "PUT" || method === "PATCH") && (
            <Accordion sx={{ mt: 2 }}>
              <AccordionSummary expandIcon={<Code />}>
                <Typography variant="h6">Request Body</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  placeholder='{"key": "value"}'
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </AccordionDetails>
            </Accordion>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              onClick={sendRequest}
              disabled={loading || !url.trim()}
              startIcon={
                loading ? <RotateCcw className="animate-spin" /> : <Send />
              }
              size="large"
            >
              {loading ? "Sending..." : "Send Request"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={resetForm}
              startIcon={<RotateCcw />}
            >
              Reset
            </Button>
          </Box>
        </Paper>

        {/* Response Section */}
        {response !== null && response !== undefined && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" gutterBottom>
                Response
              </Typography>

              {/* Status */}
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={`Status: ${responseStatus}`}
                  color={
                    responseStatus &&
                    responseStatus >= 200 &&
                    responseStatus < 300
                      ? "success"
                      : "error"
                  }
                />
              </Box>

              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
              >
                <Tab label="Body" />
                <Tab label="Headers" />
              </Tabs>

              <Box sx={{ mt: 2 }}>
                {activeTab === 0 && (
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">Response Body</Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              copyToClipboard(formatJson(response))
                            }
                            startIcon={<Copy />}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              downloadAsText(
                                response,
                                `api-response-${Date.now()}.txt`
                              )
                            }
                            startIcon={<Download />}
                          >
                            Text
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              downloadAsJson(
                                response,
                                `api-response-${Date.now()}.json`
                              )
                            }
                            startIcon={<Download />}
                          >
                            JSON
                          </Button>
                        </Box>
                      </Box>
                      <JsonViewer data={response} />
                    </CardContent>
                  </Card>
                )}

                {activeTab === 1 && (
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">Response Headers</Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              copyToClipboard(formatJson(responseHeaders))
                            }
                            startIcon={<Copy />}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              downloadAsText(
                                responseHeaders,
                                `api-headers-${Date.now()}.txt`
                              )
                            }
                            startIcon={<Download />}
                          >
                            Text
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              downloadAsJson(
                                responseHeaders,
                                `api-headers-${Date.now()}.json`
                              )
                            }
                            startIcon={<Download />}
                          >
                            JSON
                          </Button>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "grey.900",
                          color: "white",
                          p: 2,
                          borderRadius: 1,
                          overflow: "auto",
                          fontSize: "0.875rem",
                          fontFamily: "monospace",
                          height: "400px",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {responseHeaders ? (
                          <div>
                            {Object.entries(responseHeaders).map(
                              ([key, value], _index) => (
                                <div
                                  key={key}
                                  style={{
                                    marginBottom: "4px",
                                    display: "flex",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "#a29bfe",
                                      minWidth: "200px",
                                      display: "inline-block",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {key}:
                                  </span>
                                  <span
                                    style={{
                                      color: "#4ecdc4",
                                      wordBreak: "break-word",
                                    }}
                                  >
                                    {String(value)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#636e72" }}>
                            No headers available
                          </span>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Box>
            </Paper>
          </motion.div>
        )}

        {/* History Section */}
        {history.length > 0 && (
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Request History
            </Typography>
            <Grid container spacing={2}>
              {history.map((item) => (
                <Grid item xs={12} md={6} key={item.id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          label={item.method}
                          size="small"
                          color="primary"
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(item.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ wordBreak: "break-all" }}
                      >
                        {item.url}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<History />}
                        onClick={() => loadFromHistory(item)}
                      >
                        Load
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* AdSense */}
        <AdSense adSlot="3174835314" />

        {/* Information Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600}>
            How It Works
          </Typography>
          <Typography paragraph>
            Test REST APIs directly from your browser. Configure your request
            with custom headers, authentication, and request body. View
            formatted responses with syntax highlighting. All requests are made
            client-side for security and privacy.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mt: 3 }}>
            Supported Features
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>HTTP Methods: GET, POST, PUT, DELETE, PATCH</li>
            <li>Authentication: Basic, Bearer Token, API Key</li>
            <li>Custom Headers</li>
            <li>Request Body for POST/PUT/PATCH</li>
            <li>Response Formatting (JSON, Text)</li>
            <li>Request History</li>
          </Box>
        </Paper>

        {/* AdSense */}
        <AdSense adSlot="6613251015" />
      </motion.div>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ApiTester;
