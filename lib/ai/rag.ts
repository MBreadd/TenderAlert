/**
 * Orquestador RAG: genera la FichaRecomendacion accionable de una licitación.
 * Persona C. Llamado desde app/api/ficha/[id].
 *
 * Estrategia anti-caída (igual que lib/data/latinfo y lib/data/seace): si no hay
 * ANTHROPIC_API_KEY o Claude falla, cae a una ficha sintetizada con el heurístico
 * de matching para que el demo nunca dependa de la API.
 */
import type { Empresa, Licitacion, FichaRecomendacion, ChecklistItem } from "@/lib/types";
import { askClaudeJson } from "./client";
import { scoreLicitacion } from "./matching";
import { fichaSystemPrompt, fichaSchema, fichaUserPrompt } from "./prompts/ficha";

type FichaLLM = Omit<FichaRecomendacion, "licitacionId" | "generadoPor">;

/** Ficha determinística sin IA: resumen + plan a partir de la licitación y el heurístico. */
function fichaFallback(empresa: Empresa, licitacion: Licitacion): FichaRecomendacion {
  const { compatibilidad, alertas } = scoreLicitacion(empresa, licitacion);

  const cierre = licitacion.fechaLimite
    ? new Date(licitacion.fechaLimite).toLocaleDateString("es-PE")
    : "fecha por confirmar";
  const monto = `S/ ${licitacion.montoEstimado.toLocaleString("es-PE")}`;
  const resumenEjecutivo =
    `${licitacion.entidad} busca "${licitacion.objeto}" por ${monto}. ` +
    `Compatibilidad estimada con tu perfil: ${compatibilidad}/100. ` +
    `Cierra el ${cierre}.`;

  // Plan de acción: requisitos de las bases + pasos estándar.
  const planDeAccion: ChecklistItem[] = [
    {
      id: "rnp",
      texto: "Confirmar RNP vigente",
      obligatorio: true,
      cumplido: empresa.rnpVigente,
    },
    ...(licitacion.requisitos ?? []).map((req, i) => ({
      id: `req-${i}`,
      texto: req,
      obligatorio: true,
      cumplido: false,
    })),
    {
      id: "bases",
      texto: "Descargar y revisar el pliego de bases",
      obligatorio: false,
      cumplido: false,
      nota: alertas[0],
    },
  ];

  return {
    licitacionId: licitacion.id,
    resumenEjecutivo,
    compatibilidad,
    planDeAccion,
    generadoPor: "mock",
  };
}

export async function generarFicha(
  empresa: Empresa,
  licitacion: Licitacion,
): Promise<FichaRecomendacion> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[rag] sin ANTHROPIC_API_KEY — ficha sintetizada (fallback)");
    return fichaFallback(empresa, licitacion);
  }

  try {
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
  } catch (err) {
    console.error("[rag] Claude falló, usando ficha sintetizada:", err);
    return fichaFallback(empresa, licitacion);
  }
}
