// pages/api/users/has-password.ts
import { prisma } from '@/prisma/prisma';
import { NextResponse } from 'next/server';

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_URL;

export async function GET(req: Request) {
  const origin = req.headers.get('origin');
  if (origin && !ALLOWED_ORIGIN?.includes(origin)) {
    return NextResponse.json({ error: 'Unauthorized origin' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  try {
    const result = await prisma.user.findUnique({
      where: { email },
      select: { password: true },
    })
    
    const hasPassword = !!result?.password;
    return NextResponse.json({ hasPassword });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
