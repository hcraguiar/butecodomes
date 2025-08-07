import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_URL;

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  const isAuth = !!session;

  const publicPages = ['/', '/login', '/register'];

  // ✅ 1. Usuário autenticado acessando página pública → redireciona para dashboard
  if (isAuth && publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ✅ 2. Acesso não autorizado ao /dashboard
  if (!isAuth && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ 3. Protege /register/password sem sessão
  if (!isAuth && pathname.startsWith('/register/password')) {
    return NextResponse.redirect(new URL('/login?error=NoSession', request.url));
  }

  // ✅ 4. Protege API /invite/ e /register/ por origem
  const origin = request.headers.get('origin');
  const protectedApiRoutes =
    pathname.startsWith('/api/invite/') || pathname.startsWith('/api/register/');

  if (protectedApiRoutes && origin && origin !== ALLOWED_ORIGIN) {
    return new NextResponse('Forbidden: Invalid Origin', { status: 403 });
  }

  // ✅ 5. Protege /dashboard/admin para role !== 'Admin'
  if (pathname.startsWith('/dashboard/admin')) {
    const role = session?.user?.role;
    const isAdmin = role === 'ADMIN';

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/403', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/dashboard/admin/:path*',
    '/register/password/:path*',
    '/api/invite/:path*',
    '/api/register/:path*',
    '/',
    '/login',
  ],
};
