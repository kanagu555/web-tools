#!/usr/bin/env node

/**
 * SEO Validation Script for KodeKit Next.js Migration
 *
 * This script validates:
 * 1. Server-side rendering and meta tag generation
 * 2. Open Graph and Twitter Card data
 * 3. Search engine crawling and indexing readiness
 * 4. Structured data implementation
 */

const fs = require("fs");
const path = require("path");

// ANSI color codes for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

class SEOValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: [],
    };
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kodekit.in";
  }

  log(message, type = "info") {
    const timestamp = new Date().toISOString();
    const colorMap = {
      info: colors.blue,
      success: colors.green,
      warning: colors.yellow,
      error: colors.red,
      header: colors.magenta,
    };

    console.log(`${colorMap[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async runTest(testName, testFunction) {
    this.log(`Running: ${testName}`, "info");
    try {
      const result = await testFunction();
      if (result.passed) {
        this.results.passed++;
        this.log(`✅ PASSED: ${testName}`, "success");
      } else {
        this.results.failed++;
        this.log(`❌ FAILED: ${testName} - ${result.message}`, "error");
      }
      this.results.tests.push({ name: testName, ...result });
    } catch (error) {
      this.results.failed++;
      this.log(`❌ ERROR: ${testName} - ${error.message}`, "error");
      this.results.tests.push({
        name: testName,
        passed: false,
        message: error.message,
      });
    }
  }

  // Test 1: Validate Next.js build and SSR capability
  async testServerSideRendering() {
    return new Promise((resolve) => {
      try {
        // Check if Next.js build files exist
        const buildDir = path.join(process.cwd(), ".next");
        if (!fs.existsSync(buildDir)) {
          resolve({
            passed: false,
            message:
              'Next.js build directory not found. Run "npm run build" first.',
          });
          return;
        }

        // Check for server-side rendering files
        const serverDir = path.join(buildDir, "server");
        const staticDir = path.join(buildDir, "static");

        const hasServerFiles = fs.existsSync(serverDir);
        const hasStaticFiles = fs.existsSync(staticDir);

        if (hasServerFiles && hasStaticFiles) {
          resolve({
            passed: true,
            message: "Next.js build structure is valid for SSR",
          });
        } else {
          resolve({
            passed: false,
            message: "Missing required Next.js build files for SSR",
          });
        }
      } catch (error) {
        resolve({
          passed: false,
          message: `Build validation failed: ${error.message}`,
        });
      }
    });
  }

  // Test 2: Validate metadata generation in layout and pages
  async testMetadataGeneration() {
    return new Promise((resolve) => {
      try {
        const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
        const homePagePath = path.join(process.cwd(), "app", "page.tsx");
        const toolPagePath = path.join(
          process.cwd(),
          "app",
          "tools",
          "[toolName]",
          "page.tsx"
        );
        const categoryPagePath = path.join(
          process.cwd(),
          "app",
          "category",
          "[categoryId]",
          "page.tsx"
        );

        const files = [
          { path: layoutPath, name: "Root Layout" },
          { path: homePagePath, name: "Home Page" },
          { path: toolPagePath, name: "Tool Page" },
          { path: categoryPagePath, name: "Category Page" },
        ];

        const issues = [];

        for (const file of files) {
          if (!fs.existsSync(file.path)) {
            issues.push(`${file.name} file not found`);
            continue;
          }

          const content = fs.readFileSync(file.path, "utf8");

          // Check for metadata export
          if (
            !content.includes("export const metadata") &&
            !content.includes("generateMetadata")
          ) {
            issues.push(`${file.name} missing metadata configuration`);
          }

          // Check for essential metadata fields
          const requiredFields = [
            "title",
            "description",
            "openGraph",
            "twitter",
          ];
          for (const field of requiredFields) {
            if (!content.includes(field)) {
              issues.push(`${file.name} missing ${field} metadata`);
            }
          }
        }

        resolve({
          passed: issues.length === 0,
          message:
            issues.length > 0
              ? issues.join(", ")
              : "All metadata configurations are present",
        });
      } catch (error) {
        resolve({
          passed: false,
          message: `Metadata validation failed: ${error.message}`,
        });
      }
    });
  }

  // Test 3: Validate Open Graph and Twitter Card implementation
  async testSocialMediaMetadata() {
    return new Promise((resolve) => {
      try {
        const files = [
          "app/layout.tsx",
          "app/page.tsx",
          "app/tools/[toolName]/page.tsx",
          "app/category/[categoryId]/page.tsx",
        ];

        const issues = [];

        for (const filePath of files) {
          const fullPath = path.join(process.cwd(), filePath);
          if (!fs.existsSync(fullPath)) continue;

          const content = fs.readFileSync(fullPath, "utf8");

          // Check Open Graph fields
          const ogFields = ["title", "description", "url", "images", "type"];
          for (const field of ogFields) {
            if (!content.includes(`openGraph`) || !content.includes(field)) {
              issues.push(`${filePath}: Missing Open Graph ${field}`);
            }
          }

          // Check Twitter Card fields
          const twitterFields = ["card", "title", "description", "images"];
          for (const field of twitterFields) {
            if (!content.includes(`twitter`) || !content.includes(field)) {
              issues.push(`${filePath}: Missing Twitter ${field}`);
            }
          }

          // Check for image paths
          if (
            content.includes("og-image") ||
            content.includes("twitter-image")
          ) {
            // Verify social images exist
            const socialDir = path.join(process.cwd(), "public", "social");
            if (!fs.existsSync(socialDir)) {
              issues.push("Social images directory not found");
            }
          }
        }

        resolve({
          passed: issues.length === 0,
          message:
            issues.length > 0
              ? issues.join(", ")
              : "Social media metadata is properly configured",
        });
      } catch (error) {
        resolve({
          passed: false,
          message: `Social media metadata validation failed: ${error.message}`,
        });
      }
    });
  }

  // Test 4: Validate robots.txt and sitemap.xml generation
  async testSearchEngineFiles() {
    return new Promise((resolve) => {
      try {
        const issues = [];

        // Check robots.ts file
        const robotsPath = path.join(process.cwd(), "app", "robots.ts");
        if (!fs.existsSync(robotsPath)) {
          issues.push("robots.ts file not found");
        } else {
          const robotsContent = fs.readFileSync(robotsPath, "utf8");
          if (
            !robotsContent.includes("userAgent") ||
            !robotsContent.includes("sitemap")
          ) {
            issues.push("robots.ts missing required fields");
          }
        }

        // Check sitemap.ts file
        const sitemapPath = path.join(process.cwd(), "app", "sitemap.ts");
        if (!fs.existsSync(sitemapPath)) {
          issues.push("sitemap.ts file not found");
        } else {
          const sitemapContent = fs.readFileSync(sitemapPath, "utf8");
          if (!sitemapContent.includes("MetadataRoute.Sitemap")) {
            issues.push("sitemap.ts not properly configured");
          }
        }

        // Check if build generates these files in public directory
        const publicRobots = path.join(process.cwd(), "public", "robots.txt");
        const publicSitemap = path.join(process.cwd(), "public", "sitemap.xml");

        // Check if generated files exist (after build)
        if (fs.existsSync(publicRobots)) {
          const robotsContent = fs.readFileSync(publicRobots, "utf8");
          if (!robotsContent.includes("Sitemap:")) {
            issues.push("Generated robots.txt missing sitemap reference");
          }
        }

        if (fs.existsSync(publicSitemap)) {
          const sitemapContent = fs.readFileSync(publicSitemap, "utf8");
          if (
            !sitemapContent.includes("<?xml") ||
            !sitemapContent.includes("urlset")
          ) {
            issues.push("Generated sitemap.xml is malformed");
          }
        }
        resolve({
          passed: issues.length === 0,
          message:
            issues.length > 0
              ? issues.join(", ")
              : "Search engine files are properly configured",
        });
      } catch (error) {
        resolve({
          passed: false,
          message: `Search engine files validation failed: ${error.message}`,
        });
      }
    });
  }

  // Test 5: Validate structured data implementation
  async testStructuredData() {
    return new Promise((resolve) => {
      try {
        const issues = [];

        // Check structured data utility file
        const structuredDataPath = path.join(
          process.cwd(),
          "lib",
          "utils",
          "structuredData.ts"
        );
        if (!fs.existsSync(structuredDataPath)) {
          issues.push("structuredData.ts utility file not found");
        } else {
          const content = fs.readFileSync(structuredDataPath, "utf8");

          // Check for required schema generators
          const requiredSchemas = [
            "generateWebApplicationSchema",
            "generateToolSchema",
            "generateCategorySchema",
            "generateBreadcrumbSchema",
            "generateOrganizationSchema",
          ];

          for (const schema of requiredSchemas) {
            if (!content.includes(schema)) {
              issues.push(`Missing ${schema} function`);
            }
          }

          // Check for proper schema.org context
          if (!content.includes("https://schema.org")) {
            issues.push("Missing schema.org context");
          }
        }

        // Check StructuredData component
        const componentPath = path.join(
          process.cwd(),
          "components",
          "StructuredData.tsx"
        );
        if (!fs.existsSync(componentPath)) {
          issues.push("StructuredData component not found");
        } else {
          const componentContent = fs.readFileSync(componentPath, "utf8");
          if (!componentContent.includes("application/ld+json")) {
            issues.push("StructuredData component not properly configured");
          }
        }

        // Check if layout includes structured data (which is the correct approach)
        const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
        if (fs.existsSync(layoutPath)) {
          const layoutContent = fs.readFileSync(layoutPath, "utf8");
          if (!layoutContent.includes("StructuredData")) {
            issues.push("layout.tsx not using StructuredData component");
          }
        }

        // Check if tool pages generate structured data
        const toolPagePath = path.join(
          process.cwd(),
          "app",
          "tools",
          "[toolName]",
          "page.tsx"
        );
        if (fs.existsSync(toolPagePath)) {
          const toolPageContent = fs.readFileSync(toolPagePath, "utf8");
          if (
            !toolPageContent.includes("generateToolSchema") &&
            !toolPageContent.includes("StructuredData")
          ) {
            issues.push("Tool pages not generating structured data");
          }
        }

        resolve({
          passed: issues.length === 0,
          message:
            issues.length > 0
              ? issues.join(", ")
              : "Structured data is properly implemented",
        });
      } catch (error) {
        resolve({
          passed: false,
          message: `Structured data validation failed: ${error.message}`,
        });
      }
    });
  }

  // Test 6: Validate canonical URLs and URL structure
  async testCanonicalUrls() {
    return new Promise((resolve) => {
      try {
        const issues = [];

        // Check SEO utility (which includes canonical URL handling)
        const seoUtilPath = path.join(process.cwd(), "lib", "utils", "seo.ts");
        if (!fs.existsSync(seoUtilPath)) {
          issues.push("seo.ts utility not found");
        } else {
          const seoContent = fs.readFileSync(seoUtilPath, "utf8");
          if (!seoContent.includes("canonical")) {
            issues.push("SEO utility missing canonical URL handling");
          }
        }

        // Check if metadata utilities include canonical URLs
        const metadataUtilPath = path.join(
          process.cwd(),
          "lib",
          "utils",
          "toolMetadata.ts"
        );
        if (fs.existsSync(metadataUtilPath)) {
          const metadataContent = fs.readFileSync(metadataUtilPath, "utf8");
          if (!metadataContent.includes("canonical")) {
            issues.push("toolMetadata.ts missing canonical URL configuration");
          }
        }

        // Check layout for canonical URL setup
        const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
        if (fs.existsSync(layoutPath)) {
          const layoutContent = fs.readFileSync(layoutPath, "utf8");
          if (!layoutContent.includes("canonical")) {
            issues.push("layout.tsx missing canonical URL configuration");
          }
        }

        resolve({
          passed: issues.length === 0,
          message:
            issues.length > 0
              ? issues.join(", ")
              : "Canonical URLs are properly configured",
        });
      } catch (error) {
        resolve({
          passed: false,
          message: `Canonical URL validation failed: ${error.message}`,
        });
      }
    });
  }

  // Test 7: Validate SEO-friendly URL structure
  async testUrlStructure() {
    return new Promise((resolve) => {
      try {
        const issues = [];

        // Check tools data for proper route structure
        const toolsDataPath = path.join(
          process.cwd(),
          "lib",
          "data",
          "toolsData.ts"
        );
        if (!fs.existsSync(toolsDataPath)) {
          issues.push("toolsData.ts not found");
        } else {
          const content = fs.readFileSync(toolsDataPath, "utf8");

          // Check for SEO-friendly route patterns
          if (!content.includes("/tools/")) {
            issues.push("Tools not using SEO-friendly URL structure");
          }
        }

        // Check dynamic route files exist
        const routeFiles = [
          "app/tools/[toolName]/page.tsx",
          "app/category/[categoryId]/page.tsx",
        ];

        for (const routeFile of routeFiles) {
          const routePath = path.join(process.cwd(), routeFile);
          if (!fs.existsSync(routePath)) {
            issues.push(`${routeFile} dynamic route not found`);
          }
        }

        resolve({
          passed: issues.length === 0,
          message:
            issues.length > 0
              ? issues.join(", ")
              : "URL structure is SEO-friendly",
        });
      } catch (error) {
        resolve({
          passed: false,
          message: `URL structure validation failed: ${error.message}`,
        });
      }
    });
  }

  // Test 8: Validate performance and Core Web Vitals readiness
  async testPerformanceOptimization() {
    return new Promise((resolve) => {
      try {
        const issues = [];

        // Check for Next.js Image optimization
        const componentFiles = [
          "components/OptimizedImage.tsx",
          "app/layout.tsx",
        ];

        let hasImageOptimization = false;
        for (const file of componentFiles) {
          const filePath = path.join(process.cwd(), file);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, "utf8");
            if (content.includes("next/image")) {
              hasImageOptimization = true;
              break;
            }
          }
        }

        if (!hasImageOptimization) {
          issues.push("Next.js Image optimization not implemented");
        }

        // Check for font optimization
        const layoutPath = path.join(process.cwd(), "app", "layout.tsx");
        if (fs.existsSync(layoutPath)) {
          const layoutContent = fs.readFileSync(layoutPath, "utf8");
          if (!layoutContent.includes("next/font")) {
            issues.push("Font optimization not implemented");
          }
        }

        // Check for performance monitoring
        const perfMonitorPath = path.join(
          process.cwd(),
          "components",
          "PerformanceMonitor.tsx"
        );
        if (!fs.existsSync(perfMonitorPath)) {
          issues.push("Performance monitoring component not found");
        }

        resolve({
          passed: issues.length === 0,
          message:
            issues.length > 0
              ? issues.join(", ")
              : "Performance optimizations are in place",
        });
      } catch (error) {
        resolve({
          passed: false,
          message: `Performance optimization validation failed: ${error.message}`,
        });
      }
    });
  }

  // Generate comprehensive report
  generateReport() {
    this.log("\n" + "=".repeat(60), "header");
    this.log("SEO VALIDATION REPORT", "header");
    this.log("=".repeat(60), "header");

    this.log(`\nSUMMARY:`, "header");
    this.log(`✅ Passed: ${this.results.passed}`, "success");
    this.log(`❌ Failed: ${this.results.failed}`, "error");
    this.log(`⚠️  Warnings: ${this.results.warnings}`, "warning");
    this.log(`📊 Total Tests: ${this.results.tests.length}`, "info");

    this.log(`\nDETAILED RESULTS:`, "header");
    this.results.tests.forEach((test, index) => {
      const status = test.passed ? "✅" : "❌";
      const color = test.passed ? "success" : "error";
      this.log(`${index + 1}. ${status} ${test.name}`, color);
      if (test.message) {
        this.log(`   ${test.message}`, "info");
      }
    });

    // Generate recommendations
    this.log(`\nRECOMMENDATIONS:`, "header");
    if (this.results.failed === 0) {
      this.log(
        "🎉 All SEO validations passed! Your Next.js migration is SEO-ready.",
        "success"
      );
    } else {
      this.log(
        "🔧 Please address the failed tests above to ensure optimal SEO performance.",
        "warning"
      );
    }

    this.log(`\nNEXT STEPS:`, "header");
    this.log('1. Run "npm run build" to generate production build', "info");
    this.log(
      '2. Test with "npm run start" to verify SSR functionality',
      "info"
    );
    this.log("3. Use Google Search Console to test structured data", "info");
    this.log(
      "4. Validate social media previews with Facebook Debugger and Twitter Card Validator",
      "info"
    );
    this.log("5. Run Lighthouse audit for performance and SEO scores", "info");
    this.log(
      "6. Test with Google Rich Results Test for structured data validation",
      "info"
    );
    this.log("7. Submit updated sitemap to Google Search Console", "info");

    return this.results.failed === 0;
  }

  // Test 9: Validate current project structure
  async testProjectStructure() {
    return new Promise((resolve) => {
      try {
        const issues = [];

        // Check essential project files
        const essentialFiles = [
          "lib/data/toolsData.ts",
          "lib/utils/toolMetadata.ts",
          "lib/utils/structuredData.ts",
          "lib/utils/seo.ts",
          "components/StructuredData.tsx",
          "app/layout.tsx",
          "app/page.tsx",
          "app/tools/[toolName]/page.tsx",
          "app/category/[categoryId]/page.tsx",
          "next.config.js",
          "package.json",
        ];

        for (const file of essentialFiles) {
          const filePath = path.join(process.cwd(), file);
          if (!fs.existsSync(filePath)) {
            issues.push(`Missing essential file: ${file}`);
          }
        }

        // Check if toolsData has proper structure
        const toolsDataPath = path.join(
          process.cwd(),
          "lib",
          "data",
          "toolsData.ts"
        );
        if (fs.existsSync(toolsDataPath)) {
          const toolsContent = fs.readFileSync(toolsDataPath, "utf8");
          if (
            !toolsContent.includes("export interface ToolItem") ||
            !toolsContent.includes("export const toolsData") ||
            !toolsContent.includes("route:")
          ) {
            issues.push("toolsData.ts structure is incomplete");
          }
        }

        // Check if Next.js config has proper redirects
        const nextConfigPath = path.join(process.cwd(), "next.config.js");
        if (fs.existsSync(nextConfigPath)) {
          const configContent = fs.readFileSync(nextConfigPath, "utf8");
          if (
            !configContent.includes("redirects") ||
            !configContent.includes("headers")
          ) {
            issues.push("next.config.js missing SEO optimizations");
          }
        }

        resolve({
          passed: issues.length === 0,
          message:
            issues.length > 0
              ? issues.join(", ")
              : "Project structure is properly configured",
        });
      } catch (error) {
        resolve({
          passed: false,
          message: `Project structure validation failed: ${error.message}`,
        });
      }
    });
  }

  // Main validation runner
  async runAllTests() {
    this.log(
      "Starting SEO Validation for KodeKit Next.js Migration...",
      "header"
    );

    await this.runTest("Server-Side Rendering Configuration", () =>
      this.testServerSideRendering()
    );
    await this.runTest("Metadata Generation", () =>
      this.testMetadataGeneration()
    );
    await this.runTest("Social Media Metadata (OG & Twitter)", () =>
      this.testSocialMediaMetadata()
    );
    await this.runTest("Search Engine Files (robots.txt & sitemap.xml)", () =>
      this.testSearchEngineFiles()
    );
    await this.runTest("Structured Data Implementation", () =>
      this.testStructuredData()
    );
    await this.runTest("Canonical URLs", () => this.testCanonicalUrls());
    await this.runTest("SEO-Friendly URL Structure", () =>
      this.testUrlStructure()
    );
    await this.runTest("Performance Optimization", () =>
      this.testPerformanceOptimization()
    );
    await this.runTest("Project Structure Validation", () =>
      this.testProjectStructure()
    );

    return this.generateReport();
  }
}

// Run the validation if this script is executed directly
if (require.main === module) {
  const validator = new SEOValidator();
  validator
    .runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error("Validation failed:", error);
      process.exit(1);
    });
}

module.exports = SEOValidator;
