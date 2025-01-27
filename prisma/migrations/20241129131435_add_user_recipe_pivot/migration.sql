-- Create the userRecipes table
CREATE TABLE `userRecipes` (
    `userId` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,  -- Match Prisma's default datetime behavior
    PRIMARY KEY (`userId`, `recipeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraint for userId
ALTER TABLE `userRecipes` 
ADD CONSTRAINT `userRecipes_userId_fkey` 
FOREIGN KEY (`userId`) 
REFERENCES `users`(`id`) 
ON DELETE RESTRICT 
ON UPDATE CASCADE;

-- Add foreign key constraint for recipeId
ALTER TABLE `userRecipes` 
ADD CONSTRAINT `userRecipes_recipeId_fkey` 
FOREIGN KEY (`recipeId`) 
REFERENCES `recipes`(`id`) 
ON DELETE RESTRICT 
ON UPDATE CASCADE;
