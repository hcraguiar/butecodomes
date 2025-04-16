'use client';

import Logo from '@/app/ui/logo';
import LoginForm from '@/app/ui/login/login-form';
import GoogleSignInButton from '@/app/ui/login/google';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

const messages: Record<string, string> = {
  AccessDenied: 'Acesso negado.',
  InvalidCredentials: 'Credenciais inválidas.',
  MissingFields: 'Preencha todos os campos.',
  InvalidInvite: 'Convite inválido.',
  AccountCreated: 'Sua conta foi criada com sucesso',
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
      <p className="mt-2 text-base md:text-lg max-w-xl font-secondary">
        Entre com suas credenciais ou use o Google.
      </p>

      {/* Alertas */}
      {success && (
        <div className='flex w-full self-start items-center  mt-3 rounded-md bg-green-200 h-10 p-3'>
          <div className="flex items-end space-x-1" aria-live="polite" aria-atomic="true">
            <ExclamationCircleIcon className="h-5 w-5 text-green-500" />
            <p className="text-sm text-green-500">{messages[success as string]}</p>
          </div>
        </div>
      )}

      {error && (
        <div className='flex w-full self-start items-center  mt-3 rounded-md bg-red-200 h-10 p-3'>
          <div className="flex items-end space-x-1" aria-live="polite" aria-atomic="true">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{messages[error as string] ?? 'Ocorreu um erro!'}</p>
          </div>
        </div>
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

