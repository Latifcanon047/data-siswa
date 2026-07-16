import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil semua data siswa (diurutkan dari ID terkecil)
export async function GET() {
  try {
    const Siswa = await prisma.siswa.findMany({ 
      orderBy: { id: "asc" } // Urutkan ID: 1, 2, 3, ...
    });
    
    return Response.json(Siswa); // Kirim data ke frontend
    
  } catch (error) {
    console.error("Detail error:", error);
    return Response.json(
      { error: "Gagal mengambil data siswa" },
      { status: 500 } // Server error
    );
  }
}

// POST: Tambah siswa baru
// Aturan: HANYA NIS yang harus unik (tidak boleh duplikat)
//         Nama dan alamat BOLEH sama dengan siswa lain
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nama, nis, alamat } = body;
    
    // Cek semua field harus diisi
    if (!nama || !nis || !alamat) {
      return Response.json(
        { error: "Nama, NIS, dan Alamat wajib diisi" },
        { status: 422 } // Data tidak lengkap
      );
    }

    // Cek NIS: 4-10 digit angka (umumnya NIS 4-10 digit)
    // Contoh benar: "1234", "20240001"
    // Contoh salah: "123", "ABC", "12AB"
    if (!/^\d{4,10}$/.test(nis)) {
      return Response.json(
        { error: "NIS harus berisi 4-10 digit angka" },
        { status: 400 } // Format salah
      );
    }

    // Cek nama: hanya huruf dan spasi
    // Contoh benar: "Budi Santoso"
    // Contoh salah: "Bud1", "Budi_"
    if (!/^[a-zA-Z\s]+$/.test(nama)) {
      return Response.json(
        { error: "Nama hanya boleh berisi huruf" },
        { status: 400 } // Format salah
      );
    }

    // Cek alamat: hanya huruf, angka, spasi, titik, koma, dan strip
    // Contoh benar: "Jl. Merdeka No. 123, Jakarta"
    // Contoh salah: "Jl. Merdeka #123"
    if (!/^[a-zA-Z0-9\s.,\-]+$/.test(alamat)) {
      return Response.json(
        { error: "Alamat hanya boleh berisi huruf, angka, spasi, titik, koma, dan strip" },
        { status: 400 } // Format salah
      );
    }

    // Cek apakah NIS sudah terdaftar di database
    const existingSiswa = await prisma.siswa.findFirst({
      where: { nis: nis } // Cari NIS yang sama persis
    });

    // Kalau NIS sudah ada, tolak! (nama & alamat tidak dicek karena boleh sama)
    if (existingSiswa) {
      return Response.json(
        { error: "Siswa dengan NIS tersebut sudah terdaftar" },
        { status: 400 } // Data duplikat
      );
    }

    // Simpan data baru ke database
    const SiswaBaru = await prisma.siswa.create({
      data: { nama, nis, alamat }
    });
    
    return Response.json(SiswaBaru, { status: 201 }); // 201 = Berhasil dibuat
    
  } catch (error) {
    console.error("Detail error:", error);
    return Response.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 } // Server error
    );
  }
}