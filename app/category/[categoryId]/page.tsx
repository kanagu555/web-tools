import React from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import {
  Star as StarIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/Navigation";
import { toolsData, toolCategories, ToolItem } from "@/lib/data/toolsData";
import { getToolIcon } from "@/lib/utils/toolIcons";
import type { Metadata } from "next";
import StructuredData from "@/components/StructuredData";
import {
  generateCategorySchema,
  generateBreadcrumbSchema,
} from "@/lib/utils/structuredData";
import {
  getCategoryCanonicalUrl,
  normalizeCategoryId,
} from "@/lib/utils/canonicalUrl";

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

// Generate metadata for category pages
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  // Normalize the category ID to ensure consistency
  const normalizedCategoryId = normalizeCategoryId(params.categoryId);
  const category = toolCategories.find(
    (cat) => cat.id === normalizedCategoryId
  );

  if (!category) {
    return {
      title: "Category Not Found | KodeKit",
      description: "The requested category could not be found.",
    };
  }

  const categoryTools = toolsData.filter(
    (tool) => tool.category === normalizedCategoryId
  );
  const toolCount = categoryTools.length;
  const popularToolsCount = categoryTools.filter((tool) => tool.popular).length;
  const categoryUrl = getCategoryCanonicalUrl(normalizedCategoryId);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";

  // Generate SEO-optimized category-specific title
  const getCategoryTitle = (
    categoryId: string,
    categoryTitle: string
  ): string => {
    const titleMap: Record<string, string> = {
      pdf: "Free PDF Tools - Convert, Merge, Split & Edit PDFs Online",
      text: "Free Text Tools - Format, Convert & Transform Text Online",
      design: "Free Design Tools - Image Editor, Color Picker & Graphics",
      developer:
        "Free Developer Tools - Code Formatter, JSON & Programming Utils",
      math: "Free Math Tools - Calculators, Equations & Mathematical Solutions",
      finance: "Free Finance Tools - Investment & Financial Calculators",
      healthcare: "Free Health Tools - BMI, Calorie & Medical Calculators",
      time: "Free Time Tools - Date, Timestamp & Time Zone Converters",
    };

    return (
      titleMap[categoryId] ||
      `Free ${categoryTitle} Tools - Online Utilities & Converters`
    );
  };

  // Enhanced keywords with tool names and category-specific terms
  const keywords = [
    category.title.toLowerCase(),
    "free online tools",
    "developer tools",
    "web tools",
    "browser tools",
    "no registration required",
    `${category.title.toLowerCase()} tools`,
    `online ${category.title.toLowerCase()}`,
    ...categoryTools.slice(0, 8).map((tool) => tool.title.toLowerCase()),
    "kodekit",
  ];

  return {
    title: getCategoryTitle(normalizedCategoryId, category.title),
    description: `${
      category.description
    }. Explore ${toolCount} free ${category.title.toLowerCase()} including ${popularToolsCount} popular tools. All tools work in your browser with no registration required.`,
    keywords: keywords.slice(0, 15), // Limit to 15 keywords
    authors: [{ name: "KodeKit Team" }],
    creator: "KodeKit",
    publisher: "KodeKit",
    openGraph: {
      title: `${category.title} - Free Online Tools`,
      description: `${category.description}. ${toolCount} tools available.`,
      type: "website",
      url: categoryUrl,
      siteName: "KodeKit",
      images: [
        {
          url: `${baseUrl}/social/category-${normalizedCategoryId}-og.png`,
          width: 1200,
          height: 630,
          alt: `${category.title} - KodeKit`,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title} - Free Online Tools`,
      description: `${category.description}. ${toolCount} tools available.`,
      images: [
        `${baseUrl}/social/category-${normalizedCategoryId}-twitter.png`,
      ],
      creator: "@kodekit",
    },
    alternates: {
      canonical: categoryUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  return toolCategories.map((category) => ({
    categoryId: category.id,
  }));
}

export default function CategoryPage({ params }: CategoryPageProps) {
  console.log("Category page params:", params);

  // Use the categoryId directly for now
  const categoryId = params.categoryId;
  const category = toolCategories.find((cat) => cat.id === categoryId);

  console.log("Found category:", category);

  if (!category) {
    notFound();
  }

  // Filter and sort tools by category
  const categoryTools = toolsData.filter(
    (tool) => tool.category === categoryId
  );
  const popularTools = categoryTools.filter((tool) => tool.popular);
  const regularTools = categoryTools.filter((tool) => !tool.popular);

  // Sort tools: popular first, then alphabetically
  const sortedTools = [...popularTools, ...regularTools].sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return a.title.localeCompare(b.title);
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";

  // Generate structured data for the category
  const categorySchema = generateCategorySchema(category, categoryId);

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: baseUrl },
    { name: "Categories", url: `${baseUrl}/categories` },
    { name: category.title },
  ]);

  return (
    <>
      <StructuredData data={[categorySchema, breadcrumbSchema]} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Navigation />

        {/* Category Header */}
        <Box mb={6}>
          {/* Icon and Title */}
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            {React.cloneElement(category.icon, {
              sx: { fontSize: 48, color: "primary.main" },
            })}
            <Typography
              variant="h2"
              component="h1"
              className="gradient-text"
              sx={{ mb: 0 }}
            >
              {category.title}
            </Typography>
          </Stack>

          {/* Description aligned with icon */}
          <Box>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
              {category.description}
            </Typography>
          </Box>

          {/* Category Stats */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Chip
                label={`${categoryTools.length} tools available`}
                color="primary"
                variant="filled"
                icon={<FilterListIcon />}
              />
              {popularTools.length > 0 && (
                <Chip
                  label={`${popularTools.length} popular`}
                  variant="filled"
                  icon={
                    <StarIcon
                      sx={{
                        fontSize: 16,
                        color: "#000 !important",
                      }}
                    />
                  }
                  sx={{
                    backgroundColor: "#FFD700",
                    color: "#000 !important",
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>

            <Typography variant="body2" color="text.secondary">
              All tools are free and require no registration
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Tools Grid */}
        {sortedTools.length > 0 ? (
          <>
            {/* All Tools Section */}
            <Box>
              <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ mb: 3 }}
              >
                {popularTools.length > 0
                  ? `All ${category.title}`
                  : category.title}
              </Typography>
              <Grid container spacing={3}>
                {sortedTools.map((tool) => (
                  <Grid item xs={12} sm={6} md={4} key={tool.id}>
                    <ToolCard tool={tool} category={category} />
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Divider sx={{ mt: 8 }} />

            {/* Related Categories */}
            <Box mt={8}>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Explore Other Categories
              </Typography>
              <Grid container spacing={2}>
                {toolCategories
                  .filter((cat) => cat.id !== categoryId)
                  .slice(0, 4)
                  .map((relatedCategory) => {
                    const relatedToolCount = toolsData.filter(
                      (tool) => tool.category === relatedCategory.id
                    ).length;
                    return (
                      <Grid item xs={12} sm={6} md={3} key={relatedCategory.id}>
                        <Card
                          sx={{
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: 2,
                            },
                          }}
                        >
                          <CardActionArea
                            component={Link}
                            href={`/category/${relatedCategory.id}`}
                          >
                            <CardContent sx={{ textAlign: "center", py: 2 }}>
                              {React.cloneElement(relatedCategory.icon, {
                                sx: {
                                  fontSize: 24,
                                  color: "primary.main",
                                  mb: 1,
                                },
                              })}
                              <Typography
                                variant="subtitle2"
                                component="h3"
                                gutterBottom
                              >
                                {relatedCategory.title}
                              </Typography>
                              <Chip
                                label={`${relatedToolCount} tools`}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
          </>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="h5" gutterBottom>
              No Tools Available
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Tools for this category are coming soon.
            </Typography>
            <Button
              component={Link}
              href="/categories"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Browse Other Categories
            </Button>
          </Box>
        )}
      </Container>
    </>
  );
}

// Tool Card Component
interface ToolCardProps {
  tool: ToolItem;
  category: (typeof toolCategories)[0];
  isPopular?: boolean;
}

function ToolCard({ tool, category, isPopular = false }: ToolCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        transition: "all 0.3s ease-in-out",
        border: isPopular ? "2px solid" : "1px solid",
        borderColor: isPopular ? "warning.main" : "divider",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isPopular ? 6 : 4,
          borderColor: isPopular ? "warning.dark" : "primary.main",
        },
      }}
    >
      {/* Popular Star Badge - Top Right Corner */}
      {tool.popular && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 2,
            backgroundColor: "#FFD700",
            borderRadius: "50%",
            width: 28,
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
          }}
        >
          <StarIcon
            sx={{
              fontSize: 16,
              color: "#000",
            }}
          />
        </Box>
      )}

      <CardActionArea
        component={Link}
        href={tool.route || "#"}
        sx={{ height: "100%", p: 0 }}
      >
        <CardContent
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: 3,
          }}
        >
          {/* Tool Icon and Title */}
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            {getToolIcon(tool.icon)}
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontWeight: isPopular ? 600 : 500,
                }}
              >
                {tool.title}
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flexGrow: 1,
              mb: 3,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {tool.description}
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              label={category.title}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Typography variant="body2" color="primary.main" fontWeight={500}>
              Try Now →
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
