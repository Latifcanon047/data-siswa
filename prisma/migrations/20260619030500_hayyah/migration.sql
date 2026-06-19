/*
  Warnings:

  - Added the required column `kelasId` to the `Siswa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `kelas` MODIFY `waliKelas` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `siswa` ADD COLUMN `kelasId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Siswa` ADD CONSTRAINT `Siswa_kelasId_fkey` FOREIGN KEY (`kelasId`) REFERENCES `Kelas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
