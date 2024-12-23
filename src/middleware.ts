import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth(async (req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;

  // Protect superadmin routes
  if (
    pathname.startsWith('/superadmin') ||
    pathname.startsWith('/api/superadmin')
  ) {
    if (!req.auth?.user?.isSuperAdmin) {
      return Response.redirect(new URL('/unauthorized', nextUrl));
    }
  }

  // Check for organizationId in dynamic route segments
  const organizationIdMatch = pathname.match(/\/organizations\/([^\/]+)/);
  const organizationId = organizationIdMatch?.[1];

  if (organizationId) {
    // Check if user is authenticated
    if (!req.auth?.user) {
      return Response.redirect(new URL('/auth/login', nextUrl));
    }

    // Instead of checking the database directly in middleware,
    // we'll verify membership in the route handlers
    // This avoids Edge Runtime database limitations
    return NextResponse.next();
  }

  // Protect profile routes
  if (pathname.startsWith('/profile')) {
    if (!req.auth?.user) {
      return Response.redirect(new URL('/auth/login', nextUrl));
    }
  }

  return NextResponse.next();
});

// Configure matcher for protected routes
export const config = {
  matcher: [
    '/superadmin/:path*',
    '/api/superadmin/:path*',
    '/organizations/:organizationId/:path*',
    '/api/organizations/:organizationId/:path*',
    '/profile/:path*',
  ],
};
