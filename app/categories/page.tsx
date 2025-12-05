import { Container, Typography, Box, Stack } from "@mui/material";
import Navigation from "@/components/Navigation";
import { toolsData, toolCategories } from "@/lib/data/toolsData";
import StructuredData from "@/components/StructuredData";
import AdSense from "@/components/AdSense";
import CategoriesGrid from "@/components/CategoriesGrid";
import { Metadata } from "next";

// Generate metadata for categories page
export const metadata: Metadata = {
  title: "Tool Categories - Browse All Developer Tools | KodeKit",
  description:
    "Browse all tool categories on KodeKit. Explore PDF tools, text formatters, calculators, design tools, developer utilities, and more. 50+ free online tools organized by category.",
  keywords: [
    "tool categories",
    "developer tools",
    "online tools",
    "pdf tools",
    "text tools",
    "design tools",
    "calculator tools",
    "developer utilities",
    "web tools",
    "free tools",
    "kodekit categories",
  ],
  authors: [{ name: "KodeKit Team" }],
  creator: "KodeKit",
  publisher: "KodeKit",
  openGraph: {
    title: "Tool Categories - Browse All Developer Tools",
    description:
      "Browse all tool categories on KodeKit. 50+ free online tools organized by category.",
    type: "website",
    url: `${
      process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in"
    }/categories`,
    siteName: "KodeKit",
    images: [
      {
        url: `${
          process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in"
        }/social/kodekit.png`,
        width: 1200,
        height: 630,
        alt: "KodeKit Tool Categories",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tool Categories - Browse All Developer Tools",
    description:
      "Browse all tool categories on KodeKit. 50+ free online tools organized by category.",
    images: [
      `${
        process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in"
      }/social/kodekit.png`,
    ],
    creator: "@kodekit",
  },
  alternates: {
    canonical: `${
      process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in"
    }/categories`,
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

export default function CategoriesPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";

  // Count tools per category
  const getCategoryToolCount = (categoryId: string) => {
    return toolsData.filter((tool) => tool.category === categoryId).length;
  };

  // Generate structured data for categories page
  const categoriesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Tool Categories",
    description:
      "Browse all tool categories on KodeKit - 50+ free online tools organized by category",
    url: `${baseUrl}/categories`,
    mainEntity: {
      "@type": "ItemList",
      name: "Tool Categories",
      numberOfItems: toolCategories.length,
      itemListElement: toolCategories.map((category, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CollectionPage",
          name: category.title,
          description: category.description,
          url: `${baseUrl}/category/${category.id}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: getCategoryToolCount(category.id),
          },
        },
      })),
    },
  };

  return (
    <>
      <StructuredData data={categoriesSchema} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Navigation />

        {/* Page Header */}
        <Box mb={6} textAlign="center">
          <Typography
            variant="h2"
            component="h1"
            className="gradient-text"
            gutterBottom
          >
            Tool Categories
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Explore our comprehensive collection of developer tools organized by
            category
          </Typography>
        </Box>

        {/* Categories Grid */}
        <CategoriesGrid />

        {/* AdSense Ad */}
        <AdSense adSlot="6314421391" />

        {/* Summary Stats */}
        <Box mt={8} textAlign="center">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3" color="primary.main" fontWeight={700}>
                {toolCategories.length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Categories
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" color="secondary.main" fontWeight={700}>
                {toolsData.length}+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Tools
              </Typography>
            </Box>
            <Box>
              <Typography variant="h3" color="warning.main" fontWeight={700}>
                {toolsData.filter((tool) => tool.popular).length}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Popular Tools
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
