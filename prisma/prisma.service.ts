import { LatestReviews, RankingComponent } from '@/app/lib/definitions';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function listUsers() {
  const users = await prisma.user.findMany({
    select: {
      name: true,
      email: true,
    },
  });
  return users;
}

export async function listLastReviews(number = 6): Promise<LatestReviews[]> {
  try {
    const reviews = await prisma.review.findMany({
      take: number,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        user: {
          select: {
          name: true,
        },
      },
      buteco: {
        select: {
          name: true,
        }
      },
      rating: true,
      },
    });
    return reviews;
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    throw new Error('Falha ao buscar dados.')
  }
}

export async function ranking(number = 3): Promise<RankingComponent[]> {
  try {
    const butecos = await prisma.buteco.findMany({
      take: number,
      orderBy: {
        rating: 'desc',
      },
      select: {
        name: true,
        rating: true,
      },
    });
    return butecos;
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    throw new Error('Falha ao buscar dados.')
  }
}

export async function countReviews(): Promise<number> {
  const count = await prisma.review.count();
  return count;
}

export async function countMembers(): Promise<number> {
  const count = await prisma.user.count();
  return count;
}

export async function countVisitedButeco(): Promise<number> {
  const count = await prisma.buteco.count({
    where: {
      rating: {
        gt: 0,
      }
    }
  });
  return count;
}

export async function fetchCardData() {
  try {
    const data = await Promise.all([
      countMembers(),
      countReviews(),
      countVisitedButeco(),
    ]);

    const membersCount = data[0] ?? 0;
    const reviewsCount = data[1] ?? 0;
    const visitedButecos = data[2] ?? 0;

    return { reviewsCount, membersCount, visitedButecos };
  } catch (error) {
    console.error('Erro no banco de dados:', error);
    throw new Error('Falha ao buscar dados.')
  }
}

