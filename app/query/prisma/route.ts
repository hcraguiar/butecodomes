import { prisma } from "@/prisma/prisma";

async function listUsers() {
	const data = await prisma.user.findMany();

	return data;
}

export async function GET() {
  try {
  	return Response.json(await listUsers());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}

