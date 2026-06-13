-- CreateEnum
-- MySQL uses ENUM column directly on table

-- CreateTable
CREATE TABLE `gallery_venues` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(500) NOT NULL,
    `icon` VARCHAR(50) NOT NULL DEFAULT 'UtensilsCrossed',
    `layout` ENUM('featured', 'compact', 'wide') NOT NULL DEFAULT 'compact',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `gallery_venues_slug_key`(`slug`),
    INDEX `gallery_venues_isActive_idx`(`isActive`),
    INDEX `gallery_venues_sortOrder_idx`(`sortOrder`),
    INDEX `gallery_venues_layout_idx`(`layout`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed default venues (safe for fresh table)
INSERT INTO `gallery_venues` (`title`, `slug`, `description`, `image`, `icon`, `layout`, `sortOrder`, `isActive`, `updatedAt`) VALUES
('Royal Dining', 'royal-dining', 'Multi-cuisine fine dining with expert chefs and elegant ambience.', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80', 'UtensilsCrossed', 'featured', 1, true, CURRENT_TIMESTAMP(3)),
('Tropical Outdoor', 'tropical-outdoor', 'Garden lounge & outdoor space for intimate gatherings.', 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80', 'TreePalm', 'compact', 2, true, CURRENT_TIMESTAMP(3)),
('Royal Banquet', 'royal-banquet', 'Grand hall for weddings, receptions & celebrations.', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', 'Crown', 'compact', 3, true, CURRENT_TIMESTAMP(3)),
('Annapurna Hall', 'annapurna-hall', 'Professional conference & meeting room for up to 25 attendees.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 'Presentation', 'wide', 4, true, CURRENT_TIMESTAMP(3));
