import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'WAoECxekhERmIiIF7FV0R6UjNtb2'; // ⚠️ Replace this!
  const email = 'demo11@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User 11'
    }
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();