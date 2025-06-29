import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = '3SIYL52KO2QhfVi2uE6ADqmjKPA3'; // paste your actual UID here

  const user = await prisma.user.findUnique({
    where: { id: firebaseUid }
  });

  if (user) {
    console.log('✅ User exists in DB:', user);
  } else {
    console.log('❌ User not found in DB');
  }

  await prisma.$disconnect();
}

main();
