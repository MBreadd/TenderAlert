/**
 * GET /api/licitaciones?rubro=limpieza  — lista licitaciones vigentes (OCDS).
 * 👤 Persona B (consume lib/data/seace).
 * →  ApiResponse<Licitacion[]>
 */
import { NextResponse } from "next/server";
import type { ApiResponse, Licitacion } from "@/lib/types";
import { fetchLicitaciones, fetchLicitacion } from "@/lib/data/seace";

export async function GET(request: Request): Promise<NextResponse<ApiResponse<Licitacion[] | Licitacion>>> {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (id) {
      const lic = await fetchLicitacion(id);
      if (!lic) {
        return NextResponse.json({ ok: false, error: "Licitación no encontrada" }, { status: 404 }) as any;
      }
      return NextResponse.json({ ok: true, data: lic }) as any;
    }
    const rubro = url.searchParams.get("rubro") ?? undefined;
    const data = await fetchLicitaciones(rubro);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

