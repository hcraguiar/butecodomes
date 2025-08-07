import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';

export async function POST(
  req: NextRequest,
) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { butecoId, participantIds, createdAt } = await req.json();

    const checkIn = await prisma.checkIn.create({
      data: {
        butecoId,
        createdById: session.user.id,
        createdAt: new Date(createdAt),
        participants: {
          create: participantIds.map((userId: string) => ({ userId })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });

    return NextResponse.json(checkIn);
  } catch (error) {
    console.error('[ADMIN_CHECKINS_POST]', error);
    return new NextResponse('Erro ao criar check-in', { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session || session.user.role !== 'ADMIN') {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { checkInId, participantIds, createdAt } = await req.json();

    // Participantes atuais do check-in
    const existingParticipants = await prisma.checkInParticipant.findMany({
      where: { checkInId },
      select: { id: true, userId: true, hasEvaluated: true },
    });

    const existingUserIds = existingParticipants.map(p => p.userId);

    // Participantes a adicionar
    const addedParticipantIds = participantIds.filter(
      (id: string) => !existingUserIds.includes(id)
    );

    // Participantes a remover (não estão mais na lista E ainda não avaliaram)
    const removableParticipants = existingParticipants.filter(
      p => !participantIds.includes(p.userId) && !p.hasEvaluated
    );

    const removableParticipantIds = removableParticipants.map(p => p.id);

    // Remover os que ainda não avaliaram
    if (removableParticipantIds.length > 0) {
      await prisma.checkInParticipant.deleteMany({
        where: { id: { in: removableParticipantIds } },
      });
    }

    // Adicionar novos participantes
    if (addedParticipantIds.length > 0) {
      await prisma.checkInParticipant.createMany({
        data: addedParticipantIds.map((userId: string) => ({
          userId,
          checkInId,
        })),
      });
    }

    // Atualizar data do check-in
    const updatedCheckIn = await prisma.checkIn.update({
      where: { id: checkInId },
      data: {
        createdAt: new Date(createdAt),
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedCheckIn);
  } catch (error) {
    console.error('[ADMIN_CHECKINS_PUT]', error);
    return new NextResponse('Erro ao editar check-in', { status: 500 });
  }
}
