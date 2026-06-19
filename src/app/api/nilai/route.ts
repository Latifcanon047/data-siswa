import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const kelasId = Number(searchParams.get("kelasId"));
    const mapelId = Number(searchParams.get("mapelId"));

    if (!kelasId || !mapelId) {
      return Response.json(
        { error: "kelasId dan mapelId wajib diisi" },
        { status: 400 },
      );
    }

    const siswa = await prisma.siswa.findMany({
      where: {
        kelasId: kelasId ? kelasId : undefined,
      },
      orderBy: { nama: "asc" },
      include: {
        nilais: {
          where: { mapelId },
          select: { id: true, nilai: true },
        },
      },
    });

    const result = siswa.map((s) => ({
      siswaId: s.id,
      nama: s.nama,
      nis: s.nis,
      nilaiId: s.nilais[0]?.id,
      nilai: s.nilais[0]?.nilai ?? null,
    }));

    console.log(result);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: "gagal memuat data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { siswaId, kelasId, mapelId, nilai } = body;

    if (!siswaId || !kelasId || !mapelId || !nilai) {
      return Response.json(
        { error: "Semua kolom wajib di isi" },
        { status: 400 },
      );
    }

    //jaga jaga bisingan frontend na tunduh
    const duplicate = await prisma.nilai.findFirst({
      where: {
        siswaId: siswaId,
        kelasId: kelasId,
      },
    });

    if (duplicate) {
      return Response.json({ error: "nilai sudah ada" }, { status: 400 });
    }

    const newNilai = await prisma.nilai.create({
      data: {
        siswaId: parseInt(siswaId),
        kelasId: parseInt(kelasId),
        mapelId: parseInt(mapelId),
        nilai: parseInt(nilai),
      },
    });

    return Response.json(newNilai, { status: 201 });
  } catch (error) {
    return Response.json({ error: "gagal mengupdate data" }, { status: 500 });
  }
}
