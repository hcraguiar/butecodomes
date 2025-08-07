import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params
  const butecoId = id;

  try {
    const allUsers = await prisma.user.findMany({
      select: { id: true, name: true },
    });

    const checkins = await prisma.checkIn.findMany({
      where: { butecoId },
      select: {
        participants: {
          select: { userId: true }
        }
      }
    });

    const checkedInIds = new Set(
      checkins.flatMap(c => c.participants.map(p => p.userId))
    );

    const available = allUsers.filter(u => !checkedInIds.has(u.id));

    return NextResponse.json(available);
  } catch (error) {
    console.error(error);
    return new NextResponse('Erro ao buscar usuários disponíveis', { status: 500 });
  }
}