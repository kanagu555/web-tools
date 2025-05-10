import { MetadataRoute } from "next";

// Get all tool routes from your tools array
const getAllRoutes = () => {
  const routes = [
    "",
    "/image-to-pdf-converter",
    "/pdf-merger",
    "/pdf-splitter",
    "/word-count",
    "/text-formatter",
    "/text-translator",
    "/color-palette",
    "/color-picker",
    "/qr-code-generator",
    "/code-formatter",
    "/json-validator",
    "/password-generator",
    "/calculator",
    "/unit-converter",
    "/percentage-calculator",
    "/url-decoder-encoder",
  ];

  return routes;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kodekit.vercel.app";
  const routes = getAllRoutes();

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
