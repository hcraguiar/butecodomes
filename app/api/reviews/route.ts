import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  
  // if (!session?.user) {
  //   return NextResponse.json({ error:  'Unauthorized' }, { status: 401 })
  // }

  try {
    const reviews = await prisma.review.findMany({
      select: {
        user: {
          select: {
            name: true,
          },
        },
        buteco: {
          select: {
            name: true,
          },
        },
        food: true,
        drink: true,
        service: true,
        ambiance: true,
        price: true,
        rating: true,
        updatedAt: true,
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to load reviews data' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Não autorizado'}, { status: 401 });

  const isAdmin = session.user.role === "ADMIN";

  const body = await req.json();
  const { butecoId, ratings, checkInId , userId } = body; 

  const user_id = (userId && isAdmin) ? userId : session.user.id;

  if (!butecoId || !ratings) {
    return NextResponse.json({ error:  'Missing fields' }, { status: 400 })
  }

  try {
    const existing = await prisma.review.findFirst({
      where: {
        buteco_id: butecoId,
        user_id
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Review already exists' },  { status: 409 });
    }

    const review = await prisma.review.create({
      data: {
        user_id,
        buteco_id: butecoId,
        ...ratings,
        checkInId,
      },
    })

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, food, drink, ambiance, service, price, rating } = body

  try {
    const review = await prisma.review.findUnique({ where: { id } })

    if (session.user.role !== "ADMIN") {
      if (!review || review.user_id !== session.user.id)
        return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
    }

    const updated = await prisma.review.update({
      where: { id },
      data: {
        food,
        drink,
        ambiance,
        service,
        price,
        rating,
      },
    })

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update evaluation' }, { status: 500 })
  }
}
