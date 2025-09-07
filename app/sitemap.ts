import { MetadataRoute } from "next";
import { toolsData, toolCategories } from "@/lib/data/toolsData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.kodekit.in";

  // Base pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sitemap`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Add category pages
  toolCategories.forEach((category) => {
    routes.push({
      url: `${baseUrl}/category/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  });

  // Add tool pages
  toolsData.forEach((tool) => {
    if (tool.route) {
      const toolName = tool.route.split("/").pop();
      if (toolName) {
        routes.push({
          url: `${baseUrl}/tools/${toolName}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: tool.popular ? 0.9 : 0.8,
        });
      }
    }
  });

  return routes;
}
