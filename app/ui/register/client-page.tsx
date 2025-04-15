'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { validateInviteToken } from '@/app/lib/invite-validator';
import FormSelector from '@/app/ui/register/form-selector';


export default function RegisterPage() {
  const searchParams = useSearchParams();

  const [inviteValid, setInviteValid] = useState<boolean | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setInviteValid(false);
      return;
    }

    validateInviteToken(token).then((valid) => {
      setInviteValid(valid);
    });
  }, [searchParams]);

  if (inviteValid === null) {
    return <p className="text-sm text-muted-foreground">Validando convite...</p>;
  }

  if (!inviteValid) {
    return <p className="text-sm text-red-600">Convite inválido, expirado ou já utilizado.</p>;
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all relative'>
      <FormSelector />
    </div>
  );
}
