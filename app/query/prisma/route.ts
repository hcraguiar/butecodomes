import { prisma } from "@/prisma/prisma";

async function listUsers() {
  return prisma.user.findMany();
}

export async function GET() {
  try {
  	return Response.json(await listUsers());
  } catch (error) {
  	return Response.json({ error }, { status: 500 });
  }
}

