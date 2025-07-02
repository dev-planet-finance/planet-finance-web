import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'MtVxiKt5R8aUHmPGYw7puUNwJ1q2'; // Replace with actual UID from Firebase console
  const email = 'demo9@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User 9'
    }
  });

  console.log('✅ User created:', user);

  await prisma.$disconnect();
}

main();
