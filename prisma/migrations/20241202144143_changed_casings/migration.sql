/*
  Warnings:

  - You are about to drop the `_recipeIngredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_userRecipes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `aiResponses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modificationResponses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipeIngredients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recipeModifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_recipeIngredients` DROP FOREIGN KEY `_recipeIngredients_a_fkey`;

-- DropForeignKey
ALTER TABLE `_recipeIngredients` DROP FOREIGN KEY `_recipeIngredients_b_fkey`;

-- DropForeignKey
ALTER TABLE `_userRecipes` DROP FOREIGN KEY `_userRecipes_a_fkey`;

-- DropForeignKey
ALTER TABLE `_userRecipes` DROP FOREIGN KEY `_userRecipes_b_fkey`;

-- DropForeignKey
ALTER TABLE `aiResponses` DROP FOREIGN KEY `aiResponse_userPromptId_fkey`;

-- DropForeignKey
ALTER TABLE `instructions` DROP FOREIGN KEY `instruction_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `modificationResponses` DROP FOREIGN KEY `modificationResponse_aiResponseId_fkey`;

-- DropForeignKey
ALTER TABLE `modificationResponses` DROP FOREIGN KEY `modificationResponse_modificationId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeIngredients` DROP FOREIGN KEY `recipeIngredient_ingredientId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeIngredients` DROP FOREIGN KEY `recipeIngredient_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeModifications` DROP FOREIGN KEY `recipeModification_recipeId_fkey`;

-- DropForeignKey
ALTER TABLE `recipeModifications` DROP FOREIGN KEY `recipeModification_userPromptId_fkey`;

-- DropForeignKey
ALTER TABLE `recipes` DROP FOREIGN KEY `recipe_aiResponseId_fkey`;

-- DropForeignKey
ALTER TABLE `userPrompts` DROP FOREIGN KEY `userPrompt_userId_fkey`;

-- AlterTable
ALTER TABLE `userRecipes` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `_recipeIngredients`;

-- DropTable
DROP TABLE `_userRecipes`;

-- DropTable
DROP TABLE `aiResponses`;

-- DropTable
DROP TABLE `modificationResponses`;

-- DropTable
DROP TABLE `recipeIngredients`;

-- DropTable
DROP TABLE `recipeModifications`;

-- CreateTable
CREATE TABLE `ai_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userPromptId` INTEGER NOT NULL,
    `response` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `ai_responses_userPromptId_key`(`userPromptId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipe_ingredients` (
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
CREATE TABLE `recipe_modifications` (
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
CREATE TABLE `modification_responses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aiResponseId` INTEGER NOT NULL,
    `modificationId` INTEGER NOT NULL,
    `appliedToRecipe` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserRecipes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserRecipes_AB_unique`(`A`, `B`),
    INDEX `_UserRecipes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RecipeIngredients` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RecipeIngredients_AB_unique`(`A`, `B`),
    INDEX `_RecipeIngredients_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `userPrompts` ADD CONSTRAINT `userPrompts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ai_responses` ADD CONSTRAINT `ai_responses_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `userPrompts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `ai_responses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_ingredients` ADD CONSTRAINT `recipe_ingredients_ingredientId_fkey` FOREIGN KEY (`ingredientId`) REFERENCES `ingredients`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `instructions` ADD CONSTRAINT `instructions_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_modifications` ADD CONSTRAINT `recipe_modifications_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `recipes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipe_modifications` ADD CONSTRAINT `recipe_modifications_userPromptId_fkey` FOREIGN KEY (`userPromptId`) REFERENCES `userPrompts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modification_responses` ADD CONSTRAINT `modification_responses_aiResponseId_fkey` FOREIGN KEY (`aiResponseId`) REFERENCES `ai_responses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `modification_responses` ADD CONSTRAINT `modification_responses_modificationId_fkey` FOREIGN KEY (`modificationId`) REFERENCES `recipe_modifications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRecipes` ADD CONSTRAINT `_UserRecipes_A_fkey` FOREIGN KEY (`A`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserRecipes` ADD CONSTRAINT `_UserRecipes_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipeIngredients` ADD CONSTRAINT `_RecipeIngredients_A_fkey` FOREIGN KEY (`A`) REFERENCES `ingredients`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RecipeIngredients` ADD CONSTRAINT `_RecipeIngredients_B_fkey` FOREIGN KEY (`B`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `user_email_key` TO `users_email_key`;
