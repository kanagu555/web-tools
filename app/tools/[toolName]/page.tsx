import { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolsData, toolCategories } from "@/lib/data/toolsData";
import dynamicImport from "next/dynamic";
import StructuredData from "@/components/StructuredData";
import ToolLoadingSkeleton from "@/components/ToolLoadingSkeleton";
import {
  generateToolSchema,
  generateBreadcrumbSchema,
} from "@/lib/utils/structuredData";
import {
  generateToolMetadata,
  getToolByRouteName,
} from "@/lib/utils/toolMetadata";

// Import PDF tool components with optimized loading
const ImageToPdfConverter = dynamicImport(
  () => import("@/components/tools/ImageToPdfConverter"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const PdfMerger = dynamicImport(() => import("@/components/tools/PdfMerger"), {
  loading: () => <ToolLoadingSkeleton />,
});

const PdfSplitter = dynamicImport(() => import("@/components/tools/PdfSplitter"), {
  loading: () => <ToolLoadingSkeleton />,
});

const PdfPageRotator = dynamicImport(
  () => import("@/components/tools/PdfPageRotator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const PdfMetadataEditor = dynamicImport(
  () => import("@/components/tools/PdfMetadataEditor"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

// Import Finance tool components with optimized loading
const PPFCalculator = dynamicImport(
  () => import("@/components/tools/PPFCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const SIPCalculator = dynamicImport(
  () => import("@/components/tools/SIPCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const SSYCalculator = dynamicImport(
  () => import("@/components/tools/SSYCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const RetirementCalculator = dynamicImport(
  () => import("@/components/tools/RetirementCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const SWPCalculator = dynamicImport(
  () => import("@/components/tools/SWPCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

// Import Text tool components with optimized loading
const WordCount = dynamicImport(() => import("@/components/tools/WordCount"), {
  loading: () => <ToolLoadingSkeleton />,
});

const TextCaseConverter = dynamicImport(
  () => import("@/components/tools/TextCaseConverter"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const TextCompare = dynamicImport(() => import("@/components/tools/TextCompare"), {
  loading: () => <ToolLoadingSkeleton />,
});

// Add the new import here
const SpaceToNewlineConverter = dynamicImport(
  () => import("@/components/tools/SpaceToNewlineConverter"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

// Import Developer tool components with optimized loading
const JsonFormatter = dynamicImport(
  () => import("@/components/tools/JsonFormatter"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const JsonCompare = dynamicImport(() => import("@/components/tools/JsonCompare"), {
  loading: () => <ToolLoadingSkeleton />,
});

const Base64EncoderDecoder = dynamicImport(
  () => import("@/components/tools/Base64EncoderDecoder"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const CssMinifier = dynamicImport(() => import("@/components/tools/CssMinifier"), {
  loading: () => <ToolLoadingSkeleton />,
});

const FindMyIPAddress = dynamicImport(
  () => import("@/components/tools/FindMyIPAddress"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const HashGenerator = dynamicImport(
  () => import("@/components/tools/HashGenerator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const JwtDecoder = dynamicImport(() => import("@/components/tools/JwtDecoder"), {
  loading: () => <ToolLoadingSkeleton />,
});

const PasswordGenerator = dynamicImport(
  () => import("@/components/tools/PasswordGenerator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const UrlEncoderDecoder = dynamicImport(
  () => import("@/components/tools/UrlEncoderDecoder"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const RegexTester = dynamicImport(() => import("@/components/tools/RegexTester"), {
  loading: () => <ToolLoadingSkeleton />,
});

const XmlToJsonConverter = dynamicImport(
  () => import("@/components/tools/XmlToJsonConverter"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const ApiTester = dynamicImport(() => import("@/components/tools/ApiTester"), {
  loading: () => <ToolLoadingSkeleton />,
});

const JavaScriptPlayground = dynamicImport(
  () => import("@/components/tools/JavaScriptPlayground"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

// Import Design tool components with optimized loading
const ColorPicker = dynamicImport(() => import("@/components/tools/ColorPicker"), {
  loading: () => <ToolLoadingSkeleton />,
});

const ImageResizer = dynamicImport(() => import("@/components/tools/ImageResizer"), {
  loading: () => <ToolLoadingSkeleton />,
});

const QrCodeGenerator = dynamicImport(
  () => import("@/components/tools/QrCodeGenerator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const GradientGenerator = dynamicImport(
  () => import("@/components/tools/GradientGenerator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const ImageCompressor = dynamicImport(
  () => import("@/components/tools/ImageCompressor"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const SvgEditor = dynamicImport(() => import("@/components/tools/SvgEditor"), {
  loading: () => <ToolLoadingSkeleton />,
});

const YoutubeThumbnailDownloader = dynamicImport(
  () => import("@/components/tools/YoutubeThumbnailDownloader"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const ChromeExtensionIconGenerator = dynamicImport(
  () => import("@/components/tools/ChromeExtensionIconGenerator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const LoremIpsumGenerator = dynamicImport(
  () => import("@/components/tools/LoremIpsumGenerator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const FakeCreditCardGenerator = dynamicImport(
  () => import("@/components/tools/FakeCreditCardGenerator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const UrlShortenerPro = dynamicImport(
  () => import("@/components/tools/UrlShortenerPro"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const AdditionTables = dynamicImport(
  () => import("@/components/tools/AdditionTables"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const MultiplicationTables = dynamicImport(
  () => import("@/components/tools/MultiplicationTables"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const AgeCalculator = dynamicImport(
  () => import("@/components/tools/AgeCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const EquationSolver = dynamicImport(
  () => import("@/components/tools/EquationSolver"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const Calculator = dynamicImport(() => import("@/components/tools/Calculator"), {
  loading: () => <ToolLoadingSkeleton />,
});

const MatrixCalculator = dynamicImport(
  () => import("@/components/tools/MatrixCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const StatisticsCalculatorComponent = dynamicImport(
  () => import("@/components/tools/StatisticsCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const PercentageCalculator = dynamicImport(
  () => import("@/components/tools/PercentageCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const UnitConverter = dynamicImport(
  () => import("@/components/tools/UnitConverter"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const LoanCalculator = dynamicImport(
  () => import("@/components/tools/LoanCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const LumpsumCalculator = dynamicImport(
  () => import("@/components/tools/LumpsumCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const NPSCalculator = dynamicImport(
  () => import("@/components/tools/NPSCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const MutualFundDetails = dynamicImport(
  () => import("@/components/tools/MutualFundDetails"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const BloodPressureCalculator = dynamicImport(
  () => import("@/components/tools/BloodPressureCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const BmiCalculator = dynamicImport(
  () => import("@/components/tools/BmiCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const CalorieCalculator = dynamicImport(
  () => import("@/components/tools/CalorieCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const CountdownTimer = dynamicImport(
  () => import("@/components/tools/CountdownTimer"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const TimeConverter = dynamicImport(
  () => import("@/components/tools/TimeConverter"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const TimestampConverter = dynamicImport(
  () => import("@/components/tools/TimestampConverter"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const Stopwatch = dynamicImport(() => import("@/components/tools/Stopwatch"), {
  loading: () => <ToolLoadingSkeleton />,
});

const GoldCalculator = dynamicImport(
  () => import("@/components/tools/GoldCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const FDCalculator = dynamicImport(
  () => import("@/components/tools/FDCalculator"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);

const HistoricalIndexData = dynamicImport(
  () => import("@/components/tools/HistoricalIndexData"),
  {
    loading: () => <ToolLoadingSkeleton />,
  }
);


const CommentsComponent = dynamicImport(() => import("@/components/Comments"), {
  loading: () => <></>,
});

interface ToolPageProps {
  params: Promise<{
    toolName: string;
  }>;
}

// Generate metadata for each tool page
export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { toolName } = await params;
  return generateToolMetadata(toolName);
}

// Configure dynamic rendering for tools that need browser APIs
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

// Generate static params for all tools (for static generation)
export async function generateStaticParams() {
  // Only generate static pages for tools that don't use browser-only APIs
  const browserOnlyTools = [
    'pdf-page-rotator',
    'pdf-merger',
    'pdf-splitter',
    'pdf-converter',
    'pdf-metadata-editor',
  ];

  return toolsData
    .filter((tool) => tool.route && !browserOnlyTools.includes(tool.id)) // Exclude browser-only tools
    .map((tool) => {
      const toolName = tool.route!.split("/").pop();
      return {
        toolName: toolName!,
      };
    });
}

// Helper function to render the appropriate tool component
function renderToolComponent(toolId: string) {
  switch (toolId) {
    case "pdf-converter":
      return <ImageToPdfConverter />;
    case "pdf-merger":
      return <PdfMerger />;
    case "pdf-splitter":
      return <PdfSplitter />;
    case "pdf-page-rotator":
      return <PdfPageRotator />;
    case "pdf-metadata-editor":
      return <PdfMetadataEditor />;
    case "ppf-calculator":
      return <PPFCalculator />;
    case "sip-calculator":
      return <SIPCalculator />;
    case "ssy-calculator":
      return <SSYCalculator />;
    case "retirement-calculator":
      return <RetirementCalculator />;
    case "swp-calculator":
      return <SWPCalculator />;
    case "word-count":
      return <WordCount />;
    case "text-case-converter":
      return <TextCaseConverter />;
    case "text-compare":
      return <TextCompare />;
    case "space-to-newline-converter":
      return <SpaceToNewlineConverter />;
    case "json-formatter":
      return <JsonFormatter />;
    case "json-compare":
      return <JsonCompare />;
    case "base64-encoder-decoder":
      return <Base64EncoderDecoder />;
    case "css-minifier":
      return <CssMinifier />;
    case "find-my-ip-address":
      return <FindMyIPAddress />;
    case "hash-generator":
      return <HashGenerator />;
    case "jwt-decoder":
      return <JwtDecoder />;
    case "password-generator":
      return <PasswordGenerator />;
    case "url-encoder-decoder":
      return <UrlEncoderDecoder />;
    case "regex-tester":
      return <RegexTester />;
    case "xml-to-json-converter":
      return <XmlToJsonConverter />;
    case "api-tester-online":
      return <ApiTester />;
    case "color-picker":
      return <ColorPicker />;
    case "image-resizer":
      return <ImageResizer />;
    case "qr-code-generator":
      return <QrCodeGenerator />;
    case "gradient-generator":
      return <GradientGenerator />;
    case "image-compressor":
      return <ImageCompressor />;
    case "svg-editor":
      return <SvgEditor />;
    case "lorem-ipsum-generator":
      return <LoremIpsumGenerator />;
    case "fake-credit-card-generator":
      return <FakeCreditCardGenerator />;
    case "url-shortener-pro":
      return <UrlShortenerPro />;
    case "addition-tables":
      return <AdditionTables />;
    case "multiplication-tables":
      return <MultiplicationTables />;
    case "age-calculator":
      return <AgeCalculator />;
    case "equation-solver":
      return <EquationSolver toolName="equation-solver" />;
    case "calculator":
      return <Calculator />;
    case "matrix-calculator":
      return <MatrixCalculator />;
    case "statistics-calculator":
      return <StatisticsCalculatorComponent />;
    case "percentage-calculator":
      return <PercentageCalculator />;
    case "unit-converter":
      return <UnitConverter />;
    case "loan-calculator":
      return <LoanCalculator />;
    case "lumpsum-calculator":
      return <LumpsumCalculator />;
    case "nps-calculator":
      return <NPSCalculator />;
    case "mutual-fund-details":
      return <MutualFundDetails />;
    case "blood-pressure-calculator":
      return <BloodPressureCalculator />;
    case "bmi-calculator":
      return <BmiCalculator />;
    case "calorie-calculator":
      return <CalorieCalculator />;
    case "countdown-timer":
      return <CountdownTimer />;
    case "time-converter":
      return <TimeConverter />;
    case "timestamp-converter":
      return <TimestampConverter />;
    case "stopwatch":
      return <Stopwatch />;
    case "youtube-thumbnail-downloader":
      return <YoutubeThumbnailDownloader />;
    case "chrome-extension-icon-generator":
      return <ChromeExtensionIconGenerator />;
    case "gold-calculator":
      return <GoldCalculator />;
    case "fd-calculator":
      return <FDCalculator />;
    case "historical-index-data":
      return <HistoricalIndexData />;
    case "javascript-playground":
      return <JavaScriptPlayground />;
    default:
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Tool Under Migration
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  This tool is currently being migrated to Next.js. The
                  functionality will be available soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

// Tool page component
export default async function ToolPage({ params }: ToolPageProps) {
  try {
    const { toolName } = await params;

    // Use the tool name directly without normalization for now
    const tool = getToolByRouteName(toolName);

    if (!tool) {
      notFound();
    }

    const category = toolCategories.find((cat) => cat.id === tool.category);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";

    // Generate structured data for the tool
    const toolSchema = generateToolSchema(tool, toolName);

    // Generate breadcrumb structured data
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: baseUrl },
      { name: "Tools", url: `${baseUrl}/categories` },
      {
        name: category?.title || "Category",
        url: `${baseUrl}/category/${tool.category}`,
      },
      { name: tool.title },
    ]);

    return (
      <>
        <StructuredData data={[toolSchema, breadcrumbSchema]} />
        {renderToolComponent(tool.id)}
        <CommentsComponent toolName={tool.id} />
      </>
    );
  } catch (error) {
    console.error("Error in ToolPage:", error);
    // If there's an error (like tool not found), redirect to not-found
    notFound();
  }
}
