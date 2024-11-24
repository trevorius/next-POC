import { auth } from '@/auth';

export default auth((req) => {
  // Protect all routes except auth and public ones
  const isPublicPath =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/api/auth');

  if (!isPublicPath && !req.auth) {
    return Response.redirect(new URL('/login', req.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
