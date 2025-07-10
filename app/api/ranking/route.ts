// app/api/ranking/route.ts
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  try {
    const total = await prisma.buteco.count();

    const butecos = await prisma.buteco.findMany({
      orderBy: { rating: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        logo_url: true,
        rating: true,
        food: true,
        drink: true,
        service: true,
        ambiance: true,
        price: true,
      },
    });

    return NextResponse.json({
      data: butecos,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }
    });
  } catch (error) {
    console.error("[RANKING_API]", error);
    return NextResponse.json({ error: "Erro ao buscar ranking" }, { status: 500 });
  }
}
