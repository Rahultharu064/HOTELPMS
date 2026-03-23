/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `amenities` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `amenities` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `bookingRef` on the `bookings` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(3))`.
  - You are about to alter the column `firstName` on the `guests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `lastName` on the `guests` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `caption` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `images` table. All the data in the column will be lost.
  - You are about to drop the column `allowChildren` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `bedCount` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `bedType` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `maxAdults` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `maxChildren` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `room_types` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `room_types` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `slug` on the `room_types` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `roomNumber` on the `rooms` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `status` on the `rooms` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.
  - You are about to drop the column `description` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the `_amenitytoroomtype` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_type_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_type_videos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[bookingNumber]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `guests` will be added. If there are existing duplicate values, this will fail.
  - Made the column `category` on table `amenities` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `bookingNumber` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Made the column `source` on table `bookings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `guests` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_amenitytoroomtype` DROP FOREIGN KEY `_AmenityToRoomType_A_fkey`;

-- DropForeignKey
ALTER TABLE `_amenitytoroomtype` DROP FOREIGN KEY `_AmenityToRoomType_B_fkey`;

-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_roomId_fkey`;

-- DropForeignKey
ALTER TABLE `room_type_images` DROP FOREIGN KEY `room_type_images_roomTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `room_type_videos` DROP FOREIGN KEY `room_type_videos_roomTypeId_fkey`;

-- DropForeignKey
ALTER TABLE `videos` DROP FOREIGN KEY `videos_roomId_fkey`;

-- DropIndex
DROP INDEX `bookings_bookingRef_key` ON `bookings`;

-- DropIndex
DROP INDEX `bookings_checkIn_idx` ON `bookings`;

-- DropIndex
DROP INDEX `bookings_checkOut_idx` ON `bookings`;

-- CreateIndex
CREATE INDEX `rooms_roomTypeId_idx` ON `rooms`(`roomTypeId`);

-- DropIndex
DROP INDEX `rooms_roomTypeId_roomNumber_key` ON `rooms`;

-- AlterTable
ALTER TABLE `amenities` DROP COLUMN `updatedAt`,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `icon` VARCHAR(255) NULL,
    MODIFY `category` ENUM('standard', 'premium', 'accessible') NOT NULL DEFAULT 'standard',
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `bookingRef`,
    ADD COLUMN `bookingNumber` VARCHAR(50) NOT NULL,
    ADD COLUMN `specialRequests` TEXT NULL,
    MODIFY `totalAmount` DECIMAL(10, 2) NOT NULL,
    MODIFY `status` ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show') NOT NULL DEFAULT 'pending',
    MODIFY `source` ENUM('direct', 'ota', 'walk_in', 'corporate') NOT NULL DEFAULT 'direct';

-- AlterTable
ALTER TABLE `guests` ADD COLUMN `address` TEXT NULL,
    ADD COLUMN `city` VARCHAR(100) NULL,
    ADD COLUMN `country` VARCHAR(100) NULL,
    ADD COLUMN `idNumber` VARCHAR(100) NULL,
    ADD COLUMN `idType` ENUM('passport', 'driving_license', 'national_id') NULL DEFAULT 'passport',
    ADD COLUMN `postalCode` VARCHAR(20) NULL,
    ADD COLUMN `totalBookings` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `totalSpent` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    MODIFY `firstName` VARCHAR(100) NOT NULL,
    MODIFY `lastName` VARCHAR(100) NOT NULL,
    MODIFY `email` VARCHAR(255) NOT NULL,
    MODIFY `phone` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `images` DROP COLUMN `caption`,
    DROP COLUMN `updatedAt`,
    MODIFY `url` VARCHAR(500) NOT NULL,
    MODIFY `alt` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `room_types` DROP COLUMN `allowChildren`,
    DROP COLUMN `bedCount`,
    DROP COLUMN `bedType`,
    DROP COLUMN `maxAdults`,
    DROP COLUMN `maxChildren`,
    DROP COLUMN `size`,
    ADD COLUMN `capacity` INTEGER NOT NULL DEFAULT 2,
    ADD COLUMN `pricePerExtraPerson` DECIMAL(10, 2) NULL,
    MODIFY `name` VARCHAR(100) NOT NULL,
    MODIFY `slug` VARCHAR(100) NOT NULL,
    MODIFY `description` TEXT NULL,
    MODIFY `basePrice` DECIMAL(10, 2) NOT NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `bedType` ENUM('single', 'double', 'queen', 'king', 'twin') NULL DEFAULT 'double',
    ADD COLUMN `name` VARCHAR(100) NOT NULL,
    ADD COLUMN `size` INTEGER NULL,
    ADD COLUMN `view` VARCHAR(100) NULL,
    MODIFY `roomNumber` VARCHAR(20) NOT NULL,
    MODIFY `status` ENUM('available', 'occupied', 'maintenance', 'cleaning', 'reserved', 'out_of_service') NOT NULL DEFAULT 'available',
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `videos` DROP COLUMN `description`,
    DROP COLUMN `sortOrder`,
    DROP COLUMN `updatedAt`,
    MODIFY `url` VARCHAR(500) NOT NULL,
    MODIFY `thumbnail` VARCHAR(500) NULL,
    MODIFY `title` VARCHAR(255) NULL;

-- DropTable
DROP TABLE `_amenitytoroomtype`;

-- DropTable
DROP TABLE `room_type_images`;

-- DropTable
DROP TABLE `room_type_videos`;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `method` ENUM('cash', 'esewa', 'khalti') NOT NULL,
    `status` ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
    `transactionId` VARCHAR(255) NULL,
    `paymentData` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `payments_bookingId_idx`(`bookingId`),
    INDEX `payments_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_workflow_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `action` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `performedBy` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `booking_workflow_logs_bookingId_idx`(`bookingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facilities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `status` ENUM('active', 'maintenance', 'closed') NOT NULL DEFAULT 'active',
    `openingHours` VARCHAR(255) NULL,
    `category` ENUM('restaurant', 'pool', 'gym', 'spa', 'business_center', 'parking', 'other') NOT NULL DEFAULT 'other',
    `location` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `facilities_name_key`(`name`),
    UNIQUE INDEX `facilities_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facility_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `alt` VARCHAR(255) NULL,
    `facilityId` INTEGER NOT NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `facility_images_facilityId_idx`(`facilityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facility_videos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `title` VARCHAR(255) NULL,
    `thumbnail` VARCHAR(500) NULL,
    `facilityId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `facility_videos_facilityId_idx`(`facilityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoomTypeAmenities` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoomTypeAmenities_AB_unique`(`A`, `B`),
    INDEX `_RoomTypeAmenities_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoomAmenities` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoomAmenities_AB_unique`(`A`, `B`),
    INDEX `_RoomAmenities_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `bookings_bookingNumber_key` ON `bookings`(`bookingNumber`);

-- CreateIndex
CREATE INDEX `bookings_checkIn_checkOut_idx` ON `bookings`(`checkIn`, `checkOut`);

-- CreateIndex
CREATE UNIQUE INDEX `guests_phone_key` ON `guests`(`phone`);

-- CreateIndex
CREATE INDEX `guests_email_idx` ON `guests`(`email`);

-- CreateIndex
CREATE INDEX `guests_phone_idx` ON `guests`(`phone`);



-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `videos` ADD CONSTRAINT `videos_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_workflow_logs` ADD CONSTRAINT `booking_workflow_logs_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facility_images` ADD CONSTRAINT `facility_images_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facility_videos` ADD CONSTRAINT `facility_videos_facilityId_fkey` FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoomTypeAmenities` ADD CONSTRAINT `_RoomTypeAmenities_A_fkey` FOREIGN KEY (`A`) REFERENCES `amenities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoomTypeAmenities` ADD CONSTRAINT `_RoomTypeAmenities_B_fkey` FOREIGN KEY (`B`) REFERENCES `room_types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoomAmenities` ADD CONSTRAINT `_RoomAmenities_A_fkey` FOREIGN KEY (`A`) REFERENCES `amenities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoomAmenities` ADD CONSTRAINT `_RoomAmenities_B_fkey` FOREIGN KEY (`B`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `bookings` RENAME INDEX `bookings_guestId_fkey` TO `bookings_guestId_idx`;

-- RenameIndex
ALTER TABLE `bookings` RENAME INDEX `bookings_roomId_fkey` TO `bookings_roomId_idx`;

-- RenameIndex
ALTER TABLE `videos` RENAME INDEX `videos_roomId_fkey` TO `videos_roomId_idx`;
