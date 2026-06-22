/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `guests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `rooms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `service_orders` DROP FOREIGN KEY `service_orders_roomId_fkey`;

-- AlterTable
ALTER TABLE `facilities` ADD COLUMN `plannedUpgrade` TEXT NULL;

-- AlterTable
ALTER TABLE `guests` ADD COLUMN `googleId` VARCHAR(255) NULL,
    ADD COLUMN `idProofImage` VARCHAR(500) NULL,
    ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `otp` VARCHAR(10) NULL,
    ADD COLUMN `otpExpires` DATETIME(3) NULL,
    ADD COLUMN `password` VARCHAR(255) NULL,
    ADD COLUMN `profileImage` VARCHAR(500) NULL,
    ADD COLUMN `resetToken` VARCHAR(255) NULL,
    ADD COLUMN `resetTokenExpires` DATETIME(3) NULL,
    MODIFY `phone` VARCHAR(20) NULL,
    MODIFY `idType` ENUM('passport', 'driving_license', 'national_id', 'citizenship', 'other') NULL DEFAULT 'passport';

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `serviceOrderId` INTEGER NULL,
    MODIFY `bookingId` INTEGER NULL;

-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `proofImage` VARCHAR(500) NULL;

-- AlterTable
ALTER TABLE `rooms` ADD COLUMN `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `slug` VARCHAR(150) NOT NULL;

-- AlterTable
ALTER TABLE `service_orders` ADD COLUMN `guestId` INTEGER NULL,
    MODIFY `roomId` INTEGER NULL;

-- CreateTable
CREATE TABLE `extra_services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `image` VARCHAR(500) NULL,
    `discountPercentage` DOUBLE NOT NULL DEFAULT 0,
    `discountAllowed` BOOLEAN NOT NULL DEFAULT false,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `booking_extra_services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `extraServiceId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` DECIMAL(10, 2) NOT NULL,
    `basePrice` DECIMAL(10, 2) NOT NULL,
    `discountAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `serviceChargeAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `totalPrice` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `booking_extra_services_bookingId_idx`(`bookingId`),
    INDEX `booking_extra_services_extraServiceId_idx`(`extraServiceId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `app_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(100) NOT NULL,
    `value` TEXT NOT NULL,
    `description` TEXT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `app_settings_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phoneNumber` VARCHAR(20) NULL,
    `avatar` TEXT NULL,
    `role` ENUM('superadmin', 'admin', 'manager', 'front_office', 'housekeeping') NOT NULL DEFAULT 'admin',
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `mustChangePassword` BOOLEAN NOT NULL DEFAULT false,
    `lastLogin` DATETIME(3) NULL,
    `loginAttempts` INTEGER NOT NULL DEFAULT 0,
    `lockedUntil` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `housekeeping_staff` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `staffId` VARCHAR(50) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'on_duty',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `housekeeping_staff_staffId_key`(`staffId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `guests_googleId_key` ON `guests`(`googleId`);

-- CreateIndex
CREATE INDEX `payments_serviceOrderId_idx` ON `payments`(`serviceOrderId`);

-- CreateIndex
CREATE UNIQUE INDEX `rooms_slug_key` ON `rooms`(`slug`);

-- CreateIndex
CREATE INDEX `rooms_isFeatured_idx` ON `rooms`(`isFeatured`);

-- CreateIndex
CREATE INDEX `service_orders_guestId_idx` ON `service_orders`(`guestId`);

-- AddForeignKey
ALTER TABLE `extra_services` ADD CONSTRAINT `extra_services_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `service_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_extra_services` ADD CONSTRAINT `booking_extra_services_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `booking_extra_services` ADD CONSTRAINT `booking_extra_services_extraServiceId_fkey` FOREIGN KEY (`extraServiceId`) REFERENCES `extra_services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_serviceOrderId_fkey` FOREIGN KEY (`serviceOrderId`) REFERENCES `service_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_orders` ADD CONSTRAINT `service_orders_guestId_fkey` FOREIGN KEY (`guestId`) REFERENCES `guests`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `service_orders` ADD CONSTRAINT `service_orders_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
