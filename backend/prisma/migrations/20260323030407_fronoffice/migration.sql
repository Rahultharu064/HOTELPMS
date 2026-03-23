-- CreateTable
CREATE TABLE `housekeeping_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roomId` INTEGER NOT NULL,
    `staffId` VARCHAR(100) NULL,
    `type` ENUM('general', 'deep_clean', 'inspection', 'maintenance', 'turn_down') NOT NULL DEFAULT 'general',
    `status` VARCHAR(50) NOT NULL,
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `housekeeping_logs_roomId_idx`(`roomId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `housekeeping_logs` ADD CONSTRAINT `housekeeping_logs_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
