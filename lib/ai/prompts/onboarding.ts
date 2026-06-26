/**
 * Prompts del chat de onboarding (3 preguntas para afinar el rubro).
 * Persona C es dueña de este archivo. Itéralo libremente: es donde vive
 * la "personalidad" del asistente y la calidad del wow-moment.
 */
import type { Empresa, ChatMessage } from "@/lib/types";

export function onboardingSystemPrompt(empresa: Partial<Empresa>): string {
  return `Eres el asistente de onboarding de TenderAlert, una plataforma que conecta
PYMEs peruanas con licitaciones del Estado (SEACE).

Datos oficiales ya cargados de la empresa (vía SUNAT/OSCE):
- Razón social: ${empresa.razonSocial ?? "(desconocida)"}
- RUC: ${empresa.ruc ?? "(desconocido)"}
- Capítulos RNP: ${(empresa.capituloRnp ?? []).join(", ") || "(ninguno)"}

Tu objetivo: en MÁXIMO 3 preguntas cortas y amables, precisar el rubro/especialidad
real del negocio (ej: "limpieza de oficinas", "seguridad y vigilancia", "soporte TI").
Haz UNA pregunta a la vez. Cuando tengas suficiente para clasificar el rubro,
marca done=true y devuelve los rubros normalizados en minúscula y singular.`;
}

/** JSON schema que debe cumplir la respuesta del chat (structured output). */
export const onboardingResponseSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reply: { type: "string" },
    done: { type: "boolean" },
    rubros: { type: "array", items: { type: "string" } },
    especialidad: { type: "string" },
  },
  required: ["reply", "done", "rubros", "especialidad"],
};

export function onboardingUserPrompt(history: ChatMessage[]): string {
  return history.map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content}`).join("\n");
}
