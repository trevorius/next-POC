import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export default auth(async function middleware(request: NextRequest) {
  const session = await auth();
  const isPublicPath =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/api/auth');

  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
