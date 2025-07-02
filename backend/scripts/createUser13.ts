import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'SLXGkt6GhbW9d8Ehn4E9SptY8ok2'; // ⚠️ Replace this!
  const email = 'demo13@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User 13'
    }
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();