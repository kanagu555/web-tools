import { Metadata } from "next";
import { toolsData, toolCategories } from "@/lib/data/toolsData";
import dynamic from "next/dynamic";
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
const ImageToPdfConverter = dynamic(
  () => import("@/components/tools/ImageToPdfConverter"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const PdfMerger = dynamic(() => import("@/components/tools/PdfMerger"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const PdfSplitter = dynamic(() => import("@/components/tools/PdfSplitter"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

// Import Finance tool components with optimized loading
const PPFCalculator = dynamic(
  () => import("@/components/tools/PPFCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const SIPCalculator = dynamic(
  () => import("@/components/tools/SIPCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const SSYCalculator = dynamic(
  () => import("@/components/tools/SSYCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const SWPCalculator = dynamic(
  () => import("@/components/tools/SWPCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

// Import Text tool components with optimized loading
const WordCount = dynamic(() => import("@/components/tools/WordCount"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const TextCaseConverter = dynamic(
  () => import("@/components/tools/TextCaseConverter"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

// Import Developer tool components with optimized loading
const JsonFormatter = dynamic(
  () => import("@/components/tools/JsonFormatter"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const JsonCompare = dynamic(() => import("@/components/tools/JsonCompare"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const Base64EncoderDecoder = dynamic(
  () => import("@/components/tools/Base64EncoderDecoder"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const CssMinifier = dynamic(() => import("@/components/tools/CssMinifier"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const FindMyIPAddress = dynamic(
  () => import("@/components/tools/FindMyIPAddress"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const HashGenerator = dynamic(
  () => import("@/components/tools/HashGenerator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const JwtDecoder = dynamic(() => import("@/components/tools/JwtDecoder"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const PasswordGenerator = dynamic(
  () => import("@/components/tools/PasswordGenerator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const UrlEncoderDecoder = dynamic(
  () => import("@/components/tools/UrlEncoderDecoder"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const RegexTester = dynamic(() => import("@/components/tools/RegexTester"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

// Import Design tool components with optimized loading
const ColorPicker = dynamic(() => import("@/components/tools/ColorPicker"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const ImageResizer = dynamic(() => import("@/components/tools/ImageResizer"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const QrCodeGenerator = dynamic(
  () => import("@/components/tools/QrCodeGenerator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const GradientGenerator = dynamic(
  () => import("@/components/tools/GradientGenerator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const ImageCompressor = dynamic(
  () => import("@/components/tools/ImageCompressor"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const SvgEditor = dynamic(() => import("@/components/tools/SvgEditor"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const LoremIpsumGenerator = dynamic(
  () => import("@/components/tools/LoremIpsumGenerator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const FakeCreditCardGenerator = dynamic(
  () => import("@/components/tools/FakeCreditCardGenerator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const UrlShortenerPro = dynamic(
  () => import("@/components/tools/UrlShortenerPro"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const AdditionTables = dynamic(
  () => import("@/components/tools/AdditionTables"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const MultiplicationTables = dynamic(
  () => import("@/components/tools/MultiplicationTables"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const AgeCalculator = dynamic(
  () => import("@/components/tools/AgeCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const EquationSolver = dynamic(
  () => import("@/components/tools/EquationSolver"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const Calculator = dynamic(() => import("@/components/tools/Calculator"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

const MatrixCalculator = dynamic(
  () => import("@/components/tools/MatrixCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const StatisticsCalculatorComponent = dynamic(
  () => import("@/components/tools/StatisticsCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const UnitConverter = dynamic(
  () => import("@/components/tools/UnitConverter"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const LoanCalculator = dynamic(
  () => import("@/components/tools/LoanCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const LumpsumCalculator = dynamic(
  () => import("@/components/tools/LumpsumCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const NPSCalculator = dynamic(
  () => import("@/components/tools/NPSCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const MutualFundDetails = dynamic(
  () => import("@/components/tools/MutualFundDetails"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const BloodPressureCalculator = dynamic(
  () => import("@/components/tools/BloodPressureCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const BmiCalculator = dynamic(
  () => import("@/components/tools/BmiCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const CalorieCalculator = dynamic(
  () => import("@/components/tools/CalorieCalculator"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const CountdownTimer = dynamic(
  () => import("@/components/tools/CountdownTimer"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const TimeConverter = dynamic(
  () => import("@/components/tools/TimeConverter"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const TimestampConverter = dynamic(
  () => import("@/components/tools/TimestampConverter"),
  {
    ssr: false,
    loading: () => <ToolLoadingSkeleton />,
  }
);

const Stopwatch = dynamic(() => import("@/components/tools/Stopwatch"), {
  ssr: false,
  loading: () => <ToolLoadingSkeleton />,
});

interface ToolPageProps {
  params: {
    toolName: string;
  };
}

// Generate metadata for each tool page
export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  return generateToolMetadata(params.toolName);
}

// Generate static params for all tools (for static generation)
export async function generateStaticParams() {
  return toolsData
    .filter((tool) => tool.route) // Only include tools with routes
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
    case "ppf-calculator":
      return <PPFCalculator />;
    case "sip-calculator":
      return <SIPCalculator />;
    case "ssy-calculator":
      return <SSYCalculator />;
    case "swp-calculator":
      return <SWPCalculator />;
    case "word-count":
      return <WordCount />;
    case "text-case-converter":
      return <TextCaseConverter />;
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
export default function ToolPage({ params }: ToolPageProps) {
  try {
    // Use the tool name directly without normalization for now
    const tool = getToolByRouteName(params.toolName);

    if (!tool) {
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Tool Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Tool name: {params.toolName}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Available tools:{" "}
                  {toolsData
                    .map((t) => t.route?.split("/").pop())
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const category = toolCategories.find((cat) => cat.id === tool.category);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";

    // Generate structured data for the tool
    const toolSchema = generateToolSchema(tool, params.toolName);

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
      </>
    );
  } catch (error) {
    console.error("Error in ToolPage:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Error Loading Tool
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                There was an error loading the tool: {params.toolName}
              </p>
              <p className="text-sm text-gray-500">
                Error:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
