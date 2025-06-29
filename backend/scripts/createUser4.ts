import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'JGguFFYScTY7aS0Jv1hdNLKjoQG3';
  const email = 'demo4@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email,
      name: 'Demo User 4'
    }
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();
