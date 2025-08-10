const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  publicExcludes: ["!robots.txt", "!sitemap.xml"],
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching: [
    // Cache Google Fonts
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        },
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts-static",
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 365 days
        },
      },
    },
    // Cache images
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache static resources
    {
      urlPattern: /\.(?:js|css)$/i,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    // Cache API routes
    {
      urlPattern: /^https:\/\/kodekit\.in\/api\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
    // Cache pages
    {
      urlPattern: /^https:\/\/kodekit\.in\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
    // Cache external resources
    {
      urlPattern: /^https:\/\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "external-resources",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for better performance
  swcMinify: true,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    styledComponents: true,
  },

  // Image optimization configuration
  images: {
    domains: [
      "localhost",
      "kodekit.in",
      "www.kodekit.in",
      "kxwusbowtdkbunvncsnb.supabase.co",
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Output configuration for static export if needed
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,

  // Experimental features
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "lucide-react",
    ],
  },

  // Configure headers for better SEO and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=300, s-maxage=300",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Configure redirects for old routes if needed
  async redirects() {
    // Temporarily disable redirects to keep tool pages working
    return [];

    return [
      // Legacy route redirects from old Vite application
      {
        source: "/calculator",
        destination: "/tools/calculator",
        permanent: true,
      },

      // Category page redirects
      {
        source: "/pdf-tools",
        destination: "/category/pdf",
        permanent: true,
      },
      {
        source: "/text-tools",
        destination: "/category/text",
        permanent: true,
      },
      {
        source: "/design-tools",
        destination: "/category/design",
        permanent: true,
      },
      {
        source: "/developer-tools",
        destination: "/category/developer",
        permanent: true,
      },
      {
        source: "/math-tools",
        destination: "/category/math",
        permanent: true,
      },
      {
        source: "/finance-tools",
        destination: "/category/finance",
        permanent: true,
      },
      {
        source: "/healthcare-tools",
        destination: "/category/healthcare",
        permanent: true,
      },
      {
        source: "/time-tools",
        destination: "/category/time",
        permanent: true,
      },

      // Legacy tool route redirects (case-sensitive variations)
      {
        source: "/tools/Base64-Encoder-Decoder",
        destination: "/tools/base64-encoder-decoder",
        permanent: true,
      },
      {
        source: "/tools/PDF-Merger",
        destination: "/tools/pdf-merger",
        permanent: true,
      },
      {
        source: "/tools/PDF-Splitter",
        destination: "/tools/pdf-splitter",
        permanent: true,
      },
      {
        source: "/tools/Image-to-PDF-Converter",
        destination: "/tools/image-to-pdf-converter",
        permanent: true,
      },
      {
        source: "/tools/Word-Count",
        destination: "/tools/word-count",
        permanent: true,
      },
      {
        source: "/tools/Text-Case-Converter",
        destination: "/tools/text-case-converter",
        permanent: true,
      },
      {
        source: "/tools/JSON-Formatter",
        destination: "/tools/json-formatter",
        permanent: true,
      },
      {
        source: "/tools/Regex-Tester",
        destination: "/tools/regex-tester",
        permanent: true,
      },
      {
        source: "/tools/Color-Picker",
        destination: "/tools/color-picker",
        permanent: true,
      },
      {
        source: "/tools/QR-Code-Generator",
        destination: "/tools/qr-code-generator",
        permanent: true,
      },

      // Alternative route patterns that might exist
      {
        source: "/tool/:toolName",
        destination: "/tools/:toolName",
        permanent: true,
      },
      // Removed problematic /categories redirect since we have a valid /categories page

      // Removed hash-based redirect as it can cause issues with Next.js routing

      // Redirect common misspellings or variations
      {
        source: "/tools/ppf-calc",
        destination: "/tools/ppf-calculator",
        permanent: true,
      },
      {
        source: "/tools/sip-calc",
        destination: "/tools/sip-calculator",
        permanent: true,
      },
      {
        source: "/tools/ssy-calc",
        destination: "/tools/ssy-calculator",
        permanent: true,
      },
      {
        source: "/tools/swp-calc",
        destination: "/tools/swp-calculator",
        permanent: true,
      },

      // Handle trailing slashes consistently
      {
        source: "/tools/:toolName/",
        destination: "/tools/:toolName",
        permanent: true,
      },
      {
        source: "/category/:categoryId/",
        destination: "/category/:categoryId",
        permanent: true,
      },
    ];
  },

  // Configure rewrites for API routes
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots",
      },
    ];
  },

  // Webpack configuration for additional optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
            priority: 10,
          },
          mui: {
            test: /[\\/]node_modules[\\/]@mui[\\/]/,
            name: "mui",
            chunks: "all",
            priority: 20,
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    // Add support for importing SVGs as React components
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  // Environment variables configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configure TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configure ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = withBundleAnalyzer(withPWA(nextConfig));
