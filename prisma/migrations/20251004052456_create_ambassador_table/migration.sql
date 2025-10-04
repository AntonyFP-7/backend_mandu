-- CreateTable
CREATE TABLE `Ambassador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Division` ADD CONSTRAINT `Division_ambassadorId_fkey` FOREIGN KEY (`ambassadorId`) REFERENCES `Ambassador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
