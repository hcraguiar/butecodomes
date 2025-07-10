'use client';

import Logo from '@/app/ui/logo';
import LoginForm from '@/app/ui/login/login-form';
import GoogleSignInButton from '@/app/ui/login/google';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const messages: Record<string, string> = {
  AccessDenied: 'Acesso negado.',
  NoSession: 'Você precisa estar logado.',
  InvalidCredentials: 'Credenciais inválidas.',
  MissingFields: 'Preencha todos os campos.',
  InvalidInvite: 'Convite inválido.',
  AccountCreated: 'Sua conta foi criada com sucesso.',
}



export default function LoginPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const success = searchParams.get('success');
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all relative">
      {/* Logo */}
      <Logo />

      <h1 className="text-3xl md:text-4xl font-bold mt-6">Faça Login</h1>
      <p className="mt-2 text-base md:text-lg max-w-xl">
        Entre com suas credenciais ou use o Google.
      </p>

      {/* Alertas */}
      
      {success && (
        toast.success(
          messages[success as string] ?? 'Sucesso!'
        )
         
      )}

      {error && (
        toast.error(messages[error as string] ?? 'Erro desconhecido.')
      )}
      
      {/* Formulário de Login */}
      <Suspense>
        <LoginForm />
      </Suspense>
      
      {/* Login com Google */}
      <GoogleSignInButton />
      
    </div>
  );
}

