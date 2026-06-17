import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { error } from "console";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const kelasId = searchParams.get("kelasId");
    const mapelId = searchParams.get("mapelId");

    const daftarNilai = await prisma.nilai.findMany({
      where: {
        kelasId: kelasId ? parseInt(kelasId) : undefined,
        mapelId: mapelId ? parseInt(mapelId) : undefined,
      },
      include: {
        siswa: true,
        kelas: true,
        mapel: true,
      },
    });

    return Response.json(daftarNilai);
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
