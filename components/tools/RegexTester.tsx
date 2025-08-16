"use client";

/* eslint-disable no-useless-escape */
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
  BookOpen,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

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

  const [highlightedText, setHighlightedText] = useState("");
  const [executionTime, setExecutionTime] = useState(0);
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  const textAreaRef = useRef<HTMLDivElement>(null);

  const emailRegex = "^[w.-]+@[w.-]+.[a-zA-Z]{2,}$";
  const phoneNumberRegex = "^(+d{1,3}[- ]?)?(?d{3})?[- ]?d{3}[- ]?d{4}$";
  const urlValidationRegex =
    "^(https?://)?([da-z.-]+).([a-z.]{2,6})([/w .-]*)*/?$";
  const passwordStrengthRegex =
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!*?&]{8,}$";

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
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      console.error("Clipboard not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(pattern);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleClear = () => {
    setPattern("");
    setTestText("");
    setMatches([]);
    setError("");
    setHighlightedText("");
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

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
                              setFlags({
                                ...flags,
                                unicode: e.target.checked,
                              })
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
                          dangerouslySetInnerHTML={{
                            __html: highlightedText,
                          }}
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
                          if (
                            typeof navigator !== "undefined" &&
                            navigator.clipboard
                          ) {
                            navigator.clipboard.writeText(
                              generateJavaScriptCode()
                            );
                          }
                        }}
                        disabled={!pattern}
                      >
                        <Copy size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  {pattern ? (
                    <Paper
                      sx={{
                        p: 2,
                        backgroundColor: theme.palette.background.default,
                        borderRadius: 2,
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
                      <pre
                        style={{
                          fontFamily: "monospace",
                          fontSize: "13px",
                          lineHeight: "1.5",
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {generateJavaScriptCode()}
                      </pre>
                    </Paper>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Enter a regex pattern to see generated JavaScript code
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        {/* AdSense Ad */}
        <AdSense adSlot="3174835314" />

        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight={700}>
            Understanding Regular Expressions
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              What are Regular Expressions?
            </Typography>
            <Typography variant="body1" paragraph>
              Regular expressions (regex or regexp) are powerful sequences of
              characters that define search patterns. They are used for string
              searching, matching, and text manipulation operations. Regular
              expressions provide a concise and flexible means for identifying
              strings of text, such as particular characters, words, or patterns
              of characters.
            </Typography>
            <Typography variant="body1" paragraph>
              Originally developed in the 1950s by mathematician Stephen Cole
              Kleene, regular expressions have evolved into an essential tool
              for programmers, data analysts, and anyone who works with text
              processing. They are supported in virtually all programming
              languages and many text editors.
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Common Use Cases for Regular Expressions
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Form Validation:</strong> Verifying that user input
                  matches expected formats (email addresses, phone numbers,
                  postal codes, etc.)
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Data Extraction:</strong> Pulling specific information
                  from text documents, logs, or web pages
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Search and Replace:</strong> Finding text patterns and
                  replacing them with alternative content
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Text Parsing:</strong> Breaking down structured text
                  into meaningful components
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Data Cleaning:</strong> Identifying and removing
                  unwanted characters or formatting
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Syntax Highlighting:</strong> Identifying programming
                  language elements for display purposes
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Regular Expression Syntax Explained
            </Typography>
            <Typography variant="body1" paragraph>
              Regular expressions consist of two types of characters: literal
              characters that match themselves, and metacharacters with special
              meanings. Here's a breakdown of the core syntax elements:
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Basic Metacharacters:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Box component="li">
                  <Typography variant="body1">
                    <code>.</code> - Matches any single character except newline
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>^</code> - Matches the start of a string/line
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>$</code> - Matches the end of a string/line
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>|</code> - Acts as an OR operator (a|b matches a or b)
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Character Classes:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Box component="li">
                  <Typography variant="body1">
                    <code>[abc]</code> - Matches any character in the set
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>[^abc]</code> - Matches any character not in the set
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>[a-z]</code> - Matches any character in the range
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>\w</code> - Matches word characters (alphanumeric +
                    underscore)
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>\d</code> - Matches digits (0-9)
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>\s</code> - Matches whitespace characters
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Quantifiers:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Box component="li">
                  <Typography variant="body1">
                    <code>*</code> - Matches 0 or more occurrences
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>+</code> - Matches 1 or more occurrences
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>?</code> - Matches 0 or 1 occurrence
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>{"{n}"}</code> - Matches exactly n occurrences
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>{"{n,}"}</code> - Matches n or more occurrences
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body1">
                    <code>{"{n,m}"}</code> - Matches between n and m occurrences
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              mb: 3,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Practical Regex Examples
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Email Validation:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      wordBreak: "break-all",
                      mb: 1,
                    }}
                  >
                    {emailRegex}
                  </Box>
                  <Typography variant="body2">
                    Validates common email address formats, ensuring they have a
                    username, @ symbol, domain, and TLD.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Phone Number Format:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      wordBreak: "break-all",
                      mb: 1,
                    }}
                  >
                    {phoneNumberRegex}
                  </Box>
                  <Typography variant="body2">
                    Matches various phone number formats including international
                    codes, parentheses, and separators.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    URL Validation:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      wordBreak: "break-all",
                      mb: 1,
                    }}
                  >
                    {urlValidationRegex}
                  </Box>
                  <Typography variant="body2">
                    Validates URLs with optional protocol, domain name, TLD, and
                    path components.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Password Strength Check:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: theme.palette.background.default,
                      borderRadius: 1,
                      fontFamily: "monospace",
                      fontSize: "0.875rem",
                      wordBreak: "break-all",
                      mb: 1,
                    }}
                  >
                    {passwordStrengthRegex}
                  </Box>
                  <Typography variant="body2">
                    Ensures a password has at least 8 characters, one uppercase
                    letter, one lowercase letter, one number, and one special
                    character.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Regular Expression Best Practices
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Start Simple:</strong> Begin with a basic pattern and
                  incrementally add complexity as needed.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Test Thoroughly:</strong> Always test your regex
                  against various inputs, including edge cases and invalid data.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Use Non-Capturing Groups:</strong> When you don't need
                  to extract the matched content, use non-capturing groups{" "}
                  <code>(?:pattern)</code> for better performance.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Be Specific:</strong> Make your patterns as specific
                  as possible to avoid unintended matches.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Consider Performance:</strong> Complex patterns with
                  excessive backtracking can lead to performance issues. Use
                  atomic groups and possessive quantifiers when appropriate.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Document Your Regex:</strong> Complex regular
                  expressions should be documented to explain their purpose and
                  how they work.
                </Typography>
              </Box>
              <Box component="li">
                <Typography variant="body1">
                  <strong>Consider Readability:</strong> Use the /x flag (in
                  languages that support it) to write more readable patterns
                  with comments and whitespace.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* AdSense Ad */}
        <AdSense adSlot="6613251015" />
      </motion.div>
    </Container>
  );
};

export default RegexTester;
