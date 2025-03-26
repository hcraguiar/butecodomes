import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
