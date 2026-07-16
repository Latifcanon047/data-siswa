import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil 1 siswa berdasarkan ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const Siswa = await prisma.siswa.findUnique({ where: { id: Number(id) } });

    if (!Siswa)
      return Response.json({ error: "Tidak ditemukan" }, { status: 404 });
    return Response.json(Siswa);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "internal server error" }, { status: 500 });
  }
}

// PUT: Update data siswa berdasarkan ID
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nama, nis, alamat } = body;

    // Validasi: semua field harus diisi
    if (!nama || !nis || !alamat) {
      return NextResponse.json(
        { error: "nama, nis, dan alamat wajib diisi" },
        { status: 400 },
      );
    }

    // Validasi: NIS hanya boleh angka, minimal 4 digit maksimal 10 digit
    // Umumnya NIS itu 4-10 digit (contoh: 1234, 20240001)
    if (!/^\d{4,10}$/.test(nis)) {
      return NextResponse.json(
        { error: "NIS harus berisi 4-10 digit angka" },
        { status: 400 },
      );
    }

    // Validasi: Nama hanya boleh huruf dan spasi
    if (!/^[a-zA-Z\s]+$/.test(nama)) {
      return NextResponse.json(
        { error: "Nama hanya boleh berisi huruf" },
        { status: 400 },
      );
    }

    // Validasi: Alamat hanya boleh huruf, angka, spasi, titik, koma, dan strip
    // Contoh: "Jl. Merdeka No. 123, Jakarta-Pusat"
    if (!/^[a-zA-Z0-9\s.,\-]+$/.test(alamat)) {
      return NextResponse.json(
        { error: "Alamat hanya boleh berisi huruf, angka, spasi, titik, koma, dan strip" },
        { status: 400 },
      );
    }

    // Cek NIS sudah dipakai siswa lain atau belum
    const nisExist = await prisma.siswa.findFirst({
      where: {
        nis: nis,
        NOT: { id: Number(id) } // kecuali dirinya sendiri
      }
    });

    if (nisExist) {
      return NextResponse.json(
        { error: "NIS sudah digunakan oleh siswa lain" },
        { status: 400 },
      );
    }

    // Simpan perubahan ke database
    const updatedSiswa = await prisma.siswa.update({
      where: { id: Number(id) },
      data: { nama, nis, alamat }
    });

    return NextResponse.json(
      { message: "Data berhasil diubah", data: updatedSiswa },
      { status: 200 },
    );
  } catch (error) {
    console.error("Detail error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server",
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// DELETE: Hapus siswa berdasarkan ID
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    
    // Cek dulu apakah data ada
    const siswa = await prisma.siswa.findUnique({ where: { id: Number(id) } });
    
    if (!siswa) {
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 },
      );
    }
    
    // Hapus data
    await prisma.siswa.delete({ where: { id: Number(id) } });

    return NextResponse.json(
      { message: "Siswa berhasil dihapus" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Detail error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus siswa atau data tidak di temukan" },
      { status: 500 },
    );
  }
}