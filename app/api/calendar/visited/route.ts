// app/api/visited/route.ts
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Não autorizado'}, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const skip = (page - 1) * limit;

    const visited = await prisma.buteco.findMany({
      where: {
        firstCheckInAt: { not: null }, // só retorna visitados
      },
      orderBy: {
        firstCheckInAt: "desc", // agora podemos ordenar direto
      },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        logo_url: true,
        firstCheckInAt: true,
        checkIn: {
          orderBy: { createdAt: "asc" },
          select: {
            createdAt: true,
            participants: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ visited });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar butecos visitados" },
      { status: 500 }
    );
  }
}
