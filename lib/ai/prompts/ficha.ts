/**
 * Prompts del motor RAG: a partir de UNA licitación (JSON OCDS) + el perfil de la
 * empresa, genera el resumen ejecutivo de 3 líneas y el checklist de plan de acción.
 * Persona C es dueña de este archivo.
 */
import type { Empresa, Licitacion } from "@/lib/types";

export const fichaSystemPrompt = `Eres un analista experto en contrataciones del Estado peruano (SEACE/OSCE).
Recibes los datos estructurados de UNA licitación y el perfil de una PYME.
Tu trabajo: traducir el pliego burocrático en una ficha accionable.

Reglas:
- resumenEjecutivo: máximo 3 líneas, lenguaje claro, incluye Entidad, Monto y fecha límite.
- compatibilidad: entero 0-100 según qué tan bien encaja el rubro/requisitos con la empresa.
- planDeAccion: pasos CONCRETOS para postular (anexos, RNP, certificaciones). Marca
  cumplido=true solo si el perfil de la empresa ya satisface el requisito.
- No inventes requisitos que no estén en los datos. No alteres montos ni fechas.`;

/** JSON schema de la ficha (debe coincidir con FichaRecomendacion de lib/types). */
export const fichaSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resumenEjecutivo: { type: "string" },
    compatibilidad: { type: "integer" },
    planDeAccion: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          texto: { type: "string" },
          obligatorio: { type: "boolean" },
          cumplido: { type: "boolean" },
          nota: { type: "string" },
        },
        required: ["id", "texto", "obligatorio", "cumplido"],
      },
    },
  },
  required: ["resumenEjecutivo", "compatibilidad", "planDeAccion"],
};

export function fichaUserPrompt(empresa: Empresa, licitacion: Licitacion): string {
  return `PERFIL EMPRESA:\n${JSON.stringify(empresa, null, 2)}\n\nLICITACIÓN (OCDS):\n${JSON.stringify(licitacion, null, 2)}`;
}
