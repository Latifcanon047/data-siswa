import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const Siswa = await prisma.siswa.findMany({ orderBy: { id: "asc" } });
    return Response.json(Siswa);
  } catch (error) {
    console.error("Detail error:", error);
    return Response.json(
      { error: "gagal mengambil data siswa" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, nis, alamat } = body;
    if (!nama || !nis || !alamat) {
      return Response.json(
        { error: "Nama, NIS, dan Alamat wajib diisi " },
        { status: 422 },
      );
    }

    // Validasi input terlebih dahulu
    // 1. Cek NIS hanya berisi angka
    if (!/^\d+$/.test(nis)) {
      return Response.json(
        { error: "NIS hanya boleh berisi angka" },
        { status: 400 }
      );
    }

    // 2. Cek nama hanya berisi huruf (termasuk spasi untuk nama lengkap)
    if (!/^[a-zA-Z\s]+$/.test(nama)) {
      return Response.json(
        { error: "Nama hanya boleh berisi huruf" },
        { status: 400 }
      );
    }

    // 3. Alamat boleh huruf dan angka, tidak perlu validasi khusus

    // Cek duplikasi hanya berdasarkan NIS
    const existingSiswa = await prisma.siswa.findFirst({
      where: {
        nis: nis  // Hanya cek NIS
      }
    });

    if (existingSiswa) {
      return Response.json(
        { error: "Siswa dengan NIS tersebut sudah terdaftar" },
        { status: 400 }
      );
    }

    // Jika tidak ada duplikasi, lanjutkan proses insert
    const newSiswa = await prisma.siswa.create({
      data: {
        nis,
        nama,
        alamat
      }
    });

    return Response.json(
      { message: "Siswa berhasil ditambahkan", data: newSiswa },
      { status: 201 }
    );

    const SiswaBaru = await prisma.siswa.create({
      data: { nama, nis, alamat },
    });
    return Response.json(SiswaBaru, { status: 201 });
  } catch (error) {
    console.error("Detail error:", error);
    return Response.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 },
    );
  }
}
