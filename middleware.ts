import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_URL;


export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;
  const isAuth = !!session;

  const publicPages = ['/', '/login', '/register'];


  // A sessão está iniciada e o usuário tenta acessar publicPages
  // o usuário é redirecionado para dashboard
  if (isAuth && publicPages.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Redireciona para login caso o usuário tente acessar /dashboard
  // sem uma sessão ativa
  if (!isAuth && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redireciona para login caso o usuário tente acessar o formulário de registro de senha
  // sem uma sessão ativa
  if (!isAuth && pathname.startsWith('/register/password')) {
    return NextResponse.redirect(new URL('/login?error=NoSession', request.url));
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
  '/dashboard/:path*',
  '/register/password/:path*',
  '/api/invite/:path*',
  '/api/register/:path*',
  '/',
  '/login'
  ],
};
