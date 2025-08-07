import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma/prisma";
import { auth } from "@/auth";
import { create } from "domain";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado'}, { status: 401 });
  }

  const body = await req.json();
  const { butecoId, participantIds, createdAt } = body;

  if (!butecoId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const allParticipants = Array.from(new Set([...participantIds]));

  try {
    const alreadyCheckedIn = await prisma.checkInParticipant.findMany({
      where:{ 
        checkIn: { butecoId },
        userId: { in: allParticipants },
      },
      select: {
        userId: true
      },
    })

    const alreadyIds = new Set(alreadyCheckedIn.map((p) => p.userId))

    const validParticipants = allParticipants.filter((id) => !alreadyIds.has(id))

    if (validParticipants.length === 0) {
      return NextResponse.json({ message: 'Nenhum participante elegível para check-in'}, { status: 200 })
    }

    const checkIn = await prisma.checkIn.create({
      data: {
        butecoId,
        createdById: userId,
        createdAt: new Date(createdAt) ?? undefined,
        participants: {
          create: allParticipants.map((userId: string) => ({ user: { connect: { id: userId }}}))
        },
      },
      include: {
        participants: true,
      },
    })

    return NextResponse.json(checkIn, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Falha ao fazer check-in' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return NextResponse.json({ error: 'Não autorizado'}, { status: 401 });

  const body = await req.json();
  const { checkInId } = body;

  try {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id: checkInId },
      include: { participants: true },
    })

    if (!checkIn) return NextResponse.json({ error: 'Check-in not found' }, { status: 404 });

    const validation = checkIn.participants.some(p => p.userId === userId && p.hasEvaluated === false);

    if (!validation) {
      return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    }

    await prisma.checkIn.update({
      where: { id: checkIn.id },
      data: {
        participants: {
          deleteMany: { userId: userId }
        },
      },
    })

    if (checkIn.participants.length === 1) {
      await prisma.checkIn.delete({ where: { id: checkIn.id }})
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Falha ao desfazer check-in'}, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Não autorizado'}, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return 

  try {
    const checkIn = await prisma.checkIn.findUnique({
      where: { id },
      select: {
        participants: {
          where: { userId },
          select: {
            hasEvaluated: true,
          }, 
        },
      },
    });

    return NextResponse.json({ checkIn });

  } catch (err) {
    console.error('Erro ao buscar check-in', err);
    return NextResponse.json({ error: 'Erro ao buscar check-in' }, { status: 500 });
  }
}

