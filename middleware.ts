import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clearToken, getToken, isTokenExpired } from './utils/token';

export async function middleware(request: NextRequest) {
  const token = await getToken();

  // Check if the route is under /user or /dashboard
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/user') || request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (await isTokenExpired(token)) {
      await clearToken();
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Check if the user is an admin for dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      if (payload.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/user/:path*', '/dashboard/:path*'],
};

