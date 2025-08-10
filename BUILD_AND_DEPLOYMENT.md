# KodeKit Next.js Build and Deployment Guide

This document outlines the build and deployment configuration for the KodeKit Next.js application.

## 📋 Overview

The application is configured with comprehensive build optimization, PWA support, and deployment automation for multiple platforms.

## 🏗️ Build Configuration

### Next.js Configuration (`next.config.js`)

The configuration includes:

- **PWA Support**: Service worker with caching strategies
- **Image Optimization**: WebP/AVIF support with multiple domains
- **Bundle Analysis**: Webpack optimization and code splitting
- **Security Headers**: CSP, HSTS, and other security measures
- **Performance**: SWC minification and package optimization

### Key Features

1. **Progressive Web App (PWA)**

   - Service worker with runtime caching
   - Offline support for static assets
   - App manifest with shortcuts and screenshots

2. **Image Optimization**

   - Next.js Image component integration
   - WebP and AVIF format support
   - Responsive image sizing

3. **Bundle Optimization**

   - Automatic code splitting
   - Vendor chunk separation
   - Material-UI specific optimization

4. **Security**
   - Content Security Policy headers
   - XSS protection
   - Frame options and MIME type sniffing prevention

## 🌍 Environment Configuration

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
# Application Configuration
NEXT_PUBLIC_APP_URL=https://kodekit.in
NEXT_PUBLIC_APP_NAME="KodeKit"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Third-party APIs
NEXT_PUBLIC_WEB3FORMS_KEY=your_web3forms_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

### Environment-Specific Settings

The `config/environments.js` file contains environment-specific configurations:

- **Development**: PWA disabled, debug logging, no caching
- **Staging**: PWA enabled, info logging, short caching
- **Production**: Full optimization, error logging, long caching

## 🚀 Build Scripts

### Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run start              # Start production server

# Analysis and Optimization
npm run build:analyze      # Build with bundle analysis
npm run build:standalone   # Build standalone version

# Quality Assurance
npm run lint               # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run type-check        # TypeScript type checking
npm run validate          # Validate build output

# Deployment
npm run clean             # Clean build artifacts
npm run export            # Export static version
npm run serve             # Serve static build locally
```

### Build Process

1. **Pre-build**: Clean previous builds
2. **Build**: Next.js compilation with optimizations
3. **Post-build**: Generate sitemap and validate output
4. **Validation**: Check files, environment, and code quality

## 📦 Deployment Options

### 1. Vercel (Recommended)

The application is optimized for Vercel deployment:

```bash
# Deploy to Vercel
npx vercel --prod

# Or use the deployment script
DEPLOY_TO_VERCEL=true ./deploy.sh
```

Configuration in `vercel.json`:

- Framework detection
- Function timeouts
- Header configuration
- Redirects and rewrites

### 2. Docker Deployment

Use the provided Dockerfile for containerized deployment:

```bash
# Build Docker image
docker build -t kodekit-nextjs .

# Run container
docker run -p 3000:3000 kodekit-nextjs
```

### 3. Static Export

For static hosting platforms:

```bash
# Generate static export
npm run export

# Serve locally
npm run serve
```

## 🔧 Performance Optimization

### Bundle Analysis

Run bundle analysis to optimize performance:

```bash
npm run build:analyze
```

This generates a detailed report of bundle sizes and dependencies.

### Core Web Vitals

The application is optimized for Core Web Vitals:

- **LCP**: < 2.5s (Image optimization, code splitting)
- **FID**: < 100ms (Minimal JavaScript, lazy loading)
- **CLS**: < 0.1 (Proper image dimensions, font loading)

### Caching Strategy

1. **Static Assets**: 1 year cache with immutable headers
2. **API Responses**: 5 minutes with stale-while-revalidate
3. **Pages**: 1 hour with ISR support
4. **Service Worker**: Runtime caching for offline support

## 🛡️ Security Configuration

### Headers

Security headers are configured in `next.config.js`:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`
- `Strict-Transport-Security`
- `Permissions-Policy`

### Content Security Policy

CSP is configured for image optimization and third-party integrations.

## 📊 Monitoring and Analytics

### Performance Monitoring

The application includes performance monitoring configuration:

- Core Web Vitals tracking
- Bundle size monitoring
- Real User Monitoring (RUM)

### Analytics Integration

Support for:

- Google Analytics 4
- Vercel Speed Insights
- Custom performance metrics

## 🔍 Validation and Testing

### Build Validation

The `scripts/validate-build.js` script checks:

- Required files presence
- Environment variables
- PWA manifest validity
- Bundle size limits
- TypeScript compilation
- ESLint compliance

### Quality Gates

Before deployment, ensure:

1. All tests pass
2. TypeScript compiles without errors
3. ESLint validation passes
4. Bundle size is within limits
5. PWA manifest is valid
6. Required environment variables are set

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**

   - Check TypeScript errors: `npm run type-check`
   - Verify environment variables
   - Clear cache: `npm run clean`

2. **PWA Issues**

   - Verify manifest.json syntax
   - Check service worker registration
   - Test offline functionality

3. **Performance Issues**
   - Run bundle analysis: `npm run build:analyze`
   - Check image optimization settings
   - Verify caching headers

### Debug Mode

Enable debug mode for troubleshooting:

```bash
DEBUG=* npm run build
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Guide](https://vercel.com/docs)
- [PWA Best Practices](https://web.dev/pwa-checklist/)
- [Core Web Vitals](https://web.dev/vitals/)

## 🤝 Contributing

When making changes to build configuration:

1. Test locally with `npm run build`
2. Run validation with `npm run validate`
3. Test deployment in staging environment
4. Update this documentation if needed

---

For questions or issues, please refer to the project documentation or create an issue in the repository.
