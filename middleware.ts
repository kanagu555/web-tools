import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Handle www subdomain redirects (ensure consistent domain)
  // if (request.headers.get("host")?.startsWith("www.")) {
  //   const newHost = request.headers.get("host")?.replace("www.", "");
  //   url.host = newHost || url.host;
  //   return NextResponse.redirect(url, 301);
  // }

  // Handle case-insensitive tool names
  if (pathname.startsWith("/tools/")) {
    const toolName = pathname.split("/tools/")[1];
    if (toolName && toolName !== toolName.toLowerCase()) {
      url.pathname = `/tools/${toolName.toLowerCase()}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // Handle case-insensitive category names
  if (pathname.startsWith("/category/")) {
    const categoryName = pathname.split("/category/")[1];
    if (categoryName && categoryName !== categoryName.toLowerCase()) {
      url.pathname = `/category/${categoryName.toLowerCase()}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // Handle old query parameter patterns (e.g., ?tool=calculator)
  if (pathname === "/" && search.includes("tool=")) {
    const urlParams = new URLSearchParams(search);
    const toolParam = urlParams.get("tool");
    if (toolParam) {
      url.pathname = `/tools/${toolParam.toLowerCase()}`;
      url.search = "";
      return NextResponse.redirect(url, 301);
    }
  }

  // Handle old category query parameters (e.g., ?category=pdf)
  if (pathname === "/" && search.includes("category=")) {
    const urlParams = new URLSearchParams(search);
    const categoryParam = urlParams.get("category");
    if (categoryParam) {
      url.pathname = `/category/${categoryParam.toLowerCase()}`;
      url.search = "";
      return NextResponse.redirect(url, 301);
    }
  }

  // Handle legacy index.html patterns
  if (pathname.endsWith("/index.html")) {
    url.pathname = pathname.replace("/index.html", "") || "/";
    return NextResponse.redirect(url, 301);
  }

  // Handle .html extensions (common in static sites)
  if (pathname.endsWith(".html") && pathname !== "/index.html") {
    url.pathname = pathname.replace(".html", "");
    return NextResponse.redirect(url, 301);
  }

  // Ensure canonical URLs by removing trailing slashes (except root)
  if (pathname.length > 1 && pathname.endsWith("/")) {
    url.pathname = pathname.slice(0, -1);
    return NextResponse.redirect(url, 301);
  }

  // Add security headers
  const response = NextResponse.next();

  // Add canonical URL header for SEO
  const canonicalUrl = `https://kodekit.in${pathname}`;
  response.headers.set("Link", `<${canonicalUrl}>; rel="canonical"`);

  // Add cache control headers for static assets
  if (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/static/")
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     * - manifest.json (PWA manifest)
     * - sw.js (service worker)
     * - workbox-*.js (workbox files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json|sw.js|workbox-.*\\.js).*)",
  ],
};
