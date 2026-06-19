import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { nilai } = body;

    if (!nilai) {
      return Response.json(
        { error: "nilai tidak boleh kosong" },
        { status: 400 },
      );
    }

    const nilaiBaru = await prisma.nilai.update({
      where: {
        id: parseInt(id),
      },
      data: {
        nilai: nilai,
      },
    });

    return Response.json(nilaiBaru, { status: 200 });
  } catch (error) {
    return Response.json(
      { error: "Gagal memperbarui nilai siswa" },
      { status: 500 },
    );
  }
}
