"use client";

import dynamic from "next/dynamic";
import { Skeleton, CircularProgress, Box } from "@mui/material";

// Loading components
const LoadingSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="rectangular" width="100%" height={200} />
    <Skeleton variant="text" sx={{ mt: 1 }} />
    <Skeleton variant="text" width="60%" />
  </Box>
);

const LoadingSpinner = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight={200}
  >
    <CircularProgress />
  </Box>
);

// Lazy-loaded tool components with optimized loading
export const LazyImageToPdfConverter = dynamic(
  () => import("./tools/ImageToPdfConverter"),
  {
    loading: LoadingSkeleton,
    ssr: false, // Disable SSR for file upload components
  }
);

export const LazyPdfMerger = dynamic(() => import("./tools/PdfMerger"), {
  loading: LoadingSkeleton,
  ssr: false,
});

export const LazyPdfSplitter = dynamic(() => import("./tools/PdfSplitter"), {
  loading: LoadingSkeleton,
  ssr: false,
});

export const LazyImageResizer = dynamic(() => import("./tools/ImageResizer"), {
  loading: LoadingSkeleton,
  ssr: false,
});

export const LazyImageCompressor = dynamic(
  () => import("./tools/ImageCompressor"),
  {
    loading: LoadingSkeleton,
    ssr: false,
  }
);

export const LazyColorPicker = dynamic(() => import("./tools/ColorPicker"), {
  loading: LoadingSkeleton,
});

export const LazyQrCodeGenerator = dynamic(
  () => import("./tools/QrCodeGenerator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyGradientGenerator = dynamic(
  () => import("./tools/GradientGenerator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazySvgEditor = dynamic(() => import("./tools/SvgEditor"), {
  loading: LoadingSkeleton,
  ssr: false,
});

// Calculator components
export const LazyPPFCalculator = dynamic(
  () => import("./tools/PPFCalculator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazySIPCalculator = dynamic(
  () => import("./tools/SIPCalculator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazySSYCalculator = dynamic(
  () => import("./tools/SSYCalculator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyRetirementCalculator = dynamic(
  () => import("./tools/RetirementCalculator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazySWPCalculator = dynamic(
  () => import("./tools/SWPCalculator"),
  {
    loading: LoadingSkeleton,
  }
);

// Text tools
export const LazyWordCount = dynamic(() => import("./tools/WordCount"), {
  loading: LoadingSkeleton,
});

export const LazyJsonFormatter = dynamic(
  () => import("./tools/JsonFormatter"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyJsonCompare = dynamic(() => import("./tools/JsonCompare"), {
  loading: LoadingSkeleton,
});

export const LazyBase64EncoderDecoder = dynamic(
  () => import("./tools/Base64EncoderDecoder"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyCssMinifier = dynamic(() => import("./tools/CssMinifier"), {
  loading: LoadingSkeleton,
});

export const LazyFindMyIPAddress = dynamic(
  () => import("./tools/FindMyIPAddress"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyHashGenerator = dynamic(
  () => import("./tools/HashGenerator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyRegexTester = dynamic(() => import("./tools/RegexTester"), {
  loading: LoadingSkeleton,
});

export const LazyLoremIpsumGenerator = dynamic(
  () => import("./tools/LoremIpsumGenerator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyFakeCreditCardGenerator = dynamic(
  () => import("./tools/FakeCreditCardGenerator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyUrlShortenerPro = dynamic(
  () => import("./tools/UrlShortenerPro"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyJwtDecoder = dynamic(() => import("./tools/JwtDecoder"), {
  loading: LoadingSkeleton,
});

export const LazyPasswordGenerator = dynamic(
  () => import("./tools/PasswordGenerator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyUrlEncoderDecoder = dynamic(
  () => import("./tools/UrlEncoderDecoder"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyAdditionTables = dynamic(
  () => import("./tools/AdditionTables"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyMultiplicationTables = dynamic(
  () => import("./tools/MultiplicationTables"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyAgeCalculator = dynamic(
  () => import("./tools/AgeCalculator"),
  {
    loading: LoadingSkeleton,
  }
);

export const LazyEquationSolver = dynamic(
  () => import("./tools/EquationSolver"),
  {
    loading: LoadingSkeleton,
  }
);

// Heavy components that should be loaded on demand
export const LazyChartComponent = dynamic(
  () => import("recharts").then((mod) => ({ default: mod.LineChart })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
) as any;

export const LazyMarkdownEditor = dynamic(() => import("react-markdown"), {
  loading: LoadingSpinner,
  ssr: false,
});

export const LazySyntaxHighlighter = dynamic(
  () =>
    import("react-syntax-highlighter").then((mod) => ({
      default: (mod as any).Prism,
    })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
) as any;

// Social sharing component (only load when needed)
export const LazySocialShare = dynamic(() => import("./SocialShare"), {
  loading: () => <div>Loading sharing options...</div>,
  ssr: false,
});

// Analytics components (load after main content)
export const LazyGoogleAnalytics = dynamic(() => import("./GoogleAnalytics"), {
  ssr: false,
});

export const LazyAdSense = dynamic(() => import("./AdSense"), {
  ssr: false,
});
