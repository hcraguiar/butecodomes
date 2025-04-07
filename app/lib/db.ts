import { prisma } from '@/prisma/prisma';

type MinimalUser = {
  email: string;
  name?: string;
  image?: string;
}

export const createUserIfNotExists = async (
  user: MinimalUser
) => {
  if (!user.email) return;

  const existingUser = await prisma.user.findUnique({ where: { email: user.email } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name ?? '',
        image: user.image ?? '',
      }
    })
  }
}