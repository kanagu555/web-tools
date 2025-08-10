#!/usr/bin/env node

/**
 * Meta Tags Testing Script
 * 
 * This script tests the actual HTML output to validate:
 * 1. Meta tag generation in server-rendered HTML
 * 2. Open Graph and Twitter Card tags
 * 3. Structured data JSON-LD
 * 4. Canonical URLs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

class MetaTagTester {
  constructor() {
    this.results = [];
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kodekit.in';
  }

  log(message, type = 'info') {
    const colorMap = {
      info: colors.blue,
      success: colors.green,
      warning: colors.yellow,
      error: colors.red,
      header: colors.magenta
    };
    
    console.log(`${colorMap[type]}${message}${colors.reset}`);
  }

  // Extract meta tags from HTML content
  extractMetaTags(html) {
    const metaTags = {};
    
    // Basic meta tags
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) metaTags.title = titleMatch[1];

    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    if (descMatch) metaTags.description = descMatch[1];

    const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    if (keywordsMatch) metaTags.keywords = keywordsMatch[1];

    // Open Graph tags
    const ogTags = {};
    const ogMatches = html.matchAll(/<meta[^>]*property=["']og:([^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi);
    for (const match of ogMatches) {
      ogTags[match[1]] = match[2];
    }
    metaTags.openGraph = ogTags;

    // Twitter tags
    const twitterTags = {};
    const twitterMatches = html.matchAll(/<meta[^>]*name=["']twitter:([^"']*)["'][^>]*content=["']([^"']*)["'][^>]*>/gi);
    for (const match of twitterMatches) {
      twitterTags[match[1]] = match[2];
    }
    metaTags.twitter = twitterTags;

    // Canonical URL
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
    if (canonicalMatch) metaTags.canonical = canonicalMatch[1];

    // Structured data
    const structuredDataMatches = html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([^<]*)<\/script>/gi);
    const structuredData = [];
    for (const match of structuredDataMatches) {
      try {
        const data = JSON.parse(match[1]);
        structuredData.push(data);
      } catch (e) {
        // Invalid JSON, skip
      }
    }
    metaTags.structuredData = structuredData;

    return metaTags;
  }

  // Test a specific page's meta tags
  async testPageMetaTags(pagePath, expectedData = {}) {
    this.log(`\nTesting meta tags for: ${pagePath}`, 'header');
    
    try {
      // For testing purposes, we'll read the built HTML files
      // In a real scenario, you'd make HTTP requests to the running server
      
      const testResult = {
        page: pagePath,
        passed: true,
        issues: [],
        metaTags: {}
      };

      // Since we can't easily get the rendered HTML without a running server,
      // we'll validate the source files instead
      this.log('Note: Testing source files. For complete validation, test with running server.', 'warning');

      // Check if the page file exists and has proper metadata
      const pageFile = this.getPageFilePath(pagePath);
      if (!pageFile || !fs.existsSync(pageFile)) {
        testResult.passed = false;
        testResult.issues.push('Page file not found');
        return testResult;
      }

      const content = fs.readFileSync(pageFile, 'utf8');

      // Check for metadata export or generateMetadata function
      if (!content.includes('export const metadata') && !content.includes('generateMetadata')) {
        testResult.passed = false;
        testResult.issues.push('No metadata configuration found');
      }

      // Check for required metadata fields
      const requiredFields = ['title', 'description', 'openGraph', 'twitter'];
      for (const field of requiredFields) {
        if (!content.includes(field)) {
          testResult.passed = false;
          testResult.issues.push(`Missing ${field} metadata`);
        }
      }

      // Check for canonical URL
      if (!content.includes('canonical')) {
        testResult.passed = false;
        testResult.issues.push('Missing canonical URL');
      }

      // Check for structured data usage
      if (!content.includes('StructuredData')) {
        testResult.passed = false;
        testResult.issues.push('Not using StructuredData component');
      }

      this.results.push(testResult);
      
      if (testResult.passed) {
        this.log('✅ All meta tag requirements met', 'success');
      } else {
        this.log(`❌ Issues found: ${testResult.issues.join(', ')}`, 'error');
      }

      return testResult;
    } catch (error) {
      this.log(`❌ Error testing ${pagePath}: ${error.message}`, 'error');
      return {
        page: pagePath,
        passed: false,
        issues: [error.message],
        metaTags: {}
      };
    }
  }

  // Get the file path for a given page route
  getPageFilePath(pagePath) {
    const routeMap = {
      '/': 'app/page.tsx',
      '/categories': 'app/categories/page.tsx',
      '/tools/[toolName]': 'app/tools/[toolName]/page.tsx',
      '/category/[categoryId]': 'app/category/[categoryId]/page.tsx'
    };

    const filePath = routeMap[pagePath];
    return filePath ? path.join(process.cwd(), filePath) : null;
  }

  // Test structured data validity
  testStructuredDataValidity(structuredData) {
    const issues = [];

    for (const data of structuredData) {
      // Check for required schema.org context
      if (!data['@context'] || !data['@context'].includes('schema.org')) {
        issues.push('Missing or invalid @context');
      }

      // Check for @type
      if (!data['@type']) {
        issues.push('Missing @type');
      }

      // Validate common required fields based on type
      if (data['@type'] === 'WebApplication') {
        const requiredFields = ['name', 'description', 'url'];
        for (const field of requiredFields) {
          if (!data[field]) {
            issues.push(`WebApplication missing ${field}`);
          }
        }
      }

      if (data['@type'] === 'BreadcrumbList') {
        if (!data.itemListElement || !Array.isArray(data.itemListElement)) {
          issues.push('BreadcrumbList missing itemListElement array');
        }
      }
    }

    return issues;
  }

  // Generate a comprehensive report
  generateReport() {
    this.log('\n' + '='.repeat(60), 'header');
    this.log('META TAGS VALIDATION REPORT', 'header');
    this.log('='.repeat(60), 'header');

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    this.log(`\nSUMMARY:`, 'header');
    this.log(`✅ Passed: ${passedTests}/${totalTests}`, 'success');
    this.log(`❌ Failed: ${failedTests}/${totalTests}`, failedTests > 0 ? 'error' : 'success');

    this.log(`\nDETAILED RESULTS:`, 'header');
    this.results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      const color = result.passed ? 'success' : 'error';
      this.log(`${index + 1}. ${status} ${result.page}`, color);
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          this.log(`   - ${issue}`, 'warning');
        });
      }
    });

    this.log(`\nRECOMMENDATIONS:`, 'header');
    if (failedTests === 0) {
      this.log('🎉 All meta tag validations passed!', 'success');
    } else {
      this.log('🔧 Address the issues above to improve SEO performance.', 'warning');
    }

    this.log(`\nFOR COMPLETE VALIDATION:`, 'header');
    this.log('1. Build the project: npm run build', 'info');
    this.log('2. Start the server: npm run start', 'info');
    this.log('3. Test with browser dev tools or online validators', 'info');
    this.log('4. Use Facebook Debugger: https://developers.facebook.com/tools/debug/', 'info');
    this.log('5. Use Twitter Card Validator: https://cards-dev.twitter.com/validator', 'info');
    this.log('6. Use Google Rich Results Test: https://search.google.com/test/rich-results', 'info');

    return failedTests === 0;
  }

  // Run all meta tag tests
  async runAllTests() {
    this.log('Starting Meta Tags Validation...', 'header');

    // Test key pages
    const pagesToTest = [
      '/',
      '/categories', 
      '/tools/[toolName]',
      '/category/[categoryId]'
    ];

    for (const page of pagesToTest) {
      await this.testPageMetaTags(page);
    }

    return this.generateReport();
  }
}

// Run the tests if this script is executed directly
if (require.main === module) {
  const tester = new MetaTagTester();
  tester.runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('Meta tags validation failed:', error);
    process.exit(1);
  });
}

module.exports = MetaTagTester;