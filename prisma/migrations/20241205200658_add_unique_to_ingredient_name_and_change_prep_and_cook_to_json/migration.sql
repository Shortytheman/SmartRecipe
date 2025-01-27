/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ingredients` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `prep` on the `recipes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `cook` on the `recipes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `recipes` DROP COLUMN `prep`,
    ADD COLUMN `prep` JSON NOT NULL,
    DROP COLUMN `cook`,
    ADD COLUMN `cook` JSON NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ingredients_name_key` ON `ingredients`(`name`);
