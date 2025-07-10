import React from "react";
import { Card, Typography, Box, useTheme, CardActionArea } from "@mui/material";
import {
  FileText,
  Text,
  Palette,
  Code,
  FileStack,
  Scissors,
  FileMinus,
  FileEdit,
  AlignCenter,
  Languages,
  TextCursor,
  Quote,
  Image,
  Projector as VectorBezier,
  Braces,
  FileJson,
  Calculator,
  SwatchBook,
  QrCode,
  FileKey2,
  Fingerprint,
  EarthLock,
  ShieldCheck,
  GitCompareArrows,
  CreditCard,
} from "lucide-react";
import { ToolItem } from "../data/toolsData";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

interface ToolCardProps {
  tool: ToolItem;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    const iconProps = {
      size: 24,
      color: theme.palette.primary.main,
      "aria-hidden": true,
    };
    const icons: { [key: string]: React.ReactNode } = {
      "file-text": <FileText {...iconProps} />,
      "file-stack": <FileStack {...iconProps} />,
      scissors: <Scissors {...iconProps} />,
      "file-minus": <FileMinus {...iconProps} />,
      "file-edit": <FileEdit {...iconProps} />,
      text: <Text {...iconProps} />,
      "align-center": <AlignCenter {...iconProps} />,
      languages: <Languages {...iconProps} />,
      "text-cursor": <TextCursor {...iconProps} />,
      quote: <Quote {...iconProps} />,
      palette: <Palette {...iconProps} />,
      image: <Image {...iconProps} />,
      "vector-bezier": <VectorBezier {...iconProps} />,
      braces: <Braces {...iconProps} />,
      code: <Code {...iconProps} />,
      "file-json": <FileJson {...iconProps} />,
      calculator: <Calculator {...iconProps} />,
      "swatch-book": <SwatchBook {...iconProps} />,
      "qr-code": <QrCode {...iconProps} />,
      "file-key-2": <FileKey2 {...iconProps} />,
      fingerprint: <Fingerprint {...iconProps} />,
      "earth-lock": <EarthLock {...iconProps} />,
      "shield-check": <ShieldCheck {...iconProps} />,
      "git-compare-arrows": <GitCompareArrows {...iconProps} />,
      "credit-card": <CreditCard {...iconProps} />,
    };

    return icons[iconName] || <FileText {...iconProps} />;
  };

  const handleClick = () => {
    if (tool.route) {
      navigate(tool.route);
    }
  };

  // Generate JSON-LD for the tool
  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.description,
    applicationCategory: "DeveloperTool",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(toolJsonLd)}</script>
      </Helmet>

      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
            borderColor: theme.palette.primary.main,
            "& .tool-icon": {
              backgroundColor: `${theme.palette.primary.main}20`,
            },
          },
        }}
        onClick={handleClick}
        role="article"
        aria-label={`${tool.title} tool`}
      >
        <CardActionArea
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            height: "100%",
            padding: 2,
            pb: 3,
          }}
          aria-label={`Go to ${tool.title} tool`}
        >
          <Box
            className="tool-icon"
            sx={{
              backgroundColor: theme.palette.background.default,
              borderRadius: 2,
              p: 1.5,
              mb: 2,
              transition: "background-color 0.3s ease",
            }}
            role="img"
            aria-hidden="true"
          >
            {getIcon(tool.icon)}
          </Box>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            fontWeight={600}
            aria-label={`Tool name: ${tool.title}`}
          >
            {tool.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            aria-label={`Tool description: ${tool.description}`}
          >
            {tool.description}
          </Typography>
        </CardActionArea>
      </Card>
    </>
  );
};

export default ToolCard;
