import React from "react";
import {
  Container,
  Typography,
  Box,
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
import { toolsData, toolCategories } from "@/lib/data/toolsData";
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
import AdSense from "@/components/AdSense";
import CategoryToolsGrid from "@/components/CategoryToolsGrid";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

// Generate metadata for category pages
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoryId } = await params;
  // Normalize the category ID to ensure consistency
  const normalizedCategoryId = normalizeCategoryId(categoryId);
  const category = toolCategories.find(
    (cat) => cat.id === normalizedCategoryId
  );

  if (!category) {
    return {
      title: "Category Not Found | KodeKit",
      description: "The requested category could not be found.",
      robots: {
        index: false,
        follow: false,
      },
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
    category?.title?.toLowerCase() || "",
    "free online tools",
    "developer tools",
    "web tools",
    "browser tools",
    "no registration required",
    `${category?.title?.toLowerCase() || ""} tools`,
    `online ${category?.title?.toLowerCase() || ""}`,
    ...categoryTools.slice(0, 8).map((tool) => tool.title.toLowerCase()),
    "kodekit",
  ].filter(Boolean);

  return {
    title: getCategoryTitle(normalizedCategoryId, category?.title || ""),
    description: `${category?.description || ""
      }. Explore ${toolCount} free ${category?.title?.toLowerCase() || ""} including ${popularToolsCount} popular tools. All tools work in your browser with no registration required.`,
    keywords: keywords.slice(0, 15), // Limit to 15 keywords
    authors: [{ name: "KodeKit Team" }],
    creator: "KodeKit",
    publisher: "KodeKit",
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: getCategoryTitle(normalizedCategoryId, category?.title || ""),
      description: `${category?.description || ""
        }. Explore ${toolCount} free ${category?.title?.toLowerCase() || ""} tools including ${popularToolsCount} popular tools. All tools work in your browser with no registration required.`,
      type: "website",
      url: categoryUrl,
      siteName: "KodeKit",
      images: [
        {
          url: `${baseUrl}/social/category-${normalizedCategoryId}-og.png`,
          width: 1200,
          height: 630,
          alt: `${getCategoryTitle(
            normalizedCategoryId,
            category?.title || ""
          )} - KodeKit`,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: getCategoryTitle(normalizedCategoryId, category?.title || ""),
      description: `${category?.description || ""
        }. Explore ${toolCount} free ${category?.title?.toLowerCase() || ""} tools. All work in your browser with no registration required.`,
      images: [`${baseUrl}/social/category-${normalizedCategoryId}-og.png`],
      creator: "@kodekit_in",
      site: "@kodekit_in",
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
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  return toolCategories.map((category) => ({
    categoryId: category.id,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  console.log("Category page params:", categoryId);

  // Use the categoryId directly for now
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
            <CategoryToolsGrid
              categoryId={categoryId}
              category={category}
              sortedTools={sortedTools}
              popularTools={popularTools}
            />

            {/* AdSense Ad */}
            <AdSense adSlot="6314421391" />
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

        {/* AdSense Ad */}
        <AdSense adSlot="1775844305" />
      </Container>
    </>
  );
}
