/**
 * GET /api/licitaciones?rubro=limpieza  — lista licitaciones vigentes (OCDS).
 * 👤 Persona B (consume lib/data/seace).
 * →  ApiResponse<Licitacion[]>
 */
import { NextResponse } from "next/server";
import type { ApiResponse, Licitacion } from "@/lib/types";
import { fetchLicitaciones } from "@/lib/data/seace";

export async function GET(request: Request): Promise<NextResponse<ApiResponse<Licitacion[]>>> {
  try {
    const rubro = new URL(request.url).searchParams.get("rubro") ?? undefined;
    const data = await fetchLicitaciones(rubro);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
