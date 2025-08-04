import { useEffect } from "react";

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  image: string;
  type?: string;
  url?: string;
}

export const useSEO = (seoData: SEOData) => {
  useEffect(() => {
    // Update document title immediately
    document.title = seoData.title;

    // Function to update or create meta tag
    const updateMetaTag = (
      selector: string,
      attribute: string,
      content: string
    ) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        if (attribute === "property") {
          element.setAttribute(
            "property",
            selector.replace('meta[property="', "").replace('"]', "")
          );
        } else {
          element.setAttribute(
            "name",
            selector.replace('meta[name="', "").replace('"]', "")
          );
        }
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Update basic meta tags
    updateMetaTag('meta[name="title"]', "name", seoData.title);
    updateMetaTag('meta[name="description"]', "name", seoData.description);
    updateMetaTag('meta[name="keywords"]', "name", seoData.keywords);

    // Update Open Graph tags
    updateMetaTag('meta[property="og:title"]', "property", seoData.title);
    updateMetaTag(
      'meta[property="og:description"]',
      "property",
      seoData.description
    );
    updateMetaTag('meta[property="og:image"]', "property", seoData.image);
    updateMetaTag(
      'meta[property="og:type"]',
      "property",
      seoData.type || "website"
    );
    updateMetaTag(
      'meta[property="og:url"]',
      "property",
      seoData.url || window.location.href
    );
    updateMetaTag('meta[property="og:site_name"]', "property", "KodeKit");
    updateMetaTag('meta[property="og:image:width"]', "property", "1200");
    updateMetaTag('meta[property="og:image:height"]', "property", "630");

    // Update Twitter tags
    updateMetaTag('meta[name="twitter:card"]', "name", "summary_large_image");
    updateMetaTag('meta[name="twitter:title"]', "name", seoData.title);
    updateMetaTag(
      'meta[name="twitter:description"]',
      "name",
      seoData.description
    );
    updateMetaTag('meta[name="twitter:image"]', "name", seoData.image);
    updateMetaTag('meta[name="twitter:site"]', "name", "@kodekit_in");

    // Cleanup function to restore defaults when component unmounts
    return () => {
      document.title = "KodeKit - All-in-One Developer Toolkit";
    };
  }, [
    seoData.title,
    seoData.description,
    seoData.keywords,
    seoData.image,
    seoData.type,
    seoData.url,
  ]);
};
