/*
  Warnings:

  - You are about to drop the column `basePrice` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerExtraPerson` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `room_types` table. All the data in the column will be lost.
  - You are about to drop the `_roomtypeamenities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `basePrice` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_roomtypeamenities` DROP FOREIGN KEY `_RoomTypeAmenities_A_fkey`;

-- DropForeignKey
ALTER TABLE `_roomtypeamenities` DROP FOREIGN KEY `_RoomTypeAmenities_B_fkey`;

-- DropIndex
DROP INDEX `room_types_slug_key` ON `room_types`;

-- AlterTable
ALTER TABLE `room_types` DROP COLUMN `basePrice`,
    DROP COLUMN `capacity`,
    DROP COLUMN `pricePerExtraPerson`,
    DROP COLUMN `slug`,
    ADD COLUMN `image` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `basePrice` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `capacity` INTEGER NOT NULL DEFAULT 2;

-- DropTable
DROP TABLE `_roomtypeamenities`;

-- CreateTable
CREATE TABLE `service_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(500) NULL,
    `icon` VARCHAR(255) NULL,
    `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `service_categories_name_key`(`name`),
    UNIQUE INDEX `service_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NULL,
    `image` VARCHAR(500) NULL,
    `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `services_slug_key`(`slug`),
    INDEX `services_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderNumber` VARCHAR(50) NOT NULL,
    `bookingId` INTEGER NULL,
    `roomId` INTEGER NOT NULL,
    `totalAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `status` ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `priority` ENUM('low', 'normal', 'high', 'urgent') NOT NULL DEFAULT 'normal',
    `notes` TEXT NULL,
    `requestedBy` VARCHAR(100) NULL,
    `assignedTo` VARCHAR(100) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `service_orders_orderNumber_key`(`orderNumber`),
    INDEX `service_orders_bookingId_idx`(`bookingId`),
    INDEX `service_orders_roomId_idx`(`roomId`),
    INDEX `service_orders_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_order_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `price` DECIMAL(10, 2) NOT NULL,
    `notes` TEXT NULL,

    INDEX `service_order_items_orderId_idx`(`orderId`),
    INDEX `service_order_items_serviceId_idx`(`serviceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `services` ADD CONSTRAINT `services_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `service_categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_orders` ADD CONSTRAINT `service_orders_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_orders` ADD CONSTRAINT `service_orders_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_order_items` ADD CONSTRAINT `service_order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `service_orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_order_items` ADD CONSTRAINT `service_order_items_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
