/**
 * Scoring de compatibilidad empresa ↔ licitación.
 * Persona C. Empieza con un heurístico simple (rápido, sin costo de IA) y, si hay
 * tiempo, refínalo con Claude para los casos borde (falsos positivos de rubro).
 */
import type { Empresa, Licitacion, MatchResult } from "@/lib/types";

/** Heurístico base: rubro + ubicación + RNP. Determinístico y gratis. */
export function scoreLicitacion(empresa: Empresa, lic: Licitacion): MatchResult {
  const motivos: string[] = [];
  const alertas: string[] = [];
  let score = 0;

  const rubroMatch = empresa.rubros.some((r) => lic.rubro.toLowerCase().includes(r));
  if (rubroMatch) {
    score += 60;
    motivos.push(`Rubro ${lic.rubro} coincide con tu perfil`);
  } else {
    alertas.push(`Rubro ${lic.rubro} no está en tu perfil`);
  }

  if (empresa.ubicacion && lic.ubicacion.includes(empresa.ubicacion)) {
    score += 20;
    motivos.push(`Ubicación ${lic.ubicacion}`);
  }

  if (empresa.rnpVigente) {
    score += 20;
    motivos.push("RNP vigente");
  } else {
    alertas.push("RNP no vigente: regularízalo antes de postular");
  }

  return {
    licitacionId: lic.id,
    compatibilidad: Math.min(score, 100),
    motivos,
    alertas,
  };
}

/** Aplica el scoring a una lista y la ordena de mayor a menor compatibilidad. */
export function rankLicitaciones(empresa: Empresa, lics: Licitacion[]): MatchResult[] {
  return lics
    .map((l) => scoreLicitacion(empresa, l))
    .sort((a, b) => b.compatibilidad - a.compatibilidad);
}
