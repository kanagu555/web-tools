"use client";

import { useState, useCallback } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  useTheme,
  TextField,
  Grid,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  RefreshCw,
  TrendingUp,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface IndexOption {
  label: string;
  symbol: string;
}

interface HistoricalRow {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const INDEX_OPTIONS: IndexOption[] = [
  { label: "NIFTY 50", symbol: "^NSEI" },
  { label: "SENSEX", symbol: "^BSESN" },
  { label: "NIFTY BANK", symbol: "^NSEBANK" },
  { label: "NIFTY IT", symbol: "^CNXIT" },
  { label: "NIFTY MIDCAP 100", symbol: "NIFTY_MIDCAP_100.NS" },
  { label: "S&P 500", symbol: "^GSPC" },
  { label: "NASDAQ", symbol: "^IXIC" },
  { label: "DOW JONES", symbol: "^DJI" },
  { label: "FTSE 100", symbol: "^FTSE" },
  { label: "NIKKEI 225", symbol: "^N225" },
];

type RangeKey = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "Custom";

const RANGE_MAP: Record<
  Exclude<RangeKey, "Custom">,
  { range: string; interval: string }
> = {
  "1D": { range: "2d", interval: "1d" },
  "1W": { range: "5d", interval: "1d" },
  "1M": { range: "1mo", interval: "1d" },
  "3M": { range: "3mo", interval: "1d" },
  "6M": { range: "6mo", interval: "1d" },
  "1Y": { range: "1y", interval: "1d" },
};

function formatDate(ts: number): string {
  const d = new Date(ts * 1000);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatNumber(n: number | null | undefined, decimals = 2): string {
  if (n == null || isNaN(n)) return "-";
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatVolume(n: number | null | undefined): string {
  if (n == null || isNaN(n)) return "-";
  return n.toLocaleString("en-IN");
}

export default function HistoricalIndexData() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [selectedIndex, setSelectedIndex] = useState<IndexOption>(
    INDEX_OPTIONS[0],
  );
  const [activeRange, setActiveRange] = useState<RangeKey | null>(null);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [rows, setRows] = useState<HistoricalRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = useCallback(
    async (range: RangeKey, index: IndexOption) => {
      setLoading(true);
      setError("");
      setRows([]);

      try {
        let apiUrl = "";

        if (range === "Custom") {
          if (!customFrom || !customTo) {
            setError("Please select both From and To dates.");
            setLoading(false);
            return;
          }
          const period1 = Math.floor(new Date(customFrom).getTime() / 1000);
          const period2 =
            Math.floor(new Date(customTo).getTime() / 1000) + 86400;
          apiUrl = `/api/historical-index?symbol=${encodeURIComponent(
            index.symbol,
          )}&interval=1d&period1=${period1}&period2=${period2}&useCustom=true`;
        } else {
          const { range: r, interval } = RANGE_MAP[range];
          apiUrl = `/api/historical-index?symbol=${encodeURIComponent(
            index.symbol,
          )}&interval=${interval}&range=${r}`;
        }

        const res = await fetch(apiUrl);
        const json = await res.json();

        if (json.error) throw new Error(json.error);

        const result = json?.chart?.result?.[0];
        if (!result) throw new Error("No data returned.");

        const timestamps: number[] = result.timestamp ?? [];
        const quote = result.indicators?.quote?.[0] ?? {};
        const opens: number[] = quote.open ?? [];
        const highs: number[] = quote.high ?? [];
        const lows: number[] = quote.low ?? [];
        const closes: number[] = quote.close ?? [];
        const volumes: number[] = quote.volume ?? [];

        const parsed: HistoricalRow[] = timestamps
          .map((ts, i) => ({
            date: formatDate(ts),
            open: opens[i],
            high: highs[i],
            low: lows[i],
            close: closes[i],
            volume: volumes[i],
          }))
          .filter((r) => r.close != null)
          .reverse();

        if (parsed.length === 0)
          throw new Error("No trading data available for this range.");

        setRows(parsed);
        setHasFetched(true);

        const last = parsed[0]?.date ?? "";
        const first = parsed[parsed.length - 1]?.date ?? "";
        setDateLabel(`Data for ${index.label} – from ${first} to ${last}`);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    },
    [customFrom, customTo],
  );

  const handleRangeClick = (range: RangeKey) => {
    setActiveRange(range);
    if (range !== "Custom") {
      fetchData(range, selectedIndex);
    }
  };

  const handleIndexChange = (symbol: string) => {
    const idx =
      INDEX_OPTIONS.find((o) => o.symbol === symbol) ?? INDEX_OPTIONS[0];
    setSelectedIndex(idx);
    if (activeRange && activeRange !== "Custom") {
      fetchData(activeRange, idx);
    }
  };

  const handleClear = () => {
    setRows([]);
    setError("");
    setDateLabel("");
    setHasFetched(false);
    setActiveRange(null);
    setCustomFrom("");
    setCustomTo("");
  };

  const downloadCSV = () => {
    if (!rows.length) return;
    const headers = ["Date", "Open", "High", "Low", "Close", "Volume"];
    const csvRows = [
      headers.join(","),
      ...rows.map((r) =>
        [
          r.date,
          r.open?.toFixed(2) ?? "",
          r.high?.toFixed(2) ?? "",
          r.low?.toFixed(2) ?? "",
          r.close?.toFixed(2) ?? "",
          r.volume ?? "",
        ].join(","),
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedIndex.label.replace(/\s+/g, "_")}_historical_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rangeButtons: RangeKey[] = [
    "1D",
    "1W",
    "1M",
    "3M",
    "6M",
    "1Y",
    "Custom",
  ];

  const headerBg = isDark ? "#1a237e" : "#1a237e";
  const headerText = "#ffffff";

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Page Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Typography
              variant="h1"
              component="h1"
              fontWeight={700}
              sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}
            >
              Historical Index Data
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            View historical OHLCV data for major stock market indices. Select an
            index, choose a time range, and download the data as CSV.
          </Typography>
        </Box>

        <AdSense adSlot="4201858400" />

        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
          }}
        >
          {/* Controls */}
          <Box
            sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            {/* Index Selector */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 2.5,
                flexWrap: "wrap",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 50 }}
              >
                Index :
              </Typography>
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <Select
                  value={selectedIndex.symbol}
                  onChange={(e) => handleIndexChange(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  {INDEX_OPTIONS.map((opt) => (
                    <MenuItem key={opt.symbol} value={opt.symbol}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Range Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {rangeButtons.map((r) => (
                <Button
                  key={r}
                  variant={activeRange === r ? "contained" : "outlined"}
                  size="small"
                  onClick={() => handleRangeClick(r)}
                  sx={{
                    borderRadius: 5,
                    minWidth: 48,
                    fontWeight: 600,
                    textTransform: "none",
                    ...(activeRange === r
                      ? { bgcolor: theme.palette.primary.main }
                      : { borderColor: theme.palette.divider }),
                  }}
                >
                  {r}
                </Button>
              ))}
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={handleClear}
                sx={{ borderRadius: 5, textTransform: "none", fontWeight: 600 }}
              >
                Clear
              </Button>
            </Box>

            {/* Custom Date Range */}
            <AnimatePresence>
              {activeRange === "Custom" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 2,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      label="From"
                      type="date"
                      size="small"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ minWidth: 160 }}
                    />
                    <TextField
                      label="To"
                      type="date"
                      size="small"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ minWidth: 160 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => fetchData("Custom", selectedIndex)}
                      disabled={!customFrom || !customTo}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      Fetch Data
                    </Button>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Data Label + Download */}
          {(dateLabel || rows.length > 0) && (
            <Box
              sx={{
                px: 3,
                py: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
                borderBottom: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="body2"
                color="primary"
                fontWeight={600}
                fontStyle="italic"
              >
                {dateLabel}
              </Typography>
              {rows.length > 0 && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<FileSpreadsheet size={16} color="#e53935" />}
                  onClick={downloadCSV}
                  sx={{
                    color: "#e53935",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Download (.csv)
                </Button>
              )}
            </Box>
          )}

          {/* Loading */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error */}
          {error && !loading && (
            <Box sx={{ p: 3 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          {/* Empty state */}
          {!loading && !error && !hasFetched && (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Typography color="text.secondary">
                Select an index and time range to view historical data.
              </Typography>
            </Box>
          )}

          {/* Table */}
          {!loading && rows.length > 0 && (
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {["DATE", "OPEN", "HIGH", "LOW", "CLOSE", "VOLUME"].map(
                      (col) => (
                        <TableCell
                          key={col}
                          align={col === "DATE" ? "left" : "right"}
                          sx={{
                            bgcolor: headerBg,
                            color: headerText,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            letterSpacing: 0.5,
                            py: 1.5,
                            borderBottom: "none",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {col}
                        </TableCell>
                      ),
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, i) => {
                    const isUp =
                      i < rows.length - 1
                        ? row.close >= rows[i + 1].close
                        : true;
                    return (
                      <TableRow
                        key={row.date + i}
                        sx={{
                          "&:nth-of-type(even)": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.03)"
                              : "rgba(0,0,0,0.02)",
                          },
                          "&:hover": {
                            bgcolor: isDark
                              ? "rgba(255,255,255,0.07)"
                              : "rgba(25,118,210,0.05)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{ fontWeight: 500, fontSize: "0.82rem", py: 1.2 }}
                        >
                          {row.date}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontSize: "0.82rem", py: 1.2 }}
                        >
                          {formatNumber(row.open)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: "0.82rem",
                            py: 1.2,
                            color: "#2e7d32",
                          }}
                        >
                          {formatNumber(row.high)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: "0.82rem",
                            py: 1.2,
                            color: "#c62828",
                          }}
                        >
                          {formatNumber(row.low)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: "0.82rem",
                            py: 1.2,
                            fontWeight: 600,
                            color: isUp ? "#2e7d32" : "#c62828",
                          }}
                        >
                          {formatNumber(row.close)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: "0.82rem",
                            py: 1.2,
                            color: "text.secondary",
                          }}
                        >
                          {formatVolume(row.volume)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <AdSense adSlot="3146398237" />

        {/* Key Features */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            mt: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h3"
            fontWeight={600}
            sx={{ fontSize: "1.75rem", mb: 3 }}
          >
            Key Features of Historical Index Data Tool
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: (
                  <TrendingUp size={36} color={theme.palette.primary.main} />
                ),
                title: "Live Market Data",
                desc: "Fetches real-time and historical OHLCV data directly from Yahoo Finance for accurate, up-to-date index information.",
              },
              {
                icon: <Calendar size={36} color={theme.palette.success.main} />,
                title: "Flexible Date Ranges",
                desc: "Choose from preset ranges (1D, 1W, 1M, 3M, 6M, 1Y) or pick a custom date range to view exactly the period you need.",
              },
              {
                icon: (
                  <FileSpreadsheet
                    size={36}
                    color={theme.palette.warning.main}
                  />
                ),
                title: "CSV Export",
                desc: "Download the full OHLCV dataset as a CSV file for further analysis in Excel, Google Sheets, or any data tool.",
              },
              {
                icon: <Download size={36} color={theme.palette.info.main} />,
                title: "Multiple Indices",
                desc: "Supports NIFTY 50, SENSEX, NIFTY BANK, NIFTY IT, S&P 500, NASDAQ, DOW JONES, FTSE 100, NIKKEI 225, and more.",
              },
              {
                icon: (
                  <RefreshCw size={36} color={theme.palette.secondary.main} />
                ),
                title: "Color-Coded Table",
                desc: "Highs are highlighted in green and lows in red, with close price direction indicating daily market movement at a glance.",
              },
              {
                icon: <TrendingUp size={36} color={theme.palette.error.main} />,
                title: "Free & No Login",
                desc: "Completely free to use with no registration required. Access historical index data instantly from your browser.",
              },
            ].map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    height: "100%",
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <Box sx={{ mb: 1.5 }}>{f.icon}</Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {f.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* About Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            mt: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h3"
            fontWeight={600}
            sx={{ fontSize: "1.75rem", mb: 2 }}
          >
            About Stock Market Index Data
          </Typography>
          <Typography paragraph color="text.secondary">
            A stock market index tracks the performance of a group of stocks
            representing a segment of the market. Indices like NIFTY 50 and
            SENSEX are benchmarks for the Indian equity market, while S&P 500
            and NASDAQ represent the US market. Historical OHLCV data (Open,
            High, Low, Close, Volume) is the foundation of technical analysis
            and quantitative research.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Understanding OHLCV Data
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                {[
                  [
                    "Open",
                    "The price at which the index opened at the start of the trading session.",
                  ],
                  [
                    "High",
                    "The highest value the index reached during the session.",
                  ],
                  [
                    "Low",
                    "The lowest value the index touched during the session.",
                  ],
                  [
                    "Close",
                    "The final value of the index at market close — the most widely referenced price.",
                  ],
                  [
                    "Volume",
                    "Total number of shares traded during the session, indicating market activity.",
                  ],
                ].map(([term, def]) => (
                  <Box component="li" key={term} sx={{ mb: 1.5 }}>
                    <Typography variant="body2">
                      <strong>{term}:</strong> {def}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                How to Use This Tool
              </Typography>
              <Box component="ol" sx={{ pl: 2, m: 0 }}>
                {[
                  "Select an index from the dropdown (e.g., NIFTY 50, SENSEX).",
                  "Click a preset range button — 1D, 1W, 1M, 3M, 6M, or 1Y.",
                  "For a specific period, click Custom and pick your From/To dates.",
                  "The table loads automatically with daily OHLCV data.",
                  "Click Download (.csv) to export the data for offline analysis.",
                ].map((step, i) => (
                  <Box component="li" key={i} sx={{ mb: 1.5 }}>
                    <Typography variant="body2">{step}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* FAQ */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            mt: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h3"
            fontWeight={600}
            sx={{ fontSize: "1.75rem", mb: 3 }}
          >
            Frequently Asked Questions
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                q: "Where does the data come from?",
                a: "Data is sourced from Yahoo Finance via their public chart API. It covers most major global indices with daily OHLCV granularity.",
              },
              {
                q: "How current is the data?",
                a: "Data is cached for 5 minutes on the server. For most indices, the previous trading day's data is available by early morning the next day.",
              },
              {
                q: "What does NIFTY 50 represent?",
                a: "NIFTY 50 is the benchmark index of the National Stock Exchange (NSE) of India, tracking the 50 largest and most liquid Indian companies.",
              },
              {
                q: "Can I download the data?",
                a: "Yes. Click the Download (.csv) button above the table to export the full dataset for the selected index and date range.",
              },
              {
                q: "Why does 1D show two rows?",
                a: "The 1D range fetches the last 2 trading days so you can compare today's session against the previous close for context.",
              },
              {
                q: "Is this tool free to use?",
                a: "Completely free. No account, no subscription, no limits. Just select an index and view the data instantly.",
              },
            ].map((faq, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {faq.q}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faq.a}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </motion.div>
    </Container>
  );
}
