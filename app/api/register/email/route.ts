import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma";
import { validateInviteTokenServer } from "@/app/lib/invite-validator";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, name, password, email } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
    }

    const isValid = token ? await validateInviteTokenServer(token) : false;
    if (!isValid) {
      return NextResponse.json({ error: "Convite inválido ou expirado."}, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 400 });
    }

    const hashedPassword = await hash(password, 10);


    const [user, updatedInvite] = await prisma.$transaction([
      prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      }),
      prisma.invite.update({
        where: { token: token },
        data: {
          acceptedBy: {
            connect: {
              email,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json({ error: "Erro ao registrar usuário." }, { status: 500 });
  }
}

