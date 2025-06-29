import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'jc7Z2cpsPQMWMqSYbRt4WmHb8lb2';
  const email = 'demo5@user.com';

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
