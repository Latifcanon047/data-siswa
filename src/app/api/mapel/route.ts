import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest) {
  try {
    const mapel = await prisma.mataPelajaran.findMany({
      orderBy: { namaMapel: "asc" },
    });
    return Response.json(mapel, { status: 200 });
  } catch (error) {
    return Response.json(error, { status: 500 });
  }
}
