import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  useTheme,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { Calculator, Download, Copy, RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet";
import html2canvas from "html2canvas";
import AdSense from "../components/AdSense";

interface SIPResult {
  totalInvestment: number;
  expectedReturns: number;
  maturityValue: number;
  growthSchedule: Array<{
    year: number;
    month: number;
    investedAmount: number;
    interestEarned: number;
    totalValue: number;
  }>;
}

const SIPCalculator = () => {
  const theme = useTheme();
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [investmentPeriod, setInvestmentPeriod] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [sipResult, setSipResult] = useState<SIPResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateSIP = () => {
    const principal = parseFloat(monthlyInvestment);
    const rate = parseFloat(expectedReturn) / 100 / 12;
    const months = parseFloat(investmentPeriod) * 12;

    if (principal > 0 && rate > 0 && months > 0) {
      // SIP calculation formula: M × {[(1 + r)^n - 1] / r} × (1 + r)
      // Where M is the monthly investment, r is the monthly interest rate, and n is the number of months
      const maturityValue =
        principal * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
      const totalInvestment = principal * months;
      const expectedReturns = maturityValue - totalInvestment;

      // Generate growth schedule
      const schedule = [];
      let currentValue = 0;

      for (let month = 1; month <= months; month++) {
        // Add this month's investment
        currentValue = currentValue * (1 + rate) + principal;

        // Calculate total invested so far
        const investedAmount = principal * month;

        // Calculate interest earned so far
        const interestEarned = currentValue - investedAmount;

        // Only add yearly entries to keep the table manageable
        if (month % 12 === 0 || month === 1 || month === months) {
          schedule.push({
            year: Math.ceil(month / 12),
            month,
            investedAmount,
            interestEarned,
            totalValue: currentValue,
          });
        }
      }

      setSipResult({
        totalInvestment,
        expectedReturns,
        maturityValue,
        growthSchedule: schedule,
      });

      setSnackbarMessage("SIP calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const downloadSIPDetails = () => {
    if (!sipResult || !resultsRef.current) return;

    // Create a clone of the results div without the download button
    const resultsClone = resultsRef.current.cloneNode(true) as HTMLElement;

    // Find and remove the download button from the clone
    const downloadButton = resultsClone.querySelector("[data-download-button]");
    if (downloadButton) {
      downloadButton.parentNode?.removeChild(downloadButton);
    }

    // Set a white background for better image quality
    resultsClone.style.backgroundColor = theme.palette.background.paper;
    resultsClone.style.padding = "20px";
    resultsClone.style.borderRadius = "0px";

    // Temporarily add the clone to the document for capturing
    resultsClone.style.position = "absolute";
    resultsClone.style.left = "-9999px";
    document.body.appendChild(resultsClone);

    html2canvas(resultsClone).then((canvas) => {
      try {
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `sip_calculation_${
          new Date().toISOString().split("T")[0]
        }.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSnackbarMessage("SIP details downloaded successfully");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error generating PNG:", error);
        setSnackbarMessage("Failed to generate PNG. Please try again.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        // Remove the temporary clone
        document.body.removeChild(resultsClone);
      }
    });
  };

  const handleReset = () => {
    setMonthlyInvestment("");
    setExpectedReturn("");
    setInvestmentPeriod("");
    setSipResult(null);
    setActiveTab(0);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!sipResult) return;

    const resultsText = `
SIP Summary:
Monthly Investment: Rs. ${parseFloat(monthlyInvestment).toFixed(2)}
Expected Annual Return: ${expectedReturn}%
Investment Period: ${investmentPeriod} years
Total Investment: Rs. ${sipResult.totalInvestment.toFixed(2)}
Expected Returns: Rs. ${sipResult.expectedReturns.toFixed(2)}
Maturity Value: Rs. ${sipResult.maturityValue.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("SIP summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>
          SIP Calculator | Calculate Systematic Investment Plan Returns
        </title>
        <meta
          name="description"
          content="Free online SIP calculator to estimate your investment returns, maturity value, and wealth growth for mutual funds and other systematic investments."
        />
        <meta
          name="keywords"
          content="sip calculator, systematic investment plan calculator, mutual fund calculator, investment calculator, sip return calculator, sip investment calculator, monthly investment calculator, compound interest calculator, wealth calculator, financial planning tool, investment growth calculator, retirement calculator, mutual fund return calculator, sip planner, investment planner, financial calculator online, free sip calculator, web-based investment tool, investment comparison calculator, long term investment calculator, wealth growth calculator, sip calculator india, sip calculator with inflation, sip calculator with step up, sip calculator with yearly increase, sip calculator with monthly increase, sip calculator with lumpsum, sip calculator with withdrawal, sip calculator with tax, sip calculator with goal, sip calculator with inflation and step up, sip calculator with inflation and tax, sip calculator with inflation and goal, sip calculator with inflation and withdrawal, sip calculator with inflation and lumpsum, sip calculator with inflation and yearly increase, sip calculator with inflation and monthly increase"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          SIP Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Calculate your Systematic Investment Plan returns, maturity value, and
          wealth growth.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="h6" gutterBottom fontWeight={600} mb={2}>
                Investment Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Monthly Investment (Rs.)"
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Expected Annual Return (%)"
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Investment Period (Years)"
                    type="number"
                    value={investmentPeriod}
                    onChange={(e) => setInvestmentPeriod(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={calculateSIP}
                      disabled={
                        !monthlyInvestment ||
                        !expectedReturn ||
                        !investmentPeriod
                      }
                      startIcon={<Calculator size={18} />}
                      sx={{ flex: 1 }}
                    >
                      Calculate
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      startIcon={<RefreshCw size={18} />}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                minHeight: "400px",
              }}
            >
              {sipResult ? (
                <Box ref={resultsRef}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      SIP Summary
                    </Typography>
                    <Box>
                      <Tooltip title="Copy results">
                        <IconButton onClick={handleCopyResults} size="small">
                          <Copy size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download results">
                        <IconButton
                          onClick={downloadSIPDetails}
                          size="small"
                          data-download-button="true"
                        >
                          <Download size={18} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: theme.palette.background.default,
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Maturity Value
                          </Typography>
                          <Typography variant="h4" color="primary">
                            Rs. {sipResult.maturityValue.toFixed(2)}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: theme.palette.background.default,
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Total Investment
                          </Typography>
                          <Typography variant="h6">
                            Rs. {sipResult.totalInvestment.toFixed(2)}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          sx={{
                            p: 2,
                            backgroundColor: theme.palette.background.default,
                            borderRadius: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Expected Returns
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            Rs. {sipResult.expectedReturns.toFixed(2)}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ width: "100%", mb: 2 }}>
                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      variant="fullWidth"
                    >
                      <Tab label="Growth Schedule" />
                    </Tabs>
                  </Box>

                  <TableContainer sx={{ maxHeight: 300, overflow: "auto" }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Year</TableCell>
                          <TableCell align="right">Invested Amount</TableCell>
                          <TableCell align="right">Interest Earned</TableCell>
                          <TableCell align="right">Total Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sipResult.growthSchedule.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell>{row.year}</TableCell>
                            <TableCell align="right">
                              Rs. {row.investedAmount.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              Rs. {row.interestEarned.toFixed(2)}
                            </TableCell>
                            <TableCell align="right">
                              Rs. {row.totalValue.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    flexDirection: "column",
                    minHeight: "400px",
                  }}
                >
                  <Calculator size={48} color={theme.palette.text.secondary} />
                  <Typography sx={{ mt: 2 }}>
                    Enter investment details to see SIP returns
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        <AdSense adSlot="6613251015" />

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            mt: 4,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About Systematic Investment Plans (SIP)
          </Typography>
          <Typography paragraph>
            A Systematic Investment Plan (SIP) is a disciplined approach to
            investing where you contribute a fixed amount at regular intervals,
            typically monthly, into mutual funds or other investment vehicles.
            This strategy helps in building wealth over time through the power
            of compounding and rupee cost averaging.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                How SIP Calculations Work
              </Typography>
              <Typography paragraph>
                SIP calculations use the power of compounding to grow your
                investments over time. The formula accounts for regular
                contributions and compound interest, showing how small,
                consistent investments can lead to significant wealth
                accumulation.
              </Typography>
              <Typography paragraph>
                The growth schedule shows how your investment grows year by
                year, with both your contributed amount and the interest earned.
                This helps you visualize the long-term benefits of systematic
                investing.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Benefits of SIP Investing
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Rupee Cost Averaging:</strong> By investing a fixed
                  amount regularly, you buy more units when prices are low and
                  fewer when prices are high, reducing the impact of market
                  volatility.
                </li>
                <li>
                  <strong>Power of Compounding:</strong> The earlier you start,
                  the more time your money has to grow through compounding
                  returns.
                </li>
                <li>
                  <strong>Disciplined Investing:</strong> SIPs instill financial
                  discipline by committing to regular investments regardless of
                  market conditions.
                </li>
                <li>
                  <strong>Flexibility:</strong> You can start with small amounts
                  and increase your investment as your income grows.
                </li>
                <li>
                  <strong>Goal-Based Investing:</strong> SIPs are ideal for
                  achieving long-term financial goals like retirement,
                  education, or home purchase.
                </li>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
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

export default SIPCalculator;
