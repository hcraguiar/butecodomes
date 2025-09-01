import { Suggested } from "@/app/lib/types";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  try {
    const now = new Date();

    const [scheduled, suggested] = await prisma.$transaction([
      // 1) Próximos encontros
      prisma.calendar.findMany({
        where: { date: { gte: now } },
        orderBy: { date: "asc" },
        select: {
          id: true,
          date: true,
          buteco: {
            select: {
              id: true,
              name: true,
              logo_url: true,
              image_url: true,
            },
          },
        },
      }),

      // 2) Butecos sugeridos (sem agenda e sem checkin)
      prisma.buteco.findMany({
        where: {
          calendar: { none: {} },
          checkIn: { none: {} },
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          logo_url: true,
          image_url: true,
        },
      }),
    ]);

    return NextResponse.json({ scheduled, suggested });
  } catch (error) {
    console.error("[CALENDAR_API]", error);
    return NextResponse.json({ error: "Erro ao buscar agenda" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { buteco_id, date } = body

    if (!date) {
      return NextResponse.json({ error: "Campos obrigatórios faltando"}, { status: 400 })
    }

    const schedule = await prisma.calendar.create({
      data: {
        buteco_id,
        date: new Date(date),
      },
    })

    return NextResponse.json(schedule, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, buteco_id, date } = body

    if (!id || !date) {
      return NextResponse.json({ error: "Campos obrigatórios faltando"}, { status: 400 })
    }

    const update = await prisma.calendar.update({
      where: {
        id,
      },
      data: {
        buteco_id,
        date: new Date(date),
      },
    })

    return NextResponse.json(update, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id } = body

    if (!id ) {
      return NextResponse.json({ error: "Campos obrigatórios faltando"}, { status: 400 })
    }

    const update = await prisma.calendar.delete({
      where: { id },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: "Erro ao criar agendamento" }, { status: 500 })
  }
}

