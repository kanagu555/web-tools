"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Tooltip,
  Snackbar,
  Alert,
  Chip,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import { Share, ContentCopy, Check } from "@mui/icons-material";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  RedditShareButton,
  PinterestShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  RedditIcon,
  PinterestIcon,
} from "react-share";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

interface SharePlatform {
  name: string;
  ShareButton: React.ComponentType<any>;
  Icon: React.ComponentType<any>;
  props?: any;
}

const SocialShare: React.FC<SocialShareProps> = ({
  url,
  title,
  description = "",
  hashtags = [],
  className = "",
}) => {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isNativeShareSupported] = useState(
    typeof navigator !== "undefined" && "share" in navigator
  );

  const sharePlatforms: SharePlatform[] = [
    {
      name: "Facebook",
      ShareButton: FacebookShareButton,
      Icon: FacebookIcon,
      props: { url, quote: title },
    },
    {
      name: "Twitter",
      ShareButton: TwitterShareButton,
      Icon: TwitterIcon,
      props: {
        url,
        title,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
      },
    },
    {
      name: "LinkedIn",
      ShareButton: LinkedinShareButton,
      Icon: LinkedinIcon,
      props: { url, title, summary: description },
    },
    {
      name: "WhatsApp",
      ShareButton: WhatsappShareButton,
      Icon: WhatsappIcon,
      props: { url, title, separator: " - " },
    },
    {
      name: "Telegram",
      ShareButton: TelegramShareButton,
      Icon: TelegramIcon,
      props: { url, title },
    },
    {
      name: "Email",
      ShareButton: EmailShareButton,
      Icon: EmailIcon,
      props: { url, subject: title, body: description },
    },
    {
      name: "Reddit",
      ShareButton: RedditShareButton,
      Icon: RedditIcon,
      props: { url, title },
    },
    {
      name: "Pinterest",
      ShareButton: PinterestShareButton,
      Icon: PinterestIcon,
      props: {
        url,
        description: title,
        media: "",
      },
    },
  ];

  const handleNativeShare = async () => {
    if (isNativeShareSupported) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setSnackbarOpen(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log("Error copying to clipboard:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.05
          )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
        className={className}
        role="region"
        aria-label="Social sharing options"
      >
        <Box textAlign="center" mb={3}>
          <Typography
            variant="h5"
            component="h2"
            fontWeight="600"
            color="text.primary"
            mb={1}
            id="share-heading"
          >
            Share this content
          </Typography>

          {hashtags.length > 0 && (
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              justifyContent="center"
              mb={2}
              role="list"
              aria-label="Hashtags"
            >
              {hashtags.map((tag) => (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                  role="listitem"
                />
              ))}
            </Box>
          )}
        </Box>

        <Grid
          container
          spacing={2}
          justifyContent="center"
          mb={3}
          role="list"
          aria-labelledby="share-heading"
        >
          {sharePlatforms.map((platform) => {
            const { ShareButton, Icon, props } = platform;
            return (
              <Grid item key={platform.name} role="listitem">
                <Tooltip
                  title={`Share on ${platform.name}`}
                  arrow
                  aria-label={`Share on ${platform.name}`}
                >
                  <Box
                    sx={{
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": {
                        transform: "translateY(-2px) scale(1.05)",
                      },
                      "&:active": {
                        transform: "translateY(0) scale(0.98)",
                      },
                    }}
                  >
                    <ShareButton
                      {...props}
                      aria-label={`Share on ${platform.name}`}
                    >
                      <Icon
                        size={56}
                        round
                        style={{
                          filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
                        }}
                        aria-hidden="true"
                      />
                    </ShareButton>
                  </Box>
                </Tooltip>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ my: 2 }} aria-hidden="true" />

        <Grid container spacing={2}>
          {isNativeShareSupported && (
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Share aria-hidden="true" />}
                onClick={handleNativeShare}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  boxShadow: `0 4px 12px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: `0 6px 16px ${alpha(
                      theme.palette.primary.main,
                      0.4
                    )}`,
                  },
                }}
                aria-label="Share using native share dialog"
              >
                Share
              </Button>
            </Grid>
          )}

          <Grid item xs={12} sm={isNativeShareSupported ? 6 : 12}>
            <Button
              fullWidth
              variant={copied ? "contained" : "outlined"}
              startIcon={
                copied ? (
                  <Check aria-hidden="true" />
                ) : (
                  <ContentCopy aria-hidden="true" />
                )
              }
              onClick={handleCopyLink}
              color={copied ? "success" : "primary"}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                transition: "all 0.3s ease",
                ...(copied
                  ? {
                      background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
                      boxShadow: `0 4px 12px ${alpha(
                        theme.palette.success.main,
                        0.3
                      )}`,
                    }
                  : {
                      borderWidth: 2,
                      "&:hover": {
                        borderWidth: 2,
                        transform: "translateY(-1px)",
                        boxShadow: `0 4px 12px ${alpha(
                          theme.palette.primary.main,
                          0.2
                        )}`,
                      },
                    }),
              }}
              aria-label={copied ? "Link copied" : "Copy link to clipboard"}
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          role="alert"
          aria-live="polite"
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            variant="filled"
            sx={{ borderRadius: 2 }}
            aria-label="Link copied to clipboard"
          >
            Link copied to clipboard!
          </Alert>
        </Snackbar>
      </Paper>
    </>
  );
};

export default SocialShare;
