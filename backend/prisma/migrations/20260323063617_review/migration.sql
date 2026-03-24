-- CreateTable
CREATE TABLE `reviews` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `guestId` INTEGER NOT NULL,
    `bookingId` INTEGER NULL,
    `roomTypeId` INTEGER NULL,
    `rating` INTEGER NOT NULL DEFAULT 5,
    `comment` TEXT NULL,
    `staffReply` TEXT NULL,
    `status` ENUM('pending', 'approved', 'rejected', 'hidden') NOT NULL DEFAULT 'pending',
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `reviews_bookingId_key`(`bookingId`),
    INDEX `reviews_guestId_idx`(`guestId`),
    INDEX `reviews_roomTypeId_idx`(`roomTypeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `guests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_roomTypeId_fkey` FOREIGN KEY (`roomTypeId`) REFERENCES `room_types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
