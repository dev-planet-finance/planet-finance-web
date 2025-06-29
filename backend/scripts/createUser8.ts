import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'ghvK4uYbSTT9n5Q2eDFWlTII9nM2'; // Replace with actual UID from Firebase console
  const email = 'demo8@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User 8'
    }
  });

  console.log('✅ User created:', user);

  await prisma.$disconnect();
}

main();
