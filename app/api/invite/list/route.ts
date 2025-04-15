// app/api/invite/list/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getInvitesByUser } from "@/app/lib/data";

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 5; // Defina o número de convites por página

  try {
    const { invites, total } = await getInvitesByUser(session.user.id, page, perPage);
    const totalPages = Math.ceil(total / perPage);
    return NextResponse.json({invites, totalPages});
  } catch (error) {
    console.error("Erro ao buscar convites:", error);
    return NextResponse.json({ error: "Erro ao buscar convites" }, { status: 500 });
  }
}
