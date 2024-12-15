import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Protect superadmin routes
  if (
    nextUrl.pathname.startsWith('/superadmin') ||
    nextUrl.pathname.startsWith('/api/superadmin')
  ) {
    if (!req.auth?.user?.isSuperAdmin) {
      return Response.redirect(new URL('/unauthorized', nextUrl));
    }
  }

  return NextResponse.next();
});

// Optionally, configure your matcher
export const config = {
  matcher: ['/superadmin/:path*', '/api/superadmin/:path*'],
};
