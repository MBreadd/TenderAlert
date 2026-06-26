/**
 * Orquestador RAG: genera la FichaRecomendacion accionable de una licitación.
 * Persona C. Llamado desde app/api/ficha/[id].
 */
import type { Empresa, Licitacion, FichaRecomendacion } from "@/lib/types";
import { askClaudeJson } from "./client";
import { fichaSystemPrompt, fichaSchema, fichaUserPrompt } from "./prompts/ficha";

type FichaLLM = Omit<FichaRecomendacion, "licitacionId" | "generadoPor">;

export async function generarFicha(
  empresa: Empresa,
  licitacion: Licitacion,
): Promise<FichaRecomendacion> {
  const data = await askClaudeJson<FichaLLM>({
    system: fichaSystemPrompt,
    user: fichaUserPrompt(empresa, licitacion),
    schema: fichaSchema,
    maxTokens: 2048,
  });

  return {
    licitacionId: licitacion.id,
    resumenEjecutivo: data.resumenEjecutivo,
    compatibilidad: data.compatibilidad,
    planDeAccion: data.planDeAccion,
    generadoPor: "claude",
  };
}
