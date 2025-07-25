import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const supabaseUrl = process?.env?.REACT_APP_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseKey =
  process?.env?.REACT_APP_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";
const supabase = createClient(supabaseUrl, supabaseKey);

const ShortUrlRedirect: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const redirectToUrl = async () => {
      if (!shortCode) {
        setError("Invalid short code");
        setLoading(false);
        return;
      }

      try {
        // Fetch the URL from Supabase
        const { data, error } = await supabase
          .from("url_shortener")
          .select("long_url")
          .eq("short_code", shortCode)
          .single();

        if (error || !data) {
          setError("Short URL not found");
          setLoading(false);
          return;
        }

        // Redirect to the original URL
        window.location.href = data.long_url;
      } catch (err) {
        console.error("Error fetching URL:", err);
        setError("Failed to redirect. Please try again.");
        setLoading(false);
      }
    };

    redirectToUrl();
  }, [shortCode]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Redirecting...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Please wait while we redirect you to your destination.
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Link Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            The short link you're looking for doesn't exist or has been removed.
          </Typography>
        </Box>
      </Container>
    );
  }

  return null;
};

export default ShortUrlRedirect;
