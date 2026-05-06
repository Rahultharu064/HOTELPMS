import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Analyzing feedback and updating facility plans...');

  // Update Oasis Pool
  await prisma.facility.update({
    where: { slug: 'oasis-pool' },
    data: {
      plannedUpgrade: 'Installation of advanced temperature control and solar heating system (Winter 2026). Implementation of underwater lighting and music system.'
    }
  });

  // Update Restaurant
  await prisma.facility.update({
    where: { slug: 'restaurant' },
    data: {
      plannedUpgrade: 'Expansion of outdoor seating terrace. New wood-fired pizza oven installation. Introduction of farm-to-table weekend specials.'
    }
  });

  // Create a new facility that is "Planned"
  await prisma.facility.upsert({
    where: { slug: 'smart-gym' },
    update: {},
    create: {
      name: 'Smart Fitness Center',
      slug: 'smart-gym',
      description: 'A modern fitness facility with AI-powered equipment.',
      category: 'gym',
      status: 'maintenance',
      location: 'Floor 3',
      openingHours: 'Coming Soon - Summer 2026',
      plannedUpgrade: 'Opening of a state-of-the-art gym with Peloton bikes and personal AI trainers.'
    }
  });

  console.log('✅ Facility future plans updated based on guest feedback analysis.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
