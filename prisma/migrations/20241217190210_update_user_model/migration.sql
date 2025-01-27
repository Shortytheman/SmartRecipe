-- AlterTable
ALTER TABLE `users` ADD COLUMN `oauthId` VARCHAR(191) NULL,
    ADD COLUMN `oauthProvider` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(191) NULL;
