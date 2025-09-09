import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";


export async function GET() {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error:  'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id;

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)

  try {
    const [topButecos, recentReviews, pendingReviews, stats, topUsers, nextSchedule] = await Promise.all([
      prisma.buteco.findMany({
        take: 3,
        orderBy: { rating: 'desc' },
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
        }
      }),

      prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { name: true, image: true } },
          buteco: { select: { name: true, logo_url: true } }
        }
      }),

      prisma.checkInParticipant.findMany({
        where: {
          userId,
          hasEvaluated: false 
        },
        select: { 
          createdAt: true,
          checkInId: true,
          checkIn: {
            select: {
              buteco: {
                select: { id: true, name: true, logo_url: true }
              }
            }
          }
        }
      }),

      prisma.$transaction([
        prisma.review.count(),
        prisma.checkInParticipant.count(),
        prisma.buteco.count({
          where: {
            checkIn: {
              some: {
                id: {
                  not: undefined,
                }
              }
            }
          }
        })
      ]),

      prisma.user.findMany({
        take: 5,
        orderBy: {
          reviews: { _count: 'desc' }
        },
        select: {
          name: true,
          image: true,
          _count: { select: { reviews: true } }
        }
      }),

      prisma.calendar.findMany({
        where: { date: { gte: startOfDay }},
        orderBy: { date: 'asc' },
        take: 1,
        include: {
          buteco: {
            select: {
              id: true,
              name: true,
              logo_url: true,
              image_url: true,
            }
          }
        }
      }),
    ])

    return NextResponse.json({
      userId,
      topButecos,
      recentReviews,
      pendingReviews,
      totalReviews: stats[0],
      totalCheckIns: stats[1],
      totalVisited: stats[2],
      topUsers,
      nextSchedule,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 })
  }
}
