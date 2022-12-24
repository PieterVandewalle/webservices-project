/*
  Warnings:

  - Added the required column `blobName` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blobName` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `blobName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Image` ADD COLUMN `blobName` VARCHAR(191) NOT NULL;
