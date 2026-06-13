import { prisma } from '../config/database';

const DEFAULT_VENUES = [
  {
    title: 'Royal Dining',
    slug: 'royal-dining',
    description: 'Multi-cuisine fine dining with expert chefs and elegant ambience.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    icon: 'UtensilsCrossed',
    layout: 'featured' as const,
    sortOrder: 1,
  },
  {
    title: 'Tropical Outdoor',
    slug: 'tropical-outdoor',
    description: 'Garden lounge & outdoor space for intimate gatherings.',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
    icon: 'TreePalm',
    layout: 'compact' as const,
    sortOrder: 2,
  },
  {
    title: 'Royal Banquet',
    slug: 'royal-banquet',
    description: 'Grand hall for weddings, receptions & celebrations.',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    icon: 'Crown',
    layout: 'compact' as const,
    sortOrder: 3,
  },
  {
    title: 'Annapurna Hall',
    slug: 'annapurna-hall',
    description: 'Professional conference & meeting room for up to 25 attendees.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    icon: 'Presentation',
    layout: 'wide' as const,
    sortOrder: 4,
  },
];

/**
 * Ensures gallery_venues table exists and seeds default rows when empty.
 * Safe to run on every server start — uses CREATE TABLE IF NOT EXISTS.
 */
export async function ensureGallerySchema(): Promise<void> {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`gallery_venues\` (
        \`id\` INTEGER NOT NULL AUTO_INCREMENT,
        \`title\` VARCHAR(150) NOT NULL,
        \`slug\` VARCHAR(180) NOT NULL,
        \`description\` TEXT NOT NULL,
        \`image\` VARCHAR(500) NOT NULL,
        \`icon\` VARCHAR(50) NOT NULL DEFAULT 'UtensilsCrossed',
        \`layout\` ENUM('featured', 'compact', 'wide') NOT NULL DEFAULT 'compact',
        \`sortOrder\` INTEGER NOT NULL DEFAULT 0,
        \`isActive\` BOOLEAN NOT NULL DEFAULT true,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
        UNIQUE INDEX \`gallery_venues_slug_key\`(\`slug\`),
        INDEX \`gallery_venues_isActive_idx\`(\`isActive\`),
        INDEX \`gallery_venues_sortOrder_idx\`(\`sortOrder\`),
        INDEX \`gallery_venues_layout_idx\`(\`layout\`),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    const count = await prisma.galleryVenue.count();
    if (count === 0) {
      await prisma.galleryVenue.createMany({
        data: DEFAULT_VENUES.map((v) => ({ ...v, isActive: true })),
      });
      console.log('✅ Gallery venues seeded with default data');
    }

    console.log('✅ Gallery schema ready');
  } catch (error) {
    console.error('⚠️ Gallery schema bootstrap failed:', error);
  }
}
