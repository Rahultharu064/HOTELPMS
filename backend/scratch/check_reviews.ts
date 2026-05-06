import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });
  console.log(JSON.stringify(reviews, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
