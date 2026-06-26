/**
 * POST /api/match  — calcula oportunidades compatibles para una empresa.
 * 👤 Persona C (scoring) + consume lib/data/seace de Persona B.
 * Body: { empresa: Empresa }  →  ApiResponse<OportunidadCompatible[]>
 */
import { NextResponse } from "next/server";
import type { ApiResponse, Empresa, OportunidadCompatible } from "@/lib/types";
import { fetchLicitaciones, fetchLicitacionesRecomendadas, getCachedScore } from "@/lib/data/seace";
import { scoreLicitacion } from "@/lib/ai/matching";

export async function POST(request: Request): Promise<NextResponse<ApiResponse<OportunidadCompatible[]>>> {
  try {
    const { empresa } = (await request.json()) as { empresa: Empresa };
    if (!empresa?.ruc) {
      return NextResponse.json({ ok: false, error: "Falta el perfil de empresa" }, { status: 400 });
    }

    // Intentar obtener recomendaciones oficiales desde la API de Latinfo
    let lics = await fetchLicitacionesRecomendadas(empresa.ruc);
    let usingRealRecos = lics.length > 0;

    // Si la API no devolvió recomendaciones reales (ej. no configurado o sin recos para ese RUC),
    // caemos al fallback de listado general de licitaciones (con mocks)
    if (!usingRealRecos) {
      lics = await fetchLicitaciones();
    }

    const data: OportunidadCompatible[] = lics
      .map((lic) => {
        const match = scoreLicitacion(empresa, lic);
        
        // Si usamos las recomendaciones de la API real, sobreescribimos la compatibilidad con el score del API (0.00 - 1.00)
        if (usingRealRecos) {
          const apiScore = getCachedScore(lic.id);
          if (apiScore !== undefined) {
            match.compatibilidad = Math.round(apiScore * 100);
          }
        }
        
        return { licitacion: lic, match };
      })
      .sort((a, b) => b.match.compatibilidad - a.match.compatibilidad);

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}

