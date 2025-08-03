import React from "react";
import { Card, Typography, Box, useTheme, CardActionArea } from "@mui/material";
import {
  FileText,
  FileStack,
  Scissors,
  Text,
  TextCursor,
  Quote,
  Palette,
  Image,
  Projector as VectorBezier,
  SwatchBook,
  QrCode,
  Braces,
  Code,
  FileCode,
  CreditCard,
  GitCompareArrows,
  FileKey2,
  Fingerprint,
  EarthLock,
  ShieldCheck,
  Link2,
  Wifi,
  Hash,
  Calculator,
  Cake,
  Repeat,
  Grid3X3,
  Equal,
  BarChart3,
  X,
  Plus,
  Clock,
  Calendar,
  Timer,
  AlarmClock,
  TrendingUp,
  Baby,
  Heart,
  Weight,
  Flame,
} from "lucide-react";
import { ToolItem } from "../data/toolsData";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { generateWebAppData, generateCanonicalURL } from "../Utils/seoUtils";

interface ToolCardProps {
  tool: ToolItem;
}

/**
 * ToolCard Component with Enhanced SEO Implementation
 *
 * SEO Features Implemented:
 * 1. Comprehensive structured data using generateWebAppData()
 * 2. Microdata attributes for better search engine understanding
 * 3. Prefetch links for faster navigation
 * 4. Tool-specific meta tags for categorization
 * 5. Canonical URLs for proper indexing
 * 6. Accessibility attributes for better user experience
 *
 * Based on: SEOUTILS_IMPLEMENTATION_GUIDE.md & GOOGLE_INDEXING_FIX.md
 */

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
      // PDF Tools
      "file-text": <FileText {...iconProps} />,
      "file-stack": <FileStack {...iconProps} />,
      scissors: <Scissors {...iconProps} />,

      // Text Tools
      text: <Text {...iconProps} />,
      "text-cursor": <TextCursor {...iconProps} />,
      quote: <Quote {...iconProps} />,

      // Design Tools
      palette: <Palette {...iconProps} />,
      image: <Image {...iconProps} />,
      "vector-bezier": <VectorBezier {...iconProps} />,
      "swatch-book": <SwatchBook {...iconProps} />,
      "qr-code": <QrCode {...iconProps} />,

      // Developer Tools
      braces: <Braces {...iconProps} />,
      code: <Code {...iconProps} />,
      "file-code": <FileCode {...iconProps} />,
      "credit-card": <CreditCard {...iconProps} />,
      "git-compare-arrows": <GitCompareArrows {...iconProps} />,
      "file-key-2": <FileKey2 {...iconProps} />,
      fingerprint: <Fingerprint {...iconProps} />,
      "earth-lock": <EarthLock {...iconProps} />,
      "shield-check": <ShieldCheck {...iconProps} />,
      "link-2": <Link2 {...iconProps} />,
      wifi: <Wifi {...iconProps} />,
      hash: <Hash {...iconProps} />,

      // Math Tools
      calculator: <Calculator {...iconProps} />,
      "birthday-cake": <Cake {...iconProps} />,
      repeat: <Repeat {...iconProps} />,
      grid: <Grid3X3 {...iconProps} />,
      equal: <Equal {...iconProps} />,
      "bar-chart": <BarChart3 {...iconProps} />,
      times: <X {...iconProps} />,
      plus: <Plus {...iconProps} />,

      // Time Tools
      clock: <Clock {...iconProps} />,
      calendar: <Calendar {...iconProps} />,
      timer: <Timer {...iconProps} />,
      "alarm-clock": <AlarmClock {...iconProps} />,

      // Finance Tools
      "trending-up": <TrendingUp {...iconProps} />,
      baby: <Baby {...iconProps} />,

      // Healthcare Tools
      heart: <Heart {...iconProps} />,
      weight: <Weight {...iconProps} />,
      flame: <Flame {...iconProps} />,
    };

    return icons[iconName] || <FileText {...iconProps} />;
  };

  const handleClick = () => {
    if (tool.route) {
      navigate(tool.route);
    }
  };

  // Generate comprehensive structured data using SEO utils
  const toolJsonLd = generateWebAppData(
    tool.title,
    tool.description,
    tool.category
  );

  // Generate canonical URL for the tool
  const canonicalUrl = tool.route
    ? generateCanonicalURL(tool.route)
    : undefined;

  return (
    <>
      <Helmet>
        {/* Enhanced structured data for tool cards */}
        <script type="application/ld+json">{JSON.stringify(toolJsonLd)}</script>

        {/* Preconnect to tool page for faster navigation */}
        {tool.route && <link rel="prefetch" href={tool.route} />}

        {/* Tool-specific meta tags for better indexing */}
        <meta name="tool-category" content={tool.category} />
        <meta name="tool-popular" content={tool.popular.toString()} />
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
        // SEO enhancements
        itemScope
        itemType="https://schema.org/WebApplication"
        data-tool-id={tool.id}
        data-tool-category={tool.category}
        data-tool-popular={tool.popular}
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
            itemProp="name"
          >
            {tool.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            aria-label={`Tool description: ${tool.description}`}
            itemProp="description"
          >
            {tool.description}
          </Typography>

          {/* Hidden microdata for SEO */}
          <meta itemProp="applicationCategory" content="DeveloperApplication" />
          <meta itemProp="operatingSystem" content="Any" />
          <meta itemProp="price" content="0" />
          <meta itemProp="priceCurrency" content="USD" />
          {canonicalUrl && <meta itemProp="url" content={canonicalUrl} />}
        </CardActionArea>
      </Card>
    </>
  );
};

export default ToolCard;
