import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that don't require authentication
const publicPaths = ['/login'];

// Add paths that require authentication but not project selection
const authOnlyPaths = ['/projects'];

// Add paths that do not require project selection
const noProjectPaths = ['/login', '/projects'];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = publicPaths.includes(pathname);
  
  // Define paths that require authentication but not project selection
  const isProjectSelectionPath = authOnlyPaths.includes(pathname);
  
  // Get authentication cookies
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true';
  const userCookie = request.cookies.get('user')?.value;
  const selectedProject = request.cookies.get('selectedProject')?.value;
  
  // Validate user cookie structure
  let isValidUser = false;
  try {
    if (userCookie) {
      const user = JSON.parse(userCookie);
      isValidUser = Boolean(user && user.id && user.email && user.role);
    }
  } catch {
    isValidUser = false;
  }

  // If not authenticated and trying to access protected route, redirect to login
  if (!isPublicPath && (!isAuthenticated || !isValidUser)) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Check if project selection is required
  if (!noProjectPaths.includes(pathname)) {
    if (!selectedProject) {
      const url = request.nextUrl.clone();
      url.pathname = '/projects';
      return NextResponse.redirect(url);
    }
  }
  // Admin route check
  if (pathname.startsWith('/admin') && (!isValidUser || (userCookie && JSON.parse(userCookie).role !== 'admin'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 