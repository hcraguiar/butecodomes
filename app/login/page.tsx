'use client';

import Logo from '@/app/ui/logo';
import LoginForm from '@/app/ui/login/login-form';
import GoogleSignInButton from '@/app/ui/login/google';
import { Suspense } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all relative">
      {/* Logo */}
      <Logo />
      
      <h1 className="text-3xl md:text-4xl font-bold mt-6">Faça Login</h1>
      <p className="mt-2 text-base md:text-lg max-w-xl font-secondary">
        Entre com suas credenciais ou use o Google.
      </p>
      
      {/* Formulário de Login */}
      <Suspense>
        <LoginForm />
      </Suspense>
      
      {/* Login com Google */}
      <GoogleSignInButton />
      
      {/* <p className="mt-4 text-sm">
        Ainda não tem uma conta? <Link href="/register" className="text-blue-500">Cadastre-se</Link>
      </p> */}
    </div>
  );
}

