// SEO utility functions for KodeKit

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: string;
  canonical?: string;
}

// Generate enhanced SEO data for tool pages with rich social media metadata
export const generateToolSEO = (
  toolName: string, 
  toolDescription: string, 
  category: string,
  options?: {
    emoji?: string;
    subtitle?: string;
    benefits?: string[];
    customImage?: string;
  }
): SEOData => {
  const { emoji = "", subtitle = "", benefits = [], customImage } = options || {};
  
  const title = `${toolName} - ${subtitle || 'Free Online Tool'} | KodeKit`;
  const enhancedDescription = `${emoji} ${toolDescription}${benefits.length > 0 ? '. ' + benefits.join(', ') : ''}. Free, secure, and privacy-focused ${toolName.toLowerCase()} tool. No registration required, works offline.`;
  const keywords = `${toolName.toLowerCase()}, ${category} tools, online ${toolName.toLowerCase()}, free ${toolName.toLowerCase()}, web tools, developer tools, kodekit`;
  
  // Use custom image or generate a sample placeholder URL
  const imageUrl = customImage || `https://via.placeholder.com/1200x630/1976d2/ffffff?text=${encodeURIComponent(toolName)}`;
  
  return {
    title,
    description: enhancedDescription,
    keywords,
    image: imageUrl,
    type: 'article',
  };
};

// Generate SEO data for category pages
export const generateCategorySEO = (category: string, toolCount: number): SEOData => {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  const title = `${categoryName} Tools - ${toolCount} Free Online Tools | KodeKit`;
  const description = `Discover ${toolCount} free ${category} tools for developers and creators. Secure, fast, and privacy-focused web tools that work offline.`;
  const keywords = `${category} tools, online ${category} tools, free ${category} tools, web ${category} tools, developer tools, kodekit`;
  
  return {
    title,
    description,
    keywords,
    image: `https://kodekit.in/images/categories/${category}.webp`,
    type: 'website',
  };
};

// Generate breadcrumb structured data
export const generateBreadcrumbData = (breadcrumbs: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
};

// Generate FAQ structured data
export const generateFAQData = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
};

// Generate HowTo structured data for tools
export const generateHowToData = (toolName: string, steps: Array<{ name: string; text: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${toolName}`,
    description: `Step-by-step guide on how to use the ${toolName} tool on KodeKit`,
    supply: [
      {
        "@type": "HowToSupply",
        name: "Web Browser",
      },
    ],
    tool: [
      {
        "@type": "HowToTool",
        name: toolName,
      },
    ],
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
};

// Generate enhanced WebApplication structured data for tools
export const generateWebAppData = (
  toolName: string, 
  toolDescription: string, 
  category: string,
  options?: {
    url?: string;
    features?: string[];
    applicationCategory?: string;
    customImage?: string;
  }
) => {
  const { url, features = [], applicationCategory, customImage } = options || {};
  
  const defaultFeatures = [
    "Free to use",
    "No registration required", 
    "Privacy-focused",
    "Works offline",
    "Secure processing",
  ];
  
  const allFeatures = features.length > 0 ? [...defaultFeatures, ...features] : defaultFeatures;
  const appCategory = applicationCategory || (category === 'finance' ? 'FinanceApplication' : 'DeveloperApplication');
  const toolUrl = url || `https://kodekit.in/tools/${toolName.toLowerCase().replace(/\s+/g, '-')}`;
  const imageUrl = customImage || `https://via.placeholder.com/1200x630/1976d2/ffffff?text=${encodeURIComponent(toolName)}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: toolName,
    description: toolDescription,
    applicationCategory: appCategory,
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript. Requires HTML5.",
    permissions: "No special permissions required",
    storageRequirements: "No storage required - processes data locally",
    memoryRequirements: "Minimal memory usage",
    processorRequirements: "Any modern processor",
    url: toolUrl,
    author: {
      "@type": "Organization",
      name: "KodeKit",
      url: "https://kodekit.in",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: allFeatures,
    screenshot: imageUrl,
    softwareVersion: "1.0",
    releaseNotes: "Enhanced version with improved functionality",
  };
};

// Validate and clean URLs for sitemap
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generate canonical URL
export const generateCanonicalURL = (path: string): string => {
  const baseURL = 'https://kodekit.in';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseURL}${cleanPath}`;
};

// Check if page should be indexed
export const shouldIndexPage = (path: string): boolean => {
  const noIndexPaths = [
    '/404',
    '/error',
    '/admin',
    '/api',
    '/test',
    '/dev',
  ];
  
  return !noIndexPaths.some(noIndexPath => path.startsWith(noIndexPath));
};