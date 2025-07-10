import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await params
  if (!id) {
    return NextResponse.json({ error: 'ID do buteco ausente' }, { status: 400 })
  }

  try {
    const buteco = await prisma.buteco.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        image_url: true,
        logo_url: true,
        rating: true,
        food: true,
        drink: true,
        ambiance: true,
        service: true,
        price: true,
        reviews: {
          where: { user_id: userId },
          select: {
            id: true,
            food: true,
            drink: true,
            ambiance: true,
            service: true,
            price: true,
            rating: true
          }
        }
      }
    })

    if (!buteco) {
      return NextResponse.json({ error: 'Buteco não encontrado' }, { status: 404 })
    }

    return NextResponse.json(buteco)
  } catch (error) {
    console.error('[BUTECOS_ID_GET]:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
 
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const id = (await params).id;
    await prisma.buteco.delete({
      where: { id },
    })
    return NextResponse.json({ success: 'Buteco deletetado.' }, { status: 200 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro ao deletar buteco.' }, { status: 500 })
  }
}
