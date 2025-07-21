import React, { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { ThemeProvider, CssBaseline, CircularProgress } from "@mui/material";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import theme from "./theme/theme";
import { createTheme } from "@mui/material/styles";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ToolGrid from "./components/ToolGrid";
import Features from "./components/Features";
import Footer from "./components/Footer";
import { useParams } from "react-router-dom";
import { toolCategories } from "./data/toolsData";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import ScrollToTop from "./components/ScrollToTop";

// Lazy load all page components for better performance
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ImageToPdfConverter = lazy(() => import("./pages/ImageToPdfConverter"));
const PdfMerger = lazy(() => import("./pages/PdfMerger"));
const PdfSplitter = lazy(() => import("./pages/PdfSplitter"));
const WordCount = lazy(() => import("./pages/WordCount"));
const TextFormatter = lazy(() => import("./pages/TextFormatter"));
const TextTranslator = lazy(() => import("./pages/TextTranslator"));
const TextCaseConverter = lazy(() => import("./pages/TextCaseConverter"));
const LoremIpsumGenerator = lazy(() => import("./pages/LoremIpsumGenerator"));
const Calculator = lazy(() => import("./pages/Calculator"));
const UnitConverter = lazy(() => import("./pages/UnitConverter"));
const MatrixCalculator = lazy(() => import("./pages/MatrixCalculator"));
const EquationSolver = lazy(() => import("./pages/EquationSolver"));
const StatisticsCalculator = lazy(() => import("./pages/StatisticsCalculator"));
const ColorPicker = lazy(() => import("./pages/ColorPicker"));
const SvgEditor = lazy(() => import("./pages/SvgEditor"));
const ImageResizer = lazy(() => import("./pages/ImageResizer"));
const GradientGenerator = lazy(() => import("./pages/GradientGenerator"));
const JsonFormatter = lazy(() => import("./pages/JsonFormatter"));
const RegexTester = lazy(() => import("./pages/RegexTester"));
const JwtDecoder = lazy(() => import("./pages/JwtDecoder"));
const FAQ = lazy(() => import("./pages/FAQ"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const MultiplicationTables = lazy(() => import("./pages/MultiplicationTables"));
const AdditionTables = lazy(() => import("./pages/AdditionTables"));
const UrlDecoderEncoder = lazy(() => import("./pages/UrlEncoderDecoder"));
const Base64EncoderDecoder = lazy(() => import("./pages/Base64EncoderDecoder"));
const QrCodeGenerator = lazy(() => import("./pages/QrCodeGenerator"));
const PasswordGenerator = lazy(() => import("./pages/PasswordGenerator"));
const AgeCalculator = lazy(() => import("./pages/AgeCalculator"));
const LoanCalculator = lazy(() => import("./pages/LoanCalculator"));
const SIPCalculator = lazy(() => import("./pages/SIPCalculator"));
const TimeConverter = lazy(() => import("./pages/TimeConverter"));
const JSONCompare = lazy(() => import("./pages/JsonCompare"));
const FindMyIPAddress = lazy(() => import("./pages/FindMyIPAddress"));
const BmiCalculator = lazy(() => import("./pages/BmiCalculator"));
const BloodPressureCalculator = lazy(
  () => import("./pages/BloodPressureCalculator")
);
const CalorieCalculator = lazy(() => import("./pages/CalorieCalculator"));
const CssMinifier = lazy(() => import("./pages/CssMinifier"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const MarkdownEditor = lazy(() => import("./pages/MarkdownEditor"));
const MutualFundDetails = lazy(() => import("./pages/MutualFundDetails"));
const HashGenerator = lazy(() => import("./pages/HashGenerator"));
const ImageCompressor = lazy(() => import("./pages/ImageCompressor"));
const FakeCreditCardGenerator = lazy(
  () => import("./pages/FakeCreditCardGenerator")
);

// const CurrencyConverter = lazy(() => import("./pages/CurrencyConverter"));
// const TimestampConverter = lazy(() => import("./pages/TimestampConverter"));
// const HtmlToTextConverter = lazy(() => import("./pages/HtmlToTextConverter"));
// const HtmlToPdfConverter = lazy(() => import("./pages/HtmlToPdfConverter"));
// const HtmlToImageConverter = lazy(() => import("./pages/HtmlToImageConverter"));

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <h2>Something went wrong.</h2>
          <p>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              background: "#3f51b5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component for Suspense
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "50vh",
    }}
  >
    <CircularProgress />
  </div>
);

// SEO component for dynamic meta tags
const SEO = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  const location = useLocation();

  useEffect(() => {
    // Update meta tags
    document.title = title
      ? `${title} | KodeKit - All-in-One Developer Toolkit`
      : "KodeKit - All-in-One Developer Toolkit";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        description ||
          "KodeKit - All-in-One Developer Toolkit with PDF tools, text formatters, design tools, and more."
      );
    }

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", `https://kodekit.in${location.pathname}`);
    }

    // Update Open Graph and Twitter meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const twitterTitle = document.querySelector(
      'meta[property="twitter:title"]'
    );

    if (ogTitle) {
      ogTitle.setAttribute("content", document.title);
    }

    if (twitterTitle) {
      twitterTitle.setAttribute("content", document.title);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", `https://kodekit.in${location.pathname}`);
    }
  }, [location, title, description]);

  return null;
};

function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  // Load theme preference from localStorage on initial render
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode && (savedMode === "light" || savedMode === "dark")) {
      setMode(savedMode);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const currentTheme = useMemo(
    () =>
      createTheme({
        ...theme,
        palette: {
          ...theme.palette,
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <ErrorBoundary>
          <div className="app">
            <Header toggleTheme={toggleTheme} />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <SEO />
                      <main>
                        <Hero />
                        <ToolGrid />
                        <Features />
                      </main>
                    </>
                  }
                />

                {/* Categories */}
                <Route
                  path="/category/:categoryId"
                  element={<CategoryPageWithSEO />}
                />

                {/* PDF Tools */}
                <Route
                  path="/tools/image-to-pdf-converter"
                  element={
                    <>
                      <SEO
                        title="Image to PDF Converter"
                        description="Convert your images to PDF format online. Free and easy to use."
                      />
                      <ImageToPdfConverter />
                    </>
                  }
                />
                <Route
                  path="/tools/pdf-merger"
                  element={
                    <>
                      <SEO
                        title="PDF Merger"
                        description="Combine multiple PDF files into one document easily."
                      />
                      <PdfMerger />
                    </>
                  }
                />
                <Route
                  path="/tools/pdf-splitter"
                  element={
                    <>
                      <SEO
                        title="PDF Splitter"
                        description="Split PDF files into multiple documents."
                      />
                      <PdfSplitter />
                    </>
                  }
                />

                {/* Text Tools */}
                <Route
                  path="/tools/word-count"
                  element={
                    <>
                      <SEO
                        title="Word Count"
                        description="Count words, characters, sentences, and paragraphs in your text."
                      />
                      <WordCount />
                    </>
                  }
                />
                <Route
                  path="/tools/text-formatter"
                  element={
                    <>
                      <SEO
                        title="Text Formatter"
                        description="Format and beautify your text with various options."
                      />
                      <TextFormatter />
                    </>
                  }
                />
                <Route
                  path="/tools/text-translator"
                  element={
                    <>
                      <SEO
                        title="Text Translator"
                        description="Translate text between multiple languages."
                      />
                      <TextTranslator />
                    </>
                  }
                />
                <Route
                  path="/tools/text-case-converter"
                  element={
                    <>
                      <SEO
                        title="Text Case Converter"
                        description="Convert text between different cases: uppercase, lowercase, title case, and more."
                      />
                      <TextCaseConverter />
                    </>
                  }
                />
                <Route
                  path="/tools/lorem-ipsum-generator"
                  element={
                    <>
                      <SEO
                        title="Lorem Ipsum Generator"
                        description="Generate lorem ipsum placeholder text for your designs and mockups."
                      />
                      <LoremIpsumGenerator />
                    </>
                  }
                />
                <Route
                  path="/tools/markdown-editor"
                  element={
                    <>
                      <SEO
                        title="Markdown Editor"
                        description="Create and edit Markdown documents with live preview, syntax highlighting, and file operations."
                      />
                      <MarkdownEditor />
                    </>
                  }
                />

                {/* Math Tools */}
                <Route
                  path="/tools/calculator"
                  element={
                    <>
                      <SEO
                        title="Calculator"
                        description="Perform complex mathematical calculations online."
                      />
                      <Calculator />
                    </>
                  }
                />
                <Route
                  path="/tools/unit-converter"
                  element={
                    <>
                      <SEO
                        title="Unit Converter"
                        description="Convert between different units of measurement."
                      />
                      <UnitConverter />
                    </>
                  }
                />
                <Route
                  path="/tools/matrix-calculator"
                  element={
                    <>
                      <SEO
                        title="Matrix Calculator"
                        description="Perform matrix operations and calculations."
                      />
                      <MatrixCalculator />
                    </>
                  }
                />
                <Route
                  path="/tools/equation-solver"
                  element={
                    <>
                      <SEO
                        title="Equation Solver"
                        description="Solve mathematical equations step by step."
                      />
                      <EquationSolver />
                    </>
                  }
                />
                <Route
                  path="/tools/statistics-calculator"
                  element={
                    <>
                      <SEO
                        title="Statistics Calculator"
                        description="Calculate statistical measures and analysis."
                      />
                      <StatisticsCalculator />
                    </>
                  }
                />
                <Route
                  path="/tools/multiplication-tables"
                  element={
                    <>
                      <SEO
                        title="Multiplication Tables"
                        description="Generate multiplication tables for your reference."
                      />
                      <MultiplicationTables />
                    </>
                  }
                />
                <Route
                  path="/tools/addition-tables"
                  element={
                    <>
                      <SEO
                        title="Addition Tables"
                        description="Generate addition tables for your reference."
                      />
                      <AdditionTables />
                    </>
                  }
                />
                <Route
                  path="/tools/time-converter"
                  element={
                    <>
                      <SEO
                        title="Time Converter"
                        description="Convert between different time units for financial calculations, interest periods, and payment frequencies."
                      />
                      <TimeConverter />
                    </>
                  }
                />

                {/* Design Tools */}
                <Route
                  path="/tools/color-picker"
                  element={
                    <>
                      <SEO
                        title="Color Picker"
                        description="Select and generate color palettes for your designs."
                      />
                      <ColorPicker />
                    </>
                  }
                />
                <Route
                  path="/tools/svg-editor"
                  element={
                    <>
                      <SEO
                        title="SVG Editor"
                        description="Create and edit SVG graphics online."
                      />
                      <SvgEditor />
                    </>
                  }
                />
                <Route
                  path="/tools/image-resizer"
                  element={
                    <>
                      <SEO
                        title="Image Resizer"
                        description="Resize and optimize images for web and print."
                      />
                      <ImageResizer />
                    </>
                  }
                />
                <Route
                  path="/tools/image-compressor"
                  element={
                    <>
                      <SEO
                        title="Image Compressor"
                        description="Compress images to reduce file size without losing quality."
                      />
                      <ImageCompressor />
                    </>
                  }
                />
                <Route
                  path="/tools/gradient-generator"
                  element={
                    <>
                      <SEO
                        title="Gradient Generator"
                        description="Create beautiful color gradients for your designs."
                      />
                      <GradientGenerator />
                    </>
                  }
                />

                {/* Developer Tools */}
                <Route
                  path="/tools/json-formatter"
                  element={
                    <>
                      <SEO
                        title="JSON Formatter"
                        description="Format, validate, and beautify JSON data."
                      />
                      <JsonFormatter />
                    </>
                  }
                />
                <Route
                  path="/tools/regex-tester"
                  element={
                    <>
                      <SEO
                        title="Regex Tester"
                        description="Test and debug regular expressions with real-time matching."
                      />
                      <RegexTester />
                    </>
                  }
                />
                <Route
                  path="/tools/jwt-decoder"
                  element={
                    <>
                      <SEO
                        title="JWT Decoder"
                        description="Decode and verify JWT tokens."
                      />
                      <JwtDecoder />
                    </>
                  }
                />
                <Route
                  path="/tools/json-compare"
                  element={
                    <>
                      <SEO
                        title="JSON Compare"
                        description="Compare two JSON objects and visualize the differences."
                      />
                      <JSONCompare />
                    </>
                  }
                />
                <Route
                  path="/tools/url-encoder-decoder"
                  element={
                    <>
                      <SEO
                        title="URL Encoder/Decoder"
                        description="Encode and decode URLs for web applications."
                      />
                      <UrlDecoderEncoder />
                    </>
                  }
                />
                <Route
                  path="/tools/Base64-Encoder-Decoder"
                  element={
                    <>
                      <SEO
                        title="Base64 Encoder/Decoder"
                        description="Encode and decode data using Base64 encoding."
                      />
                      <Base64EncoderDecoder />
                    </>
                  }
                />
                <Route
                  path="/tools/password-generator"
                  element={
                    <>
                      <SEO
                        title="Password Generator"
                        description="Generate strong and secure passwords for your accounts."
                      />
                      <PasswordGenerator />
                    </>
                  }
                />
                <Route
                  path="/tools/qr-code-generator"
                  element={
                    <>
                      <SEO
                        title="QR Code Generator"
                        description="Generate QR codes for sharing URLs, text, or contact information."
                      />
                      <QrCodeGenerator />
                    </>
                  }
                />
                <Route
                  path="/tools/age-calculator"
                  element={
                    <>
                      <SEO
                        title="Age Calculator"
                        description="Calculate your age based on your birthdate."
                      />
                      <AgeCalculator />
                    </>
                  }
                />
                <Route
                  path="/tools/css-minifier"
                  element={
                    <>
                      <SEO
                        title="CSS Minifier - Optimize and Compress CSS Code"
                        description="Minify and optimize your CSS code by removing unnecessary characters, whitespace, and comments to reduce file size and improve load times."
                      />
                      <CssMinifier />
                    </>
                  }
                />
                <Route
                  path="/tools/hash-generator"
                  element={
                    <>
                      <SEO
                        title="Hash Generator"
                        description="Generate hashes for data integrity verification and security."
                      />
                      <HashGenerator />
                    </>
                  }
                />
                <Route
                  path="/tools/find-my-ip-address"
                  element={
                    <>
                      <SEO
                        title="Find My IP Address"
                        description="Find your public IP address to track your location and access online services."
                      />
                      <FindMyIPAddress />
                    </>
                  }
                />
                <Route
                  path="/tools/fake-credit-card-generator"
                  element={
                    <>
                      <SEO
                        title="Fake Credit Card Generator"
                        description="Generate fake credit card numbers for testing purposes."
                      />
                      <FakeCreditCardGenerator />
                    </>
                  }
                />

                {/* Finance Tools */}
                <Route
                  path="/tools/loan-calculator"
                  element={
                    <>
                      <SEO
                        title="Loan Calculator"
                        description="Calculate loan payments and interest rates."
                      />
                      <LoanCalculator />
                    </>
                  }
                />
                <Route
                  path="/tools/sip-calculator"
                  element={
                    <>
                      <SEO
                        title="SIP Calculator"
                        description="Calculate returns on Systematic Investment Plans and track wealth growth."
                      />
                      <SIPCalculator />
                    </>
                  }
                />
                <Route
                  path="/tools/mutual-fund-details"
                  element={
                    <>
                      <SEO
                        title="Mutual Fund Details"
                        description="Get detailed information about mutual funds, including returns, investment options, and risk assessment."
                      />
                      <MutualFundDetails />
                    </>
                  }
                />

                <Route
                  path="/tools/bmi-calculator"
                  element={
                    <>
                      <SEO
                        title="BMI Calculator"
                        description="Calculate your Body Mass Index (BMI) and check your weight category."
                      />
                      <BmiCalculator />
                    </>
                  }
                />
                <Route
                  path="/tools/calorie-calculator"
                  element={
                    <>
                      <SEO
                        title="Calorie Calculator - Calculate Daily Calorie Needs"
                        description="Calculate your daily calorie needs based on your age, gender, weight, height, and activity level. Find out how many calories you need for weight loss, maintenance, or weight gain."
                      />
                      <CalorieCalculator />
                    </>
                  }
                />
                <Route
                  path="/tools/blood-pressure-calculator"
                  element={
                    <>
                      <SEO
                        title="Blood Pressure Calculator"
                        description="Calculate your blood pressure category and understand your cardiovascular health with our free online tool."
                      />
                      <BloodPressureCalculator />
                    </>
                  }
                />

                {/* Static Pages */}
                <Route
                  path="/faq"
                  element={
                    <>
                      <SEO
                        title="Frequently Asked Questions"
                        description="Find answers to common questions about KodeKit and its tools."
                      />
                      <FAQ />
                    </>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <>
                      <SEO
                        title="About KodeKit"
                        description="Learn more about KodeKit, our mission, and the team behind the toolkit."
                      />
                      <About />
                    </>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <>
                      <SEO
                        title="Contact Us"
                        description="Get in touch with the KodeKit team for questions, feedback, or support."
                      />
                      <Contact />
                    </>
                  }
                />
                <Route
                  path="/sitemap"
                  element={
                    <>
                      <SEO
                        title="Sitemap"
                        description="Complete sitemap of KodeKit showing all available tools, categories, and pages for easy navigation."
                      />
                      <Sitemap />
                    </>
                  }
                />
                <Route
                  path="/privacy-policy"
                  element={
                    <>
                      <SEO
                        title="Privacy Policy"
                        description="Learn how KodeKit protects your privacy with client-side processing, zero data collection, and transparent practices."
                      />
                      <PrivacyPolicy />
                    </>
                  }
                />
                <Route
                  path="/how-it-works"
                  element={
                    <>
                      <SEO
                        title="How It Works"
                        description="Learn how to use KodeKit's tools and understand our approach to privacy and security."
                      />
                      <HowItWorks />
                    </>
                  }
                />
                {/* Catch-all route for 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Footer />
            <PWAInstallPrompt />
          </div>
        </ErrorBoundary>
        <ScrollToTop />
      </Router>
    </ThemeProvider>
  );
}

const CategoryPageWithSEO = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const categoryTitle =
    toolCategories.find((cat) => cat.id === categoryId)?.title || categoryId;

  return (
    <>
      <SEO
        title={`${categoryTitle} Categories`}
        description="Browse our collection of developer tools by category."
      />
      <CategoryPage />
    </>
  );
};

export default App;
