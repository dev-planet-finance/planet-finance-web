import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'hHcEQyyXHFhD00A9F7WRIAPkMor1'; // ⚠️ Replace this!
  const email = 'demo16@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User 16'
    }
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();