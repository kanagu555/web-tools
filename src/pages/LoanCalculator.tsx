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

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
  }>;
}

const LoanCalculator = () => {
  const theme = useTheme();
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [loanResult, setLoanResult] = useState<LoanResult | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm) * 12;

    if (principal > 0 && rate > 0 && months > 0) {
      const x = Math.pow(1 + rate, months);
      const monthly = (principal * x * rate) / (x - 1);
      const total = monthly * months;
      const totalInterestPaid = total - principal;

      // Generate amortization schedule
      const schedule = [];
      let balance = principal;

      for (let month = 1; month <= months; month++) {
        const interestPayment = balance * rate;
        const principalPayment = monthly - interestPayment;
        balance -= principalPayment;

        schedule.push({
          month,
          payment: monthly,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: balance > 0 ? balance : 0,
        });
      }

      setLoanResult({
        monthlyPayment: monthly,
        totalPayment: total,
        totalInterest: totalInterestPaid,
        amortizationSchedule: schedule,
      });

      setSnackbarMessage("Loan calculated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  };

  const downloadLoanDetails = () => {
    if (!loanResult || !resultsRef.current) return;

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
        link.download = `loan_calculation_${
          new Date().toISOString().split("T")[0]
        }.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSnackbarMessage("Loan details downloaded successfully");
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
    setLoanAmount("");
    setInterestRate("");
    setLoanTerm("");
    setLoanResult(null);
    setActiveTab(0);

    setSnackbarMessage("Form reset successfully");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyResults = () => {
    if (!loanResult) return;

    const resultsText = `
Loan Summary:
Loan Amount: Rs. ${parseFloat(loanAmount).toFixed(2)}
Interest Rate: ${interestRate}%
Loan Term: ${loanTerm} years
Monthly Payment: Rs. ${loanResult.monthlyPayment.toFixed(2)}
Total Payment: Rs. ${loanResult.totalPayment.toFixed(2)}
Total Interest: Rs. ${loanResult.totalInterest.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("Loan summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>
          Free Online Loan Calculator | Calculate EMI, Interest & Amortization
        </title>
        <meta
          name="description"
          content="Free online loan calculator to estimate your monthly EMI payments, total interest, and amortization schedule for home loans, personal loans, auto loans, and more. Plan your finances better with our easy-to-use tool."
        />
        <meta
          name="keywords"
          content="loan calculator, EMI calculator, mortgage calculator, auto loan calculator, personal loan calculator, home loan calculator, car loan calculator, amortization schedule, monthly payment calculator, interest calculator, financial planning tool, debt calculator, loan repayment calculator"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Free Online Loan Calculator | Calculate EMI, Interest & Amortization"
        />
        <meta
          property="og:description"
          content="Calculate your loan EMI, total interest, and view complete amortization schedule with our free online loan calculator."
        />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href="https://www.kodekit.in/tools/loan-calculator"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        aria-label="Loan calculator main content"
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ fontSize: "2.5rem", fontWeight: 700, mb: 2 }}
        >
          Loan Calculator
        </Typography>
        <Typography
          variant="subtitle1"
          component="p"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Calculate your monthly loan payments (EMI), total interest, and view
          complete amortization schedule for better financial planning.
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
              component="section"
              aria-labelledby="loan-details-heading"
            >
              <Typography
                variant="h2"
                component="h2"
                id="loan-details-heading"
                sx={{ fontSize: "1.25rem", fontWeight: 600, mb: 2 }}
              >
                Loan Details
              </Typography>

              <Grid
                container
                spacing={3}
                component="form"
                aria-label="Loan calculation form"
              >
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Loan Amount (Rs.)"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    inputProps={{
                      "aria-label": "Enter loan amount in rupees",
                      min: "0",
                      step: "1000",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Annual Interest Rate (%)"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    inputProps={{
                      "aria-label": "Enter annual interest rate percentage",
                      min: "0",
                      max: "100",
                      step: "0.01",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Loan Term (Years)"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    inputProps={{
                      "aria-label": "Enter loan term in years",
                      min: "1",
                      max: "30",
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={calculateLoan}
                      disabled={!loanAmount || !interestRate || !loanTerm}
                      startIcon={<Calculator size={18} />}
                      sx={{ flex: 1 }}
                      aria-label="Calculate loan payments"
                    >
                      Calculate
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleReset}
                      startIcon={<RefreshCw size={18} />}
                      aria-label="Reset loan calculator form"
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
              component="section"
              aria-labelledby="loan-results-heading"
            >
              {loanResult ? (
                <Box ref={resultsRef}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h2"
                      component="h2"
                      id="loan-results-heading"
                      sx={{ fontSize: "1.25rem", fontWeight: 600 }}
                    >
                      Loan Summary
                    </Typography>
                    <Box>
                      <Tooltip title="Copy results to clipboard">
                        <IconButton
                          onClick={handleCopyResults}
                          size="small"
                          aria-label="Copy loan results to clipboard"
                        >
                          <Copy size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download results as image">
                        <IconButton
                          onClick={downloadLoanDetails}
                          size="small"
                          data-download-button="true"
                          aria-label="Download loan details as image"
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
                          component="article"
                          aria-label="Monthly payment information"
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Monthly Payment (EMI)
                          </Typography>
                          <Typography variant="h4" color="primary">
                            Rs. {loanResult.monthlyPayment.toFixed(2)}
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
                          component="article"
                          aria-label="Total payment information"
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Total Payment
                          </Typography>
                          <Typography variant="h6">
                            Rs. {loanResult.totalPayment.toFixed(2)}
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
                          component="article"
                          aria-label="Total interest information"
                        >
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Total Interest
                          </Typography>
                          <Typography variant="h6" color="error">
                            Rs. {loanResult.totalInterest.toFixed(2)}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 2 }} aria-hidden="true" />

                  <Box sx={{ width: "100%", mb: 2 }}>
                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      variant="fullWidth"
                      aria-label="Loan details tabs"
                    >
                      <Tab
                        label="Amortization Schedule"
                        id="amortization-tab"
                        aria-controls="amortization-tabpanel"
                      />
                    </Tabs>
                  </Box>

                  <div
                    id="amortization-tabpanel"
                    role="tabpanel"
                    aria-labelledby="amortization-tab"
                  >
                    <TableContainer sx={{ maxHeight: 300, overflow: "auto" }}>
                      <Table
                        size="small"
                        stickyHeader
                        aria-label="Amortization schedule"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell scope="col">Month</TableCell>
                            <TableCell scope="col" align="right">
                              Payment
                            </TableCell>
                            <TableCell scope="col" align="right">
                              Principal
                            </TableCell>
                            <TableCell scope="col" align="right">
                              Interest
                            </TableCell>
                            <TableCell scope="col" align="right">
                              Balance
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loanResult.amortizationSchedule.map((row) => (
                            <TableRow key={row.month}>
                              <TableCell scope="row">{row.month}</TableCell>
                              <TableCell align="right">
                                Rs. {row.payment.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                Rs. {row.principal.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                Rs. {row.interest.toFixed(2)}
                              </TableCell>
                              <TableCell align="right">
                                Rs. {row.remainingBalance.toFixed(2)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
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
                  aria-live="polite"
                >
                  <Calculator
                    size={48}
                    color={theme.palette.text.secondary}
                    aria-hidden="true"
                  />
                  <Typography component="p" sx={{ mt: 2 }}>
                    Enter loan details to see payment information
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
          component="section"
          aria-labelledby="about-loan-calculator-heading"
        >
          <Typography
            variant="h2"
            component="h2"
            id="about-loan-calculator-heading"
            sx={{ fontSize: "1.5rem", fontWeight: 600, mb: 2 }}
          >
            About Loan Calculations
          </Typography>
          <Typography component="p" paragraph>
            A loan calculator helps you estimate your monthly EMI payments and
            total interest costs for different types of loans. It's a valuable
            tool for financial planning and comparing loan options before making
            borrowing decisions.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.25rem", fontWeight: 600, mb: 2 }}
              >
                How Loan Calculations Work
              </Typography>
              <Typography component="p" paragraph>
                Loan calculations use the principal amount, interest rate, and
                loan term to determine monthly EMI payments. The formula
                accounts for compound interest over the life of the loan,
                showing exactly how much you'll pay in total.
              </Typography>
              <Typography component="p" paragraph>
                The amortization schedule shows how each payment is split
                between principal and interest, and how the remaining balance
                decreases over time until the loan is fully paid off. This helps
                you understand how much of your payment goes toward the
                principal versus interest each month.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h3"
                component="h3"
                sx={{ fontSize: "1.25rem", fontWeight: 600, mb: 2 }}
              >
                Types of Loans
              </Typography>
              <Box component="ul" sx={{ pl: 2, "& li": { mb: 1 } }}>
                <li>
                  <strong>Personal Loans:</strong> Unsecured loans for various
                  personal expenses with typically higher interest rates. Ideal
                  for debt consolidation, medical expenses, or home
                  improvements.
                </li>
                <li>
                  <strong>Auto Loans:</strong> Secured loans specifically for
                  vehicle purchases, usually with moderate interest rates. The
                  vehicle serves as collateral for the loan.
                </li>
                <li>
                  <strong>Home Loans:</strong> Long-term loans for home
                  purchases, secured by the property with lower interest rates.
                  Typically have terms of 15-30 years.
                </li>
                <li>
                  <strong>Education Loans:</strong> Loans for educational
                  expenses, often with favorable terms and deferment options.
                  May have grace periods before repayment begins.
                </li>
                <li>
                  <strong>Business Loans:</strong> Loans for business purposes,
                  with terms varying based on business type and credit profile.
                  Can be used for startup costs, expansion, or equipment
                  purchases.
                </li>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        aria-live="polite"
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          role="alert"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoanCalculator;
