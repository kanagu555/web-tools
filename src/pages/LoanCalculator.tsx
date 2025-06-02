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
Loan Amount: $${parseFloat(loanAmount).toFixed(2)}
Interest Rate: ${interestRate}%
Loan Term: ${loanTerm} years
Monthly Payment: $${loanResult.monthlyPayment.toFixed(2)}
Total Payment: $${loanResult.totalPayment.toFixed(2)}
Total Interest: $${loanResult.totalInterest.toFixed(2)}
`;

    navigator.clipboard.writeText(resultsText);
    setSnackbarMessage("Loan summary copied to clipboard");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Helmet>
        <title>Loan Calculator | Calculate Monthly Payments & Interest</title>
        <meta
          name="description"
          content="Free online loan calculator to estimate your monthly payments, total interest, and amortization schedule for personal loans, mortgages, auto loans, and more."
        />
        <meta
          name="keywords"
          content="loan calculator, mortgage calculator, auto loan calculator, personal loan calculator, amortization schedule, monthly payment calculator, interest calculator, loan calculator, mortgage calculator, auto loan calculator, personal loan calculator, home loan calculator, car loan calculator, loan payment calculator, interest calculator, loan amortization calculator, debt calculator, monthly payment calculator, mortgage payment calculator, refinance calculator, loan affordability calculator, business loan calculator, student loan calculator, react loan calculator, financial calculator online, free loan calculator, web-based loan tool, loan comparison calculator, apr calculator, loan term calculator, extra payment calculator, loan calculator github, home loan emi calculator, home loan calculator, free home loan emi calculator, free home loan emi calculator online"
        />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700}>
          Loan Calculator
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Calculate your monthly loan payments, total interest, and view
          amortization schedule.
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
                Loan Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Loan Amount (Rs.)"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Annual Interest Rate (%)"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Loan Term (Years)"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
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
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      Loan Summary
                    </Typography>
                    <Box>
                      <Tooltip title="Copy results">
                        <IconButton onClick={handleCopyResults} size="small">
                          <Copy size={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download results">
                        <IconButton
                          onClick={downloadLoanDetails}
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
                            Monthly Payment
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

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ width: "100%", mb: 2 }}>
                    <Tabs
                      value={activeTab}
                      onChange={(_, newValue) => setActiveTab(newValue)}
                      variant="fullWidth"
                    >
                      {/* <Tab label="Loan Details" /> */}
                      <Tab label="Amortization Schedule" />
                    </Tabs>
                  </Box>

                  <TableContainer sx={{ maxHeight: 300, overflow: "auto" }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Month</TableCell>
                          <TableCell align="right">Payment</TableCell>
                          <TableCell align="right">Principal</TableCell>
                          <TableCell align="right">Interest</TableCell>
                          <TableCell align="right">Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loanResult.amortizationSchedule.map((row) => (
                          <TableRow key={row.month}>
                            <TableCell>{row.month}</TableCell>
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
        >
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            About Loan Calculations
          </Typography>
          <Typography paragraph>
            A loan calculator helps you estimate your monthly payments and total
            interest costs for different types of loans. It's a valuable tool
            for financial planning and comparing loan options.
          </Typography>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                How Loan Calculations Work
              </Typography>
              <Typography paragraph>
                Loan calculations use the principal amount, interest rate, and
                loan term to determine monthly payments. The formula accounts
                for compound interest over the life of the loan.
              </Typography>
              <Typography paragraph>
                The amortization schedule shows how each payment is split
                between principal and interest, and how the remaining balance
                decreases over time until the loan is fully paid off.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Types of Loans
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <strong>Personal Loans:</strong> Unsecured loans for various
                  personal expenses with typically higher interest rates.
                </li>
                <li>
                  <strong>Auto Loans:</strong> Secured loans specifically for
                  vehicle purchases, usually with moderate interest rates.
                </li>
                <li>
                  <strong>Mortgages:</strong> Long-term loans for home
                  purchases, secured by the property with lower interest rates.
                </li>
                <li>
                  <strong>Student Loans:</strong> Loans for educational
                  expenses, often with favorable terms and deferment options.
                </li>
                <li>
                  <strong>Business Loans:</strong> Loans for business purposes,
                  with terms varying based on business type and credit profile.
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

export default LoanCalculator;
