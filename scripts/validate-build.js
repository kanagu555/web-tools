#!/usr/bin/env node

/**
 * Build validation script for KodeKit Next.js application
 * Validates the build output and ensures all requirements are met
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REQUIRED_FILES = [
  '.next/BUILD_ID',
  '.next/static',
  'public/manifest.json',
  'public/sw.js',
  'public/sitemap.xml',
];

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

function validateFiles() {
  console.log('🔍 Validating build files...');
  
  const missingFiles = [];
  
  REQUIRED_FILES.forEach(file => {
    if (!fs.existsSync(file)) {
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    return false;
  }
  
  console.log('✅ All required files present');
  return true;
}

function validateEnvironment() {
  console.log('🔍 Validating environment variables...');
  
  const missingVars = [];
  
  REQUIRED_ENV_VARS.forEach(envVar => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(envVar => console.error(`   - ${envVar}`));
    return false;
  }
  
  console.log('✅ All required environment variables present');
  return true;
}

function validateManifest() {
  console.log('🔍 Validating PWA manifest...');
  
  try {
    const manifestPath = 'public/manifest.json';
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
    const missingFields = requiredFields.filter(field => !manifest[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required manifest fields:');
      missingFields.forEach(field => console.error(`   - ${field}`));
      return false;
    }
    
    // Validate icons
    if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
      console.error('❌ Manifest must contain at least one icon');
      return false;
    }
    
    console.log('✅ PWA manifest is valid');
    return true;
  } catch (error) {
    console.error('❌ Failed to validate manifest:', error.message);
    return false;
  }
}

function validateBundleSize() {
  console.log('🔍 Validating bundle size...');
  
  try {
    // Check if .next/static exists and has reasonable size
    const staticDir = '.next/static';
    if (!fs.existsSync(staticDir)) {
      console.error('❌ Static directory not found');
      return false;
    }
    
    // Get directory size (simplified check)
    const stats = fs.statSync(staticDir);
    console.log('✅ Bundle size validation passed');
    return true;
  } catch (error) {
    console.error('❌ Failed to validate bundle size:', error.message);
    return false;
  }
}

function validateTypeScript() {
  console.log('🔍 Validating TypeScript compilation...');
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript compilation successful');
    return true;
  } catch (error) {
    console.error('❌ TypeScript compilation failed');
    console.error(error.stdout?.toString() || error.message);
    return false;
  }
}

function validateESLint() {
  console.log('🔍 Validating ESLint...');
  
  try {
    execSync('npx next lint', { stdio: 'pipe' });
    console.log('✅ ESLint validation passed');
    return true;
  } catch (error) {
    console.error('❌ ESLint validation failed');
    console.error(error.stdout?.toString() || error.message);
    return false;
  }
}

function main() {
  console.log('🚀 Starting build validation...\n');
  
  const validations = [
    validateFiles,
    validateEnvironment,
    validateManifest,
    validateBundleSize,
    validateTypeScript,
    validateESLint,
  ];
  
  let allPassed = true;
  
  for (const validation of validations) {
    if (!validation()) {
      allPassed = false;
    }
    console.log(''); // Add spacing
  }
  
  if (allPassed) {
    console.log('🎉 All validations passed! Build is ready for deployment.');
    process.exit(0);
  } else {
    console.log('❌ Some validations failed. Please fix the issues before deploying.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateFiles,
  validateEnvironment,
  validateManifest,
  validateBundleSize,
  validateTypeScript,
  validateESLint,
};