import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = '7hsikCxcQYf3XO99MvAJMk8q5wf2';
  const email = 'demo6@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email,
      name: 'Demo User 5'
    }
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();
