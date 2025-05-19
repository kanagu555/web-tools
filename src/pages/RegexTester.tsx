import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Grid,
  useTheme,
  Switch,
  FormControlLabel,
  Chip,
  Button,
  Tooltip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Clock,
  AlertCircle,
  Copy,
  Check,
  Trash2,
  Save,
  BookOpen,
  Download,
  Upload,
} from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import { docco, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";

// Register the language
SyntaxHighlighter.registerLanguage("javascript", js);

interface MatchGroup {
  fullMatch: string;
  groups: string[];
  index: number;
  input: string;
}

interface RegexCheatsheetItem {
  pattern: string;
  description: string;
  example: string;
}

const RegexTester = () => {
  const theme = useTheme();
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({
    global: true,
    caseInsensitive: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false,
  });
  const [testText, setTestText] = useState("");
  const [matches, setMatches] = useState<MatchGroup[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("success");
  const [highlightedText, setHighlightedText] = useState("");
  const [savedPatterns, setSavedPatterns] = useState<
    { name: string; pattern: string; flags: typeof flags }[]
  >([]);
  const [patternName, setPatternName] = useState("");
  const [executionTime, setExecutionTime] = useState(0);
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  const textAreaRef = useRef<HTMLDivElement>(null);

  // Load saved patterns from localStorage on component mount
  useEffect(() => {
    const savedPatternsFromStorage = localStorage.getItem("savedRegexPatterns");
    if (savedPatternsFromStorage) {
      try {
        setSavedPatterns(JSON.parse(savedPatternsFromStorage));
      } catch (e) {
        console.error("Failed to parse saved patterns", e);
      }
    }

    window.scrollTo(0, 0);
  }, []);

  // Test regex when pattern, text, or flags change
  useEffect(() => {
    try {
      if (!pattern || !testText) {
        setMatches([]);
        setError("");
        setHighlightedText("");
        return;
      }

      const flagString = [
        flags.global ? "g" : "",
        flags.caseInsensitive ? "i" : "",
        flags.multiline ? "m" : "",
        flags.dotAll ? "s" : "",
        flags.unicode ? "u" : "",
        flags.sticky ? "y" : "",
      ].join("");

      const startTime = performance.now();
      const regex = new RegExp(pattern, flagString);

      // Get all matches with their groups
      const allMatches: MatchGroup[] = [];
      let match;

      if (flags.global) {
        const matchIterator = testText.matchAll(regex);
        for (const m of matchIterator) {
          allMatches.push({
            fullMatch: m[0],
            groups: Array.from(m).slice(1),
            index: m.index || 0,
            input: m.input || "",
          });
        }
      } else {
        match = testText.match(regex);
        if (match) {
          allMatches.push({
            fullMatch: match[0],
            groups: Array.from(match).slice(1),
            index: match.index || 0,
            input: match.input || "",
          });
        }
      }

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setMatches(allMatches);

      // Create highlighted text with matches
      let lastIndex = 0;
      let highlighted = "";

      // Sort matches by index to ensure correct order
      const sortedMatches = [...allMatches].sort((a, b) => a.index - b.index);

      for (const match of sortedMatches) {
        // Add text before match
        highlighted += testText.substring(lastIndex, match.index);
        // Add match with highlight
        highlighted += `<mark>${testText.substring(
          match.index,
          match.index + match.fullMatch.length
        )}</mark>`;
        lastIndex = match.index + match.fullMatch.length;
      }

      // Add remaining text
      highlighted += testText.substring(lastIndex);
      setHighlightedText(highlighted);

      setError("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Invalid regular expression");
      setMatches([]);
      setHighlightedText("");
    }
  }, [pattern, testText, flags]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pattern);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSnackbar("Pattern copied to clipboard", "success");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showSnackbar("Failed to copy pattern", "error");
    }
  };

  const handleClear = () => {
    setPattern("");
    setTestText("");
    setMatches([]);
    setError("");
    setHighlightedText("");
    showSnackbar("Fields cleared", "info");
  };

  const handleSavePattern = () => {
    if (!pattern) {
      showSnackbar("Please enter a pattern to save", "error");
      return;
    }

    const name = patternName.trim() || `Pattern ${savedPatterns.length + 1}`;
    const newPattern = { name, pattern, flags: { ...flags } };
    const updatedPatterns = [...savedPatterns, newPattern];

    setSavedPatterns(updatedPatterns);
    localStorage.setItem("savedRegexPatterns", JSON.stringify(updatedPatterns));
    setPatternName("");
    showSnackbar(`Pattern "${name}" saved successfully`, "success");
  };

  const handleLoadPattern = (index: number) => {
    const savedPattern = savedPatterns[index];
    setPattern(savedPattern.pattern);
    setFlags(savedPattern.flags);
    showSnackbar(`Pattern "${savedPattern.name}" loaded`, "success");
  };

  const handleDeletePattern = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the load pattern action
    const patternName = savedPatterns[index].name;
    const updatedPatterns = savedPatterns.filter((_, i) => i !== index);
    setSavedPatterns(updatedPatterns);
    localStorage.setItem("savedRegexPatterns", JSON.stringify(updatedPatterns));
    showSnackbar(`Pattern "${patternName}" deleted`, "info");
  };

  const handleExportPatterns = () => {
    if (savedPatterns.length === 0) {
      showSnackbar("No patterns to export", "info");
      return;
    }

    const dataStr = JSON.stringify(savedPatterns, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
      dataStr
    )}`;

    const exportFileDefaultName = "regex-patterns.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    showSnackbar("Patterns exported successfully", "success");
  };

  const handleImportPatterns = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedPatterns = JSON.parse(content);

        if (
          Array.isArray(importedPatterns) &&
          importedPatterns.every(
            (p) =>
              typeof p === "object" &&
              typeof p.name === "string" &&
              typeof p.pattern === "string" &&
              typeof p.flags === "object"
          )
        ) {
          setSavedPatterns(importedPatterns);
          localStorage.setItem(
            "savedRegexPatterns",
            JSON.stringify(importedPatterns)
          );
          showSnackbar(
            `Imported ${importedPatterns.length} patterns successfully`,
            "success"
          );
        } else {
          showSnackbar("Invalid pattern format in imported file", "error");
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        showSnackbar("Failed to parse imported file", "error");
      }
    };
    reader.onerror = () => {
      showSnackbar("Error reading file", "error");
    };
    reader.readAsText(file);

    // Reset the input value to allow importing the same file again
    event.target.value = "";
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };

  const generateJavaScriptCode = () => {
    const flagString = [
      flags.global ? "g" : "",
      flags.caseInsensitive ? "i" : "",
      flags.multiline ? "m" : "",
      flags.dotAll ? "s" : "",
      flags.unicode ? "u" : "",
      flags.sticky ? "y" : "",
    ].join("");

    return `// JavaScript Regex Example
const regex = /${pattern}/${flagString};
const text = \`${testText.replace(/`/g, "\\`")}\`;

// Method 1: Using exec() in a loop
let match;
while ((match = regex.exec(text)) !== null) {
  console.log(\`Found \${match[0]} at position \${match.index}\`);
  if (!regex.global) break; // Prevent infinite loops with non-global regex
}

// Method 2: Using match() or matchAll()
${
  flags.global
    ? `const matches = Array.from(text.matchAll(regex));
console.log(\`Found \${matches.length} matches\`);`
    : `const match = text.match(regex);
console.log(match ? \`Found \${match[0]} at position \${match.index}\` : "No match");`
}

// Method 3: Using test() to check if pattern exists
const exists = regex.test(text);
console.log(\`Pattern ${
      flags.global ? "appears" : "exists"
    } in text: \${exists}\`);

// Method 4: Using replace() to highlight matches
const highlighted = text.replace(regex, match => \`<mark>\${match}</mark>\`);`;
  };

  // Regex cheatsheet data
  const regexCheatsheet: RegexCheatsheetItem[] = [
    {
      pattern: ".",
      description: "Any character except newline",
      example: "a.c matches 'abc', 'adc', etc.",
    },
    {
      pattern: "\\w",
      description: "Word character (alphanumeric + underscore)",
      example: "\\w+ matches 'abc123_'",
    },
    {
      pattern: "\\d",
      description: "Digit character (0-9)",
      example: "\\d{3} matches '123'",
    },
    {
      pattern: "\\s",
      description: "Whitespace character",
      example: "a\\sb matches 'a b'",
    },
    {
      pattern: "[abc]",
      description: "Character class (matches a, b, or c)",
      example: "[aeiou] matches any vowel",
    },
    {
      pattern: "[^abc]",
      description: "Negated character class",
      example: "[^0-9] matches any non-digit",
    },
    {
      pattern: "^",
      description: "Start of string or line",
      example: "^Hello matches 'Hello world'",
    },
    {
      pattern: "$",
      description: "End of string or line",
      example: "world$ matches 'Hello world'",
    },
    {
      pattern: "\\b",
      description: "Word boundary",
      example: "\\bword\\b matches 'word' but not 'sword'",
    },
    {
      pattern: "a*",
      description: "0 or more of 'a'",
      example: "ab*c matches 'ac', 'abc', 'abbc', etc.",
    },
    {
      pattern: "a+",
      description: "1 or more of 'a'",
      example: "ab+c matches 'abc', 'abbc', but not 'ac'",
    },
    {
      pattern: "a?",
      description: "0 or 1 of 'a'",
      example: "ab?c matches 'ac' and 'abc'",
    },
    {
      pattern: "a{3}",
      description: "Exactly 3 of 'a'",
      example: "a{3} matches 'aaa'",
    },
    {
      pattern: "a{2,4}",
      description: "2 to 4 of 'a'",
      example: "a{2,4} matches 'aa', 'aaa', 'aaaa'",
    },
    {
      pattern: "a|b",
      description: "a or b",
      example: "cat|dog matches 'cat' or 'dog'",
    },
    {
      pattern: "(abc)",
      description: "Capture group",
      example: "(\\d{3}) captures 3 digits as a group",
    },
    {
      pattern: "(?:abc)",
      description: "Non-capturing group",
      example: "(?:\\d{3}) groups 3 digits without capturing",
    },
    {
      pattern: "(?=abc)",
      description: "Positive lookahead",
      example: "a(?=b) matches 'a' only if followed by 'b'",
    },
    {
      pattern: "(?!abc)",
      description: "Negative lookahead",
      example: "a(?!b) matches 'a' only if not followed by 'b'",
    },
    {
      pattern: "(?<=abc)",
      description: "Positive lookbehind",
      example: "(?<=a)b matches 'b' only if preceded by 'a'",
    },
    {
      pattern: "(?<!abc)",
      description: "Negative lookbehind",
      example: "(?<!a)b matches 'b' only if not preceded by 'a'",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight={700}
            >
              Regex Tester
            </Typography>
            <Typography variant="h6" color="text.secondary" paragraph>
              Test and debug regular expressions with real-time matching.
            </Typography>
          </Box>
          <Box>
            <Tooltip title="View Regex Cheatsheet">
              <Button
                variant="outlined"
                startIcon={<BookOpen size={18} />}
                onClick={() => setShowCheatsheet(!showCheatsheet)}
              >
                Cheatsheet
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {showCheatsheet && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
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
              <Typography variant="h6" fontWeight={600}>
                Regular Expression Cheatsheet
              </Typography>
              <IconButton onClick={() => setShowCheatsheet(false)} size="small">
                <AlertCircle size={18} />
              </IconButton>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="15%">
                      <strong>Pattern</strong>
                    </TableCell>
                    <TableCell width="35%">
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell width="50%">
                      <strong>Example</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {regexCheatsheet.map((item, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Typography fontFamily="monospace">
                          {item.pattern}
                        </Typography>
                      </TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.example}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

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
                      Regular Expression Pattern
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Copy pattern">
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={
                            copied ? <Check size={16} /> : <Copy size={16} />
                          }
                          onClick={handleCopy}
                          disabled={!pattern}
                        >
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </Tooltip>
                      <Tooltip title="Clear all fields">
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<Trash2 size={16} />}
                          onClick={handleClear}
                          disabled={!pattern && !testText}
                        >
                          Clear
                        </Button>
                      </Tooltip>
                    </Box>
                  </Box>
                  <TextField
                    fullWidth
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    error={!!error}
                    helperText={error}
                    placeholder="Enter regex pattern (e.g., \b\w+@\w+\.\w+\b)"
                    sx={{
                      fontFamily: "monospace",
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.default,
                      },
                    }}
                  />
                </Grid>

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
                      Flags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={flags.global}
                            onChange={(e) =>
                              setFlags({ ...flags, global: e.target.checked })
                            }
                          />
                        }
                        label="Global (g)"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={flags.caseInsensitive}
                            onChange={(e) =>
                              setFlags({
                                ...flags,
                                caseInsensitive: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Case Insensitive (i)"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={flags.multiline}
                            onChange={(e) =>
                              setFlags({
                                ...flags,
                                multiline: e.target.checked,
                              })
                            }
                          />
                        }
                        label="Multiline (m)"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={flags.dotAll}
                            onChange={(e) =>
                              setFlags({ ...flags, dotAll: e.target.checked })
                            }
                          />
                        }
                        label="Dot All (s)"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={flags.unicode}
                            onChange={(e) =>
                              setFlags({ ...flags, unicode: e.target.checked })
                            }
                          />
                        }
                        label="Unicode (u)"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={flags.sticky}
                            onChange={(e) =>
                              setFlags({ ...flags, sticky: e.target.checked })
                            }
                          />
                        }
                        label="Sticky (y)"
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                    Test Text
                  </Typography>
                  <TextField
                    multiline
                    fullWidth
                    rows={8}
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    placeholder="Enter text to test against the regex pattern..."
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: theme.palette.background.default,
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Matches
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({matches.length} found)
                    </Typography>
                    {executionTime > 0 && (
                      <Chip
                        icon={<Clock size={14} />}
                        label={`${executionTime.toFixed(2)}ms`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {matches.length > 0 ? (
                    <Box sx={{ mb: 3 }}>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.background.default,
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          Highlighted Text:
                        </Typography>
                        <Box
                          ref={textAreaRef}
                          sx={{
                            p: 2,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: 1,
                            border: `1px solid ${theme.palette.divider}`,
                            maxHeight: "200px",
                            overflow: "auto",
                          }}
                          dangerouslySetInnerHTML={{ __html: highlightedText }}
                        />
                      </Paper>

                      <Typography variant="subtitle2" gutterBottom>
                        Match Details:
                      </Typography>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell width="5%">#</TableCell>
                              <TableCell width="30%">Match</TableCell>
                              <TableCell width="15%">Position</TableCell>
                              <TableCell width="50%">Groups</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {matches.map((match, index) => (
                              <TableRow key={index} hover>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                  <Typography
                                    component="span"
                                    sx={{
                                      fontFamily: "monospace",
                                      backgroundColor:
                                        theme.palette.mode === "dark"
                                          ? "rgba(144, 202, 249, 0.16)"
                                          : "rgba(33, 150, 243, 0.08)",
                                      p: 0.5,
                                      borderRadius: 1,
                                      wordBreak: "break-all",
                                    }}
                                  >
                                    {match.fullMatch}
                                  </Typography>
                                </TableCell>
                                <TableCell>{match.index}</TableCell>
                                <TableCell>
                                  {match.groups.length > 0 ? (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 0.5,
                                      }}
                                    >
                                      {match.groups.map((group, groupIndex) => (
                                        <Chip
                                          key={groupIndex}
                                          label={`${groupIndex + 1}: ${
                                            group || "(empty)"
                                          }`}
                                          size="small"
                                          variant="outlined"
                                          sx={{ fontFamily: "monospace" }}
                                        />
                                      ))}
                                    </Box>
                                  ) : (
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      No capture groups
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No matches found. Try adjusting your pattern or test text.
                    </Typography>
                  )}
                </Grid>

                {/* Add saved patterns section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Save Pattern
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Save size={16} />}
                        onClick={handleSavePattern}
                        disabled={!pattern}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Download size={16} />}
                        onClick={handleExportPatterns}
                        disabled={savedPatterns.length === 0}
                      >
                        Export
                      </Button>
                      <Button
                        component="label"
                        variant="outlined"
                        size="small"
                        startIcon={<Upload size={16} />}
                      >
                        Import
                        <input
                          type="file"
                          accept=".json"
                          hidden
                          onChange={handleImportPatterns}
                        />
                      </Button>
                    </Box>
                  </Box>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Pattern Name"
                        value={patternName}
                        onChange={(e) => setPatternName(e.target.value)}
                        placeholder="Enter a name for this pattern"
                      />
                    </Grid>
                  </Grid>

                  {savedPatterns.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Saved Patterns:
                      </Typography>
                      <Grid container spacing={1}>
                        {savedPatterns.map((savedPattern, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": {
                                  backgroundColor: theme.palette.action.hover,
                                },
                              }}
                              onClick={() => handleLoadPattern(index)}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Typography variant="subtitle2" noWrap>
                                  {savedPattern.name}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleDeletePattern(index, e)}
                                  color="error"
                                >
                                  <Trash2 size={14} />
                                </IconButton>
                              </Box>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontFamily: "monospace",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {savedPattern.pattern}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                  mt: 1,
                                }}
                              >
                                {Object.entries(savedPattern.flags)
                                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                  .filter(([_, value]) => value)
                                  .map(([key]) => (
                                    <Chip
                                      key={key}
                                      label={key.charAt(0)}
                                      size="small"
                                      variant="outlined"
                                    />
                                  ))}
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Grid>

                {/* Add JavaScript code generation section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      JavaScript Code
                    </Typography>
                    <Tooltip title="Copy code">
                      <IconButton
                        size="small"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            generateJavaScriptCode()
                          );
                          showSnackbar("Code copied to clipboard", "success");
                        }}
                        disabled={!pattern}
                      >
                        <Copy size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {pattern ? (
                    <SyntaxHighlighter
                      language="javascript"
                      style={theme.palette.mode === "dark" ? vs2015 : docco}
                      customStyle={{
                        borderRadius: "8px",
                        padding: "16px",
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
                      {generateJavaScriptCode()}
                    </SyntaxHighlighter>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Enter a pattern to generate JavaScript code.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default RegexTester;
