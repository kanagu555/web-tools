# URL Redirects and Route Compatibility

This document outlines the comprehensive URL redirect and route compatibility implementation for the Next.js migration of KodeKit.

## Overview

The redirect system ensures that all existing bookmarks, deep links, and search engine indexed URLs continue to work after the migration from Vite to Next.js. This implementation includes:

1. **Next.js Config Redirects** - Server-side redirects for common patterns
2. **Middleware Redirects** - Dynamic redirects for complex cases
3. **Canonical URL Management** - Consistent URL generation
4. **SEO Optimization** - Proper meta tags and structured data

## Implementation Components

### 1. Next.js Configuration Redirects (`next.config.js`)

The main redirect configuration handles:

- **Legacy Routes**: Old direct tool routes (e.g., `/calculator` → `/tools/calculator`)
- **Category Routes**: Old category patterns (e.g., `/pdf-tools` → `/category/pdf`)
- **Case-Sensitive Variations**: Mixed case tool names (e.g., `/tools/PDF-Merger` → `/tools/pdf-merger`)
- **Alternative Patterns**: Common variations (e.g., `/tool/name` → `/tools/name`)
- **Short Forms**: Abbreviated tool names (e.g., `/tools/ppf-calc` → `/tools/ppf-calculator`)
- **Trailing Slashes**: Consistent URL format (e.g., `/tools/name/` → `/tools/name`)

### 2. Middleware (`middleware.ts`)

The middleware handles dynamic redirects that can't be configured statically:

- **Case-Insensitive URLs**: Automatically converts to lowercase
- **Query Parameter Redirects**: Old SPA-style parameters (e.g., `?tool=calculator`)
- **Short URL Handling**: Legacy short URL patterns (`/s/code`)
- **HTML Extension Removal**: Static site patterns (`.html` removal)
- **WWW Subdomain Handling**: Consistent domain usage
- **Security Headers**: Additional security and SEO headers

### 3. Canonical URL Utilities (`lib/utils/canonicalUrl.ts`)

Utility functions for consistent URL generation:

- `getCanonicalUrl(path)` - Generate canonical URLs
- `getToolCanonicalUrl(toolName)` - Tool-specific canonical URLs
- `getCategoryCanonicalUrl(categoryId)` - Category-specific canonical URLs
- `normalizeToolName(name)` - Normalize tool names for URLs
- `normalizeCategoryId(id)` - Normalize category IDs for URLs
- `shouldRedirect(path)` - Check if a URL needs redirection
- `generateBreadcrumbUrls(path)` - Generate breadcrumb navigation

### 4. Page-Level Integration

Both tool and category pages integrate canonical URL handling:

- **Metadata Generation**: Proper canonical URLs in meta tags
- **URL Normalization**: Consistent parameter handling
- **Structured Data**: SEO-optimized structured data with canonical URLs

## Redirect Categories

### Legacy Route Redirects (301 Permanent)

These handle old direct routes from the Vite application:

```
/calculator → /tools/calculator
/pdf-tools → /category/pdf
/text-tools → /category/text
/design-tools → /category/design
/developer-tools → /category/developer
/math-tools → /category/math
/finance-tools → /category/finance
/healthcare-tools → /category/healthcare
/time-tools → /category/time
```

### Case-Sensitive Redirects (301 Permanent)

Handle mixed-case variations of tool names:

```
/tools/PDF-Merger → /tools/pdf-merger
/tools/Base64-Encoder-Decoder → /tools/base64-encoder-decoder
/tools/JSON-Formatter → /tools/json-formatter
/tools/Word-Count → /tools/word-count
/tools/Text-Case-Converter → /tools/text-case-converter
/tools/Regex-Tester → /tools/regex-tester
/tools/Color-Picker → /tools/color-picker
/tools/QR-Code-Generator → /tools/qr-code-generator
```

### Alternative Pattern Redirects (301 Permanent)

Handle common URL variations:

```
/tool/:toolName → /tools/:toolName
/categories → /category (temporary redirect)
/#/:path* → /:path* (hash-based routes)
```

### Short Form Redirects (301 Permanent)

Handle abbreviated tool names:

```
/tools/ppf-calc → /tools/ppf-calculator
/tools/sip-calc → /tools/sip-calculator
/tools/ssy-calc → /tools/ssy-calculator
/tools/swp-calc → /tools/swp-calculator
```

### Trailing Slash Handling (301 Permanent)

Ensure consistent URL format:

```
/tools/:toolName/ → /tools/:toolName
/category/:categoryId/ → /category/:categoryId
```

## SEO Benefits

### Canonical URLs

Every page includes proper canonical URLs:

```html
<link rel="canonical" href="https://kodekit.in/tools/calculator" />
```

### Meta Tags

Proper meta tags with canonical URLs:

```html
<meta property="og:url" content="https://kodekit.in/tools/calculator" />
<meta name="twitter:url" content="https://kodekit.in/tools/calculator" />
```

### Structured Data

JSON-LD structured data with canonical URLs for better search engine understanding.

### HTTP Headers

Additional SEO and security headers:

- `Link: <canonical-url>; rel="canonical"`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: origin-when-cross-origin`

## Testing

### Automated Testing

Run the redirect test script:

```bash
node scripts/test-redirects.js
```

This script verifies:

- Next.js redirect configuration
- Middleware implementation
- Canonical URL utilities
- Page-level integration
- Unit test coverage

### Manual Testing Checklist

1. **Legacy Routes**: Visit old URLs and verify redirects
2. **Case Sensitivity**: Test mixed-case URLs
3. **Trailing Slashes**: Verify slash handling
4. **Canonical URLs**: Check page source for canonical tags
5. **SEO Meta Tags**: Verify proper meta tag generation
6. **Browser Testing**: Test across different browsers
7. **Production Build**: Test with `npm run build && npm start`

### Test Cases

The implementation includes comprehensive test cases covering:

- 19 different redirect scenarios
- Case-sensitive URL handling
- Trailing slash normalization
- Query parameter redirects
- Short URL handling
- Canonical URL generation

## Performance Considerations

### Redirect Performance

- **Server-Side Redirects**: Most redirects happen at the server level for optimal performance
- **Middleware Efficiency**: Middleware uses efficient pattern matching
- **Caching**: Proper cache headers for static assets
- **301 vs 302**: Permanent redirects (301) for SEO benefit, temporary (302) only for dynamic short URLs

### SEO Impact

- **Link Equity**: 301 redirects preserve search engine ranking
- **Crawl Budget**: Efficient redirects reduce crawl waste
- **User Experience**: Fast redirects maintain user experience
- **Canonical URLs**: Prevent duplicate content issues

## Monitoring and Maintenance

### Redirect Monitoring

Monitor redirect performance and usage:

- Track redirect hit rates
- Monitor for redirect chains
- Check for broken redirects
- Analyze user behavior on redirected URLs

### Future Considerations

- **New Tool Additions**: Update redirect patterns for new tools
- **URL Structure Changes**: Maintain backward compatibility
- **Analytics Integration**: Track redirect usage in analytics
- **Performance Optimization**: Regular performance reviews

## Troubleshooting

### Common Issues

1. **Redirect Loops**: Check for circular redirects
2. **Case Sensitivity**: Ensure proper normalization
3. **Query Parameters**: Verify parameter handling
4. **Cache Issues**: Clear browser/CDN cache for testing
5. **Middleware Order**: Ensure proper middleware execution order

### Debug Tools

- Browser Developer Tools (Network tab)
- Next.js build output
- Server logs
- Redirect testing tools
- SEO audit tools

## Conclusion

This comprehensive redirect implementation ensures:

- **Zero Broken Links**: All existing URLs continue to work
- **SEO Preservation**: Search engine rankings are maintained
- **User Experience**: Seamless navigation for all users
- **Future-Proof**: Scalable system for future changes
- **Performance**: Efficient redirect handling

The implementation follows Next.js best practices and provides a robust foundation for the migrated application.
