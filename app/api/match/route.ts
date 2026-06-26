/**
 * POST /api/match  — calcula oportunidades compatibles para una empresa.
 * 👤 Persona C (scoring) + consume lib/data/seace de Persona B.
 * Body: { empresa: Empresa }  →  ApiResponse<OportunidadCompatible[]>
 */
import { NextResponse } from "next/server";
import type { ApiResponse, Empresa, OportunidadCompatible } from "@/lib/types";
import { fetchLicitaciones } from "@/lib/data/seace";
import { scoreLicitacion } from "@/lib/ai/matching";

export async function POST(request: Request): Promise<NextResponse<ApiResponse<OportunidadCompatible[]>>> {
  try {
    const { empresa } = (await request.json()) as { empresa: Empresa };
    if (!empresa?.ruc) {
      return NextResponse.json({ ok: false, error: "Falta el perfil de empresa" }, { status: 400 });
    }
    const lics = await fetchLicitaciones();
    const data: OportunidadCompatible[] = lics
      .map((lic) => ({ licitacion: lic, match: scoreLicitacion(empresa, lic) }))
      .sort((a, b) => b.match.compatibilidad - a.match.compatibilidad);
    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
