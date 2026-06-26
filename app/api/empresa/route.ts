/**
 * POST /api/empresa  — onboarding paso 1: dado un RUC, autocompleta datos oficiales.
 * 👤 Persona B (consume lib/data/latinfo).
 * Body: { ruc: string }  →  ApiResponse<Empresa>
 */
import { NextResponse } from "next/server";
import type { ApiResponse, Empresa } from "@/lib/types";
import { lookupEmpresaByRuc } from "@/lib/data/latinfo";

export async function POST(request: Request): Promise<NextResponse<ApiResponse<Empresa>>> {
  try {
    const { ruc } = (await request.json()) as { ruc?: string };
    if (!ruc || !/^\d{11}$/.test(ruc)) {
      return NextResponse.json({ ok: false, error: "RUC inválido (11 dígitos)" }, { status: 400 });
    }
    const empresa = await lookupEmpresaByRuc(ruc);
    return NextResponse.json({ ok: true, data: empresa });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 },
    );
  }
}
