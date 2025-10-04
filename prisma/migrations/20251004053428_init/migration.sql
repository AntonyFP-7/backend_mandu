-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(45) NOT NULL,
    `lastName` VARCHAR(45) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `divisionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employee` ADD CONSTRAINT `Employee_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
