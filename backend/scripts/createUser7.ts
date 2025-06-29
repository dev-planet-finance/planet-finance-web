import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'r8GZgbhpFkWFmBpQHWqHRQOQ9yi1'; // 👈 Replace with actual UID
  const email = 'demo7@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email,
      name: 'Demo User 7',
    },
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();
