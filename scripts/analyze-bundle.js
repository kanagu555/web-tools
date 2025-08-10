#!/usr/bin/env node

/**
 * Bundle analysis script for Next.js application
 * Analyzes bundle sizes and provides optimization recommendations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUNDLE_SIZE_LIMITS = {
  maxInitialJS: 244 * 1024, // 244KB
  maxInitialCSS: 50 * 1024,  // 50KB
  maxAsyncChunk: 244 * 1024, // 244KB
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundleSize() {
  console.log('🔍 Analyzing bundle sizes...\n');

  const nextDir = path.join(process.cwd(), '.next');
  const staticDir = path.join(nextDir, 'static');

  if (!fs.existsSync(nextDir)) {
    console.error('❌ .next directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // Analyze JavaScript bundles
  const jsDir = path.join(staticDir, 'chunks');
  if (fs.existsSync(jsDir)) {
    console.log('📦 JavaScript Bundles:');
    const jsFiles = fs.readdirSync(jsDir).filter(file => file.endsWith('.js'));
    
    let totalJSSize = 0;
    const bundleInfo = [];

    jsFiles.forEach(file => {
      const filePath = path.join(jsDir, file);
      const stats = fs.statSync(filePath);
      totalJSSize += stats.size;
      
      bundleInfo.push({
        name: file,
        size: stats.size,
        formatted: formatBytes(stats.size)
      });
    });

    // Sort by size (largest first)
    bundleInfo.sort((a, b) => b.size - a.size);

    bundleInfo.slice(0, 10).forEach(bundle => {
      const status = bundle.size > BUNDLE_SIZE_LIMITS.maxAsyncChunk ? '⚠️' : '✅';
      console.log(`  ${status} ${bundle.name}: ${bundle.formatted}`);
    });

    console.log(`\n📊 Total JS Size: ${formatBytes(totalJSSize)}\n`);
  }

  // Analyze CSS bundles
  const cssDir = path.join(staticDir, 'css');
  if (fs.existsSync(cssDir)) {
    console.log('🎨 CSS Bundles:');
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
    
    let totalCSSSize = 0;

    cssFiles.forEach(file => {
      const filePath = path.join(cssDir, file);
      const stats = fs.statSync(filePath);
      totalCSSSize += stats.size;
      
      const status = stats.size > BUNDLE_SIZE_LIMITS.maxInitialCSS ? '⚠️' : '✅';
      console.log(`  ${status} ${file}: ${formatBytes(stats.size)}`);
    });

    console.log(`\n📊 Total CSS Size: ${formatBytes(totalCSSSize)}\n`);
  }

  // Provide recommendations
  console.log('💡 Optimization Recommendations:');
  console.log('  • Use dynamic imports for large components');
  console.log('  • Implement code splitting for route-based chunks');
  console.log('  • Consider lazy loading for non-critical components');
  console.log('  • Optimize images using Next.js Image component');
  console.log('  • Remove unused dependencies and code');
  console.log('  • Use tree shaking for library imports');
}

function runBundleAnalyzer() {
  console.log('🚀 Running Next.js Bundle Analyzer...\n');
  
  try {
    execSync('cross-env ANALYZE=true npm run build', { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
  } catch (error) {
    console.error('❌ Failed to run bundle analyzer:', error.message);
    process.exit(1);
  }
}

function checkPerformance() {
  console.log('⚡ Performance Check Summary:\n');

  // Check if performance config exists
  const perfConfigPath = path.join(process.cwd(), 'config', 'performance.js');
  if (fs.existsSync(perfConfigPath)) {
    console.log('✅ Performance configuration found');
  } else {
    console.log('⚠️  Performance configuration missing');
  }

  // Check if bundle analyzer is configured
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.devDependencies && packageJson.devDependencies['@next/bundle-analyzer']) {
    console.log('✅ Bundle analyzer configured');
  } else {
    console.log('⚠️  Bundle analyzer not configured');
  }

  // Check if next.config.js has optimization settings
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (nextConfig.includes('swcMinify')) {
      console.log('✅ SWC minification enabled');
    } else {
      console.log('⚠️  SWC minification not configured');
    }

    if (nextConfig.includes('optimizePackageImports')) {
      console.log('✅ Package import optimization enabled');
    } else {
      console.log('⚠️  Package import optimization not configured');
    }

    if (nextConfig.includes('images:')) {
      console.log('✅ Image optimization configured');
    } else {
      console.log('⚠️  Image optimization not configured');
    }
  }

  console.log('\n');
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'analyze':
    runBundleAnalyzer();
    break;
  case 'size':
    analyzeBundleSize();
    break;
  case 'check':
    checkPerformance();
    break;
  default:
    console.log('Usage: node scripts/analyze-bundle.js [analyze|size|check]');
    console.log('  analyze - Run Next.js bundle analyzer');
    console.log('  size    - Analyze current bundle sizes');
    console.log('  check   - Check performance configuration');
    break;
}