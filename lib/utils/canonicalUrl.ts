/**
 * Utility functions for generating canonical URLs and handling redirects
 */

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.kodekit.in';

/**
 * Generate a canonical URL for a given path
 */
export function getCanonicalUrl(path: string): string {
  // Remove leading slash if present and ensure no trailing slash
  const cleanPath = path.replace(/^\/+/, '').replace(/\/+$/, '');
  
  // Handle root path
  if (!cleanPath) {
    return BASE_URL;
  }
  
  return `${BASE_URL}/${cleanPath}`;
}

/**
 * Generate canonical URL for a tool page
 */
export function getToolCanonicalUrl(toolName: string): string {
  return getCanonicalUrl(`tools/${toolName.toLowerCase()}`);
}

/**
 * Generate canonical URL for a category page
 */
export function getCategoryCanonicalUrl(categoryId: string): string {
  return getCanonicalUrl(`category/${categoryId.toLowerCase()}`);
}

/**
 * Validate and normalize tool name for URL
 */
export function normalizeToolName(toolName: string): string {
  return toolName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validate and normalize category ID for URL
 */
export function normalizeCategoryId(categoryId: string): string {
  return categoryId
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Check if a URL needs to be redirected based on our routing rules
 */
export function shouldRedirect(currentPath: string): { shouldRedirect: boolean; redirectTo?: string } {
  const path = currentPath.toLowerCase();
  
  // Check for legacy routes that need redirects
  const legacyRoutes: Record<string, string> = {
    '/calculator': '/tools/calculator',
    '/pdf-tools': '/category/pdf',
    '/text-tools': '/category/text',
    '/design-tools': '/category/design',
    '/developer-tools': '/category/developer',
    '/math-tools': '/category/math',
    '/finance-tools': '/category/finance',
    '/healthcare-tools': '/category/healthcare',
    '/time-tools': '/category/time',
  };

  if (legacyRoutes[path]) {
    return { shouldRedirect: true, redirectTo: legacyRoutes[path] };
  }

  // Check for case-sensitive tool names
  if (path.startsWith('/tools/')) {
    const toolName = path.split('/tools/')[1];
    const normalizedToolName = normalizeToolName(toolName);
    if (toolName !== normalizedToolName) {
      return { shouldRedirect: true, redirectTo: `/tools/${normalizedToolName}` };
    }
  }

  // Check for case-sensitive category names
  if (path.startsWith('/category/')) {
    const categoryId = path.split('/category/')[1];
    const normalizedCategoryId = normalizeCategoryId(categoryId);
    if (categoryId !== normalizedCategoryId) {
      return { shouldRedirect: true, redirectTo: `/category/${normalizedCategoryId}` };
    }
  }

  // Check for trailing slashes (except root)
  if (path.length > 1 && path.endsWith('/')) {
    return { shouldRedirect: true, redirectTo: path.slice(0, -1) };
  }

  return { shouldRedirect: false };
}

/**
 * Generate breadcrumb URLs for navigation
 */
export function generateBreadcrumbUrls(path: string): Array<{ name: string; url: string }> {
  const breadcrumbs: Array<{ name: string; url: string }> = [
    { name: 'Home', url: getCanonicalUrl('') }
  ];

  if (path.startsWith('/tools/')) {
    const toolName = path.split('/tools/')[1];
    breadcrumbs.push(
      { name: 'Tools', url: getCanonicalUrl('categories') },
      { name: toolName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), url: getCanonicalUrl(path) }
    );
  } else if (path.startsWith('/category/')) {
    const categoryId = path.split('/category/')[1];
    breadcrumbs.push(
      { name: 'Categories', url: getCanonicalUrl('categories') },
      { name: categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), url: getCanonicalUrl(path) }
    );
  }

  return breadcrumbs;
}

/**
 * Get all possible URLs for a tool (for sitemap generation)
 */
export function getToolUrls(): string[] {
  // This would typically come from your tools data
  // For now, we'll return a basic set
  const toolNames = [
    'image-to-pdf-converter',
    'pdf-merger',
    'pdf-splitter',
    'word-count',
    'text-case-converter',
    'json-formatter',
    'regex-tester',
    'color-picker',
    'image-resizer',
    'qr-code-generator',
    'gradient-generator',
    'image-compressor',
    'svg-editor',
    'ppf-calculator',
    'sip-calculator',
    'ssy-calculator',
    'swp-calculator',
  ];

  return toolNames.map(toolName => getToolCanonicalUrl(toolName));
}

/**
 * Get all possible category URLs (for sitemap generation)
 */
export function getCategoryUrls(): string[] {
  const categoryIds = [
    'pdf',
    'text',
    'design',
    'developer',
    'math',
    'finance',
    'healthcare',
    'time',
  ];

  return categoryIds.map(categoryId => getCategoryCanonicalUrl(categoryId));
}