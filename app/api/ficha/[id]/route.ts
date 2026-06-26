/**
 * POST /api/ficha/[id]  — genera la ficha de recomendación (RAG) de una licitación.
 * 👤 Persona C (consume lib/ai/rag) + lib/data/seace de Persona B.
 * Body: { empresa: Empresa }  →  ApiResponse<FichaRecomendacion>
 *
 * Nota Next 16: en route handlers dinámicos, `params` es una Promise.
 */
import { NextResponse } from "next/server";
import type { ApiResponse, Empresa, FichaRecomendacion } from "@/lib/types";
import { fetchLicitacion } from "@/lib/data/seace";
import { generarFicha } from "@/lib/ai/rag";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse<FichaRecomendacion>>> {
  try {
    const { id } = await params;
    const { empresa } = (await request.json()) as { empresa: Empresa };
    const licitacion = await fetchLicitacion(id);
    if (!licitacion) {
      return NextResponse.json({ ok: false, error: "Licitación no encontrada" }, { status: 404 });
    }
    const ficha = await generarFicha(empresa, licitacion);
    return NextResponse.json({ ok: true, data: ficha });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
