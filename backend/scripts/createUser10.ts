import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'zpPGvpkfQrXy551gsekfEZ62ABx2'; // ⚠️ Replace this!
  const email = 'demo10@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User 10'
    }
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();
