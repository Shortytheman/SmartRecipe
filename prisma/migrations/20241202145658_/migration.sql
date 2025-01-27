/*
  Warnings:

  - You are about to drop the `ai_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modification_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_ingredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipe_modifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ai_responses` DROP FOREIGN KEY `ai_responses_userPromptId_fkey`;

-- DropForeignKey
ALTER TABLE `modification_responses` DROP FOREIGN KEY `modification_responses_aiResponseId_fkey`;

-- DropForeignKey
ALTER TABLE `modification_responses` DROP FOREIGN KEY `modification_responses_modificationId_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_ingredients` DROP FOREIGN KEY `recipe_ingredients_ingredientId_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_ingredients` DROP FOREIGN KEY `recipe_ingredients_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_modifications` DROP FOREIGN KEY `recipe_modifications_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipe_modifications` DROP FOREIGN KEY `recipe_modifications_userPromptId_fkey`;

-- DropForeignKey
ALTER TABLE `recipes` DROP FOREIGN KEY `recipes_aiResponseId_fkey`;

-- DropTable
DROP TABLE `ai_responses`;

-- DropTable
DROP TABLE `modification_responses`;

-- DropTable
DROP TABLE `recipe_ingredients`;

-- DropTable
DROP TABLE `recipe_modifications`;

-- CreateTable
CREATE TABLE `aiResponses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userPromptId` INTEGER NOT NULL,
    `response` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `aiResponses_userPromptId_key`(`userPromptId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipeIngredients` (
    `recipeId` INTEGER NOT NULL,
    `ingredientId` INTEGER NOT NULL,
    `value` DOUBLE NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`recipeId`, `ingredientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipeModifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `recipeId` INTEGER NOT NULL,
    `userPromptId` INTEGER NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modificationResponses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aiResponseId` INTEGER NOT NULL,
    `modificationId` INTEGER NOT NULL,
    `appliedToRecipe` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `aiResponses` ADD CONSTRAINT `aiResponses_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `userPrompts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `aiResponses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipeIngredients` ADD CONSTRAINT `recipeIngredients_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipeIngredients` ADD CONSTRAINT `recipeIngredients_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipeModifications` ADD CONSTRAINT `recipeModifications_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipeModifications` ADD CONSTRAINT `recipeModifications_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `userPrompts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modificationResponses` ADD CONSTRAINT `modificationResponses_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `aiResponses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modificationResponses` ADD CONSTRAINT `modificationResponses_modificationId_fkey` FOREIGN KEY (`modificationId`) REFERENCES `recipeModifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
