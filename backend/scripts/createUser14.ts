import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const firebaseUid = 'UhXXrtNZalRXbKETL6CijtRi7EC3'; // ⚠️ Replace this!
  const email = 'demo14@user.com';

  const user = await prisma.user.create({
    data: {
      id: firebaseUid,
      email: email,
      name: 'Demo User 14'
    }
  });

  console.log('✅ User created:', user);
  await prisma.$disconnect();
}

main();