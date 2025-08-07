import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  const session = await auth();
  const user = session?.user;

  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
  }

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
          [orderField]: order,
        },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          address: true,
          image_url: true,
          logo_url: true,
          rating: true,
          createdAt: true,
          food: true,
          drink: true,
          ambiance: true,
          service: true,
          price: true,
          checkIn: {
            select: {
              id: true,
              createdAt: true,
              participants: {
                select: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  hasEvaluated: true,
                },
              },
              review: {
                select: {
                  id: true,
                  food: true,
                  drink: true,
                  ambiance: true,
                  service: true,
                  price: true,
                  createdAt: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                }
              },
            },
          },
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
    console.error('Erro ao buscar butecos (admin)', err);
    return NextResponse.json({ error: 'Erro ao buscar butecos' }, { status: 500 });
  }
}
