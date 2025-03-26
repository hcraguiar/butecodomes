import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client';
import { useSession } from 'next-auth/client';
import { Params } from 'next/dist/server/request/params';

const prisma = new PrismaClient();

export async function getServerSideProps({ params }: { params: { token: string } }) {
  const { token }: Params;

  const invite = await prisma.invite.findUnique({
    where: { token },
  });

  if (!invite || invite.expiresAt < new Date() || invite.used) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      token,
    },
  };
}

export default function InvitePage({ token }: { token: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      registerUser();
    }
  }, [session]);

  const registerUser = async () => {
    try {
      if (session && session.user) {
        await prisma.invite.update({
          where: { token },
          data: {
            used: true,
          }
        });
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      setErrorMessage('Ocorreu um erro durante o cadastro. Por favor, tente novamente.');
    }
  };

  if (!session) {
    return (
      <div className="">
        <p>Essa página é apenas para convidados.</p>
        <button onClick={() => SignIn()}>Registre-se para aceitar o convite</button>
      </div>
    );
  }

  return (
    <div className="">
      {errorMessage && <p>{errorMessage}</p>}
      <p>Convite aceito. Seja bem-vindo à comunidade!</p>
    </div>
  );
}
