"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Divider,
  Tooltip,
  IconButton,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Refresh,
  ContentCopy,
  Info,
  Check,
  LocationOn,
  AccessTime,
  Public,
} from "@mui/icons-material";
import { useAnalytics } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import AdSense from "../AdSense";

interface IPInfo {
  ip: string;
}

interface GeoInfo {
  ip: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_code: string;
  country_name: string;
  continent_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  org: string;
}

const FindMyIPAddress: React.FC = () => {
  const { trackTool } = useAnalytics();
  const [ipv4Info, setIpv4Info] = useState<IPInfo | null>(null);
  const [ipv6Info, setIpv6Info] = useState<IPInfo | null>(null);
  const [geoInfo, setGeoInfo] = useState<GeoInfo | null>(null);
  const [loadingIpv4, setLoadingIpv4] = useState<boolean>(false);
  const [loadingIpv6, setLoadingIpv6] = useState<boolean>(false);
  const [ipv4Error, setIpv4Error] = useState<string>("");
  const [ipv6Error, setIpv6Error] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const fetchIPv4Info = async () => {
    setLoadingIpv4(true);
    setIpv4Error("");

    try {
      // Get the IPv4 address
      const ipResponse = await fetch("https://api.ipify.org?format=json");

      if (!ipResponse.ok) {
        throw new Error(`Error: ${ipResponse.status} ${ipResponse.statusText}`);
      }

      const ipData = await ipResponse.json();
      setIpv4Info(ipData);

      // Then, get the geolocation data using the IPv4
      const geoResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);

      if (!geoResponse.ok) {
        throw new Error(
          `Error fetching geolocation: ${geoResponse.status} ${geoResponse.statusText}`
        );
      }

      const geoData = await geoResponse.json();

      // Check if the API returned an error
      if (geoData.error) {
        throw new Error(
          `Geolocation API error: ${geoData.reason || "Unknown error"}`
        );
      }

      setGeoInfo(geoData);
      trackTool("find-my-ip-address", "fetch_ipv4");
    } catch (err) {
      if (err instanceof Error) {
        setIpv4Error(err.message);
      } else {
        setIpv4Error("An unknown error occurred");
      }
      console.error("Error fetching IPv4 information:", err);
    } finally {
      setLoadingIpv4(false);
    }
  };

  const fetchIPv6Info = async () => {
    setLoadingIpv6(true);
    setIpv6Error("");

    try {
      // Get the IPv6 address using the IPv6-specific endpoint
      const ipv6Response = await fetch("https://api6.ipify.org?format=json");

      if (!ipv6Response.ok) {
        throw new Error(
          `Error: ${ipv6Response.status} ${ipv6Response.statusText}`
        );
      }

      const ipv6Data = await ipv6Response.json();
      setIpv6Info(ipv6Data);
      trackTool("find-my-ip-address", "fetch_ipv6");
    } catch (err) {
      // Many users might not have IPv6 connectivity, so we'll handle this gracefully
      if (err instanceof Error) {
        setIpv6Error("IPv6 not available for your connection");
      } else {
        setIpv6Error("An unknown error occurred");
      }
      console.error("Error fetching IPv6 information:", err);
    } finally {
      setLoadingIpv6(false);
    }
  };

  const fetchAllIPInfo = () => {
    fetchIPv4Info();
    fetchIPv6Info();
    trackTool("find-my-ip-address", "fetch_all");
  };

  const handleCopyIP = (ip: string | undefined) => {
    if (ip) {
      navigator.clipboard.writeText(ip);
      setCopied(true);
      showSnackbar("IP address copied to clipboard", "success");
      trackTool("find-my-ip-address", "copy_ip");
    }
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning" = "success"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Navigation />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          fontWeight={700}
          sx={{ mb: 2 }}
        >
          Find My IP Address
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4 }}
        >
          Quickly find your public IPv4 and IPv6 addresses and geolocation
          information with our free online tool.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            {ipv4Info?.ip || ipv6Info?.ip ? (
              <Grid item xs={12} textAlign="center">
                {/* IPv4 Address Section */}
                <Typography variant="h6" gutterBottom>
                  Your Public IPv4 Address
                </Typography>

                {loadingIpv4 ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100px"
                  >
                    <CircularProgress />
                  </Box>
                ) : ipv4Error ? (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {ipv4Error}
                  </Alert>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: "background.default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 300,
                      }}
                    >
                      <Typography
                        variant="h4"
                        component="div"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {ipv4Info?.ip}
                      </Typography>
                      <Tooltip title="Copy IPv4 Address">
                        <IconButton
                          onClick={() => handleCopyIP(ipv4Info?.ip)}
                          color="primary"
                          sx={{ ml: 2 }}
                        >
                          {copied ? <Check /> : <ContentCopy />}
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  </Box>
                )}

                {/* IPv6 Address Section */}
                <Typography variant="h6" gutterBottom mt={3}>
                  Your Public IPv6 Address
                </Typography>

                {loadingIpv6 ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100px"
                  >
                    <CircularProgress />
                  </Box>
                ) : ipv6Error ? (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {ipv6Error}
                  </Alert>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: "background.default",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: 300,
                        maxWidth: "100%",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        variant="h5"
                        component="div"
                        fontFamily="monospace"
                        fontWeight="bold"
                        sx={{ wordBreak: "break-all" }}
                      >
                        {ipv6Info?.ip}
                      </Typography>
                      <Tooltip title="Copy IPv6 Address">
                        <IconButton
                          onClick={() => handleCopyIP(ipv6Info?.ip)}
                          color="primary"
                          sx={{ ml: 2, flexShrink: 0 }}
                        >
                          {copied ? <Check /> : <ContentCopy />}
                        </IconButton>
                      </Tooltip>
                    </Paper>
                  </Box>
                )}
              </Grid>
            ) : (
              <Grid item xs={12} textAlign="center">
                <Typography variant="h5" sx={{ mb: 3 }}>
                  Click the button below to get your IPv4 and IPv6 IP addresses.
                </Typography>
              </Grid>
            )}
          </Grid>
          <Box textAlign="center">
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={fetchAllIPInfo}
              sx={{ mt: 3 }}
              disabled={loadingIpv4 || loadingIpv6}
            >
              {loadingIpv4 || loadingIpv6
                ? "Fetching..."
                : "Fetch IP Addresses"}
            </Button>
          </Box>
        </Paper>

        {/* Geolocation Information */}
        {!loadingIpv4 && !ipv4Error && geoInfo && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Box display="flex" alignItems="center" mb={2}>
              <LocationOn color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5">Geolocation Information</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              {/* Location Information */}
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    <Public sx={{ mr: 1, verticalAlign: "middle" }} />
                    Location
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            City
                          </TableCell>
                          <TableCell>{geoInfo.city || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            Region
                          </TableCell>
                          <TableCell>
                            {geoInfo.region || "N/A"}{" "}
                            {geoInfo.region_code
                              ? `(${geoInfo.region_code})`
                              : ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            Country
                          </TableCell>
                          <TableCell>
                            {geoInfo.country_name || "N/A"}{" "}
                            {geoInfo.country_code
                              ? `(${geoInfo.country_code})`
                              : ""}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            Postal Code
                          </TableCell>
                          <TableCell>{geoInfo.postal || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            Coordinates
                          </TableCell>
                          <TableCell>
                            {geoInfo.latitude && geoInfo.longitude
                              ? `${geoInfo.latitude.toFixed(
                                4
                              )}, ${geoInfo.longitude.toFixed(4)}`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12} md={6}>
                <Box mb={2}>
                  <Typography variant="h6" gutterBottom>
                    <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                    Time & Regional Settings
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            Timezone
                          </TableCell>
                          <TableCell>{geoInfo.timezone || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            UTC Offset
                          </TableCell>
                          <TableCell>{geoInfo.utc_offset || "N/A"}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            Currency
                          </TableCell>
                          <TableCell>
                            {geoInfo.currency
                              ? `${geoInfo.currency_name || ""} (${geoInfo.currency
                              })`
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            Calling Code
                          </TableCell>
                          <TableCell>
                            {geoInfo.country_calling_code || "N/A"}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            Organization
                          </TableCell>
                          <TableCell>{geoInfo.org || "N/A"}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* AdSense Ad */}
        <AdSense adSlot="3174835314" />

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" gutterBottom>
            About IP Addresses
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography paragraph>
            An IP address (Internet Protocol address) is a numerical label
            assigned to each device connected to a computer network that uses
            the Internet Protocol for communication. It serves two main
            functions: identifying the host or network interface, and providing
            the location of the host in the network.
          </Typography>
          <Typography paragraph>
            Your public IP address is the address that identifies your network
            on the internet. It's assigned by your Internet Service Provider
            (ISP) and is visible to websites and online services you visit.
          </Typography>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            IPv4 vs IPv6
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{ p: 2, backgroundColor: "primary.light", borderRadius: 1 }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 1, color: "#000" }}
                >
                  IPv4 (Internet Protocol version 4)
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#000", mb: 1 }}>
                  The original IP address format, consisting of four sets of
                  numbers separated by dots (e.g., 192.168.1.1).
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#000" }}>
                  With only about 4.3 billion possible addresses, IPv4 addresses
                  are becoming scarce.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "secondary.light",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={500}
                  sx={{ mb: 1, color: "#000" }}
                >
                  IPv6 (Internet Protocol version 6)
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#000", mb: 1 }}>
                  The newer IP address format, using eight groups of hexadecimal
                  digits separated by colons.
                </Typography>
                <Typography sx={{ fontSize: "0.9rem", color: "#000" }}>
                  IPv6 provides an almost unlimited number of addresses and is
                  gradually replacing IPv4.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            When Your IP Address May Change
          </Typography>
          <Box component="ul" sx={{ pl: 2, margin: 0 }}>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>When you restart your router</Typography>
            </Box>
            <Box component="li" sx={{ mb: 1 }}>
              <Typography>When you connect to a different network</Typography>
            </Box>
            <Box component="li">
              <Typography>
                When you use a VPN (Virtual Private Network)
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            border: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Info color="info" sx={{ mr: 1 }} />
            <Typography variant="h5">Why Would You Need This Tool?</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography paragraph>
            Knowing your public IP address and geolocation can be useful for
            various reasons:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Remote Access:</strong> Setting up remote access to
                    your home network or devices
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Troubleshooting:</strong> Diagnosing network
                    connectivity issues
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Security:</strong> Verifying your online anonymity
                    when using VPNs or proxies
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    <strong>Gaming:</strong> Setting up game servers or fixing
                    connection problems
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box component="ul" sx={{ pl: 2, margin: 0 }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Development:</strong> Testing geolocation features
                    or region-specific content
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography>
                    <strong>Travel:</strong> Confirming your virtual location
                    when accessing region-restricted content
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography>
                    <strong>IPv6 Readiness:</strong> Checking if your internet
                    connection supports IPv6, which is becoming increasingly
                    important as IPv4 addresses are exhausted
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* AdSense Ad */}
        <AdSense adSlot="6613251015" />
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FindMyIPAddress;
