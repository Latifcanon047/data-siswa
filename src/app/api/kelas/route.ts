import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const kelas = await prisma.kelas.findMany({
      orderBy: { namaKelas: "asc" },
    });
    return Response.json(kelas, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
