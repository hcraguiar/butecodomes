import { prisma } from "@/prisma/prisma";
import { InviteCard } from "../ui/dashboard/invite/invite-card";

export async function validateInviteToken(token: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/invite/validate?token=${token}`, {
      method: "POST",
      body: JSON.stringify(token),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return false;


    const data = await res.json();
    return data.valid;
  } catch (err) {
    return false;
  }
}

export async function validateInviteTokenServer(token: string) {
  const invite = await prisma.invite.findUnique({
    where: { token },
    select: { expiresAt: true, acceptedById: true },
  });

  if (!invite) return false;
  
  const isExpired = new Date(invite.expiresAt) < new Date();
  const isUsed = !!invite.acceptedById;

  return !isExpired && !isUsed;
}

