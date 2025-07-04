import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'GBtN8u0vnONzcVtvQFb6bgyuMV83'; // ⚠️ Replace this!
  const email = 'demo15@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User 15'
    }
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();