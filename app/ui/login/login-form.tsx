'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Button from '@/app/ui/button';
import { AtSymbolIcon, KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function LoginForm() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      setError('Credenciais inválidas. Tente novamente.');
    } else {
      router.push(callbackUrl);
    }
    
    setLoading(false);
  };


  return (
    <form className="mt-6 w-full max-w-sm" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 mb-3 pl-10 text-black"
          required
        />
        <AtSymbolIcon className='pointer-events-none absolute left-3 top-[16px] h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-500' />
      </div>
      <div className="relative">
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 mb-3 pl-10 text-black"
          required
        />
        <KeyIcon className='pointer-events-none absolute top-[16px] left-3 h-[18px] w-[18px] text-gray-500 peer-focus:text-gray-500' />
      </div>
      <Button type="submit" variant="primary" aria-disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>
      <div className="flex items-end space-x-1" aria-live="polite" aria-atomic="true">
        {error && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm mt-3 text-red-500">{error}</p>
            </>
          )}
        </div>
    </form>
  );
}
