import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Hash,
  Copy,
  Check,
  Upload,
  FileText,
  Trash2,
  Info,
  AlertTriangle,
  RefreshCw,
  Download,
} from "lucide-react";
import { Helmet } from "react-helmet";
import AdSense from "../components/AdSense";
import Breadcrumb from "../components/Breadcrumb";

interface HashHistory {
  input: string;
  output: string;
  algorithm: HashAlgorithm;
  timestamp: number;
}

type HashAlgorithm =
  | "md5"
  | "sha1"
  | "sha256"
  | "sha384"
  | "sha512"
  | "sha3-256"
  | "sha3-512"
  | "blake2b"
  | "blake3";

const HashGenerator = () => {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State variables
  const [input, setInput] = useState("");
  const [hashType, setHashType] = useState<HashAlgorithm>("sha256");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [tabValue, setTabValue] = useState(0); // 0 for text, 1 for file
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [expectedHash, setExpectedHash] = useState("");
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [history, setHistory] = useState<HashHistory[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [upperCase, setUpperCase] = useState(false);

  // Load history from localStorage on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
    const savedHistory = localStorage.getItem("hashGeneratorHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse history from localStorage", error);
      }
    }
  }, []);

  // Breadcrumb items for UI component
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Developer Tools", url: "/category/developer" },
    { name: "Hash Generator" },
  ];

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("hashGeneratorHistory", JSON.stringify(history));
  }, [history]);

  // Check for hash comparison match when either output or expected hash changes
  useEffect(() => {
    if (compareMode && output && expectedHash) {
      const normalizedOutput = upperCase
        ? output.toUpperCase()
        : output.toLowerCase();
      const normalizedExpected = upperCase
        ? expectedHash.toUpperCase()
        : expectedHash.toLowerCase();
      setIsMatch(normalizedOutput === normalizedExpected);
    }
  }, [output, expectedHash, compareMode, upperCase]);

  const generateHash = async () => {
    if ((!input && tabValue === 0) || (tabValue === 1 && !fileName)) return;

    setIsProcessing(true);
    try {
      let hashBuffer: ArrayBuffer;
      let data: Uint8Array;

      if (tabValue === 0) {
        // Text input
        const encoder = new TextEncoder();
        data = encoder.encode(input);
      } else {
        // File input - we already have the file data from handleFileUpload
        if (!fileInputRef.current?.files?.[0]) {
          throw new Error("No file selected");
        }
        data = await fileInputRef.current.files[0]
          .arrayBuffer()
          .then((buffer) => new Uint8Array(buffer));
      }

      switch (hashType) {
        case "md5":
          // MD5 is not supported by Web Crypto API
          showSnackbar(
            "MD5 not supported in browser - use SHA-256 instead",
            "warning"
          );
          setOutput("MD5 not supported in browser - use SHA-256 instead");
          return;
        case "sha1":
          hashBuffer = await crypto.subtle.digest("SHA-1", data);
          break;
        case "sha256":
          hashBuffer = await crypto.subtle.digest("SHA-256", data);
          break;
        case "sha384":
          hashBuffer = await crypto.subtle.digest("SHA-384", data);
          break;
        case "sha512":
          hashBuffer = await crypto.subtle.digest("SHA-512", data);
          break;
        case "sha3-256":
        case "sha3-512":
        case "blake2b":
        case "blake3":
          // These algorithms are not natively supported in Web Crypto API
          showSnackbar(
            `${hashType} is not supported in browser - use SHA-256 instead`,
            "warning"
          );
          setOutput(
            `${hashType} not supported in browser - use SHA-256 instead`
          );
          return;
        default:
          hashBuffer = await crypto.subtle.digest("SHA-256", data);
      }

      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const formattedHash = upperCase ? hashHex.toUpperCase() : hashHex;
      setOutput(formattedHash);

      // Add to history
      const newHistoryItem: HashHistory = {
        input: tabValue === 0 ? input : fileName,
        output: formattedHash,
        algorithm: hashType,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]); // Keep only last 20 items

      // Check for match if in compare mode
      if (compareMode && expectedHash) {
        const normalizedOutput = upperCase
          ? formattedHash.toUpperCase()
          : formattedHash.toLowerCase();
        const normalizedExpected = upperCase
          ? expectedHash.toUpperCase()
          : expectedHash.toLowerCase();
        const matches = normalizedOutput === normalizedExpected;
        setIsMatch(matches);
        showSnackbar(
          matches
            ? "Hash verification successful! Hashes match."
            : "Hash verification failed! Hashes do not match.",
          matches ? "success" : "error"
        );
      } else {
        showSnackbar("Hash generated successfully", "success");
      }
    } catch (error) {
      console.error("Error generating hash:", error);
      setOutput("Error generating hash");
      showSnackbar("Error generating hash", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(file.size);
      // The actual file data will be read in generateHash
    } else {
      setFileName("");
      setFileSize(0);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    showSnackbar("Hash copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setOutput(""); // Clear output when switching tabs
    setIsMatch(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setFileName("");
    setFileSize(0);
    setExpectedHash("");
    setIsMatch(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      setIsMatch(null);
    }
  };

  const downloadHash = () => {
    if (!output) return;

    const element = document.createElement("a");
    const file = new Blob([output], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${hashType}_hash.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showSnackbar("Hash downloaded", "success");
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>
          Hash Generator - Generate MD5, SHA-1, SHA-256, SHA-512 Hashes
        </title>
        <meta
          name="description"
          content="Generate cryptographic hashes (MD5, SHA-1, SHA-256, SHA-512) for text or files. Verify data integrity and security with our free online hash generator tool."
        />
        <meta
          name="keywords"
          content="hash generator, MD5, SHA-1, SHA-256, SHA-512, cryptographic hash, file hash, text hash, hash verification, data integrity"
        />
        <meta
          property="og:title"
          content="Hash Generator - Generate MD5, SHA-1, SHA-256, SHA-512 Hashes"
        />
        <meta
          property="og:description"
          content="Generate cryptographic hashes for text or files. Verify data integrity and security with our free online hash generator tool."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://kodekit.in/tools/hash-generator"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Hash Generator - Generate MD5, SHA-1, SHA-256, SHA-512 Hashes"
        />
        <meta
          name="twitter:description"
          content="Generate cryptographic hashes for text or files. Verify data integrity and security."
        />
        <link rel="canonical" href="https://kodekit.in/tools/hash-generator" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <Breadcrumb items={breadcrumbItems} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Hash Generator
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary" paragraph>
            Generate cryptographic hashes for text or files to verify data
            integrity and security.
          </Typography>

          <Typography variant="body1" paragraph>
            A hash function is a mathematical algorithm that converts data of
            any size into a fixed-size output. Hash functions are commonly used
            for data integrity verification, password storage, digital
            signatures, and more.
          </Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Info size={18} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    Data Integrity
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Verify file integrity by comparing hash values before and
                  after file transfer or storage.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AlertTriangle size={18} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    Security
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Ensure downloaded files haven't been tampered with by
                  comparing their hash with the official hash.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <RefreshCw size={18} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ ml: 1 }}
                  >
                    Uniqueness
                  </Typography>
                </Box>
                <Typography variant="body2">
                  Even a small change in the input produces a completely
                  different hash output, making it ideal for detecting changes.
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
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 900,
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
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Hash Algorithm
                </Typography>
                <Box>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={upperCase}
                        onChange={(e) => setUpperCase(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Uppercase"
                    sx={{ mr: 0 }}
                  />
                </Box>
              </Box>
              <Select
                fullWidth
                value={hashType}
                onChange={(e) => setHashType(e.target.value as HashAlgorithm)}
              >
                <MenuItem value="md5">
                  MD5 (128-bit) - Not recommended for security
                </MenuItem>
                <MenuItem value="sha1">
                  SHA-1 (160-bit) - Not recommended for security
                </MenuItem>
                <MenuItem value="sha256">
                  SHA-256 (256-bit) - Recommended
                </MenuItem>
                <MenuItem value="sha384">SHA-384 (384-bit)</MenuItem>
                <MenuItem value="sha512">
                  SHA-512 (512-bit) - Highest security
                </MenuItem>
                <MenuItem disabled value="sha3-256">
                  SHA3-256 (256-bit) - Not supported in browser
                </MenuItem>
                <MenuItem disabled value="sha3-512">
                  SHA3-512 (512-bit) - Not supported in browser
                </MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Text Input" />
                <Tab label="File Input" />
              </Tabs>

              {tabValue === 0 ? (
                <>
                  <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                    Input Text
                  </Typography>
                  <TextField
                    multiline
                    fullWidth
                    rows={6}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter text to hash..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.default,
                      },
                    }}
                  />
                </>
              ) : (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <Box
                    sx={{
                      border: `2px dashed ${theme.palette.divider}`,
                      borderRadius: 2,
                      p: 3,
                      textAlign: "center",
                      backgroundColor: theme.palette.background.default,
                      cursor: "pointer",
                    }}
                    onClick={triggerFileInput}
                  >
                    <Upload
                      size={40}
                      style={{ opacity: 0.7, marginBottom: 8 }}
                    />
                    <Typography variant="subtitle1" gutterBottom>
                      {fileName ? "Change File" : "Select File to Hash"}
                    </Typography>
                    {fileName && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          icon={<FileText size={16} />}
                          label={
                            <Typography variant="body2">
                              {fileName} ({formatFileSize(fileSize)})
                            </Typography>
                          }
                          onDelete={() => {
                            setFileName("");
                            setFileSize(0);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          sx={{ maxWidth: "100%" }}
                        />
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Grid>

            {compareMode && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                  Expected Hash (for verification)
                </Typography>
                <TextField
                  fullWidth
                  value={expectedHash}
                  onChange={(e) => setExpectedHash(e.target.value)}
                  placeholder="Paste expected hash for comparison..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.default,
                    },
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={generateHash}
                  disabled={
                    (!input && tabValue === 0) ||
                    (tabValue === 1 && !fileName) ||
                    isProcessing
                  }
                  startIcon={<Hash />}
                  size="large"
                >
                  {isProcessing ? "Generating..." : "Generate Hash"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={toggleCompareMode}
                  startIcon={compareMode ? <Hash /> : <Hash />}
                >
                  {compareMode ? "Cancel Comparison" : "Compare Hash"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearAll}
                  startIcon={<Trash2 />}
                  color="error"
                  disabled={
                    (!input && tabValue === 0) ||
                    (tabValue === 1 && !fileName) ||
                    isProcessing
                  }
                >
                  Clear All
                </Button>
              </Box>
            </Grid>

            {output && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600}>
                    Hash Output ({hashType.toUpperCase()})
                    {isMatch !== null && compareMode && (
                      <Chip
                        size="small"
                        label={isMatch ? "Match" : "No Match"}
                        color={isMatch ? "success" : "error"}
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Typography>
                  <Box>
                    <Tooltip title="Copy to Clipboard">
                      <IconButton
                        onClick={handleCopy}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Hash">
                      <IconButton onClick={downloadHash} size="small">
                        <Download size={18} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <TextField
                  multiline
                  fullWidth
                  rows={3}
                  value={output}
                  InputProps={{ readOnly: true }}
                  sx={{
                    fontFamily: "monospace",
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme.palette.background.default,
                      ...(isMatch !== null &&
                        compareMode && {
                          borderColor: isMatch ? "success.main" : "error.main",
                          borderWidth: 2,
                        }),
                    },
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Paper>

        <AdSense adSlot="6613251015" />

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </motion.div>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
          About Hash Functions
        </Typography>
        <Typography variant="body1" paragraph>
          Hash functions are essential cryptographic tools that convert data of
          any size into a fixed-size string of characters. They are designed to
          be one-way functions, meaning it's practically impossible to reverse
          the process and obtain the original data from the hash.
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Common Hash Algorithms
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>SHA-256:</strong> Part of the SHA-2 family, it produces a
              256-bit (32-byte) hash value. It's widely used for data integrity
              verification and is considered secure for most applications.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>SHA-512:</strong> Produces a 512-bit hash value, offering
              even greater security than SHA-256. Recommended for highly
              sensitive applications.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>MD5:</strong> Produces a 128-bit hash value. It's no
              longer considered secure for cryptographic purposes due to
              vulnerabilities, but is still used for checksums and data
              verification.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>SHA-1:</strong> Produces a 160-bit hash value. Like MD5,
              it's no longer considered secure for cryptographic purposes but is
              still used in some legacy systems.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Use Cases
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Data Integrity:</strong> Verify that files haven't been
              corrupted during transfer or storage by comparing hash values.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Password Storage:</strong> Securely store password hashes
              instead of plaintext passwords in databases.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Digital Signatures:</strong> Verify the authenticity and
              integrity of digital documents and software.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Blockchain Technology:</strong> Hash functions are
              fundamental to blockchain technology and cryptocurrencies.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Data Deduplication:</strong> Identify duplicate data by
              comparing hash values instead of the entire content.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HashGenerator;
