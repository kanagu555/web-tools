"use client";

import { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  Divider,
  useTheme,
} from "@mui/material";
import PercentIcon from "@mui/icons-material/Percent";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`percentage-tabpanel-${index}`}
      aria-labelledby={`percentage-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `percentage-tab-${index}`,
    "aria-controls": `percentage-tabpanel-${index}`,
  };
}

export function PercentageCalculator() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();

  // Basic percentage calculation
  const [value, setValue] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");
  const [percentageResult, setPercentageResult] = useState<string>("");

  // Percentage increase/decrease
  const [originalValue, setOriginalValue] = useState<string>("");
  const [changePercentage, setChangePercentage] = useState<string>("");
  const [changeResult, setChangeResult] = useState<string>("");

  // Discount calculator
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountPercentage, setDiscountPercentage] = useState<string>("");
  const [discountResult, setDiscountResult] = useState<string>("");
  const [savedAmount, setSavedAmount] = useState<string>("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculatePercentage = () => {
    if (value && percentage) {
      const result = (parseFloat(value) * parseFloat(percentage)) / 100;
      setPercentageResult(result.toFixed(2));
    }
  };

  const calculateChange = () => {
    if (originalValue && changePercentage) {
      const original = parseFloat(originalValue);
      const change = parseFloat(changePercentage);
      const result = original * (1 + change / 100);
      setChangeResult(result.toFixed(2));
    }
  };

  const calculateDiscount = () => {
    if (originalPrice && discountPercentage) {
      const price = parseFloat(originalPrice);
      const discount = parseFloat(discountPercentage);
      const saved = (price * discount) / 100;
      const finalPrice = price - saved;
      setDiscountResult(finalPrice.toFixed(2));
      setSavedAmount(saved.toFixed(2));
    }
  };

  return (
    <Paper sx={{ maxWidth: 800, mx: "auto" }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab
          icon={<PercentIcon />}
          label="Basic Percentage"
          {...a11yProps(0)}
        />
        <Tab
          icon={<TrendingUpIcon />}
          label="Increase/Decrease"
          {...a11yProps(1)}
        />
        <Tab
          icon={<LocalOfferIcon />}
          label="Discount Calculator"
          {...a11yProps(2)}
        />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Value"
              type="number"
              fullWidth
              value={value}
              onChange={(e) => setValue(e.target.value)}
              InputProps={{
                inputProps: { min: 0, step: "any" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Percentage"
              type="number"
              fullWidth
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              InputProps={{
                inputProps: { min: 0, step: "any" },
                endAdornment: <PercentIcon color="action" />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={calculatePercentage}
              disabled={!value || !percentage}
              sx={{ height: "56px" }}
            >
              Calculate
            </Button>
          </Grid>
          {percentageResult && (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  mt: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle1">Result:</Typography>
                <Typography variant="h5" color="primary">
                  {percentage}% of {value} = {percentageResult}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Original Value"
              type="number"
              fullWidth
              value={originalValue}
              onChange={(e) => setOriginalValue(e.target.value)}
              InputProps={{
                inputProps: { min: 0, step: "any" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Percentage Change"
              type="number"
              fullWidth
              value={changePercentage}
              onChange={(e) => setChangePercentage(e.target.value)}
              InputProps={{
                inputProps: { step: "any" },
                endAdornment: <PercentIcon color="action" />,
              }}
              helperText="Use positive for increase, negative for decrease"
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={calculateChange}
              disabled={!originalValue || !changePercentage}
              sx={{ height: "56px" }}
            >
              Calculate
            </Button>
          </Grid>
          {changeResult && (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  mt: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle1">Result:</Typography>
                <Typography variant="h5" color="primary">
                  {originalValue} {parseFloat(changePercentage) >= 0 ? "+" : ""}{" "}
                  {changePercentage}% = {changeResult}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Original Price"
              type="number"
              fullWidth
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              InputProps={{
                inputProps: { min: 0, step: "any" },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              label="Discount Percentage"
              type="number"
              fullWidth
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              InputProps={{
                inputProps: { min: 0, max: 100, step: "any" },
                endAdornment: <PercentIcon color="action" />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={calculateDiscount}
              disabled={!originalPrice || !discountPercentage}
              sx={{ height: "56px" }}
            >
              Calculate
            </Button>
          </Grid>
          {discountResult && (
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  mt: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography variant="subtitle1">Results:</Typography>
                <Typography variant="h5" color="primary">
                  Final Price: {discountResult}
                </Typography>
                <Typography variant="subtitle1" color="success.main">
                  You Save: {savedAmount} ({discountPercentage}%)
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Percentage Calculator Features
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              • Calculate what percentage one value is of another
            </Typography>
            <Typography variant="body2" paragraph>
              • Determine percentage increases and decreases
            </Typography>
            <Typography variant="body2" paragraph>
              • Calculate discounts and final prices
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" paragraph>
              • Simple, intuitive interface with instant results
            </Typography>
            <Typography variant="body2" paragraph>
              • Multiple calculation modes for different needs
            </Typography>
            <Typography variant="body2" paragraph>
              • All calculations performed locally on your device
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
