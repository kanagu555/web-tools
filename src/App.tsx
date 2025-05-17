import React, { useState, useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./theme/theme";
import { createTheme } from "@mui/material/styles";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ToolGrid from "./components/ToolGrid";
import Features from "./components/Features";
import Footer from "./components/Footer";
import CategoryPage from "./pages/CategoryPage";
import ImageToPdfConverter from "./pages/ImageToPdfConverter";
import PdfMerger from "./pages/PdfMerger";
import PdfSplitter from "./pages/PdfSplitter";
import WordCount from "./pages/WordCount";
import TextFormatter from "./pages/TextFormatter";
import TextTranslator from "./pages/TextTranslator";
import TextCaseConverter from "./pages/TextCaseConverter";
import LoremIpsumGenerator from "./pages/LoremIpsumGenerator";
import Calculator from "./pages/Calculator";
import UnitConverter from "./pages/UnitConverter";
import MatrixCalculator from "./pages/MatrixCalculator";
import EquationSolver from "./pages/EquationSolver";
import StatisticsCalculator from "./pages/StatisticsCalculator";
import FAQ from "./pages/FAQ";

function App() {
  const [mode, setMode] = useState<"light" | "dark">("dark");

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
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
        <div className="app">
          <Header toggleTheme={toggleTheme} />
          <Routes>
            <Route
              path="/"
              element={
                <main>
                  <Hero />
                  <ToolGrid />
                  <Features />
                </main>
              }
            />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route
              path="/tools/image-to-pdf"
              element={<ImageToPdfConverter />}
            />
            <Route path="/tools/pdf-merger" element={<PdfMerger />} />
            <Route path="/tools/pdf-splitter" element={<PdfSplitter />} />
            <Route path="/tools/word-count" element={<WordCount />} />
            <Route path="/tools/text-formatter" element={<TextFormatter />} />
            <Route path="/tools/text-translator" element={<TextTranslator />} />
            <Route
              path="/tools/text-case-converter"
              element={<TextCaseConverter />}
            />
            <Route
              path="/tools/lorem-ipsum"
              element={<LoremIpsumGenerator />}
            />
            <Route path="/tools/calculator" element={<Calculator />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route
              path="/tools/matrix-calculator"
              element={<MatrixCalculator />}
            />
            <Route path="/tools/equation-solver" element={<EquationSolver />} />
            <Route
              path="/tools/statistics-calculator"
              element={<StatisticsCalculator />}
            />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
