const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    const newUser = await prisma.user.create({
      data: {
        email: 'user@test.com',
        name: 'User Test',
        password: hashedPassword,
      }
  });
  console.log('Usuário criado', newUser);
  } catch (error) {
    console.error('Erro ao criar usuário', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
