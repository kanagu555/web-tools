import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

interface SEOHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  canonical?: string;
  structuredData?: Array<Record<string, any>>;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({
  title = "KodeKit - Developer Tools & Utilities",
  description = "All-in-one toolkit for developers, designers, and content creators. Secure, fast, and privacy-focused web tools for file processing and development workflows.",
  keywords = "developer tools, web tools, file converter, text tools, image tools, productivity tools, secure tools, privacy-focused",
  image = "https://kodekit.in/og-image.jpg",
  type = "website",
  noindex = false,
  canonical,
  structuredData = [],
}) => {
  const location = useLocation();
  const currentUrl = `https://kodekit.in${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  // Default structured data for the current page
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: currentUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "KodeKit",
      url: "https://kodekit.in",
    },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "ReadAction",
      target: currentUrl,
    },
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="KodeKit" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@kodekit_in" />
      <meta name="twitter:creator" content="@kodekit_in" />

      {/* Additional SEO */}
      <meta name="author" content="KodeKit" />
      <meta name="publisher" content="KodeKit" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />

      {/* Mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />

      {/* Default Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(defaultStructuredData)}
      </script>

      {/* Additional Structured Data */}
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHelmet;
