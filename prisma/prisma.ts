import { PrismaClient } from "@prisma/client";

export const runtime = "node"; // Prisma rodando no Node.js

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
