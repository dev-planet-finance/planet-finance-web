// scripts/createUser3.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'RditM73CtpfSn3ZcSQATLuBuTQr2';
  const email = 'demo3@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email,
      name: 'Demo User 3',
    },
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();
