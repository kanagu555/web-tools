"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import {
  Code,
  Copy,
  ClipboardPaste,
  Trash2,
  Upload,
  Download,
  RotateCw,
  Check,
  FileJson,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

const XmlToJsonConverter = () => {
  const theme = useTheme();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [xmlStats, setXmlStats] = useState<{
    size: string;
    elements: number;
    attributes: number;
  } | null>(null);

  // Convert XML when component mounts if there's input in URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const xmlParam = params.get("xml");

      if (xmlParam) {
        try {
          const decodedXml = decodeURIComponent(xmlParam);
          setInput(decodedXml);
          convertXmlToJson(decodedXml);
        } catch (err) {
          console.error("Failed to parse XML from URL", err);
        }
      }
    }
  }, []);

  // XML to JSON conversion function
  const convertXmlToJson = (xmlToConvert = input) => {
    try {
      if (xmlToConvert.trim() === "") {
        setOutput("");
        setError("");
        setXmlStats(null);
        return;
      }

      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlToConvert, "text/xml");

      // Check for parsing errors
      const parserError = xmlDoc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
        throw new Error("Invalid XML format: " + parserError[0].textContent);
      }

      // Convert XML to JSON
      const jsonResult = xmlToJson(xmlDoc);

      // Format the JSON output
      const formatted = JSON.stringify(jsonResult, null, indentSize);
      setOutput(formatted);
      setError("");

      // Calculate XML stats
      calculateXmlStats(xmlDoc);

      // Show success message
      showSnackbar("XML converted to JSON successfully", "success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid XML format");
      setOutput("");
      setXmlStats(null);
    }
  };

  // Helper function to convert XML DOM to JSON
  const xmlToJson = (xml: Document | Element): any => {
    const obj: any = {};

    if (xml.nodeType === 1) {
      // Element node
      const element = xml as Element;

      // Handle attributes
      if (element.attributes && element.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < element.attributes.length; j++) {
          const attribute = element.attributes.item(j);
          if (attribute) {
            obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
          }
        }
      }

      // Handle child nodes
      if (element.hasChildNodes()) {
        let textContent = "";
        const childElements: { [key: string]: any } = {};

        for (let i = 0; i < element.childNodes.length; i++) {
          const item = element.childNodes.item(i);
          if (!item) continue;

          if (item.nodeType === 3) {
            // Text node
            const text = item.nodeValue?.trim();
            if (text) {
              textContent += text;
            }
          } else if (item.nodeType === 1) {
            // Element node
            const nodeName = item.nodeName;
            const childResult = xmlToJson(item as Element);

            if (typeof childElements[nodeName] === "undefined") {
              childElements[nodeName] = childResult;
            } else {
              if (!Array.isArray(childElements[nodeName])) {
                const old = childElements[nodeName];
                childElements[nodeName] = [old];
              }
              childElements[nodeName].push(childResult);
            }
          }
        }

        // If we have both text content and child elements
        if (textContent && Object.keys(childElements).length > 0) {
          obj["#text"] = textContent;
          Object.assign(obj, childElements);
        } else if (textContent) {
          // Only text content, return it directly if no attributes
          if (!obj["@attributes"]) {
            return textContent;
          }
          obj["#text"] = textContent;
        } else {
          // Only child elements
          Object.assign(obj, childElements);
        }
      }
    }

    // If it's the document, return the root element
    if (xml.nodeType === 9) {
      // Document node
      const doc = xml as Document;
      if (doc.documentElement) {
        const rootName = doc.documentElement.nodeName;
        return { [rootName]: xmlToJson(doc.documentElement) };
      }
    }

    return obj;
  };

  const minifyJson = () => {
    try {
      if (output.trim() === "") {
        showSnackbar("No JSON to minify", "warning");
        return;
      }

      const parsed = JSON.parse(output);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      showSnackbar("JSON minified successfully", "success");
    } catch (err) {
      showSnackbar("Failed to minify JSON", "error");
    }
  };

  const calculateXmlStats = (xmlDoc: Document) => {
    // Calculate size in KB
    const xmlString = new XMLSerializer().serializeToString(xmlDoc);
    const size =
      (new TextEncoder().encode(xmlString).length / 1024).toFixed(2) + " KB";

    // Count elements
    const elements = xmlDoc.getElementsByTagName("*").length;

    // Count attributes
    let attributes = 0;
    const allElements = xmlDoc.getElementsByTagName("*");
    for (let i = 0; i < allElements.length; i++) {
      attributes += allElements[i].attributes.length;
    }

    setXmlStats({ size, elements, attributes });
  };

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      showSnackbar("Clipboard not available", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSnackbar("Copied to clipboard", "success");
    } catch (err) {
      showSnackbar("Failed to copy to clipboard", "error");
    }
  };

  const handlePaste = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      showSnackbar("Clipboard not available. Please paste manually.", "error");
      return;
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      setInput(clipboardText);
      showSnackbar("Pasted from clipboard", "success");
    } catch (err) {
      showSnackbar("Failed to read from clipboard", "error");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setXmlStats(null);
    showSnackbar("Cleared all content", "info");
  };

  const handleDownload = () => {
    if (!output) {
      showSnackbar("No JSON to download", "warning");
      return;
    }

    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showSnackbar("JSON file downloaded", "success");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setInput(content);
      showSnackbar(`File "${file.name}" loaded successfully`, "success");
    };
    reader.onerror = () => {
      showSnackbar("Error reading file", "error");
    };
    reader.readAsText(file);
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

  const handleReset = () => {
    setInput("");
    setOutput("");
    setError("");
    setXmlStats(null);
    showSnackbar("Reset successful", "success");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          XML to JSON Converter
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Convert XML data to JSON format with validation and formatting.
        </Typography>

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
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<Code />}
                  onClick={() => convertXmlToJson()}
                >
                  Convert
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileJson />}
                  onClick={minifyJson}
                  disabled={!output}
                >
                  Minify JSON
                </Button>

                <Tooltip title="Upload XML file">
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<Upload />}
                  >
                    Upload
                    <input
                      type="file"
                      accept=".xml,.txt"
                      hidden
                      onChange={handleFileUpload}
                    />
                  </Button>
                </Tooltip>

                <Tooltip title="Download JSON">
                  <Button
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleDownload}
                    disabled={!output}
                  >
                    Download
                  </Button>
                </Tooltip>

                <Tooltip title="Reset Form">
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<RotateCw />}
                    onClick={handleReset}
                    disabled={!input}
                  >
                    Reset
                  </Button>
                </Tooltip>

                <Box sx={{ flexGrow: 1 }} />

                <FormControl size="small" sx={{ width: 120 }}>
                  <InputLabel>Indent</InputLabel>
                  <Select
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    label="Indent"
                  >
                    <MenuItem value={2}>2 spaces</MenuItem>
                    <MenuItem value={4}>4 spaces</MenuItem>
                    <MenuItem value={8}>8 spaces</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  height: "32px",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Input XML
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
                      disabled={!input}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={20}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                error={!!error}
                helperText={error}
                placeholder="Paste your XML here..."
                sx={{
                  fontFamily: "monospace",
                  height: "520px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                    height: "100%",
                    alignItems: "flex-start",
                  },
                  "& .MuiOutlinedInput-input": {
                    height: "100% !important",
                    overflow: "auto !important",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                  height: "32px",
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  JSON Output
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={copied ? <Check size={16} /> : <Copy size={16} />}
                  onClick={handleCopy}
                  disabled={!output}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Box>
              <TextField
                multiline
                fullWidth
                rows={20}
                value={output}
                InputProps={{ readOnly: true }}
                sx={{
                  fontFamily: "monospace",
                  height: "520px",
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: theme.palette.background.default,
                    height: "100%",
                    alignItems: "flex-start",
                  },
                  "& .MuiOutlinedInput-input": {
                    height: "100% !important",
                    overflow: "auto !important",
                  },
                }}
              />
            </Grid>

            {xmlStats && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4, mt: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Size
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {xmlStats.size}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Elements
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {xmlStats.elements}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Attributes
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {xmlStats.attributes}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="3174835314" />

        {/* SEO-friendly content section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About Our XML to JSON Converter
          </Typography>
          <Typography paragraph>
            Our free online XML to JSON converter provides a simple and
            convenient way to transform XML data into JSON format directly in
            your browser. Whether you need to migrate data between systems, work
            with APIs, or convert configuration files, this tool handles the
            conversion process seamlessly while preserving data structure and
            relationships.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Features of Our XML to JSON Converter
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>
              Convert XML to JSON with customizable indentation (2, 4, or 8
              spaces)
            </li>
            <li>Preserve XML attributes in JSON format</li>
            <li>Validate XML syntax and structure before conversion</li>
            <li>View XML statistics (size, elements, attributes)</li>
            <li>Upload and download XML/JSON files</li>
            <li>Copy converted JSON to clipboard</li>
            <li>Minify JSON output for production use</li>
            <li>Handle nested XML elements and complex structures</li>
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            How to Use the XML to JSON Converter
          </Typography>
          <Typography paragraph>
            Using our XML to JSON converter is straightforward. Simply paste
            your XML data into the input field, then click the "Convert" button
            to transform it into JSON format. You can choose your preferred
            indentation level for the output. The tool also allows you to upload
            XML files, download the converted JSON result, and provides helpful
            statistics about your XML data structure.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            What is XML?
          </Typography>
          <Typography paragraph>
            XML (eXtensible Markup Language) is a markup language that defines a
            set of rules for encoding documents in a format that is both
            human-readable and machine-readable. XML is widely used for data
            storage and transport, configuration files, web services, and
            document formats. It uses a tree structure with nested elements and
            supports attributes for additional metadata.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Why Convert XML to JSON?
          </Typography>
          <Typography paragraph>
            Converting XML to JSON is often necessary when working with modern
            web applications and APIs that primarily use JSON. JSON is lighter,
            easier to parse in JavaScript, and has become the standard for web
            APIs. Converting XML to JSON allows you to integrate legacy XML data
            with modern systems, reduce data payload sizes, and work with more
            developer-friendly data formats.
          </Typography>

          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            sx={{ mt: 2 }}
          >
            Common Use Cases for XML to JSON Conversion
          </Typography>
          <Typography paragraph>
            Our XML to JSON converter tool is valuable for many scenarios,
            including:
          </Typography>
          <Typography component="ul" sx={{ pl: 2 }}>
            <li>Migrating data from XML-based systems to JSON-based APIs</li>
            <li>Converting configuration files for modern applications</li>
            <li>Transforming SOAP web service responses to REST JSON format</li>
            <li>Processing RSS feeds and XML sitemaps for web applications</li>
            <li>Converting database exports from XML to JSON format</li>
            <li>
              Integrating legacy XML data with modern JavaScript frameworks
            </li>
            <li>Preparing XML data for NoSQL databases that prefer JSON</li>
            <li>Converting XML documentation to JSON for API specifications</li>
          </Typography>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="6613251015" />
      </motion.div>

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

export default XmlToJsonConverter;
