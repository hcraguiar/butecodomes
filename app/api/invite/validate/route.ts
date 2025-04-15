import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { validateOrigin } from '@/app/lib/validate-origin';

export async function POST(req: Request) {
  if  (!validateOrigin(req)) {
    return new NextResponse('Forbidden', { status: 403 });
  } 

  const token = await req.json();

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const invite = await prisma.invite.findUnique({
    where: { token },
    select: {
      expiresAt: true,
      acceptedById: true,
    },
  });

  const now = new Date();

  const isValid =
    !!invite &&
    invite.acceptedById === null &&
    invite.expiresAt.getTime() > now.getTime();

  return NextResponse.json({ valid: isValid }, { status: 200 });
}
