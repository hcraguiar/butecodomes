import { cancelInvite } from "@/app/lib/data";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing invite ID"}, { status: 400 });


  const invite = await prisma.invite.findUnique({
    where: {
      id,
      invitedById: session.user.id,
    },
  });

  if (!invite) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
  }

  await cancelInvite(id);

  return NextResponse.json({ success: true });
}
