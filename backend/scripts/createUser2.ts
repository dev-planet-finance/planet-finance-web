import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'NfUtj3daioXHAy9beJpjA2ntYWx2'; // <-- token UID you used
  const email = 'demo2@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email,
      name: 'Demo User 2'
    }
  });

  console.log('✅ Correct user inserted:', user);
  await prisma.$disconnect();
}

main();
