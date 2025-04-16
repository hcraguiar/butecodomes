import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_URL;


export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  const isAuth = !!session;

  const publicPages = ['/', '/login', '/register'];
  
  if (isAuth && publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isAuth && pathname.startsWith('/dashboard') ) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const origin = request.headers.get('origin');
  const protectedApiRoutes = pathname.startsWith('/api/invite/') || pathname.startsWith('/api/register/');

  if (protectedApiRoutes && origin && origin !== ALLOWED_ORIGIN) {
    return new NextResponse('Forbidden: Invalid Origin', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/invite',
    '/api/invite/:path*',
    '/api/register/:path*',
    '/((?!api|_next/static|_next/image|.*\\.png$).*)'
  ],
};
