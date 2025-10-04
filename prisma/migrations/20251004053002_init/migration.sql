-- AlterTable
ALTER TABLE `division` ADD COLUMN `parentId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Division` ADD CONSTRAINT `Division_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
