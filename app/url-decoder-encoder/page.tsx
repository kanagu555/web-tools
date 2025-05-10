import { UrlDecoderEncoder } from "@/components/developerTools/urlDecoderEncoder";
import { Box, Container } from "@mui/material";

export const metadata = {
  title: "URL Encoder & Decoder - KodeKit",
  description: "Encode and decode URLs and query parameters easily",
};

export default function UrlDecoderEncoderPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <UrlDecoderEncoder />
      </Box>
    </Container>
  );
}