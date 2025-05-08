"use client";

import { Container, Typography, Paper, Box, Divider } from "@mui/material";

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Privacy Policy
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Last Updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" paragraph>
          At KodeKit, we value your privacy. This Privacy Policy explains how we
          handle information when you visit our website.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Information Collection
        </Typography>
        <Typography variant="body1" paragraph>
          KodeKit does not collect, store, or process any personal information
          from our users. All operations of our tools (such as PDF conversion,
          text formatting, and word counting) are performed directly in your
          browser. Your files and data never leave your device and are not
          transmitted to our servers.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Automatically Collected Information
        </Typography>
        <Typography variant="body1" paragraph>
          Our website hosting provider may automatically collect certain
          non-personal information about visitors, including:
        </Typography>
        <Box component="ul" sx={{ pl: 4, mb: 3 }}>
          <Typography component="li" variant="body1" paragraph>
            Log data (IP address, browser type, pages visited)
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Device information (operating system, screen resolution)
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          This information is used solely for technical purposes such as
          ensuring the proper functioning of our website and improving user
          experience. This data is anonymized and cannot be used to identify
          individual users.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Cookies and Tracking Technologies
        </Typography>
        <Typography variant="body1" paragraph>
          Our website uses minimal cookies that are necessary for the website to
          function properly. These cookies do not collect personal information
          and are deleted when you close your browser.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Google AdSense
        </Typography>
        <Typography variant="body1" paragraph>
          We use Google AdSense to display advertisements on our website. Google
          AdSense may use cookies to serve ads based on your visit to our site
          and other sites on the Internet. Google's use of advertising cookies
          enables it and its partners to serve ads based on your browsing
          patterns.
        </Typography>
        <Typography variant="body1" paragraph>
          You may opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          . Additionally, you can opt out of some third-party vendors' uses of
          cookies for personalized advertising by visiting{" "}
          <a
            href="https://www.aboutads.info"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.aboutads.info
          </a>
          .
        </Typography>
        <Typography variant="body1" paragraph>
          Please note that while we do not collect your personal information,
          third-party advertisers like Google may collect and process certain
          data to provide relevant ads. We encourage you to review Google's
          privacy policy for more information.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Data Security
        </Typography>
        <Typography variant="body1" paragraph>
          Since we do not collect or store personal information, there is no
          risk of your personal data being compromised through our website.
          However, we still implement standard security measures to protect our
          website from malicious activities.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Third-Party Services
        </Typography>
        <Typography variant="body1" paragraph>
          Our website may contain links to third-party websites or services that
          are not owned or controlled by us. We have no control over and assume
          no responsibility for the content, privacy policies, or practices of
          any third-party websites or services.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Children's Privacy
        </Typography>
        <Typography variant="body1" paragraph>
          Our services are intended for general audiences and do not knowingly
          collect any personal information from children under 13. As we do not
          collect personal information from any users, including children, there
          are no special provisions for children's data.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Changes to This Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the "Last Updated" date at the top of this page. You are
          advised to review this Privacy Policy periodically for any changes.
        </Typography>

        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mt: 4, mb: 2 }}
        >
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          If you have any questions about this Privacy Policy, please contact us
          at kanagarajwhb@gmail.com.
        </Typography>
      </Paper>
    </Container>
  );
}
