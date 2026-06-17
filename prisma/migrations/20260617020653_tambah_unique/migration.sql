/*
  Warnings:

  - A unique constraint covering the columns `[kodeMapel]` on the table `MataPelajaran` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[siswaId,mapelId]` on the table `Nilai` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nis]` on the table `Siswa` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `MataPelajaran_kodeMapel_key` ON `MataPelajaran`(`kodeMapel`);

-- CreateIndex
CREATE UNIQUE INDEX `Nilai_siswaId_mapelId_key` ON `Nilai`(`siswaId`, `mapelId`);

-- CreateIndex
CREATE UNIQUE INDEX `Siswa_nis_key` ON `Siswa`(`nis`);
