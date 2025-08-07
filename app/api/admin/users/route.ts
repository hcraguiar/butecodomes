import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,                     
        },
      })
      
    return NextResponse.json({ data: users });
  } catch (err) {
    console.error('Erro ao buscar butecos (admin)', err);
    return NextResponse.json({ error: 'Erro ao buscar butecos' }, { status: 500 });
  }
}