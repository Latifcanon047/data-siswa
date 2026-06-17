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

    const existingSiswa = await prisma.siswa.findFirst({
      where: {
        nama: nama,
        nis: nis,
        alamat: alamat,
      },
    });

    if (existingSiswa) {
      return Response.json(
        { error: "Siswa dengan nama, nis, dan alamat sudah ada" },
        { status: 400 },
      );
    }

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
