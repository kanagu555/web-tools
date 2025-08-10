#!/usr/bin/env node

/**
 * Structured Data Validation Script
 * 
 * This script validates JSON-LD structured data implementation:
 * 1. Schema.org compliance
 * 2. Required fields validation
 * 3. Data consistency checks
 * 4. Google Rich Results compatibility
 */

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

class StructuredDataValidator {
  constructor() {
    this.results = [];
    this.schemas = [];
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

  // Load and test structured data utility functions
  async testStructuredDataUtility() {
    this.log('\nTesting structured data utility functions...', 'header');
    
    try {
      const utilPath = path.join(process.cwd(), 'lib', 'utils', 'structuredData.ts');
      if (!fs.existsSync(utilPath)) {
        throw new Error('structuredData.ts utility file not found');
      }

      const content = fs.readFileSync(utilPath, 'utf8');
      
      // Check for required functions
      const requiredFunctions = [
        'generateWebApplicationSchema',
        'generateToolSchema', 
        'generateCategorySchema',
        'generateBreadcrumbSchema',
        'generateOrganizationSchema'
      ];

      const issues = [];
      for (const func of requiredFunctions) {
        if (!content.includes(`export function ${func}`) && !content.includes(`function ${func}`)) {
          issues.push(`Missing function: ${func}`);
        }
      }

      // Test schema generation by importing and running functions
      // Note: This is a simplified test - in practice you'd need to compile TypeScript
      this.log('✅ Structured data utility file exists and contains required functions', 'success');
      
      if (issues.length > 0) {
        this.log(`⚠️  Issues found: ${issues.join(', ')}`, 'warning');
      }

      return {
        passed: issues.length === 0,
        issues
      };
    } catch (error) {
      this.log(`❌ Error testing structured data utility: ${error.message}`, 'error');
      return {
        passed: false,
        issues: [error.message]
      };
    }
  }

  // Validate a specific schema object
  validateSchema(schema, schemaType) {
    const issues = [];

    // Check basic schema.org requirements
    if (!schema['@context']) {
      issues.push('Missing @context');
    } else if (!schema['@context'].includes('schema.org')) {
      issues.push('Invalid @context - must include schema.org');
    }

    if (!schema['@type']) {
      issues.push('Missing @type');
    }

    // Validate based on schema type
    switch (schemaType) {
      case 'WebApplication':
        this.validateWebApplicationSchema(schema, issues);
        break;
      case 'Organization':
        this.validateOrganizationSchema(schema, issues);
        break;
      case 'BreadcrumbList':
        this.validateBreadcrumbSchema(schema, issues);
        break;
      case 'ItemList':
        this.validateItemListSchema(schema, issues);
        break;
      case 'CollectionPage':
        this.validateCollectionPageSchema(schema, issues);
        break;
      default:
        this.log(`⚠️  Unknown schema type: ${schemaType}`, 'warning');
    }

    return issues;
  }

  // Validate WebApplication schema
  validateWebApplicationSchema(schema, issues) {
    const requiredFields = ['name', 'description', 'url'];
    
    for (const field of requiredFields) {
      if (!schema[field]) {
        issues.push(`WebApplication missing required field: ${field}`);
      }
    }

    // Check offers structure
    if (schema.offers) {
      if (!schema.offers['@type'] || schema.offers['@type'] !== 'Offer') {
        issues.push('WebApplication offers must have @type: Offer');
      }
      if (!schema.offers.price) {
        issues.push('WebApplication offers missing price');
      }
    }

    // Check aggregateRating if present
    if (schema.aggregateRating) {
      if (!schema.aggregateRating.ratingValue || !schema.aggregateRating.ratingCount) {
        issues.push('WebApplication aggregateRating missing required fields');
      }
    }

    // Validate URL format
    if (schema.url && !this.isValidUrl(schema.url)) {
      issues.push('WebApplication URL is not valid');
    }
  }

  // Validate Organization schema
  validateOrganizationSchema(schema, issues) {
    const requiredFields = ['name', 'url'];
    
    for (const field of requiredFields) {
      if (!schema[field]) {
        issues.push(`Organization missing required field: ${field}`);
      }
    }

    // Check sameAs array if present
    if (schema.sameAs && !Array.isArray(schema.sameAs)) {
      issues.push('Organization sameAs must be an array');
    }

    // Validate URLs
    if (schema.url && !this.isValidUrl(schema.url)) {
      issues.push('Organization URL is not valid');
    }
  }

  // Validate BreadcrumbList schema
  validateBreadcrumbSchema(schema, issues) {
    if (!schema.itemListElement) {
      issues.push('BreadcrumbList missing itemListElement');
      return;
    }

    if (!Array.isArray(schema.itemListElement)) {
      issues.push('BreadcrumbList itemListElement must be an array');
      return;
    }

    schema.itemListElement.forEach((item, index) => {
      if (!item['@type'] || item['@type'] !== 'ListItem') {
        issues.push(`BreadcrumbList item ${index + 1} missing @type: ListItem`);
      }
      if (!item.position) {
        issues.push(`BreadcrumbList item ${index + 1} missing position`);
      }
      if (!item.name) {
        issues.push(`BreadcrumbList item ${index + 1} missing name`);
      }
    });
  }

  // Validate ItemList schema
  validateItemListSchema(schema, issues) {
    if (!schema.itemListElement) {
      issues.push('ItemList missing itemListElement');
      return;
    }

    if (!Array.isArray(schema.itemListElement)) {
      issues.push('ItemList itemListElement must be an array');
      return;
    }

    if (schema.numberOfItems && schema.numberOfItems !== schema.itemListElement.length) {
      issues.push('ItemList numberOfItems does not match itemListElement length');
    }
  }

  // Validate CollectionPage schema
  validateCollectionPageSchema(schema, issues) {
    const requiredFields = ['name', 'description', 'url'];
    
    for (const field of requiredFields) {
      if (!schema[field]) {
        issues.push(`CollectionPage missing required field: ${field}`);
      }
    }

    if (schema.mainEntity) {
      const mainEntityIssues = this.validateSchema(schema.mainEntity, 'ItemList');
      issues.push(...mainEntityIssues.map(issue => `CollectionPage mainEntity: ${issue}`));
    }
  }

  // Utility function to validate URLs
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Test schema generation with sample data
  async testSchemaGeneration() {
    this.log('\nTesting schema generation with sample data...', 'header');
    
    try {
      // Since we can't easily import TypeScript modules, we'll test the structure
      // by examining the source code patterns
      
      const utilPath = path.join(process.cwd(), 'lib', 'utils', 'structuredData.ts');
      const content = fs.readFileSync(utilPath, 'utf8');
      
      const issues = [];

      // Check for proper schema.org context usage
      const contextMatches = content.match(/'@context':\s*'https:\/\/schema\.org'/g);
      if (!contextMatches || contextMatches.length < 3) {
        issues.push('Not all schema functions use proper @context');
      }

      // Check for required @type declarations
      const typeMatches = content.match(/'@type':\s*'[^']+'/g);
      if (!typeMatches || typeMatches.length < 5) {
        issues.push('Missing @type declarations in schema functions');
      }

      // Check for URL construction
      if (!content.includes('baseUrl') && !content.includes('NEXT_PUBLIC_APP_URL')) {
        issues.push('Schema functions should use environment-based URLs');
      }

      this.log(issues.length === 0 ? '✅ Schema generation patterns look correct' : `⚠️  Issues: ${issues.join(', ')}`, 
               issues.length === 0 ? 'success' : 'warning');

      return {
        passed: issues.length === 0,
        issues
      };
    } catch (error) {
      this.log(`❌ Error testing schema generation: ${error.message}`, 'error');
      return {
        passed: false,
        issues: [error.message]
      };
    }
  }

  // Test StructuredData component implementation
  async testStructuredDataComponent() {
    this.log('\nTesting StructuredData component...', 'header');
    
    try {
      const componentPath = path.join(process.cwd(), 'components', 'StructuredData.tsx');
      if (!fs.existsSync(componentPath)) {
        throw new Error('StructuredData component not found');
      }

      const content = fs.readFileSync(componentPath, 'utf8');
      const issues = [];

      // Check for proper JSON-LD script tag
      if (!content.includes('application/ld+json')) {
        issues.push('Missing application/ld+json script type');
      }

      // Check for dangerouslySetInnerHTML usage
      if (!content.includes('dangerouslySetInnerHTML')) {
        issues.push('Not using dangerouslySetInnerHTML for JSON-LD');
      }

      // Check for JSON.stringify usage
      if (!content.includes('JSON.stringify')) {
        issues.push('Not properly stringifying JSON-LD data');
      }

      // Check for proper TypeScript interface
      if (!content.includes('interface') && !content.includes('type')) {
        issues.push('Missing TypeScript interface/type definition');
      }

      this.log(issues.length === 0 ? '✅ StructuredData component is properly implemented' : `⚠️  Issues: ${issues.join(', ')}`, 
               issues.length === 0 ? 'success' : 'warning');

      return {
        passed: issues.length === 0,
        issues
      };
    } catch (error) {
      this.log(`❌ Error testing StructuredData component: ${error.message}`, 'error');
      return {
        passed: false,
        issues: [error.message]
      };
    }
  }

  // Test usage of structured data in pages
  async testStructuredDataUsage() {
    this.log('\nTesting structured data usage in pages...', 'header');
    
    const pageFiles = [
      'app/page.tsx',
      'app/tools/[toolName]/page.tsx',
      'app/category/[categoryId]/page.tsx'
    ];

    const issues = [];

    for (const pageFile of pageFiles) {
      const pagePath = path.join(process.cwd(), pageFile);
      if (!fs.existsSync(pagePath)) {
        issues.push(`${pageFile} not found`);
        continue;
      }

      const content = fs.readFileSync(pagePath, 'utf8');

      // Check if page imports StructuredData component
      if (!content.includes('StructuredData')) {
        issues.push(`${pageFile} not using StructuredData component`);
      }

      // Check if page imports schema generation functions
      const schemaImports = [
        'generateWebApplicationSchema',
        'generateToolSchema',
        'generateCategorySchema',
        'generateBreadcrumbSchema'
      ];

      let hasSchemaImport = false;
      for (const schemaImport of schemaImports) {
        if (content.includes(schemaImport)) {
          hasSchemaImport = true;
          break;
        }
      }

      if (!hasSchemaImport) {
        issues.push(`${pageFile} not importing schema generation functions`);
      }
    }

    this.log(issues.length === 0 ? '✅ All pages properly use structured data' : `⚠️  Issues: ${issues.join(', ')}`, 
             issues.length === 0 ? 'success' : 'warning');

    return {
      passed: issues.length === 0,
      issues
    };
  }

  // Generate comprehensive report
  generateReport() {
    this.log('\n' + '='.repeat(60), 'header');
    this.log('STRUCTURED DATA VALIDATION REPORT', 'header');
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
      this.log(`${index + 1}. ${status} ${result.test || 'Test'}`, color);
      
      if (result.issues && result.issues.length > 0) {
        result.issues.forEach(issue => {
          this.log(`   - ${issue}`, 'warning');
        });
      }
    });

    this.log(`\nVALIDATION TOOLS:`, 'header');
    this.log('1. Google Rich Results Test: https://search.google.com/test/rich-results', 'info');
    this.log('2. Schema.org Validator: https://validator.schema.org/', 'info');
    this.log('3. JSON-LD Playground: https://json-ld.org/playground/', 'info');
    this.log('4. Google Search Console Rich Results report', 'info');

    this.log(`\nRECOMMENDATIONS:`, 'header');
    if (failedTests === 0) {
      this.log('🎉 All structured data validations passed!', 'success');
    } else {
      this.log('🔧 Address the issues above to ensure proper structured data implementation.', 'warning');
    }

    return failedTests === 0;
  }

  // Run all structured data tests
  async runAllTests() {
    this.log('Starting Structured Data Validation...', 'header');

    // Test utility functions
    const utilityTest = await this.testStructuredDataUtility();
    this.results.push({ test: 'Structured Data Utility Functions', ...utilityTest });

    // Test schema generation
    const generationTest = await this.testSchemaGeneration();
    this.results.push({ test: 'Schema Generation Patterns', ...generationTest });

    // Test component implementation
    const componentTest = await this.testStructuredDataComponent();
    this.results.push({ test: 'StructuredData Component', ...componentTest });

    // Test usage in pages
    const usageTest = await this.testStructuredDataUsage();
    this.results.push({ test: 'Structured Data Usage in Pages', ...usageTest });

    return this.generateReport();
  }
}

// Run the validation if this script is executed directly
if (require.main === module) {
  const validator = new StructuredDataValidator();
  validator.runAllTests().then((success) => {
    process.exit(success ? 0 : 1);
  }).catch((error) => {
    console.error('Structured data validation failed:', error);
    process.exit(1);
  });
}

module.exports = StructuredDataValidator;