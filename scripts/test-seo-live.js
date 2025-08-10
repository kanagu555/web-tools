#!/usr/bin/env node

/**
 * Live SEO Testing Script
 * 
 * This script tests a running Next.js server to validate:
 * 1. Server-side rendering of meta tags
 * 2. Open Graph and Twitter Card data in actual HTML
 * 3. Structured data JSON-LD in rendered pages
 * 4. Canonical URLs and redirects
 * 5. Sitemap and robots.txt accessibility
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

class LiveSEOTester {
  constructor(baseUrl = 'http://localhost:3000') {
    this.baseUrl = baseUrl;
    this.results = [];
    this.userAgent = 'Mozilla/5.0 (compatible; SEO-Tester/1.0; +https://kodekit.in)';
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

  // Make HTTP request and return response
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          ...options.headers
        }
      };

      const req = client.request(requestOptions, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  // Extract meta tags from HTML
  extractMetaTags(html) {
    const metaTags = {};
    
    // Title
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) metaTags.title = titleMatch[1].trim();

    // Description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
    if (descMatch) metaTags.description = descMatch[1];

    // Keywords
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
        const data = JSON.parse(match[1].trim());
        structuredData.push(data);
      } catch (e) {
        // Invalid JSON, skip
      }
    }
    metaTags.structuredData = structuredData;

    return metaTags;
  }

  // Test a specific page
  async testPage(path, expectedData = {}) {
    this.log(`\nTesting: ${path}`, 'header');
    
    try {
      const url = `${this.baseUrl}${path}`;
      const response = await this.makeRequest(url);
      
      if (response.statusCode !== 200) {
        throw new Error(`HTTP ${response.statusCode}`);
      }

      const metaTags = this.extractMetaTags(response.body);
      const issues = [];

      // Validate basic meta tags
      if (!metaTags.title || metaTags.title.length < 10) {
        issues.push('Title missing or too short');
      }

      if (!metaTags.description || metaTags.description.length < 50) {
        issues.push('Description missing or too short');
      }

      // Validate Open Graph
      const requiredOG = ['title', 'description', 'url', 'type'];
      for (const field of requiredOG) {
        if (!metaTags.openGraph[field]) {
          issues.push(`Missing Open Graph ${field}`);
        }
      }

      // Validate Twitter Cards
      const requiredTwitter = ['card', 'title', 'description'];
      for (const field of requiredTwitter) {
        if (!metaTags.twitter[field]) {
          issues.push(`Missing Twitter ${field}`);
        }
      }

      // Validate canonical URL
      if (!metaTags.canonical) {
        issues.push('Missing canonical URL');
      } else if (!metaTags.canonical.startsWith('http')) {
        issues.push('Canonical URL should be absolute');
      }

      // Validate structured data
      if (metaTags.structuredData.length === 0) {
        issues.push('No structured data found');
      } else {
        for (const schema of metaTags.structuredData) {
          if (!schema['@context'] || !schema['@context'].includes('schema.org')) {
            issues.push('Invalid structured data @context');
          }
          if (!schema['@type']) {
            issues.push('Missing structured data @type');
          }
        }
      }

      const result = {
        path,
        statusCode: response.statusCode,
        passed: issues.length === 0,
        issues,
        metaTags
      };

      this.results.push(result);

      if (result.passed) {
        this.log('✅ All SEO requirements met', 'success');
      } else {
        this.log(`❌ Issues found: ${issues.join(', ')}`, 'error');
      }

      // Log key meta tags for verification
      this.log(`Title: ${metaTags.title}`, 'info');
      this.log(`Description: ${metaTags.description?.substring(0, 100)}...`, 'info');
      this.log(`Canonical: ${metaTags.canonical}`, 'info');
      this.log(`Structured Data: ${metaTags.structuredData.length} schemas`, 'info');

      return result;
    } catch (error) {
      this.log(`❌ Error testing ${path}: ${error.message}`, 'error');
      const result = {
        path,
        passed: false,
        issues: [error.message],
        metaTags: {}
      };
      this.results.push(result);
      return result;
    }
  }

  // Test sitemap.xml
  async testSitemap() {
    this.log('\nTesting sitemap.xml...', 'header');
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/sitemap.xml`);
      
      if (response.statusCode !== 200) {
        throw new Error(`Sitemap returned HTTP ${response.statusCode}`);
      }

      const issues = [];
      const xml = response.body;

      // Check XML structure
      if (!xml.includes('<?xml') || !xml.includes('<urlset')) {
        issues.push('Invalid XML sitemap structure');
      }

      // Check for URLs
      const urlMatches = xml.match(/<url>/g);
      if (!urlMatches || urlMatches.length < 5) {
        issues.push('Sitemap contains too few URLs');
      }

      // Check for required elements
      if (!xml.includes('<loc>') || !xml.includes('<lastmod>')) {
        issues.push('Sitemap missing required elements (loc, lastmod)');
      }

      this.log(issues.length === 0 ? '✅ Sitemap is valid' : `❌ Issues: ${issues.join(', ')}`, 
               issues.length === 0 ? 'success' : 'error');

      return {
        passed: issues.length === 0,
        issues,
        urlCount: urlMatches ? urlMatches.length : 0
      };
    } catch (error) {
      this.log(`❌ Error testing sitemap: ${error.message}`, 'error');
      return {
        passed: false,
        issues: [error.message]
      };
    }
  }

  // Test robots.txt
  async testRobots() {
    this.log('\nTesting robots.txt...', 'header');
    
    try {
      const response = await this.makeRequest(`${this.baseUrl}/robots.txt`);
      
      if (response.statusCode !== 200) {
        throw new Error(`Robots.txt returned HTTP ${response.statusCode}`);
      }

      const issues = [];
      const robots = response.body;

      // Check for required directives
      if (!robots.includes('User-agent:')) {
        issues.push('Missing User-agent directive');
      }

      if (!robots.includes('Sitemap:')) {
        issues.push('Missing Sitemap directive');
      }

      // Check sitemap URL
      const sitemapMatch = robots.match(/Sitemap:\s*(.+)/i);
      if (sitemapMatch && !sitemapMatch[1].includes('sitemap.xml')) {
        issues.push('Sitemap URL may be incorrect');
      }

      this.log(issues.length === 0 ? '✅ Robots.txt is valid' : `❌ Issues: ${issues.join(', ')}`, 
               issues.length === 0 ? 'success' : 'error');

      return {
        passed: issues.length === 0,
        issues
      };
    } catch (error) {
      this.log(`❌ Error testing robots.txt: ${error.message}`, 'error');
      return {
        passed: false,
        issues: [error.message]
      };
    }
  }

  // Test page load performance
  async testPagePerformance(path) {
    this.log(`\nTesting performance for: ${path}`, 'header');
    
    try {
      const startTime = Date.now();
      const response = await this.makeRequest(`${this.baseUrl}${path}`);
      const loadTime = Date.now() - startTime;

      const issues = [];

      // Check response time
      if (loadTime > 3000) {
        issues.push(`Slow response time: ${loadTime}ms`);
      }

      // Check response size
      const sizeKB = Buffer.byteLength(response.body, 'utf8') / 1024;
      if (sizeKB > 500) {
        issues.push(`Large response size: ${sizeKB.toFixed(2)}KB`);
      }

      // Check for compression
      if (!response.headers['content-encoding']) {
        issues.push('Response not compressed');
      }

      this.log(`Load time: ${loadTime}ms, Size: ${sizeKB.toFixed(2)}KB`, 'info');
      this.log(issues.length === 0 ? '✅ Performance looks good' : `⚠️  Issues: ${issues.join(', ')}`, 
               issues.length === 0 ? 'success' : 'warning');

      return {
        passed: issues.length === 0,
        issues,
        loadTime,
        sizeKB
      };
    } catch (error) {
      this.log(`❌ Error testing performance: ${error.message}`, 'error');
      return {
        passed: false,
        issues: [error.message]
      };
    }
  }

  // Generate comprehensive report
  generateReport() {
    this.log('\n' + '='.repeat(60), 'header');
    this.log('LIVE SEO TESTING REPORT', 'header');
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
      this.log(`${index + 1}. ${status} ${result.path}`, color);
      
      if (result.issues && result.issues.length > 0) {
        result.issues.forEach(issue => {
          this.log(`   - ${issue}`, 'warning');
        });
      }
    });

    this.log(`\nNEXT STEPS:`, 'header');
    this.log('1. Test with Google Search Console', 'info');
    this.log('2. Validate with Facebook Debugger', 'info');
    this.log('3. Check Twitter Card Validator', 'info');
    this.log('4. Run Lighthouse audit', 'info');
    this.log('5. Monitor Core Web Vitals', 'info');

    return failedTests === 0;
  }

  // Run all live SEO tests
  async runAllTests() {
    this.log(`Starting Live SEO Testing for: ${this.baseUrl}`, 'header');

    // Test key pages
    const pagesToTest = [
      '/',
      '/categories',
      '/tools/ssy-calculator',
      '/tools/pdf-converter',
      '/category/finance'
    ];

    for (const page of pagesToTest) {
      await this.testPage(page);
    }

    // Test sitemap and robots
    await this.testSitemap();
    await this.testRobots();

    // Test performance for home page
    await this.testPagePerformance('/');

    return this.generateReport();
  }
}

// Command line usage
if (require.main === module) {
  const baseUrl = process.argv[2] || 'http://localhost:3000';
  const tester = new LiveSEOTester(baseUrl);
  
  tester.runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('Live SEO testing failed:', error);
    process.exit(1);
  });
}

module.exports = LiveSEOTester;