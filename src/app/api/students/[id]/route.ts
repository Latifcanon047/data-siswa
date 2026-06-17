import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nama, nis, alamat } = body;

    if (!nama || !nis || !alamat) {
      return NextResponse.json(
        { error: "nama, nis, dan alamat wajib diisi" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Data berhasil diubah", data: { id, nama, nis, alamat } },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Terjadi kesalahan pada server",
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
