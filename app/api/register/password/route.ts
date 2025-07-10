import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = await req.json();
  const session = await auth();
  const email = session?.user?.email;

  if (!password) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: "Sessão inválida."}, { status: 403 })
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao salvar senha." }, { status: 500 });
  }
}
