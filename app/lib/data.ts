import { prisma } from "@/prisma/prisma";
import { ButecoListType } from "./types";

export async function createInvite(id: string) {
  const token = crypto.randomUUID();
  const expires = new Date()
  expires.setDate(expires.getDate() + 7);

  const invite = await prisma.invite.create({
    data: {
      token,
      expiresAt: expires,
      invitedById: id,
    },
    select: {
      id: true,
      token: true,
      expiresAt: true,
      acceptedBy: {
        select: {
          id: true, 
          name: true,
          email: true,
        },
      },
    },
  });

  return invite;
}

export async function cancelInvite(id: string) {
  const updated = await prisma.invite.update({
    where: {
      id,
    },
    data: {
      expiresAt: new Date(),
    },
  });
  return updated;
}

export async function getInvitesByUser(userId: string, page = 1, perPage = 5) {
  const [invites, total] = await Promise.all([
    prisma.invite.findMany({
      where: { invitedById: userId },
      orderBy: { createdAt: "desc"},
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        token: true,
        expiresAt: true,
        createdAt: true,
        acceptedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.invite.count({
      where: { invitedById: userId },
    }),
  ]);

  return { invites, total };
}


