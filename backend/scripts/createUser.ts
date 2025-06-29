import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = '3SIYL52KO2QhfVi2uE6ADqmjKPA3'; // your Firebase UID
  const email = 'demo@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User'
    }
  });

  console.log('✅ User created:', user);

  await prisma.$disconnect();
}

main();
