// app/auth/check-password/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSession } from 'next-auth/react';

export default function CheckPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkPassword = async () => {
      const session = await getSession();
      const email = session?.user?.email;

      if (!email) {
        router.push('/login?error=NoSession');
        return;
      }

      try {
        const res = await fetch(`/api/user/has-password?email=${email}`);
        const data = await res.json();

        if (data.hasPassword) {
          router.push('/dashboard');
        } else {
          router.push(`/register/password?Email=${email}`);
        }
      } catch (e) {
        router.push('/login?error=PasswordCheckFailed');
      }
    };

    checkPassword();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded-lg shadow-m max-w-sm w-full">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
        <p className="mt-6 text-sm text-gray-500 text-center">
          Verificando suas credenciais...
        </p>
      </div>
    </div>
  );
}
