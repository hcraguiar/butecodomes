import { createInvite } from "@/app/lib/data";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { validateOrigin } from "@/app/lib/validate-origin";

export async function POST(req: Request) {
   if  (!validateOrigin(req)) {
      return new NextResponse('Forbidden', { status: 403 });
    } 

  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado"}, { status: 401 });

  const invite = await createInvite(session.user.id);

  return NextResponse.json(invite);
}
