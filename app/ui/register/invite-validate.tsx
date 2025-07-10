'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { validateInviteToken } from '@/app/lib/invite-validator'; // Ajuste o caminho
import Button from '@/app/ui/button';
import Link from 'next/link';
import { HouseIcon } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

function withInviteValidation(WrappedComponent: React.ComponentType<Props>) {
  return function WithInviteValidation(props: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
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
    }, [searchParams, router]);

    if (inviteValid === null) {
      return <div className="min-h-screen flex items-center justify-center"><p className="text-sm text-center text-muted dark:text-dark-muted">Validando convite...</p></div>;
    }

    if (!inviteValid) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-lg font-semibold text-center text-red-600">Convite Inválido</h2>
          <p className="text-sm text-center text-muted dark:text-dark-muted">Solicite um novo convite.</p>
          {/* Opcional: Botão para voltar à página inicial */}
          <Button size='icon' variant='outline' className='rounded-full mt-6'>
            <Link href='/' >
              <HouseIcon className='w-4 h-4'/>
            </Link>
          </Button>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

export default withInviteValidation;
