// app/api/butecos/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: 'Não autorizado'}, { status: 401 });

  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = parseInt(searchParams.get('limit') ?? '10', 10);
  const search = searchParams.get('search') ?? '';
  const orderBy = searchParams.get('orderBy') ?? 'createdAt';
  const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

  const skip = (page - 1) * limit;

  const validOrderFields = ['createdAt', 'name', 'rating'];
  const orderField = validOrderFields.includes(orderBy) ? orderBy : 'createdAt';

  try {
    const [butecos, total] = await Promise.all([
      prisma.buteco.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        orderBy: {
          [orderField]: order 
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          address: true,
          image_url:true,
          logo_url: true,
          rating: true,
          createdAt: true,
          food: true,
          drink: true,
          ambiance: true,
          service: true,
          price: true,
          checkIn: {
            where: {
              participants: {
                some: {
                  userId: userId,
                }
              }
            },
            select: {
              id: true,
              participants: {
                select: { hasEvaluated: true }
              }
            }
          },
          reviews: {
            where: {
              user_id: userId,
            },
            select: {
              id: true,
              food: true,
              drink: true,
              ambiance: true,
              service: true,
              price: true,
            }
          },
          _count : { select: { reviews: true }}
        },
      }),
      prisma.buteco.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: butecos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
    
  } catch (err) {
    console.error('Erro ao buscar butecos', err);
    return NextResponse.json({ error: 'Erro ao buscar butecos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, address, latitude, longitude, image_url, logo_url } = body;

    const newButeco = await prisma.buteco.create({
      data: {
        name,
        address,
        latitude,
        longitude,
        image_url,
        logo_url,
      },
    });

    return NextResponse.json(newButeco, { status: 201 });
  } catch (err) {
    console.error('Erro ao cadastrar buteco', err);
    return NextResponse.json({ error: 'Erro ao cadastrar buteco' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    const updated = await prisma.buteco.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('Erro ao buscar butecos:', err);
    return NextResponse.json({ error: 'Erro ao atualizar buteco' }, { status: 500 });
  }
}
